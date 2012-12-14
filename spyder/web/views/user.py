from flask import Module
from flask import render_template

user = Module(__name__)

@user.route("/add/", methods=("GET", "POST"))
#@auth.require(401)
def add():
    """

    """
    return render_template("user/add.html")
    
@user.route("/view/<int:user_id>/")
def view(user_id):
    #return user_id
    return render_template("user/view.html")

@user.route("/edit/<int:user_id>/")
def edit(user_id):
    return render_template("user/edit.html")

@user.route("/delete/<int:user_id>")
def delete(user_id):
    return user_id