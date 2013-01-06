from flask import Module, url_for, g, session
from web.helpers import auth

status = Module(__name__)
