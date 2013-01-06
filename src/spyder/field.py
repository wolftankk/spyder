#coding: utf-8

'''
Field class

解析存储你需要的字段
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from web.models import Field as Field_Model

import weakref
from collections import defaultdict

'''
创建一个动态的弱key表
这里的Field都是使用的Field_Model表中的内容
其中包含了name, type, rule等等内容
需要缓存一下数据库
'''
live_refs = defaultdict(weakref.WeakKeyDictionary)

class Field(dict):
    def __init__(self, **kwargs):
	self.db = Field_Model();

	if kwargs['field_id']:
	    field_id = kwargs['field_id']
	    if live_refs[field_id]:
		data = live_refs[field_id]
	    else:
		data = self.db.view(field_id).list()[0];
		live_refs[field_id] = data

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
    
    def get_field(self):
	'''
	    get field value
	'''
	return self['value']

    def set_field(self, value):
	self['value'] = value
    value = property(get_field, set_field);

    def __str__(self):
	return '< Field: %s >' % self['name']
