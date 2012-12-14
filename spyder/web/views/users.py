from flask import Module, url_for, g
from flask import render_template

users = Module(__name__)

@users.route("/")
@users.route("/<int:page_id>")
def index(page=1):
    return render_template("user/list.html")
