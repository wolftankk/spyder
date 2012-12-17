#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template
from web.helpers import auth
from web.models import Site

sites = Module(__name__)

@sites.route("/", methods=("GET", "POST"))
@sites.route("/<int:page_id>")
@auth
def index(page=1):
    site = Site(current_app)
    if request.method == "POST":
        error = None
        action = request.form.get("do")
        if action == "delete":
            uids = request.form.getlist("id[]")
            if len(uids) > 0:
                for uid in uids:
                    if uid:
                        site.remove(uid)
                return redirect(url_for('sites.index'))
            else:
                error = "请选择要删除的数据"
        return error
    sites = site.list(page)
    return render_template("site/list.html", sites=sites)
