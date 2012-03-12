#coding: utf-8
#/usr/bin/env python

import threading
import io, time
from pybits import ansicolor
from seed import Seed
from document import Grab 
from db import db

def now():
    return int(time.time())

class Spyder(object):
    def __init__(self):
        self.db = db
        print (ansicolor.green("Spyder") + " start launching");

        #idle time
        self.needIdleTime = 600
        self.spiderList = None
        #self.queue = {}

    def getSpiderList(self):
        self.spiderList = {};
        sql = "select * FROM spyder.seeds";
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

    def Test(self, sid):
        if not sid:
            return;
        sql = "SELECT * FROM spyder.seeds WHERE sid=%s" % sid;
        query = self.db.query(sql)
        r = self.db.store_result();
        if r.num_rows() == 0:
            print (ansicolor.red("Spyder") + " sid " + str(sid) + " has not exists.");
            return
        data = r.fetch_row(0, 1);
        if data and len(data) > 0:
            seed = Seed(data[0]);
            print "Seed %s start fetching." % ansicolor.yellow(seed)
            docData = Grab(seed, False)

    def run(self):
        self.getSpiderList()

        waits = []
        for sid in self.spiderList:
            seed = self.spiderList[sid]
            if seed.enabled == "1":
                #是否需要启用多线程?
                frequency  = seed.frequency
                finishtime = seed.finishtime
                starttime  = seed.starttime
                waits.append(seed.finishtime+frequency);
                if (frequency + finishtime) < now():
                    seed.starttime = now()
                    #if not saved in db, set false
                    docData = Grab(seed)
                    seed.finishtime = now()

                    waits.append(seed.finishtime+frequency);
                    sql = "UPDATE spyder.seeds SET starttime=%s, finishtime=%s WHERE sid=%s" % (seed.starttime, seed.finishtime, seed.sid);
                    self.db.query(sql)

        print "进入休息时间";
        #300秒间隔检测
        time.sleep(self.needIdleTime);
        print "休息结束 开始重新启动抓取程序";
        self.run();

if __name__ == "__main__":
    import getopt, sys
    try:
        opts, args = getopt.getopt(sys.argv[1:], "Vhrt:", ["run", "test=", "version", "help"]);
    except getopt.GetoptError, err:
        print str(err)
        sys.exit(2)

    for o, a in opts:
        if o == "-V" or o == "--version":
            #get spyder version
            import __init__
            print __init__.VERSION
        elif o == "-h" or o == "--help":
            print "Spyder help"
        elif o == "-t" or o == "--test":
            try:
                sid = int(a)
            except ValueError:
                print "请输入需要测试的sid"
                sys.exit(2)

            if sid == 0:
                print "请输入需要测试的sid"
                sys.exit(2)
            Spyder().Test(sid)
        elif o == "-r" or o == "--run":
            Spyder().run()
