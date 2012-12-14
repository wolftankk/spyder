#coding: utf-8
"""
Database API
"""
import time, os, urllib

from utils import safestr, safeunicode

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


class DB:
    def __init__(self, db_module, keywords):
	"""
	create a database
	"""
	keywords.pop("driver", None);
	self.db_module = db_module
	self.keywords = keywords

    def _getctx(self):
	if not self._ctx.get('db'):
	    self._load_context(self._ctx)
	return self._ctx
    ctx = property(_getctx)
    
    def _connect(self, keywords):
	return self.db_module.connect(**keywords)
    
    def _db_cursor(self):
	return	self.ctx.db.cursor()

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
