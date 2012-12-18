#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template
from web.helpers import auth
from web.models import Seed, Field, Seed_fields

seed = Module(__name__)

@seed.route("/add/", methods=("GET", "POST"))
@auth
def add():
    """

    """
    if request.method = "POST":
        save = {
            "seed_name": request.form.get("seed_name")
        }
        seed = Seed(current_app)
        #seed.add(save)
        return redirect(url_for("seeds.index"));
    field = Field(current_app)
    fields = field.getSeedType()
    if request.method = "GET" and request.args.get("type"):
        seed_type = request.args.get("type");
        fields = field.list(seed_type)
        return render_template("seed/add.html", seed_type=seed_type, fields=fields)
    return render_template("seed/select_type.html", fields=fields)
    
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
