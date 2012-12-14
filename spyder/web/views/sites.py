from flask import Module, url_for, g, session
from flask import render_template
from web.helpers import auth

sites = Module(__name__)

@sites.route("/")
@sites.route("/<int:page_id>")
@auth
def index(page=1):
    return render_template("site/list.html")
