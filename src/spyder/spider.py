#coding: utf-8
#!/usr/bin/env python

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,parentdir)

import threading
import io, time
from spyder.pybits import ansicolor
from spyder.seed import Seed
from document import Grab 
from web.models import Seed as Seed_Model
from libs.utils import now, safestr

class Spyder(object):
    def __init__(self):
	print ansicolor.green("Spyder") + " start launching"
	self.db = Seed_Model()
	#idle time
	self.needIdleTime = 600
	self.spiderList = None
	#self.queue = {}

    def getSpiderList(self):
	'''
	self.spiderList = {};
	sql = "select * FROM seeds";
	query = self.db.query(sql);
	r = self.db.store_result();
	if r.num_rows() == 0:
	    print (ansicolor.red("Spyder") + " have no Spider-Data");
	    return

	# return all data
	# fetch_row(display_rows, display_columns)
	# display_columns: default: 1, show unlimit when it set 0
	# display_columns: default: 0, only show column name when it set 1
	#                              show table.column when it set 2
	data = r.fetch_row(0, 1);
	for x in range(0, len(data)):
	    seedInfo = data[x]
	    sid = int(seedInfo["sid"]);
	    #init seed and format
	    self.spiderList[sid] = Seed(seedInfo)
	'''

    def Test(self, sid):
	if not sid:
	    return;
	r = self.db.view(sid)
	if len(r) == 0:
	    print ansicolor.red("Spyder") + " sid " + str(sid) + " has not exists."
	    return
	data = r.list();
	if data and len(data) > 0:
	    print data[0]
	    seed = Seed(data[0]);
	    print "Seed %s start fetching." % ansicolor.yellow(seed)
	    docData = Grab(seed, False)

    def run(self, force):
	'''
	self.getSpiderList()

	for sid in self.spiderList:
	    seed = self.spiderList[sid]
	    if seed.enabled == "1":
		#是否需要启用多线程?
		frequency  = seed.frequency
		finishtime = seed.finishtime
		starttime  = seed.starttime
		if ((frequency + finishtime) < now()) or force:
		    seed.starttime = now()
		    #if not saved in db, set false
		    docData = Grab(seed)
		    seed.finishtime = now()

		    sql = "UPDATE seeds SET starttime=%s, finishtime=%s WHERE sid=%s" % (seed.starttime, seed.finishtime, seed.sid);
		    self.db.query(sql)

	print "进入休息时间";
	#300秒间隔检测
	time.sleep(self.needIdleTime);
	print "休息结束 开始重新启动抓取程序";
	self.run(force);
	'''

if __name__ == "__main__":
    from StringIO import StringIO
    class Logger(object):
        def __init__(self):
            self.log = StringIO()
            self.terminal = sys.stdout

        def write(self, message):
            #self.terminal.write(message)
            self.log.write(safestr(message));

	def getvalue(self):
	    self.terminal.write(self.log.getvalue());
        
    sys.stdout = Logger()

    Spyder().Test(2)
    sys.stdout.getvalue()

    #import getopt, sys
    #try:
    #    opts, args = getopt.getopt(sys.argv[1:], "Vhrt:", ["run", "test=", "version", "help", "force"]);
    #except getopt.GetoptError, err:
    #    print str(err)
    #    sys.exit(2)

    #if len(opts) == 0 :
    #    opts = [('--run', '')]

    ##isRun = False
    ##isForce = False
    #for o, a in opts:
    #    if o == "-V" or o == "--version":
    #        print "0.1"
    #    elif o == "-t" or o == "--test":
    #        try:
    #            sid = int(a)
    #        except ValueError:
    #            sys.stdout.write("请输入需要测试的sid")
    #            sys.exit(2)

    #        if sid == 0:
    #            sys.stdout.write("请输入需要测试的sid")
    #            sys.exit(2)
    #        Spyder().Test(sid)
    #    elif o == "-r" or o == "--run":
    #        isRun = True
    #    elif o == "--force":
    #        isForce = True

    #if isRun:
    #	Spyder().run(isForce)