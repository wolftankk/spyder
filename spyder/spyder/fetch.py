#coding: utf-8

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

import urllib2, urlparse, re, socket, zlib
from gzip import GzipFile
from StringIO import StringIO

from spyder.pyquery import PyQuery as pq
from spyder.pybits import ansicolor

__all__ = [
    'Fetch',
    'opener'
]

def deflate(data):
    try:
	return zlib.decompress(data, -zlib.MAX_WBITS)
    except zlib.error:
	return zlib.decompress(data)

'''
支持gzip格式的网页， 加快页面采集速度
'''
class ContentEncodingProcessor(urllib2.BaseHandler):
    #add header to request
    def http_request(self, req):
        req.add_header("User-Agent", "Mozilla/5.0")
	req.add_header("Accept-Encoding", "gzip, deflate")
	return req

    def http_response(self, req, resp):
	origin_resp = resp

	if resp.headers.get("content-encoding") == "gzip":
	    gz = GzipFile(fileobj=StringIO(resp.read()), mode="r")
	    resp = urllib2.addinfourl(gz, origin_resp.headers, origin_resp.url, origin_resp.code)
	    resp.msg = origin_resp.msg

	if resp.headers.get("content-encoding") == "deflate":
	    gz = StringIO(deflate(resp.read()))
	    resp = urllib2.addinfourl(gz, origin_resp.headers, origin_resp.url, origin_resp.code)
	    resp.msg = origin_resp.msg

	return resp

encoding_support = ContentEncodingProcessor
opener = urllib2.build_opener(encoding_support, urllib2.HTTPHandler)

'''
页面抓取
'''
class Fetch(object):
    def __init__(self, url, **config):
        self.url = url
	if "charset" in config:
	    self.charset = config['charset'];
	else:
	    self.charset = "utf-8"
	
	if "timeout" in config:
	    self.timeout = config["timeout"]
	else:
	    self.timeout = 300;

	if "tries" in config:
	    self.tries = config["tries"]
	else:
	    self.tries = 5

        self.site = None
	self.count = 1
	self.error = None

        self.connect();

    def retryConnection(self):
	if self.count <= self.tries:
	    self.connect();
	    self.count = self.count + 1
	    print "Retry connection %s, now Count %s" % (self.site, self.count)
	else:
	    return
        
    def getCode(self):
	return self.site.getcode()

    def isReady(self):
	return self.site.msg == "OK" if self.site else False

    def reset(self):
	self.count = 1
	self.site = None

    def getError(self):
	return self.error

    def connect(self):
        self.request = urllib2.Request(self.url);
        try:
	    #code, url, headers, msg
            self.site = opener.open(self.request, timeout = self.timeout)
	except urllib2.HTTPError, e:
	    self.error = e
	    pass
        except urllib2.URLError, e:
	    if isinstance(e.reason, socket.timeout):
		self.retryConnection();
	    else:
		self.error = e
		pass
	except socket.error, e:
	    self.retryConnection();
	finally:
	    pass

    def read(self):
        if self.site:
            doc = self.site.read()
            try:
                doc = doc.decode(self.charset);
                return doc
            except UnicodeDecodeError, e:
                #读取里面的metadata
                content = pq(doc).find("meta[http-equiv='Content-Type']").attr("content")
                result = None
                if content:
                    # html 
                    result = re.match(r'text\/html;\s+?charset=(.+)?', content)
                else:
                    # rss
                    #<?xml version="1.0" encoding="gb2312"?>
                    result = re.match(r'<\?xml\s+?version="1\.0"\s+?encoding="(.+)?"\s+?\?>', doc)
                if result:
                    charset = result.group(1)
		    '''
		    get new charset
		    '''
		    self.charset = charset;
                    try:
                        doc = doc.decode(charset)
                        return doc
                    except UnicodeDecodeError:
                        return doc.decode(charset, "ignore")
                else:
                    return doc.decode(self.charset, "ignore")
        else:
            return None


if __name__ == "__main__":
    f = Fetch("http://wow.178.com/", timeout=300, charset="gbk")
    print f.read() if f.isReady() else "111"
