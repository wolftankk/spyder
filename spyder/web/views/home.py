#coding: utf-8;
from flask import Module, url_for, redirect, g, flash, request, current_app
from flask import render_template

home = Module(__name__);

@home.route("/")
def index():
    return render_template("index.html")
@home.route("/login")
def login():
    return render_template("login.html")
