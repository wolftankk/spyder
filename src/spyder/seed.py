#coding: utf-8
#vim: set ts=8
#Author: wolftankk@gmail.com

from pybits import ansicolor
import re, string, urlparse
from utils import Storage

__all__ = [
    'SeedEmpty', 'Seed', 'Rule',
    'RuleEmpty', 'SeedError'
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
种子管理器是与数据库分开的
每个sid都需要一个sid和name
'''
class Seed(object):
    tags = []

    def __init__(self, config={}):
	if isinstance(config, Storage) or isinstance(config, object):
	    if ("sid" not in config) or ("sid" in config and int(config["sid"]) <= 0):
		raise SeedEmpty

	    self.__seed = config;
	    self.name = config["name"].encode("utf-8")
	else:
	    raise SeedError("Seed instance error.")

    def __str__(self):
	return (self.name)

    def __repr__(self):
	return '<seed: %s>' % repr(str(self))

    def getGUID(self):
        #how defines the item's guid?
        if self["guid_rule"]:
            guid_rule = self.__seed["guid_rule"].split(",")
            guid_rule = map(lambda x: int(x), guid_rule)
            return guid_rule
        return None

    def set_tags(self, tag):
        #define seed tag
        self.tags.append(tag)

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


r'''
List一共有三种类型：feed, html, json
当设定为feed时候， 将会自动分析出url等相关信息
当设定为html时，将会根据设定的规则分析出信息
当设定为json时，你只要填写字段即可
'''
class RuleList(object):
    def __init__(self, parent):
        self.parent = parent
	#Rule type
        # feed, html, json
        self.type = parent.seed["listtype"];
	#need parse and get field
	self.extrarules = []
	#filter hook
	self.filters = []

        if "extrarules" in self.parent.rule:
            extrarules = self.parent.rule["extrarules"]
            for i, field in enumerate(extrarules):
                if field:
                    title, value, fetch_all, page_type = field
                    if page_type == "list":
                	self.extrarules.append(field)

    def getListParent(self):
	rule = self.parent.rule;
        return rule["listparent"]

    def getEntryItem(self):
	rule = self.parent.rule;
        return rule["entryparent"]

    def getContentUrl(self):
	rule = self.parent.rule
	return rule["contenturl"]

    def getListUrls(self):
        listUrls = [];
	rule = self.parent.rule;

	#urltype: inputLink, createLink, dateLink
	urltype = rule["urltype"]
	
	urlformat = rule["urlformat"]
	step = rule["step"]
	maxpage = rule["maxpage"]
	startpage = rule["startpage"]

	if urltype == "inputLink":
	    urls = urlformat.split("\r\n")

	    listUrls = urls
	elif urltype == "createLink":
	    '''
	    手动格式化的数字版本
	    '''
	    step = int(step)
	    maxpage = int(maxpage)
	    startpage = int(startpage)

	    if not step:
		step = 1

	    if not maxpage:
		maxpage = 1

	    urlformat = string.Template(urlformat);

	    for i in range(startpage, maxpage + startpage):
	        url = urlformat.substitute(page=(i*step));
	        listUrls.append(url)
	    
	elif urltype == "dateLink":
	    try:
		datetime	
	    except:
		import datetime

	    maxpage = int(maxpage)
	    if not startpage:
		startpage = "YYYY-MM-DD"
	    

	    date_template = startpage;
	    if date_template.find("YYYY") > -1:
		date_template = date_template.replace("YYYY", "%Y")
	    elif date_template.find("YY") > -1:
		date_template = date_template.replace("YYYY", "%y")

	    if date_template.find("MM") > -1:
		date_template = date_template.replace("MM", "%m")

	    if date_template.find("DD") > -1:
		date_template = date_template.replace("DD", "%d")

	    today = datetime.date.today()
	    pages = [
		today.strftime(date_template)
	    ]
	    #print datetime.date.today() + datetime.timedelta(days=-100)
	    if maxpage > 0:
		for i in range(1, maxpage + 1):
		    pages.append((today + datetime.timedelta(days=+i)).strftime(date_template))
	    elif maxpage < 0:
		for i in range(-1, maxpage - 1, -1):
		    pages.append((today + datetime.timedelta(days=+i)).strftime(date_template))

	    urlformat = string.Template(urlformat);
	    for p in pages:
	        url = urlformat.substitute(page=p);
	        listUrls.append(url)
	else:
	    raise RuleError("URL类型无效");
        return listUrls

'''
文章采集规则
'''
class RuleArticle(object):
    def __init__(self, parent):
	self.parent = parent

	self.pageparent = parent.rule["pageparent"]
	self.wrapparent = parent.rule["contentparent"]

	self.extrarules = []
	self.filters = []

        if "extrarules" in self.parent.rule:
            extrarules = self.parent.rule["extrarules"]
            for i, field in enumerate(extrarules):
                if field:
                    title, value, fetch_all, page_type = field
                    if page_type == "content":
                	self.extrarules.append(field)

        #if "filters" in parent.rule:
        #    print parent.rule["filters"]
	#        for f in parent.rule["filters"]:
	#	      self.filters.append(f)

'''
采集规则表
Base Rule
'''
class Rule(object):
    def __init__(self, config, seed):
	if not config:
	    raise RuleEmpty

	'''
	extrarules 额外规则表
	这些额外的规则是动态的， 每个都有一个field id
	'''
        self.rule = config;
        self.seed = seed

    def getListRule(self):
        return RuleList(self)

    def getArticleRule(self):
        return RuleArticle(self)

    def __str__(self):
	return '<%s 的规则>' % str(self.seed)
