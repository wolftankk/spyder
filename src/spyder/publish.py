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

live_website = {}

def create_model(self, name):
    '''
    create a db model
    '''

'''
website
'''
class Site(object):
    def __init__(self):
	pass


'''
将采集的数据发布到网站
'''
class Publish():
    site = {}
    def __init__(self, guid, data):
	'''
	初始化 把所有的网站都列出来， 并且进行数据推送
	'''
	print data



if __name__ == "__main__":
    db = Site_Model()
    r = db.view(1);
    if len(r):
	r = r.list()[0]
	sync_profile = r["sync_profile"]
	print unserialize(sync_profile)

