#coding: utf-8

import os, sys

parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from libs.db import MySQLDB, sqlquote
from flask import g, current_app

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

	self.db = MySQLDB(db = config['db'], user=config['user'], passwd=config['passwd'], host=config['host'])

    def select(self, where=None, vars = None, what='*', limit = None, order = None, group = None, offset=None):
	if (isinstance(where, dict)):
	    where = self._sqls(where)
	return self.db.select(self._table_name, where=where, vars=vars, what=what, limit=None, order=None, group=None, offset=None, _test=False)

    def get_one(self):
	'''
	'''

    def query(self, sql):
	'''
	'''

    def insert(self, seqname=None, _test=False, **values):
	return self.db.insert(self._table_name, seqname=seqname, _test=_test, **values);

    def insert_id():
	'''
	'''

    def update(self):
	'''
	'''

    def delete():
	'''
	'''

    def count():
	'''
	'''

    def _sqls(self, where, front=' AND '):
	return front.join(['%s=%s' % (key, sqlquote(value)) for (key, value) in where.items() ])

    def affected_rows():
	'''
	'''

    def get_primary():
	'''
	'''

    def get_fields(self, table_name = None):
	if table_name is None:
	    table_name = self._table_name
	else:
	    table_name = self.table_prefix + self._table_name;

	out = self.db.select(table_name);
	return out.fields

    def field_exists(self, field):
	return field in self.get_fields()

    def table_exists(self, field):
	'''
	'''

    def fetch_array():
	'''
	'''

    def version():
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
	    self._table_name = 'users'
	    Model.__init__(self)


    t = Test()
    #print t.insert(_test=True, username="wolftankk", passwd='111111')
    a = t.select({"username" : "fireyy"})
    #get data list
    l = a.list()
    #print l[0]["username"]
    #print a.list()["username"]
