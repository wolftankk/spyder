#coding: utf-8

import os, sys
parentdir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src");
if parentdir not in sys.path:
    sys.path.insert(0, parentdir);

import time, unittest
from spyder.seed import *

class TestSeed(unittest.TestCase):
    def runTest(self):
        config = {
            'listtype': u'html',
            'tries': 5L,
            'frequency': 7200L,
            'lang': u'zhCN',
            'name': u'斗鱼列表抓取',
            'enabled': 1L,
            'rule': {
                'urlformat': 'http://www.douyu.tv/directory/all?offset=$page&limit=30',
                'pageparent': '',
                'maxpage': 25,
                'step': 30,
                'startpage': 0,
                'contenturl': '',
                'listparent': 'div[id="item_data"] ul li',
                'urltype': 'createLink',#链接模式
                'contentparent': 'a[class="list"]',
                'entryparent': '',
                'filters': [ #过滤器，用于对文本内容的格式化
                ],
                'extrarules':[
                    ('title', 'h1[class="title"].text()', 0, 'list'),
                    ('view', 'span[class="view"].text()', 0, "list"),
                    ('name', 'span[class="nnt"].text()', 0, "list"),
                    ('game', 'span[class="zbName"].text()', 0, "list"),
                ]
            },
            'timeout': 5L,
            'sid': 1000L
        }

        seed = Seed(config)
        print seed
        rule = seed.getRule()
        rl = rule.getListRule()
        print rl.getListUrls()
        ra = rule.getArticleRule()

