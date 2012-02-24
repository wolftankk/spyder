#coding: utf-8

from pybits import ansicolor
import re
import phpserialize

class SeedEmpty(Exception): pass

#paser rule
class Seed(object):
	def __init__(self, seed):
		if (type(seed) == type({})):
			self._seed = seed

			# Seed attr
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
		# sec
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
	
	listparent=> "", //exp: <ul id="xxx"></ul>
	entryparent => "", //exp <li></li>
	
	dateparent => "",
	titleparten => "",
	articaleurl => ""
)
'''
class RuleList(object):
	def __init__(self, rule):
		self.originRule = rule
		self.urlprefix = rule["urlprefix"]
		self.type = "default"
	
		#list url format: (%d).html or ([(%d-1)*25]) 公式如何处理?
		self.urlformat = rule["urlformat"]
		self.step = rule["step"]
		self.startpage = rule["startpage"]
		self.maxpage = rule["maxpage"]

		self.listparent = rule["listparent"]
		self.entryparent = rule["entryparent"]

		self.dateparent = rule["dateparent"]
		self.titleparten = rule["titleparten"]
		self.articaleurl = rule["articaleurl"]

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


class Rule(object):
	def __init__(self, rule):
		self.list = None
		self.article = None

		rule = phpserialize.unserialize(rule)
		if (rule["list"] != None):
			list = rule["list"]
			self.list = RuleList(list)

		if (rule["article"] != None):
			article = rule["list"]
			self.article = RuleArticle(article)

	def getListRule(self):
		return self.list

	def getArticleRule(self):
		return self.article



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

