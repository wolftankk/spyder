#coding: utf-8
from web.model import Model

class Tags(Model):
    tag_id = 0;
    def __init__(self, app = None):
        if app is None:
            from web.config import DefaultConfig
            self.db_config = DefaultConfig().DBS
        else:
            self.app = app
            self.db_config = self.app.config.get('DBS')
        self.db_setting = 'default'
        self._table_name = 'tags'
        Model.__init__(self)

    def validate_tag(self, name):
	'''
	'''
	return True

    def add(self, **args):
	return self.insert(**args)
    
    def view(self, id):
	return self.select({"id":id})
    
    def list(self):
	return self.select()
    
    def findByName(self, name):
	return self.select({"name":name})
    
    def totalcount(self):
	return self.count()
