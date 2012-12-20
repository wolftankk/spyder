#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template

from libs import phpserialize
from web.helpers import auth
from web.models import Site, Site_map, Seed, Field

site_map = Module(__name__)

@site_map.route("/select/<int:site_id>/")
@auth
def select_seed(site_id):
    field = Field(current_app)
    types = field.getSeedType()
    return render_template("site_map/select.html", types=types, site_id=site_id)

@site_map.route("/add/", methods=("GET", "POST"))
@auth
def add():
    fields = {}
    if request.method == "POST":
        return True
    if request.args.get("id"):
        site_map = Site_map(current_app)
    else:
        return True
    return render_template("site_map/add_seed.html", fields=fields)