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
from web.models import Seed_tag
from web.models import Tags

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

	    self.__seed = seed;
	    '''
	    tags
	    '''
	    self.get_tags()
	    self.name = self.__seed["seed_name"].encode("utf-8")
	else:
	    raise SeedError("Seed instance error.")

    def __str__(self):
	return (self.name)

    def __repr__(self):
	return '<seed: %s>' % repr(str(self))

    def get_tags(self):
	self.tags = [];
	st_db = Seed_tag()
	tag_db = Tags()

	query = st_db.select(where={"sid" :self["sid"]}, what="tid")
	tag_num = len(query)
	r = query.list()
	for t in r:
	    if t and "tid" in t:
		self.tags.append(tag_db.view(t["tid"]).list()[0]["name"])

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
    db = None
    def __init__(self, rule, seed):
	if not rule:
	    raise RuleEmpty

	self.seed = seed;
	if self.db is None:
	    self.db = Seed_fields()
	
	r = self.db.list(seed["sid"])
	'''
	extrarules 额外规则表
	这些额外的规则是动态的， 每个都有一个field id
	'''
	if len(r) > 0:
	    self.extrarules = r.list();

        rule = unserialize(rule)
	self.rule = rule;

    def getListRule(self):
        return RuleList(self)

    def getArticleRule(self):
        return RuleArticle(self)

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
	列表额外配置
	'''
	self.extrarules = []

	extrarules = self.parent.extrarules
	for i, rule in enumerate(extrarules):
	    if rule and rule["page_type"] == "list":
		field_id = rule["field_id"]
		value = rule["value"]
		fetch_all = rule["fetch_all"]
		self.extrarules.append((field_id, value, fetch_all))


    def getListParent(self):
	'''
	获得列表集
	DOM
	'''
        #exp: div[class=cont_list]ul
        #exp: div[id=xx]ol
        #exp: div[id=class]div
	rule = self.parent.rule;
        return rule["listparent"]

    def getEntryItem(self):
	'''
	获得列表中每个元素
	DOM
	'''
        #exp: <li></li>
        #@TODO: td 部分考虑
	rule = self.parent.rule;
        return rule["entryparent"]

    def getContentUrl(self):
	'''
	    获取文章URL链接
	'''
	rule = self.parent.rule
	return rule["contenturl"]

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

	    for i in range(startpage, maxpage+1):
	        url = urlformat.substitute(page=(i*step));
	        listUrls.append(url)
	    
	elif urltype == "dateLink":
	    #import datetime
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
	'''
	contentparent //文章大致区域
	pageparent
	filters
	'''
	self.pageparent = parent.rule["pageparent"]
	self.wrapparent = parent.rule["contentparent"]

	self.extrarules = []
	extrarules = self.parent.extrarules
	for i, rule in enumerate(extrarules):
	    if rule and rule["page_type"] == "content":
		field_id = rule["field_id"]
		value = rule["value"]
		fetch_all = rule["fetch_all"]
		self.extrarules.append((field_id, value, fetch_all))

        if "filters" in parent.rule:
	    self.filters = []
	    for f in parent.rule["filters"]:
		self.filters.append(parent.rule["filters"][f])
        else:
            self.filters = []


if __name__ == "__main__":
    from web.models import Seed as Seed_Model
    db = Seed_Model();
    r = db.view(2);
    t = Seed(r.list()[0])
    
    # test Seed info
    rule = t.getRule();
    #test rule
    rule.getListRule();
    #test article
    rule.getArticleRule();
