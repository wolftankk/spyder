Ext.define("Beet.apps.CustomerAdvanceSearch", {
	extend: "Ext.window.Window",
	title: "高级搜索",
	height: 400,
	width: 700,
	layout: "fit",
	closable: true,
	maximizable: true,
	minimizable: true,
	autoScroll: true,
	autoHeight: true,
	resizable: true,
	modal: true,
	border: 0,
	bodyBorder: 0,
	checkable: false,
	initComponent: function(){
		var me = this;
		var form = Ext.create("Beet.apps.CustomerSearchEngine", {
			checkable : me.checkable	
		});
		me.items = [
			form
		];
		me.callParent(arguments);
	}
});

Ext.define("Beet.apps.CustomerSearchEngine", {
	extend: "Ext.form.Panel",
	frame: true,
	bodyBorder: 0,
	border: 0,
	height: "100%",
	width: "100%",
	flex: 1,
	autoHeight: true,
	autoScroll: true,
	autoDestory: true,
	plain: true,
	currentIndex: 0,
	_colunms: [],
	_modelFields: [],
	initComponent: function(){
		var me = this, customerServer = Beet.constants.customerServer;
		var _actions = {
			xtype: 'actioncolumn',
			width: 30,
			items: [
			]
		}
		_actions.items.push(
			"-","-","-",{
				icon: './resources/themes/images/fam/user_edit.png',
				tooltip: "查看用户详情",
				id: "",
				handler:function(grid, rowIndex, colIndex){
					var d = me.storeProxy.getAt(rowIndex)
					me.editCustomerFn(d);
				}
			}
		)
		me._colunms = [];
		me._modelFields = [];
		Beet.cache.AdvanceCustomerFilters = [];

		me._colunms.push(_actions);

		//insert advance config
		if (Beet.cache.advanceProfile){
		}
		
		customerServer.GetCustomerPageData(0, 1, "", {
			success: function(data){
				var data = Ext.JSON.decode(data);
				var metaData = data["MetaData"];

				for (var k in metaData){
					var item = metaData[k];
					if (!item.FieldHidden){
						//下拉菜单
						Beet.cache.AdvanceCustomerFilters.push({
							attr: item.FieldName,
							name: item.FieldLabel,
							_type: item.FieldType
						});

						//为grid 自动生成grid
						var column = {
							flex: 1	
						};
						for (var k in item){
							if (k == "FieldLabel"){
								column["header"] = item[k];
							}else if(k == "FieldName"){
								column["dataIndex"] = item[k];
							}
						}
						me._colunms.push(column);

					}
					//生产model
					me._modelFields.push(item["FieldName"]);
				}
			},
			failure: function(error){
				Ext.Error.raise(error);
			}
		});

		me.items = [
		];

		me.tbar = [
			{
				xtype: "button",
				text: "增加过滤条件",
				icon: "./resources/themes/images/fam/add.png",
				scope: me,
				handler: me.onAddBtnClick
			}
		]

		me.callParent(arguments);
	},
	buttons: [
		{
			text: "搜索",
			handler: function(widget, e){
				var me = this, form = me.up("form").getForm(), result = form.getValues();
				if (!form.isValid()){
					return;
				}
				var filters = [];
				for (var c in result){
					var item = result[c];
					var key = item[0], op = item[1], value = item[2];
					for (var _s in Beet.cache.AdvanceCustomerFilters){
						var filter = Beet.cache.AdvanceCustomerFilters[_s];
						if (filter.attr == key){
							switch (filter._type){
								case 1:
								case 2:
								case 9:
								case 11:	
								case 12:
								case 20:
								case 21:
									if (op == "LIKE"){
										value = "'%"+value+"%'";
									}else{
										value = "'"+value + "'";
									}
									break;
								defaults:
									if (op == "LIKE"){
										op = "!=";
									}
									value = value;
									break;
							}
						}

					}
					filters.push(key + " " + op + " " + value);
				}
				me.up("form").search(filters.join(" AND "));
			}
		}
	],
	search: function(where){
		//start submit the sql to the server, and create store and columns
		var me = this, customerServer = Beet.constants.customerServer;
		if (me.checkable){
			me.selMode = Ext.create("Ext.selection.CheckboxModel");
		}
		
		//create model
		if (!Beet.apps.CustomerSearchEngine.Model){
			Ext.define("Beet.apps.CustomerSearchEngine.Model", {
				extend: "Ext.data.Model",
				fields: me._modelFields	
			})
		}

		if (!Beet.apps.CustomerSearchEngine.Store){
			Ext.define("Beet.apps.CustomerSearchEngine.Store", {
				extend: "Ext.data.Store",
				model: Beet.apps.CustomerSearchEngine.Model,
				autoLoad: true,
				pageSize: Beet.constants.PageSize,
				load: function(options){
					var that = this, options = options || {};
					if (Ext.isFunction(options)){
						options = {
							callback: options
						};
					}

					Ext.applyIf(options, {
						groupers: that.groupers.items,
						page: that.currentPage,
						start: (that.currentPage - 1) * Beet.constants.PageSize,
						limit: Beet.constants.PageSize,
						addRecords: false
					});
					

					that.proxy.b_params["start"] = options["start"];
					that.proxy.b_params["limit"] = options["limit"];

					return that.callParent([options]);
				},
			});
		}

		var store = Ext.create("Beet.apps.CustomerSearchEngine.Store");
		me.storeProxy = store;
		me.storeProxy.setProxy(me.updateProxy(where));

		var grid = Ext.create("Beet.apps.CustomerSearchEngine.GridList", {
			store: store,
			columns: me._colunms,
		});

		var item = Beet.apps.Menu.Tabs["customeAdvanceSearchBtn"];
		if (item){
			Beet.workspace.removePanel("customeAdvanceSearchBtn");
		}

		Beet.workspace.addPanel("customeAdvanceSearchBtn", "高级搜索", {
			items: [
				grid
			]
		});
		Beet.cache.AdvanceSearchWin.close();
	},
	updateProxy: function(where){
		return {
			type: "b_proxy",
			b_method: Beet.constants.customerServer.GetCustomerPageData,
			startParam: "start",
			limitParam: "limit",
			b_params: {
				filter: where == undefined ? "" : where
			},
			b_scope: Beet.constants.customerServer,
			reader: {
				type: "json",
				root: "Data",
				totalProperty: "TotalCount"
			}
		}
	},
	editCustomerFn: function(parentMenu){
		var that = this, rawData = parentMenu.rawData || parentMenu.raw, CTGUID = rawData.CTGUID, CTName = rawData.CTName;
		if (CTGUID){
			var win = Ext.create("Beet.plugins.ViewCustomerInfoExtra", {
				storeProxy: that.storeProxy,
				rawData: rawData,
				maximized: true,
				maximizable: false
			});
			win.show();
		}
	},
	onAddBtnClick: function(widget, e){
		var me = this;
		//每次点击增加一次
		me.currentIndex++;

		var CustomerFiltersStore = Ext.create("Ext.data.Store", {
			fields: ["attr", "name"],
			data: Beet.cache.AdvanceCustomerFilters
		});
		
		var filter = new Ext.form.FieldSet({
			layout: "column",
			frame: true,
			title: "搜索条件",
			autoWidth: true,
			defaults: {
				hideLabel: true,
				margin: "0 5 0 0",
				padding: "5 0 5 0"
			},
			columnWidth: 0.5,
			id: "customerFilter" + me.currentIndex,
			items: [
				{
					id: "customerFilter" + me.currentIndex + "_dropdown",
					xtype: "combobox",
					allowBlank: false,
					editable: true,
					store: CustomerFiltersStore,
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					name: "customerFilter"+me.currentIndex
				},
				{
					id: "customerFilter" + me.currentIndex + "_operater",
					xtype: "combobox",
					width: 75,
					allowBlank: false,
					editable: false,
					store: Beet.constants.OperatorsList,
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					value: "=",
					name: "customerFilter"+me.currentIndex
				},
				{
					id: "customerFilter" + me.currentIndex + "_value",
					xtype: "textfield",
					allowBlank: false,
					width: 230,
					name: "customerFilter"+me.currentIndex
				},
				{
					xtype: "button",
					icon: "./resources/themes/images/fam/delete.gif",
					margin: "0 0 0 20",
					tooltip: "删除此过滤",
					handler: function(widget, e){
						var parent = widget.up("fieldset");
						parent.removeAll(true);
						me.remove(parent, true);
						me.doLayout();
						me.setAutoScroll(true);
					}
				}
			]
		})

		me.add(filter)
		me.doLayout();
		me.setAutoScroll(true);
	},
});

Ext.define("Beet.apps.CustomerSearchEngine.GridList", {
	extend: "Ext.grid.Panel",
	layout: "fit",
	width: "100%",
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	lookMask: true,
	frame: true,
	rorder: false,
	border: 0,
	bodyBorder: 0,
	autoHeight: true,
	autoScroll: true,
	columnLines: true,
	cls: "iScroll",
	initComponent: function(config){
		//set store
		var me = this;
		
		Ext.apply(me, config);

		me.bbar = Ext.create("Ext.PagingToolbar",{
			store: me.store,
			displayInfo: false,
			displayMsg: '当前显示 {0} - {1} 到 {2}',
			emptyMsg: "没有数据"
		})

		me.callParent(arguments);
	},
	viewConfig:{
		trackOver: false,
		stripeRows: true
	}
});
