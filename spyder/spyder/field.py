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
'''
live_refs = defaultdict(weakref.WeakKeyDictionary)

class Field(object):
    def __init__(self, **kwargs):
	'''
	if kwargs['key']:
	    self.name = kwargs['key']

	if kwargs['value']:
	    self.value = kwargs['value']

	if kwargs['rule']:
	    self.rule = kwargs['rule']
	'''

    def __str__(self):
	'''
	return str(self.name)
	'''



if __name__ == "__main__":
    f = Field();
