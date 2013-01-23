#coding: utf-8
from web.model import Model

class Filter(Model):
    id = 0;
    def __init__(self, app=None):
        if app is None:
            from web.config import DefaultConfig
            self.db_config = DefaultConfig().DBS
        else:
            self.app = app
            self.db_config = self.app.config.get('DBS')
        self.db_setting = 'default'
        self._table_name = 'filters'
        Model.__init__(self)

    def add(self, **args):
        return self.insert(**args)
    
    def remove(self, id):
        return self.delete("id="+str(id))
    
    def view(self, id):
        return self.select({"id":id})
    
    def list(self):
        return self.select()
    
    def totalcount(self):
        return self.count()

    def getFilterType(self):
        return self.get_field_list(field="type")