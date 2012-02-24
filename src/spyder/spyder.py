#coding: utf-8
#/usr/bin/env python

import threading
import _mysql as pmysql
import MySQLdb
import io, time
import socket, SocketServer

from config import DBCONFIG
from pybits import ansicolor

from seed import Seed


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

def now():
	return int(time.time())

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
		self.queue = {}

	def getSpiderList(self):
		if self.spiderList == None:
			self.spiderList = {};
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
			seedInfo = data[x]
			sid = int(seedInfo["sid"]);
			self.spiderList[sid] = Seed(seedInfo)


	def run(self):
		if self.spiderList == None:
			self.getSpiderList()

		for sid in self.spiderList:
			seed = self.spiderList[sid]
			if self.queue[sid] == None:
				print seed

	# force: true/false
	def refreshList(self, force):
		self.spiderList = None
			
	# communication with SocketServer
	def sendto(self, data):
		data = " ".join(data)
		self.client.sendto(data + "\n", ("127.0.0.1", 9999))
		received = self.client.recv(1024)

		print received

if __name__ == "__main__":
	Spyder().run()
