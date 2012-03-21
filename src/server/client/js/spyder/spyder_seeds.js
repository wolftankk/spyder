Ext.namespace("Spyder.apps.seeds");
registerMenu("seeds", "seedAdmin", {
    xtype: "buttongroup",
    title: "种子管理",
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
            text: "添加种子",
            tooltip: "点击打开,并且新增一个采集种子",
            handler: function(){
                var item = Spyder.cache.menus["seeds.AddSeed"];
                if (!item){
                    Spyder.workspace.addPanel("seeds.AddSeed", "添加种子", {
                        items: [
                            Ext.create("Spyder.apps.seeds.AddSeed", {
				action : "add"	
			    })
                        ]    
                    })
                }
            }
        },
        {
            xtype: "button",
            text: "种子列表",
            tooltip: "包含编辑,删除, 当前状态等功能",
            handler: function(){
                var item = Spyder.cache.menus["seeds.SeedsList"];
                if (!item){
                    Spyder.workspace.addPanel("seeds.SeedsList", "种子列表", {
                        items: [
                                Ext.create("Spyder.apps.seeds.SeedsList")
                        ]    
                    })
                }
            }
        }
    ]
});

Spyder.apps.seeds.seedFListType = Ext.create("Ext.data.Store", {
    fields: ["attr", "name"],
    data: [
        { attr: "html", name: "html"},
        { attr: "feed", name: "feed"}
    ]    
});

Ext.define("Spyder.apps.seeds.AddSeed", {
    extend: "Ext.panel.Panel",
    layout: "anchor",
    height: Spyder.constants.VIEWPORT_HEIGHT - 5,
    width: "100%",
    autoScroll: true,
    autoHeight: true,
    border: 0,
    bodyStyle: "background-color: #dfe8f5",
    defaults: {
        bodyStyle: "background-color: #dfe8f5",
        border: 0    
    },
    suspandLayout: true,
    initComponent: function(){
        var me = this;

        me.callParent();


        me.createMainPanel();
    },
    createMainPanel: function(){
        var me = this;
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
            bodyPadding: "10",
            items: [
                {
                    layout: {
                        type:"table",
                        columns: 2,
                        tableAttrs: {
                            cellspacing: 10,
                            style: {
                                width: "100%"
                            }
                        }
                    },
                    border: false,
                    bodyStyle: "background-color: #dfe8f5",
                    defaults: {
                        bodyStyle: "background-color: #dfe8f5"
                    },
                    defaultType: "textfield",
                    fieldDefaults: {
                        msgTarget: "side",
                        labelAlign: "TOP",
                        labelWidth: 80
                    },
                    items: [
                        {
                            xtype: "checkboxfield",
                            fieldLabel: "启用",
                            inputValue: true,
                            name: "enabled",
                            checked: true
                        },
                        {
                            fieldLabel: "种子名称",
                            allowBlank: false,
                            name: "sname"
                        },
                        {
                            fieldLabel: "所属类别",
                            name : "cid"
                        },
                        {
                            fieldLabel: "采集URL",
                            allowBlank: false,
                            name: "url",
			    tip : "需要采集的页面url"
                        },
                        {
                            fieldLabel: "页面编码",
                            allowBlank: false,
                            name: "charset",
			    tip  : "设置你采集页面的页面编码, 为空时候程序将自动判断"
                        },
			{
			    fieldLabel: "页面语言",
			    allowBlank: false,
			    name: "lang"
			},
                        {
                            fieldLabel: "采集频率(秒)",
                            allowBlank: false,
                            name: "frequency",
                            value: 600
                        },
                        {
                            fieldLabel: "超时时间",
                            allowBlank: false,
                            name: "timeout",
                            value: 300
                        },
                        {
                            fieldLabel: "尝试次数",
                            allowBlank: false,
                            name: "tries",
                            value: 5,
			    tips: "自动尝试次数"
                        }
                    ]
                },
                {
                    xtype: "fieldset",
                    title: "列表规则",
                    collapsible: true,
                    defaultType: "textfield",
                    fieldDefaults: {
                        msgTarget: "side",
                        labelWidth: 80
                    },
                    defaults: {
                        anchor: "50%"
                    },
                    items: [
                        {
                            fieldLabel: "列表类别",
                            allowBlank: false,
                            name: "listtype",
                            xtype: "combobox",
                            store: Spyder.apps.seeds.seedFListType,
                            queryMode: "local",
                            displayField: "name",
                            valueField: "attr",
                            value: "html",
                            editable: false,
                            listeners: {
                                change: function(w, newValue, oldValue){
                                    var items = w.up("fieldset").items.items
                                    if (newValue == "feed"){
                                        for (var c = 0; c < items.length; ++c){
                                            var item = items[c]
                                            if (item && item != w){
                                                item.hide()
                                            }
                                        }
                                    }else{
                                        for (var c = 0; c < items.length; ++c){
                                            var item = items[c]
                                            if (item){
                                                item.show()
                                            }
                                        }
                                    }
                                }
                            },
                        },
                        {
                            fieldLabel: "url格式",
                            name: "list[urlformat]"// xx-[page].html
                        },
                        {
                            fieldLabel: "起始页",
                            name: "list[startpage]"//1
                        },
                        {
                            fieldLabel: "最大采集页数",
                            name: "list[maxpage]"//10
                        },
                        {
                            fieldLabel: "step",
                            name: "list[step]"//1
                        },
                        {
                            fieldLabel: "listParent",
                            name:"list[listparent]"//div[xxx]table
                        },
                        {
                            fieldLabel: "entryParent",
                            name: "list[entryparent]"//trxxx
                        },
                        {
                            fieldLabel: "文章URL正则",
                            name: "list[articleurl]"//a href?
                        },
                        {
                            fieldLabel: "文章标题正则",
                            name: "list[titleparent]"//h[#text]
                        },
                        {
                            fieldLabel: "文章日期正则",
                            name: "list[dateparent]"
                        }
                    ]
                },
                {
                    xtype: "fieldset",
                    title: "文章规则",
                    collapsible: true,
                    defaultType: "textfield",
                    fieldDefaults: {
                        msgTarget: "side",
                        labelWidth: 80
                    },
                    defaults: {
                        anchor: "50%"
                    },
                    items: [
                        {
                            fieldLabel: "文章正则",
                            name: "article[articleparent]",
                            allowBlank: false
                        },
                        {
                            fieldLabel: "文章标题",
                            name: "article[titleparent]",
                            allowBlank: false
                        },
                        {
                            fieldLabel: "tags正则",
                            name: "article[tagparent]"
                        },
                        {
                            fieldLabel: "作者正则",
                            name: "article[authorparent]"
                        },
                        {
                            fieldLabel: "文章正文正则",
                            name: "article[contextparent]",
                            allowBlank: false
                        },
                        {
                            fieldLabel: "文章页数正则",
                            name: "article[pageparent]",
                            allowBlank: true
                        },
                        {
                            xtype: "checkboxfield",
                            fieldLabel: "过滤script",
                            inputValue: true,
                            name: "article[filterscript]",
                            checked: true
                        },
                        {
                            fieldLabel: "文章过滤正则",
			    xtype : "textarea",
			    name : "filters"
                        }
                    ]
                },
                {
                    xtype: "button",
                    text: "重置",
                    handler: function(){
                        me.form.getForm().reset();
                    }
                },
                {
                    xtype: "button",
                    text: "提交",
                    disabled: true,
                    formBind: true,
                    style: {
                        marginLeft: "10px"
                    },
                    handler: function(){
			me.processForm();
                    }
                }
            ],
        }

        var form = Ext.widget("form", config);
        me.form = form
        me.add(form)
        me.doLayout();
    },
    restoreForm: function(data){
	var me = this, form = me.form.getForm(), fKeys = form.getValues();
	me.selectedSID = data.sid;
	var list = data["list"], article = data["article"];
	for (var k in list){
	    data["list["+k+"]"] = list[k]
	}
	for (var k in article){
	    if (k == "filters" && article.filters){
		data["filters"] = article.filters.join("|");
		delete article["filters"];
	    }
	    data["article["+k+"]"] = article[k]
	}
	delete data["list"];
	delete data["article"];

	form.setValues(data);
    },
    processForm: function(){
	var me = this, action = me.action || "view";
	if (action == "add" || action == "edit"){
	    var form = me.form.getForm();
	    values = form.getValues();
	    if (values.filters){
		values.filters = values.filters.split("|");
		if (!Ext.isArray(values.filters)){
		    values.filters = [values.filters];
		}
		values.filters = values.filters;
	    }
	    if (values["list[urlformat]"]){
		values["list[urlformat]"] = encodeURIComponent(values["list[urlformat]"])
	    }

	    console.log(action)
	    if (action == "add"){
		Spyder.constants.seedServer.AddSeed(Ext.JSON.encode(values), {
		    success: function(sid){
			if (sid){
			    Ext.Msg.alert("添加成功", "添加种子成功");
			}
		    },
		    failure: function(error){
			Ext.Error.raise(error);
		    }
		})
	    }else{
		if (action == "edit") {
		    if (me.selectedSID == undefined){
			Ext.Msg.alert("失败", "编辑失败, 请选择需要编辑的种子")
			return;
		    }
		    Spyder.constants.seedServer.EditSeed(me.selectedSID, Ext.JSON.encode(values), {
			success: function(succ){
			    if (succ){
				Ext.Msg.alert("编辑成功", "编辑种子成功");
			    }else{
				Ext.Msg.alert("编辑失败", "编辑种子失败");
			    }
			},
			failure: function(error){
			    Ext.Error.raise(error);
			}
		    })
		}
	    }
	}
    }
});

Ext.define("Spyder.apps.seeds.SeedsList", {
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

        Spyder.constants.seedServer.GetSeedList(0, 1, "", {
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
                };

		switch (d["dataIndex"]){
		    case "createdtime":
		    case "lastupdatetime":
		    case "starttime":
		    case "finishtime":
			column.xtype = "datecolumn";
			column.format = "m/d G:i";
			break;
		}

		columns.push(column);
            }
        }
    
	var _actions = {
	    xtype: 'actioncolumn',
	    width: 50,
	    items: [
	    ]
	}

	_actions.items.push(
	    "-","-","-",{
		icon: './resources/themes/images/fam/user_edit.png',
		tooltip: "编辑种子",
		handler:function(grid, rowIndex, colIndex){
		    var d = me.storeProxy.getAt(rowIndex)
		    me.editSeed(d);
		}
	    },"-","-", {
		icon: "./resources/themes/images/fam/delete.gif",
		tooltip: "删除种子",
		handler: function(grid, rowIndex, colIndex){
		    var d = me.storeProxy.getAt(rowIndex)
		    me.deleteSeed(d);
		}
	    }, "-","-","-");

        me.columns.splice(0, 0, _actions);

        if (!Spyder.apps.seeds.seedListModel){
            Ext.define("Spyder.apps.seeds.seedListModel", {
                extend: "Ext.data.Model",
                fields: fields    
            })
        }

        if (!Ext.isDefined(Spyder.apps.seeds.seedListStore)){
            Ext.define("Spyder.apps.seeds.seedListStore", {
                extend: "Ext.data.Store",
                model: Spyder.apps.seeds.seedListModel,
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

        me.storeProxy = Ext.create("Spyder.apps.seeds.seedListStore");
        me.storeProxy.setProxy(me.updateProxy());

	var keys = ["createdtime", "lastupdatetime", "starttime", "finishtime"]
	me.storeProxy.on({
	    load: function(s, records){
		for (var c = 0; c < records.length; ++c){
		    var record = records[c];
		    for (var k = 0; k < keys.length; ++k){
			var key = keys[k];
			record.set(key, new Date(record.get(key) * 1000));
		    }
		}
	    }
	})
        me.createGrid();
    },
    updateProxy: function(){
        var me = this, seedServer = Spyder.constants.seedServer;
        return {
             type: "b_proxy",
             b_method: seedServer.GetSeedList,
             startParam: "start",
             limitParam: "limit",
             b_params: {
                 "filter": me.b_filter
             },
             b_scope: seedServer,
             reader: {
                 type: "json",
                 root: "Data",
                 totalProperty: "TotalCount"
             }
        }
    },
    createGrid: function(){
        var me = this, store = me.storeProxy,
            seedServer = Spyder.constants.seedServer
        me.grid = Ext.create("Spyder.plugins.LiveSearch", {
            store: store,
            lookMask: true,
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

        me.grid.on({
            "itemdblclick": function(f, record){
		me.editSeed(record)
	    }
        })

        me.add(me.grid);
        me.doLayout();
    },
    editSeed: function(record){
	var sid = record.get("sid");
	Spyder.constants.seedServer.GetSeedRule(sid, {
	    success: function(data){
		var data = Ext.JSON.decode(data);
		data = Ext.Object.merge(data, record.data);
		var panel = Ext.create("Spyder.apps.seeds.AddSeed", {
		    action : "edit",
		    autoScroll: false
		});
		panel.restoreForm(data);
		var win = Ext.create("Ext.window.Window", {
		    width: 1000,
		    height: 500,
		    cls: "iScroll",
		    title: record.get("sname"),
		    autoHeight: true,
		    autoScroll: true,
		    items: [
			panel
		    ]
		});
		win.show();
	    },
	    failure: function(error){
		Ext.Error.raise(error)
	    }
	})
    },
    deleteSeed: function(record){
	var sid = record.get("sid");
	Spyder.constants.seedServer.DeleteSeed(sid, {
	    success: function(succ){
		if (succ){
		    Ext.Msg.alert("成功", "删除种子成功")
		}else{
		    Ext.Msg.alert("失败", "删除种子失败")
		}
	    },
	    failure: function(error){
		Ext.Error.raise(error)
	    }
	})
    }
})

registerMenu("seeds", "seedCategoryAdmin", {
    xtype: "buttongroup",
    title: "种子分类管理",
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
            text: "添加种子分类",
            handler: function(){
                var item = Spyder.cache.menus["seeds.AddSeedCategory"];
                if (!item){
                    Spyder.workspace.addPanel("seeds.AddSeedCategory", "添加种子分类", {
                        items: [
                            Ext.create("Spyder.apps.seeds.AddSeedCategory")
                        ]    
                    })
                }
            }
        },
        //{
        //    xtype: "button",
        //    text: "种子列表",
        //    tooltip: "包含编辑,删除, 当前状态等功能",
        //    handler: function(){
        //    }
        //}
    ]
});

function getSeedCategoryList(){

}

Ext.define("Spyder.apps.seeds.AddSeedCategory", {
    extend: "Ext.panel.Panel",
    layout: "anchor",
    height: Spyder.constants.VIEWPORT_HEIGHT - 5,
    width: "100%",
    autoScroll: true,
    autoHeight: true,
    border: 0,
    bodyStyle: "background-color: #dfe8f5",
    defaults: {
        bodyStyle: "background-color: #dfe8f5",
        border: 0    
    },
    initComponent: function(){
        var me = this;
        me.callParent()

        me.createMainPanel();
        me.doLayout();
    },
    createMainPanel: function(){
        var me = this,
            config = {
                autoHeight: true,
                autoScroll: true,
                cls: "iScroll",
                height: "100%",
                width: 300,
                anchor: "fit",
                border: false,
                bodyBorder: false,
                plain: true,
                bodyPadding: "10",
                items: [
                    {
                        layout: {
                            type:"table",
                            columns: 1,
                            tableAttrs: {
                                cellspacing: 10,
                                style: {
                                    width: "100%"
                                }
                            }
                        },
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
                                fieldLabel: "名称",
                                allowBlank: false,
                                name: "name"
                            },
                            {
                                fieldLabel: "所属父类",
                                name: "parentid"
                            }
                        ],
                        buttons: [
                            {
                                xtype: "button",
                                text: "提交",
                                disabled: true,
                                formBind: true,
                                handler: function(){
                                    var form = me.form.getForm(),
                                            results = me.form.getValues();

                                    Spyder.constants.seedServer.AddSeedCategory(Ext.JSON.encode(results), {
                                        success: function(cid){
                                            if (cid > 0){
                                                Ext.Msg.alert("成功", "添加成功");
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
                                text: "重置",
                                handler: function(){
                                    me.form.getForm().reset()
                                }
                            }
                        ]
                    }
                ]
            };

        var form = Ext.widget("form", config);
        me.form = form;
        me.add(form);
    }
})
