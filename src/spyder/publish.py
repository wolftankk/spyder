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

__all__ = [

]

class article_template(Model):
    '''
    用于快速创建一个插入到外部数据库的model模板类
    '''
    def __init__(self, db_config, table_name):	
	self.db_config = db_config
	self.db_setting = 'default'
	self._table_name = table_name
	Model.__init__(self)

class Site(object):
    post_type = ["mysql", "api"]
    upload_res_type = [ "aliyun", "ftp"]

    def __init__(self, data):
	self.field_map = {}
	if "sync_profile" in data:
	    sync_profile = data.pop("sync_profile")
	    sync_profile = unserialize(sync_profile)
	    self.sync_profile = sync_profile

	self.profile = data
	self.id = str(data["id"])
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

    def push(self, guid, data, field_map):
	'''
	每条数据最终会通过此处发布到数据库或者api中
	# mysql, api
	if self.profile["sync_type"] == "mysql":
	    self.post_to_mysql(guid, data, field_map)
	'''
	#处理数据， 看数据中的图片是否需要上传
	self.upload_media(data)

	#data中的图片链接地址将会替换成新的资源地址
	if self.profile["sync_type"] in self.post_type:
	    method = getattr(self, "post_to_" + self.profile["sync_type"])
	    if method:
		method(guid, data, field_map)

    def upload_media(self, data):
	if (self.static_type not in self.upload_res_type) or not self.staticUrl:
	    return;

	#content <-> images
	#这里需要多进程处理
	images = data["images"] or []

	# ftp_server, ftp_port, ftp_path, ftp_password, ftp_username

	# access_id, secret_access_key

    def get_field_mapping(self, field_map):
	new_field = {}
	table_name = None

	for f in field_map:
	    if f["field_id"] and f["site_field"]:
		if table_name is None:
		    table_name = f["table_name"]

		new_field[f["site_field"]] = get_field_from_cache(f["field_id"])
	
	return table_name, new_field

    def post_to_mysql(self, guid, data, field_map):
	type = data["type"]
	if type not in self.field_map:
	    self.field_map[type] = {}

	if self.id not in self.field_map[type]:
	    table_name, field_mapping = self.get_field_mapping(field_map)
	    profile = {
	        "table_name" : table_name,
	        "mapping" : field_mapping
	    }
	    profile["model"] = article_template(self.db_config, table_name)
	    self.field_map[type][self.id] = profile

	if self.id in self.field_map[type] and "model" in self.field_map[type][self.id]:
	    db = self.field_map[type][self.id]["model"]
	    map = self.field_map[type][self.id]["mapping"]

	    try:
		'''
		直接尝试插入， 这里以后需要写状态
		'''
		# 这里获取一些hook脚本
		if "hook" in self.profile:
		    hook = self.profile["hook"]
		    # insert_data, data

		    
		#insert_data = {}
		#for k in map:
		#    field = map[k]
		#    insert_data[k] = data[field["name"]].value

		#insert_data["insert_time"] = str(time.strftime("%Y-%m-%d %H:%M:%S"))
		#insert_data["guid"] = guid
		#insert_data["src_url"] = data["url"]

		#if "category_id" in fields:
		#    insert_data["category_id"] = data["tags"]

		#db.insert(**insert_data)
	    except:
		pass;


class PublishServer():
    '''
    发布服务器, 每次采集成功后， 会调用此服务中的push转发到各个站点
    '''
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
	'''
	初始化将所有的站点数据保存在sites中
	'''
	site_db = Site_Model();
	query = site_db.select();
	r = query.list();
	for site in r:
	    if site and "id" in site:
		self.sites[site["id"]] = Site(site)

    def update_sites(self):
	'''
	这里更新需要做一次安全的检测。 当push不在调用的时候执行此函数
	'''
	self.init_sites();

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

    def update_site_fieldmap(self, seed_type):
	'''
	这里更新时候需要做安全检测
	'''

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
	
#实例化
publish_server = PublishServer()


if __name__ == "__main__":
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

