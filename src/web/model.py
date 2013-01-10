#coding: utf-8

import os, sys

parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from libs.db import MySQLDB, sqlquote, sqlwhere, SQLQuery
from flask import g, current_app
from hashlib import md5

dbs = {}
class Model(object):
    """
    custom user model
    """
    db_config = {}
    db = None
    db_setting = 'default'
    _table_name = ''
    table_prefix = ''

    def __init__(self):
	if (self.db_setting not in self.db_config):
	    self.db_setting = 'default'

	config = self.db_config[self.db_setting]
	self.table_prefix = config['table_prefix']
	self._table_name = self.table_prefix + self._table_name

	guid = md5(config['db']+config['host']).hexdigest()
	if guid not in dbs:
	    dbs[guid] = MySQLDB(db = config['db'], user=config['user'], passwd=config['passwd'], host=config['host'])

	self.db = dbs[guid]

    def select(self, where=None, vars = None, what='*', limit = None, order = None, group = None, offset=None):
	'''
	Selects `what` from `tables` with clauses `where`, `order`,
	`group`, `limit`, and `offset`. Uses vars to interpolate.
	Otherwise, each clause can be a SQLQuery.
	>>> db.select('foo', _test=True)
	<sql: 'SELECT * FROM foo'>
	>>> db.select(['foo', 'bar'], where="foo.bar_id = bar.id", limit=5, _test=True)
	<sql: 'SELECT * FROM foo, bar WHERE foo.bar_id = bar.id LIMIT 5'>
	'''
	if (isinstance(where, dict)):
	    where = sqlwhere(where)

	if not where:
	    where = None
	return self.db.select(self._table_name, where=where, vars=vars, what=what, limit=limit, order=order, group=group, offset=offset, _test=False)

    def get_one(self, where=None, vars=None, what='*', limit=None, order=None, group=None, offset=None):
	if (isinstance(where, dict)):
	    where = sqlwhere(where)
	query = self.db.select(self._table_name, where=where, vars=vars, what=what, limit=1, order=order, group=group, offset=0);
	if query and len(query) > 0 :
	    return query.list().pop()
	else:
	    return None

    def query(self, sql):
	query = SQLQuery(sql)
	return self.db.query(query, processed=True);

    def insert(self, seqname=None, _test=False, **values):
	return self.db.insert(self._table_name, seqname=seqname, _test=_test, **values);

    def update(self, where, vars=None, _test=False, **values):
        """
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
	return self.db.update(self._table_name, where=where, vars=vars, _test=_test, **values)

    def delete(self, where, using=None, vars=None, _test=False):
        """
	>>> name = 'Joe'
	>>> db.delete('foo', where='name = $name', vars=locals(), _test=True)
	<sql: "DELETE FROM foo WHERE name = 'Joe'">
	"""
	return self.db.delete(self._table_name, where=where, vars=vars, _test=_test)


    def count(self, where=None):
	query = self.get_one(where, what="COUNT(*) AS NUM");
	if query:
	    return query["NUM"];
	else:
	    return 0;

    def affected_rows():
	'''
	'''

    def get_primary(self, table_name=None):
	if table_name is None:
	    table_name = self._table_name
	else:
	    table_name = self.table_prefix + self._table_name;
	sql = SQLQuery(["SHOW COLUMNS FROM ", table_name])
	query = self.db.query(sql, processed=True)
	list = query.list();
	for r in list:
	    if r['Key'] == u'PRI':
		return r['Field']

    def get_fields(self, table_name = None):
	if table_name is None:
	    table_name = self._table_name
	else:
	    table_name = self.table_prefix + self._table_name;

	out = self.db.select(table_name);
	return out.fields

    def get_field_list(self, field, table_name=None):
	if table_name is None:
	    table_name = self._table_name
	else:
	    table_name = self.table_prefix + self._table_name;
	sql = SQLQuery(["SHOW COLUMNS FROM ", table_name, " WHERE Field=", sqlquote(field)])
	query = self.db.query(sql, processed=True)
	if query and hasattr(query, "list"):
	    fields = query.list().pop();
	    list = fields["Type"]
	    #类型有两种, 一种是多选, 一种是单选
	    list = list.replace("enum", '');
	    list = list.replace("SET", '');
	    return eval(list)


    def field_exists(self, field):
	return field in self.get_fields()

    def table_exists(self, field):
	'''
	'''

if __name__ == "__main__":
    class Test(Model):
	db_config = {
	    'default' : {
		"table_prefix" : "",
		"db" : "spyder",
		'user' : "root",
		"passwd" : "",
		"host" : "192.168.1.136"
	    }	    
	}

	def __init__(self):
	    self.db_setting = 'default'
	    self._table_name = 'field_template'
	    Model.__init__(self)


    t = Test()
    l = t.get_primary()
    print l
    #a = t.count('1')
    #print a
    #l = a.list()
    #print l
    #print test_query.list()
