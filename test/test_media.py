#coding: utf-8

import os, sys
parentdir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src");
if parentdir not in sys.path:
    sys.path.insert(0, parentdir);

import time, unittest
from spyder.media import Image

class TestMedia(unittest.TestCase):
    def runTest(self):
        m = Image('http://img.plures.net/4577/38c5/e9b3/dadd/93dd/9182/23a2/5230.jpg')
        print m.getSize()
        print m.getMediaName()
        print m.getPath()
        print m.getFileType()
        print m.getInfo()
