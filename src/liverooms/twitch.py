#coding: utf-8

'''
vim: ts=8
'''

import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)));
if parentdir not in sys.path:
    sys.path.insert(0, parentdir)

from spyder.fetch import Fetch
from liverooms.tga import Tga
import re
import json

def twitch(url, roomid):
    parttern = re.compile('http:\/\/www\.twitch\.tv\/(.*?)\/profile');
    api_url = "https://api.twitch.tv/kraken/streams/%s"

    results = parttern.match(url)
    if results is not None:
        channel = results.group(1)
        api_url = api_url % channel
        content = Fetch(api_url).read()
        data = json.loads(content)
        broadCastTitle = "close";
        broadCastAddress = url
        isLiving = "false"
        preview = '';
        if data['stream'] is not None:
            broadCastTitle = data['stream']['channel']['status']
            broadCastAddress = data['stream']['channel']['url']
            isLiving = "true"
            if data['stream']['preview'] is not None:
                preview = data['stream']['preview']['medium'];

        r = Tga(roomid, broadCastAddress, broadCastTitle, isLiving, preview)
        r.publishTgaRoom()

if __name__ == "__main__":
    #twitch('http://www.twitch.tv/tsm_theoddone/profile', '14168');
    #twitch('http://www.twitch.tv/charleet/profile', '14168');
    #twitch('http://www.twitch.tv/riotgames/profile', '14168');
    twitch('http://www.twitch.tv/kaceytron/profile', '14168');
