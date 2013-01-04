#coding: utf-8
import os, sys

parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,parentdir)

from flask import Module, url_for, g, session, current_app, request, redirect

test_seed = Module(__name__)

@test_seed.route("/list/<int:seed_id>")
def list(seed_id):
    if seed_id:
	return "1"
	#spyder_dir = os.path.realpath(os.path.join(os.getcwd(), "..", "spyder"))
	#f = os.path.join(spyder_dir, "spider.py")
	#msg, code = execute("python2", f, "-t", seed_id)
    return "0"
