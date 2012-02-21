#coding: utf-8

# This file is main
# 采集总流程
# 控制器读取sql配置,然后启动线程, 抓取文章,以及素材
# 进入文章分析
# spyder: 总控制器
# crawler: 爬虫线程器
#  seed
#  fetch
#  docment(HTMLParse)

import threading

class SpyderThread(threading.Thread):
	def __init__(self):
		threading.Thread.__init__(self);
