from flask import Module, url_for, g, session
from flask import render_template
from web.helpers import auth

site = Module(__name__)

@site.route("/add/", methods=("GET", "POST"))
@auth
def add():
    """

    """
    return render_template("site/add.html")
    
@site.route("/view/<int:site_id>/")
@auth
def view(site_id):
    return site_id

@site.route("/edit/<int:site_id>/")
@auth
def edit(site_id):
    return render_template("site/edit.html")

@site.route("/delete/<int:site_id>")
@auth
def delete(site_id):
    return site_id