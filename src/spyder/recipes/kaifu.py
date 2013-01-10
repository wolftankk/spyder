#coding: utf-8

__name__ = "开服网"

'''
用于处理开服网采集后的数据 插入到库中时候进行一些数据上的调整
'''
import time

def kaifu(db, insert_data, data):
    type = data["type"]
    insert_data["insert_time"] = str(time.strftime("%Y-%m-%d %H:%M:%S"))

    if type == "article":
	insert_data = process_article(db, insert_data, data)
    elif type == "game":
	insert_data = process_game(db, insert_data, data)

    return insert_data


def process_article(db, insert_data, data):
    insert_data["src_url"] = data["url"]
    insert_data["category_id"] = data["tags"]

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
    

"""
    def __parseDate(self, str):
	'''
	转成timestamp
	'''
	t1 = "今日 17点"
	t2 = "01月08日09点开服"
	t3 = "01月07日14:10"
	#str = safestr(str)
	#print time.strptime(str, "今日 %H点")

	#t2 = safestr(t2)
	#print time.strptime(t2, safestr("%m月%d日%H点开服"))

	#print time.strptime(t3, safestr("%m月%d日%H:%M"))
	#return int(now())
"""
