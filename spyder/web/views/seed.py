from flask import Module, url_for, g

seed = Module(__name__)

@seed.route("/add/", methods=("GET", "POST"))
@auth.require(401)
def add():
    """

    """

@seed.route("/view/<int:seed_id>/")
def view(action, seed_id):
    return seed_id


@seed.route("/edit/<int:seed_id>/")
def edit(action, seed_id):
    return seed_id

@seed.route("/delete/<int:seed_id>")
def delete(action, seed_id):
    return seed_id

@seed.route("/")
@seed.route("/list/<int:page>/")
def list(action, page=1):
    return "list"
