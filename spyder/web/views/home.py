#coding: utf-8;
from flask import Module, url_for, redirect, g, flash, request, current_app, session
from flask import render_template
from web.helpers import auth
from web.models import Site, Seed, User

home = Module(__name__);

@home.route("/")
@auth
def index():
    data = 0
    sites = Site(current_app)
    site = sites.totalcount()
    seeds = Seed(current_app)
    seed = seeds.totalcount()
    users = User(current_app)
    uid = session['uid']
    user = users.view(uid)
    lastlogin = user[0]["lastlogintime"]
    return render_template("index.html", site=site, seed=seed, data=data, lastlogin=lastlogin)
