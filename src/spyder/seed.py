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


class BaseRule(object):
	def __init__(self, rule):
		pass

class RuleEmpty(Exception): pass

class Rule(object):
	def __init__(self, rule):
		rule = phpserialize.unserialize(rule)

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
