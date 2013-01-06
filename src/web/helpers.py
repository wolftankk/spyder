#coding: utf-8

import re, urlparse, random
from datetime import datetime

from flask import current_app, g, session, redirect, url_for, request
import functools
from web.models import Field, Seed_fields
#from flaskext.themes import static_file_url, render_theme_template
#
#_punct_re = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^_`{|},.]+')
#
##cached = functools.partial(cache.cached, unless= lambda: g.user is not None)
#
#def get_theme():
#    return current_app.config['THEME']
#
#def render_template(template, **context):
#    return render_theme_template(get_theme(), template, **context)
#
#def domain(url):
#    rv = urlparse.urlparse(url).netloc
#    if rv.startswith("www."):
#        rv = rv[4:]
#    return rv

def auth(func):
    @functools.wraps(func)
        
    def wrap(*args, **kwargs):
        error = None
        if ("uid" in session and not isinstance(session["uid"], int) and session["uid"] <= 0) or ("uid" not in session):
            error = u'请登录'
            return redirect(url_for('user.login', error=error))
        return func(*args, **kwargs)
    return wrap
    
def requires_roles(*roles):
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if get_current_user_role() not in roles:
                return error_response()
            return f(*args, **kwargs)
        return wrapped
    return wrapper
    
def getPermissions(group):
    if group is "visitor":
        return 1
    elif group is "editor":
        return 2
    else:
        return 3
    
    return 1

def getSiteStatus(n):
    status = [u"正常",u"繁忙",u"拥挤",u"未知"]
    return status[n]

def getPageTypeText(n):
    text = {
        "list": u"列表页",
        "content": u"内容页"
    }
    return text[n]

def getSeedTypeText(n):
    text = {
        "article": u"文章",
        "game": u"游戏",
        "kaifu": u"开服",
        "kaice": u"开测",
        "gift": u"礼包",
        "company": u"厂商"
    }
    return text[n]

def timesince(dt, default=None):
    """
    Returns string representing "time since" e.g.
    3 days ago, 5 hours ago etc.
    """
    
    if default is None:
        default = u"刚刚"

    dt = datetime.fromtimestamp(dt);
    now = datetime.now()
    diff = now - dt
    
    periods = (
        (diff.days / 365, u"年"),
        (diff.days / 30, u"个月"),
        (diff.days / 7, u"星期"),
        (diff.days, u"天"),
        (diff.seconds / 3600, u"小时"),
        (diff.seconds / 60, u"分钟"),
        (diff.seconds, u"秒"),
    )

    for period, singular in periods:
        
        if period <= 0:
            continue

        singular = u"%d%s前" % (period, singular)

        return singular

    return default

def somefunc(name):
    """
    """
    return True
    
def getSeedFieldsBySid(sid, seed_type):
    seed_fields = Seed_fields(current_app)
    #fields = seed_fields.list(sid)
    field = Field(current_app)
    datas = field.list(seed_type)
    new = []
    for data in datas:
        new2 = {}
        #tmp = field.view(data.field_id)[0]
        new2["name"] = data["name"]
        new2["title"] = data["title"]
        new2["type"] = data["type"]
        new2["id"] = data["id"]
        v =  seed_fields.view(sid, data["id"]).list()
        if len(v) > 0:
            new2["value"] = v[0]["value"]
            new2["page_type"] = v[0]["page_type"]
        else:
            new2["value"] = ""
            new2["page_type"] = ""
        new.append(new2)
    return new

def getSeedFieldsByType(t):
    field = Field(current_app)
    fields = field.list(t)
    return fields

def checkboxVal(v):
    if v is None: v = 0
    return v

def createSalt():
    ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    chars=[]
    for i in range(4):
        chars.append(random.choice(ALPHABET))
    return "".join(chars)