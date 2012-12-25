#coding=utf-8
import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

import re, urlparse
from libs.utils import now
from libs.phpserialize import serialize
import spyder.feedparser as feedparser
from spyder.pyquery import PyQuery as pq
from spyder.pybits import ansicolor
from hashlib import md5

#import locale libs
from fetch import Fetch
from readability import readability
from seed import Seed

##from dumpmedia import DumpMedia
##import config, lxml
#import urllib2, urllib, json

#__all__ = [
#    "getElementData",
#    "Document",
#    "Grab"
#]

spp_reg = re.compile(u"""[　]*""", re.I|re.M|re.S)

'''
获得dom元素信息
rule类似于Jquery的方式 所以只要提取出来即可

attr
text
_is
eq
'''
attrParrent = re.compile("(\w+)?\((.+)?\)");

def getElementData(obj, rule):
    obj = pq(obj);

    rule = rule.split(".")
    
    if len(rule) > 1:
	#第一个永远是dom选择
	selectRule = rule.pop(0)
	selecteddom = obj.find(selectRule);
	
	for attr in rule:
	    m = attrParrent.match(attr)
	    if m:
		action, v = m.groups()
		if v:
		    v = v.encode("utf-8")
		    #去除引号
		    v = v.strip("\'").strip('\"');

		if action == "attr" and hasattr(selecteddom, "attr") and v:
		    return selecteddom.attr(v)
		elif action == "eq" and hasattr(selecteddom, "eq"):
		    return selecteddom.eq(int(v))
		elif action == "text" and hasattr(selecteddom, "text"):
		    return selecteddom.text()

    elif len(rule) == 1:
	'''
	可能时正则提取
	'''
	rule = rule.pop()
	if rule.find('(*)'):
	    parrent = re.compile(rule.replace('(*)', '(.+)?'))
	    content = obj.text()
	    result = parrent.findall(content)
	    if result and len(result) > 0:
		return result[0]
    
    return None

r"""
从种子表中获得并且分析成文章数据
"""
class Grab(object):
    def __init__(self, seed, savable = True):
	if isinstance(seed, Seed):
	    self.items = {}
	    self.seed = seed
	    self.savable = savable

	    rule = seed.getRule();

	    listtype = seed["listtype"]
	    if listtype == "feed":
		self.parseFeed();
	    else:
		'html'
		self.listRule = rule.getListRule();
	        self.fetchListPages();
	else:
	    print "传入的种子不是Seed类型"

        #self.fetchArticles();

    def parseFeed(self):
        print "Start to fetch and parse Feed list"
        seed = self.seed
        doc = Fetch(seed.prefixurl, seed.charset, self.seed.timeout).read();
        feed = feedparser.parse(doc)
        items = feed["entries"]
        if len(items) > 0:
            for item in items:
                link = item["link"]
		guid = md5(link).hexdigest()
                self.items[guid] = {
                    "url" : link,
                }

        print "List has finished parsing. It has %s docs." % ansicolor.red(len(self.items.items()));

    def fetchListPages(self):
        print "Start to fetch and parse List"
	urls = self.listRule.getListUrls()
        for url in urls:
	    print u"正在抓取列表页面： " + url, "charset: " + self.seed["charset"], "timeout: " + str(self.seed["timeout"]);
            doc = Fetch(url, charset = self.seed["charset"], timeout = self.seed["timeout"])
	    if doc.isReady():
		doc = doc.read()
                self.parseListPage(doc, url)
        
        print "List has finished parsing. It has %s docs." % ansicolor.red(len(self.items.items()));
    
    def parseListPage(self, doc, listurl):
	'''
	分析采集回来的页面
	@param doc 页面String stream
	@param url link
	'''
        doc = pq(doc);
        list = doc.find(self.listRule.getListParent());
	extrarules = self.listRule.extrarules

        if list:
            def entry(i, e):
                #link
                urlParent = self.listRule.getContentUrl()
		if e.tag == "a":
		    link = e.get("href")
		else:
		    link = getElementData(e, urlParent)

                link = urlparse.urljoin(listurl, link);
		guid = md5(link).hexdigest()

		self.items[guid] = {}
		self.items[guid]["url"] = link

		for key, _rule in extrarules:
		    value = getElementData(e, _rule)
		    if value:
			self.items[guid][key] = value

	    if len(self.listRule.getEntryItem()) == 0:
		list.children().map(entry)
	    else:	
		list.find(self.listRule.getEntryItem()).map(entry)

    def fetchArticles(self):
        if len(self.items.items()) > 0:
            for url in self.items:
                self.items[url]["article"] = Document(url, self.seed, self.savable, self.items[url])
    

if __name__ == "__main__":
    from web.models import Seed as Seed_Model
    db = Seed_Model();
    r = db.view(2);
    seed = Seed(r.list()[0])
    Grab(seed, False)





ImageWidthThreshold = 700 * 0.55
ImageHeightThreshold = 30

r"""
    Fecth and parser Article page
"""
class Document(object):
    regexps = {
	"replaceBrs" : re.compile("(<br[^>]*>[ \n\r\t]*){2,}", re.I),

    }

    def __init__(self, url, seed, savable = True, info = None):
        self.url = url;
        self.articleRule = seed.rule.getArticleRule();

        self.content = ""
        self.pages   = []
        self.contentData = {}
	self.images = []
        self.sid = seed.sid
        self.savable = savable
        self.filterscript = self.articleRule.filterscript
	self.lang = seed.lang
	self.seed = seed
	self.info = info
        
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
        return Store("SELECT aid FROM articles WHERE url='%s'" % self.url).is_exists()

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
            title = self.contentData["title"];
	    if title is None:
		if self.info and self.info["title"]:
		    title = self.info["title"]

	    if title is None:
		print self.url + " is broken, SKIP!";
		return

	    title = title.strip()
            title = _mysql.escape_string(title.encode("utf-8", "ignore"))

        self.url = self.url.encode("utf-8", "ignore")
	self.images = serialize(self.images)

        sql = "INSERT INTO articles (lang, title, content, images, url, sid, status, fetchtime) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')" % (self.lang, title, content, self.images, self.url, str(self.sid), "0", str(int(time.time())))
        
        if not self.savable:
            #for test print
            print title, self.url, content
            return

        itemid = Store(sql).insert_id()

	if config.autoPublicPost:
	    public_article(itemid, self.seed.cid, self.seed.gameid)
	
	return itemid;

    def getContentData(self):
        return self.contentData

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

	if imageInfo.fetched:
	    width, height = imageInfo.getSize()
	    if width < ImageWidthThreshold:
		image.set("class", "asideImg")
	    #if (width > ImageWidthThreshold):
	    #    image.set("class", "blockImage")
	    #else:
	    #    image.set("class", "leftImage")

	if config.storeImage and self.savable:
	    if imageInfo.write():
		new_imgurl = imageInfo.getMediaName()
		if new_imgurl:
		    print new_imgurl
		    self.images.append(new_imgurl)
		    imgurl = image.set("src", new_imgurl)
	    else:
		#remove
		try:
		    parent.remove(image)
		except:
		    pass

    def fetchDocument(self, doc, first=False):
	#prehook
	try:
	    doc = self.regexps["replaceBrs"].sub("<p></p>", doc)
	except:
	    pass

        doc = pq(doc);
        article = doc.find(self.articleRule.getWrapParent())

        def getContent():
            if not article:
                return
            content = article(self.articleRule.getContentParent())
            if content:
		#first save
		for image in self.tags(content, "img"):
		    self.processingImage(image)
                #filter
		content = readability(content)

                content = content.html();
                if content:
		    #strip
		    try:
			content = content.strip()
			content = spp_reg.sub("", content)
		    except:
			pass
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

