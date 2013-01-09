#coding: utf-8
from flask import Module, url_for, g, session, current_app, request, redirect
from flask import render_template

from libs import phpserialize
from web.helpers import auth
from web.models import Site, Field, Site_map

site = Module(__name__)

@site.route("/add/", methods=("GET", "POST"))
@auth
def add():
    error = None
    site = {}
    site["sync_profile"] = {}
    if request.method == "POST":
        name = request.form.get("name")
        url = request.form.get("url")
        descript = request.form.get("descript")
        sync_type = request.form.get("sync_type")
        if not name:
            error = "请输入站点名称"
        elif not url:
            error = "请输入站点链接"
        elif not sync_type:
            error = "请选择入库方式"
        else:
            site = Site(current_app)
            sync_profile = {
                "staticUrl": request.form.get("staticUrl"),
                "staticType": request.form.get("staticType"),
                "mysql_server": request.form.get("mysql_server"),
                "mysql_dbname": request.form.get("mysql_dbname"),
                "mysql_prefix": request.form.get("mysql_prefix"),
                "mysql_username": request.form.get("mysql_username"),
                "mysql_password": request.form.get("mysql_password"),
                "ftp_server": request.form.get("ftp_server"),
                "ftp_port": request.form.get("ftp_port"),
                "ftp_path": request.form.get("ftp_path"),
                "ftp_username": request.form.get("ftp_username"),
                "ftp_password": request.form.get("ftp_password"),
                "access_id": request.form.get("access_id"),
                "secret_access_key": request.form.get("secret_access_key"),
                "api_url": request.form.get("api_url")
            }
            sync_profile = phpserialize.dumps(sync_profile)
            id = site.add(name=name, url=url, descript=descript, sync_type=sync_type, sync_profile=sync_profile)
            if id > 0:
                return redirect(url_for('sites.index'))
            else:
                error = "error"
    return render_template("site/add.html", error=error, site=site)
    
@site.route("/view/<int:site_id>/")
@auth
def view(site_id):
    return site_id
    
@site.route("/test_mysql/", methods=("GET", "POST"))
@auth
def test_mysql():
    import MySQLdb
    if request.method == "POST":
        mysql_server = request.form.get("mysql_server")
        mysql_dbname = request.form.get("mysql_dbname")
        mysql_username = request.form.get("mysql_username")
        mysql_password = request.form.get("mysql_password")
        try:
            MySQL = MySQLdb.connect(host=mysql_server, user=mysql_username, passwd=mysql_password, db=mysql_dbname, connect_timeout=30)
            return "1"
        except:
            return "0"
    return "0"

@site.route("/test_ftp/", methods=("GET", "POST"))
@auth
def test_ftp():
    mess = None
    from ftplib import FTP
    if request.method == "POST":
        ftp_server = request.form.get("ftp_server")
        ftp_port = int(request.form.get("ftp_port"))
        ftp_username = request.form.get("ftp_username")
        ftp_password = request.form.get("ftp_password")
        ftp_path = request.form.get("ftp_path")
        ftp = FTP()
        try:
            ftp.connect(host=ftp_server,port=ftp_port,timeout=30)
            ftp.login(user=ftp_username,passwd=ftp_password)
            ftp.cwd(ftp_path)
            mess = u"FTP连接成功"
        except:
            mess = u"FTP连接失败"
        ftp.quit()
    return mess

@site.route("/test_aliyun/", methods=("GET", "POST"))
@auth
def test_aliyun():
    import time
    from libs.oss.oss_api import OssAPI
    mess = ""
    if request.method == "POST":
        HOST = "oss.aliyuncs.com"
        ACCESS_ID = request.form.get("access_id")
        SECRET_ACCESS_KEY = request.form.get("secret_access_key")
        if len(ACCESS_ID) == 0 or len(SECRET_ACCESS_KEY) == 0:
            mess = u"请配置 用户 和 私钥"
            return mess
        oss = OssAPI(HOST, ACCESS_ID, SECRET_ACCESS_KEY)
        
        res = oss.list_all_my_buckets()
        if (res.status / 100) == 2:
            mess = "阿里云接口连接成功"
        else:
            mess = "阿里云接口连接失败"
    return mess

@site.route("/edit/<int:site_id>/", methods=("GET", "POST"))
@auth
def edit(site_id):
    site = Site(current_app)
    if request.method == "POST":
        name = request.form.get("name")
        url = request.form.get("url")
        descript = request.form.get("descript")
        sync_type = request.form.get("sync_type")
        if not name:
            error = "请输入站点名称"
        elif not url:
            error = "请输入站点链接"
        elif not sync_type:
            error = "请选择入库方式"
        else:
            site = Site(current_app)
            sync_profile = {
                "staticUrl": request.form.get("staticUrl"),
                "staticType": request.form.get("staticType"),
                "mysql_server": request.form.get("mysql_server"),
                "mysql_dbname": request.form.get("mysql_dbname"),
                "mysql_prefix": request.form.get("mysql_prefix"),
                "mysql_username": request.form.get("mysql_username"),
                "mysql_password": request.form.get("mysql_password"),
                "ftp_server": request.form.get("ftp_server"),
                "ftp_port": request.form.get("ftp_port"),
                "ftp_path": request.form.get("ftp_path"),
                "ftp_username": request.form.get("ftp_username"),
                "ftp_password": request.form.get("ftp_password"),
                "access_id": request.form.get("access_id"),
                "secret_access_key": request.form.get("secret_access_key"),
                "api_url": request.form.get("api_url")
            }
            sync_profile = phpserialize.dumps(sync_profile)
            site.edit(id=site_id, name=name, url=url, descript=descript, sync_type=sync_type, sync_profile=sync_profile)
            return redirect(url_for('sites.index'))
    per = site.view(site_id)[0]
    if per["sync_profile"]:
        per["sync_profile"] = phpserialize.loads(per["sync_profile"])
    field = Field(current_app)
    types = field.getSeedType()
    site_map = Site_map(current_app)
    website_maps = site_map.list(site_id)
    maps = {}
    for website_map in website_maps:
        if website_map["seed_type"] not in maps:
            maps[website_map["seed_type"]] = website_map
    return render_template("site/add.html", site=per, types=types, maps=maps)

@site.route("/delete/<int:site_id>")
@auth
def delete(site_id):
    return site_id