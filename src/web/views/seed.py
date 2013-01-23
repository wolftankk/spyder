#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect, make_response
from flask import render_template
from libs import phpserialize
from web.helpers import *
from web.models import Seed, Field, Seed_fields, Tags, Seed_tag, Filter, Seed_filter
import time

seed = Module(__name__)

@seed.route("/add/", methods=("GET", "POST"))
@auth
def add():
    field = Field(current_app)
    if request.method == "POST":
        list1 = {
            "urlformat": request.form.get("urlformat"),
            "urltype": request.form.get("urltype"),
            "startpage": request.form.get("startpage"),
            "maxpage": request.form.get("maxpage"),
            "step": request.form.get("step"),
            "zero": request.form.get("zero"),
            "listparent": request.form.get("listparent"),
            "entryparent": request.form.get("entryparent"),
            "contenturl": request.form.get("contenturl"),
            "contentparent": request.form.get("contentparent"),
            "pageparent": request.form.get("pageparent"),
            "filters": request.form.get("filters")
        }
        time1 = int(time.time())
        save = {
            "type": request.form.get("type"),
            "seed_name": request.form.get("seed_name"),
            "charset": request.form.get("charset"),
            "frequency": float(request.form.get("frequency"))*3600,
            "timeout": request.form.get("timeout"),
            "tries": request.form.get("tries"),
            "enabled": request.form.get("enabled") is 1 and 1 or 0,
            "listtype": request.form.get("listtype"),
            "lang": request.form.get("lang"),
            "created_time": time1,
            "update_time": time1,
            "rule": phpserialize.dumps(list1)
        }
        fields = field.list(save["type"])
        guid_rule_datas = request.form.get("guid_rule")
        save["guid_rule"] = getFeildIdByTitle(guid_rule_datas,save["type"])
        seed = Seed(current_app)
        sid = seed.add(**save)
        if sid:
            seed_field = Seed_fields(current_app)
            #page_types = request.form.getlist("page_type[]")
            for field in fields:
                seed_value = {}
                seed_value["seed_id"] = sid
                seed_value["field_id"] = field.id
                seed_value["value"] = request.form.get(field.name)
                seed_value["page_type"] = request.form.get("page_type_"+field.name)
                seed_value["fetch_all"] = request.form.get("fetch_all_"+field.name)
                seed_field.add(**seed_value)
            #插入标签
            tags_data = request.form.get("tags")
            tags_data = tags_data.split(",")
            tags_model = Tags(current_app)
            seed_tag = Seed_tag(current_app)
            for tag in tags_data:
                tag = tag.strip()
                if tag:
                    ishere = tags_model.findByName(tag).list()
                    if len(ishere) > 0:
                        tid = ishere[0]["id"]
                    else:
                        tid = tags_model.add(name=tag)
                    ishere = seed_tag.view(sid,tid).list() 
                    if len(ishere) == 0:
                        seed_tag.add(sid=sid, tid=tid)
        url = getReferer()
        url = url and url or url_for("seeds.index")
        return redirect(url);
    fields = field.getSeedType()
    if request.method == "GET" and request.args.get("type"):
        setReferer()
        size = request.cookies.get("editorSize")
        if not size:
            size = 50
        seed_data = {}
        seed_data["rule"] = {}
        seed_type = request.args.get("type");
        fields = field.list(seed_type)
        seed_field = Seed_fields(current_app)
        page_types = seed_field.getpageType()
        alltags = []
        tags_model = Tags(current_app)
        alltags_data = tags_model.list()
        for tag in alltags_data:
            alltags.append(tag["name"])
        return render_template("seed/add.html", seed_type=seed_type, fields=fields, seed_data=seed_data, page_types=page_types, alltags=alltags, size=size)
    return render_template("seed/select_type.html", fields=fields)
    
@seed.route("/view/<int:seed_id>/")
@auth
def view(seed_id):
    return seed_id

@seed.route("/autosave/", methods=("GET", "POST"))
@auth
def autosave():
    if request.method == "POST" and request.form.get("do") == "editorResize":
        size = request.form.get("size")
        resp = make_response()
        resp.set_cookie('editorSize', size)
    return resp
    
@seed.route("/copynew/<int:seed_id>/")
@auth
def copynew(seed_id):
    if seed_id:
        seed = Seed(current_app)
        sid = seed.copynew(seed_id)
        if sid:
            seed_fields = Seed_fields(current_app)
            seed_fields.copynew(seed_id,sid)
            seed_filter = Seed_filter(current_app)
            seed_filter.copynew(seed_id,sid)
    url = request.referrer and request.referrer or url_for('seeds.index')
    return redirect(url)

@seed.route("/addlink/")
@auth
def add_link():
    return render_template("seed/add_link.html")

@seed.route("/edit/<int:seed_id>/", methods=("GET", "POST"))
@auth
def edit(seed_id):
    tags = []
    alltags = []
    if request.method == "POST" and request.form.get("sid"):
        sid = request.form.get("sid")
        enabled = checkboxVal(request.form.get("enabled"))
        list1 = {
            "urlformat": request.form.get("urlformat"),
            "urltype": request.form.get("urltype"),
            "startpage": request.form.get("startpage"),
            "maxpage": request.form.get("maxpage"),
            "step": request.form.get("step"),
            "zero": request.form.get("zero"),
            "listparent": request.form.get("listparent"),
            "entryparent": request.form.get("entryparent"),
            "contenturl": request.form.get("contenturl"),
            "contentparent": request.form.get("contentparent"),
            "pageparent": request.form.get("pageparent"),
            "filters": request.form.get("filters")
        }
        time1 = int(time.time())
        save = {
            "type": request.form.get("type"),
            "seed_name": request.form.get("seed_name"),
            "charset": request.form.get("charset"),
            "frequency": float(request.form.get("frequency"))*3600,
            "timeout": request.form.get("timeout"),
            "tries": request.form.get("tries"),
            "enabled": enabled,
            "listtype": request.form.get("listtype"),
            "lang": request.form.get("lang"),
            "update_time": time1,
            "rule": phpserialize.dumps(list1)
        }
        field = Field(current_app)
        fields = field.list(save["type"])
        guid_rule_datas = request.form.get("guid_rule")
        save["guid_rule"] = getFeildIdByTitle(guid_rule_datas,save["type"])
        seed = Seed(current_app)
        msg = seed.edit(sid, **save)
        seed_field = Seed_fields(current_app)
        # filter_model = Filter(current_app)
        # filters_org_data = filter_model.list()
        seed_filter_model = Seed_filter(current_app)
        # filters_data = {}
        # for filter_item in filters_org_data:
        #     filters_data[str(filter_item["id"])] = filter_item
        for field in fields:
            field_data = seed_field.view(sid, field.id).list()
            if len(field_data) > 0:
                seed_field.edit(sid, field.id, request.form.get(field.name), request.form.get("page_type_"+field.name), request.form.get("fetch_all_"+field.name))
            else:
                seed_value = {}
                seed_value["seed_id"] = sid
                seed_value["field_id"] = field.id
                seed_value["value"] = request.form.get(field.name)
                seed_value["page_type"] = request.form.get("page_type_"+field.name)
                seed_value["fetch_all"] = request.form.get("fetch_all_"+field.name)
                seed_field.add(**seed_value)
            #更改过滤规则
            filter_ids = request.form.getlist("filter"+str(field.id)+"[]")
            print filter_ids
            order_ct = 0
            if len(filter_ids) > 0 and filter_ids[0] != "none":
                seed_filter_model.remove(sid, field.id)
                for filter_id in filter_ids:
                    filter_item = request.form.getlist("profile_"+str(field.id)+"_"+str(filter_id)+"[]")
                    tmp = {}
                    ct = 0
                    for config in filter_item:
                        v = request.form.get(config+"_"+str(field.id)+"_"+filter_id)
                        if not v:
                            ct = ct + 1
                        tmp[config] = v
                    if ct != len(filter_item):
                        order_ct = order_ct + 1
                        filter_save = {
                            "sid": int(sid),
                            "field_id": int(field.id),
                            "filter_id": int(filter_id),
                            "profile": phpserialize.dumps(tmp),
                            "order": int(order_ct)
                        }
                        seed_filter_model.add(**filter_save)
        #更改标签
        tags_data = request.form.get("tags")
        tags_data = tags_data.split(",")
        tags_model = Tags(current_app)
        seed_tag = Seed_tag(current_app)
        current_tags_data = seed_tag.list(sid)
        del_tags_data = {}
        for current_tag in current_tags_data:
            del_tags_data[current_tag["tid"]] = current_tag;
        for tag in tags_data:
            tag = tag.strip()
            if tag:
                ishere = tags_model.findByName(tag).list()
                if len(ishere) > 0:
                    tid = ishere[0]["id"]
                else:
                    tid = tags_model.add(name=tag)
                if tid in del_tags_data:
                    del del_tags_data[tid]
                ishere = seed_tag.view(sid,tid).list() 
                if len(ishere) == 0:
                    seed_tag.add(sid=sid, tid=tid)
        for k in del_tags_data:
            seed_tag.remove(del_tags_data[k]["sid"],del_tags_data[k]["tid"])
        url = getReferer()
        url = url and url or url_for("seeds.index")
        return redirect(url)
    if request.method == "GET" and seed_id > 0:
        setReferer()
        size = request.cookies.get("editorSize")
        if not size:
            size = 50
        seed = Seed(current_app)
        seed_data = seed.view(seed_id)[0]
        seed_type = seed_data["type"]
        seed_field = getSeedFieldsBySid(seed_id, seed_type)
        seed_fields = Seed_fields(current_app)
        page_types = seed_fields.getpageType()
        seed_data["frequency"] = float(seed_data["frequency"])/float(3600)
        if seed_data["rule"]:
            seed_data["rule"] = phpserialize.loads(seed_data["rule"])
        #获取GUID规则
        print seed_data["guid_rule"]
        if seed_data["guid_rule"]:
            seed_data["guid_rule"] = getFeildTitleById(seed_data["guid_rule"],seed_type)
        print seed_data["guid_rule"]
        #取出标签
        seed_tag = Seed_tag(current_app)
        tags_model = Tags(current_app)
        tags_data = seed_tag.list(seed_id)
        for tag in tags_data:
            tmp = tags_model.view(tag["tid"])[0]
            tags.append(tmp["name"])
        alltags_data = tags_model.list()
        for tag in alltags_data:
            alltags.append(tag["name"])
    return render_template("seed/add.html", seed_type=seed_type, fields=seed_field, seed_data=seed_data, sid=seed_id, page_types=page_types, tags=tags, alltags=alltags, size=size)

@seed.route("/delete/<int:seed_id>")
@auth
def delete(seed_id):
    return seed_id

@seed.route("/set_filter/<int:seed_id>/<int:field_id>/")
@auth
def set_filter(seed_id, field_id):
    filter_model = Filter(current_app)
    filters_list = filter_model.list()
    seed_filter_model = Seed_filter(current_app)
    tmps = seed_filter_model.list(seed_id, field_id, order="order ASC")
    all_filters = []
    filters_data = {}
    tmps = tmps.list()
    for filter_item in tmps:
        filters_data[str(filter_item["filter_id"])] = filter_item
    for filter_item in filters_list:
        filter_id = str(filter_item["id"])
        if filters_data.get(filter_id):
            filters_data[filter_id]["title"] = filter_item["title"]
            filters_data[filter_id]["description"] = filter_item["description"]
            filters_data[filter_id]["profile"] = filters_data[filter_id]["profile"].encode("utf-8");
            filters_data[filter_id]["profile"] = phpserialize.loads(filters_data[filter_id]["profile"], decode_strings=True)
        if filter_item["config"]:
            filter_item["config"] = phpserialize.loads(filter_item["config"])
            filter_item["config"] = filter_item["config"].items()
            filter_item["config"].sort()
        all_filters.append(filter_item)
    filters_sort_data = {}
    for filters_item in filters_data:
        filters_sort_data[filters_data[filters_item]["order"]] = filters_data[filters_item]
    return render_template("seed/filter.html", filters=filters_sort_data, all_filters=all_filters, field_id=field_id);
