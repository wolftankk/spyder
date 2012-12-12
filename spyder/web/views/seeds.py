from flask import Module, url_for, g

seeds = Module(__name__)

@seeds.route("/")
@seeds.route("/<int:page_id>")
def index(page=1):
    return "seed lists"
