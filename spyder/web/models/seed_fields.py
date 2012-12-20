#coding: utf-8
from web.model import Model

class Seed_fields(Model):
    seed_id = 0;
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
    
    def edit(self, sid, fid, value):
	return self.update(where="seed_id="+sid+" and field_id="+str(fid), value=value)
    
    def remove(self, seed_id):
	return self.delete("seed_id="+str(seed_id))
    
    def view(self, seed_id):
	return self.select({"seed_id":seed_id})
    
    def list(self, seed_id):
	return self.select({"seed_id":seed_id})
    
    def totalcount(self):
	return self.count()
