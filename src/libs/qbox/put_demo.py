#!/usr/bin/env python

import config
import urllib
import simpleoauth2
import rs as qboxrs
import rscli
import digestoauth
import uptoken

#/Users/wolftankk/home/workspace/spyder/src/spyder/images_cache/7c/80/1d/11/7c801d1113f7cb3591a064fc74a5eea83a139da6.jpg 7c/80/1d/11/7c801d1113f7cb3591a064fc74a5eea83a139da6.jpg
config.ACCESS_KEY = 'wwcO42sOUjCFm7qVQId6a6dAHSglHIG4wgs_JErW'
config.SECRET_KEY = '62Be9PyMh6bAPvIHQkIr1-FOGku8t84NI3zkUf9E'

bucket = 'cmdp'
#key = 'test.jpg'
img_path = "/Users/wolftankk/home/workspace/spyder/src/spyder/images_cache/7c/80/1d/11/7c801d1113f7cb3591a064fc74a5eea83a139da6.jpg"
key = "7c/80/1d/11/7c801d1113f7cb3591a064fc74a5eea83a139da6.jpg"
#customer = 'end_user_id'
#demo_domain = 'test_photos.dn.qbox.me'

tokenObj = uptoken.UploadToken(bucket, 3600)
uploadToken = tokenObj.generate_token()
print "Upload Token is: %s" % uploadToken

resp = rscli.UploadFile(bucket, key, '', img_path, '', '', uploadToken)
print '\n===> UploadFile %s result:' % key
print resp

client = digestoauth.Client()
rs = qboxrs.Service(client, bucket)

resp = rs.Stat(key)
print '\n===> Stat %s result:' % key
print resp
