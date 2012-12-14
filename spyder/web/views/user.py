#coding: utf-8
from flask import Module, url_for, g, redirect, flash, request, session
from flask import render_template
from web.helpers import auth

from web.models import User

user = Module(__name__)

@user.route("/add/", methods=("GET", "POST"))
@auth
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
@auth
def view(user_id):
    #user.view(uid)
    #return user_id
    return render_template("user/view.html")

@user.route("/edit/<int:user_id>/")
@auth
def edit(user_id):
    return render_template("user/edit.html")

@user.route("/delete/<int:user_id>")
@auth
def delete(user_id):
    return user_id

@user.route("/login/", methods=("GET", "POST"))
def login():
    error = None
    if request.method == 'POST':
        if request.form['name'] != "admin":
            error = 'Invalid username'
        elif request.form['password'] != "123123":
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('home.index'))
    error = (request.args.get("error") is not None) and request.args.get("error") or error
    return render_template('login.html', error=error)

@user.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('login'))
