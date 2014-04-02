#coding: utf-8

import os, sys
parentdir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src");
if parentdir not in sys.path:
    sys.path.insert(0, parentdir);

import time, unittest
from spyder.fetch import Fetch

class TestFetch(unittest.TestCase):
    def runTest(self):
        try:
            f = Fetch("http://tga.plu.cn")
            if f.connected:
                f.read()
                print f.getCharset(), f.getCode(), f.isReady()
        except Exception, e:
            print e

