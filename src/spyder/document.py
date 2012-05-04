#coding=utf-8

import time
from pyquery import PyQuery as pq
from pybits import ansicolor
import re, urlparse
from db import Store
import _mysql
from fetch import Fetch
import feedparser
from dumpmedia import DumpMedia
import config, lxml

ImageWidthThreshold = 700 * 0.55
ImageHeightThreshold = 30

r"""
 Get the attr or the method of the document
  @ get the attr
  # the document method func

  @param Obj Doc
  @param token 
  @isFilter return element when it's true, else return val
"""
def getElementData(obj,token, isFilter=False):
    #parse token
    p = re.compile("(\w+?)\[(.+)?]");
    methodParrent = re.compile("([#|@]?)(\w+)(=?[\'|\"](.+)[\'|\"])?")
    m = p.match(token);
    if m:
        tagName, methods = m.groups() 
        methods = methods.split(",")
        if len(methods) > 0:
            elements = pq(obj).find(tagName)

            if elements is None:
                return None

            #目前只取第一个
            methodMatch = methodParrent.match(methods[0])
            flag, tag, r, val = methodMatch.groups()

            for element in elements:
                if flag == "@":
		    result = element.get(tag)
		    if isFilter:
			if val and result:
			    if (val == result):
				return element
				break;
		    else:
			return result
                elif flag == "#":
                    try:
			if isFilter:
			    result = getattr(pq(element), tag)()
			    if val and result:
			        if (isinstance(val, str)):
			            val = unicode(val, "utf8")
			        
			        r = re.search(val, result);
			        if r:
				    return element
			            break;
			else:
			    result = getattr(pq(element), tag)()
			    return result
                    except AttributeError:
                        return ""
    return None


r"""
    Grab articles List
"""
class Grab(object):
    def __init__(self, seed, savable = True):
        rule = seed.rule;
        self.seed = seed
        self.savable = savable
        self.type = seed.type

        self.items = {}
        if self.type == "feed":
            self.parseFeed();
        else:
            self.listRule = rule.getListRule();
            self.listRule.setPrefixUrl(seed.prefixurl);
            self.prefixurl = seed.prefixurl;
            self.fetchPage();

        self.fetchArticles();

    def parseFeed(self):
        print "Start to fetch and parse Feed list"
        seed = self.seed
        doc = Fetch(seed.prefixurl, seed.charset, self.seed.timeout).read();
        feed = feedparser.parse(doc)
        items = feed["entries"]
        if len(items) > 0:
            for item in items:
                link = item["link"]
                title = item["title"]
                date = item["published"]
                self.items[link] = {
                    "url" : link,
                    "title" : title,
                    "date" : date
                }

        print "List has finished parsing. It has %s docs." % ansicolor.red(len(self.items.items()));

    def fetchPage(self):
        print "Start to fetch and parse List"
        listUrls = self.listRule.getFormatedUrls();
        for url in listUrls:
            doc = Fetch(url, self.seed.charset, self.seed.timeout).read()
            if doc:
                self.parserHtml(doc)
        
        print "List has finished parsing. It has %s docs." % ansicolor.red(len(self.items.items()));
    
    def fetchArticles(self):
        if len(self.items.items()) > 0:
            for url in self.items:
                self.items[url]["article"] = Document(url, self.seed, self.savable)
    
    def parserHtml(self, doc):
        doc = pq(doc);
        list = doc.find(self.listRule.getListParent());
        if list:
            def entry(i, e):
                #link
                url = self.listRule.getItemLink()
		if e.tag == "a":
		    link = e.get("href")
		else:
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

	    if len(self.listRule.getEntryItem()) == 0:
		list.children().map(entry)
	    else:	
		list(self.listRule.getEntryItem()).map(entry)

r"""
    Fecth and parser Article page
"""
class Document(object):
    def __init__(self, url, seed, savable = True):
        self.url = url;
        self.articleRule = seed.rule.getArticleRule();

        self.content = ""
        self.pages   = []
        self.contentData = {}
        self.sid = seed.sid
        self.savable = savable
        self.filterscript = self.articleRule.filterscript
	self.lang = seed.lang
	self.seed = seed
        
        if self.checkUrl(url) == False or not self.savable:
            print "Document %s is fetcing" % ansicolor.green(url)
            self.firstPage = Fetch(url, seed.charset, seed.timeout).read();

            self.fetchDocument(self.firstPage, True)

            self.contentData["content"] = self.content

            if self.saveArticle() > 0:
                print ansicolor.green(self.url) + " saved!"
        else:
            print "Document %s has exists." % ansicolor.red(url)

    def checkUrl(self, url):
        #check url in articles
        return Store("SELECT aid FROM spyder.articles WHERE url='%s'" % self.url).is_exists()

    def saveArticle(self):
        content = ""
        title    = ""
        tags    = ""
        author    = ""
        date    = ""

        if "content" in self.contentData:
            if not self.content:
                return
            content = content.strip();
            content = (self.contentData["content"]).encode("utf-8", "ignore")
            content = _mysql.escape_string( content )

        if "title" in self.contentData:
            title = self.contentData["title"].strip()
            title = _mysql.escape_string(title.encode("utf-8", "ignore"))

        self.url = self.url.encode("utf-8", "ignore")

        sql = "INSERT INTO spyder.articles (lang, title, content, url, sid, status, fetchtime) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s')" % (self.lang, title, content, self.url, str(self.sid), "0", str(int(time.time())))
        
        if not self.savable:
            #for test print
            print title, self.url, content
            return

        return Store(sql).insert_id()

    def getContentData(self):
        return self.contentData

    def _filter(self, content):
        if self.filterscript:
            content = content.remove("script");

	#过滤所有文章中的a链接
	def filterLink(i, element):
	    for k in element.attrib:
		del element.attrib[k]
	    element.drop_tag()

	content("a").each(filterLink)

        if len(self.articleRule.filters) > 0:
            for filter in self.articleRule.filters:
                element = getElementData(content, filter, True)
		if element is not None:
		    element.getparent().remove(element);

	# clean html
	def do(i, element):
	    if (isinstance(element, lxml.html.HtmlComment)):
		element.getparent().remove(element)
	content.children().each(do)
	#end clean html

        return content

    def getImage(self, url):
        #fetch img
        return DumpMedia(self.url, url)

    def processingImage(self, image):
	#首先处理图片层
	parent = image.getparent()

	if parent is not None and parent.tag is "a":
	    parentAttrs = parent.attrib
	    for k in parentAttrs:
		del parentAttrs[k]
	    parent.drop_tag()

	imgKW = ["src", "alt", "width", "height"];
	imgAttrs = image.attrib
	for k in imgAttrs:
	    if k not in imgKW:
		del imgAttrs[k]

	imgSrc = image.get("src");
	imgSrc = urlparse.urljoin(self.url, imgSrc);
	image.set("src", imgSrc);
	imageInfo = DumpMedia(self.url, imgSrc)

	width, height = imageInfo.getSize()
	if width < ImageWidthThreshold:
	    image.set("class", "asideImg")
	#if (width > ImageWidthThreshold):
	#    image.set("class", "blockImage")
	#else:
	#    image.set("class", "leftImage")

	# save img
	if config.storeImage:
	    if image.get("src"):
		imgurl = image.get("src")
		#save imgurl
		if imageInfo.write():
		    new_imgurl = imageInfo.getMediaName()
		    if new_imgurl:
			print new_imgurl
			imgurl = image.set("src", new_imgurl)

    def fetchDocument(self, doc, first=False):
        doc = pq(doc);
        article = doc.find(self.articleRule.getWrapParent())

        def getContent():
            if not article:
                return
            content = article(self.articleRule.getContentParent())
            if content:
		#first save
		for image in content.find("img"):
		    self.processingImage(image)
                #filter
                content = self._filter(content)
		
		content = self.readability(content)

                content = content.html();
                if content:
                    self.content = self.content +  content

        if first:
            #need parse pages, title, tags
            self.contentData["title"] = getElementData(article, self.articleRule.getTitleParent())

            #pages
            self.parsePage(article)
            #get content
            getContent();
            article = None #fetch over
            for purl in self.pages:
		ppage = Fetch(purl, self.seed.charset, self.seed.timeout).read();
		if ppage is not None:
		    self.fetchDocument(ppage)

        getContent();

    def parsePage(self, doc):
        p = self.articleRule.getPageParent()
        if len(p) == 0:
            return
        pages = doc.find(p)

        if len(pages) > 0:
            for p in pages:
                p = pq(p)
                url = p.attr("href")
                if not url:
                    continue
                linkText = p.text().strip()
                if re.match(r"[0-9]+?", linkText):
                    #filter javascript
                    if re.match(r"javascript", url) == None:
                        url = urlparse.urljoin(self.url, url)
                        self.pages.append(url)

    def tags(self, node, *tag_names):
	for tag_name in tag_names:
	    for e in node.find(tag_name):
		yield e

    def clean_attributes(self, content):
	if content.tag == "font":
	    content.tag = "span"

	if content.tag == "center":
	    content.tag = "div"

	for att in ["color", "width", "height", "background", "style", "class", "id"]:
	    if content.get(att) is not None:
		del content.attrib[att]

    def readability(self, content):
	origin_content = content
	try:
	    for e in self.tags(content, "hr", "font", "p", "span", "div", "ul", "li", "from", "iframe", "center"):
	        self.clean_attributes(e)

	    return content
	except:
	    return origin_content
	    pass



if __name__ == "__main__":
    r"""
    html, RSS, Atom, Ajax
    """
