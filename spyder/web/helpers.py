#coding: utf-8

import re, urlparse

from flask import current_app, g, session, redirect, url_for
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
        if session["logged_in"] is not True:
            error = 'You must logged in'
            return redirect(url_for('user.login', error=error))
        return func(*args, **kwargs)
    return wrap
