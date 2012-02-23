#coding: utf-8
#/usr/bin/env python

# This file is main
# 采集总流程
# 控制器读取sql配置,然后启动线程, 抓取文章,以及素材
# 进入文章分析
# spyder: 总控制器
# crawler: 爬虫线程器
#  seed
#  fetch
#  headers
#  docment(HTMLParse)

import threading
import _mysql as pmysql
import MySQLdb
import io, time
import socket, SocketServer

from config import DBCONFIG
from pybits import ansicolor



# config db and launcher mysql
db = pmysql.connect(host=DBCONFIG["host"], user=DBCONFIG["user"], passwd=DBCONFIG["passwd"], db=DBCONFIG["dbname"])
db.query("SET NAMES UTF8")

# config SocketServer and launcher
#class SpyderUDPHandler(SocketServer.BaseRequestHandler):
#	def handler(self):
#		data = self.request.recv(1024)
#		socket = self.request[1]
#		print "%s wrote:" % self.client_address[0]
#		print data
#		socket.sendto(data.upper(), self.client_address)
#server = SocketServer.UDPServer(("127.0.0.1", 9999), SpyderUDPHandler);
#server.serve_forever()

#class SpyderThread(threading.Thread):
#	def __init__(self):
#		threading.Thread.__init__(self);


class Spyder(object):
	def __init__(self):
		self.db = db
		self.client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
		print (ansicolor.green("Spyder") + " start launching");
		#self.sendto("Spyder start launching")
		
		#idle time
		self.needIdleTime = 0
		self.spiderList = None
		self.getSpiderList()

	def getSpiderList(self):
		if self.spiderList == None:
			self.spiderList = [];
		sql = "select * FROM spyder.seeds";
		query = self.db.query(sql);
		r = self.db.store_result();
		if r.num_rows() == 0:
			print (ansicolor.red("Spyder") + " have no Spider-Data");

		# return all data
		# fetch_row(display_rows, display_columns)
		# display_columns: default: 1, show unlimit when it set 0
		# display_columns: default: 0, only show column name when it set 1
		#                              show table.column when it set 2
		data = r.fetch_row(0, 1);
		for x in range(0, len(data)):
			seed = data[x]
			self.spiderList[seed["sid"]] = seed
			#self.spiderList[seed["sid"]]["seed"] = Seed(seed["rule"]);

	# communication with SocketServer
	def sendto(self, data):
		data = " ".join(data)
		self.client.sendto(data + "\n", ("127.0.0.1", 9999))
		received = self.client.recv(1024)

		print received


if __name__ == "__main__":
	Spyder()
