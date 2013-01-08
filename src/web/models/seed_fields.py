#coding: utf-8
from web.model import Model

class Seed_fields(Model):
    seed_id = 0;
    def __init__(self, app = None):
        if app is None:
            from web.config import DefaultConfig
            self.db_config = DefaultConfig().DBS
        else:
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
    
    def copynew(self, old_sid, new_sid):
        datas = self.list(old_sid).list()
        if len(datas) > 0:
            for save in datas:
                save["seed_id"] = new_sid
                self.insert(**save)
	return True
    
    def edit(self, sid, fid, value, page_type):
	return self.update(where="seed_id="+sid+" and field_id="+str(fid), value=value, page_type=page_type)
    
    def remove(self, seed_id):
	return self.delete("seed_id="+str(seed_id))
    
    def view(self, seed_id, fid):
	return self.select({"seed_id":seed_id, "field_id":fid})
    
    def list(self, seed_id):
	return self.select({"seed_id":seed_id})
    
    def totalcount(self):
	return self.count()
    
    def getpageType(self):
	return self.get_field_list(field="page_type")
