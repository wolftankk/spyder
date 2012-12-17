from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template
from web.helpers import auth
from web.models import Seed
from web.models import Site

seed = Module(__name__)

@seed.route("/add/", methods=("GET", "POST"))
@auth
def add():
    """

    """
    site = Site(current_app)
    sites = site.getlist()
    return render_template("seed/add.html", sites=sites)
    
@seed.route("/view/<int:seed_id>/")
@auth
def view(seed_id):
    return seed_id

@seed.route("/addlink/")
@auth
def add_link():
    return render_template("seed/add_link.html")

@seed.route("/edit/<int:seed_id>/")
@auth
def edit(seed_id):
    return render_template("seed/edit.html")

@seed.route("/delete/<int:seed_id>")
@auth
def delete(seed_id):
    return seed_id
