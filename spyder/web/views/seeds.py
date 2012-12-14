from flask import Module, url_for, g, session
from flask import render_template
from web.helpers import auth

seeds = Module(__name__)

@seeds.route("/")
@seeds.route("/<int:page_id>")
@auth
def index(page=1):
    return render_template("seed/list.html")
