#coding: utf-8

import os, sys
parentdir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src");
if parentdir not in sys.path:
    sys.path.insert(0, parentdir);

import time, unittest
from spyder.document import *
from spyder.seed import Seed
from spyder.fetch import Fetch

class TestDocument(unittest.TestCase):
    def runTest(self):
        config = {
            'listtype': u'html',
            'tries': 5L,
            'frequency': 7200L,
            'lang': u'zhCN',
            'name': u'163新闻',
            'enabled': 1L,
            'type' : 'news',
            'charset': 'gb2312',
            'rule': {
                'urlformat': 'http://news.163.com',
                'pageparent': '', #文章翻页模板
                'maxpage': 0,
                'step': 0,
                'startpage': 0,
                'contenturl': '', #指定需要抓取的url链接，默认情况下是不需要的
                'listparent': 'div[class="ent-sports mod"]',#列表
                'urltype': 'inputLink',#链接模式
                'contentparent': 'div[id="epContentLeft"]',
                'entryparent': 'ul[class="mod-list main-list"] li a', #进一步列表过滤
                'filters': [ #过滤器，用于对文本内容的格式化
                ],
                'extrarules':[
                    ('title', 'h1[id="h1title"].text()', 0, 'content'),
                    ('content', 'div[id="endText"].html()', 0, 'content')
                ]
            },
            'timeout': 5L,
            'sid': 1000L
        }
        seed = Seed(config)
        seed.set_tags('国内新闻')
        print seed.tags
        items = Grab(seed)
        print items.keys(), items.items
        article = items['648ffb1b3306d6e3dd08655ca890d553']
        print article['title'].value
