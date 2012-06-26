#coding: utf-8

from pyquery import PyQuery as pq
import urllib2, urlparse, re
import socket
from gzip import GzipFile
from StringIO import StringIO
from pybits import ansicolor
import zlib

__all__ = [
    'Fetch',
    'opener'
]

def deflate(data):
    try:
	return zlib.decompress(data, -zlib.MAX_WBITS)
    except zlib.error:
	return zlib.decompress(data)

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

class Fetch(object):
    def __init__(self, url, charset, timeout = 300):
        self.url = url
        self.charset = charset
        self.timeout = timeout
        self.site = None
	self.count = 1

        self.openSite();
        
    def openSite(self):
        self.request = urllib2.Request(self.url);
        try:
            self.site = opener.open(self.request, timeout = self.timeout)
	except urllib2.HTTPError, e:
	    pass
        except urllib2.URLError, e:
	    if isinstance(e.reason, socket.timeout):
		if self.count <= 5:
		    self.openSite()
		    self.count = self.count + 1
		else:
		    pass
	    else:
		pass
	except socket.error, e:
	    if self.count <= 5:
		self.openSite()
		self.count = self.count + 1
	    else:
		pass
	finally:
	    pass

    def read(self):
        if self.site:
            doc = self.site.read()
            try:
                doc = doc.decode(self.charset);
                return doc
            except UnicodeDecodeError:
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
    print Fetch("http://www.gamer.com.tw/", "gbk").read()
