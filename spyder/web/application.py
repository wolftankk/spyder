#coding: utf-8

import os;
from flask import Flask, g
import views

class spyder_web:
    DEFAULT_APP_NAME = "spyder_web"
    MODULES = (
	(views.home, ""),
    );
    
    def __init__(self, config=None):
	self.app = Flask(self.DEFAULT_APP_NAME)
	self.configure_modules()

    def configure_modules(self):
	for module, url_prefix in self.MODULES:
	    self.app.register_module(module, url_prefix=url_prefix)

    def run(self):
	self.app.run();

if __name__ == "__main__":
    application = spyder_web();
    application.run();
