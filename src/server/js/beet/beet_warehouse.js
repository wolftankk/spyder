/**
 *
 * @file beet_warehouse.js
 * @description MYDO warehouse control tools
 * @author wolftankk@gmail.com
 *
 */
registerBeetAppsMenu("warehouse", 
{
	title: "库存管理",
	items: [
		{
			xtype: "container",
			layout: "hbox",
			frame: true,
			defaults: {
				height: 80,
				width: 200
			},
			defaultType: "buttongroup",
			items: [
				{
					xtype: 'buttongroup',
					title: '库存管理',
					layout: "anchor",
					frame: true,
					width: 300,
					defaults: {
						scale: "large",
						rowspan: 3
					},
					items: [
						{
							xtype: "button",
							text: "库存管理",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["warehouseList"];
								if (!item){
									Beet.workspace.addPanel("warehouseList", "库存管理", {
										items: [
											Ext.create("Beet.apps.WarehouseViewPort.warehouseList")
										]
									});
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							xtype: "button",
							text: "库存历史查询",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["stockHistory"];
								if (!item){
									Beet.workspace.addPanel("stockHistory", "库存历史查询", {
										items: [
											Ext.create("Beet.apps.WarehouseViewPort.stockHistory")
										]
									});
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						}
					]
				}
			]
		}
	]
});

Ext.ns("Beet.apps.WarehouseViewPort");

Beet.constants.stockStauts = Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{attr: "all", name: "全部"},
		{attr: 0, name: "申请入库"},
		{attr: -1, name: "已入库"},
		{attr: 1, name: "申请出库"},
		{attr: 2, name: "已出库"},
		{attr: -2, name: "结算完毕"}	
	]	
});

Beet.constants.checkStauts = Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{attr: 1, name: "审核通过"},
		{attr: 0, name: "退回"}
	]	
});

//storeid, pid, count, enddate
Ext.define("Beet.apps.WarehouseViewPort.AddProduct", {
	extend: "Ext.panel.Panel",	
	height: "100%",
	width: "100%",
	layout: "fit",
	bodyStyle: "background-color: #dfe8f5",
	defaults: {
	  bodyStyle: "background-color: #dfe8f5"
	},
	autoHeight: true,
	autoScroll:true,
	frame:true,
	border: false,
	bodyBorder: false,
	plain: true,
	_index: 0,
	initComponent: function(){
		var me = this, stockServer = Beet.constants.stockServer;
	
		me.selectedProducts = {};
		if (!me.branchesList){
			me.createBranchesList();
		}
		me.callParent()	
		me.mainPanel = Ext.create("Ext.panel.Panel", {
			height: (me.b_type == "selection" ? "95%" : "100%"),
			width: "100%",
			autoHeight: true,
			autoScroll: true,
			border: false,
			layout: {
				type: "hbox",
				columns: 2,
				align: 'stretch'
			}
		})
		me.add(me.mainPanel);
		me.doLayout();
		me.createMainPanel();
	},
	createMainPanel: function(){
		var me = this, stockServer = Beet.constants.stockServer;
		var options = {
			autoScroll: true,
			autoWidth: true,
			autoHeight: true,
			cls: "iScroll",
			height: "85%",
			width: "100%",
			border: true,
			plain: true,
			flex: 1,
			bodyStyle: "background-color: #dfe8f5"
		}
		me.productsPanel = Ext.widget("panel", Ext.apply(options, {
			title: "入库产品列表",
			tbar: [
				{
					xtype: "button",
					text: "选择入库产品",
					style: {
						borderColor: "#99BBE8"
					},
					handler: function(){
						me.selectProducts();
					}
				}
			]
		}));

		var config = {
			autoHeight: true,
			autoScroll: true,
			flex: 1,
			height: "100%",
			width: "100%",
			bodyStyle: "background-color: #dfe8f5",
			bodyPadding: 5,
			items: [
				//fill me
				{
					xtype : "fieldset",
					columnWidth: .5,
					title: "快速入库",
					layout: {
						type: "table",
						columns: 2,
						tableAttrs: {
							cellspacing: 10,
							style: {
								width: "100%",
							}
						}
					},
					border: false,
					bodyStyle: "background-color: #dfe8f5",
					defaults: {
						bodyStyle: "background-color: #dfe8f5",
					},
					defaultType: "textfield",
					fieldDefaults: {
						msgTarget: "side",
						labelAlign: "top",
						labelWidth: 60
					},
					items: [
						{
							fieldLabel: "条形码",
							name: "barcode"
						},
						{
							fieldLabel: "产品编码",
							name: "code"
						},
					]
				},
				me.productsPanel
			],
			bbar: [
				"->",
				{
					xtype: "button",
					text: "提交",
					width: 200,
					handler: function(){
						me.processData(this)	
					},
					hidden: me._editType == "view"
				},
				{
					xtype: "button",
					text: "取消",
					width: 200,
					handler: function(){
						if (me.callback){
							me.callback();
						}
					},
					hidden: me._editType == "view"
				}
			]
		}

		var form = Ext.widget("form", config);
		me.form = form;
		//THIS BUG RESET FOR 4.0.7
		me.form.setHeight(100);//reset
		me.form.on("afterrender", function(){
			var children = document.getElementsByName("barcode");
			if (children.length > 0){
				children[0].focus();
			}
		}, me, { delay: 100 });
		me.mainPanel.add(form);
		me.mainPanel.doLayout();
		me.initializeProductsPanel();
	},
	createBranchesList: function(){
		var me = this;
		me.branchesList = Ext.create("Ext.data.Store", {
			fields: ["attr", "name"],
			data: Beet.cache.employee.branchesList
		});
	},
	initializeProductsPanel: function(){
		var me = this, cardServer = Beet.constants.cardServer, stockServer = Beet.constants.stockServer;
		if (me.productsPanel.__columns && me.productsPanel.__columns.length > 0){
			return;
		}
		var columns = me.productsPanel.__columns = [];
		var _actions = {
			xtype: 'actioncolumn',
			width: 30,
			items: [
			]
		}
		_actions.items.push("-",{
			icon: "./resources/themes/images/fam/delete.gif",
			tooltip: "删除消耗产品",
			id: "customer_grid_delete",
			handler: function(grid, rowIndex, colIndex){
				var d = grid.store.getAt(rowIndex)
				me.deleteProducts(d);
			}
		}, "-");

		columns.push(_actions);
		stockServer.GetStockPageData(0, 1, "", {
			success: function(data){
				var data = Ext.JSON.decode(data)["MetaData"];
				var fields = me.productsPanel.__fields = [];
				for (var c in data){
					var meta = data[c];
					fields.push(meta["FieldName"])
					if (!meta["FieldHidden"]){
						var c = {
							dataIndex: meta["FieldName"],
							header: meta["FieldLabel"],
							flex: 1
						}
						
						//console.log(meta["FieldName"])
						switch (meta["FieldName"]){
							case 'StoreName':
								c.editor = {
									xtype: "combobox",
									editable: false,
									store: me.branchesList,
									queryMode: "local",
									displayField: "name",
									valueField: "attr",
									allowBlank: false,
									listeners: {
										blur: function(f){
											//get the form of current editor
											var form = f.up("form").getForm(), values = form.getValues(), record = form.getRecord();
											var storeId = values["StoreName"];
											record.set("storeId", storeId);
										}
									}
								}
								break;
							case 'COUNT':
								c.editor = {
									xtype: "numberfield",
									allowBlank: false,
									minValue: 0,
									type: "int",
									listeners: {
										blur: function(f){
											var form = f.up("form").getForm(), values = form.getValues(), record = form.getRecord();
											var count = values["COUNT"], price = values["PRICE"];
											var pprice = record.get("PPRICE");
											if (count > 0){
												price = Ext.Number.toFixed(pprice * count, 2);
												form.setValues({
													PRICE: price	
												})
												record.set("COUNT", count);
												record.set("PRICE", price);
											}
										}
									}
								}
								break;
							case "PRICE":
								c.editor = {
									xtype: "numberfield",
									allowBlank: false,
									minValue: 0,
									type: "int",
									listeners: {
										blur: function(f){
											var form = f.up("form").getForm(), values = form.getValues(), record = form.getRecord();
											var count = values["COUNT"], price = values["PRICE"];
											var pprice = record.get("PPRICE"), _originprice = record.get("PRICE")
											if (price > 0 && price != _originprice){//防止唔改
												count = Ext.Number.toFixed(price / pprice, 2);
												form.setValues({
													COUNT: count
												})
												record.set("PRICE", price);
												record.set("COUNT", count);
											}
										}
									}
								}
								break;
							case "ENDDATE":
								c.editor = {
									xtype: "datefield",
									format: "Y/m/d",
									allowBlank: false
								}
								break;
						}



						columns.push(c);
					}
				}
				columns.push({
					dataIndex: "_state",
					header: "状态"	
				})

				me.initializeProductsGrid();
			},
			failure: function(error){
				Ext.Error.raise(error);
			}
		});
	},
	initializeProductsGrid: function(){
		var me = this, selectedProducts = me.selectedProducts;
		var __fields = me.productsPanel.__fields;

		if (me.productsPanel.grid == undefined){
			var store = Ext.create("Ext.data.ArrayStore", {
				fields: __fields
			})

			var grid = me.productsPanel.grid = Ext.create("Ext.grid.Panel", {
				store: store,
				height: "100%",
				cls: "iScroll",
				autoScroll: true,
				columnLines: false,
				columns: me.productsPanel.__columns,
				plugins: [
					Ext.create('Ext.grid.plugin.RowEditing', {
						clicksToEdit: 1
					})
				],
				selType: 'cellmodel'
			});

			me.productsPanel.add(grid);
			me.productsPanel.doLayout();
		}
	},
	selectProducts: function(){
		var me = this, cardServer = Beet.constants.cardServer;
		var config = {
			extend: "Ext.window.Window",
			title: "选择入库产品",
			width: 900,
			height: 640,
			autoScroll: true,
			autoHeight: true,
			layout: "fit",
			resizable: true,
			border: false,
			modal: true,
			maximizable: true,
			border: 0,
			bodyBorder: false,
			editable: false
		}
		
		var win = Ext.create("Ext.window.Window", config);
		win.show();
		win.add(Ext.create("Beet.apps.ProductsViewPort.ProductsList", {
			b_type: "selection",
			b_selectionMode: "MULTI",
			b_selectionCallback: function(records){
				if (records.length == 0){ win.close(); return;}
				me.addProducts(records);
				win.close();
			}
		}));
		win.doLayout();
	},
	addProducts: function(records, isRaw){
		var me = this, selectedProducts = me.selectedProducts;
		var __fields = me.productsPanel.__fields;
		if (records == undefined){return;}
		for (var r = 0; r < records.length; ++r){
			var record = records[r];
			var pid, rawData;
			if (isRaw){
				pid = record["PID"];
				rawData = record;
			}else{
				pid = record.get("PID");
				rawData = record.raw;
			}

			rawData["PPRICE"] = (""+rawData["PPrice"]).replaceAll(",", "");
			delete rawData["PPrice"];
			rawData["STATETEXT"] = "申请入库";
			rawData["INDATE"] = Ext.Date.format(new Date(), "Y/m/d");
			rawData["OperatorName"] = Beet.cache.currentEmployName;
			rawData["Operator"] = Beet.cache.currentEmployGUID;
			rawData["index"] = me._index;

			if (selectedProducts[pid] == undefined){
				selectedProducts[pid] = []
			}else{
				selectedProducts[pid] = [];
			}

			selectedProducts[pid] = rawData;
			me._index++
		}

		me.updateProductsPanel();
	},
	deleteProducts: function(record){
		var me = this, selectedProducts = me.selectedProducts;
		var pid = record.get("PID");
		if (selectedProducts[pid]){
			selectedProducts[pid] = null;
			delete selectedProducts[pid];
		}

		me.updateProductsPanel();
	},
	updateProductsPanel: function(){
		var me = this, selectedProducts = me.selectedProducts;
		var grid = me.productsPanel.grid, store = grid.getStore();
		var tmp = []
		for (var c in selectedProducts){
			tmp.push(selectedProducts[c]);
		}
		store.loadData(tmp);
	},
	processData: function(){
		var me = this, stockServer = Beet.constants.stockServer,
			selectedProducts = me.selectedProducts;
		//storeid  pid  count enddate userid
		var data = [];
		var grid = me.productsPanel.grid, store = grid.getStore();

		var productstore = me.productsPanel.grid.getStore();

		for (var c = 0; c < productstore.getCount(); ++c){
			var product = productstore.getAt(c);
			if (product && product.data){
				product = product.data;
				var storeid = product["storeId"],
					pid = product["PID"],
					count = product["COUNT"],
					enddate = product["ENDDATE"],
					index = product["index"],
					pname = product["PName"]	
				//check
				if (storeid == undefined || count == undefined || enddate == undefined){
					var rowIdx = updateGridRowBackgroundColor(grid, "#ffe2e2", index);
					Ext.MessageBox.show({
						title: "错误",
						msg: "第"+ rowIdx +"行: \"" + pname + "\"的分店或者数量或者过期日期没填写!",
						buttons: Ext.MessageBox.OK	
					})
					return;
				}

				data.push({
					storeid: product["storeId"],
					pid: product["PID"],
					count: product["COUNT"],
					enddate: +(new Date(product["ENDDATE"])) / 1000,
					userid:	product["Operator"],
					index: product["index"]
				})
			}
		}

		data = Ext.JSON.encode(data);
		
		stockServer.InStock(data, {
			success: function(r){
				r = Ext.JSON.decode(r);
				if (r.length == 0) { 
					me.callback()
				}

				var str = [], pass = true;
				for (var c = 0; c < r.length; ++c){
					var info = r[c];
					//true
					if (info["result"]){
						updateGridRowBackgroundColor(grid, "#e2e2ff", info["index"]);
					}else{
						var rowIdx = updateGridRowBackgroundColor(grid, "#ffe2e2", info["index"], info["message"]);
						str.push("第" + rowIdx + "行 :" + info["message"]);
					}

					pass = pass && info["result"];
				}

				if (pass){
					me.callback();
				}else{
					Ext.MessageBox.show({
						title: "错误",
						msg: str.join("<br/>"),
						buttons: Ext.MessageBox.OK	
					})
				}
			},
			failure: function(error){
				Ext.Error.raise(error);
			}
		})
	}
})

function updateGridRowBackgroundColor(grid, color, index, msg, hint){
	if (color == "#ffe2e2"){
		color = "#ff3232";
	}
	var view = grid.getView();
	if (! view){ 
		throw "updateGridRowBackgroundColor: Not fount view!"
		return
	}
	var nodes = view.getNodes();
	if (!nodes || (nodes && nodes.length == 0) ){
		throw "updateGridRowBackgroundColor: Nodes include node maybe 0"
		return
	}
	grid.view.addListener({
		itemupdate: function(record, index, f, opts){
			f.className.replace("x-grid-row-alt", "");
			f.style.backgroundColor = color;
			if (f && f.nodeName == "TR") {
				Ext.Array.each(f.childNodes, function(c){
					if (c && c.nodeName == "TD") {
						c.style.backgroundColor = color;	
					}
				})
			}
		}
	});

	for (var c = 0; c < nodes.length; ++c){
		var node = nodes[c], 
			record = view.getRecord(node),
			recordIndex = record.get("index"),
			rowIdx = grid.store.indexOf(record);
		if (!!msg){
			record.set("_state", msg);
		}
		if (recordIndex == index){
			node.className.replace("x-grid-row-alt", "");
			node.style.backgroundColor = color;
			if (node && node.nodeName == "TR") {
				Ext.Array.each(node.childNodes, function(c){
					if (c && c.nodeName == "TD") {
						c.style.backgroundColor = color;	
					}
				})
			}
			return rowIdx + 1;
		}
	}
}

//storeid pid  enddate userid count instoreid(出库产品到达的分店)
Ext.define("Beet.apps.WarehouseViewPort.Exwarehouse", {
	extend: "Ext.panel.Panel",	
	height: "100%",
	width: "100%",
	layout: "fit",
	bodyStyle: "background-color: #dfe8f5",
	defaults: {
	  bodyStyle: "background-color: #dfe8f5"
	},
	autoHeight: true,
	autoScroll:true,
	frame:true,
	border: false,
	bodyBorder: false,
	plain: true,
	_index: 0,
	initComponent: function(){
		var me = this, stockServer = Beet.constants.stockServer;
	
		me.selectedProducts = {};
		if (!me.branchesList){
			me.createBranchesList();
		}
		me.callParent()	
		me.mainPanel = Ext.create("Ext.panel.Panel", {
			height: (me.b_type == "selection" ? "95%" : "100%"),
			width: "100%",
			autoHeight: true,
			autoScroll: true,
			border: false,
			layout: {
				type: "hbox",
				columns: 2,
				align: 'stretch'
			}
		})
		me.add(me.mainPanel);
		me.doLayout();
		me.createMainPanel();
	},
	createMainPanel: function(){
		var me = this, stockServer = Beet.constants.stockServer;
		var options = {
			autoScroll: true,
			autoWidth: true,
			autoHeight: true,
			cls: "iScroll",
			height: "85%",
			width: "100%",
			border: true,
			plain: true,
			flex: 1,
			bodyStyle: "background-color: #dfe8f5"
		}
		me.productsPanel = Ext.widget("panel", Ext.apply(options, {
			title: "出库产品列表",
			tbar: [
				{
					xtype: "button",
					text: "选择出库产品",
					style: {
						borderColor: "#99BBE8"
					},
					handler: function(){
						me.selectProducts();
					}
				}
			]
		}));

		var config = {
			autoHeight: true,
			autoScroll: true,
			flex: 1,
			width: "100%",
			bodyStyle: "background-color: #dfe8f5",
			bodyPadding: 5,
			items: [
				{
					xtype : "fieldset",
					columnWidth: .5,
					title: "快速出库",
					layout: {
						type: "table",
						columns: 2,
						tableAttrs: {
							cellspacing: 10,
							style: {
								width: "100%",
							}
						}
					},
					border: false,
					bodyStyle: "background-color: #dfe8f5",
					defaults: {
						bodyStyle: "background-color: #dfe8f5",
					},
					defaultType: "textfield",
					fieldDefaults: {
						msgTarget: "side",
						labelAlign: "top",
						labelWidth: 60
					},
					items: [
						{
							fieldLabel: "条形码",
							name: "barcode"
						},
						{
							fieldLabel: "产品编码",
							name: "code"
						},
					]
				},
				me.productsPanel
			],
			bbar: [
				"->",
				{
					xtype: "button",
					text: "提交",
					width: 200,
					handler: function(){
						me.processData(this)	
					},
					hidden: me._editType == "view"
				},
				{
					xtype: "button",
					text: "取消",
					width: 200,
					handler: function(){
						if (me.callback){
							me.callback();
						}
					},
					hidden: me._editType == "view"
				}
			]
		}

		var form = Ext.widget("form", config);
		me.form = form;
		me.form.setHeight(100);
		me.form.on("afterrender", function(){
			var children = document.getElementsByName("barcode");
			if (children.length > 0){
				children[0].focus();
			}
		}, me, { delay: 100 });
		me.mainPanel.add(form);
		me.mainPanel.doLayout();
		me.initializeProductsPanel();
	},
	createBranchesList: function(){
		var me = this;
		me.branchesList = Ext.create("Ext.data.Store", {
			fields: ["attr", "name"],
			data: Beet.cache.employee.branchesList
		});
	},
	initializeProductsPanel: function(){
		var me = this, cardServer = Beet.constants.cardServer, stockServer = Beet.constants.stockServer;
		if (me.productsPanel.__columns && me.productsPanel.__columns.length > 0){
			return;
		}
		var columns = me.productsPanel.__columns = [];
		var _actions = {
			xtype: 'actioncolumn',
			width: 30,
			items: [
			]
		}
		_actions.items.push("-",{
			icon: "./resources/themes/images/fam/delete.gif",
			tooltip: "移除",
			id: "customer_grid_delete",
			handler: function(grid, rowIndex, colIndex){
				var d = grid.store.getAt(rowIndex)
				me.deleteProducts(d);
			}
		}, "-");

		columns.push(_actions);
		stockServer.GetStockPageData(0, 1, "", {
			success: function(data){
				var data = Ext.JSON.decode(data)["MetaData"];
				var fields = me.productsPanel.__fields = [];
				//修改列表内容
				for (var c in data){
					var meta = data[c];
					fields.push(meta["FieldName"])
					if (!meta["FieldHidden"]){
						//首先屏蔽一些数据
						if (meta["FieldName"] == "STATETEXT" || meta["FieldName"] == "OperatorName" || meta["FieldName"] == "AuditName"){
							continue;
						}

						var _field = {
							dataIndex: meta["FieldName"],
							header: meta["FieldLabel"],
							flex: 1
						}

						columns.push(_field);
					}
				}

				Ext.Array.each([
					{
						flex: 1,
						header: "出库数量",
						dataIndex: "excount",
						editor: {
							xtype: "numberfield",
							allowBlank: false,
							minValue: 0,
							type: "int",
							listeners: {
								blur: function(f){
									var form = f.up("form").getForm(), values = form.getValues(), record = form.getRecord();
									var count = values["excount"], price = values["exprice"];
									var pprice = record.get("PPRICE");
									if (count > 0){
										price = Ext.Number.toFixed(pprice * count, 2);
										form.setValues({
											exprice: price
										})
										record.set("exprice", price);
										record.set("excount", count);
									}
								}
							}
						}
					},
					{
						flex: 1,
						header: "出库总价",
						dataIndex: "exprice",
						editor: {
							xtype: "numberfield",
							allowBlank: false,
							minValue: 0,
							type: "int",
							listeners: {
								blur: function(f){
									var form = f.up("form").getForm(), values = form.getValues(), record = form.getRecord();
									var count = values["excount"], price = values["exprice"];
									var pprice = record.get("PPRICE"), _originprice = record.get("exprice")
									if (price > 0 && price != _originprice){//防止唔改
										count = Ext.Number.toFixed(price / pprice, 2);
										form.setValues({
											excount : count
										})
										record.set("exprice", price);
										record.set("excount", count);
									}
								}
							}
						}
					},
					{
						flex: 1,
						header: "调入分店",
						dataIndex: "exstore",
						editor: {
							xtype: "combobox",
							editable: false,
							store: me.branchesList,
							queryMode: "local",
							displayField: "name",
							valueField: "attr",
							allowBlank: false,
							listeners: {
								blur: function(f){
									/**
									 * @TODO: 这里需要显示成中文
									 */
									var form = f.up("form").getForm(), values = form.getValues(), record = form.getRecord();
									var storeId = values["exstore"];
									record.set("exstore", storeId)
								}
							}
						},
					}
				], function(r){
					columns.push(r);
				});

				columns.push({
					header: "状态",
					dataIndex: "_state"	
				})

				me.initializeProductsGrid();
			},
			failure: function(error){
				Ext.Error.raise(error);
			}
		});
	},
	initializeProductsGrid: function(){
		var me = this, selectedProducts = me.selectedProducts;
		var __fields = me.productsPanel.__fields;

		if (me.productsPanel.grid == undefined){
			var store = Ext.create("Ext.data.ArrayStore", {
				fields: __fields
			})

			var grid = me.productsPanel.grid = Ext.create("Ext.grid.Panel", {
				store: store,
				height: "100%",
				cls: "iScroll",
				autoScroll: true,
				columnLines: true,
				columns: me.productsPanel.__columns,
				plugins: [
					Ext.create('Ext.grid.plugin.RowEditing', {
						clicksToEdit: 1
					})
				],
				selType: 'cellmodel'
			});

			me.productsPanel.add(grid);
			me.productsPanel.doLayout();
		}
	},
	selectProducts: function(){
		var me = this, cardServer = Beet.constants.cardServer;
		var config = {
			extend: "Ext.window.Window",
			title: "选择入库产品",
			width: 900,
			height: 640,
			autoScroll: true,
			autoHeight: true,
			layout: "fit",
			resizable: true,
			border: false,
			modal: true,
			maximizable: true,
			border: 0,
			bodyBorder: false,
			editable: false
		}
		
		var win = Ext.create("Ext.window.Window", config);
		win.show();
		win.add(Ext.create("Beet.apps.WarehouseViewPort.warehouseList", {
			b_type: "selection",
			b_selectionMode: "MULTI",
			b_filter: " states = -1",
			b_selectionCallback: function(records){
				if (records.length == 0){ win.close(); return;}
				me.addProducts(records);
				win.close();
			}
		}));
		win.doLayout();
	},
	addProducts: function(records, isRaw){
		var me = this, selectedProducts = me.selectedProducts;
		var __fields = me.productsPanel.__fields;
		if (records == undefined){return;}
		for (var r = 0; r < records.length; ++r){
			var record = records[r];
			var pid, rawData;
			if (isRaw){
				pid = record["PID"];
				rawData = record;
			}else{
				pid = record.get("PID");
				rawData = record.raw;
			}

			rawData["PPRICE"] = (""+rawData["PPRICE"]).replaceAll(",", "");
			rawData["index"] = me._index;

			if (selectedProducts[pid] == undefined){
				selectedProducts[pid] = []
			}else{
				selectedProducts[pid] = [];
			}

			selectedProducts[pid] = rawData;
			me._index++
		}

		me.updateProductsPanel();
	},
	deleteProducts: function(record){
		var me = this, selectedProducts = me.selectedProducts;
		var pid = record.get("PID");
		if (selectedProducts[pid]){
			selectedProducts[pid] = null;
			delete selectedProducts[pid];
		}

		me.updateProductsPanel();
	},
	updateProductsPanel: function(){
		var me = this, selectedProducts = me.selectedProducts;
		var grid = me.productsPanel.grid, store = grid.getStore();
		var tmp = []
		for (var c in selectedProducts){
			tmp.push(selectedProducts[c]);
		}
		store.loadData(tmp);
	},
	processData: function(){
		var me = this, stockServer = Beet.constants.stockServer,
			selectedProducts = me.selectedProducts;

		var data = [];
		var grid = me.productsPanel.grid, store = grid.getStore();
		var productstore = me.productsPanel.grid.getStore();
		//storeid pid  enddate userid count instoreid(出库产品到达的分店)
		for (var c = 0; c < productstore.getCount(); ++c){
			var product = productstore.getAt(c);
			if (product && product.data){
				product = product.data;
				
				var count = product["excount"], instoreid = product["exstore"], pname = product["PName"]
				
				if (count == undefined || instoreid == undefined){
					var rowIdx = updateGridRowBackgroundColor(grid, "#ffe2e2", product["index"]);
					Ext.MessageBox.show({
						title: "错误",
						msg: "第" + rowIdx + "行: \"" + pname +"\"的数量或者调入分店没有填写!",
						buttons: Ext.MessageBox.OK	
					})
					return;
				}

				data.push({
					storeid: product["STOREID"],//原分店
					pid: product["PID"],
					count: product["excount"],
					enddate: +(new Date(product["ENDDATE"])) / 1000,
					userid:	Beet.cache.currentEmployGUID,
					inuserid: product["OPERATOR"],
					index: product["index"],
					instoreid: product["exstore"]
				})
			}
		}

		data = Ext.JSON.encode(data);
		//submit to the server
		stockServer.OutStock(data, {
			success: function(r){
				r = Ext.JSON.decode(r);
				if (r.length == 0) { 
					me.callback()
				}

				var str = [], pass = true;
				for (var c = 0; c < r.length; ++c){
					var info = r[c];
					//true
					if (info["result"]){
						updateGridRowBackgroundColor(grid, "#e2e2ff", info["index"]);
					}else{
						var rowIdx = updateGridRowBackgroundColor(grid, "#ffe2e2", info["index"], info["message"]);
						str.push("第" + rowIdx + "行 :" + info["message"]);
					}

					pass = pass && info["result"];
				}

				if (pass){
					me.callback();
				}else{
					Ext.MessageBox.show({
						title: "错误",
						msg: str.join("<br/>"),
						buttons: Ext.MessageBox.OK	
					})
				}
			},
			failure: function(error){
				Ext.Error.raise(error);
			}
		})
	}
})


Ext.define("Beet.apps.WarehouseViewPort.warehouseList", {
	extend: "Ext.panel.Panel",
	autoHeight: true,
	autoScroll: true,
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	frame: true,
	width: "100%",
	border: false,
	shadow: true,
	b_filter: ' states = 0',
	initComponent: function(){
		var me = this, stockServer = Beet.constants.stockServer;
		if (me.b_type == "selection"){
			me.editable = false;
		}else{
			me.editable = true;
		}
		me.currentStockStatus = 0;
		
		me.callParent();
		me.mainPanel = Ext.create("Ext.panel.Panel", {
			height: (me.b_type == "selection" ? "95%" : "100%"),
			width: "100%",
			autoHeight: true,
			autoScroll: true,
			border: false,
			layout: {
				type: "hbox",
				columns: 2,
				align: 'stretch'
			},
		})
		me.add(me.mainPanel);
		me.doLayout();

		me.getProductsMetaData();
	},
	getProductsMetaData: function(){
		var me = this, stockServer = Beet.constants.stockServer;

		stockServer.GetStockPageData(0, -1, "", {
			success: function(data){
				var data = Ext.JSON.decode(data);
				me.buildStoreAndModel(data["MetaData"]);
			},
			failure: function(error){
				Ext.Error.raise(error);
			}
		});
	},
	buildStoreAndModel: function(metaData){
		var fields = [], me = this, stockServer = Beet.constants.stockServer;
		me.columns = [];
		for (var c = 0; c < metaData.length; ++c){
			var d = metaData[c], _field;
			fields.push(d["FieldName"]);
			if (!d["FieldHidden"]) {
				_field = {
					flex: 1,
					header: d["FieldLabel"],
					dataIndex: d["FieldName"]	
				}
				
				//console.log(d["FieldName"])

				me.columns.push(_field);
			}
		};

		//add
		me.columns.push(
		{
			flex: 1,
			header: "审核操作",
			dataIndex: "checkStatus",
			editor : {
				xtype: "combobox",
				editable: false,
				store: Beet.constants.checkStauts,
				queryMode: "local",
				displayField: "name",
				valueField: "attr",
				allowBlank: false
			}
		});

		me.columns.push({
			dataIndex: "_state",
			flex:1,
			header: "状态"	
		})
		
		if (!Ext.isDefined(Beet.apps.WarehouseViewPort.warehouseModel)){
			Ext.define("Beet.apps.WarehouseViewPort.warehouseModel", {
				extend: "Ext.data.Model",
				fields: fields
			});
		}

		if (!Ext.isDefined(Beet.apps.WarehouseViewPort.warehouseStore)){
			Ext.define("Beet.apps.WarehouseViewPort.warehouseStore", {
				extend: "Ext.data.Store",
				model: Beet.apps.WarehouseViewPort.warehouseModel,
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
				}
			});
		}

		me.createGrid();
	},
	updateProxy: function(){
		var me = this, stockServer = Beet.constants.stockServer;
		return {
			type: "b_proxy",
			b_method: stockServer.GetStockPageData,
			startParam: "start",
			limitParam: "limit",
			b_params: {
				"awhere" : me.b_filter
			},
			b_scope: stockServer,
			reader: {
				type: "json",
				root: "Data",
				totalProperty: "TotalCount"
			}
		}
	},
	createGrid: function(){
		var me = this, grid = me.grid, sm = null, stockServer = Beet.constants.stockServer;
		if (me.b_type == "selection"){
			sm = Ext.create("Ext.selection.CheckboxModel", {
				mode: me.b_selectionMode ? me.b_selectionMode : "SINGLE"
			});
			me.selModel = sm;
		}
		Ext.apply(this, {
			storeProxy: Ext.create("Beet.apps.WarehouseViewPort.warehouseStore")
		});
		var store = me.storeProxy, actions;
		store.setProxy(me.updateProxy());

		var _actions = {
			xtype: 'actioncolumn',
			width: 50,
			items: [
			]
		}

		//这里需要权限判断
		_actions.items.push(
			"-", "-", "-", {
				icon: './resources/themes/images/fam/edit.png',
				tooltip: "编辑消耗产品",
				id: "customer_grid_edit",
				handler:function(grid, rowIndex, colIndex){
					var d = me.storeProxy.getAt(rowIndex)
					//me.editProductItem(d);
				}
			}
		);
		
		if (me.b_type == "selection") {
		}else{
			_actions.items.push("-", "-", "-",{
				icon: "./resources/themes/images/fam/delete.gif",
				tooltip: "删除消耗产品",
				id: "customer_grid_delete",
				handler: function(grid, rowIndex, colIndex){
					var d = me.storeProxy.getAt(rowIndex)
					//me.deleteProductItem(d);
				}
			}, "-","-","-");
		}
		
		//me.columns.splice(0, 0, _actions);

		me.grid = Ext.create("Beet.plugins.LiveSearch", {
			store: store,
			lookMask: true,
			frame: true,
			collapsible: false,
			rorder: false,
			bodyBorder: false,
			autoScroll: true,
			autoHeight: true,
			autoWidth: true,
			border: 0,
			flex: 1,
			cls: "iScroll",
			selModel: sm,
			width: "100%",
			height: me.editable ? "100%" : "95%",
			columnLines: true,
			viewConfig:{
				trackOver: false,
				stripeRows: true
			},
			columns: me.columns,
			bbar: Ext.create("Ext.PagingToolbar", {
				store: store,
				displayInfo: true,
				displayMsg: '当前显示 {0} - {1} 到 {2}',
				emptyMsg: "没有数据"
			}),
			tbar: [
				"-",
				{
					fieldLabel: "库存状态",
					labelWidth: 60,
					allowBlank: false,
					xtype: "combo",
					store: Beet.constants.stockStauts,
					editable: false,
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					value: me.currentStockStatus,
					listeners: {
						change: function(field, newValue, oldValue){
							if (newValue == oldValue) { return ;}
							if (newValue == null ) { return;}
							var sql = ""
							if (newValue == "all"){
								sql = "";
							}else{
								sql = " states = " + newValue;
							}
							me.b_filter = sql;
							me.filterProducts();
						}
					}
				},
				"-",
				{
					xtype: "button",
					text: "高级搜索",
					handler: function(){
						var stockServer = Beet.constants.stockServer;
						stockServer.GetStockPageData(0, 1, "", {
							success: function(data){
								var win = Ext.create("Beet.apps.AdvanceSearch", {
									searchData: Ext.JSON.decode(data),
									b_callback: function(where){
										me.b_filter = where;
										//me.filterProducts();
									}
								});
								win.show();
							},
							failure: function(error){
								Ext.Error.raise(error);
							}
						});
					}
				},
				"-",
				{
					xtype: "button",
					text: "申请入库",
					handler: function(){
						var win = Ext.create("Ext.window.Window", {
							width: 1000,
							height: 600,
							layout: "fit",
							autoHeight: true,
							autoScroll: true,
							title: "增加入库",
							border: false
						});
						win.add(Ext.create("Beet.apps.WarehouseViewPort.AddProduct", {
							_editType: "add",
							callback: function(){
								win.close();
								me.storeProxy.loadPage(me.storeProxy.currentPage);
							}
						}));
						win.doLayout();
						win.show();
					},
					hidden: me.b_type == "selection" 
				},
				"-",
				{
					xtype: "button",
					text: "申请出库",
					handler: function(){
						var win = Ext.create("Ext.window.Window", {
							width: 1000,
							height: 600,
							layout: "fit",
							autoHeight: true,
							autoScroll: true,
							title: "申请出库",
							border: false
						});
						win.add(Ext.create("Beet.apps.WarehouseViewPort.Exwarehouse", {
							_editType: "add",
							callback: function(){
								win.close();
								me.storeProxy.loadPage(me.storeProxy.currentPage);
							}
						}));
						win.show();
					},
					hidden: me.b_type == "selection"
				},
			],
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1,
					listeners: {
						beforeedit: function(e){
							var record = e.record, currField = e.field;
							if (currField == "checkStatus"){
								var status = record.get("STATES");
								//check 权限
								if (status == 0){//申请入库
									return true
								}else if (status == 1){
									return true
								}
								return false
							}
						},
						edit: function(editor, e){
							var record = e.record, currField = e.field, grid = e.grid;
							if (currField == "checkStatus"){
								//storeid  pid  count  enddate allow userid
								var storeid = record.get("STOREID"), pid = record.get("PID"),
									count = record.get("COUNT"), enddate = record.get("ENDDATE"),
									allow = record.get("checkStatus") == 1 ? true : false,
									userid = Beet.cache.currentEmployGUID,
									states = record.get("STATES"), method;
									//console.log(editor, e)
									//auto submit
								record.set("index", e.rowIdx);
								var needSubmitData = {
									storeid: storeid,
									pid:pid,
									count: count,
									enddate : (Date.parse(enddate)) / 1000,
									allow: allow,
									userid : userid,
									inuserid: record.get("OPERATOR"),
									index: e.rowIdx
								}

								if (states == 0){
									method = stockServer.EndInStock;
								}else if (states == 1){
									method = stockServer.EndOutStock;
								}

								Ext.Function.bind(method, stockServer)(Ext.JSON.encode([needSubmitData]),
									{
										success: function(r){
											r = Ext.JSON.decode(r);
											if (r.length == 0) { 
											}

											var str = [], pass = true;
											for (var c = 0; c < r.length; ++c){
												var info = r[c];
												//true
												if (info["result"]){
													updateGridRowBackgroundColor(grid, "#e2e2ff", info["index"]);
												}else{
													var rowIdx = updateGridRowBackgroundColor(grid, "#ffe2e2", info["index"], info["message"]);
													str.push("第" + rowIdx + "行 :" + info["message"]);
												}

												pass = pass && info["result"];
											}

											if (pass){
											}else{
												Ext.MessageBox.show({
													title: "错误",
													msg: str.join("<br/>"),
													buttons: Ext.MessageBox.OK	
												})
											}
										},
										failure: function(error){
											Ext.Error.raise(error)
										}
									}
								)
							}
						}
					}
				})
			],
			selType: 'cellmodel'
		})
		me.mainPanel.add(me.grid);
		me.mainPanel.doLayout();

		if (me.b_type == "selection"){
			me.add(Ext.widget("button", {
				text: "确定",
				floating: false,
				handler: function(){
					if (me.b_selectionCallback){
						me.b_selectionCallback(me.selModel.getSelection());
					}
				}
			}))
			me.doLayout();
		}
	},
	filterProducts: function(){
		var me = this;
		me.storeProxy.setProxy(me.updateProxy());

		me.storeProxy.loadPage(1);
	}
});


Ext.define("Beet.apps.WarehouseViewPort.stockHistory", {
	extend: "Ext.panel.Panel",
	autoHeight: true,
	autoScroll: true,
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	frame: true,
	width: "100%",
	border: false,
	shadow: true,
	b_filter: '',
	initComponent: function(){
		var me = this, stockServer = Beet.constants.stockServer;
		if (me.b_type == "selection"){
			me.editable = false;
		}else{
			me.editable = true;
		}
		me.currentStockStatus = 0;
		
		me.callParent();
		me.mainPanel = Ext.create("Ext.panel.Panel", {
			height: (me.b_type == "selection" ? "95%" : "100%"),
			width: "100%",
			autoHeight: true,
			autoScroll: true,
			border: false,
			layout: {
				type: "hbox",
				columns: 2,
				align: 'stretch'
			},
		})
		me.add(me.mainPanel);
		me.doLayout();

		me.getProductsMetaData();
	},
	getProductsMetaData: function(){
		var me = this, stockServer = Beet.constants.stockServer;

		stockServer.GetStockHistoryPageData(0, -1, "", {
			success: function(data){
				var data = Ext.JSON.decode(data);
				me.buildStoreAndModel(data["MetaData"]);
			},
			failure: function(error){
				Ext.Error.raise(error);
			}
		});
	},
	buildStoreAndModel: function(metaData){
		var fields = [], me = this, stockServer = Beet.constants.stockServer;
		me.columns = [];
		for (var c = 0; c < metaData.length; ++c){
			var d = metaData[c], _field;
			fields.push(d["FieldName"]);
			if (!d["FieldHidden"]) {
				_field = {
					flex: 1,
					header: d["FieldLabel"],
					dataIndex: d["FieldName"]	
				}
				
				me.columns.push(_field);
			}
		};

		if (!Ext.isDefined(Beet.apps.WarehouseViewPort.stockHistoryModel)){
			Ext.define("Beet.apps.WarehouseViewPort.stockHistoryModel", {
				extend: "Ext.data.Model",
				fields: fields
			});
		}

		if (!Ext.isDefined(Beet.apps.WarehouseViewPort.stockHistoryStore)){
			Ext.define("Beet.apps.WarehouseViewPort.stockHistoryStore", {
				extend: "Ext.data.Store",
				model: Beet.apps.WarehouseViewPort.stockHistoryModel,
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
				}
			});
		}

		me.createGrid();
	},
	updateProxy: function(){
		var me = this, stockServer = Beet.constants.stockServer;
		return {
			type: "b_proxy",
			b_method: stockServer.GetStockHistoryPageData,
			startParam: "start",
			limitParam: "limit",
			b_params: {
				"awhere" : me.b_filter
			},
			b_scope: stockServer,
			reader: {
				type: "json",
				root: "Data",
				totalProperty: "TotalCount"
			}
		}
	},
	createGrid: function(){
		var me = this, grid = me.grid, sm = null, stockServer = Beet.constants.stockServer;
		if (me.b_type == "selection"){
			sm = Ext.create("Ext.selection.CheckboxModel", {
				mode: me.b_selectionMode ? me.b_selectionMode : "SINGLE"
			});
			me.selModel = sm;
		}
		Ext.apply(this, {
			storeProxy: Ext.create("Beet.apps.WarehouseViewPort.stockHistoryStore")
		});
		var store = me.storeProxy, actions;
		store.setProxy(me.updateProxy());

		var _actions = {
			xtype: 'actioncolumn',
			width: 50,
			items: [
			]
		}

		//这里需要权限判断
		_actions.items.push(
			"-", "-", "-", {
				icon: './resources/themes/images/fam/edit.png',
				tooltip: "编辑消耗产品",
				id: "customer_grid_edit",
				handler:function(grid, rowIndex, colIndex){
					var d = me.storeProxy.getAt(rowIndex)
					//me.editProductItem(d);
				}
			}
		);
		
		if (me.b_type == "selection") {
		}else{
			_actions.items.push("-", "-", "-",{
				icon: "./resources/themes/images/fam/delete.gif",
				tooltip: "删除消耗产品",
				id: "customer_grid_delete",
				handler: function(grid, rowIndex, colIndex){
					var d = me.storeProxy.getAt(rowIndex)
					//me.deleteProductItem(d);
				}
			}, "-","-","-");
		}
		
		//me.columns.splice(0, 0, _actions);

		me.grid = Ext.create("Beet.plugins.LiveSearch", {
			store: store,
			lookMask: true,
			frame: true,
			collapsible: false,
			rorder: false,
			bodyBorder: false,
			autoScroll: true,
			autoHeight: true,
			autoWidth: true,
			border: 0,
			flex: 1,
			cls: "iScroll",
			selModel: sm,
			width: "100%",
			height: me.editable ? "100%" : "95%",
			columnLines: true,
			viewConfig:{
				trackOver: false,
				stripeRows: true
			},
			columns: me.columns,
			bbar: Ext.create("Ext.PagingToolbar", {
				store: store,
				displayInfo: true,
				displayMsg: '当前显示 {0} - {1} 到 {2}',
				emptyMsg: "没有数据"
			}),
			tbar: [
				"-",
				{
					xtype: "button",
					text: "高级搜索",
					handler: function(){
						var stockServer = Beet.constants.stockServer;
						stockServer.GetStockPageData(0, 1, "", {
							success: function(data){
								var win = Ext.create("Beet.apps.AdvanceSearch", {
									searchData: Ext.JSON.decode(data),
									b_callback: function(where){
										me.b_filter = where;
										//me.filterProducts();
									}
								});
								win.show();
							},
							failure: function(error){
								Ext.Error.raise(error);
							}
						});
					}
				}
			]
		})
		me.mainPanel.add(me.grid);
		me.mainPanel.doLayout();

		if (me.b_type == "selection"){
			me.add(Ext.widget("button", {
				text: "确定",
				floating: false,
				handler: function(){
					if (me.b_selectionCallback){
						me.b_selectionCallback(me.selModel.getSelection());
					}
				}
			}))
			me.doLayout();
		}
	},
	filterProducts: function(){
		var me = this;
		me.storeProxy.setProxy(me.updateProxy());

		me.storeProxy.loadPage(1);
	}
});
