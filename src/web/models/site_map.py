#coding: utf-8
from web.model import Model

class Site_map(Model):
    id = 0;
    def __init__(self, app = None):
        if app is None:
            from web.config import DefaultConfig
            self.db_config = DefaultConfig().DBS
        else:
            self.app = app
            self.db_config = self.app.config.get('DBS')
        self.db_setting = 'default'
        self._table_name = 'website_map'
        Model.__init__(self)

    def validate_sitename(self, sitename):
	'''
	'''
	return True
    
    def validate_api(self, api):
	'''
	'''
	return True

    def add(self, **args):
	return self.insert(**args)
    
    def remove(self, id):
	return self.delete("id="+str(id))
    
    def edit(self, id, **args):
	return self.update(where="id="+str(id), **args)
    
    def view(self, siteid, seed_type, field_id):
	return self.select({"siteid":siteid, "seed_type":seed_type, "field_id": field_id})
    
    def list(self, siteid):
	return self.select({"siteid":siteid})
    
    def totalcount(self):
	return self.count()
    
    def getlist(self, args):
	return self.select(args)
