#coding: utf-8
from web.model import Model

class Seed_fields(Model):
    id = 0;
    def __init__(self, app):
        self.app = app
        self.db_config = self.app.config.get('DBS')
        self.db_setting = 'default'
        self._table_name = 'seed_fields'
        Model.__init__(self)

    def validate_name(self, name):
	'''
	'''
	return True
    
    def validate_title(self, title):
	'''
	'''
	return True

    def add(self, **args):
	return self.insert(**args)
    
    def remove(self, id):
	return self.delete({"id":id})
    
    def view(self, id):
	return self.select({"id":id})
    
    def list(self, type):
	return self.select({"type":type})
    
    def totalcount(self):
	return self.count()
