#coding: utf-8

import os, sys
from flask import Flask, g

parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,parentdir) 

from web import views
from web.config import DefaultConfig
from web import model

__all__ = ['spyder_web']

class spyder_web:
    DEFAULT_APP_NAME = "spyder_web"
    MODULES = (
	(views.home, ""),
	(views.seed, "/seed"),
	(views.seeds, "/seeds"),
	(views.article, "/article"),
	(views.site, "/site"),
	(views.sites, "/sites"),
	(views.user, "/user"),
	(views.users, "/users"),
	(views.status, "/status")
    );
    
    def __init__(self):
	# Register an application in Flask
	# @param appName
	# @param static_path
	# @param static_url_path
	# @param static_folder (default: static)
	# @param template_folder (default: templates)
	# @param instance_path
	# @param instance_relative_config 
	self.app = Flask(self.DEFAULT_APP_NAME)
	#load config
	self.app.config.from_object(DefaultConfig());
	self.configure_modules()
	self.app.secret_key = self.app.config.get("SECRET_KEY", "A0Zr98j/3yX R~XHH!jmN]LWX/,?RT")

    def configure_modules(self):
	"""
	Mapping the module url rules
	"""
	for module, url_prefix in self.MODULES:
	    self.app.register_module(module, url_prefix=url_prefix)


    def run(self, host=None, port=None, **options):
	"""
	Runs the application on a local development server.
	@param host  the hostname to listen on. Set this to `0.0.0.0` to have the server
	    available externally as well. Defaults to `127.0.0.1`
	@param port  the port of the webserver. Defaults 5000
	@param debug if given, enable or disable debug mode
	@param options: see `werkzeug.serving.run_simple` for more infomation
	"""
	debug = self.app.config.get("DEBUG", False);
	self.app.run(host, port, debug, **options);

if __name__ == "__main__":
    application = spyder_web();
    application.run();
