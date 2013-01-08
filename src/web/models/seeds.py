#coding: utf-8
from web.model import Model
from datetime import datetime
import time

class Seed(Model):
    sid = 0;
    def __init__(self, app=None):
        if app is None:
            from web.config import DefaultConfig
            self.db_config = DefaultConfig().DBS
        else:
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
    
    def copynew(self, sid):
        save = self.view(sid).list()
        if len(save) > 0:
            save = save[0]
            save["seed_name"] = save["seed_name"]+datetime.today().strftime("%Y%m%d%H%M%S")
            time1 = int(time.time())
            save["created_time"] = time1
            save["update_time"] = time1
            save["enabled"] = 0
            del save["sid"]
            return self.insert(**save)
	return False
    
    def remove(self, sid):
	return self.delete("sid="+str(sid))
    
    def edit(self, sid, **args):
	return self.update(where="sid="+str(sid), **args)
    
    def view(self, sid):
	return self.select({"sid":sid})
    
    def list(self, page, per_page, filte):
        start = (page - 1) * per_page
        end = per_page
	return self.select(where=filte, limit=str(end), offset=start)
    
    def totalcount(self):
	return self.count()
