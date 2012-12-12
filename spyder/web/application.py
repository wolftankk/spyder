#coding: utf-8

import os;

from flask import Flask, Response, request, g, jsonify, redirect, url_for, flash

import views;

#DEFAULT_MODULES = (
#    (views.home, "")
#);
#
#DEFAULT_APP_NAME = "spyder_web"
#
#def create_webserver():
#    app = Flask(DEFAULT_APP_NAME);
#
#    return app;
#    
#if __name__ == "__main__":
#    create_webserver();
