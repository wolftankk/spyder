#coding=utf-8

import urllib2, urlparse, os, sys, io
import config
import hashlib, StringIO, struct
from pybits import ansicolor

class DumpMedia():
    def __init__(self, prefixUrl, url):
        self.mediaUrl = urlparse.urljoin(prefixUrl, url)
	self.filename = None;
        self.fetch()

    def getMediaUrl(self):
        return self.mediaUrl

    def fetch(self):
        try:
            self.media = urllib2.urlopen(self.mediaUrl)
            self.urlinfo = self.media.info()
        finally:
            return None

    def getPath(self, path):
        staticPath = os.path.join(os.getcwd(), config.staticPath)
        if not os.access(staticPath, os.W_OK):
            print ansicolor.green(staticPath) + " " + ansicolor.red("NEED write permission")
            sys.exit(2)

        for i in range(0, 8, 2):
            newpath = path[i:(i+2)]
            staticPath = os.path.join(staticPath, newpath)
            if not os.path.exists(staticPath):
                os.mkdir(staticPath);

        return staticPath

    def getSize(self):
	data = self.media.read()
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
	    w, h = struct.unpack(">LL". data[16:24])
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

    def write(self):
	media = self.media
        m = hashlib.sha1(self.mediaUrl)
        newname = m.hexdigest()
	
	if config.imageSaveMethod == "locale":
	    #get path
	    path = self.getPath(newname)
	    filename = os.path.join(path,  newname+"."+self.getFileType());
	elif config.imageSaveMethod == "remote":
	    return self.postMedia(media, newname)

	return False

        ###check has exit
        #if not os.path.exists(filename):
        #    #f = io.open(filename, "wb")
        #    #f.write(media.read());
        #    #f.close()
        #    self.filename = filename
        #    return filename 
        #return False

    def postMedia(self, media, newname):
	from poster.encode import multipart_encode
	from poster.streaminghttp import register_openers
	import base64
	
	register_openers()
	datagen, headers = multipart_encode({
	    "XiMaGe" : base64.b64encode(media.read()),
	    "imageName" : newname,
	    "imageType"    : self.getFileType()
	})
	request = urllib2.Request(config.uploadPath, datagen, headers);
	request.add_header("User-Agent", "Python-Spyder/1.1");

	path = urllib2.urlopen(request).read()
	path = config.staticUrl + path;
	self.filename = path
	print "下载成功";
	return True

    def getMediaName(self):
        return self.filename
    
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
    DumpMedia("http://www.wordpress.org/", "http://codex.wordpress.org/images/9/9e/WP3.0-ERD.png")
