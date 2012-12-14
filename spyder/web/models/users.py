#coding: utf-8

from web.model import Model

class User(Model):
    uid = 0;
    def __init__(self):
	self.tablename = 'user';

    def validate_username(self, username):
	'''
	'''
	return True
    
    def validate_email(self, email):
	'''
	'''
	return True

    def add(self, **profile):
	'''
	'''
