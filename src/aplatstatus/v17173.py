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
    'listtype': u'json',
    'tries': 5L,
    'frequency': 7200L,
    'lang': u'zhCN',
    'seed_name': u'斗鱼列表抓取',
    'enabled': 1L,
    'rule': {
        'urlformat': 'http://v.17173.com/live/index/gameList.action?key=&gameId=&pageSize=9&pageNum=$page&_=13959108342111',
        'pageparent': '',
        'maxpage': 20,
        'step': 1,
        'startpage': 0,
        'contenturl': '',
        'listparent': '',
        'urltype': 'createLink',#链接模式
        'contentparent': '',
        'zero': 1,
        'entryparent': 'obj',
        'filters': [
            #filterid, value, fetch_all, type(content/list)
        ],
        'extrarules':[
        ]
    },
    'timeout': 5L,
    'sid': 1000L
}

def v17173(sdir, stime):
    seed = Seed(config);
    data = Grab(seed);
    fname = "v17173-%s.csv" % stime
    fname = os.path.join(sdir, fname)
    fhandler = open(fname, 'w');
    csvclient = UnicodeWriter(fhandler);
    csvclient.writerow([u"链接", u"直播标题", u"游戏名", u"主播", u"在线人数"]);
    if data.items is not None:
        for items in data.items:
            data = items[0]['list'];
            for item in data:
                csvclient.writerow([item['url'], item['liveTitle'],item['gameName'], item['userName'],  item['viewSum']])
