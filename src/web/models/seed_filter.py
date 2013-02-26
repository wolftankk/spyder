#coding: utf-8
from web.model import Model

class Seed_filter(Model):
    seed_id = 0;
    def __init__(self, app = None):
        if app is None:
            from web.config import DefaultConfig
            self.db_config = DefaultConfig().DBS
        else:
            self.app = app
            self.db_config = self.app.config.get('DBS')
        self.db_setting = 'default'
        self._table_name = 'seed_filter'
        Model.__init__(self)

    def add(self, **args):
        return self.insert(**args)
    
    def copynew(self, old_sid, new_sid):
        datas = self.view(old_sid).list()
        if len(datas) > 0:
            for save in datas:
                save["sid"] = new_sid
                del save["id"]
                self.insert(**save)
        return True
    
    def edit(self, sid, fid, filter_id, profile, list_order):
        return self.update(where="seed_id="+sid+" and field_id="+str(fid), filter_id=filter_id, profile=profile, list_order=list_order)
    
    def remove(self, sid, fid=None):
        if fid:
            return self.delete("sid="+str(sid)+" and field_id="+str(fid))
        else:
            return self.delete("sid="+str(sid))
    
    def view(self, seed_id):
        return self.select({"sid":seed_id})
    
    def list(self, seed_id, fid, order=None):
        return self.select({"sid":seed_id, "field_id":fid}, order=order)
    
    def totalcount(self):
        return self.count()
    
    def getpageType(self):
        return self.get_field_list(field="page_type")