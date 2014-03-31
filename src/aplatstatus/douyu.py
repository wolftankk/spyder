#coding: utf-8

'''
vim: ts=8
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)));
if parentdir not in sys.path:
    sys.path.insert(0, parentdir)

from spyder.fetch import Fetch
from spyder.seed import Seed
from spyder.document import Grab
from csvclient import UnicodeWriter

config = {
    'listtype': u'html',
    'tries': 5L,
    'frequency': 7200L,
    'lang': u'zhCN',
    'seed_name': u'斗鱼列表抓取',
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
        'zero': 1,
        'entryparent': '',
        'filters': [
            #filterid, value, fetch_all, type(content/list)
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

def douyu(sdir, stime):
    seed = Seed(config);
    data = Grab(seed);
    fname = "douyu-%s.csv" % stime
    fname = os.path.join(sdir, fname)
    fhandler = open(fname, 'w');
    csvclient = UnicodeWriter(fhandler);
    csvclient.writerow([u"链接", u"直播标题", u"游戏名", u"主播", u"在线人数"]);
    for guid in data.items:
        item = data.items[guid]
        csvclient.writerow([item['url'], item["title"]['value'], item["game"]['value'], item["name"]['value'],item["view"]['value']])
