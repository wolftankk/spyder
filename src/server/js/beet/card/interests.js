Ext.define("Beet.apps.ProductsViewPort.InterestsList", {
	extend: "Ext.panel.Panel",
	autoHeight: true,
	autoScroll: true,
	autoDestory: true,
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	width: "100%",
	frame: true,
	border: false,
	shadow: true,
	b_filter: '',
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

		cardServer.GetInterestsPageData(0, 1, "", {
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
		
		if (!Ext.isDefined(Beet.apps.ProductsViewPort.InterestsModel)){
			Ext.define("Beet.apps.ProductsViewPort.InterestsModel", {
				extend: "Ext.data.Model",
				fields: fields
			});
		}

		if (!Ext.isDefined(Beet.apps.ProductsViewPort.InterestsStore)){
			Ext.define("Beet.apps.ProductsViewPort.InterestsStore", {
				extend: "Ext.data.Store",
				model: Beet.apps.ProductsViewPort.InterestsModel,
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
					b_method: cardServer.GetInterestsPageData,
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
			});
		}

		me.createGrid();
	},
	createGrid: function(){
		var me = this, grid = me.grid, sm = null, cardServer = Beet.constants.cardServer;
		sm = Ext.create("Ext.selection.CheckboxModel", {
			mode: me.b_selectionMode ? me.b_selectionMode : "SINGLE"
		});
		me.selModel = sm;

		Ext.apply(this, {
			storeProxy: Ext.create("Beet.apps.ProductsViewPort.InterestsStore")
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
				tooltip: "编辑产品",
				id: "customer_grid_edit",
				handler:function(grid, rowIndex, colIndex){
					var d = me.storeProxy.getAt(rowIndex)
					me.editInterest(d);
				}
			}
		);
		
		_actions.items.push("-", "-", "-",{
			icon: "./resources/themes/images/fam/delete.gif",
			tooltip: "删除产品",
			id: "customer_grid_delete",
			handler: function(grid, rowIndex, colIndex){
				var d = me.storeProxy.getAt(rowIndex)
				me.deleteInterest(d);
			}
		}, "-","-","-");
		
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
			height: "95%",
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
					text: "增加服务",
					handler: function(){
						me.addInterest();
					},
				},
				"-",
				{
					xtype: "button",
					text: "高级搜索",
					handler: function(){
						cardServer.GetInterestsPageData(0, 1, "", {
							success: function(data){
								var win = Ext.create("Beet.apps.AdvanceSearch", {
									searchData: Ext.JSON.decode(data),
									b_callback: function(where){
										me.b_filter = where;
										me.storeProxy.setProxy({
											type: "b_proxy",
											b_method: cardServer.GetInterestsPageData,
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

		me.add(Ext.widget("button", {
			text: "确定",
			handler: function(){
				if (me.b_selectionCallback){
					me.b_selectionCallback(me.selModel.getSelection());
				}
			}
		}))
		me.doLayout();
	},
	addInterest: function(){
		var me = this, cardServer = Beet.constants.cardServer;
		me.form = Ext.create("Ext.form.Panel", {
			height: "100%",
			width: "100%",
			frame: true,
			border: false,
			plain: true,
			shadow: true,
			items: [
				{
					fieldLabel: "名称",
					xtype: "textfield",
					name: "name"	
				},
				{
					xtype: "button",
					text: "提交",
					handler: function(){
						var form = me.form.getForm(), results = form.getValues();
						cardServer.AddInterests(results["name"], {
							success: function(id){
								if (id > -1){
									Ext.Msg.show({
										title: "添加成功",
										msg: "添加服务成功! 是否需要继续添加服务?",
										buttons: Ext.MessageBox.YESNO,
										fn: function(btn){
											if (btn == "yes"){
												form.reset();
											}else{
												me.storeProxy.loadPage(me.storeProxy.currentPage);
												win.close();
											}
										}
									})
								}else{
									Ext.Error.raise("增加服务失败");
								}
							},
							failure: function(error){
								Ext.Error.raise(error);
							}
						});
					}
				}
			],
		});

		var win = Ext.create("Ext.window.Window", {
			height: 100,
			width: 300,
			title: "增加服务",
			plain: true	
		});
		win.add(me.form);
		win.doLayout();
		win.show();
	},
	editInterest: function(parentMenu){
		var me = this, rawData = parentMenu.rawData || parentMenu.raw, cid = rawData["ID"], cname = rawData["Name"], cardServer = Beet.constants.cardServer;
		if (cid){
			Ext.MessageBox.show({
				title: "编辑服务",
				msg: "是否要更新 " + cname + " 的资料",
				buttons: Ext.MessageBox.YESNO,
				fn : function(btn){
					if (btn == "yes"){
						var form = Ext.create("Ext.form.Panel", {
							height: "100%",
							width: "100%",
							frame: true,
							border: false,
							plain: true,
							shadow: true,
							items: [
								{
									fieldLabel: "名称",
									xtype: "textfield",
									name: "name",
									value: cname	
								},
								{
									xtype: "button",
									text: "提交",
									handler: function(){
										var _form = form.getForm(), results = _form.getValues();
										cardServer.UpdateInterests(cid, results["name"], {
											success: function(succ){
												if (succ){
													Ext.Msg.show({
														title: "更新成功",
														msg: "更新服务成功! ",
														buttons: Ext.MessageBox.OK,
														fn: function(btn){
															me.storeProxy.loadPage(me.storeProxy.currentPage);
															win.close();
														}
													})
												}else{
													Ext.Error.raise("更新服务失败");
												}
											},
											failure: function(error){
												Ext.Error.raise(error);
											}
										});
									}
								}
							],
						});

						var win = Ext.create("Ext.window.Window", {
							height: 100,
							width: 300,
							title: "编辑服务",
							plain: true	
						});
						win.add(form);
						win.doLayout();
						win.show();
					}
				}
			})	
		}
	},
	deleteInterest: function(parentMenu){
		var me = this, rawData = parentMenu.rawData || parentMenu.raw, cid = rawData["ID"], cname = rawData["Name"], cardServer = Beet.constants.cardServer;
		if (cid){
			Ext.MessageBox.show({
				title: "删除服务",
				msg: "是否需要删除服务: " + cname + "?",
				buttons: Ext.MessageBox.YESNO,
				fn: function(btn){
					if (btn == "yes"){
						cardServer.DeleteInterests(cid, {
							success: function(succ){
								if (succ){
									Ext.MessageBox.show({
										title: "删除成功",
										msg: "删除服务: " + cname + " 成功",
										buttons: Ext.MessageBox.OK,
										fn: function(){
											me.storeProxy.loadPage(me.storeProxy.currentPage);
										}
									})
								}else{
									Ext.Error.raise("删除服务失败");
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
			Ext.Error.raise("删除服务失败");
		}
	}
})
