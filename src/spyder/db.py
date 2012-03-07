#coding: utf-8
import _mysql as pmysql
import MySQLdb
import config

# config db and launcher mysql
db = pmysql.connect(host=config.DBCONFIG["host"], user=config.DBCONFIG["user"], passwd=config.DBCONFIG["passwd"], db=config.DBCONFIG["dbname"])
db.query("SET NAMES UTF8")

# grab from https://github.com/webpy/webpy/blob/master/web/utils.py
def safestr(obj, encoding='utf-8'):
	if isinstance(obj, unicode):
		return obj.encode(encoding)
	elif isinstance(obj, str):
		return obj
    #elif hasattr(obj, 'next'): # iterator
    #    return itertools.imap(safestr, obj)
	else:
		return str(obj)


class SQLEmptyError(Exception): pass

class SQLParamsError(Exception): pass

class Store(object):
	def __init__(self, sql = None, params = {}):
		self.db = db;

		if sql == None:
			raise SQLEmptyError
		self.sql = sql
		if params is None:
			self.params = []

		#params => list
		self.params = params

	#def _createSQL(self):
		#s = []
		#for x in self.params:
		#	x = safestr(x)
		#	print "%s %s %s" % (1, 1, 33)

	def query(self):
		query = self.db.query(self.sql);

	def is_exists(self):
		self.query();
		r = self.db.store_result()
		if r.num_rows() == 0:
			return False
		else:
			return True
	
	def insert_id(self):
		self.query()
		return self.db.insert_id()
	
		
				

