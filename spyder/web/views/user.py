#coding: utf-8
from flask import Module, url_for, g, redirect, flash, request
from flask import render_template

from web.models import User

user = Module(__name__)

@user.route("/add/", methods=("GET", "POST"))
def add():
    print dir(request), request.args
    if request.method == 'POST':
	print request.form
	user = User
	#valide
	#user.is_register
	#uid = user.add(name, password, email)
	#
	return redirect(url_for('users.index'))

    return render_template("user/add.html")

@user.route("/view/<int:user_id>/")
def view(user_id):
    #user.view(uid)
    #return user_id
    return render_template("user/view.html")

@user.route("/edit/<int:user_id>/")
def edit(user_id):
    return render_template("user/edit.html")

@user.route("/delete/<int:user_id>")
def delete(user_id):
    return user_id
