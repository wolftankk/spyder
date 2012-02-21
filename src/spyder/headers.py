#coding: utf-8


from pybits import ansicolor

# 分析页面header信息
class Headers(object):
	def __init__(self, response):
		self.response = response

	#或者状态码
	def getcode(self):
		return int(self.response.status)

	def is_ok(self):
		return self.getcode() == 200

	def timeout(self):
		return self.getcode() == 308

	def bad_request(self):
		return self.getcode() == 400

	def is_unauthorized(self):
		return self.getcode() == 401

	def is_forbidden(self):
		return self.getcode() == 403

	def is_missing(self):
		return self.getcode() == 404

	# 内部服务器出错
	def internal_server_error(self):
		return self.getcode() == 400

	def content_type(self):
		return self.response.getheader("content-type");

	def content_charset(self):
		content_type = self.content_type()
		if content_type == None:
			return None
		else:
			for k in content_type.split(";"):
				k = k.strip()
				if k.find("charset=") != -1:
					return k.split("=")[1]

		return None

	def is_content_type(self, type):
		print type
	
	def plain_text(self):
		return self.is_content_type("text/plain")

	def directory(self):
		return self.is_content_type("text/directory")

	def html(self):
		return self.is_content_type("text/html")

	def xml(self):
		return (self.is_content_type("text/xml") or self.is_content_type("application/xml"))

	def xsl(self):
		return self.is_content_type("text/xsl")

	def javascript(self):
		return (self.is_content_type("text/javascript") or self.is_content_type("application/javascript"))

	def json(self):
		return self.is_content_type("application/json")

	def css(self):
		return self.is_content_type("text/css")

	def rss(self):
		return (self.is_content_type("application/rss+xml") or self.is_content_type("application/rdf+xml"))

	def atom(self):
		return self.is_content_type("application/atom+xml")

	def ms_word(self):
		return self.is_content_type("application/msword")

	def pdf(self):
		return self.is_content_type("application/pdf")

	def zip(self):
		return self.is_content_type("application/zip")

	def cookies(self):
		#get Set-cookie from response 
		return (self.response.getheader("set-cookie") or "")
	
	def cookie_params(self):
		params = [];
		cookies = self.cookies();
		for param in cookies.split(";"):
			param = param.strip();
			#secure; HttpOnly;
			#(name, value) = param.split("=", 1)

			#print name, value



if __name__ == "__main__":
	urls = [
		"www.wowshell.com",
		"http://blog.wolftankk.com/feed/",
		"github.com"
	]

	import httplib 
	#HTTPSConnection, HTTPConnection
	#for url in urls:
	#	site = httplib.HTTPSConnection(url);
	#	site.request("GET", "/");
	#	header = Headers(site.getresponse())
	#	#print header.cookie_params()
	#	#print header.content_charset().read()
