#coding: utf-8

'''
Field class

解析存储你需要的字段
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from UserDict import DictMixin
import weakref
import time

from web.models import Field as Field_Model
from libs.utils import safestr, now, object_ref
from collections import defaultdict

__all__ = [
    'Field', "Item"
]

'''
创建一个动态的弱key表
这里的Field都是使用的Field_Model表中的内容
其中包含了name, type, rule等等内容
需要缓存一下数据库
'''
_fields_cache = defaultdict(weakref.WeakKeyDictionary)

class Field(dict):
    def __init__(self, **kwargs):
	self.db = Field_Model();

	if kwargs['field_id']:
	    field_id = kwargs['field_id']
	    if _fields_cache[field_id]:
		data = _fields_cache[field_id]
	    else:
		data = self.db.view(field_id).list()[0];
		_fields_cache[field_id] = data

	    #直接赋值到self中
	    if data is not None:
		for k in data:
		    self[k] = data[k]
		    
	if kwargs['rule']:
	    self["rule"] = kwargs['rule']

	self['value'] = ''
    
    def is_article_content(self):
	if (self['name'] == 'content' and self['type'] == 'article'):
	    return True

	return False

    def __parseDate(self, str):
	'''
	转成timestamp
	'''
	t1 = "今日 17点"
	t2 = "01月08日09点开服"
	t3 = "01月07日14:10"
	#str = safestr(str)
	#print time.strptime(str, "今日 %H点")

	#t2 = safestr(t2)
	#print time.strptime(t2, safestr("%m月%d日%H点开服"))

	#print time.strptime(t3, safestr("%m月%d日%H:%M"))
	#return int(now())
    
    def get_field(self):
	'''
	    get field value
	'''
	return self['value']

    def set_field(self, value):
	if self["name"].find("date") > 1:
	    value = self.__parseDate(value)

	self['value'] = value
    value = property(get_field, set_field);

    def __str__(self):
	return '< Field: %s >' % self['name']


class ItemMeta(type):
    def __new__(mcs, cls_name, bases, attrs):
	fields = {}
	new_attrs = {}
	for k, v in attrs.iteritems():
	    if isinstance(v, Field):
		fields[k] = v
	    else:
		new_attrs[k] = v

	cls = type.__new__(mcs, cls_name, bases, new_attrs)
	cls.fields = cls.fields.copy()
	cls.fields.update(fields)
	return cls

class Item(object):
    def __init__(self, *args, **kwargs):
	self.fields = {}
	self.attrs = {}
    
	if args or kwargs:
	    for k, v in dict(*args, **kwargs).iteritems():
		self[k] = v

    def __setitem__(self, key, value):
	if isinstance(value, Field):
	    self.fields[key] = value
	else:
	    self.attrs[key] = value
    
    def __getitem__(self, key):
	if key in self.fields:
	    return self.fields[key]
	elif key in self.attrs:
	    return self.attrs[key]

    def __contains__(self, key):
	if key in self.fields:
	    return True
	elif key in self.attrs:
	    return True
	else:
	    return False

    def __repr__(self):
	return '<Item Field: ' + repr(self.fields) + " Attrs: " + repr(self.attrs) + " >"

if __name__ == "__main__":
    #test Item
    test_item = Item(test="a", ddd="ff")
    print test_item.keys()
    print "ddd" in test_item
    print "adads" in test_item
    test_item["aaa"] = "c"
    print test_item["test"]
    #test_item["a"] = "dad"
    #print test_item
