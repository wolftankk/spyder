#coding=utf-8

'''
Local variables:
tab-width: 4
c-basic-offset: 4
End:
vim600: sw=4 ts=8
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

import urlparse, io
import hashlib, StringIO, struct
from spyder.pybits import ansicolor
from spyder.fetch import Fetch
import images_cache

images_dir = images_cache.__path__.pop()

__all__ = [
    'Image'	
]

class Image(object):
    def __init__(self, url):
        self.mediaUrl = url

	if isinstance(self.mediaUrl, unicode):
	    self.mediaUrl = self.mediaUrl.replace(u"。", ".")
	    self.mediaUrl = self.mediaUrl.encode("ascii", "ignore")
	
	#新的图片名称
	self.filename = None
	self.fetched = False
        self.fetchMedia()

    def getMediaUrl(self):
        return self.mediaUrl

    def fetchMedia(self):
	f = Fetch(self.mediaUrl)
	if f.connected:
	    self.media = f.site
	    self.mediaData = self.media.read()
	    self.urlinfo = self.media.info()
	    self.fetched = True

    def save(self, file_path):
	if not os.path.exists(file_path):
	    f = io.open(file_path, "wb")
	    f.write(self.mediaData)
	    f.close()
    
    def getPath(self, need_mkdir=False):
	image_hash, filename = self.getMediaName()
	path = ""
	cache_path = ""

        for i in range(0, 8, 2):
            newpath = image_hash[i:(i+2)]
            path = os.path.join(path, newpath)
	    cache_path = os.path.join(images_dir, path)
	    if need_mkdir and not os.path.exists(cache_path):
                os.mkdir(cache_path);

        return path, cache_path

    def getSize(self):
	data = self.mediaData
	data = str(data)
	size = len(data)
	height = -1
	width = -1

	#gif
	if (size >= 10) and data[:6] in ('GIF87a', 'GIF89a'):
	    w, h = struct.unpack("<HH", data[6:10])
	    width = int(w)
	    height = int(h)

	#png2
	elif (size >= 24 and data.startswith('\211PNG\r\n\032\n') and (data[12:16] == 'IHDR')):
	    w, h = struct.unpack(">LL",data[16:24])
	    width = int(w)
	    height = int(h)

	elif (size >= 16) and data.startswith('\211PNG\r\n\032\n'):
	    w, h = struct.unpack(">LL", data[8:16])
	    width = int(w)
	    height = int(h)
	
	elif (size >= 2) and data.startswith('\377\330'):
	    jpeg = StringIO.StringIO(data)
	    jpeg.read(2)
	    b = jpeg.read(1)
	    try:
		while (b and ord(b) != 0xDA):
		    while (ord(b) != 0xFF): b = jpeg.read(1)
		    while (ord(b) == 0xFF): b = jpeg.read(1)
		    if (ord(b) >= 0xC0 and ord(b) <= 0xC3):
			jpeg.read(3)
			h, w = struct.unpack(">HH", jpeg.read(4))
			break
		    else:
			jpeg.read(int(struct.unpack(">H", jpeg.read(2))[0])-2)
		    b = jpeg.read(1)
		width = int(w)
		height = int(h)
	    except struct.error:
		pass
	    except ValueError:
		pass

	return width, height
    
    def getMediaName(self):
	'''
	获得图片的hash值， 并且将新的图片名返回回去
	'''
	image_hash = hashlib.sha1(self.mediaData)
	newname = image_hash.hexdigest()
	self.filename = newname+"."+self.getFileType()

        return newname, self.filename
    
    def getFileType(self):
        path = urlparse.urlsplit(self.mediaUrl).path;
        spath = path.split(".")
        if spath is not None:
            return spath[-1].lower()
        else:
            subtype = self.getSubType()
            maintype = self.getMainType()
            if self.getType() and subtype:
                if maintype == "image":
                    if subtype == "jpeg" or subtype == "pjpeg":
                        return "jpg"
                    elif subtype == "png":
                        return "png"
                    elif subtype == "gif":
                        return "gif"
                    elif subtype == "bmp":
                        return "bmp"
                #elif maintype == "audio":
                #elif maintype == "video":
                elif maintype == "application" and subtype == "x-shockwave-flash":
                    return "swf"
                else:
                    return None
        return None

    def getInfo(self):
        return self.urlinfo

    def getType(self):
        return self.urlinfo.gettype()

    def getMainType(self):
        return self.urlinfo.getmaintype()

    def getSubType(self):
        return self.urlinfo.getsubtype()

if __name__ == "__main__":
    m = Image('http://res.kaifu.com/isy/upload/ueditor/image/20130108/32a5hpfyu8syexkq.jpg')
    print m.getSize()
    print m.getMediaName()
    print m.getPath();
