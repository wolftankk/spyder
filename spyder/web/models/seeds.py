#coding: utf-8
from web.model import Model

class Seed(Model):
    sid = 0;
    def __init__(self, app):
        self.app = app
        self.db_config = self.app.config.get('DBS')
        self.db_setting = 'default'
        self._table_name = 'seeds'
        Model.__init__(self)

    def validate_seedname(self, seedname):
	'''
	'''
	return True
    
    def validate_api(self, api):
	'''
	'''
	return True

    def add(self, **args):
	return self.insert(**args)
    
    def remove(self, sid):
	return self.delete("sid="+str(sid))
    
    def view(self, sid):
	return self.select("sid="+str(sid))
    
    def list(self, page):
	return self.select()
