#coding: utf-8
"""
Database API
"""
import time, os, urllib
from utils import safestr, safeunicode, threadeddict, storage, iters

__all__ = ['UnknowDB', 'UnknowParamstyle', 'SQLParam', 'sqlparam', 'SQLQuery', 'sqlquery',
	    'SQLLiteral', 'MySQLDB', 'sqlify', 'sqllist']


try:
    import datetime
except ImportError:
    datetime = None

try: set
except NameError:
    from sets import Set as set

class UnknowDB(Exception):
    pass

class UnknowParamstyle(Exception):
    pass

class TransactionError(Exception):
    pass

class SQLParam(object):
    """
    Parameter in SQLQuery

    >> q = SQLQuery(["SELECT * FROM test WHERE name = ", SQLParam("joe")])
    >> q
    <sql: "SELECT * FROM test WHERE name='joe'">
    >> q.query()
    'SELECT * FROM test WHERE name=%s'
    >> q.values()
    ['joe']
    """
    __slots = ["values"]

    def __init__(self, value):
	self.value = value

    def get_marker(self, paramstyle="pyformat"):
	if paramstyle == "qmark":
	    return "?"
	elif paramstyle == "numeric":
	    return ":1"
	elif paramstyle is None or paramstyle in ['format', 'pyformat']:
	    return '%s'
	return UnknowParamstyle, paramstyle

    def sqlquery(self):
	return SQLQuery([self])

    def __add__(self, other):
	return self.sqlquery() + other

    def __radd__(self, other):
	return other + self.sqlquery()

    def __str__(self):
	return str(self.value)

    def __repr__(self):
	return '<param %s>' % repr(self.value)

sqlparam = SQLParam

class SQLQuery(object):
    """
    You can pass this sort of thing as a clause in any db function.
    """
    __slots__ = ["items"]

    def __init__(self, items=None):
	if items is None:
	    items = []
	elif isinstance(items, list):
	    self.items = items
	elif isinstance(items, SQLParam):
	    self.items = [items]
	elif isinstance(items, SQLQuery):
	    self.items = list(items.items)
	else:
	    self.items = [items]

	# [ ] => list
	for i, item in enumerate(self.items):
	    if isinstance(item, SQLParam) and isinstance(item.value, SQLLiteral):
		self.items[i] = item.value.v

    def append(self, value):
	self.items.append(value)

    def __add__(self, other):
	if isinstance(other, basestring):
	    items = [other]
	elif isinstance(other, SQLQuery):
	    items = other.items
	else:
	    return NotImplemented

	return SQLQuery(self.items + items)

    def __radd__(self, other):
	if isinstance(other, basestring):
	    items = [other]
	else:
	    return NotImplemented

	return SQLQuery(items + self.items)
    
    def __iadd__(self, other):
	if isinstance(other, (basestring, SQLParam)):
	    self.items.append(other)
	elif isinstance(other, SQLQuery):
	    self.items.extend(other.items)
	else:
	    return NotImplemented

	return self

    def __len__(self):
	return len(self.query());


    def query(self, paramstyle=None):
	s = []
	for x in self.items:
	    if isinstance(x, SQLParam):
		x = x.get_marker(paramstyle)
		s.append(safestr(x))
	    else:
		x = safestr(x)
		if paramstyle in ['format', 'pyformat']:
		    if '%' in x and '%%' not in x:
			x = x.replace('%', '%%')
		s.append(x)

	return "".join(s)

    def values(self):
	return [i.value for i in self.items if isinstance(i, SQLParam)];

    def join(items, sep='', prefix=None, suffix=None, target=None):
	if target is None:
	    target = SQLQuery()

	target_items=target.items

	if prefix:
	    target_items.append(prefix)

	for i, item in enumerate(items):
	    if i != 0:
		target_items.append(item)
	    if isinstance(item, SQLQuery):
		target_items.extend(item.items)
	    else:
		target_items.append(item)

	if suffix:
	    target_items.append(suffix)

	return target
    
    join = staticmethod(join)

    def _str(self):
	try:
	    return self.query() % tuple([sqlify(x) for x in self.values()])
	except (ValueError, TypeError):
	    return self.query()

    def __str__(self):
	return safestr(self._str())

    def __unicode__(self):
	return safeunicode(self._str())

    def __repr__(self):
	return '<sql: %s>' % repr(str(self))
    
class SQLLiteral:
    def __init__(self, v):
	self.v = v

    def __repr__(self):
	return self.v

sqlliteral = SQLLiteral


def _sqllist(values):
    items = []
    items.append('(')
    for i, v in enumerate(values):
	if i != 0:
	    items.append(", ")
	items.append(sqlparam(v))
    items.append(')')
    return SQLQuery(items)

def reparam(string_, dictionary):
    """
    Takes a string and a dictionary and interpolates the string
    using values from the dictionary. Returns an `SQLQuery` for the result.

    >>> reparam("s = $s", dict(s=True))
    <sql: "s = 't'">
    >>> reparam("s IN $s", dict(s=[1, 2]))
    <sql: 's IN (1, 2)'>
    """
    dictionary = dictionary.copy() # eval mucks with it
    vals = []
    result = []
    for live, chunk in _interpolate(string_):
	if live:
	    v = eval(chunk, dictionary)
	    result.append(sqlquote(v))
	else:
	    result.append(chunk)
    return SQLQuery.join(result, '')

def sqlify(obj):
    if obj is None:
	return 'NULL'
    elif obj is True:
	return 'true'
    elif obj is False:
	return 'false'
    elif datetime and isinstance(obj, datetime.datetime):
	return repr(obj.isoformat())
    else:
	if isinstance(obj, unicode):
	    obj = obj.encode('utf-8')
	return repr(obj)

def sqllist(lst):
    if isinstance(lst, basestring):
	return lst
    else:
	", ".join(lst)

def sqlors(left, lst):
    """
    `left is a SQL clause like `tablename.arg = `
    and `lst` is a list of values. Returns a reparam-style
    pair featuring the SQL that ORs together the clause
    for each item in the lst.

    >>> sqlors('foo = ', [])
    <sql: '1=2'>
    >>> sqlors('foo = ', [1])
    <sql: 'foo = 1'>
    >>> sqlors('foo = ', 1)
    <sql: 'foo = 1'>
    >>> sqlors('foo = ', [1,2,3])
    <sql: '(foo = 1 OR foo = 2 OR foo = 3 OR 1=2)'>
    """
    if isinstance(lst, iters):
	lst = list(lst)
	ln = len(lst)
	if ln == 0:
	    return SQLQuery("1=2")
	if ln == 1:
	    lst = lst[0]

    if isinstance(lst, iters):
	return SQLQuery(['('] + sum([[left, sqlparam(x), ' OR '] for x in lst], []) + ['1=2)'])
    else:
	return left + sqlparam(lst)

def sqlwhere(dictionary, grouping=' AND '):
    """
    Converts a `dictionary` to an SQL WHERE clause `SQLQuery`.
    >>> sqlwhere({'cust_id': 2, 'order_id':3})
    <sql: 'order_id = 3 AND cust_id = 2'>
    >>> sqlwhere({'cust_id': 2, 'order_id':3}, grouping=', ')
    <sql: 'order_id = 3, cust_id = 2'>
    >>> sqlwhere({'a': 'a', 'b': 'b'}).query()
    'a = %s AND b = %s'
    """
    return SQLQuery.join([k + ' = ' + sqlparam(v) for k, v in dictionary.items()], grouping)

def sqlquote(a):
    """
    Ensures `a` is quoted properly for use in a SQL query.

    >>> 'WHERE x = ' + sqlquote(True) + ' AND y = ' + sqlquote(3)
    <sql: "WHERE x = 't' AND y = 3">
    >>> 'WHERE x = ' + sqlquote(True) + ' AND y IN ' + sqlquote([2, 3])
    <sql: "WHERE x = 't' AND y IN (2, 3)">
    """
    if isinstance(a, list):
	return _sqllist(a)
    else:
	return sqlparam(a).sqlquery()

class Transaction:
    """Database transaction."""
    def __init__(self, ctx):
	self.ctx = ctx
	self.transaction_count = transaction_count = len(ctx.transactions)

	class transaction_engine:
	    """Transaction Engine used in top level transactions."""
	    def do_transact(self):
		ctx.commit(unload=False)

	    def do_commit(self):
		ctx.commit()

	    def do_rollback(self):
		ctx.rollback()

	class subtransaction_engine:
	    """Transaction Engine used in sub transactions."""
	    def query(self, q):
		db_cursor = ctx.db.cursor()
		ctx.db_execute(db_cursor, SQLQuery(q % transaction_count))

	    def do_transact(self):
		self.query('SAVEPOINT webpy_sp_%s')

	    def do_commit(self):
		self.query('RELEASE SAVEPOINT webpy_sp_%s')

	    def do_rollback(self):
		self.query('ROLLBACK TO SAVEPOINT webpy_sp_%s')

	class dummy_engine:
	    """Transaction Engine used instead of subtransaction_engine
when sub transactions are not supported."""
	    do_transact = do_commit = do_rollback = lambda self: None

	if self.transaction_count:
	    # nested transactions are not supported in some databases
	    if self.ctx.get('ignore_nested_transactions'):
		self.engine = dummy_engine()
	    else:
		self.engine = subtransaction_engine()
	else:
	    self.engine = transaction_engine()

	self.engine.do_transact()
	self.ctx.transactions.append(self)

    def __enter__(self):
	return self

    def __exit__(self, exctype, excvalue, traceback):
	if exctype is not None:
	    self.rollback()
	else:
	    self.commit()

    def commit(self):
	if len(self.ctx.transactions) > self.transaction_count:
	    self.engine.do_commit()
	    self.ctx.transactions = self.ctx.transactions[:self.transaction_count]

    def rollback(self):
	if len(self.ctx.transactions) > self.transaction_count:
	    self.engine.do_rollback()
	    self.ctx.transactions = self.ctx.transactions[:self.transaction_count]


class DB:
    def __init__(self, db_module, keywords):
	"""
	create a database
	"""
	keywords.pop("driver", None);
	self.db_module = db_module
	self.keywords = keywords
	self._ctx = threadeddict()

	self.support_mutiple_insert = False

    def _getctx(self):
	if not self._ctx.get('db'):
	    self._load_context(self._ctx)
	return self._ctx
    ctx = property(_getctx)

    def _load_context(self, ctx):
	ctx.dbq_count = 0
	ctx.transactions = []

	ctx.db = self._connect(self.keywords)
	
	ctx.db_execute = self._db_execute

	if not hasattr(ctx.db, 'commit'):
	    ctx.db.commit = lambda: None

	if not hasattr(ctx.db, 'rollback'):
	    ctx.db.rollback = lambda: None


	def commit(unload=True):
	    ctx.db.commit()
	
	def rollback():
	    ctx.db.rollback()

	ctx.commit = commit
	ctx.rollback = rollback

    def _unload_context(self, ctx):
	del ctx.db

    def _connect(self, keywords):
	return self.db_module.connect(**keywords)
    
    def _db_cursor(self):
	return	self.ctx.db.cursor()

    def _param_marker(self):
	style = getattr(self, 'paramstyle', 'pyformat')

	if style == 'qmark':
	    return '?'
	elif style == 'numeric':
	    return ":1"
	elif style in ['pyformat', 'format']:
	    return '%s'
	
	raise UnknowParamstyle, style

    def _db_execute(self, cur, sql_query):
	self.ctx.dbq_count += 1

	try:
	    a = time.time()
	    query, params = self._process_query(sql_query)
	    out = cur.execute(query, params)
	    b = time.time()
	except:
	    if self.ctx.transactions:
		self.ctx.transactions[-1].rollback()
	    else:
		self.ctx.rollback()
	    raise
	
	return out

    def _process_query(self, sql_query):
	paramstyle = getattr(self, 'paramstyle', 'pyformat')
	query = sql_query.query(paramstyle)
	params = sql_query.values()
	return query, params

    def _where(self, where, vars):
	if isinstance(where, (int, long)):
	    where = "id = " + sqlparam(where)
	elif isinstance(where, (list, tuple)) and len(where) == 2:
	    where = SQLQuery(where[0], where[1])
	elif isinstance(where, SQLQuery):
	    pass
	else:
	    where = reparam(where, vars)
	    return where

    def query(self, sql_query, vars=None, processed=False, _test=False):
	if vars is None: vars = {}

	if not processed and not isinstance(sql_query, SQLQuery):
	    sql_query = reparam(sql_query, vars)

	if _test: return sql_query

	db_cursor = self._db_cursor()
	self._db_execute(db_cursor, sql_query)

	if db_cursor.description:
	    names = [x[0] for x in db_cursor.description]
	    def iterwrapper():
		row = db_cursor.fetchone()
		while row:
		    yield storage(dict(zip(names, row)))
		    row = db_cursor.fetchone()
	    out = iterbetter(iterwrapper())
	    out.__len__ = lambda: int(db_cursor.rowcount)
	    out.list = lambda: [storage(dict(zip(names, x))) \
		    for x in db_cursor.fetchall()]
	else:
	    out = db_cursor.rowcount

	if not self.ctx.transactions:
	    self.ctx.commit()
	return out

    def select(self, tables, vars=None, what='*', where=None, order=None, group=None, limit=None, offset=None, _test=False):
	if vars is None: vars = {}

	sql_clauses = self.sql_clauses(what, tables, where, group, order, limit, offset)
	clauses = [self.gen_clause(sql, val, vars) for sql, val in sql_clauses if val is not None]
	qout = SQLQuery.join(clauses)
	if _test: return qout
	return self.query(qout, processed=True)

    def where(self, table, what='*', order=None, group=None, limit=None, offset=None, _test=False, **kwargs):
	where_clauses = []
	for k, v in kwargs.iteritems():
	    where_clauses.append(k + ' = ' + sqlquote(v))

	if where_clauses:
	    where = SQLQuery.join(where_clauses, " AND ")
	else:
	    where = None

	return self.select(table, what=what, order=order,
		group=group, limit=limit, offset=offset, _test=_test,
		where=where)

    def sql_clauses(self, what, tables, where, group, order, limit, offset):
	return (
	    ('SELECT', what),
	    ('FROM', sqllist(tables)),
	    ('WHERE', where),
	    ('GROUP BY', group),
	    ('ORDER BY', order),
	    ('LIMIT', limit),
	    ('OFFSET', offset))

    def gen_clause(self, sql, val, vars):
        if isinstance(val, (int, long)):
            if sql == 'WHERE':
                nout = 'id = ' + sqlquote(val)
            else:
                nout = SQLQuery(val)
        #@@@
        elif isinstance(val, (list, tuple)) and len(val) == 2:
            nout = SQLQuery(val[0], val[1]) # backwards-compatibility
        elif isinstance(val, SQLQuery):
            nout = val
        else:
            nout = reparam(val, vars)

        def xjoin(a, b):
            if a and b: return a + ' ' + b
            else: return a or b

        return xjoin(sql, nout)

    def insert(self, tablename, seqname=None, _test=False, **values):
	"""
	Inserts `values` into `tablename`. Returns current sequence ID.
	Set `seqname` to the ID if it's not the default, or to `False`
	if there isn't one.
	>>> db = DB(None, {})
	>>> q = db.insert('foo', name='bob', age=2, created=SQLLiteral('NOW()'), _test=True)
	>>> q
	<sql: "INSERT INTO foo (age, name, created) VALUES (2, 'bob', NOW())">
	>>> q.query()
	'INSERT INTO foo (age, name, created) VALUES (%s, %s, NOW())'
	>>> q.values()
	[2, 'bob']
	"""
        def q(x): return "(" + x + ")"
        
        if values:
            _keys = SQLQuery.join(values.keys(), ', ')
            _values = SQLQuery.join([sqlparam(v) for v in values.values()], ', ')
            sql_query = "INSERT INTO %s " % tablename + q(_keys) + ' VALUES ' + q(_values)
        else:
            sql_query = SQLQuery(self._get_insert_default_values_query(tablename))

        if _test: return sql_query
        
        db_cursor = self._db_cursor()
        if seqname is not False:
            sql_query = self._process_insert_query(sql_query, tablename, seqname)

        if isinstance(sql_query, tuple):
            # for some databases, a separate query has to be made to find
            # the id of the inserted row.
            q1, q2 = sql_query
            self._db_execute(db_cursor, q1)
            self._db_execute(db_cursor, q2)
        else:
            self._db_execute(db_cursor, sql_query)

        try:
            out = db_cursor.fetchone()[0]
        except Exception:
            out = None
        
        if not self.ctx.transactions:
            self.ctx.commit()
        return out

    def _get_insert_default_values_query(self, table):
        return "INSERT INTO %s DEFAULT VALUES" % table

    def multiple_insert(self, tablename, values, seqname=None, _test=False):
        """
	Inserts multiple rows into `tablename`. The `values` must be a list of dictioanries,
	one for each row to be inserted, each with the same set of keys.
	Returns the list of ids of the inserted rows.
	Set `seqname` to the ID if it's not the default, or to `False`
	if there isn't one.
	>>> db = DB(None, {})
	>>> db.supports_multiple_insert = True
	>>> values = [{"name": "foo", "email": "foo@example.com"}, {"name": "bar", "email": "bar@example.com"}]
	>>> db.multiple_insert('person', values=values, _test=True)
	<sql: "INSERT INTO person (name, email) VALUES ('foo', 'foo@example.com'), ('bar', 'bar@example.com')">
	"""
        if not values:
            return []
            
        if not self.supports_multiple_insert:
            out = [self.insert(tablename, seqname=seqname, _test=_test, **v) for v in values]
            if seqname is False:
                return None
            else:
                return out
                
        keys = values[0].keys()
        #@@ make sure all keys are valid

        for v in values:
            if v.keys() != keys:
                raise ValueError, 'Not all rows have the same keys'

        sql_query = SQLQuery('INSERT INTO %s (%s) VALUES ' % (tablename, ', '.join(keys)))

        for i, row in enumerate(values):
            if i != 0:
                sql_query.append(", ")
            SQLQuery.join([SQLParam(row[k]) for k in keys], sep=", ", target=sql_query, prefix="(", suffix=")")
        
        if _test: return sql_query

        db_cursor = self._db_cursor()
        if seqname is not False:
            sql_query = self._process_insert_query(sql_query, tablename, seqname)

        if isinstance(sql_query, tuple):
            # for some databases, a separate query has to be made to find
            # the id of the inserted row.
            q1, q2 = sql_query
            self._db_execute(db_cursor, q1)
            self._db_execute(db_cursor, q2)
        else:
            self._db_execute(db_cursor, sql_query)

        try:
            out = db_cursor.fetchone()[0]
            out = range(out-len(values)+1, out+1)
        except Exception:
            out = None

        if not self.ctx.transactions:
            self.ctx.commit()
        return out

    
    def update(self, tables, where, vars=None, _test=False, **values):
        """
	Update `tables` with clause `where` (interpolated using `vars`)
	and setting `values`.

	>>> db = DB(None, {})
	>>> name = 'Joseph'
	>>> q = db.update('foo', where='name = $name', name='bob', age=2,
	... created=SQLLiteral('NOW()'), vars=locals(), _test=True)
	>>> q
	<sql: "UPDATE foo SET age = 2, name = 'bob', created = NOW() WHERE name = 'Joseph'">
	>>> q.query()
	'UPDATE foo SET age = %s, name = %s, created = NOW() WHERE name = %s'
	>>> q.values()
	[2, 'bob', 'Joseph']
	"""
        if vars is None: vars = {}
        where = self._where(where, vars)

        query = (
          "UPDATE " + sqllist(tables) +
          " SET " + sqlwhere(values, ', ') +
          " WHERE " + where)

        if _test: return query
        
        db_cursor = self._db_cursor()
        self._db_execute(db_cursor, query)
        if not self.ctx.transactions:
            self.ctx.commit()
        return db_cursor.rowcount
    
    def delete(self, table, where, using=None, vars=None, _test=False):
        """
	Deletes from `table` with clauses `where` and `using`.

	>>> db = DB(None, {})
	>>> name = 'Joe'
	>>> db.delete('foo', where='name = $name', vars=locals(), _test=True)
	<sql: "DELETE FROM foo WHERE name = 'Joe'">
	"""
        if vars is None: vars = {}
        where = self._where(where, vars)

        q = 'DELETE FROM ' + table
        if using: q += ' USING ' + sqllist(using)
        if where: q += ' WHERE ' + where

        if _test: return q

        db_cursor = self._db_cursor()
        self._db_execute(db_cursor, q)
        if not self.ctx.transactions:
            self.ctx.commit()
        return db_cursor.rowcount

    def _process_insert_query(self, query, tablename, seqname):
        return query

    def transaction(self):
        """Start a transaction."""
        return Transaction(self.ctx)


class MySQLDB(DB):
    """
    MySQL database brige
    """
    def __init__(self, **keywords):
	import MySQLdb as db

	if 'pw' in keywords:
	    keywords['passwd'] = keywords['pw']
	    del keywords['pw']

	if 'charset' not in keywords:
	    keywords['charset'] = 'utf8'
	elif keywords['charset'] is None:
	    del keywords['charset']

	self.paramstyle = db.paramstyle = "pyformat"
	self.dbname = 'mysql'
	DB.__init__(self, db, keywords)
	self.support_mutiple_insert=True
    
    def _process_insert_query(self, query, tablename, seqname):
	return query, SQLQuery("SELECT last_insert_id()")

    def _get_insert_default_values_query(self, table):
	return "INSERT INTO %s () VALUES()" % table



if __name__ == "__main__":
    #test db
    db = MySQLDB(db='spyder', user='root', passwd='', host='localhost')
