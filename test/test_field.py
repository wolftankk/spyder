#coding: utf-8


import os, sys
parentdir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src");
if parentdir not in sys.path:
    sys.path.insert(0, parentdir);

import time, unittest
from spyder.field import Field, Item


class TestField(unittest.TestCase):
    def _testItem(self):
        test_item = Item(test="a", ddd="ff")
        "ddd" in test_item
        "adads" in test_item
        test_item["aaa"] = "c"
        test_item['f1'] = Field(name = 'title', rule = 'b')

    def _testField(self):
        f = Field(name = 'Title', id = "title", rule = 'h1.text()', type = 'list', other = '222')

    def runTest(self):
        self._testField()
        self._testItem()
