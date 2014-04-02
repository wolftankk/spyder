#coding: utf-8
'''
vim: ts=8
'''
import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from UserDict import DictMixin
import weakref
import time

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
        if kwargs['field_name']:
            self['name'] = kwargs['field_name']
		    
	if kwargs['rule']:
	    self["rule"] = kwargs['rule']

	self['value'] = ''
    
    def is_article_content(self):
	if (self['name'] == 'content' and (self['type'] == 'article')):
	    return True

	return False

    def is_gallery_content(self):
	if (self['name'] == 'content' and self['type'] == 'gallery'):
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

#def get_field_from_cache(field_id):
#    db = Field_Model();
#    if _fields_cache[field_id]:
#	data = _fields_cache[field_id]
#    else:
#	data = db.view(field_id).list()[0];
#	_fields_cache[field_id] = data
#
#    return data

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
