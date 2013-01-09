#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template

from libs import phpserialize
from web.helpers import auth, getSeedFieldsByType
from web.models import Site, Site_map, Seed, Field

site_map = Module(__name__)

@site_map.route("/add/", methods=("GET", "POST"))
@auth
def add():
    error = None
    succ = None
    seed_type = request.args.get("type")
    site_id = request.args.get("site_id")
    if request.method == "POST":
        table_name = request.form.get("table_name")
        if table_name:
            field_ids = request.form.getlist("field_id[]");
            site_fields = request.form.getlist("site_field[]");
            seed_type =request.form.get("seed_type")
            site_id = request.form.get("site_id")
            site_map = Site_map(current_app)
            for i,k in enumerate(field_ids):
                save = {
                    "siteid": site_id,
                    "table_name": table_name,
                    "field_id": field_ids[i],
                    "seed_type": seed_type,
                    "site_field": site_fields[i]
                }
                site_map_id = site_map.add(**save)
            succ = u"添加成功！"
        else:
            error = u"数据表名不能为空"
    fields = getSeedFieldsByType(seed_type)
    return render_template("site_map/add.html", fields=fields, seed_type=seed_type, site_id=site_id, error=error, succ=succ)

@site_map.route("/edit/", methods=("GET", "POST"))
@auth
def edit():
    error = None
    succ = None
    table_name = ""
    seed_type = request.args.get("type")
    site_id = request.args.get("site_id")
    site_map = Site_map(current_app)
    if request.method == "POST":
        table_name = request.form.get("table_name")
        if table_name:
            field_ids = request.form.getlist("field_id[]");
            site_fields = request.form.getlist("site_field[]");
            seed_type =request.form.get("seed_type")
            site_id = request.form.get("site_id")
            for i,k in enumerate(field_ids):
                fid = field_ids[i]
                ishere = site_map.view(site_id, seed_type, fid).list()
                save = {
                    "siteid": site_id,
                    "table_name": table_name,
                    "field_id": field_ids[i],
                    "seed_type": seed_type,
                    "site_field": site_fields[i]
                }
                if len(ishere) > 0:
                    ishere = ishere[0]
                    site_map_id = site_map.edit(ishere["id"],**save)
                else:
                    site_map_id = site_map.add(**save)
            succ = u"修改成功！"
        else:
            error = u"数据表名不能为空"
    chk = {"siteid":site_id, "seed_type": seed_type}
    website_maps = site_map.getlist(chk)
    maps = {}
    fields = getSeedFieldsByType(seed_type)
    for website_map in website_maps:
        table_name = website_map["table_name"]
        maps[website_map["field_id"]] = website_map["site_field"]
    return render_template("site_map/add.html", fields=fields, seed_type=seed_type, site_id=site_id, error=error, succ=succ, table_name=table_name, maps=maps)