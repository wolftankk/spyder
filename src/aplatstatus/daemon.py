#coding: utf-8

'''
vim: ts=8
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)));
if parentdir not in sys.path:
    sys.path.insert(0, parentdir);

from datetime import datetime
from libs.utils import now
from time import sleep
from v17173 import v17173
from douyu import douyu


def parse():
    stime = datetime.now().strftime("%Y-%m-%d-%H:%M")
    sdir = datetime.now().strftime("%Y-%m-%d")
    sdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ddownload", sdir)
    if not os.path.isdir(sdir):
        os.mkdir(sdir)
    v17173(sdir, stime)
    douyu(sdir, stime)

t = 0
while True:
    if (t + 3600) <= now():
        parse()
        t = now()
    else:
        #print "sleep"
        s = t + 60 - now()
        if s < 1:
            s = 10
        sleep( s );
