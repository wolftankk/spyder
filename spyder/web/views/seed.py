from flask import Module, url_for, g
from flask import render_template

seed = Module(__name__)

@seed.route("/add/", methods=("GET", "POST"))
#@auth.require(401)
def add():
    """

    """
    return render_template("seed/add.html")
    
@seed.route("/view/<int:seed_id>/")
def view(action, seed_id):
    return seed_id

@seed.route("/addlink/")
def add_link():
    return render_template("seed/add_link.html")

@seed.route("/edit/<int:seed_id>/")
def edit(action, seed_id):
    return render_template("seed/edit.html")

@seed.route("/delete/<int:seed_id>")
def delete(action, seed_id):
    return seed_id
