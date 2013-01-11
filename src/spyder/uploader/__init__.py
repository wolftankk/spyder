#coding: utf-8

from inspect import getmodule
from multiprocessing import Pool

from .qbox import qbox
from .aliyun import aliyun
from .ftp import ftp

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
	method = getattr(handler, "upload");
	if method:
	    r = method(image_path, upload_path)

async.pool = Pool(1)
