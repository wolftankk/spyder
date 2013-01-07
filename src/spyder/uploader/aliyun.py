#coding: utf-8

import os, sys
parentdir = os.path.realpath(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".."))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from libs.oss import oss_api
from libs.oss import oss_xml_handler 


#u'access_id': u'ACSUdnnvmrXfgall'
#u'secret_access_key': u'r8wybyBOs5'
class Aliyun():
    HOST="oss.aliyuncs.com"
    def __init__(self, access_id, secret_access_key):
	access_id = access_id
	secret_access_key = secret_access_key

	self.buckets = []

	self.oss = oss_api.OssAPI(self.HOST, access_id, secret_access_key)
	
	self.list_bukets()

    def list_bukets(self):
	res = self.oss.get_service()
	if res.status == 200:
	    body = res.read()
	    h = oss_xml_handler.GetServiceXml(body)
	    #print "bucket list size is: ", len(h.list())
	    #print "bucket list is: "
	    #for i in h.list():
	    #	print i
	else:
	    print res.status

    def add_bucket(self):
	'''
	'''

    def delete_bucket(self):
	'''
	'''

    def delete(self):
	'''
	'''
    
    def upload(self):
	'''
	'''

if __name__ == "__main__":
    s = Aliyun('ACSUdnnvmrXfgall', 'r8wybyBOs5')
