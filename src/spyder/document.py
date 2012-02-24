#coding=utf-8

from pyquery import PyQuery as pq
from pybits import ansicolor
import re

class Document(object):
	def __init__(self, doc):
		self.doc = doc
		try:
			self.query = pq(doc);
		except e:
			print e




if __name__ == "__main__":
	#news list
	import urllib
	url = "http://www.265g.com/chanye/industry/"
	site = urllib.urlopen(url)
	doc = site.read().decode("gbk")
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
		#print article("h3").text().strip()
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

