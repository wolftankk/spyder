#coding: utf-8

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from spyder.pybits import ansicolor
import re, string, urlparse
from libs.phpserialize import unserialize
from libs.utils import Storage
from web.models import Seed_fields

__all__ = [
    'SeedEmpty', 'Seed', 'Rule',
    'RuleCantParse', 'RuleEmpty'
    'SeedError'
]

'''
Seed种子类型错误 或者 无法分析时引用此错误
'''
class SeedError(Exception):
    def __init__(self, msg='Seed Error!'):
	self.msg = msg

    def __str__(self):
	return repr(self.msg)

'''
Seed不存在引用此错误
'''
class SeedEmpty(Exception): 
    pass


class RuleError(Exception):
    def __init__(self, msg='Rule cant parse'):
	self.msg = msg

    def __str__(self):
	return repr(self.msg)


class RuleEmpty(Exception):
    pass

'''
种子管理类
分析种子， 将种子中的Rule分析出来
'''
class Seed(object):
    def __init__(self, seed={}):
	if isinstance(seed, Storage) or isinstance(seed, object):
	    if ("sid" not in seed) or ("sid" in seed and int(seed["sid"]) <= 0):
		raise SeedEmpty

	    '''
		init
	    '''
	    self.__seed = seed;
	    self.name = self.__seed["seed_name"].encode("utf-8")

	else:
	    raise SeedError("Seed instance error.")

    def __str__(self):
	return (self.name)

    def __repr__(self):
	return '<seed: %s>' % repr(str(self))


    def __getitem__(self, k):
	if k in self.__seed:
	    return self.__seed[k]
	elif k == "timeout":
	    return 300
	elif k == "charset":
	    return "utf-8"
	else:
	    return None

    def __setitem__(self, k, v):
	self.__seed[k] = v


    def getRule(self):
	rule = Rule(self["rule"], self)
	return rule


'''
采集规则表
Base Rule
'''
class Rule(object):
    def __init__(self, rule, seed):
	if not rule:
	    raise RuleEmpty

	self.seed = seed;
	self.db = Seed_fields()
	
	r = self.db.list(seed["sid"])
	if len(r) > 0:
	    self.extrarules = r.list();

        rule = unserialize(rule)
	self.rule = rule;

	'''
	contenturl
	urlformat
	urltype: inputLink, createLink, dateLink
	contentparent
	pageparent
	listparent
	maxpage
	step
	startpage
	filters
	entryparent
	'''

    def getListRule(self):
        return RuleList(self)

    def getArticleRule(self):
        return self.article

    def __str__(self):
	return '<%s 的规则>' % str(self.seed)

r'''
List一共有两种类型：feed, html
当设定为feed时候， 将会自动分析出url等相关信息
当设定为html时，将会根据设定的规则分析出信息


'''
class RuleList(object):
    def __init__(self, parent):
        self.parent = parent
        self.type = parent.seed["listtype"];

	'''
	contenturl
	contentparent
	pageparent
	listparent


	filters
	entryparent
	'''
	self.getListUrls()

        ##获取list元素
        #self.listparent = rule["listparent"]
        ##获取list=>item元素
        #self.entryparent = rule["entryparent"]

        ##获取日期元素
        #self.dateparent = rule["dateparent"]
        ##获取标题元素
        #self.titleparent = rule["titleparent"]
        ##获取link元素
        #self.linkparent = rule["articleparent"]
	#self.gameid = 0;
	#if "gameid" in rule:
	#    self.gameid = int(rule["gameid"])

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

    def getListUrls(self):
	r'''
	获得需要采集的url列表
	'''
        listUrls = [];
	rule = self.parent.rule;

	#urltype: inputLink, createLink, dateLink
	urltype = rule["urltype"]
	
	urlformat = rule["urlformat"]
	step = rule["step"]
	maxpage = rule["maxpage"]
	startpage = rule["startpage"]

	if urltype == "inputLink":
	    '''
	    手动输入的url采集地址
	    '''
	elif urltype == "createLink":
	    '''
	    手动格式化的数字版本
	    '''
	    if not step:
		step = 1

	    if not maxpage:
		maxpage = 1

	    if not startpage:
		startpage = 1

	    urlformat = string.Template(urlformat);
	    for i in range(startpage, maxpage+1):
		print i
	        #url = urlformat.substitute(page=i);
	        #url = urlparse.urljoin(prefixurl, url);
		#print url
	        #listUrls.append(url)
	    
	elif urltype == "dateLink":
	    '''
	    日期地址
	    '''
	else:
	    raise RuleError("URL类型无效");

        ##url 批量格式
        #self.urlformat = rule["urlformat"]
        #self.step = rule["step"]
        ##起始页数
        #self.startpage = rule["startpage"]
        ##结束页数
        #self.maxpage = rule["maxpage"]

	#urlformat
	#maxpage
	#step
	#startpage

	#if self.urlformat == None or self.urlformat == "":
	#    raise RuleUrlInvalid

	#if not self.startpage:
	#    self.startpage = 1

	#if not self.maxpage:
	#    self.maxpage = 1

	#if not self.step:
	#    self.step = 1

	#self.startpage = int(self.startpage)
	#self.maxpage   = int(self.maxpage)
	#urlformat = string.Template(self.urlformat);
	#for i in range(self.startpage, self.maxpage+1):
	#    url = urlformat.substitute(page=i);
	#    url = urlparse.urljoin(self.prefixurl, url);
	#    listUrls.append(url)

        #return listUrls

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

if __name__ == "__main__":
    from web.models import Seed as Seed_Model
    db = Seed_Model();
    r = db.view(2);
    t = Seed(r.list()[0])
    
    # test Seed info
    rule = t.getRule();
    rule.getListRule();
