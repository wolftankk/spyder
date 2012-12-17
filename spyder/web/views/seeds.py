#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template
from web.helpers import auth
from web.models import Seed, Pagination

PER_PAGE = 10

seeds = Module(__name__)

@seeds.route("/", methods=("GET", "POST"))
@seeds.route("/<int:page>")
@auth
def index(page=1):
    seed = Seed(current_app)
    filte = None
    if request.method == "POST":
        error = None
        action = request.form.get("do")
        if action == "delete":
            uids = request.form.getlist("uid[]")
            if len(uids) > 0:
                for uid in uids:
                    if uid:
                        user.remove(uid)
                return redirect(url_for('users.index'))
            else:
                error = "请选择要删除的数据"
        return error
    if request.args.get("keywords"):
        filte = "seed_name='"+request.args.get("keywords")+"'"
    seeds = seed.list(page, PER_PAGE, filte)
    if not seeds and page != 1:
        abort(404)
    count = seed.count()
    pagination = Pagination(page, PER_PAGE, count)
    return render_template("seed/list.html", pagination=pagination, seeds=seeds)