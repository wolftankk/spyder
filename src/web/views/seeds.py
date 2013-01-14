#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template
from web.helpers import auth, getTagsBySeedId
from web.models import Seed, Pagination, Field, Seed_fields

PER_PAGE = 10

seeds = Module(__name__)

@seeds.route("/", methods=("GET", "POST"))
@seeds.route("/<int:page>")
@auth
def index(page=1):
    seed = Seed(current_app)
    field = Field(current_app)
    seed_fields = Seed_fields(current_app)
    filte = {}
    seed_type = None
    if request.method == "POST":
        error = None
        action = request.form.get("do")
        if action == "delete":
            sids = request.form.getlist("sid[]")
            if len(sids) > 0:
                for sid in sids:
                    if sid:
                        seed.remove(sid)
                        seed_fields.remove(sid)
                return redirect(url_for('seeds.index'))
            else:
                error = "请选择要删除的数据"
        if action == "enable" or action == "disable":
            edid = (action == "enable") and 1 or 0
            sids = request.form.getlist("sid[]")
            if len(sids) > 0:
                for sid in sids:
                    if sid:
                        save = {"enabled":edid}
                        seed.edit(sid,**save)
                return redirect(url_for('seeds.index'))
            else:
                error = "请选择要启用的数据"
        return error
    if request.args.get("keywords"):
        filte["seed_name"] = request.args.get("keywords")
    if request.args.get("type"):
        seed_type = request.args.get("type")
        filte["type"] = seed_type
    seeds1 = seed.list(page, PER_PAGE, filte)
    seeds = []
    if not seeds1 and page != 1:
        abort(404)
    for seed_item in seeds1:
        seed_item["tags"] = getTagsBySeedId(seed_item["sid"])
        seeds.append(seed_item)
    count = seed.totalcount()
    pagination = Pagination(page, PER_PAGE, count)
    fields = field.getSeedType()
    return render_template("seed/list.html", pagination=pagination, seeds=seeds, fields=fields, seed_type=seed_type)