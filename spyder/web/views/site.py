#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template

from web.helpers import auth
from web.models import Site

site = Module(__name__)

@site.route("/add/", methods=("GET", "POST"))
@auth
def add():
    error = None
    if request.method == "POST":
        name = request.form.get("name")
        url = request.form.get("url")
        descript = request.form.get("descript")
        sync_type = request.form.get("sync_type")
        if not name:
            error = "请输入站点名称"
        elif not url:
            error = "请输入站点链接"
        elif not sync_type:
            error = "请选择入库方式"
        else:
            site = Site(current_app)
            id = site.add(name=name, url=url, descript=descript, sync_type=sync_type)
            if id > 0:
                return redirect(url_for('sites.index'))
            else:
                error = "error"
    return render_template("site/add.html", error=error, site=[])
    
@site.route("/view/<int:site_id>/")
@auth
def view(site_id):
    return site_id

@site.route("/edit/<int:site_id>/")
@auth
def edit(site_id):
    site = Site(current_app)
    per = site.view(site_id)
    return render_template("site/add.html", site=per.list()[0])

@site.route("/delete/<int:site_id>")
@auth
def delete(site_id):
    return site_id