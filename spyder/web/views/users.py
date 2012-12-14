from flask import Module, url_for, g, session
from flask import render_template
from web.helpers import auth

users = Module(__name__)

@users.route("/")
@users.route("/<int:page_id>")
@auth
def index(page=1):
    return render_template("user/list.html")
