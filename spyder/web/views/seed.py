#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template
from libs.phpserialize import dumps
from web.helpers import auth
from web.models import Seed, Field, Seed_fields

seed = Module(__name__)

@seed.route("/add/", methods=("GET", "POST"))
@auth
def add():
    """

    """
    field = Field(current_app)
    if request.method == "POST":
        type = request.form.get("type")
        list = {
            "urlformat": request.form.get("urlformat"),
            "startpage": request.form.get("startpage"),
            "maxpage": request.form.get("maxpage"),
            "step": request.form.get("step"),
            "listparent": request.form.get("listparent"),
            "entryparent": request.form.get("entryparent")
        }
        save = {
            "seed_name": request.form.get("seed_name"),
            "charset": request.form.get("charset"),
            "frequency": request.form.get("frequency"),
            "timeout": request.form.get("timeout"),
            "tries": request.form.get("tries"),
            "enabled": request.form.get("enabled"),
            "listtype": request.form.get("listtype"),
            "lang": request.form.get("lang"),
            "rule": dumps(list)
        }
        seed = Seed(current_app)
        sid = seed.add(save)
        if sid:
            seed_field = Seed_fields(current_app)
            for form in request.form:
                seed_value = {}
                if form.find("field_") == 0:
                    seed_value[form] = request.form.get(form)
                    seed_field.add(seed_value)
        return redirect(url_for("seeds.index"));
    fields = field.getSeedType()
    if request.method == "GET" and request.args.get("type"):
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
