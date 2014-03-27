#coding: utf-8
'''
vim: ts=8
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from spyder.pybits import ansicolor
import re, string, urlparse
from libs.phpserialize import unserialize
from libs.utils import Storage

#from web.models import Seed_fields
#from web.models import Seed_tag
#from web.models import Tags

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
种子管理器是与数据库分开的
每个sid都需要一个sid和name
'''
class Seed(object):
    def __init__(self, config={}):
	if isinstance(config, Storage) or isinstance(config, object):
	    if ("sid" not in config) or ("sid" in config and int(config["sid"]) <= 0):
		raise SeedEmpty

	    self.__seed = config;
	    self.name = config["seed_name"].encode("utf-8")
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

    def set_tags(self, tags):
        self.tags = tags

    def get_tags(self):
        self.tags = []
	#st_db = Seed_tag()
	#tag_db = Tags()

	#query = st_db.select(where={"sid" :self["sid"]}, what="tid")
	#r = query.list()
	#for t in r:
	#    if t and "tid" in t:
	#	self.tags.append(tag_db.view(t["tid"]).list()[0]["name"])

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
	# kaifu, kaice, article, gallery...
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

	extrarules = self.parent.extrarules
	for i, rule in enumerate(extrarules):
	    if rule and rule["page_type"] == "content":
		field_id = rule["field_id"]
		value = rule["value"]
		fetch_all = rule["fetch_all"]
		self.extrarules.append((field_id, value, fetch_all))

        if "filters" in parent.rule:
	    self.filters = []
            if parent.rule["filters"]:
                parent.rule["filters"] = parent.rule["filters"].split("|");
	        for f in parent.rule["filters"]:
		      self.filters.append(f)
        else:
            self.filters = []


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


if __name__ == "__main__":
    print "seed"
    #配置
