#coding: utf-8;
from flask import Module, url_for, redirect, g, flash, request, current_app, session
from flask import render_template
from web.helpers import auth

home = Module(__name__);

@home.route("/")
@auth
def index():
    return render_template("index.html")
