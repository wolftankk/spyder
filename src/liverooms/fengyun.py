#coding: utf-8

'''
vim: ts=8
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)));
if parentdir not in sys.path:
    sys.path.insert(0, parentdir);

from spyder.fetch import Fetch
from liverooms.tga import Tga
from spyder.pyquery import PyQuery as pq
import re
import json


def fengyun(url, roomid):
    channelurl = "http://www.fengyunzhibo.com/channel-list"
    channelPage = Fetch(channelurl).read();
    doc = pq(channelPage)
    channellist = doc.find(".hot-channel")
    #get last channellist
    gameChannelList = channellist.eq(channellist.length - 1)

    if gameChannelList:
	def entry(i, e):
	    #only parse a link
	    if e.tag == 'a':
		href = e.get('href')
		style = e.get('class')
		style = style.split(" ");
		
		if url.find(href) > -1:
		    broadCastTitle = e.text.encode('utf-8')
		    isLiving = "false"
		    if "bad" in style:
			isLiving = "false"
		    else:
			isLiving = "true"
		    r = Tga(roomid, url, broadCastTitle, isLiving)
		    r.publishTgaRoom();

	gameChannelList.find('li').children().map(entry)


if __name__ == '__main__':
    fengyun('http://www.fengyunzhibo.com/tv/plusc2.htm', '15962')
