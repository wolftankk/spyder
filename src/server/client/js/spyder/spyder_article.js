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
				var item = Spyder.cache.menus["articleList"];
				if (!item){
					Spyder.workspace.addPanel("articleList", "添加种子", {
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
				columns.push({
					flex: 1,
					header: d["fieldName"],
					dataIndex: d["dataIndex"]	
				});
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
			articleServer = Spyder.constants.articleServer
		me.grid = Ext.create("Ext.grid.Panel", {
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
			"itemdblclick": me.viewArticle
		})

		me.add(me.grid);
		me.doLayout();
	},
	viewArticle: function(view, record, item, index){
		var aid = record.get("aid");
		if (!aid){
			return;
		}
		var articleServer = Spyder.constants.articleServer;
		articleServer.GetArticleInfo(aid, {
			success: function(data){
				
			},
			failure: function(error){
				Ext.Error.raise(error)
			}
		})

	}
})
