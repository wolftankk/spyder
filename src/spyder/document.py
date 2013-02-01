#coding=utf-8
import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

import re, urlparse
from hashlib import md5

import spyder.feedparser as feedparser
from spyder.pyquery import PyQuery as pq
from spyder.pybits import ansicolor
from libs.utils import safestr, safeunicode
from spyder.fetch import Fetch
from spyder.readability import Readability
from spyder.seed import Seed
import json
from spyder.field import Field, Item, get_field_from_cache
from spyder.publish import publish_server

__all__ = [
    "getElementData",
    "Document",
    "Grab"
]

images_type = ["jpg", "jpeg", "png", "gif"]

def is_image(url):
    attrs = url.split(".")
    attr = attrs[-1]
    if attr in images_type:
	return True
    else:
	return False

attrParrent = re.compile("(\w+)?\((.+)?\)");
def getElementData(obj, rule, images=None, fetch_all=0):
    """
    根据rule对obj的进行解析
    obj可以是pq后的对象， 也可以是html页面
    images将会把解析过程的image连接插入此表中

    规则可以有两种模式：
    1. DOM selector
	1.1 选择器类似于jquery 比如你要某个a的url
	    >> a.attr("href")
	1.2 需要一个标签内的文本内容
	    >> div[id="content"].text()
	1.3 需要获得某个子元素中的内容
	    >> li.eq(1).text()    #li元素组中的第2个文本内容
    2. 正则模式
	正则模式需要的内容使用[arg]标签，其余可以使用(*)填充
    """
    if not isinstance(obj, pq):
	obj = pq(obj);
    
    old_rule = rule
    rule = rule.split(".")
    
    #避免有url链接
    if len(rule) > 1 and old_rule.find("[arg]") == -1:
	#第一个永远是dom选择
	selectRule = rule.pop(0)
	#移除 ( )
	selectRule = selectRule.replace("(", "");
	selectRule = selectRule.replace(")", "");

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
		    if fetch_all == 1:
			values = []
			dom_count = len(selecteddom)

			for i in range(dom_count):
			    vv = selecteddom.eq(i).attr(v)
			    if vv:
				values.append(vv)
				if is_image(vv):
				    images.append(vv)
			
			return values
		    else:
			value = selecteddom.attr(v)
			if selecteddom and selecteddom[0].tag == "img" and v == "src" and images is not None:
			    images.append(value)

			return value
		elif action == "eq" and hasattr(selecteddom, "eq"):
		    _rules = attr.split(" ")
		    if len(rule) > 1:
			selecteddom = selecteddom.eq(int(v))
			if len(_rules) > 1:
			    '''
			    假设eq后面还有子元素
			    eq(1) a
			    '''
			    _rules.pop(0)
			    _dom = " ".join(_rules)    
			    selecteddom = selecteddom.find(_dom)
		    else:
			return selecteddom.eq(int(v))
		elif action == "text" and hasattr(selecteddom, "text"):
		    return safeunicode(selecteddom.text()).strip()
		elif action == "html" and hasattr(selecteddom, "html"):
		    return safeunicode(selecteddom.html()).strip()

    elif len(rule) == 1:
	rule = rule.pop()
	#正则模式
	if rule.find('[arg]'):
	    content = obj.html()
	    content_text = obj.text()

	    rule = rule.replace('[arg]', '(.+)?')
	    rule = rule.replace('(*)', '.+?')

	    if isinstance(content, unicode):
		rule = safeunicode(rule)
	    else:
		rule = safestr(rule)

	    parrent = re.compile(rule, re.MULTILINE | re.UNICODE)
	    try:
		result = parrent.search(content)
		if result is not None:
		    result = safeunicode(result.group(1)).strip()
		    return result
		else:
		    result = parrent.search(content_text)
		    if result is not None:
			result = safeunicode(result.group(1)).strip()
			return result
	    except:
		return None
    
    return None

r"""
从种子表中获得并且分析成文章数据

如果调用了.push 将会根据你的配置直接入库

如果你需要进行调试
直接使用 
g = Grab(seed)
g[guid]
"""
class Grab(object):
    dont_craw_content = [
	'kaifu', 'kaice', "gift"
    ]

    def __init__(self, seed):
	if isinstance(seed, Seed):
	    self.items = {}
	    self.seed = seed
	    self.seed_id = seed["sid"]
	    self.seed_type = self.seed["type"]

	    rule = seed.getRule();
	    listtype = seed["listtype"]

	    self.guid_rule = seed.getGUID()

	    if listtype == "feed":
		self.parseFeed();
	    elif listtype == "html" or listtype == "json":
		self.listRule = rule.getListRule();
	        self.fetchListPages(listtype);
	    else:
		print "Cant support `%s` type" % listtype
	else:
	    print "You must give `Seed` instance"

    def getItemGUID(self, data):
	guid_rule = self.guid_rule
	s = "";

	if isinstance(guid_rule, list):
	    for field_id in guid_rule:
		field = get_field_from_cache(field_id)
		if field:
		    field_name = field["name"]
		    if field_name and data[field_name]:
			if "value" in data[field_name] and data[field_name].value:
			    s += safestr(data[field_name].value)
			elif data[field_name] and isinstance(data[field_name], unicode) and isinstance(data[field_name], str):
			    s += safestr(data[field_name])

	elif isinstance(guid_rule, str) or isinstance(guid_rule, unicode):
	    s = data[guid_rule]

	return md5(s).hexdigest()

    def parseFeed(self):
        print "Start to fetch and parse Feed list"
        seed = self.seed
        f = Fetch(seed.prefixurl, seed.charset, self.seed.timeout);
	if f.isReady():
	    feed = feedparser.parse(f.read())
	    items = feed["entries"]
	    if len(items) > 0:
		for item in items:
		    _item = Item({
			"url" : item["link"],
			"type" : self.seed_type
		    })

		    if self.guid_rule is None:
			self.guid_rule = "url"

		    guid = self.getItemGUID(item)
		    self.items[guid] = _item

        print "List has finished parsing. It has %s docs." % ansicolor.red(self.__len__())

    def fetchListPages(self, listtype="html"):
        print "Start to fetch and parse List"
	urls = self.listRule.getListUrls()
        for url in urls:
	    print "Fetching list page：", url, "charset:", safestr(self.seed["charset"]), "timeout:", safestr(self.seed["timeout"])
            f = Fetch(url, charset = self.seed["charset"], timeout = self.seed["timeout"])
	    if f.isReady():
		doc = f.read()

		if listtype == "html":
		    self.parseListPage(f, doc, url)
		elif listtype == "json":
		    self.parseJsonPage(f, doc, url)

        print "List has finished parsing. It has %s docs." % ansicolor.red(self.__len__())

    def parseListPage(self, site, doc, listurl):
	'''
	分析采集回来的页面
	@param site Fetch instance
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

		if link is not None:
		    link = urlparse.urljoin(listurl, link);

		_item = Item({
		    "type" : self.seed_type,
		    "images" : []
		})

		for field_id, _rule, fetch_all in extrarules:
		    field = Field(field_id = field_id, rule=_rule)
		    value = getElementData(e, _rule, _item["images"])
		    #TODO:
		    # filter HOOK
		    field.value = value
		    _item[field["name"]] = field

		if (link is not None):
		    _item['url'] = link

		# get item guid
		if self.guid_rule:
		    guid = self.getItemGUID(_item)
		elif self.seed_type in self.dont_craw_content:
		    self.guid_rule = []
		    for f in _item.fields:
			self.guid_rule.append(_item[f]["id"])
		    guid = self.getItemGUID(_item)
		    self.guid_rule = None
		else:
		    self.guid_rule = "url"
		    guid = self.getItemGUID(_item)
		    self.guid_rule = None
		
		self.items[guid] = _item

	    if len(self.listRule.getEntryItem()) == 0:
		list.children().map(entry)
	    else:	
		list.find(self.listRule.getEntryItem()).map(entry)

    def parseJsonPage(self, site, doc, listurl):
	try:
	    doc = json.loads(doc, encoding=site.getCharset())
	    item = self.listRule.getEntryItem()
	    if item and item in doc:
		data = doc[item]
	    else:
		data = doc

	    urlParent = self.listRule.getContentUrl()
	    extrarules = self.listRule.extrarules

	    if isinstance(data, list) and urlParent:
		for _data in data:
		    if urlParent in _data:
			link = urlparse.urljoin(listurl, _data[urlParent])
			guid = md5(link).hexdigest()

			_item = Item({
			    "type" : self.seed_type,
			    "images" : []
			})

			#取出需要的key数据
			for field_id, _rule, fetch_all in extrarules:
			    field = Field(field_id = field_id, rule=_rule)
			    if _rule in _data:
				value = _data[_rule]
				if is_image(value):
				    _item["images"].append(value)
				    field.value = value
				    _item[field["name"]] = field
			
			if (link is not None):
			    _item['url'] = link

			# get item guid
			if self.guid_rule:
			    guid = self.getItemGUID(_item)
			elif self.seed_type in self.dont_craw_content:
			    self.guid_rule = []
			    for f in _item.fields:
				self.guid_rule.append(_item[f]["id"])
			    guid = self.getItemGUID(_item)
			    self.guid_rule = None
			else:
			    self.guid_rule = "url"
			    guid = self.getItemGUID(_item)
			    self.guid_rule = None
			
			self.items[guid] = _item
	except:
	    raise "Cant parse json file"

    def __len__(self):
	'''
	    获取列表中有多少数据量
	'''
	return len(self.items.items())

    def keys(self):
	return self.items.keys()

    def __getitem__(self, key):
	'''
	@param key MD5 string
	'''
	if key in self.items:
	    _item = self.items[key]
	    
	    if "url" in _item and ("article" not in _item):
	        _item["article"] = Document(_item, self.seed);
	    return _item

    def push(self):
	'''
	发布推送
	'''
        print ansicolor.cyan("Start fetching these articles", True)
	for k in self.keys():
	    publish_server.push(k, self[k])

r"""
    文章数据
    包括抓取， 分析， 提取
"""
class Document(object):
    def __init__(self, item, seed):
	'''
	document base url
	'''
	self.url = item["url"]

	self.data = item

	self.seed = seed;

	item["tags"] = ",".join(self.seed.tags)

	#文章采集规则
	self.articleRule = seed.getRule().getArticleRule()

        print "Document %s is fetcing" % ansicolor.green(self.url)
        firstContent = Fetch(self.url, charset = seed["charset"], timeout = seed["timeout"]).read();
	if firstContent:
	    self.parseDocument(firstContent)

    def _getContent(self, html, wrapparent, content_re):
	if not html:
	    return

	html = pq(html).find(wrapparent)
	_content = getElementData(html, content_re);
	if _content:
	    return _content

    def parseDocument(self, doc):
        doc = pq(doc);

	wrapparent = self.articleRule.wrapparent
	pageparent = self.articleRule.pageparent
	content_re = "";
	#子页面url
	urls = []

	#文本数据内容
	content = ""

	article = doc.find(wrapparent);
	#pages
	if pageparent:
	    urls = self.parsePage(article, pageparent)
	#need title, tags
	extrarules = self.articleRule.extrarules

	#只有文章是有content
	if len(extrarules):
	    for key, rule, fetch_all in extrarules:
		field = Field(field_id=key, rule=rule);
		value = getElementData(doc, rule, self.data["images"], fetch_all)

		self.data[field.get('name')] = field

		if field.is_article_content():
		    content_re = field.get("rule")
		    content = value
		else:
		    field.value = value

	#采集分页内容
	if len(urls) > 0 and content_re:
	    for next_url in urls:
		next_page = Fetch(next_url, charset = self.seed["charset"], timeout = self.seed["timeout"]).read()
		if next_page is not None:
		    next_page = self._getContent(next_page, wrapparent, content_re);
		    if next_page:
			content += next_page

	if content and content_re:
	    content = Readability(content, self.url)
	    images = content.getImages();

	    self.data['content'].value = content.getContent();
	    self.data['images'] += images

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

    #文章测试
    #r = db.view(2);
    #seed = Seed(r.list()[0])
    #articles = Grab(seed)
    ##articles[md5("http://www.kaifu.com/articlecontent-40764-0.html").hexdigest()]
    ##Document("http://www.kaifu.com/articlecontent-40389-0.html", seed)
    #articles.push()

    #游戏测试
    #r = db.view(7);
    #seed = Seed(r.list()[0])
    #games= Grab(seed)
    ##games.push()
    #print games[md5("http://www.kaifu.com/gameinfo-long2.html").hexdigest()]

    #游戏开服
    #r = db.view(8);
    #seed = Seed(r.list()[0])
    #kaifus = Grab(seed)
    #kaifus.push()
    #print kaifus['43d4eaccab7675ac175c030455d0cbb2']

    #游戏开测
    #r = db.view(20);
    #seed = Seed(r.list()[0])
    #kaices = Grab(seed)
    #for k in kaices.keys():
    #    print kaices[k]
    #kaices.push()
    ##print kaifus['43d4eaccab7675ac175c030455d0cbb2']

    #礼包
    #r = db.view(21);
    #seed = Seed(r.list()[0])
    #gifts = Grab(seed)
    #gifts.push()

    #厂商
    #r = db.view(22);
    #seed = Seed(r.list()[0])
    #c = Grab(seed)
    #c.push()

    #图库
    #r = db.view(23)
    #seed = Seed(r.list()[0])
    #gas = Grab(seed)
    #gas.push()

    r = db.view(24)
    seed = Seed(r.list()[0])
    gas = Grab(seed)
    for k in gas.keys():
	print gas[k]
