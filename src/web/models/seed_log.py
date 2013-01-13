#coding: utf-8
from web.model import Model

class Seed_log(Model):
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
