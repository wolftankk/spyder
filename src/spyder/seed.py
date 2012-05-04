#coding: utf-8

from pybits import ansicolor
import re, string, urlparse
import phpserialize

class SeedEmpty(Exception): pass

#paser rule
class Seed(object):
    def __init__(self, seed):
        if (type(seed) == type({})):
	    self._seed = seed

            self._name = None
            self._sid = None
            self._rule = None
            self._frequency = 0
            self._tries = 0
            self._timeout = 0
            self._starttime = 0
            self._finishtime = 0
            self._preURL = None
            self._charset = "utf-8"
            self._debugMode = 0
            self.enabled = 0
	    self.lang = "zhCN"
            self.type = "html" 

            self.__parse(seed);
        else:
            raise SeedEmpty

    def __str__(self):
        return self.getname()

    def __parse(self, seedData):
        self.setname(seedData["sname"]) # set seed name
        self.sid = seedData["sid"]

        if seedData["frequency"] != None:
            self.frequency = seedData["frequency"]

        if seedData["tries"] !=None:
            self.tries = seedData["tries"]

        if seedData["timeout"] != None:
            self.timeout = seedData["timeout"]

        if seedData["starttime"] != None:
            self.starttime = seedData["starttime"]

        if seedData["finishtime"] != None:
            self.finishtime = seedData["finishtime"]

        if seedData["charset"] != "" or seedData != None:
            self.charset = seedData["charset"]
        
        if seedData["url"] != None:
            self.prefixurl = seedData["url"]

        if "enabled" in seedData:
            self.enabled = seedData["enabled"];

        if "listtype" in seedData:
            self.type = seedData["listtype"];

	if "lang" in seedData:
	    self.lang = seedData["lang"];

        #rule
        if seedData["rule"] != "":
            self._rule = seedData["rule"]
            self.rule = Rule(self._rule)

    def getsid(self):
        return self._sid
    def setsid(self, value):
        self._sid = int(value)
    sid = property(getsid, setsid)

    def getname(self):
        return self._name
    def setname(self, name):
        self._name = name
    name = property(fget=getname, fset=setname, doc="Seed name");

    def getfrequency(self):
        return int(self._frequency)
    def setfrequency(self, value):
        self._frequency = int(value)
    frequency = property(getfrequency, setfrequency)

    def gettries(self):
        return int(self._tries)
    def settries(self, value):
        self._tries = int(value)
    tries = property(gettries, settries)

    def gettimeout(self):
        return self._timeout
    def settimeout(self, value):
        self._timeout = int(value)
    timeout = property(gettimeout, settimeout)

    def getcharset(self):
        return self._charset
    def setcharset(self, value):
        self._charset = value
    charset = property(getcharset, setcharset)

    @property
    def starttime(self):
        return self._starttime
    @starttime.setter
    def starttime(self, value):
        self._starttime = int(value)

    @property
    def finishtime(self):
        return self._finishtime
    @finishtime.setter
    def finishtime(self, value):
        self._finishtime = int(value)


class Rule(object):
    def __init__(self, rule):
        self.list = None
        self.article = None

        rule = phpserialize.unserialize(rule)
        if (rule["list"] != None):
            list = rule["list"]
            self.list = RuleList(list)

        if (rule["article"] != None):
            article = rule["article"]
            self.article = RuleArticle(article)

    def getListRule(self):
        return self.list

    def getArticleRule(self):
        return self.article


r'''
Exp: http://www.265g.com/chanye/hot/4985-1.html

1. get list 
1)
urlprefix: http://www.265g.com/chanye/hot/
urlformat: 4985-(%d).html
maxpages: 10
firsepage: 1 0

2)
urlprefix: http://www.4gamer.net/script/search/index.php?mode=article&TS016
type: ajax
extraparams: PAGE:(%d), TAGS: xxx

2. get article list
$list = array(
    preurl => "http://www.265g.com/chanye/hot/",
    type => "default", //type: default, ajax(post),
    extraparams => ""

    urlformat => "4985-(%d).html",
    startpage => 1
    step = 1,
    maxpage => 10,
    
    listparent=> "", //exp: <ul id="xxx"></ul>  <table> <tr> <td>
    entryparent => "", //exp <li></li>
    
    dateparent => "",
    titleparten => "",
    articaleurl => ""
)
'''
class RuleList(object):
    def __init__(self, rule):
        self.originRule = rule
        self.type = "default"
    
        #url 批量格式
        self.urlformat = rule["urlformat"]
        self.step = rule["step"]
        #起始页数
        self.startpage = rule["startpage"]
        #结束页数
        self.maxpage = rule["maxpage"]

        #获取list元素
        self.listparent = rule["listparent"]
        #获取list=>item元素
        self.entryparent = rule["entryparent"]

        #获取日期元素
        self.dateparent = rule["dateparent"]
        #获取标题元素
        self.titleparent = rule["titleparent"]
        #获取link元素
        self.linkparent = rule["articleparent"]

    def setPrefixUrl(self, url):
        self.prefixurl = url

    def getListParent(self):
        #exp: div[class=cont_list]ul
        #exp: div[id=xx]ol
        #exp: div[id=class]div
        return self.listparent

    def getEntryItem(self):
        #exp: <li></li>
        #@TODO: td 部分考虑
        return self.entryparent

    def getItemLink(self):
        if self.linkparent == None:
            self.linkparent = "a[@href]";
        
        return self.linkparent

    def getItemTitle(self):
        if self.titleparent == None:
            self.titleparent = "a[#text]"

        return self.titleparent

    def getItemDate(self):
        return self.dateparent


    def getFormatedUrls(self):
        listUrls = [];
	if self.urlformat == None or self.urlformat == "":
	    raise RuleUrlInvalid

	if self.startpage == None:
	    self.startpage = 1

	if self.maxpage == None:
	    self.maxpage = 1

	if self.step == None:
	    self.step = 1

	self.startpage = int(self.startpage)
	self.maxpage   = int(self.maxpage)
	urlformat = string.Template(self.urlformat);
	for i in range(self.startpage, self.maxpage+1):
	    url = urlformat.substitute(page=i);
	    url = urlparse.urljoin(self.prefixurl, url);
	    listUrls.append(url)

        return listUrls

r'''
preurl
articleparent

titleparten
tags
authorparten
context
page
'''
class RuleArticle(object):
    def __init__(self, rule):
        self.rule = rule

        self.pageparent = rule["pageparent"] #page
        self.wrapparent = rule["articleparent"]#文章位置
        self.contentparent = rule["contextparent"]

        self.tagsparent        = rule["tagsparent"]
        self.titleparent    = rule["titleparent"]
        self.authorpartent    = rule["authorparent"]
        self.downloadmedia  = False

        if "downloadmedia" in rule:
            self.downloadmedia = rule["downloadmedia"]

        if "filterscript" in rule:
            self.filterscript    = rule["filterscript"]
        else:
            self.filterscript  = True

        if "filters" in rule:
	    self.filters = []
	    if isinstance(rule["filters"], str):
		rule = rule["filters"].split("|")

	    for f in rule["filters"]:
		self.filters.append(rule["filters"][f])
        else:
            self.filters = []

    def getWrapParent(self):
        return self.wrapparent

    def getTitleParent(self):
        return self.titleparent

    def getPageParent(self):
        return self.pageparent

    def getContentParent(self):
        return self.contentparent

r"""
Rule
~~~~
`List rule`:
    type RSS, html, ATOM, AJAX
    ┌ urlparten, Exp: http://www.265g.com/chanye/hot/4985-(%d).html
    ├ titleparten
    ├ article parten
    └ date parten

1. 静态页面类
 这些有着标准的列表页面和格式, 只需要匹配就可以

2. Ajax加载型
http://www.4gamer.net/script/search/index.php?mode=article&DATE=20120201
需要使用ajax模式提交一些数据才可以 page=(1-4)

Article rule:
    titleparten
    tagsparten
    authorparten
    contenparten
    filterpartens
    pagepartens
    downloadMedia?
    dateParten

"""
