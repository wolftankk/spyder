Ext.define("Beet.apps.Viewport.VIPActivity", {
	extend: "Ext.panel.Panel",
	layout: "anchor",
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	width: "100%",
	autoHeight: true,
	defaults:{
		border: 0
	},
	border: 0,
	suspendLayout: true,
	initComponent: function(){
		var me = this;

		me.items = [
			me.createMainPanel()
		]

		me.callParent(arguments);
	},
	createMainPanel: function(){
		var me = this, customerServer = Beet.constants.customerServer, panel;

		me.panel = panel = Ext.create("Ext.form.Panel", {
			frame: true,
			bodyPadding: 10,
			height: "100%",
			autoHeight: true,
			autoScroll: true,
			defaultType: "textfield",
			fieldDefaults: {
				msgTarget: "side",
				allowBlank: false,
				labelAlign: "left",
				labelWidth: 75,
				width: 300
			},
			buttons: [
				{
					text: "提交",
					style: {
						left: 0
					},
					handler: function(widget, btn){
						var form = widget.up("form"), result = form.getValues();
						var date = result["date"], t = result["time"], ts = (+(new Date(date + " " + t)))/1000;
						var selectedData = [], customerServer = Beet.constants.customerServer;
						if (me.selectedData){
							for (var c in me.selectedData){
								selectedData.push(c);	
							}
						}
						var needSubmitData = {
							name: result["name"],
							description: result["description"],
							datetime: ts,
							customers: selectedData
						}

						customerServer.AddActivity(Ext.JSON.encode(needSubmitData), {
							success: function(data){
								if (data > 0){
									Ext.MessageBox.show({
										title: "增加活动成功",
										msg: "增加活动: " + result["name"] + " 成功",
										buttons: Ext.MessageBox.OK,
										fn: function(){
											form.reset();
										}
									})
								}
							},
							failure: function(error){
								Ext.Error.raise(error);
							}
						})
					}
				}
			],
			items: [
				{
					xtype: "container",
					autoScroll: true,
					autoHeight: true,
					border: false,
					frame: true,
					items: [
						{
							layout: 'column',
							border: false,
							bodyStyle: 'background-color:#dfe8f5;',
							defaults: {
								bodyStyle: 'background-color:#dfe8f5;',
							},
							items: [
								{
									columnWidth: .5,
									border: false,
									layout: 'anchor',
									defaultType: "textfield",
									fieldDefaults: {
										msgTarget: 'side',
										labelAlign: "left",
										labelWidth: 75,
									},
									items:[
										{
											fieldLabel: "活动名称",
											name: "name"
										},
										{
											fieldLabel: "举办日期",
											name: "date",
											xtype: "datefield",
											format: "Y/m/d",
											value: new Date(),
											minValue: new Date()
										},
										{
											fieldLabel: "举办时间",
											xtype: "timefield",
											format: "H:i",
											name: "time"
										},
										{
											fieldLabel: "活动描述",
											xtype: "textarea",
											height: 100,
											allowBlank: true,
											name: "description"
										},
										{
											text: "增加参加人员",
											xtype: "button",
											handler: function(width, btn){
												var win = me.selectCustomerWindow = Ext.create("Beet.plugins.selectCustomerWindow", {
													_callback: function(value){
														if (me.customerList){
															me.panel.remove(me.customerList, true);
															me.panel.doLayout();
														}
														if (value.length > 0){
															me.updateCustomerList(value);
														}
													}
												});
												win.show();	
											}
										}
									]
								}
							]
						}
					]
				}
				/*
				{
					fieldLabel: "参加人员"
				},
				{
					fieldLabel: "举办地点"
				},
				{
					fieldLabel: "活动负责人"
				}*/
			]
		});

		return panel
	},
	preprocessSelectedData: function(data){
		var newData = {};
		
		if (data == undefined || (Ext.isArray(data) && data.length == 0)){
			return newData;
		}

		for (var c = 0; c < data.length; ++c){
			var item = data[c], d = item["data"];
			newData[d["CTGUID"]] = d;
		}

		return newData;
	},
	updateCustomerList: function(value){
		var me = this, nameList = [], store;

		//处理数据层
		value = me.preprocessSelectedData(value);
		if (me.selectedData == undefined || me.selectedData.length == 0){
			me.selectedData = [];
			me.selectedData = value;
		}else{
			if (value && Ext.isObject(value)){
				for (var k in value){
					if (me.selectedData[k] == undefined){
						me.selectedData[k] = value[k];	
					}
				}
			}
		}

		//创建store
		value = me.selectedData;
		for (var c in value){
			var item = value[c], guid = item["CTGUID"], name = item["CTName"];
			nameList.push([name, item["CTMobile"], guid]);
		}
		store = Ext.create("Ext.data.ArrayStore", {
			fields: [
				"name",
				"mobile",
				"guid"
			],
			data: nameList
		});

		//创建actions
		var _actions = {
			xtype: 'actioncolumn',
			width: 30,
			items: [
				"-", "-",
				{
					icon: "./resources/themes/images/fam/delete.gif",
					tooltip: "删除用户",
					handler: function(grid, rowIndex, colIndex){
						var d = store.getAt(rowIndex), guid = d.get("guid");

						delete me.selectedData[guid];

						if (me.customerList){
							me.panel.remove(me.customerList, true);
							me.panel.doLayout();
						}
						me.updateCustomerList();
					}
				}
			]
		}

		//grid list
		var ns = me.customerList = Ext.create("Ext.grid.Panel", {
			store: store,
			minHeight: 50,
			maxHeight: 300,
			width: 230,
			autoHeight: true,
			autoScroll: true,
			columnLines: true,
			hideHeaders: true,
			columns:[
				_actions,
				{
					text: "Name",
					flex: 1,
					dataIndex: "name" 
				},
				{
					flex: 1,
					dataIndex: "mobile"
				}
			]	
		});
	
		me.panel.add(ns);
		me.doLayout();
	}
});

Ext.define("Beet.apps.Viewport.ActivityList.Model", {
	extend: "Ext.data.Model",
	fields: [
		"AID",
		"AName",
		{name: "ADate", type: "auto", convert: function(v, record){
			var dt = new Date(v*1000);
			return Ext.Date.format(dt, "Y/m/d H:i");
		}},
		"Adescript"
	]
});

Ext.define("Beet.apps.Viewport.ActivityList.Store", {
	extend: "Ext.data.Store",
	model: Beet.apps.Viewport.ActivityList.Model,
	autoLoad: true,
	pageSize: Beet.constants.PageSize,
	load: function(options){
		var me = this;
		options = options || {};
		if (Ext.isFunction(options)) {
            options = {
                callback: options
            };
        }

        Ext.applyIf(options, {
            groupers: me.groupers.items,
            page: me.currentPage,
            start: (me.currentPage - 1) * me.pageSize,
            limit: me.pageSize,
            addRecords: false
        });      
		me.proxy.b_params["start"] = options["start"];
		me.proxy.b_params["limit"] = options["limit"]

        return me.callParent([options]);
	},
	proxy: {
		type: "b_proxy",
		b_method: Beet.constants.customerServer.GetActivityData,
		startParam: "start",
		limitParam: "limit",
		b_params: {
			"filter": ""
		},
		b_scope: Beet.constants.customerServer,
		reader: {
			type: "json",
			root: "Data",
			totalProperty: "TotalCount"
		}
	}
});

Ext.define("Beet.apps.Viewport.ActivityList", {
	extend: "Ext.panel.Panel",
	frame: true,
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	width: "100%",
	autoHeight: true,
	autoScroll: true,
	initComponent: function(){
		var me = this;

		Ext.apply(me, {
			storeProxy: Ext.create("Beet.apps.Viewport.ActivityList.Store")
		});

		me.items = [me.createGridList()]

		me.callParent();
	},
	updateActivity: function(record){
		var aid = record.get("AID"), name = record.get("AName"), me = this, customerServer = Beet.constants.customerServer, win, dt = new Date(record.get("ADate"));

		win = Ext.create("Ext.window.Window", {
			width: 700,
			height: 600,
			minHeight: 550,	
			autoHeight: true,
			autoScroll: true,
			layout: "fit",
			resizable: true,
			border: false,
			modal: true,
			maximizable: true,
			border: 0,
			bodyBorder: false,
			editable: false,
		});
		win.setTitle("编辑活动: "+name);
	
		var form = Ext.create("Ext.form.Panel", {
			height: "100%",
			autoHeight: true,
			autoScroll: true,
			defaultType: "textfield",
			fieldDefaults: {
				msgTarget: "side",
				allowBlank: false,
				labelAlign: "left",
				labelWidth: 75,
				anchor: "95%",
			},
			bodyPadding: 15,
			items: [
				{
					fieldLabel: "活动名称",
					name: "name",
					value: record.get("AName")
				},
				{
					fieldLabel: "举办日期",
					name: "date",
					xtype: "datefield",
					format: "Y/m/d",
					value: dt
				},
				{
					fieldLabel: "举办时间",
					xtype: "timefield",
					format: "H:i",
					name: "time",
					value: dt
				},
				{
					fieldLabel: "活动描述",
					xtype: "textarea",
					height: 100,
					allowBlank: true,
					name: "description",
					value: record.get("Adescript")
				}
			],
			buttons: [
				{
					text: "提交",
					handler: function(widget, btn){
						var f = widget.up("form"), result = f.getValues(), selected = [];
						for (var c in form.selectedData){
							selected.push(c);
						}
						var needSubmitData = {
							name: result['name'],
							datetime: (+(new Date(result["date"] + " " + result["time"]))/1000),
							description: result["description"],
							customers: selected
						}

						customerServer.UpdateActivity(aid, Ext.JSON.encode(needSubmitData), {
							success: function(data){
								if (data){
									me.storeProxy.loadPage(me.storeProxy.currentPage);
									win.close();
								}else{
									Ext.Error.raise("更新失败");
								}
							},
							failure: function(error){
								Ext.Error.raise(error)
							}
						});
					}
				},
				{
					text: "取消",
					handler: function(){
						win.close();
					}
				}
			]
		});

		customerServer.GetActivityCTData(aid, {
			success: function(data){
				data = Ext.JSON.decode(data);
				var meta = data["MetaData"], data = data["Data"], fields = [], _colunms = [];
				form.selectedData = {};

				for (var c = 0; c < meta.length; c++){
					fields.push(meta[c]["FieldName"]);
					if (!meta[c]["FieldHidden"]){
						_colunms.push(
						{	
							text: meta[c]["FieldLabel"],
							flex: 1,
							dataIndex: meta[c]["FieldName"] 
						});
					}
				}

				for (var c = 0; c < data.length; ++c){
					var item = data[c];
					form.selectedData[item["CTGUID"]] = []
				}

				var store = new Ext.data.Store({
					fields: fields,
					data: data		
				});

				var list = Ext.create("Ext.grid.Panel", {
					maxHeight: 150,
					autoHeight: true,
					autoScroll: true,	
					store: store,
					columnLines: true,
					hideHeaders: false,
					columns: _colunms,
					title: "参与会员",
					tbar: [
						{
							xtype: "button",
							text: "增加会员",
							handler: function(widget, btn){
								var win = list.selectCustomerWindow = Ext.create("Beet.plugins.selectCustomerWindow", {
									_callback: function(value){
										//form.remove(list, true);
										//form.doLayout();
										/*
										if (me.customerList){
											me.panel.remove(me.customerList, true);
											me.panel.doLayout();
										}
										if (value.length > 0){
											me.updateCustomerList(value);
										}
										*/
									}
								});
								win.show();	
							}
						}
					]
				});

				form.add(list);
				form.doLayout();
			},
			failure: function(error){
				Ext.Error.raise(error);
			}
		});


		win.add(form);
		win.doLayout();
		win.show();
	},
	createGridList : function(){
		var me = this, customerServer = Beet.constants.customerServer;

		var _actions = {
			xtype: 'actioncolumn',
			width: 50,
			items: [
				"-", "-",
				{
					icon: "./resources/themes/images/fam/user_edit.png",
					tooltip: "编辑",
					handler: function(grid, rowIndex, colIndex){
						var d = me.storeProxy.getAt(rowIndex);
						me.updateActivity(d);
					}
				}, "-", "-","-","-","-",
				{
					icon: "./resources/themes/images/fam/delete.gif",
					tooltip: "删除",
					handler: function(grid, rowIndex, colIndex){
						var d = me.storeProxy.getAt(rowIndex), aid = d.get("AID"), name = d.get("AName");
						Ext.MessageBox.show({
							title: "删除活动",
							msg: "是否要删除活动: " + name + " ?",
							buttons: Ext.MessageBox.YESNO,
							fn: function(btn){
								if (btn == "yes"){
									customerServer.DeleteActivity(aid, {
										success: function(){
											 Ext.MessageBox.show({
												 title: "删除成功",
												 msg: "删除活动: " + name + " 成功",
												 buttons: Ext.MessageBox.OK,
												 fn: function(){
													 me.storeProxy.loadPage(me.storeProxy.currentPage);
												 }
											 })
										},
										failure: function(error){
											Ext.Error.raise("删除活动失败");
										}
									})
								}
							}
						});
					}
				}
			]
		}
		var grid = me.grid = Ext.create("Ext.grid.Panel", {
			height: "100%",
			store: me.storeProxy,
			lookMask: true,
			frame: true,
			collapsible: false,	
			rorder: false,
			bodyBorder: false,
			autoScroll: true,
			autoHeight: true,
			border: 0,
			columnLines: true,
			viewConfig: {
				trackOver: false,
				stripeRows: true
			},
			columns: [
				_actions,
				{
					text: "活动名",
					flex: 1,
					dataIndex: "AName"
				},
				{
					text: "活动时间",
					flex: 1,
					dataIndex: "ADate"	
				},
				{
					text: "活动描述",
					flex: 1,
					dataIndex: "Adescript"
				}
			],
			bbar: Ext.create('Ext.PagingToolbar', {
				store: me.storeProxy,
				displayInfo: true,
				displayMsg: '当前显示 {0} - {1} 到 {2}',
				emptyMsg: "没有数据"
			})
		});

		return grid;
	}
});
