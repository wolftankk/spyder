from flask import Module, url_for, g
from flask import render_template

seeds = Module(__name__)

@seeds.route("/")
@seeds.route("/<int:page_id>")
def index(page=1):
    return render_template("seed/list.html")
