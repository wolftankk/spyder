# Spyder
Spyder, Python开发的一套爬虫程序。使用灵活，通过dom选择器，可以灵活获取页面所需要的内容。同时配合filters、recipes让你抓取的内容更符合你的心里所需。

## Build Status
[![Build Status](https://travis-ci.org/wolftankk/spyder.png?branch=master)](https://travis-ci.org/wolftankk/spyder)

## 如何安装
* Python 2.7
* pip > 1.3
* `pip install -r requirements.txt`

## 第一次使用？
Spyder提供了Web和CLI两种模式。使用起来非常简单。
```python
from spyder.seed import Seed
from spyder.document import *

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
print items.items()
```

## 协助
如果你对此项目有兴趣，欢迎一些参与进来。
