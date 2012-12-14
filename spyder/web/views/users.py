#coding: utf-8

from flask import Module, url_for, g, session, current_app
from flask import render_template

from web.models import User
from web.helpers import auth

users = Module(__name__)

@users.route("/")
@users.route("/<int:page_id>")
@auth
def index(page=1):
    user = User(current_app)
    users = user.list(page)
    return render_template("user/list.html", users=users)