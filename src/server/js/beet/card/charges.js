function createChargeCategoryTree(){
	var me = this, cardServer = Beet.constants.cardServer;
	me.createTreeList = function(){
		Ext.bind(buildCategoryTreeStore, me)(4);

		me.storeProxy = store = Ext.create("Beet.apps.ProductsViewPort.ChargesCatgoryTreeStore");
		me.treeList = Ext.create("Ext.tree.Panel", {
			store: store,
			frame: true,
			lookMask: true,
			cls: "iScroll",
			collapsible: true,
			collapseDirection: "left",
			width: 230,
			height: 500,
			border: 0,
			useArrow: true,
			title: "费用分类",
			split: true,
			tbar: [
				{
					xtype: "button",
					text: "全部卷起",
					handler: function(){
						return me.treeList.collapseAll();
					}
				},
				{
					xtype: "button",
					text: "全部展开",
					handler: function(){
						return me.treeList.expandAll();
					}
				},
			]
		});

		me.treeList.on({
			"beforeitemcontextmenu": me.treeListRClick,
			scope: me
		});

		//FIXED FOR 4.0.7
		me.treeList.addListener({
			collapse: function(p){
				if (p && p.collapsed && p.reExpander){
					var reExpander = p.reExpander;
					setTimeout(function(){
						reExpander.el.applyStyles({top: 0, left: 0});
						reExpander.setHeight(me.getHeight())
					}, 50);
				}
			}
		})

		me.treeList.storeProxy = me.treeList.getStore();

		//me.updateTreeListEvent();
		
		me.mainPanel.add(me.treeList);
		me.treeList.setHeight(Beet.workspace.getHeight() - 40);
		me.mainPanel.doLayout();
	}
	me.refreshTreeList = function(){
		me.treeList.storeProxy.load();
	}
	me.treeListRClick = function(frame, record, item, index, e, options){
		var isLeaf = record.isLeaf();
		if (!record.contextMenu){
			var menu = [];

			if (record.isRoot()){
				menu = [
					{
						text: "增加分类", 
						handler: function(direction, e){
							me.addTreeItem(direction, record, e)	
						}
					}
				]
			}else{
				menu = [
					{text: "增加分类", handler: function(direction, e){
						me.addTreeItem(direction, record, e);	
					}},
					{text: "编辑", handler: function(direction, e){
						me.editTreeItem(direction, record, e)	
					}},
					{text: "删除", handler: function(direction, e){
						me.deleteTreeItem(direction, record, e);	
					}},
				]
			}

			record.contextMenu = Ext.create("Ext.menu.Menu", {
				style: {
				   overflow: 'visible',
				},
				plain: true,
				items: menu,
				raw : record.raw,
				leaf: isLeaf
			});
		}
		e.stopEvent();
		record.contextMenu.showAt(e.getXY());
		return false;
	}
	me.categoryListCombo = function(){
		me.categoryList = me.treeList.getStore().proxy.categoryList;
		return Ext.create("Ext.data.Store", {
			fields: ["id", "text"],
			data: me.categoryList	
		})
	}
	me.addTreeItem = function(widget, record, e){
		var CLCombo = me.categoryListCombo();
		if (me.addWin){
			me.addWin.close();
		}
		if (me.editWin){
			me.editWin.close()
		}
		me.doLayout();

		var form = Ext.create("Ext.form.Panel", {
			width: "100%",
			height: 100,
			bodyStyle: "background-color: #dfe8f5",
			border: false,
			flex: 1,
			bodyPadding: 10,
			items: [
				{
					fieldLabel: "名称",
					xtype: "textfield",
					allowBlank: false,
					name: "name"
				},
				{
					fieldLabel: "所属类别",
					xtype: "combobox",
					store: CLCombo,
					name: "parentid",
					queryMode: "local",
					displayField: "text",
					valueField: "id",
					value: parseInt(record.get("id") == "src" ? -1 : record.get("id"))
				}
			],
			buttons: [
				{
					xtype: "button",
					text: "提交",
					width: 200,
					handler: function(){
						var f = form.getForm(), result = f.getValues();
						result["categorytype"] = 4;
						cardServer.AddCategory(Ext.JSON.encode(result), {
							success: function(id){
								if (id > 0){
									Ext.Msg.alert("添加成功", "添加分类成功");
									me.addWin.close();
									me.refreshTreeList();
								}
							},
							failure: function(error){
								Ext.Error.raise(error)
							}
						})
					}
				}
			]
		});

		me.addWin = Ext.create("Ext.window.Window", {
			height: 140,
			width: 300,
			title: "增加分类",
			autoHeight: true,
			autoScroll: true,
			autoWidth: true,
		});
		me.addWin.add(form)
		me.addWin.doLayout();
		me.addWin.show();
	}
	me.deleteTreeItem = function(width, record, e){
		var id = record.get("id");
		if (id == "src"){
			return;
		}

		Ext.Msg.alert("删除分类", "你确定需要删除 " + record.get("text") + " 吗?", function(btn){
			cardServer.DeleteCategory(id, {
				success: function(succ){
					if (succ) {
						Ext.Msg.alert("删除成功", "删除分类 "+ record.get("text") + " 成功");
						me.refreshTreeList();
					}
				},
				failure: function(error){
					Ext.Error.raise(error)
				}
			});
		}, me)
	}
	me.editTreeItem = function(widget, record, e){
		var CLCombo = me.categoryListCombo();
		if (me.addWin){
			me.addWin.close();
		}
		if (me.editWin){
			me.editWin.close()
		}

		var form = Ext.create("Ext.form.Panel", {
			width: "100%",
			height: 100,
			bodyPadding: 10,
			bodyStyle: "background-color: #dfe8f5",
			border: false,
			flex: 1,
			items: [
				{
					fieldLabel: "名称",
					xtype: "textfield",
					allowBlank: false,
					name: "name",
					value: record.get("text")
				},
				{
					fieldLabel: "所属类别",
					xtype: "combobox",
					store: CLCombo,
					name: "parentid",
					queryMode: "local",
					displayField: "text",
					valueField: "id",
					value: parseInt(record.raw["pid"])
				}
			],
			buttons: [
				{
					xtype: "button",
					text: "提交",
					width: 200,
					handler: function(){
						var f = form.getForm(), result = f.getValues();
						result["id"] = record.get("id");
						cardServer.UpdateCategory(Ext.JSON.encode(result), {
							success: function(succ){
								if (succ){
									Ext.Msg.alert("编辑成功", "编辑分类成功");
									me.editWin.close();
									me.refreshTreeList();
								}
							},
							failure: function(error){
								Ext.Error.raise(error);
							}
						})
					}
				}
			]
		});

		me.editWin= Ext.create("Ext.window.Window", {
			height: 140,
			width: 300,
			title: "编辑分类",
			autoHeight: true,
			autoScroll: true,
			autoWidth: true,
		});
		me.editWin.add(form)
		me.editWin.doLayout();
		me.editWin.show();
	}
	me.updateTreeListEvent = function(unregister){
		if (unregister){
			me.treeList.un({
				itemClick: me.onTreeItemClick,
				scope: me
			})
		}else{
			me.treeList.on({
				itemClick: me.onTreeItemClick,
				scope: me
			})
		}
	}
	me.onTreeItemClick = function(frame, record, item){
		var id = record.get("id");
		if (id != -1){
			me.b_filter = "CategoryID = " + id;
		}else{
			me.b_filter = "";
		}

		me.filterProducts();
	}
}

Ext.define("Beet.apps.ProductsViewPort.AddCharge", {
	extend: "Ext.form.Panel",
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	width: "100%",
	autoHeight: true,
	autoScroll:true,
	frame:true,
	border: false,
	bodyBorder: false,
	plain: true,
	flex: 1,
	_editType: "view",
	initComponent: function(){
		var me = this, cardServer = Beet.constants.cardServer;

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
			},
		})
		me.add(me.mainPanel);
		me.doLayout();
		
		Ext.bind(createChargeCategoryTree, me)();
		me.createTreeList();

		me.updateTreeListEvent(true)
		me.treeList.on({
			itemclick: me.treeItemClick,
			scope: me
		})
		me.createMainPanel();
	},
	createMainPanel: function(){
		var me = this, cardServer = Beet.constants.cardServer;

		var config = {
			autoHeight: true,
			autoScroll: true,
			plain: true,
			flex: 1,
			bodyPadding: 5,
			bodyStyle: "background-color: #dfe8f5",
			items: [
				{
					layout: {
						type: "table",
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
						listeners: {
							scope: me,
							blur: function(){
								me.onUpdateForm();
							}
						}
					},
					defaultType: "textfield",
					fieldDefaults: {
						msgTarget: "side",
						labelAlign: "top",
						labelWidth: 60
					},
					items: [
						{
							fieldLabel: "名称",
							name: "name",
							allowBlank: false
						},
						{
							fieldLabel: "费用金额",
							name: "cost",
							allowBlank: false,
						},
						{
							fieldLabel: "是否应用折扣",
							name: "applyrate",
							xtype: "checkbox",
							inputValue: 1
						},
						{
							fieldLabel: "折扣",
							name: "rate",
							value: 1
						},
						{
							fieldLabel: "折扣金额",
							name: "discount",
							listeners: {
								scope: me,
								blur: function(){
									me.onUpdateForm(true)
								}
							}
						},
						{
							fieldLabel: "分类",
							name: "category",
							allowBlank: false
						},
						{
							fieldLabel: "是否有效",
							name: "effective",
							xtype: "checkbox",
							checked: true,
							inputValue: 1
						}
					],
					bbar: [
						"->",
						{
							xtype: "button",
							text: "提交",
							disabled: true,
							formBind: true,
							handler: function(btn, widget){
								me.processData(this)	
							},
							hidden: me._editType == "view"
						}
					]
				}
			]
		}

		var form = Ext.widget("form", config);
		me.form = form;
		me.mainPanel.add(form);
		me.mainPanel.doLayout();
	},
	treeItemClick: function(frame, record, item, index, e, options){
		var me = this;
		if (!record){return;}
		
		me.selectProductCategoryId = parseInt(record.get("id"));

		me.form.getForm().setValues({
			"category" : record.get("text")	
		})
	},
	restoreFromData: function(rawData){
		var me = this, form = me.form.getForm();
		var discount = parseFloat(rawData["CCost"].replaceAll(",", "")) * parseFloat(rawData["CRate"]);
		me.rawData = rawData;
		form.setValues({
			name: rawData["CName"],
			cost: rawData["CCost"].replaceAll(",", ""),
			rate: rawData["CRate"],
			discount: discount,
			category: rawData["CategoryName"]
		})

		me.selectProductCategoryId = rawData["CategoryID"];
	},
	onUpdateForm: function(force){
		var me = this, cardServer = Beet.constants.cardServer;
		var form = me.getForm().getForm();
		//get data
		var values = form.getValues();
		
		var cost, rate, discount;
		cost = parseFloat(values["cost"]);

		if (isNaN(cost) || cost < 0){
			return;
		}

		rate = values["rate"];
		discount = values["discount"];
		if (force){
			rate = discount / cost;	
		}else{
			discount = rate * cost;
		}

		form.setValues({
			rate: parseFloat(rate).toFixed(2),
			discount: parseFloat(discount).toFixed(2)
		})
	},
	processData: function(f){
		var me = this, cardServer = Beet.constants.cardServer;
		me.onUpdateForm();//lastupdate
		var form = f.up("form").getForm(), result = form.getValues();

		result["applyrate"] = result["applyrate"] == 1 ? true : false;
		result["effective"] = result["effective"] == 1 ? true : false;

		if (me.selectProductCategoryId){
			result["categoryid"] = me.selectProductCategoryId;
			delete result["category"];
		}
		
		if (me._editType == "add"){
			cardServer.AddChargeType(Ext.JSON.encode(result), {
				success: function(id){
					if (id > 0){
						Ext.MessageBox.show({
							title: "提示",
							msg: "添加费用成功!",
							buttons: Ext.MessageBox.YESNO,
							fn: function(btn){
								if (btn == "yes"){
									form.reset()
								}else{
									if (me.callback){
										me.callback()
									}
								}
							}
						});
					}else{
						Ext.Error.raise("添加费用失败");
					}
				},
				failure: function(error){
					Ext.Error.raise(error);
				}
			});
		}

		if (me._editType == "edit"){
			result["id"] = me.rawData["CID"];
			cardServer.UpdateChargeType(Ext.JSON.encode(result), {
				success: function(id){
					if (id > 0){
						Ext.MessageBox.show({
							title: "提示",
							msg: "更新费用成功!",
							buttons: Ext.MessageBox.YESNO,
							fn: function(btn){
								if (btn == "yes"){
									if (me.callback){
										me.callback()
									}
								}
							}
						});
					}else{
						Ext.Error.raise("更新费用失败");
					}
				},
				failure: function(error){
					Ext.Error.raise(error);
				}
			});
		}
	}
});

Ext.define("Beet.apps.ProductsViewPort.UpdateCharge", {
	extend: "Ext.panel.Panel",
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	width: "100%",
	border: false,
	plain: true,
	initComponent: function(){
		var me = this;
		me.callParent();
		me.add(Ext.create("Beet.apps.ProductsViewPort.ChargeList"));
		me.doLayout();
	}
});

Ext.define("Beet.apps.ProductsViewPort.ChargeList", {
	extend: "Ext.panel.Panel",
	autoHeight: true,
	autoScroll: true,
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	width: "100%",
	frame: true,
	border: false,
	shadow: true,
	b_filter: "",
	initComponent: function(){
		var me = this, cardServer = Beet.constants.cardServer;
		if (me.b_type == "selection"){
			me.editable = false;
		}else{
			me.editable = true;
		}

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

		//append new tree list
		Ext.bind(createChargeCategoryTree, me)();
		me.createTreeList();
		me.updateTreeListEvent()

		me.getProductsMetaData();
	},
	getProductsMetaData: function(){
		var me = this, cardServer = Beet.constants.cardServer;

		cardServer.GetChargeTypePageData(0, 1, "", {
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
		var fields = [], me = this, cardServer = Beet.constants.cardServer;
		me.columns = [];
		for (var c = 0; c < metaData.length; ++c){
			var d = metaData[c];
			fields.push(d["FieldName"]);
			if (!d["FieldHidden"]) {
				me.columns.push({
					flex: 1,
					header: d["FieldLabel"],
					dataIndex: d["FieldName"]	
				})
			}
		};
		
		if (!Beet.apps.ProductsViewPort.ChargeTypeModel){
			Ext.define("Beet.apps.ProductsViewPort.ChargeTypeModel", {
				extend: "Ext.data.Model",
				fields: fields
			});
		}

		if (!Beet.apps.ProductsViewPort.ChargeTypeStore){
			Ext.define("Beet.apps.ProductsViewPort.ChargeTypeStore", {
				extend: "Ext.data.Store",
				model: Beet.apps.ProductsViewPort.ChargeTypeModel,
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
		var me = this, cardServer = Beet.constants.cardServer;
		return {
			type: "b_proxy",
			b_method: cardServer.GetChargeTypePageData,
			startParam: "start",
			limitParam: "limit",
			b_params: {
				"awhere" : me.b_filter
			},
			b_scope: Beet.constants.cardServer,
			reader: {
				type: "json",
				root: "Data",
				totalProperty: "TotalCount"
			}
		}
	},
	createGrid: function(){
		var me = this, grid = me.grid, sm = null, cardServer = Beet.constants.cardServer;
		if (me.b_type == "selection"){
			sm = Ext.create("Ext.selection.CheckboxModel", {
				mode: me.b_selectionMode ? me.b_selectionMode : "SINGLE"
			});
			me.selModel = sm;
		}
		Ext.apply(this, {
			storeProxy: Ext.create("Beet.apps.ProductsViewPort.ChargeTypeStore")
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
					me.editChargeType(d);
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
					me.deleteCharge(d);
				}
			}, "-","-","-");
		}
		
		me.columns.splice(0, 0, _actions);

		me.grid = Ext.create("Beet.plugins.LiveSearch", {
			store: store,
			lookMask: true,
			frame: true,
			collapsible: false,
			rorder: false,
			bodyBorder: false,
			autoScroll: true,
			autoHeight: true,
			border: 0,
			selModel: sm,
			height: "100%",
			flex: 1,
			columnLines: true,
			viewConfig:{
				trackOver: false,
				stripeRows: true
			},
			columns: me.columns,
			tbar: [
				"-",
				{
					xtype: "button",
					text: "高级搜索",
					handler: function(){
						cardServer.GetChargeTypePageData(0, 1, "", {
							success: function(data){
								var win = Ext.create("Beet.apps.AdvanceSearch", {
									searchData: Ext.JSON.decode(data),
									b_callback: function(where){
										me.b_filter = where;
										me.storeProxy.setProxy(me.updateProxy());
										me.storeProxy.loadPage(1)
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
					text: "增加费用",
					handler: function(){
						var win = Ext.create("Ext.window.Window", {
							title: "增加费用",
							width: 1000,
							height: 600,
							layout: "fit",
							autoHeight: true,
							autoScroll: true,
							border: false,
						})

						win.add(Ext.create("Beet.apps.ProductsViewPort.AddCharge", {
							_editType: "add"	
						}))

						win.show();
					}
				}
			],
			bbar: Ext.create("Ext.PagingToolbar", {
				store: store,
				displayInfo: true,
				displayMsg: '当前显示 {0} - {1} 到 {2}',
				emptyMsg: "没有数据"
			})
		})

		me.mainPanel.add(me.grid);
		me.mainPanel.doLayout();

		if (me.b_type == "selection"){
			me.add(Ext.widget("button", {
				text: "确定",
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
		var me = this, cardServer = Beet.constants.cardServer;
		me.storeProxy.setProxy(me.updateProxy());

		me.storeProxy.loadPage(1);
	},
	editChargeType: function(parentMenu){
		var me = this, rawData = parentMenu.rawData || parentMenu.raw, cid = rawData["CID"], cname = rawData["CName"], cardServer = Beet.constants.cardServer;
		var win = Ext.create("Ext.window.Window", {
			width: 1000,
			height: 600,
			layout: "fit",
			autoHeight: true,
			autoScroll: true,
			title: "更新费用",
			border: false
		});
		var config;
		if (cid && me.editable){
			win.setTitle("编辑 " + cname + " 资料");
			config = {
				_editType: "edit",
				callback: function(){
					win.close();
					me.storeProxy.loadPage(me.storeProxy.currentPage);
				}
			}
		}else{
			win.setTitle("查看 " + cname + " 资料");
			config = {
				_editType: "view",
				callback: function(){
					win.close();
					me.storeProxy.loadPage(me.storeProxy.currentPage);
				}
			}
		}
		var f = Ext.create("Beet.apps.ProductsViewPort.AddCharge", config);
		f.restoreFromData(rawData);
		win.add(f);
		win.doLayout();

		win.show();
	},
	deleteCharge: function(parentMenu){
		var me = this, rawData = parentMenu.rawData || parentMenu.raw, cid = rawData["CID"], cname = rawData["CName"], cardServer = Beet.constants.cardServer;
		if (cid){
			Ext.MessageBox.show({
				title: "删除费用",
				msg: "是否需要删除费用: " + cname + "?",
				buttons: Ext.MessageBox.YESNO,
				fn: function(btn){
					if (btn == "yes"){
						cardServer.DeleteChargeType(cid, {
							success: function(succ){
								if (succ){
									Ext.MessageBox.show({
										title: "删除成功",
										msg: "删除费用: " + cname + " 成功",
										buttons: Ext.MessageBox.OK,
										fn: function(){
											me.storeProxy.loadPage(me.storeProxy.currentPage);
										}
									})
								}else{
									Ext.Error.raise("删除费用失败");
								}
							},
							failure: function(error){
								Ext.Error.raise(error);
							}
						})
					}
				}
			});
		}else{
			Ext.Error.raise("删除费用失败");
		}
	}
});
