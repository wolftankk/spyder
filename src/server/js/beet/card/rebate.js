Ext.define("Beet.apps.ProductsViewPort.AddRebate", {
	extend: "Ext.form.Panel",
	height: "100%",
	width: "100%",
	autoHeight: true,
	autoScroll: true,
	border: false,
	bodyBorder: false,
	bodyStyle: "background-color: #dfe8f5",
	plain: true,
	bodyPadding: 10,
	initComponent: function(){
		var me = this, cardServer = Beet.constants.cardServer;
		me.callParent();
		me.createMainPanel();
	},
	createMainPanel: function(){
		var me = this, cardServer = Beet.constants.cardServer;
		var config = {
			autoHeight: true,
			autoScroll: true,
			border: false,
			bodyBorder: false,
			plain: true,
			flex: 1,
			items: [
				{
					layout: {
						type: "table",
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
						bodyStyle: "background-color: #dfe8f5"
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
							fieldLabel: "返利值",
							name: "value",
							allowBlank: false
						},
						{
							fieldLabel: "是否金额",
							name: "ismoney",
							xtype: "checkbox",
							inputValue: 1,
							listeners: {
								change: function(f, newValue){
									var raterCombox = me.form.down("combobox[name=rater]");
									if (!newValue){
										raterCombox.enable();
									}else{
										raterCombox.disable();
									}
								}
							},
						},
						{
							fieldLabel: "折扣单位",
							name: "rater",
							xtype: "combo",
							store: Beet.constants.RaterType,
							editable: false,
							queryMode: "local",
							displayField: "name",
							valueField: "attr"
						},
						{
							fieldLabel: "起始日期",
							allowBlank: false,
							name: "startdate"
						},
						{
							fieldLabel: "结束日期",
							allowBlank: false,
							name: "enddate"
						},
						{
							fieldLabel: "日期单位",
							name: "validunit",
							allowBlank: false,
							xtype: "combo",
							store: Beet.constants.DateType,
							editable: false,
							queryMode: "local",
							displayField: "name",
							valueField: "attr"
						},
						{
							fieldLabel: "返利注释",
							name: "descript"
						},
						{
							xtype: "button",
							text: "提交",
							width: 200,
							formBind: true,
							disabled: true,
							hidden: me.b_viewMode,
							handler: function(btn, widget){
								me.processData(this)	
							}
						}
					]
				}
			]
		}

		me.form = Ext.create("Ext.form.Panel", config);
		me.add(me.form);
		me.doLayout();
		if (me.b_editMode && me.b_rawData){
			me.restoreFromData()
		}else{
			if (me.b_rawData){
				me.restoreFromData();
			}
		}
	},
	restoreFromData: function(){
		var me = this, cardServer = Beet.constants.cardServer;
		var form = me.form.getForm(), rawData = me.b_rawData;
		form.setValues({
			name: rawData["Name"],
			value: rawData["Value"].replace(",", ""),
			ismoney: rawData["IsMoney"] ? 1 : 0,
			startdate: rawData["StartDate"],
			enddate: rawData["EndDate"],
			validunit: parseInt(rawData["ValidUnit"]),
			descript: rawData["Descript"]
		});
	},
	processData: function(){
		var me = this, cardServer = Beet.constants.cardServer;
		var form = me.form.getForm(), results = form.getValues();
		results["ismoney"] = results["ismoney"] == 1 ? true : false;
		if (results["ismoney"]){
			//remove rater
			delete results["rater"];
		}
		
		if (me.b_editMode){
			var rid = me.b_rawData["RID"];
			results["id"] = rid;
			cardServer.UpdateRebate(Ext.JSON.encode(results), {
				success: function(succ){
					if (succ){
						Ext.MessageBox.show({
							title: "提示",
							msg: "更新返利成功!",
							buttons: Ext.MessageBox.YES,
							fn: function(btn){
								if (btn == "yes"){
									if (me.b_callback){
										me.b_callback();
									}
								}
							}
						});
					}else{
						Ext.Error.raise("更新返利失败");
					}
				},
				failure: function(error){
					Ext.Error.raise(error)
				}
			})
		}else{
			cardServer.AddRebate(Ext.JSON.encode(results), {
				success: function(rid){
					if (rid > -1){
						Ext.Msg.show({
							title: "增加返利",
							msg: "添加成功, 是否需要继续添加?",
							buttons: Ext.MessageBox.YESNO,
							fn: function(btn){
								if (btn == "yes"){
									form.reset();
								}else{
									if (me.b_callback){
										me.b_callback();
									}
								}
							}
						});
					}else{
						Ext.Msg.alert("添加失败", "添加返利失败")
					}
				},
				failure: function(error){
					Ext.Error.raise(error)
				}
			})
		}
	}
});

Ext.define("Beet.apps.ProductsViewPort.RebateList", {
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
		me.getProductsMetaData();
	},
	getProductsMetaData: function(){
		var me = this, cardServer = Beet.constants.cardServer;

		cardServer.GetRebatePageData(0, 1, "", {
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
		
		if (!Beet.apps.ProductsViewPort.RebateModel){
			Ext.define("Beet.apps.ProductsViewPort.RebateModel", {
				extend: "Ext.data.Model",
				fields: fields
			});
		}

		if (!Beet.apps.ProductsViewPort.RebateStore){
			Ext.define("Beet.apps.ProductsViewPort.RebateStore", {
				extend: "Ext.data.Store",
				model: Beet.apps.ProductsViewPort.RebateModel,
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
				proxy: {
					type: "b_proxy",
					b_method: cardServer.GetRebatePageData,
					startParam: "start",
					limitParam: "limit",
					b_params: {
						"awhere" : ""
					},
					b_scope: Beet.constants.cardServer,
					reader: {
						type: "json",
						root: "Data",
						totalProperty: "TotalCount"
					}
				}
			});
		}

		me.createGrid();
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
			storeProxy: Ext.create("Beet.apps.ProductsViewPort.RebateStore")
		});
		var store = me.storeProxy, actions;

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
				tooltip: "编辑返利",
				id: "customer_grid_edit",
				handler:function(grid, rowIndex, colIndex){
					var d = me.storeProxy.getAt(rowIndex)
					me.editRebate(d);
				}
			}
		);
		
		if (me.b_type == "selection") {
		}else{
			_actions.items.push("-", "-", "-",{
				icon: "./resources/themes/images/fam/delete.gif",
				tooltip: "删除返利",
				id: "customer_grid_delete",
				handler: function(grid, rowIndex, colIndex){
					var d = me.storeProxy.getAt(rowIndex)
					me.deleteRebate(d);
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
			height: !me.editable ? "95%" : "100%",
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
					text: "增加返利",
					handler: function(){
						var win = Ext.create("Ext.window.Window", {
							height: 300,
							width: 300,
							title: "增加返利",
							autoHeight: true,
							autoScroll: true,
							autoWidth: true
						});
						win.add(Ext.create("Beet.apps.ProductsViewPort.AddRebate", {
							b_callback: function(){
								me.storeProxy.loadPage(me.storeProxy.currentPage);
								win.close();
							}
						}));
						win.doLayout();
						win.show();
					},
				},
				"-",
				{
					text: "高级搜索",
					xtype: "button",
					handler: function(){
						cardServer.GetRebatePageData(0, 1, "", {
							success: function(data){
								var win = Ext.create("Beet.apps.AdvanceSearch", {
									searchData: Ext.JSON.decode(data),
									b_callback: function(where){
										me.b_filter = where;
										me.storeProxy.setProxy({
											type: "b_proxy",
											b_method: cardServer.GetRebatePageData,
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
										});
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
				}
			],
			bbar: Ext.create("Ext.PagingToolbar", {
				store: store,
				displayInfo: true,
				displayMsg: '当前显示 {0} - {1} 到 {2}',
				emptyMsg: "没有数据"
			})
		})

		me.add(me.grid);
		me.doLayout();

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
	editRebate: function(parentMenu){
		var me = this, rawData = parentMenu.rawData || parentMenu.raw, rid = rawData["RID"], cname = rawData["Name"], cardServer = Beet.constants.cardServer;
		if (rid && me.editable){
			Ext.MessageBox.show({
				title: "编辑返利",
				msg: "是否要更新 " + cname + " 的资料",
				buttons: Ext.MessageBox.YESNO,
				fn : function(btn){
					if (btn == "yes"){
						var win = Ext.create("Ext.window.Window", {
							height: 300,
							width: 300,
							title: "编辑返利",
							autoHeight: true,
							autoScroll: true,
							autoWidth: true
						});
						win.add(Ext.create("Beet.apps.ProductsViewPort.AddRebate", {
							b_rawData: rawData,
							b_editMode: true,
							b_callback: function(){
								me.storeProxy.loadPage(me.storeProxy.currentPage);
								win.close();
							}
						}));
						win.doLayout();
						win.show();
					}
				}
			})	
		}else{
			var win = Ext.create("Ext.window.Window", {
				height: 300,
				width: 300,
				title: "编辑返利",
				autoHeight: true,
				autoScroll: true,
				autoWidth: true
			});
			win.add(Ext.create("Beet.apps.ProductsViewPort.AddRebate", {
				b_rawData: rawData,
				b_editMode: false,
				b_viewMode: true,
				b_callback: function(){
					me.storeProxy.loadPage(me.storeProxy.currentPage);
					win.close();
				}
			}));
			win.doLayout();
			win.show();
		}
	},
	deleteRebate: function(parentMenu){
		var me = this, rawData = parentMenu.rawData || parentMenu.raw, rid = rawData["RID"], cname = rawData["Name"], cardServer = Beet.constants.cardServer;
		if (rid){
			Ext.MessageBox.show({
				title: "删除返利",
				msg: "是否需要删除返利: " + cname + "?",
				buttons: Ext.MessageBox.YESNO,
				fn: function(btn){
					if (btn == "yes"){
						cardServer.DeleteRebate(rid, {
							success: function(succ){
								if (succ){
									Ext.MessageBox.show({
										title: "删除成功",
										msg: "删除返利: " + cname + " 成功",
										buttons: Ext.MessageBox.OK,
										fn: function(){
											me.storeProxy.loadPage(me.storeProxy.currentPage);
										}
									})
								}else{
									Ext.Error.raise("删除返利失败");
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
