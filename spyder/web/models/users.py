#coding: utf-8
from web.model import Model

class User(Model):
    uid = 0;
    def __init__(self, app):
        self.app = app
        self.db_config = self.app.config.get('DBS')
        self.db_setting = 'default'
        self._table_name = 'users'
        Model.__init__(self)

    def validate_username(self, username):
	'''
	'''
	return True
    
    def validate_email(self, email):
	'''
	'''
	return True

    def add(self, **args):
	return self.insert(**args)
    
    def remove(self, uid):
	return self.delete({"uid":uid})
    
    def view(self, uid):
	return self.select({"uid":uid})
    
    def list(self, page, per_page, filte):
        start = (page - 1) * per_page
        end = per_page
	return self.select(where=filte, limit=str(end), offset=start)
    
    def totalcount(self):
	return self.count()
