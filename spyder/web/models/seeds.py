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
        print args
	return self.insert(**args)
    
    def remove(self, sid):
	return self.delete({"sid":sid})
    
    def view(self, sid):
	return self.select({"sid":sid})
    
    def list(self, page, per_page, filte):
        start = (page - 1) * per_page
        end = per_page
	return self.select(where=filte, limit=str(end), offset=start)
    
    def totalcount(self):
	return self.count()
