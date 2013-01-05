#coding=utf-8
import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

import re, urlparse
from libs.utils import now, safestr
from libs.phpserialize import serialize
import spyder.feedparser as feedparser
from spyder.pyquery import PyQuery as pq
from spyder.pybits import ansicolor
from hashlib import md5
from libs.utils import safestr, safeunicode

#import locale libs
from spyder.fetch import Fetch
from spyder.readability import Readability
from spyder.seed import Seed
from spyder.field import Field

##from dumpmedia import DumpMedia

__all__ = [
    "getElementData",
    "Document",
    "Grab"
]


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
    if not isinstance(obj, pq):
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
		    return safeunicode(selecteddom.text()).strip()
		elif action == "html" and hasattr(selecteddom, "html"):
		    return safeunicode(selecteddom.html()).strip()

    elif len(rule) == 1:
	'''
	可能时正则提取
	'''
	rule = rule.pop()
	# [参数]
	if rule.find('(*)'):
	    content = obj.text()
	    rule = rule.replace('(*)', '(.+)?')
	    if isinstance(content, unicode):
		rule = safeunicode(rule)
	    else:
		rule = safestr(rule)
	    parrent = re.compile(rule, re.MULTILINE | re.UNICODE)

	    result = parrent.search(content)
	    if result is not None:
		return safeunicode(result.group(1)).strip()
    
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
		
	    self.fetchArticles();
	else:
	    print "传入的种子不是Seed类型"


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

        print "List has finished parsing. It has %s docs." % ansicolor.red(len(self.items.items()))

    def fetchListPages(self):
        print "Start to fetch and parse List"
	urls = self.listRule.getListUrls()
        for url in urls:
	    print u"正在抓取列表页面： " + url + "charset: " + safestr(self.seed["charset"]) + "timeout: " + safestr(self.seed["timeout"])
            doc = Fetch(url, charset = self.seed["charset"], timeout = self.seed["timeout"])
	    if doc.isReady():
		doc = doc.read()
                self.parseListPage(doc, url)
        
        print "List has finished parsing. It has %s docs." % ansicolor.red(len(self.items.items()))
    
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
		#Field(key="url", value=link)

		for field_id, _rule in extrarules:
		    #print field_id, type(field_id) 
		    value = getElementData(e, _rule)
		    if value:
			self.items[guid][field_id] = value

	    if len(self.listRule.getEntryItem()) == 0:
		list.children().map(entry)
	    else:	
		list.find(self.listRule.getEntryItem()).map(entry)

    def fetchArticles(self):
	print ansicolor.cyan("Start fetching these articles", True)
        if len(self.items.items()) > 0:
            for guid in self.items:
		item = self.items[guid]
		self.items[guid]["article"] = Document(item["url"], self.seed)
    
#ImageWidthThreshold = 700 * 0.55
#ImageHeightThreshold = 30
r"""
    文章数据
    包括抓取， 分析， 提取
    
    '''
    包含的类型有article, game,
    这些类型 全部调用repice下的处理函数
    '''
"""
class Document(object):
    def __init__(self, url, seed):
	self.url = url
	self.data = {}

	self.seed = seed;

	#文章采集规则
	self.articleRule = seed.getRule().getArticleRule()
        print "Document %s is fetcing" % ansicolor.green(url)
        firstContent = Fetch(url, charset = seed["charset"], timeout = seed["timeout"]).read();
        self.parseDocument(firstContent)

    def _getContent(self, html, wrapparent, content_re):
	if not html:
	    return

	html = pq(html).find(wrapparent)
	_content = getElementData(html, content_re);
	if _content:
	#    #first save
	#    for image in self.tags(content, "img"):
	#        self.processingImage(image)
	#    #filter
	#    content = readability(content)

	    return _content
	#    if content:
	#        #strip
	#        try:
	#    	content = content.strip()
	#    	content = spp_reg.sub("", content)
	#        except:
	#    	pass
	#        self.content = self.content +  content

    def parseDocument(self, doc):
	#try:
	#    doc = self.regexps["replaceBrs"].sub("<p></p>", doc)
	#except:
	#    pass

        doc = pq(doc);

	wrapparent = self.articleRule.wrapparent
	pageparent = self.articleRule.pageparent
	content_re = "";

	#文本数据内容
	content = ""
	#文本中的图片数据
	images = []
	#初始化在第一页面
	first = True

        if first:
	    article = doc.find(wrapparent);
            #pages
	    if pageparent:
		urls = self.parsePage(article, pageparent)
            #need title, tags
	    extrarules = self.articleRule.extrarules

	    #只有文章是有content
	    if len(extrarules):
		for key, rule in extrarules:
		    field = Field(field_id=key, rule=rule);
		    value = getElementData(doc, rule)

		    '''
		    self.data[field.get('name')] = field
		    if field.is_article_content():
			content_re = field.get("rule")
		    else:
			print field, rule, value
			field.value = value
		    '''

		#print self.data

	    #采集分页内容
	    if urls and len(urls) > 0 and content_re:
		for next_url in urls:
		    next_page = Fetch(next_url, charset = self.seed["charset"], timeout = self.seed["timeout"]).read()
		    if next_page is not None:
			next_page = self._getContent(next_page, wrapparent, content_re);
			if next_page:
			    content += next_page

	    if content and content_re:
		self.data['content'] = content
		#get images

    def parsePage(self, doc, pageparent):
        pages = doc.find(pageparent + " a")
	urls = []

        if len(pages) > 0:
            for link in pages:
		if link is not None and link.tag == "a" and hasattr(link, "get"):
		    url = link.get("href");
		    '过滤掉是javascript的链接'
                    if re.match(r"javascript", url) == None:
                        url = urlparse.urljoin(self.url, url)
			if url not in urls:
			    urls.append(url)
		else:
		    continue;

	    self.data["pageurls"] = urls
	return urls


if __name__ == "__main__":
    from web.models import Seed as Seed_Model
    db = Seed_Model();
    r = db.view(2);
    seed = Seed(r.list()[0])
    #Grab(seed, False)
    Document("http://www.kaifu.com/articlecontent-40336-0.html", seed)

#    url = "http://www.kaifu.com/articlecontent-39510-0.html"
#    doc = Fetch(url).read();
#    doc = pq(doc)
#
#    content = doc.find("div[class='fl newsinfo_topline boder_base newsinfo_left']");
#    #print doc.find('div.newsinfo_topline')
#    #print content.eq(0).find("h6.lh40");
#
#    content = content.text();
#    p = "来源：(.+)?浏"
#    if isinstance(content, unicode):
#	p = safeunicode(p)
#    else:
#	p = safestr(p)
#
#    print p
#    p = re.compile(p, re.M | re.UNICODE);
#    print p
#    r = p.search(content);
#    print r
#    if r is not None:
#	print r.group(1).strip()
    

    '''
    def __getitem__(self, item):

    def __setitem__(self, item, value):

    def __contains__(self, id):

    def __iter__(self):

    def keys():
    '''

    '''
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
    '''

    '''
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
    '''
