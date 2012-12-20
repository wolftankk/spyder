#coding: utf-8
from hashlib import md5
from flask import Module, url_for, g, redirect, flash, request, session, current_app
from flask import render_template
from web.helpers import auth, getPermissions, createSalt

from web.models import User
from datetime import datetime

user = Module(__name__)

@user.route("/add/", methods=("GET", "POST"))
@auth
def add():
    error = None
    if request.method == 'POST':
    	uname = request.form.get("name")
        password = request.form.get("password")
        confirm = request.form.get("confirm")
        mail = request.form.get("mail")
        group = getPermissions(request.form.get("group"))
        user = User(current_app)
        userdata = user.check(uname)
        if password != confirm:
            return render_template("user/add.html", error="两次密码不匹配")
        if len(userdata) == 0:
            if password:
                #valide
                salt = createSalt()
                password = md5(md5(password).hexdigest() + salt).hexdigest()
                uid = user.add(username=uname, passwd=password, email=mail, permissions=group, salt=salt)
                if uid > 0:
                    return redirect(url_for('users.index'))
                else:
                    error = u"添加失败"
            else:
                error = u"密码不能为空"
        else:
            error = u"用户已经存在"
    return render_template("user/add.html", error=error)

@user.route("/view/<int:user_id>/")
@auth
def view(user_id):
    user = User(current_app)
    per = user.view(user_id)
    #return user_id
    return render_template("user/view.html", user=per.list()[0])

@user.route("/edit/")
@auth
def edit():
    return True
    
@user.route("/password/")
@auth
def edit_password():
    return True

@user.route("/delete/<int:user_id>")
@auth
def delete(user_id):
    return user_id

@user.route("/login/", methods=("GET", "POST"))
def login():
    error = None
    if request.method == 'POST':
        user = User(current_app)
        username = request.form['name']
        password = request.form['password']
        userdata = user.check(username)
        if len(userdata) > 0:
            userdata = userdata[0]
            salt = userdata["salt"]
            password = md5(md5(password).hexdigest() + salt).hexdigest()
            if userdata["passwd"] == password:
                session['logged_in'] = userdata["uid"]
                user.edit(uid=userdata["uid"], lastlogintime=datetime.now())
                return redirect(url_for('home.index'))
            else:
                error = u'用户名或者密码错误'
        else:
            error = u'没有找到此用户'
    error = (request.args.get("error") is not None) and request.args.get("error") or error
    return render_template('login.html', error=error)

@user.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('login'))
