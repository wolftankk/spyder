#coding: utf-8

import os, socket, urllib, urlparse

from lib import ansicolor

# 设定UA值
_user_agent = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)"

# 只负责抓取文章以及该网页上的media
class Fetcher(object):
	PROTO_FTP = 1
	PROTO_HTTP = 2

	lineWidth = 78
	actionWidth = 6
	rateWidth = 10
	sizeWidth = 10
	urlWidth = lineWidth - actionWidth - rateWidth - sizeWidth - 7;
	units = {
		0 : "B",
		1 : "KB",
		2 : "MB",
		3 : "GB",
		4 : "TB",
		5 : "PB",
		6 : "EB"
	}
	
	def __init__(self, url = None):
		#尝试次数设定
		self.tries = 1
		if os.environ.get("TRIES"):
			self.tries = int(os.environ.get("TRIES"))
		#尝试等待时间
		self.rerey_wait = RETRY_WAIT

		self.proto = None
		self.url = url
		
		self.timestamp = False
		self.download_size = None
		self.totalSize = None
		self.started = False
		self.error = None


if __name__ == "__main__":
	f = Fetcher("http://www.wowshell.com")
