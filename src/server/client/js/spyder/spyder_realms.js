(function(){


Ext.namespace("Spyder.apps.realms");
registerMenu("realms", "realmsAmin", {
    xtype: "buttongroup",
    title: "开服管理",
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
            text: "游戏列表",
            handler: function(){
                var item = Spyder.cache.menus["realms.gameList"];
                if (!item){
                    Spyder.workspace.addPanel("realms.gameList", "游戏列表", {
                        items: [
                            Ext.create("Spyder.apps.realms.gameList")
                        ]    
                    })
                }
            }
        },
	{
	    xtype: "button",
	    text: "运行商列表",
            handler: function(){
                var item = Spyder.cache.menus["realms.operaList"];
                if (!item){
                    Spyder.workspace.addPanel("realms.operaList", "游戏列表", {
                        items: [
                            Ext.create("Spyder.apps.realms.operaList")
                        ]    
                    })
                }
            }
	},
	{
	    text: "开服列表",
	    xtype : "button",
            handler: function(){
                var item = Spyder.cache.menus["realms.realmList"];
                if (!item){
                    Spyder.workspace.addPanel("realms.realmList", "游戏列表", {
                        items: [
                            Ext.create("Spyder.apps.realms.realmList")
                        ]    
                    })
                }
            }
	}
    ]
});

//申请服务
realmServer = new SpyderRealmSvc(Spyder_server);

Ext.define("Spyder.apps.realms.addGame", {
    extend: "Ext.panel.Panel"    
    
})


Ext.define("Spyder.apps.realms.gameList", {
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
	
	realmServer.GetGameDataPageData(0, 1, "", {
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

                columns.push(column);
            }
        }

        if (!Spyder.apps.realms.gameListModel){
            Ext.define("Spyder.apps.realms.gameListModel", {
                extend: "Ext.data.Model",
                fields: fields    
            })
        }

        if (!Ext.isDefined(Spyder.apps.realms.gameListStore)){
            Ext.define("Spyder.apps.realms.gameListStore", {
                extend: "Ext.data.Store",
                model: Spyder.apps.realms.gameListModel,
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

        me.storeProxy = Ext.create("Spyder.apps.realms.gameListStore");
        me.storeProxy.setProxy(me.updateProxy());
	me.createGrid();
    },
    updateProxy: function(){
        var me = this;
        return {
             type: "b_proxy",
             b_method: realmServer.GetGameDataPageData,
             startParam: "start",
             limitParam: "limit",
             b_params: {
                 "filter": me.b_filter
             },
             b_scope: realmServer,
             reader: {
                 type: "json",
                 root: "Data",
                 totalProperty: "TotalCount"
             }
        }
    },
    createGrid: function(){
        var me = this, store = me.storeProxy;
        //var sm = Ext.create("Ext.selection.CheckboxModel", {
        //    model: "MULTI"    
        //})
        me.grid = Ext.create("Spyder.plugins.LiveSearch", {
            store: store,
            lookMask: true,
            //selModel: sm,
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
	    tbar: [
		"-",
		{
		    xtype: "button",
		    text : "增加游戏",
		    handler: function(){
			//var win = Ext.create("Spyder.apps.articles.PublicArticle", {
			//    articles  : articles,
			//    websiteId : 1    
			//});
			//win.show();
		    }
		}
	    ],
            columns: me.columns,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.storeProxy,
                displayInfo: true,
                displayMsg: '当前显示 {0} - {1}, 总共{2}条数据',
                emptyMsg: "没有数据"
            })
        })

        //me.grid.on("itemdblclick", me.viewArticle, me)

        me.add(me.grid);
        me.doLayout();
    }
})



})();
