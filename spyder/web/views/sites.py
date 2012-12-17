#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template
from web.helpers import auth
from web.models import Site, Pagination

PER_PAGE = 10

sites = Module(__name__)

@sites.route("/", methods=("GET", "POST"))
@sites.route("/<int:page>")
@auth
def index(page=1):
    site = Site(current_app)
    filte = None
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
    if request.args.get("keywords"):
        filte = "name='"+request.args.get("keywords")+"'"
    sites = site.list(page, PER_PAGE, filte)
    if not sites and page != 1:
        abort(404)
    count = site.count()
    pagination = Pagination(page, PER_PAGE, count)
    return render_template("site/list.html", pagination=pagination, sites=sites)
