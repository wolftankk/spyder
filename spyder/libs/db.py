#coding: utf-8
"""
Database API
"""
import time, os, urllib

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
	elif:
	    self.items = [items]


class SQLLiteral:
    def __init__(self, v):
	self.v = v


class DB:
    def __init__(self, db_module, keywords):
	"""
	create a database
	"""
	keywords.pop("driver", None);



class MySQLDB(DB):
    """
    MySQL database brige
    """
    def __init__(self, **keywords):
	import MySQLdb as db

	self.paramstyle = db.paramstyle = "pyformat"
	self.dbname = 'mysql'
	DB.__init__(self, db, keywords)


#_databases = {}
#def database(dburl = None, **params):
#    """
#    Creates appropriate database using params
#    """
#    if not dburl and not params:
#	dburl = os.environ['DATABASE_URL']
#
#    if dburl:
#	params = dburl2dict(dburl)
#    dbn = params.pop('dbn')
#
#    if dbn in _databases:
#	return _databases[dbn](**params)
