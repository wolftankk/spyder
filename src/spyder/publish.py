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
from urlparse import urljoin

from web.models import Site as Site_Model
from web.models import Site_map
from web.model import Model
from spyder.field import get_field_from_cache
import spyder.recipes as recipes
from spyder.media import Image

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
	#data中的图片链接地址将会替换成新的资源地址
	if self.profile["sync_type"] in self.post_type:
	    method = getattr(self, "post_to_" + self.profile["sync_type"])
	    if method:
		method(guid, data, field_map)

    def upload_media(self, insert_data, data):
	if (self.static_type not in self.upload_res_type) or not self.staticUrl:
	    return;
	
	images = data["images"]

	if len(images) == 0:
	    return

	#download and get new name
	for img_url in images:
	    image = Image(img_url)
	    if image.fetched:
		image_hash, image_name = image.getMediaName()
		relative_path, abs_path = image.getPath(False)
		
		#相对路径
		image_relative_path = os.path.join(relative_path, image_name)
		#绝对路径 用于保存图片以及上传
		image_abs_path = os.path.join(abs_path, image_name)

		for field in insert_data:
		    data = insert_data[field]
		    if data is not None:
			insert_data[field] = data.replace(img_url, urljoin(self.staticUrl, image_relative_path))
		    

	#print insert_data

	#  (old, path)
	#先下载， 然后整理成一份文档。 上传到服务器
	#这里会将所有的字段数据中的图片上传到服务上
	#print data
	# ftp_server, ftp_port, ftp_path, ftp_password, ftp_username
	# access_id, secret_access_key


	return insert_data

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
	seed_type = data["type"]
	if seed_type not in self.field_map:
	    self.field_map[seed_type] = {}

	if self.id not in self.field_map[seed_type]:
	    table_name, field_mapping = self.get_field_mapping(field_map)
	    profile = {
	        "table_name" : table_name,
	        "mapping" : field_mapping
	    }
	    profile["model"] = article_template(self.db_config, table_name)

	    #这里需要保证有数据库中的字段， 保证插入时候字段名正确 方式插入错误
	    profile["table_fields"] = profile["model"].get_fields()
	    self.field_map[seed_type][self.id] = profile

	if (self.id in self.field_map[seed_type]) and ("model" in self.field_map[seed_type][self.id]) and ("table_fields" in self.field_map[seed_type][self.id]):
	    db = self.field_map[seed_type][self.id]["model"]
	    map = self.field_map[seed_type][self.id]["mapping"]
	    table_fields = self.field_map[seed_type][self.id]["table_fields"]

	    #先将映射的数据放入进去。
	    insert_data = {
		"guid" : guid		
	    }
	    for k in map:
		field = map[k]
		insert_data[k] = data[field["name"]].value


	    hook_name = self.sync_profile["hook_func"]
	    hook_method = None;
	    if hook_name in dir(recipes):
		hook_method = getattr(recipes, hook_name)

	    if hook_method and callable(hook_method):
		try:
		    insert_data = hook_method(insert_data, data)
		except:
		    pass

	    #对insert_data进行修正。 如果返回了None表示 此数据不符合 将不会插入进去
	    if insert_data and isinstance(insert_data, dict):
		test_insert_data = insert_data;
		insert_data = {}

		for field in table_fields:
		    if field in test_insert_data:
			insert_data[field] = test_insert_data[field]
			if insert_data[field] == "None" or insert_data[field] is None:
			    insert_data[field] = ""
	    
		#处理数据， 看数据中的图片是否需要上传
		insert_data = self.upload_media(insert_data, data)
		#print insert_data
		"""
		try:
		    db.insert(**insert_data)
		except:
		    pass;
		"""

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

