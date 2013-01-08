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
from _mysql import escape_string

from spyder.field import get_field_from_cache

class Site():
    def __init__(self, data):
	if "sync_profile" in data:
	    sync_profile = data.pop("sync_profile")

	for k in data:
	    self[k] = data[k]

	print self.status

'''
将采集的数据发布到网站
'''
class Publish():
    def __init__(self):
	'''
	初始化 把所有的网站都列出来， 并且进行数据推送
	'''
	self.site = {}
	self.init_sites()

    def init_sites(self):
	'''
	初始化站点数据
	'''
	db = Site_Model()
	query = db.select();
	r = query.list()

	for s in r:
	    self.site[s["id"]] = Site(s)

    def push(self, guid, data):
	'''

	'''


if __name__ == "__main__":
    p = Publish()
    '''
    db = Site_Model()
    r = db.view(1);
    if len(r):
	r = r.list()[0]
	sync_profile = r["sync_profile"]
	print unserialize(sync_profile)
    '''

