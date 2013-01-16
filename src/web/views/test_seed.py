#coding: utf-8
import os, sys
parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parentdir not in sys.path:
    sys.path.insert(0,parentdir)

from flask import Module, url_for, g, session, current_app, request, redirect, render_template

#from spyder.spyder import Spyder
from spyder.seed import Seed
from spyder.document import Grab
from web.models import Seed as Seed_Model, Field as Field_Model

test_seed = Module(__name__)

@test_seed.route("/list/<int:seed_id>")
def list(seed_id):
    items = {}
    num = 0
    seed_type = None
    if seed_id:
        db = Seed_Model();
        r = db.view(seed_id);
        seed = Seed(r.list()[0])
        t = Grab(seed)
        if len(t):
            num = len(t.keys())
            seed_type = t.seed_type
            for guid in t.keys():
                tmp = {}
                dont_craw_content = [
                'kaifu', 'kaice', "gift"
                ]
                if seed_type in dont_craw_content:
                    for f in t.items[guid].fields:
                        tmp[f] = t.items[guid][f].value
                else:
                    tmp["url"] = t.items[guid]["url"]
                items[guid] = tmp
    return render_template("test_seed/list.html", items=items, num=num, seed_id=seed_id, seed_type=seed_type, dont_craw_content=dont_craw_content)

@test_seed.route("/view/<int:seed_id>/<guid>")
def view(seed_id,guid):
    items = None
    fields = {}
    if guid and seed_id:
        db = Seed_Model();
        r = db.view(seed_id);
        seed = Seed(r.list()[0])
        t = Grab(seed)
        if len(t):
            db_field = Field_Model(current_app)
            items = t[guid]
            field_datas = db_field.list(items["type"])
            for field_data in field_datas:
                fields[field_data["name"]] = field_data["title"]
    return render_template("test_seed/view.html", items=items, fields=fields)