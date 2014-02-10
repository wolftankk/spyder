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

from spyder.fetch import Fetch
from liverooms.tga import Tga
import re
import json

_cids = {}
def v17173(url, roomid):
    partten = re.compile('http:\/\/v\.17173\.com\/live\/(\d+)\/(\d+)')
    jsonurl_tpl = "http://v.17173.com/live/l_jsonData.action?liveRoomId=%s"

    results = partten.match(url);
    if not results is None:
	lroomid = results.group(2)
	if lroomid > 0:
	    jsonurl = jsonurl_tpl % lroomid
	    content = Fetch(jsonurl, charset = 'utf-8', timeout = 300).read()
	    if (content):
		data = json.loads(content)
		liveInfo = data['obj']['liveInfo']['live']
		if "liveStatus" in liveInfo:
		    broadCastTitle = liveInfo['liveTitle']
		    isLiving = "true"
                    if (roomid not in _cids) or (_cids[roomid] != liveInfo['cId']):
                        #stop
                        r = Tga(roomid, url, "stop", 'false')
                        r.publishTgaRoom();
                    _cids[roomid] = liveInfo['cId']
		else:
		    broadCastTitle = "stop"
		    isLiving = "false"

                broadCastTitle = broadCastTitle.encode('utf-8')
		r = Tga(roomid, url, broadCastTitle, isLiving)
		r.publishTgaRoom();


if __name__ == "__main__":
    #test
    #v17173('http://v.17173.com/live/17322102/2173011702', '14168')
    #v17173('http://v.17173.com/live/17320204/2173009804', '21')
    v17173('http://v.17173.com/live/17374105/2173065405', '14168')
