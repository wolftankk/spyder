#coding: utf-8

from inspect import getmodule
from multiprocessing import Pool, TimeoutError
from .qbox import qbox
from .aliyun import aliyun
from .ftp import ftp
from .http import http

class UnknownUploader(Exception):
    pass

class UploadError(Exception):
    pass

def async(decorated):
    module = getmodule(decorated)
    decorated.__name__ += '_original'
    setattr(module, decorated.__name__, decorated)

    def send(*args, **opts):
	return async.pool.apply_async(decorated, args, opts)

    return send

@async
def upload_image(handler, image_path, upload_path):
    if handler and "upload" in dir(handler):
	try:
	    method = getattr(handler, "upload");
	except:
	    raise UnknownUploader

	if method:
	    try:
		call = method(image_path, upload_path)
		r = call.get(timeout=10)
		#r = method(image_path, upload_path)
		if not r:
		    upload_image(handler, image_path, upload_path)
	    except TimeoutError, e:
	    	upload_image(handler, image_path, upload_path)
	    except Exception, e:
		raise UploadError, "Upload image faile! image_path: %s, upload_path: %s, errorInfo: %s" % (image_path, upload_path, str(e))
    else:
	raise UnknownUploader, "Uploader `%s` has not upload method" % handler.__class__

async.pool = Pool(4)
