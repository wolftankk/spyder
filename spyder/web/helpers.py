#coding: utf-8

import re, urlparse
from datetime import datetime

from flask import current_app, g, session, redirect, url_for, request
import functools
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
        if ("logged_in" in session and session["logged_in"] is not True) or ("logged_in" not in session):
            error = 'You must logged in'
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

def timesince(dt, default=None):
    """
    Returns string representing "time since" e.g.
    3 days ago, 5 hours ago etc.
    """
    
    if default is None:
        default = "刚刚"

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