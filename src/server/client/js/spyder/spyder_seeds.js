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
				var item = Spyder.cache.menus["addSeed"];
				if (!item){
					Spyder.workspace.addPanel("addSeed", "添加种子", {
						items: [
								Ext.create("Spyder.apps.seeds.AddSeed")
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
				var item = Spyder.cache.menus["seedsList"];
				if (!item){
					Spyder.workspace.addPanel("seedsList", "种子列表", {
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
							xtype: "checkboxfield",
							fieldLabel: "启用",
							inputValue: true,
							name: "enabled",
							checked: true
						},
						{
							fieldLabel: "名称",
							allowBlank: false,
							name: "sname"
						},
						{
							fieldLabel: "所属类别",
							name: "cid"
						},
						{
							fieldLabel: "采集URL",
							allowBlank: false,
							name: "url"
						},
						{
							fieldLabel: "charset",
							allowBlank: false,
							name: "charset"
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
							value: 5
						},
						{
							xtype: "fieldset",
							title: "列表规则",
							collapsible: true,
							defaultType: "textfield",
							fieldDefaults: {
								msgTarget: "side",
								labelAlign: "TOP",
								labelWidth: 60
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
									name: "list[urlformat]"
								},
								{
									fieldLabel: "起始页",
									name: "list[startpage]"
								},
								{
									fieldLabel: "最大采集页数",
									name: "list[maxpage]"
								},
								{
									fieldLabel: "step",
									name: "list[step]"
								},
								{
									fieldLabel: "listParent",
									name:"list[listparent]"
								},
								{
									fieldLabel: "entryParent",
									name: "list[entryparent]"
								},
								{
									fieldLabel: "文章URL正则",
									name: "list[articleurl]"
								},
								{
									fieldLabel: "文章标题正则",
									name: "list[titleparent]"
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
								labelAlign: "TOP",
								labelWidth: 60
							},
							items: [
								{
									fieldLabel: "文章正则",
									name: "article[articleparent]",
									allowBlank: false
								},
								{
									fieldLabel: "文章标题正则",
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
									allowBlank: false
								}
								/*批量过滤正则
								{
									fieldLabel: "文章过滤正则"//array
								}*/
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
							text: "submit",
							disabled: true,
							formBind: true,
							handler: function(){
								var form = me.form.getForm();
								Spyder.constants.seedServer.AddSeed(Ext.JSON.encode(form.getValues()), {
									success: function(sid){
										if (sid){
											Ext.Msg.alert("添加成功", "添加种子成功");
										}
									},
									failure: function(error){
										Ext.Error.raise(error);
									}
								})
							}
						}
					]
				},
			],
		}

		var form = Ext.widget("form", config);
		me.form = form
		me.add(form)
		me.doLayout();
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
				columns.push({
					flex: 1,
					header: d["fieldName"],
					dataIndex: d["dataIndex"]	
				});
			}
		}

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

		//me.grid.on({
		//	"itemdblclick": me.viewArticle
		//})

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
					maximizable: true,
					maximized: false,
					border: 0,
					bodyBorder: false,
					items: [
						{
							xtype: "form",
							width: "100%",
							height: "100%",
							layout: "fit",
							items: [
								{
									xtype: "htmleditor",
									width: "100%",
									height: "100%",
									value: data["content"]
								}
							]
						}
					]
				});
				
				win.setTitle(title);
				win.show();
			},
			failure: function(error){
				Ext.Error.raise(error)
			}
		})

	}
})

registerMenu("seeds", "seedAdmin", {
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
				var item = Spyder.cache.menus["addSeedCategory"];
				if (!item){
					Spyder.workspace.addPanel("addSeed", "添加种子分类", {
						items: [
							Ext.create("Spyder.apps.seeds.AddSeedCategory")
						]	
					})
				}
			}
		},
		//{
		//	xtype: "button",
		//	text: "种子列表",
		//	tooltip: "包含编辑,删除, 当前状态等功能",
		//	handler: function(){
		//	}
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
