from flask import Module, url_for, g
from flask import render_template

site = Module(__name__)

@site.route("/add/", methods=("GET", "POST"))
#@auth.require(401)
def add():
    """

    """
    return render_template("site/add.html")
    
@site.route("/view/<int:site_id>/")
def view(site_id):
    return site_id

@site.route("/edit/<int:site_id>/")
def edit(site_id):
    return render_template("site/edit.html")

@site.route("/delete/<int:site_id>")
def delete(site_id):
    return site_id