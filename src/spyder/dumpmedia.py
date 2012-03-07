import urllib2, urlparse, os, sys, io
import config
import hashlib
from pybits import ansicolor

class DumpMedia():
	def __init__(self, prefixUrl, url):
		self.mediaUrl = urlparse.urljoin(prefixUrl, url)
		self.fetch()

	def getMediaUrl(self):
		return self.mediaUrl

	def fetch(self):
		try:
			media = urllib2.urlopen(self.mediaUrl)
			self.urlinfo = media.info()
			self.write(media)
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

	def write(self, media):
		m = hashlib.sha1(self.mediaUrl)
		newname = m.hexdigest()
		path = self.getPath(newname)
		filename = os.path.join(path,  newname+"."+self.getFileType());
		#check has exit
		if not os.path.exists(filename):
			#f = io.open(filename, "wb")
			#f.write(media.read());
			#f.close()
			self.filename = filename
			return filename 
		return False

	def getMediaName(self):
		return self.filename
	
	def getFileType(self):
		path = urlparse.urlsplit(self.mediaUrl).path;
		spath = path.split(".")
		if spath is not None:
			return spath[-1]
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
		# image jpeg png gif bmp
		# audio 
		# video
		# application x-
		return self.urlinfo.gettype()

	def getMainType(self):
		return self.urlinfo.getmaintype()

	def getSubType(self):
		return self.urlinfo.getsubtype()

if __name__ == "__main__":
	DumpMedia("http://www.wordpress.org/", "http://codex.wordpress.org/images/9/9e/WP3.0-ERD.png")
