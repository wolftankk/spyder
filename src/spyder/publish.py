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
from _mysql import escape_string

from web.models import Site as Site_Model
from web.models import Site_map

'''
website
'''
class Site(object):
    def __init__(self, data):
	if "sync_profile" in data:
	    sync_profile = data.pop("sync_profile")
	    sync_profile = unserialize(sync_profile)
	    self.sync_profile = sync_profile

	self.profile = data
	self.id = data["id"]
	

'''
将采集的数据发布到网站
'''
class Publish():
    def __init__(self):
	'''
	初始化 把所有的网站都列出来， 并且进行数据推送
	'''
	self.sites = {}
	self.site_by_category = {}
	self.init_sites()

	self.mapdb = Site_map()

    def get_site(self, site_id):
	'''
	获得站点数据， 如果不存在将会从数据库中重新读取
	'''
	pass

    def init_sites(self):
	db = Site_Model();
	query = db.select();
	r = query.list();

	for s in r:
	    if s and "id" in s:
		self.sites[s["id"]] = Site(s)

    def push(self, guid, data):
	'''
	发布接口
	将发布的数据解析类型。 根据类型找到site_id
	然后发布出去
	'''
	seed_type = data["type"]
	
	

if __name__ == "__main__":
    p = Publish()
    p.push("adsdada", {"type" : "article"})
    '''
    db = Site_Model()
    r = db.view(1);
    if len(r):
	r = r.list()[0]
	sync_profile = r["sync_profile"]
	print unserialize(sync_profile)
    '''

