#coding: utf-8

from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template

from web.models import User
from web.helpers import auth

users = Module(__name__)

@users.route("/", methods=("GET", "POST"))
@users.route("/<int:page_id>")
@auth
def index(page=1):
    user = User(current_app)
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
    users = user.list(page)
    return render_template("user/list.html", users=users)