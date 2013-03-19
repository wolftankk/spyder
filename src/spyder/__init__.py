#coding: utf-8
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
next_queue = []

def scrapy(seed):
    sid = seed["sid"]
    frequency = seed["frequency"]
    starttime = seed["start_time"]
    finishtime = seed["finish_time"]
    starttime = now()
    s = Seed(seed)
    try:
	g = Grab(s)
	g.push()
	finishtime = now()
	next_queue.append(finishtime + frequency)

	seed_db.edit(sid, **{"start_time":starttime, "finish_time":finishtime})
	log_db.insert(**{"sid" : sid, "start_time" : starttime, "finish_time" : finishtime, "`status`" : 1, "message" : "采集成功"})
	return True
    except Exception, e:
	log_db.insert(**{"sid" : sid, "start_time" : starttime, "finish_time" : now(), "`status`" : 0, "message" : "采集失败, 原因:" + str(e)})
	return False

def run():
    r = seed_db.select()
    if (len(r)):
	seedList = r.list()
	for seed in seedList:
	    sid = seed["sid"]
	    frequency = seed["frequency"]
	    starttime = seed["start_time"]
	    finishtime = seed["finish_time"]

	    if seed["enabled"] == 1:
		if (frequency + finishtime) <= now():

		    if not scrapy(seed):
		    	scrapy(seed)

		else:
		    next_queue.append(finishtime + frequency)

	if len(next_queue) == 0:
	    next_time = 600
	else:
	    next_time = min(next_queue) - now()
	    if next_time <= 0:
		next_time = 1

	print "Idle status, waitting for ", next_time
	time.sleep(next_time)

	run()

if __name__ == "__main__":
    run()
