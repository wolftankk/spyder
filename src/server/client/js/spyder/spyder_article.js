Ext.namespace("Spyder.apps.articles");
registerMenu("articles", "articleAdmin", {
    xtype: "buttongroup",
    title: "文章管理",
    layout: "anchor",
    frame: true,
    width: 200,
    defaults: {
        scale: "large",
        rowspan: 3    
    },
    items: [
        {
            xtype: "button",
            text: "文章列表",
            handler: function(){
                var item = Spyder.cache.menus["articles.ArticleList"];
                if (!item){
                    Spyder.workspace.addPanel("articles.ArticleList", "文章列表", {
                        items: [
                            Ext.create("Spyder.apps.articles.ArticleList")
                        ]    
                    })
                }
            }
        },
    ]
});


Ext.define("Spyder.apps.articles.ArticleList", {
    extend: "Ext.panel.Panel",    
    layout: "fit",
    width: "100%",
    bodyBorder: false,
    autoHeight: true,
    frame: true,
    b_filter: "",
    b_type: "list",
    defaults: {
        border: 0
    },
    initComponent: function(){
        var me = this

        me.callParent();

        Spyder.constants.articleServer.GetArticleList(0, 1, "", {
            success: function(data){
                var data = Ext.JSON.decode(data);
                metadata = data["MetaData"];
                me.buildStoreAndModel(metadata);
            },
            failure: function(error){
                Ext.Error.raise(error)
            }
        })
    },
    buildStoreAndModel: function(metadata){
        var me = this, fields = [], columns = [];
        me.columns = columns;
        for (var c = 0; c < metadata.length; ++c){
            var d = metadata[c];
            fields.push(d["dataIndex"])
            if (!d["fieldHidden"]){
		var column = {
                    flex: 1,
                    header: d["fieldName"],
                    dataIndex: d["dataIndex"]    
                }

		switch (d["dataIndex"]){
		    case "fetchTime":
			column.xtype = "datecolumn"
			column.format = "Y/m/d - G:i:s"
			break;
		}
                columns.push(column);
            }
        }

        if (!Spyder.apps.articles.articleListModel){
            Ext.define("Spyder.apps.articles.articleListModel", {
                extend: "Ext.data.Model",
                fields: fields    
            })
        }

        if (!Ext.isDefined(Spyder.apps.articles.articleListStore)){
            Ext.define("Spyder.apps.articles.articleListStore", {
                extend: "Ext.data.Store",
                model: Spyder.apps.articles.articleListModel,
                autoLoad: true,
                pageSize: 50,
                load: function(options){
                    var me = this;
                    options = options || {};
                    if (Ext.isFunction(options)) {
                        options = {
                            callback: options
                        };
                    }

                    startPage = (me.currentPage - 1) * me.pageSize,
                    Ext.applyIf(options, {
                        groupers: me.groupers.items,
                        page: me.currentPage,
                        start: startPage,
                        limit: me.pageSize,
                        addRecords: false
                    });      

                    me.proxy.b_params["start"] = options["start"] || startPage
                    me.proxy.b_params["limit"] = options["limit"]

                    return me.callParent([options]);
                }
            });
        }

        me.storeProxy = Ext.create("Spyder.apps.articles.articleListStore");
        me.storeProxy.setProxy(me.updateProxy());
	//update store
	me.storeProxy.on({
	    load : function(s, records){
		for (var c = 0; c < records.length; ++c){
		    var record = records[c];
		    record.set("fetchTime", new Date(record.get("fetchTime") * 1000))
		}
	    }
	})
        me.createGrid();
    },
    updateProxy: function(){
        var me = this, articleServer = Spyder.constants.articleServer;
        return {
             type: "b_proxy",
             b_method: articleServer.GetArticleList,
             startParam: "start",
             limitParam: "limit",
             b_params: {
                 "filter": me.b_filter
             },
             b_scope: articleServer,
             reader: {
                 type: "json",
                 root: "Data",
                 totalProperty: "TotalCount"
             }
        }
    },
    createGrid: function(){
        var me = this, store = me.storeProxy,
            articleServer = Spyder.constants.articleServer;
        var sm = Ext.create("Ext.selection.CheckboxModel", {
            model: "MULTI"    
        })
        me.grid = Ext.create("Spyder.plugins.LiveSearch", {
            store: store,
            lookMask: true,
            selModel: sm,
            frame: true,
            collapsible: false,    
            rorder: false,
            bodyBorder: false,
            autoScroll: true,
            autoHeight: true,
            height: "100%",
            width : "100%",
            border: 0,
            columnLines: true,
            viewConfig: {
                trackOver: false,
                stripeRows: true
            },
            columns: me.columns,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.storeProxy,
                displayInfo: true,
                displayMsg: '当前显示 {0} - {1}, 总共{2}条数据',
                emptyMsg: "没有数据"
            })
        })

        me.grid.on("itemdblclick", me.viewArticle, me)

        me.add(me.grid);
        me.doLayout();
    },
    viewArticle: function(view, record, onlyAID){
	var aid, me = this;
	if (Ext.isBoolean(onlyAID)){
	    aid = record;
	}else{
	    aid = record.get("aid");
	}
        if (!aid){
            return;
        }
        
        var articleServer = Spyder.constants.articleServer;

        articleServer.GetArticleInfo(aid, {
            success: function(data){
                var data = Ext.JSON.decode(data);
                var title = data["title"];
                var win = Ext.create("Ext.window.Window", {
                    width: 900,
                    height: 600,
                    minHeight: 550,    
                    autoHeight: true,
                    autoScroll: true,
                    cls: "iScroll",
                    layout: "fit",
                    resizable: true,
                    border: false,
                    modal: true,
                    border: 0,
                    bodyBorder: false,
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: "form",
                            width: "100%",
                            height: "100%",
                            defaultType: "textfield",
                            type: "anchor",
                            border: false,
                            bodyStyle: "background-color: #dfe8f5",
                            defaultType: "textfield",
                            defaults: {
                                anchor: "100%"
                            },
                            fieldDefaults: {
                                labelAlign: "left",
                                labelWidth: 60
                            },
                            items: [
                                {
                                    fieldLabel: "标题",
                                    name: "title",
                                    value: data["title"]
                                },
                                {
                                    fieldLabel: "原始链接",
                                    link: "link",
                                    html: "原始链接\t\t<a target='_blank' href='"+data["url"]+"'>" + data["url"] + "</a>"
                                },
                                {
                                    xtype: "htmleditor",
                                    width: "100%",
                                    name: "content",
                                    height: 465,
                                    value: data["content"],
				    listeners: {
					render: function(f){
					    var toolbar = f.getToolbar();
					    if (!toolbar){ return; }
					    toolbar.add("-",{
						xtype: "button",
						icon: "./resources/themes/images/edit-language.png",
						tooltip: "转换语言, 从简体转成繁体",
						handler: function(){
						    me.convertLanuage(data["aid"]);
						}
					    })
					}
				    }
                                },
                                {
                                    xtype: "toolbar",
                                    width: "100%",
                                    items: [
                                        {
                                            xtype: "button",
                                            text: "发布",
                                            handler: function(){
                                                var win = Ext.create("Spyder.apps.articles.PublicArticle", {
                                                    articleId : data["aid"],
                                                    websiteId : 1    
                                                });
                                                win.show();
                                            }
                                        },
                                        "->",
                                        {
                                            xtype: "button",
                                            text : "保存",
                                            handler: function(widget){
                                                var form = widget.up("form").getForm(),
                                                    results = form.getValues(),
                                                    title = results["title"],
                                                    content = Ext.htmlDecode(results["content"]);
						    content = encodeURIComponent(content)

                                                articleServer.EditArticle(Ext.JSON.encode({
                                                    title: title,
                                                    content: content,
                                                    aid: data["aid"]    
                                                }), {
                                                    success: function(succ){
                                                        if (succ){
                                                            Ext.Msg.alert("成功", "编辑成功");
                                                        }else{
                                                            Ext.Msg.alert("失败", "编辑失败");
                                                        }
                                                    },
                                                    failure: function(error){
                                                        Ext.Error.raise(error);
                                                    }
                                                })    
                                            }
                                        },
                                        {
                                            xtype: "button",
                                            text : "删除",
                                            handler: function(){
                                                articleServer.DeleteArticle(data["aid"], {
                                                    success: function(succ){
                                                        if (succ){
                                                            Ext.Msg.alert("成功", "删除成功");
                                                        }else{
                                                            Ext.Msg.alert("失败", "删除失败");
                                                        }
                                                    },
                                                    failure: function(error){
                                                        Ext.Error.raise(error)
                                                    }
                                                })
                                            }
                                        },
                                        "-",
                                        {
                                            xtype: "button",
                                            text: "关闭",
                                            handler: function(){
                                                win.close();
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                });
                
                win.setTitle(title);
		me.win = win;
                win.show();
            },
            failure: function(error){
                Ext.Error.raise(error)
            }
        })
    },
    convertLanuage: function(aid){
	var me = this;
	if (aid == 0 || aid == undefined){
	    return;
	}
	Spyder.constants.articleServer.ConvertLanage(aid, {
	    success: function(aid){
		if (aid > 0){
		    //Ext.Msg.alert("转换成功", "转换成功");
		    me.win.hide();
		    me.viewArticle(null, aid, true);
		    me.storeProxy.loadPage(1);
		}
	    },
	    failure: function(error){
		Ext.Error.raise(error)
	    }
	})
    }
})

Ext.define("Spyder.apps.articles.PublicArticle", {
    extend: "Ext.window.Window",
    title:  "发布文章",
    width: 400,
    height: 300,
    autoHeight: true,
    autoScroll: true,
    cls: "iScroll",
    layout: "fit",
    resizable: true,
    border: false,
    modal: true,
    border: 0,
    bodyBorder: false,
    bodyPadding: 10,
    initComponent: function(){
        var me = this;
        me.callParent();    

        if (me.articleId == undefined){
            Ext.Msg.alert("错误", "请指定文章ID");
            return;
        }

        if (me.websiteId == undefined){
            Ext.Msg.alert("错误", "请指定文章ID");
            return;
        }
        
        if (me.websiteId != undefined && me.articleId != undefined){
            me.createMainPanel();
        }
    },
    createMainPanel: function(){
        var me = this, articleServer = Spyder.constants.articleServer;
        var config = {
            autoHeight: true,
            autoScroll: true,
            cls: "iScroll",
            height: "100%",
            width: "100%",
            anchor: "fit",
            border: false,
            bodyBorder: false,
            plain: true,
            bodyStyle: "background-color: #dfe8f5",
            defaults: {
                bodyStyle: "background-color: #dfe8f5",
                width: "95%" 
            },
            items: [
                {
                    layout: "anchor",
                    border: false,
                    bodyStyle: "background-color: #dfe8f5",
                    defaults: {
                        bodyStyle: "background-color: #dfe8f5",
                        width: "95%" 
                    },
                    defaultType: "textfield",
                    fieldDefaults: {
                        msgTarget: "side",
                        labelAlign: "TOP",
                        labelWidth: 60
                    },
                    items: [
                        {
                            xtype: "displayfield",
                            value: "<span style='color:red'>当前为测试模式, 选项可以不填</span>"
                        },
                        {
                            fieldLabel: "选择网站"
                        },
                        {
                            fieldLabel: "文章分类"
                        },
                        {
                            fieldLabel: "文章Tags"
                        },
                        {
                            xtype: "checkboxfield",
                            inputValue: true,
                            checked: true,
                            fieldLabel: "是否开启评论"
                        },
                        {
                            xtype: "button",
                            text: "发布",
                            handler: function(){
                                articleServer.PublicArticleToSite(me.articleId, 1, {
                                    success: function(succ){
                                        if (succ){
                                            Ext.Msg.alert("成功", "发布成功");
                                            me.close();
                                        }else{
                                            Ext.Msg.alert("失败", "发布失败");
                                        }
                                    },
                                    failure: function(error){
                                        Ext.Error.raise(error)
                                    }
                                })
                            }
                        }
                    ]
                }
            ]
        }

        var form = Ext.widget("form", config);
        me.add(form);
        me.doLayout();
    }
})
