#coding: utf-8

from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template

from web.helpers import auth

settings = Module(__name__)

@settings.route("/", methods=("GET", "POST"))
@auth
def index():
    settings = {}
    return render_template("settings.html", settings=settings)