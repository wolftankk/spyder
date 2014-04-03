#coding: utf-8

class DefaultConfig(object):
    DEBUG = True
    SECRET_KEY = "A0Zr98j/3yX R~XHH!jmN]LWX/,?RT"
    DBS = {
	'default' : {
	    "table_prefix" : "",
	    "db" : "spyder",
	    'user' : "root",
	    "passwd" : "",
	    "host" : "127.0.0.1"
	}	    
    }
