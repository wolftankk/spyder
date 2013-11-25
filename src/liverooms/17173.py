#coding: utf-8

'''
vim: ts=8
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)));
if parentdir not in sys.path:
    sys.path.insert(0, parentdir);

'''
专门抓17173的房间直播状态
'''

from libs.utils import now
from spyder.fetch import Fetch
from hashlib import md5
import json
import time

def publishTgaRoom():
    '''publish'''
    


def checkLiveStatus(roomid):
    roomid = int(roomid);
    url = "http://v.17173.com/live/l_jsonData.action?liveRoomId=%d" % roomid
    content = Fetch(url, charset = 'utf-8', timeout = 300).read()
    if (content):
        data = json.loads(content)
        liveInfo = data['obj']['liveInfo']['live']

checkLiveStatus(2173011702)
