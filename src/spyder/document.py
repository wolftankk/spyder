#coding=utf-8

import time
from pyquery import PyQuery as pq
from pybits import ansicolor
import re, urlparse
from db import Store
import _mysql
from fetch import Fetch
r"""
 getElementData(doc, "a", text)
	=> pq(doc.find("a").text())

	@href => getAttr
	#text => method

"""
def getElementData(obj, token):
	#parse token
	p = re.compile("(\w+?)\[([@|#])?(\w+)?\]");
	m = p.match(token);
	if m:
		tag, flag, val = m.groups() 
		d = pq(obj.find(tag))
		if flag == "@":
			return d.attr(val);
		elif flag == "#":
			#目前没找其他方法....
			return eval("d."+val+"()");

#Grab List
class Grab(object):
	def __init__(self, seed):
		rule = seed.rule;
		self.listRule = rule.getListRule();
		self.listRule.setPrefixUrl(seed.prefixurl);
		self.prefixurl = seed.prefixurl;
		listUrls = self.listRule.getFormatedUrls();
		self.items = {}
		for url in listUrls:
			doc = Fetch(url, seed.charset, seed.timeout).read()
			if doc:
				self.parseDoc(doc)
		
		if len(self.items.items()):
			for url in self.items:
				self.items[url]["article"] = Document(url, seed)
	
	def parseDoc(self, doc):
		doc = pq(doc);
		list = doc.find(self.listRule.getListParent());
		if list:
			def entry(i, e):
				#link
				url = self.listRule.getItemLink()
				link = getElementData(e, url)
				link = urlparse.urljoin(self.prefixurl, link);

				#title
				title = getElementData(e, self.listRule.getItemTitle());

				#date
				dateparent = self.listRule.getItemDate();
				date = None
				if dateparent:
					date = getElementData(e, self.listRule.getItemDate());


				self.items[link] = {
					"url" : link,
					"title" : title,
					"date" : date
				}

			list(self.listRule.getEntryItem()).map(entry)

class Document(object):
	def __init__(self, url, seed):
		self.url = url;
		self.articleRule = seed.rule.getArticleRule();

		self.content = ""
		self.pages   = []
		self.contentData = {}
		self.sid = seed.sid

		if self.checkUrl(url) == False:
			self.firstPage = Fetch(url, seed.charset, seed.timeout).read();
			self.parse(self.firstPage, True)
			self.contentData["content"] = self.content
			#print self.contentData
			if self.saveArticle() > 0:
				print ansicolor.green(self.url) + " saved!"

			#save data into mysql

	def checkUrl(self, url):
		#check url in articles
		return Store("SELECT aid FROM spyder.articles WHERE url='%s'" % self.url).is_exists()

	def saveArticle(self):
		content = ""
		title = ""
		tags = ""
		author = ""
		date = ""

		if "content" in self.contentData:
			if not self.content:
				return
			content = (self.contentData["content"]).encode("utf-8", "ignore")
			content = _mysql.escape_string( content )

		if "title" in self.contentData:
			title = self.contentData["title"]
			title = _mysql.escape_string(title.encode("utf-8", "ignore"))

		sql = "INSERT INTO spyder.articles (title, content, url, sid, status, fetchtime) VALUES ('%s', '%s', '%s', '%s', '%s', '%s')" % (title, content, self.url, str(self.sid), "1", str(int(time.time())))
		
		return Store(sql).insert_id()

	def getContentData(self):
		return self.contentData

	def parse(self, doc, first=False):
		doc = pq(doc);
		article = doc.find(self.articleRule.getWrapParent())

		def getContent():
			content = article(self.articleRule.getContentParent()).html()
			if content:
				self.content = self.content +  content

		if first:
			#need parse pages, title, tags

			####title
			self.contentData["title"] = getElementData(article, self.articleRule.getTitleParent())

			#pages
			self.parsePage(article)
			
			#get content
			getContent();

			for purl in self.pages:
				self.parse(purl)

		#context
		#_context = article("div[class='contF']").remove("script").remove('p[align="right"]')
		getContent();


	def parsePage(self, doc):
		p = self.articleRule.getPageParent()
		if len(p) == 0:
			return
		pages = doc.find(p)
		if len(pages):
			for p in pages:
				p = pq(p)
				url = p.attr("href")
				linkText = p.text().strip()
				if re.match(r"[0-9]+?", linkText):
					#filter javascript
					if re.match(r"javascript", url) == None:
						url = urlparse.urljoin(self.url, url)
						self.pages.append(url)


if __name__ == "__main__":
	r"""
	#news list
	import urllib
	url = "http://www.265g.com/chanye/industry/"
	site = Fetch(url, "gbk")
	doc = site.read()

	d = pq(doc)

	#listparent
	list = d.find("div[class=cont_list]ul")

	newslist = []

	def entry(i, e):
		#find title
		link = pq(e.find("a"))
		title = link.text()
		#find url
		url =  link.attr("href")
		#find date
		date = pq(e.find("em")).text()

		newslist.append({
			"url" : url,
			"title" : title,
			"date" : date
		})

	##entry
	list("li").map(entry)
	prefix = "http://www.265g.com"
		
	for k in newslist[:]:
		url = k["url"];
		title = k["title"]
		print "Fetching "+ansicolor.yellow(title) + " " + url;
		_site = urllib.urlopen(prefix+url);
		doc = _site.read().decode("gbk")
		doc = pq(doc);
		article = doc.find("div[class='box02 mar_t0 mar_b5']")
		context = ""
		
		#page 只从第一页去分析抓去
		pages = article.find("div[class=pag2]a")
		_pages = []
		if len(pages):
			for p in pages:
				p = pq(p);
				href = p.attr("href")
				pcontext = p.text();
				if re.match(r"[0-9]+?", pcontext):
					#filter javascript
					if re.match(r"javascript", href) == None:
						_pages.append(href)
		#find title
		print article("h3").text().strip()
		#find tags
		#find author

		#find context
		#filter
		def getContext(article):
			_context = article("div[class='contF']").remove("script").remove('p[align="right"]')
			return _context.html()

		context = getContext(article)
		if _pages and len(_pages):
			for p in _pages:
				u = prefix+"/chanye/industry/"+p
				_site = urllib.urlopen(u);
				doc = _site.read().decode("gbk")
				doc = pq(doc);
				article = doc.find("div[class='box02 mar_t0 mar_b5']")
				context = context + getContext(article);
		print context
	"""
