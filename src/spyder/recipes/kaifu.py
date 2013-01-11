#coding: utf-8

'''
用于处理开服网采集后的数据 插入到库中时候进行一些数据上的调整
'''
import time, datetime
from libs.utils import safestr, now

def kaifu(db, insert_data, data):
    type = data["type"]
    if type == "article":
	insert_data = process_article(db, insert_data, data)
    elif type == "game":
	insert_data = process_game(db, insert_data, data)
    elif type == "kaifu":
	insert_data = process_kaifu(db, insert_data, data)
    elif type == "kaice":
	insert_data = process_kaice(db, insert_data, data)
    elif type == "gift":
	insert_data = process_gift(db, insert_data, data)
    elif type == "company":
	insert_data = process_company(db, insert_data, data)
    elif type == "gallery":
	insert_data = process_gallery(db, insert_data, data)

    return insert_data


def process_article(db, insert_data, data):
    insert_data["src_url"] = data["url"]
    insert_data["category_id"] = data["tags"]
    insert_data["insert_time"] = str(time.strftime("%Y-%m-%d %H:%M:%S"))

    r = db.get_one(where={ "guid" : insert_data["guid"]})
    if r:
	return None;

    #验证数据如果title content不存在的话 就直接返回None

    if insert_data["title"] is None or insert_data["title"] == "None" or insert_data["title"] == "":
	return None

    if insert_data["content"] is None or insert_data["content"] == "None" or insert_data["content"] == "":
	return None

    """
    if "keywords" in insert_data:
	keywords = insert_data["keywords"]
    """
    return insert_data

def process_game(db, insert_data, data):
    r = db.get_one(where={ "game_name" : insert_data["game_name"]})
    if r:
	return None;

    r = db.get_one(where={ "guid" : insert_data["guid"]})
    if r:
	return None;

    if insert_data["game_name"] is None or insert_data["game_name"] == "None" or insert_data["game_name"] == "":
	return None

    return insert_data
    
date_rule = [
    "%m月%d日%H点开服",
    "%m月%d日%H:%M",
    "%m月%d日%H点",
    "%m月%d日 %H点"
]
def process_kaifu(db, insert_data, data):
    insert_data["insert_time"] = str(time.strftime("%Y-%m-%d %H:%M:%S"))

    r = db.get_one(where={ "guid" : insert_data["guid"]})
    if r:
	return None;

    test_date = safestr(insert_data['test_date'])
    
    today = datetime.datetime.today()

    today_month = today.month
    today_day = today.day
    today_year = today.year

    today_string = "%.2d月%.2d日" % (today_month, today_day)
    test_date = test_date.replace("今日", today_string)

    for rule in date_rule:
	try:
	    new_test_date = time.strptime(safestr(test_date), rule)
	    if new_test_date:
		y = new_test_date[0]
		m = new_test_date[1]
		d = new_test_date[2]
		h = new_test_date[3]
		if y == 1900:
		    y = today_year

		new_test_date = datetime.datetime(y, m, d, h)
		insert_data["test_date"] = str(new_test_date)
		break;
	except:
	    pass

    if insert_data["game_name"] is None or insert_data["game_name"] == "None" or insert_data["game_name"] == "":
	return None

    return insert_data

def process_kaice(db, insert_data, data):
    insert_data["insert_time"] = str(time.strftime("%Y-%m-%d %H:%M:%S"))

    r = db.get_one(where={ "guid" : insert_data["guid"]})
    if r:
	return None;
    
    if safestr(data['kaice_type'].value) == "网页游戏":
	if "test_date" in insert_data:
	    insert_data["test_date"] = safestr(insert_data["test_date"]).replace("今日", str(time.strftime("%Y-%m-%d")))

	if insert_data["game_name"] is None or insert_data["game_name"] == "None" or insert_data["game_name"] == "":
	    return None

	return insert_data
    else:
	return None

def process_gift(db, insert_data, data):
    insert_data["insert_time"] = str(time.strftime("%Y-%m-%d %H:%M:%S"))

    r = db.get_one(where={ "guid" : insert_data["guid"]})
    if r:
	return None;

    if insert_data["gift_title"] is None or insert_data["gift_title"] == "None" or insert_data["gift_title"] == "":
	return None

    return insert_data

def process_company(db, insert_data, data):
    insert_data["insert_time"] = str(time.strftime("%Y-%m-%d %H:%M:%S"))

    r = db.get_one(where={ "guid" : insert_data["guid"]})
    if r:
	return None;

    return insert_data

def process_gallery(db, insert_data, data):
    insert_data["src_url"] = data["url"]
    insert_data["category_id"] = data["tags"]
    insert_data["insert_time"] = str(time.strftime("%Y-%m-%d %H:%M:%S"))
    
    r = db.get_one(where={ "guid" : insert_data["guid"]})
    if r:
	return None;

    if insert_data["title"] is None or insert_data["title"] == "None" or insert_data["title"] == "":
	return None

    if "gallery_path" in insert_data and isinstance(insert_data["gallery_path"], list):
	body = ""
	image_template = '<img src="%s">'
	for img in insert_data["gallery_path"]:
	    body += image_template % img
	
	insert_data["gallery_path"] = body

	return insert_data
    else:
	return None
