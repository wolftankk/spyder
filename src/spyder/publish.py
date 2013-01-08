#coding: utf-8

'''
Author: wolftankk@gmail.com
Description: Publish data to website
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from libs.phpserialize import unserialize
from spyder.pyquery import PyQuery as pq
from spyder.pybits import ansicolor
from libs.utils import safestr, safeunicode

from web.models import Site as Site_Model
from web.models import Site_map
from web.model import Model

from spyder.field import get_field_from_cache
import time

class cmdp_model(Model):
    def __init__(self, db_config, table_name):	
	self.db_config = db_config
	self.db_setting = 'default'
	self._table_name = table_name
	Model.__init__(self)

'''
website
'''
class Site(object):
    field_map = {}
    def __init__(self, data):
	if "sync_profile" in data:
	    sync_profile = data.pop("sync_profile")
	    sync_profile = unserialize(sync_profile)
	    self.sync_profile = sync_profile

	self.profile = data
	self.id = data["id"]
	
	self.db_config = {
	    'default' : {
		"table_prefix" : self.sync_profile["mysql_prefix"],
		"db" : self.sync_profile["mysql_dbname"],
		'user' : self.sync_profile["mysql_username"],
		"passwd" : self.sync_profile["mysql_password"],
		"host" : self.sync_profile["mysql_server"]
	    }	    
	}

	if self.sync_profile["staticUrl"]:
	    self.staticUrl = self.sync_profile["staticUrl"]

	#静态上传类型 none, ftp, aliyun
	self.static_type = self.sync_profile["staticType"]

    def init_fieldmap(self, field_map):
	# new_field_name :  field_template_name
	new_field = {}
	table_name = ""

	for f in field_map:
	    if "field_id" in f:
		if not table_name:
		    table_name = f["table_name"]

		if f['site_field']:
		    new_field[f["site_field"] ] = get_field_from_cache(f["field_id"])
	
	return table_name, new_field

    def post_to_mysql(self, guid, data, field_map):
	type = data["type"]
	if type not in field_map:
	    self.field_map[type] = {}

	if self.id not in self.field_map[type]:
	    table_name, new_field =  self.init_fieldmap(field_map)
	    self.field_map[type][self.id] = {
		"table_name" : table_name,
		"new_field" : new_field
	    }

	    #init db
	    self.field_map[type][self.id]["model"] = cmdp_model(db_config, self.field_map[type][self.id]["table_name"])

	if self.id in self.field_map[type] and "model" in self.field_map[type][self.id]:
	    db = self.field_map[type][self.id]["model"]
	    map = self.field_map[type][self.id]["new_field"]
	    

	    '''
	    try:
		#test link
		fields = db.get_fields()
		print "Connect database %s success" % db.db_config[db.db_setting]['db']

		insert_data = {}
		for k in map:
		    field = map[k]
		    insert_data[k] = data[field["name"]].value

		insert_data["insert_time"] = str(time.strftime("%Y-%m-%d %H:%M:%S"))
		insert_data["guid"] = guid
		insert_data["src_url"] = data["url"]

		if "category_id" in fields:
		    insert_data["category_id"] = data["tags"]

		db.insert(**insert_data)
	    except:
		pass;
	    '''

    def push(self, guid, data, field_map):
	'''
	if self.profile["sync_type"] == "mysql":
	    self.post_to_mysql(guid, data, field_map)
	'''


'''
将采集的数据发布到网站
'''
class Publish():
    def __init__(self):
	'''
	初始化 把所有的网站都列出来， 并且进行数据推送
	'''
	#site cache
	self.sites = {}
	# site map cache by category, kaifu
	self.site_by_category = {}

	#初始化站点信息
	self.init_sites()

	self.mapdb = Site_map()

    def init_sites(self):
	site_db = Site_Model();
	#get all site data
	query = site_db.select();
	#return result
	r = query.list();
	for site in r:
	    if site and "id" in site:
		self.sites[site["id"]] = Site(site)

    def get_site(self, site_id):
	'''
	get Site instance by site_id
	'''
	if site_id in self.sites:
	    return self.sites[site_id]

    def init_site_fieldmap(self, seed_type):
	'''
	初始化站点字段映射表
	'''
	self.site_by_category[seed_type] = {}
	query = self.mapdb.select(where={ "seed_type" : seed_type }, what="siteid", group="siteid")
	if len(query) > 0:
	    r = query.list();
	    for site in r:
		site_id = site["siteid"]
		#映射数据表
		fields = self.mapdb.select( where = { "seed_type" : seed_type, "siteid" : site_id} ).list()
		self.site_by_category[seed_type][site_id] = fields

    def push(self, guid, data):
	'''
	发布接口
	将发布的数据解析类型。 根据类型找到site_id
	然后发布出去
	'''
	seed_type = data["type"]
	if seed_type not in self.site_by_category:
	    self.init_site_fieldmap(seed_type)

	if seed_type in self.site_by_category:
	    sites = self.site_by_category[seed_type]
	    for site_id in sites:
		site_profile = sites[site_id]
		site = self.get_site(site_id)
		if site is not None:
		    site.push(guid, data, site_profile)
	

if __name__ == "__main__":
    p = Publish()
    #p.push("adsdada", {"type" : "article"})
    print str(time.strftime("%Y-%m-%d %H:%M:%S"))
    '''
    db = Site_Model()
    r = db.view(1);
    if len(r):
	r = r.list()[0]
	sync_profile = r["sync_profile"]
	print unserialize(sync_profile)
    '''

