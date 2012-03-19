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
import config

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
        
        if self.checkUrl(url) == False or not self.savable:
            print "Document %s is fetcing" % ansicolor.green(url)
            self.firstPage = Fetch(url, seed.charset, seed.timeout).read();
            self.parse(self.firstPage, True)
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

        sql = "INSERT INTO spyder.articles (title, content, url, sid, status, fetchtime) VALUES ('%s', '%s', '%s', '%s', '%s', '%s')" % (title, content, self.url, str(self.sid), "0", str(int(time.time())))
        
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

        if len(self.articleRule.filters) > 0:
            for filter in self.articleRule.filters:
                element = getElementData(content, filter, True)
		if element is not None:
		    element.clear()

        return content

    def _saveImages(self, url):
        #fetch img
        m = DumpMedia(self.url, url)
        return m.getMediaName()

    def _saveMediaToLocale(self, content):
        #image, flash, mp4?
        # IMG
        images  = content.find("img")
        if len(images) > 0:
            for image in images:
                #首先处理图片层
                parent = image.getparent()
                if parent is not None and parent.tag is "a":
                    parent.tag = "p"
                    #移除属性
                    parentAttrs = parent.attrib
                    for k in parentAttrs:
                        del parentAttrs[k]

                imgKW = ["src", "alt", "width", "height"];
                imgAttrs = image.attrib
                #remove some attrs
                for k in imgAttrs:
                    if k not in imgKW:
                        del imgAttrs[k]
		#补充img url
		imgSrc = image.get("src");
		imgSrc = urlparse.urljoin(self.url, imgSrc);
		image.set("src", imgSrc);

                # save img
		if config.storeImage:
                    if image.get("src"):
                        imgurl = image.get("src")
                        #save imgurl
                        new_imgurl = self._saveImages(imgurl)
                        if new_imgurl:
                            print new_imgurl
                        imgurl = image.set("src", new_imgurl)

        #find swf? 

        return content

    def parse(self, doc, first=False):
        doc = pq(doc);
        article = doc.find(self.articleRule.getWrapParent())

        def getContent():
            if not article:
                return
            content = article(self.articleRule.getContentParent())
            if content:
                #filter
                content = self._filter(content);
                content = self._saveMediaToLocale(content);
                
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
                self.parse(purl)

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


if __name__ == "__main__":
    r"""
    html, RSS, Atom, Ajax
    """
    #test token
    # remove
    #a[@href="xxxx"]
    #a[#text="aaaa"]
    #a[@href="oo", #text="bbb", class="xxx"]

    #obj = pq('<div><a class="hello" href="xxxx">ccccc</a><a href="vvv"></a></div>')
    ##print getElementData(obj,"a[@href,@class='hello']")
    #print getElementData(obj,"a[#text]")
    #print getElementData(obj,"a[@href='xxxx']")
    #print getElementData(obj,"a[#text='cccc']")
    ##getElementData(obj,"a[@href='xxxx',  #text='ccccc']")

    obj = pq("""aaa<!--xxx-->ddd<table>
        <tr> <td><em>test1</em></td><td><a href="asd">dad</a></td> </tr>
        <tr> <td><em>test2</em></td><td><a href="vsa">dad</a></td> </tr>
        <tr> <td><em>test3</em></td><td><a href="bwq">da</a></td> </tr>
    </table>""")

    print obj.html();
