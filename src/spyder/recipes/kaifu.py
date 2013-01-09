#coding: utf-8

__name__ = "开服网"

'''
用于处理开服网采集后的数据 插入到库中时候进行一些数据上的调整
'''
import time

def kaifu(insert_data, data):
    type = data["type"]

    if type == "article":
	insert_data = process_article(insert_data, data)

    return insert_data


def process_article(insert_data, data):
    insert_data["insert_time"] = str(time.strftime("%Y-%m-%d %H:%M:%S"))
    insert_data["src_url"] = data["url"]

    #if "category_id" in fields:
    #    insert_data["category_id"] = data["tags"]

    #验证数据如果title content不存在的话 就直接返回None

    if insert_data["title"] is None or insert_data["title"] == "None":
	return None

    if insert_data["content"] is None or insert_data["content"] == "None":
	return None
    
    return insert_data
