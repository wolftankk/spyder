from flask import Module, url_for, g
from flask import render_template

sites = Module(__name__)

@sites.route("/")
@sites.route("/<int:page_id>")
def index(page=1):
    return render_template("site/list.html")
