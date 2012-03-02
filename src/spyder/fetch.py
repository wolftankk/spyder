#coding: utf-8

from pyquery import PyQuery as pq
import urllib2, urlparse, re
from pybits import ansicolor

class Fetch(object):
	def __init__(self, url, charset, timeout = 300):
		self.url = url;
		self.charset = charset;
		self.timeout = timeout;
		self.site = None

		self.openSite();
		
	def openSite(self):
		self.request = urllib2.Request(self.url);
		self.request.add_header("User-Agent", "Mozilla/5.0");
		try:
			self.site = urllib2.urlopen(self.request, timeout = self.timeout)
		except urllib2.HTTPError, e:
			print (self.url, e)

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
					result = re.match(r'<\?xml\s+?version="1\.0"\s+?encoding="(.+)?"\?>', doc)

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
	Fetch("http://www.265g.com/news/201105/132396.html", "gbk").read()
