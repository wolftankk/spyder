#coding: utf-8;
from flask import Module, url_for, redirect, g, flash, request, current_app, session
from flask import render_template
from web.helpers import auth
from web.models import Site, Seed, User, Seed_log, Pagination, Field
import time
import datetime

PER_PAGE = 20

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

@home.route("/seed_logs/")
@home.route("/seed_logs/<int:page>")
@auth
def seed_logs(page=1):
    seed = Seed(current_app)
    seed_logs = Seed_log(current_app)
    field = Field(current_app)
    filte = []
    status = None
    start_time = ""
    end_time = ""
    if request.args.get("start_time"):
        start_time = request.args.get("start_time")
        tmp = time.mktime(datetime.datetime.strptime(start_time, "%Y-%m-%d %H:%M").timetuple())
        filte.append("start_time >= "+str(tmp))
    if request.args.get("end_time"):
        end_time = request.args.get("end_time")
        tmp = time.mktime(datetime.datetime.strptime(end_time, "%Y-%m-%d %H:%M").timetuple())
        filte.append("start_time <= "+str(tmp))
    if request.args.get("status"):
        status = request.args.get("status")
        filte.append("status = "+str(status))
    if request.args.get("seed_id"):
        seed_id = request.args.get("seed_id")
        filte.append("sid = "+str(seed_id))
    filte = " and ".join(filte)
    seeds1 = seed_logs.list(page, PER_PAGE, filte, "start_time DESC")
    seeds = []
    if not seeds1 and page != 1:
        abort(404)
    for seed_item in seeds1:
        tmp = seed.view(seed_item["sid"]).list()
        if len(tmp) > 0:
            seed_item["seed_name"] = tmp[0]["seed_name"]
        else:
            seed_item["seed_name"] = u"未知"
        seeds.append(seed_item)
    count = seed_logs.totalcount(filte)
    pagination = Pagination(page, PER_PAGE, count)
    fields = field.getSeedType()
    return render_template("logs/seed.html", pagination=pagination, seeds=seeds, fields=fields, status=status, start_time=start_time, end_time=end_time)