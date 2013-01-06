#coding: utf-8

from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template

from web.models import User, Pagination
from web.helpers import auth

PER_PAGE = 10

users = Module(__name__)

@users.route("/", methods=("GET", "POST"))
@users.route("/<int:page>")
@auth
def index(page=1):
    user = User(current_app)
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
        filte = "username='"+request.args.get("keywords")+"'"
    users = user.list(page, PER_PAGE, filte)
    if not users and page != 1:
        abort(404)
    count = user.totalcount()
    pagination = Pagination(page, PER_PAGE, count)
    return render_template("user/list.html", pagination=pagination, users=users)