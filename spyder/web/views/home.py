#coding: utf-8;
from flask import Module, url_for, redirect, g, flash, request, current_app

home = Module(__name__);

@home.route("/")
def index(page=1):
    return render_template("index.html")
