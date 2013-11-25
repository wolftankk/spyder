#coding: utf-8

'''
vim: ts=8
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir) 

# major , minor, sub
VERSION = (2, 0, 0)

from web.models import Seed as Seed_Model
from web.models import Seed_log
from spyder.document import Grab
from spyder.seed import Seed
from libs.utils import now
import time

seed_db = Seed_Model()
log_db = Seed_log()

from threading import Thread;

class scrapy(Thread):
    def __init__(self, seed):
        Thread.__init__(self)
        #self.daemon = True;

        #初始化
        self.sid = seed["sid"]
        self.frequency = seed["frequency"]
        self.starttime = seed["start_time"]
        self.finishtime = seed["finish_time"]
        self.starttime = now()
        self.seed = Seed(seed)

    def _crab(self):
        self.starttime = now();

        try:
            g = Grab(self.seed)
            #发布到外网
            g.push()
            self.finishtime = now()
            seed_db.edit(self.sid, **{"start_time": self.starttime, "finish_time": self.finishtime})
            log_db.insert(**{"sid" : self.sid, "start_time" : self.starttime, "finish_time" : self.finishtime, "`status`" : 1, "message" : "采集成功"})
            return True
        except Exception, e:
            log_db.insert(**{"sid" : self.sid, "start_time" : self.starttime, "finish_time" : now(), "`status`" : 0, "message" : "采集失败, 原因:" + str(e)})
            return False

    def run(self):
        while True:
            if ((self.finishtime + self.frequency) <= now()):
                self._crab();
            else:
                need_sleep_sec = (self.finishtime + self.frequency) - now();
                time.sleep(need_sleep_sec);
                self._crab();

def run():
    r = seed_db.select()
    if (len(r)):
        seedList = r.list()
        #分配线程池, 每个都是独立管理的
        for seed in seedList:
            s = scrapy(seed)
            s.start();

if __name__ == "__main__":
    run()
