#coding: utf-8
#vim: set ts=8
#Author: wolftankk@gmail.com

from UserDict import DictMixin
import weakref
import time
from utils import safestr, now, object_ref
from collections import defaultdict

__all__ = [
    'Field', "Item"
]

class Field(dict):
    def __init__(self, **kwargs):
        if "id" not in kwargs:
            self['id'] = kwargs['name']
        else:
            self['id'] = kwargs['id']
            del self['id']

        if kwargs['name']:
            self['name'] = kwargs['name']
            del kwargs['name']
		    
	if kwargs['rule']:
	    self["rule"] = kwargs['rule']
            del kwargs['rule']

        for k, v in kwargs.items():
            self[k] = v

	self['value'] = ''

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
