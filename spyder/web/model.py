#coding: utf-8

import os, sys

parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from libs.db import MySQLDB
#from flask import g, current_app

class Model(object):
    """
    custom user model
    """
    _db_config = {}
    _db = None
    _db_setting = 'default'
    _table_name = ''
    table_prefix = ''

    def __init__(self):
	if (self._db_setting not in self._db_config):
	    self._db_setting = 'default'

	config = self._db_config[self._db_setting]

	self.table_prefix = config['table_prefix']
	self._table_name = self.table_prefix + self._table_name

	self.db = MySQLDB(db = config['db'], user=config['user'], passwd=config['passwd'], host=config['host'])

    def select(self, where, data='*', limit = None, order = None, group = None, key = ''):
	if isinstance(where, list):
	    where = self._sqls(where)
	
	#def select(self, tables, vars=None, what='*', where=None, order=None, group=None, limit=None, offset=None, _test=False):
	return self.db.select();

    def get_one(self):
	'''
	'''

    def query(sql):
	'''
	'''

    def insert():
	'''
	'''

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
	'''
	'''

    def affected_rows():
	'''
	'''

    def get_primary():
	'''
	'''

    def get_field():
	'''
	'''

    def table_exists():
	'''
	'''

    def field_exists():
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
	_db_config = {
	    'default' : {
		"table_prefix" : "",
		"db" : "spyder",
		'user' : "root",
		"passwd" : "passwd",
		"host" : "localhost"
	    }	    
	}

	def __init__(self):
	    Model.__init__(self)


    t = Test()
    print dir(t)
