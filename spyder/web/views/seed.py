from flask import Module, url_for, g, session
from flask import render_template
from web.helpers import auth

seed = Module(__name__)

@seed.route("/add/", methods=("GET", "POST"))
@auth
def add():
    """

    """
    return render_template("seed/add.html")
    
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
