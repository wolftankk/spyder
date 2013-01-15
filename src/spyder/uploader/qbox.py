#coding: utf-8

import os, sys
parentdir = os.path.realpath(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".."))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

from libs.utils import safestr, safeunicode, now
from libs.qbox import config
from libs.qbox import uptoken
from libs.qbox import rscli

class qbox():
    def __init__(self, profile):
	self.secret_access_key = profile["secret_access_key"]
	self.access_id = profile["access_id"]

	config.ACCESS_KEY = safestr(self.access_id)
	config.SECRET_KEY = safestr(self.secret_access_key)

	if "bucket" in profile and profile["bucket"]:
	    self.bucket = profile["bucket"]
	else:
	    self.bucket = "cmdp"

	self.token_expires = 3600 + now()
	self.init_tokent()

    def init_tokent(self):
	tokenObj = uptoken.UploadToken(self.bucket, self.token_expires)
	self.uploadToken = tokenObj.generate_token()

    def update(self):
	if self.token_expires <= now():
	    self.init_tokent()

    def upload(self, file_path, path):
	resp = rscli.UploadFile(self.bucket, path, '', file_path, '', '', self.uploadToken)
	if resp and "hash" in resp:
	    os.unlink(file_path)
	    return True
	else:
	    return False
