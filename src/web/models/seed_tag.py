#coding: utf-8
from web.model import Model

class Seed_tag(Model):
    seed_id = 0;
    def __init__(self, app = None):
        if app is None:
            from web.config import DefaultConfig
            self.db_config = DefaultConfig().DBS
        else:
            self.app = app
            self.db_config = self.app.config.get('DBS')
        self.db_setting = 'default'
        self._table_name = 'seed_tag'
        Model.__init__(self)

    def validate_name(self, name):
	'''
	'''
	return True

    def add(self, **args):
	return self.insert(**args)
    
    def remove(self, sid, tid):
	return self.delete({"sid":sid, "tid":tid})
    
    def view(self, sid, tid):
	return self.select({"sid":sid, "tid":tid})
    
    def list(self, sid):
	return self.select({"sid":sid})
    
    def totalcount(self):
	return self.count()
