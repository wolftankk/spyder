#!/usr/bin/env python
#coding: utf-8

"""
Author: wolftankk@gmail.com
"""
import getopt, sys, os
from libs.daemon import Daemon
from web import application
from spyder import VERSION
from spyder import run
from spyder.pybits import ansicolor

def help():
    print ansicolor.green("Welcome, thank you for using ``Spyder``", True)
    print "``Spyder`` website: http://wolftankk.github.com/spyder"
    print "``Spyder`` help:"
    print "service web (start|stop|reload) for launching web server"
    print "service spider (start|stop|reload) for launching spyder"
    print "server version for cat ``Spyder`` version"

actions = ["start", "stop", "reoad"]

class WebServer(Daemon):
    def run(self):
	app = application.spyder_web();
	app = app.run(host="0.0.0.0");

class SpiderServer(Daemon):
    def run(self):
	run()


current_dir = os.getcwd()
web_server = WebServer(current_dir+"/web.pid")
spider_server = SpiderServer(current_dir+"/spyder.pid")

def main():
    argv = sys.argv
    if len(argv) == 1:
	help()
    elif len(argv) == 2:
	if argv[1] == "version":
	    print "current Spyder version: ", VERSION
	else:
	    help()
    elif (len(argv) == 3):
	if argv[1] == "web":
	else:
	    help()


if __name__ == "__main__":
    main()
