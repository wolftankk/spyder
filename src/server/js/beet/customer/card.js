Ext.define("Beet.apps.AddCustomerCard", {
	extend: "Ext.form.Panel",
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	width: "100%",
	autoHeight: true,
	autoScroll:true,
	autoDestory: true,
	frame:true,
	border: false,
	bodyBorder: false,
	plain: true,
	b_filter: "",
	initComponent: function(){
		var me = this;
		me.selectedCustomerId = null;
		me.initCustomerData = null;
		me.selectedCards = {};

		me.callParent();
		me.createMainPanel();
		me.queue = new Beet_Queue("customerCard");
		me.buildCustomerStore();
	},
	buildCustomerStore: function(){
		var me = this, customerServer = Beet.constants.customerServer;
		customerServer.GetCustomerPageData(0, 1, "", {
			success: function(data){
				var data = Ext.JSON.decode(data);
				metaData = data["MetaData"];
				var fields = [], columns = [];

				for (var c = 0; c < metaData.length; ++c){
					var d = metaData[c];
					fields.push(d["FieldName"]);
					if (!d["FieldHidden"]) {
						columns.push({
							flex: 1,
							header: d["FieldLabel"],
							dataIndex: d["FieldName"]	
						})
					}
				};

				if (!Beet.apps.Viewport.CustomerListModel){
					Ext.define("Beet.apps.Viewport.CustomerListModel", {
						extend: "Ext.data.Model",
						fields: fields
					});
				}

				if (!Ext.isDefined(Beet.apps.Viewport.CustomerListStore)){
					Ext.define("Beet.apps.Viewport.CustomerListStore", {
						extend: "Ext.data.Store",
						model: Beet.apps.Viewport.CustomerListModel,
						autoLoad: true,
						pageSize: Beet.constants.PageSize,
						b_filter: "",
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
							me.proxy.b_params["start"] = options["start"] || 0;
							me.proxy.b_params["limit"] = options["limit"]

							return me.callParent([options]);
						}
					});
				}

				me.customerStore = Ext.create("Beet.apps.Viewport.CustomerListStore");
				me.customerStore.setProxy(me.updateCustomerProxy(""));
			},
			failure: function(error){
				Ext.Error.raise(error)
			}
		})
	},
	updateCustomerProxy: function(filter){
		var me = this;
		filter = filter == undefined ? "" : filter;
		return {
			 type: "b_proxy",
			 b_method: Beet.constants.customerServer.GetCustomerPageData,
			 startParam: "start",
			 limitParam: "limit",
			 b_params: {
				 "filter": filter
			 },
			 b_scope: Beet.constants.customerServer,
			 reader: {
				 type: "json",
				 root: "Data",
				 totalProperty: "TotalCount"
			 }
		}
	},
	createMainPanel: function(){
		var me = this, cardServer = Beet.constants.cardServer;

		var options = {
			autoScroll: true,
			height: 460,
			cls: "iScroll",
			border: true,
			plain: true,
			flex: 1,
			bodyStyle: "background-color: #dfe8f5"
		}

		me.cardPanel = Ext.widget("panel", Ext.apply(options, {
			tbar: [{
				xtype: "button",
				text: "绑定卡项",
				name: "bindingCard",
				disabled: true,
				handler: function(){
					me.selectCard();
				}
			}]	
		}));

		var config = {
			autoHeight: true,
			autoScroll: true,
			cls: "iScroll",
			height: "100%",
			width: "100%",
			anchor: "fit",	
			border: false,
			bodyBorder: false,
			frame: true,
			plain: true,
			items: [
				{
					layout: {
						type: "hbox",
						align: "stretch"
					},
					height: "100%",
					autoHeight: true,
					autoScroll: true,
					border: false,
					bodyStyle: "background-color: #dfe8f5",
					defaults: {
						bodyStyle: "background-color: #dfe8f5",
						border: false
					},
					items:[
						{
							layout: {
								type: 'vbox',
								align: 'stretch'
							},
							width: 320,
							height: 300,
							items: [
								{
									layout: {
										type: "table",
										columns: 1,
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
										width: 300
									},
									defaultType: "textfield",
									fieldDefaults: {
										msgTarget: "side",
										labelAlign: "top",
										labelWidth: 60
									},
									items: [
										{
											fieldLabel: "会员名",
											xtype: "trigger",
											width: 300,
											name: "customername",
											checkChangeBuffer: 500,
											//listeners: {
											//	change: function(f, newValue, oldValue, opts){
											//		newValue = Ext.String.trim(newValue);
											//		if (newValue.length == 0){
											//			 me.selectedCustomer = false;
											//			 return;
											//		}
											//		if (newValue == oldValue){
											//			return;
											//		}
											//		if (me.selectedCustomer){
											//			return;
											//		}
											//		if (!me.customerStore) { return; }
											//		var ownerCT = f.up("panel");
											//		var onListRefresh;
											//		//create picker
											//		if (f.picker == undefined){
											//			var createPicker= function(){
											//				var picker = Ext.create("Ext.view.BoundList", {
											//					pickerField: f,
											//					selModel: "SINGLE",
											//					floating: true,
											//					hidden: true,
											//					ownerCT: ownerCT,
											//					cls: "",
											//					displayField: "CTName",
											//					store: me.customerStore,
											//					focusOnFront: false,
											//					pageSize: 10,
											//					loadingText: 'Searching...',
											//					loadingHeight: 70,
											//					width: 400,
											//					maxHeight: 300,
											//					shadow: "sides",
											//					emptyText: 'No matching posts found.',
											//					getInnerTpl: function(){
											//						return '<span class="search-item"><h3>{CTName}</h3>{CTCardNo}<br/>电话: {CTMobile}</span>';
											//					}
											//				});
											//				return picker
											//			}
											//			f.picker = createPicker();

											//			f.picker.on({
											//				itemClick: function(v, record, item, index, e, opts){
											//					//console.log(record)
											//					me.onSelectCustomer([record]);
											//					me.selectedCustomer = true;
											//					f.picker.hide();
											//				},
											//				refresh: function(){
											//					onListRefresh();
											//				}
											//			})
											//		}
											//		me.customerStore.setProxy(me.updateCustomerProxy("CTName LIKE '%"+newValue+"%'"));
											//		me.customerStore.load();

											//		onListRefresh = function(){
											//			var heightAbove = f.getPosition()[1] - Ext.getBody().getScroll().top,
											//				heightBelow = Ext.Element.getViewHeight() - heightAbove - f.getHeight(),
											//				space = Math.max(heightBelow, heightAbove);

											//			if (f.picker.getHeight() > space){
											//				f.picker.setHeight(space - 5);
											//			}
											//		}
											//		var collapseIf = function(e){
											//			if (!e.within(f.bodyEl, false, true) && !e.within(f.picker.el, false, true)){
											//				f.picker.hide();

											//				var doc = Ext.getDoc();
											//				doc.un("mousewheel", collapseIf, f);
											//				doc.un("mousedown", collapseIf, f);
											//			}
											//		}

											//		me.customerStore.on({
											//			load: function(){
											//				f.picker.show();
											//				f.picker.alignTo(f.el, "tl-bl?", [105, 0]);
											//				onListRefresh();
											//				f.mon(Ext.getDoc(), {
											//					mousedown: collapseIf,
											//					mousewheel: collapseIf	
											//				})
											//				f.el.focus();
											//			}
											//		})
											//	}
											//},
											onTriggerClick: function(){
												//这里需要一个高级查询
												var win = Ext.create("Beet.plugins.selectCustomerWindow", {
													b_selectionMode: "SINGLE",
													_callback: function(r){
														me.selectedCustomer = true;
														me.onSelectCustomer(r);
														win.hide();
													}
												});
												win.show();
											}
										},
										{
											fieldLabel: "卡号",
											name: "cardno",
											allowBlank: false,
											enableKeyEvents: true,
											listeners: {
												keydown: function(f, e){
													var v = Ext.String.trim(f.getValue())
													if (v == "" || v.length == 0){
														return;
													}
													if (e.getKey() == Ext.EventObject.ENTER){
														me.onSelectCustomer(v, "cardno")
													}
												}
											}
										},
										{
											fieldLabel: "会员级别",
											name: "level"
										},
										{
											fieldLabel: "充值金额",
											readOnly: true,
											hidden: true,
											type: "float",
											name: "_payvalue"
										},
										{
											fieldLabel: "余额",
											allowBlank: false,
											readOnly: true,
											name: "balance",
											type: "float",
											listeners: {
												blur: function(){
													var v = this.getValue();
													if (parseFloat(v) > 0){
														me.down("button[name=bindingCard]").enable();
													}else{
														me.down("button[name=bindingCard]").disable();
													}
												}
											}
										},
										{
											fieldLabel: "专属顾问",
											xtype: "trigger",
											width: 300,
											name: "employeename",
											onTriggerClick: function(){
												var win = Ext.create("Ext.window.Window", {
													title: "选择专属顾问",
													width: 750,
													height: 550,
													minHeight: 450,
													autoDestroy: true,
													autoHeight: true,
													autoScroll: true,
													layout: "fit",
													resizable: true,
													border: false,
													modal: false,
													maximizable: true,
													border: 0,
													bodyBorder: false,
												});
												win.add(Ext.create("Beet.apps.Viewport.EmployeeList", {
													b_type: "selection",
													b_selectionMode: "SINGLE",
													height: "100%",
													width: "100%",
													b_selectionCallback: function(r){
														me.onSelectEmployee(r);
														win.hide();
													}
												}));
												win.doLayout();
												win.show();
											}
										},
										{
											fieldLabel: "注释",
											allowBlank: true,
											xtype: "textarea",
											name: "descript"
										},
									]
								},
								{
									layout: {
										type: "hbox",
										columns: 2
									},
									height: 50,
									border: false,
									autoHeight: true,
									autoScroll: true,
									border: false,
									bodyStyle: "background-color: #dfe8f5",
									items: [
										{
											xtype: "component",
											width: 20
										},
										{
											xtype: "button",
											scale: "medium",
											text: "开卡",
											name: "activebtn",
											disabled: true,
											handler: function(){
												me.processData(this);
											}
										},
										{
											xtype: "component",
											width: 30
										},
										{
											xtype: "button",
											scale: "medium",
											text: "更新",
											disabled: true,
											name: "updatebtn",
											handler: function(){
												me.processData(this, true);
											}
										},
										{
											xtype: "component",
											width: 30
										},
										{
											xtype: "button",
											scale: "medium",
											text: "充值",
											disabled: true,
											name: "paidbtn",
											handler: function(){
												if (!me.selectedCustomerId){
													Ext.Msg.alert("错误", "请选择会员!");
													return;
												}
												me.openPaidWindow();
											}
										},
										{
											xtype: "component",
											width: 30
										},
										{
											xtype: "button",
											scale: "medium",
											text: "销卡",
											name: "deleteCard",
											disabled: true,
											style: {
												borderColor: "#ff5252"
											},
											handler: function(){
												Ext.MessageBox.show({
													title: "警告",
													msg: "确定需要销毁当前用户的卡?",
													buttons: Ext.MessageBox.YESNO,
													fn: function(btn){
														if (btn == "yes"){
															cardServer.DeleteCustomerAccount(me.selectedCustomerId, {
																success: function(succ){
																	if (succ){
																		Ext.MessageBox.alert("成功", "销卡成功");
																		var form = me.form.getForm();
																		//reset all
																		me.selectedCustomerId = null
																		me.selectedEmpolyeeId = null;
																		me.selectedCards = {};
																		form.reset();
																		me.down("button[name=updatebtn]").disable();
																		me.down("button[name=activebtn]").disable();
																		me.updateCardPanel();
																	}
																},
																failure: function(error){
																	Ext.Error.raise(error);
																}
															})
														}
													}
												})
											}
										}
									]
								}
							]
						},
						{
							layout: {
								type: 'vbox',
								align: 'stretch'
							},
							flex: 2,
							height: 500,
							items: [
								{
									layout: {
										type: "table",
										columns: 3,
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
										width: 300
									},
									defaultType: "textfield",
									fieldDefaults: {
										msgTarget: "side",
										labelAlign: "top",
										labelWidth: 60
									},
									items:[
										{
											xtype: "component",
											width: 30
										}
									]
								},
								me.cardPanel
							]
						}
					]
				}
			]
		}

		var form = Ext.widget("form", config);
		me.form = form;
		me.add(form);
		me.doLayout();

		me.initializeCardPanel();
	},
	openPaidWindow: function(){
		var me = this, form = me.form.getForm(), cardServer = Beet.constants.cardServer,
			win, grid;
		
		cost = 0;
		//grid's columns/fields
		var _columns= [], _fields = [];

		if (!me.queue){
			me.queue = new Beet_Queue("createPaidWindow");
		}else{
			me.queue.reset();
		}

		win = Ext.create("Ext.window.Window", {
			title: "充值",
			height: 600,
			width: 500,
			border: false,
			autoHeight: true		
		});

		me.paidTypeStore = Ext.create("Ext.data.Store", {
			fields: ["PayID", "PayName"]
		});
		updatePayType();

		if (me.paidStore == undefined){
			var _actions = {
				xtype: 'actioncolumn',
				width: 50,
				header: "操作",
				items: [
				]
			}
			_actions.items.push("-",{
				icon: "./resources/themes/images/fam/delete.gif",
				tooltip: "移除",
				handler: function(grid, rowIndex, colIndex){
					var sm = grid.getSelectionModel();
					rowEditing.cancelEdit();
					me.paidStore.remove(sm.getSelection());
					if (me.paidStore.getCount() > 0) {
						sm.select(0);
					}
					updatePayType();
				}
			}, "-");
			_columns.push(_actions);

			me.queue.Add("getPaidModel", function(){
				cardServer.GetCustomerPayData(true, "", {
					success: function(data){
						var data = Ext.JSON.decode(data);	
						var metaData = data["MetaData"];	

						for (var c = 0; c < metaData.length; ++c){
							var d = metaData[c];
							_fields.push(d["FieldName"]);
							if (!d["FieldHidden"]) {
								var column = ({
									flex: 1,
									header: d["FieldLabel"],
									dataIndex: d["FieldName"]	
								})

								switch (d["FieldName"]){
									case "PayName": 
										column.editor = {
											xtype: "combobox",
											selectOnTab: true,
											editable: false,
											store: me.paidTypeStore,
											queryMode: "local",
											displayField: "PayName",
											valueField: "PayName",
											listClass: 'x-combo-list-small',
											allowBlank: false
										}
										break;
									case "Money":
										column.editor = {
											xtype: "textfield",
											type: "int",
											allowBlank: false
										}
										break;
									case "Descript":
										column.editor = {
											xtype: "textfield"
										}
										break
								}

								_columns.push(column);
							}
						};
						if (!Beet.cache.PaidTypeModel){
							Ext.define("Beet.cache.PaidTypeModel", {
								extend: 'Ext.data.Model',
								fields: _fields	
							})
						}
						me.paidStore = Ext.create("Ext.data.ArrayStore", {
							modal: Beet.cache.PaidTypeModel,
							autoDestroy: true
						})
						me.paidColumns = _columns;

						me.queue.triggle("getPaidModel", "success");
					},
					failure: function(error){
						Ext.Error.raise(error)
					}
				})	
			})
		}

		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToMoveEditor: 1,
			autoCancel: false,
			listeners: {
				edit: function(e, editor){
					var store = e.store;
					cost = 0;
					for (var c = 0; c < store.getCount(); ++c){
						var record = store.getAt(c);
						var payName = record.get("PayName");
						if (payName){
							//update payId
							for (var a = 0; a < me.paidTypeStore.getCount(); ++a){
								var r = me.paidTypeStore.getAt(a);
								if (r.get("PayName") == payName){
									record.set("PayID", r.get("PayID"));
									break;
								}
							}
						}
						var money = record.get("Money")
						cost += parseFloat(money);	
					}
					e.grid.down("label[name=totalPrice]").setText(cost)
				}
			}
		});

		//付款方式列表
		function updatePayType(){
			cardServer.GetPayTypeData("", {
				success: function(data){
					var data = Ext.JSON.decode(data);
					data = data["Data"];
					me.paidTypeStore.loadData(data);
					rowEditing.fireEvent("edit", {
						grid : grid,
						store: grid.getStore() 
					});
				},
				failure: function(error){
					Ext.Error.raise(error);
				}
			})
		}
		
		var createGird = function(){
			me.paidStore.loadData([]);//clear

			updatePayType();

			grid = Ext.create("Ext.grid.Panel", {
				width: "100%",
				height: "100%",
				autoScroll: true,	
				autoHeight: true,
				store : me.paidStore,
				columns: me.paidColumns,
				tbar: [
					{
						text: "新增付款",
						handler: function(){
							rowEditing.cancelEdit();
							var r = Ext.create("Beet.cache.PaidTypeModel", {
								"PayName" : "",
								"Money" : 0,
								"PayDate" : new Date(),
								"Descript" : ""
							});
							me.paidStore.insert(0, r);
							rowEditing.startEdit(0, 0);
						}
					},
					"->",
					{
						text: "新增付款方式",
						handler: function(){
							var w;
							var form = me.paidTypeForm = Ext.create("Ext.form.Panel", {
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
											var form = me.paidTypeForm.getForm(), results = form.getValues();
											cardServer.AddPayType(results["name"], {
												success: function(id){
													if (id > -1){
														Ext.Msg.show({
															title: "添加成功",
															msg: "添加付款方式成功!",
															buttons: Ext.MessageBox.YESNO,
															fn: function(btn){
																updatePayType();
																w.close();
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
							w = Ext.create("Ext.window.Window", {
								height: 100,
								width: 300,
								title: "增加付款方式",
								plain: true	
							});
							w.add(form);
							w.show();
						},
					}
				],
				bbar: [
					{
						xtype: "label",
						text: "总计:"
					},
					{
						xtype: "label",
						name: "totalPrice",
						text: "0"
					},
					"->",
					{
						text: "确定",
						handler: function(){
							Ext.MessageBox.show({
								title: "充值确认",
								msg: "充值金额: <span style=\"color:red;font-weight:bolder;\">" + cost + "</span> 元 <br/><br/>确认充值吗?",
								buttons: Ext.MessageBox.YESNO,
								fn: function(btn){
									if (btn == "yes"){
										var pays = [];
										for (var c = 0; c < me.paidStore.getCount(); ++c){	
											var r = me.paidStore.getAt(c);
											pays.push({
												payid: r.get("PayID"),
												money: r.get("Money"),
												descript: r.get("Descript")	
											});
										}
										var results = {
											customerid: me.selectedCustomerId,
											pays: pays
										}

										//充值部分, 成功充值后, 将返回当前的余额
										cardServer.AddCustomerPay(Ext.JSON.encode(results), {
											success: function(data){
												console.log(data)
												data = JSON.parse(data);
												if (data["result"]){
													var values = form.getValues();
													if (cost > 0){
														me.down("button[name=bindingCard]").enable();
													}
													
													/**
													 * TODO:
													 * 这里问题:
													 * 1. 充值成功后, 需要更新成功充值的金额, 往余额上加
													 */
													form.setValues(
														{
															_payvalue: cost,
															"balance" : parseFloat(values["balance"]) + cost
														}
													)
													win.close();	
												}else{
													Ext.Msg.alert("失败", "充值失败");
												}
											},
											failure: function(error){
												Ext.Error.raise(error)
											}
										})
									}
								}
							})
						}
					},
					{
						text: "取消",
						handler: function(){ 
							me.paidStore = null;
							win.close();
						}
					}
				],
				plugins: [
					rowEditing	
				]	
			});

			if (!!me.queue.getProcess("createGird")){
				me.queue.trigger("createGird", "success")
			}
			return grid
		}

		if (me.queue.getCurrentNumProcesses == 0 || me.paidStore){
			var g = createGird();
			win.show();
			win.add(g);
			win.doLayout();
		}else{
			me.queue.Add("createGird", "getPaidModel", function(){
				var g = createGird()
				win.add(g);
				win.show();
			});
		}
	},
	onSelectEmployee: function(records){
		var me = this, form = me.form.getForm(), cardServer = Beet.constants.cardServer;
		me.selectedEmpolyeeId = null;
		if (records && records.length == 1){
			var record = records[0];
			var em_userid = record.get("EM_UserID"), em_name = record.get("EM_NAME");
			form.setValues({
				employeename: em_name	
			})
			me.selectedEmpolyeeId = em_userid;
		}
	},
	onSelectCustomer: function(records, type){
		var me = this, form = me.form.getForm(), cardServer = Beet.constants.cardServer;
		//reset all
		me.initCustomerData = true;
		me.selectedCustomerId = null
		me.selectedEmpolyeeId = null;
		me.selectedCards = {};
		form.reset();
		me.down("button[name=updatebtn]").disable();
		me.down("button[name=activebtn]").disable();
		me.down("button[name=deleteCard]").disable();
		me.down("button[name=paidbtn]").disable();
		me.updateCardPanel();
		var currentBalance = 0;

		if (records && records.length > 0){
			var customerData;
			me.queue.Add("queryCustomer", "", function(){
				Ext.MessageBox.show({
					msg: "正在查询当前客户数据中...",
					progressText: "查询中...",
					width: 300,
					wait: true,
					waitConfig: {interval: 800},
					closable: false
				});

				var sql = "";
				if (type == "cardno"){
					sql = " CardNo = '" + records + "'";	
				}else{
					var record = records[0];
					var CTGUID = record.get("CTGUID"), name = record.get("CTName");
					form.setValues({
						customername: name
					})
					me.selectedCustomerId = CTGUID;
					sql = "CustomerID='" + CTGUID + "'";
				}

				cardServer.GetCustomerAccountData(false, sql, {
					success: function(data){
						data = Ext.JSON.decode(data);
						data = data["Data"];
						if (data.length > 0){
							customerData = data[0];
							//restoreForm
							me.restoreFromData(customerData);
							if (type == "cardno"){
								me.selectedCustomerId = customerData["CustomerID"];
								form.setValues({
									customername: customerData["CustomerName"]	
								})
							}
							me.down("button[name=updatebtn]").enable();
							me.down("button[name=deleteCard]").enable();
							me.down("button[name=bindingCard]").enable();

							me.queue.triggle("queryCustomer", "success");
						}else{
							customerData = null;
							//获取充值余额
							cardServer.GetCustomerPayData(false, sql, {
								success: function(data){
									var data = Ext.JSON.decode(data);
									data = data["Data"];
									var money = 0;
									for (var c = 0; c < data.length; ++c){
										var d = data[c];
										var m = d["Money"].replaceAll(",", "");
										money += parseFloat(m);
									}
									form.setValues({
										_payvalue: money,
										balance: money	
									});
									if (money > 0){
										me.down("button[name=bindingCard]").enable();
									}
									me.queue.triggle("queryCustomer", "success");
								},
								failure: function(error){
									Ext.Error.raise(error)
								}
							})
							me.down("button[name=activebtn]").enable();
						}
						if (me.selectedCustomerId){
							me.down("button[name=paidbtn]").enable();
						}
					},
					failure: function(error){
						Ext.Error.raise(error)
					}
				})
			});

			me.queue.Add("queryCustomerCard", "queryCustomer", function(){
				if (customerData){
					cardServer.GetCustomerCardData(false, "CustomerID='"+customerData["CustomerID"]+"'", {
						success: function(data){
							data = Ext.JSON.decode(data);
							data = data["Data"];
							var records = []
							for (var c = 0; c < data.length; ++c){
								var d = data[c];
								var cardId = d["CID"];
								if (cardId){
									var record = d;
									record["StartTime"] = new Date(record["StartTime"])
									record["EndTime"] = new Date(record["EndTime"])
									//处理并且合并相关数据, 然后使用addCard方法传入
									records.push(record);
								}
							}
							
							//这里初始化成功, 直接获得当前的金额值即可完成
							//var currentBalance = parseFloat(form.getValues()["_payvalue"]);
							//if (records.length > 0){
							//	var money = 0;
							//	for (var c = 0; c < records.length; ++c){
							//		var r = records[c];
							//		money += parseFloat(r["Balance"].replaceAll(",", ""));
							//	}
							//	form.setValues({
							//		_payvalue: money + currentBalance,
							//		balance: money+currentBalance
							//	});
							//}
							//不自动扣钱, 只增加数据进去
							me.addCard(records, true, false, true);
							me.queue.triggle("queryCustomerCard", "success");
						},
						failure: function(error){
							Ext.Error.raise(error)
						}
					});
				}else{
					if (customerData == null){
						me.queue.triggle("queryCustomerCard", "success");
					}
				}
			})

			me.queue.Add("waitingFeedback", "queryCustomer,queryCustomerCard", function(){
				Ext.MessageBox.hide();
				me.queue.triggle("waitingFeedback", "success");
				me.initCustomerData = false;
			})
		}
	},
	restoreFromData: function(data){
		var me = this, cardServer = Beet.constants.cardServer, form = me.form.getForm();
		me.selectedCustomerId = data["CustomerID"];
		me.selectedEmpolyeeId = data["EID"];
		form.setValues({
			cardno: data["CardNo"],
			"level" : data["Level"],
			employeename: data["EName"],
			balance: (data["Balance"] ? data["Balance"].replaceAll(",", "") : 0),
			_payvalue: (data["Balance"] ? data["Balance"].replaceAll(",", "") : 0),
			descript: data["Descript"]
		})
	},
	initializeCardPanel: function(){
		var me = this, cardServer = Beet.constants.cardServer;
		if (me.cardPanel.__columns && me.cardPanel.__columns.length > 0){
			return;
		}
		var columns = me.cardPanel.__columns = [];
		var _actions = {
			xtype: 'actioncolumn',
			width: 30,
			items: [
			]
		}
		_actions.items.push("-",{
			icon: "./resources/themes/images/fam/delete.gif",
			tooltip: "删除卡项",
			id: "customer_grid_delete",
			handler: function(grid, rowIndex, colIndex){
				var d = grid.store.getAt(rowIndex)
				me.deleteCard(d, grid);
			}
		}, "-");

		columns.push(_actions);
		cardServer.GetCustomerCardData(true, "", {
			success: function(data){
				var data = Ext.JSON.decode(data)["MetaData"];
				//console.log(data)
				var fields = me.cardPanel.__fields = [];
				for (var c in data){
					var meta = data[c];
					fields.push(meta["FieldName"])
					
					//隐藏有效日期
					if (meta["FieldName"] == "ValidDate"){
						meta["FieldHidden"] = true;
					}
					if (!meta["FieldHidden"]){
						var column = {
							dataIndex: meta["FieldName"],
							header: meta["FieldLabel"],
							flex: 1,
						}

						switch (meta["FieldName"]){
							case "Balance":	
								column.editor = {
									xtype: "textfield",
									type: "int",
									allowBlank: false
								}
								break;
							case "StartTime":
								column.editor = {
									xtype: "datefield",
									format: "Y/m/d",
									allowBlank: false
								}
								break;
							//case "EndTime":
							//	column.editor = {
							//		xtype: "datefield",
							//		format: "Y/m/d",
							//		allowBlank: false
							//	}
							//	break
						}

						columns.push(column);
					}
				}

				fields.push("raterate");
				fields.push("ID");
				fields.push("isNew");

				me.initializeCardGrid();
			},
			failure: function(error){
				Ext.Error.raise(error);
			}
		});
	},
	initializeCardGrid: function(){
		var me = this, selectedCards = me.selectedCards;
		var __fields = me.cardPanel.__fields;
		var store = Ext.create("Ext.data.ArrayStore", {
			fields: __fields
		})

		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			autoCancel: true,
			listeners: {
				edit: function(events, e){
				},
				validateedit: function(editor, e){
					var record = e.record, newvalues = e.newValues;
					var price = parseFloat(record.data.Price.replaceAll(",", "")), blance = parseFloat(newvalues.Balance);
					var selectedCards = me.selectedCards;
					var __fields = me.cardPanel.__fields;

					var _v = me.form.getForm().getValues(), balance = _v["balance"];

					if (blance && blance >= price){
						//修改成功!
						e.cancel = false;

						var cid = record.get("ID") || record.get("CID");
						if (!selectedCards[cid]){return}

						var rawData = record.data;
						if (rawData["raterate"] == undefined){
							rawData["raterate"] = 1;
						}

						if (rawData["StartTime"] == undefined){
							rawData["StartTime"] = new Date();
						}

						if (rawData["EndTime"] == undefined){
							// 0 year 1 month 2 day
							var d = 0;
							switch (rawData["ValidUnit"]){
								case 0:
									d = rawData["ValidDate"] * 365 * 86400;
									break;
								case 1:
									d = rawData["ValidDate"] * 30 * 86400;
									break;
								case 2:
									d = rawData["ValidDate"] * 86400;
									break;
							}
							rawData["EndTime"] = new Date(+new Date() + d * 1000);
						}

						//rawData["ExpenseCount"] = rawData["MaxCount"];
						//rawData["StepPrice"] = rawData["MaxCount"] == 0 ? 0 : rawData["Price"].replaceAll(",", "") / rawData["MaxCount"]
						//if (rawData["Balance"] == undefined || rawData["Balance"] == ""){
						//	rawData["Balance"] = rawData["Price"].replace(/,/g, "");
						//}

						//hook
						if (!me.initCustomerData){
							if (parseFloat(rawData["Balance"]) > parseFloat(balance)){
								Ext.MessageBox.alert("警告", "该卡项面值超出当前余额");
								//need remove
								delete selectedCards[cid];
								me.updateCardPanel();
								return;
							}
							selectedCards[cid] = [];
							Ext.defer(function(){
								for (var c = 0; c < __fields.length; ++c){
									var k = __fields[c];
									selectedCards[cid].push(rawData[k]);
								}
								//取消?!
								//TODO 
								//ISSUE
								//me.updateCardPanel();
							}, 100);
						}


					}else{
						e.cancel = true;
						//check blance
						var blance = editor.getEditor().down("textfield[name=Balance]");
						if (blance){
							blance.markInvalid("不能小于卡项原有金额");
						}
					}
				}
			}
		})

		var grid = me.cardPanel.grid = Ext.create("Ext.grid.Panel", {
			store: store,
			width: "100%",
			height: "100%",
			cls: "iScroll",
			autoScroll: true,
			autoHeight: true,
			columnLines: true,
			columns: me.cardPanel.__columns,
			plugins: [
				rowEditing
			],
		});
		grid.rowEditing = rowEditing;

		me.cardPanel.add(grid);
		me.cardPanel.doLayout();
	},
	selectCard: function(){
		var me = this, cardServer = Beet.constants.cardServer;
		var config = {
			extend: "Ext.window.Window",
			title: "选则卡项",
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

		win.add(Ext.create("Beet.apps.ProductsViewPort.CardList", {
			b_type: "selection",
			b_selectionMode: "MULTI",
			b_selectionCallback: function(records){
				if (records.length == 0){ win.close(); return;}
				me.addCard(records, false, true);
				win.close();
			}
		}));
		win.doLayout();
	},
	addCard: function(records, isRaw, needComputeStepPrice, notComputingTotal){
		var me = this, selectedCards = me.selectedCards;
		if (notComputingTotal == undefined){
			notComputingTotal = false;
		}
		var __fields = me.cardPanel.__fields;
		//"CustomerID", "CID", "Name", "Par", "Price", "ExpenseCount", "StepPrice", "Balance", "Rate", "StartTime", "EndTime", "Price", "MaxCount", "ValidDateMode", "ValidDateTime", "ValidUnit", "ValidDate", "raterate", "ID", "isNew"
		if (records == undefined){
			return;
		}
		var _v = me.form.getForm().getValues(), balance = _v["balance"];

		for (var r = 0; r < records.length; ++r){
			var record = records[r];
			//console.log(record)
			var cid, rawData;
			if (isRaw){
				cid = record["ID"] || record["CID"];
				rawData = record;
			}else{
				cid = record.get("ID") || record.get("CID");
				rawData = record.raw;
			}

			//重新设置一次
			rawData["ID"] = cid;
			rawData["CID"] = cid;

			if (needComputeStepPrice){
				//console.log(rawData["Price"], rawData["MaxCount"])
				var price = rawData["Price"].replaceAll(",", "");
				var maxCount = rawData["MaxCount"] == 0 ? 1 : rawData["MaxCount"];
				rawData["StepPrice"] =  parseFloat(parseFloat(price) / parseFloat(maxCount), 2);
			}
			

			if (selectedCards[cid] == undefined){
				selectedCards[cid] = []
			}else{
				selectedCards[cid] = [];
			}

			//auto computer
			if (rawData["raterate"] == undefined){
				rawData["raterate"] = 1;
			}

			if (rawData["StartTime"] == undefined){
				rawData["StartTime"] = new Date();
			}

			if (rawData["EndTime"] == undefined){
				// 0 year 1 month 2 day
				var d = 0;
				switch (rawData["ValidUnit"]){
					case 0:
						d = rawData["ValidDate"] * 365 * 86400;
						break;
					case 1:
						d = rawData["ValidDate"] * 30 * 86400;
						break;
					case 2:
						d = rawData["ValidDate"] * 86400;
						break;
				}
				rawData["EndTime"] = new Date(+new Date() + d * 1000);
			}

			rawData["ExpenseCount"] = rawData["MaxCount"];
			rawData["StepPrice"] = rawData["MaxCount"] == 0 ? 0 : rawData["Price"].replaceAll(",", "") / rawData["MaxCount"]
			if (rawData["Balance"] == undefined || rawData["Balance"] == ""){
				rawData["Balance"] = rawData["Price"].replace(/,/g, "");
			}
			
			rawData["isNew"] = !notComputingTotal;//是否为新的?取反向值

			//批量计算是否超出面额
			if (!me.initCustomerData){
				if (parseFloat(rawData["Balance"]) > parseFloat(balance)){
					Ext.MessageBox.alert("警告", "该卡项面值超出当前余额");
					return;
				}else{
					balance -= parseFloat(rawData["Balance"]);	
				}
			}

			for (var c = 0; c < __fields.length; ++c){
				var k = __fields[c];
				selectedCards[cid].push(rawData[k]);
			}
		}

		me.updateCardPanel(notComputingTotal);
	},
	deleteCard: function(record, grid){
		var me = this, selectedCards = me.selectedCards;
		me.cardPanel.grid.rowEditing.cancelEdit();
		//自动删除部分
		var cid = record.get("CID");
		//console.log(cid, selectedCards)
		if (selectedCards[cid]){
			selectedCards[cid] = null;
			delete selectedCards[cid];
		}
		//console.log(selectedCards)

		me.updateCardPanel();
	},
	updateCardPanel: function(notComputingTotal){
		//console.trace(this);
		var me = this, selectedCards = me.selectedCards;
		var grid = me.cardPanel.grid, store = grid.getStore();
		var __fields = me.cardPanel.__fields;
		var tmp = [];

		var _v = me.form.getForm().getValues(), balance = _v["_payvalue"];

		//这一部分将会重新计算
		var totalBalance = 0; //卡项总价
		for (var c in selectedCards){
			if (selectedCards[c].length == 0){
				continue;
			}
			var m = (selectedCards[c][7] || "0").replaceAll(",", "");
			var isNew = selectedCards[c][19];//last 
			if (isNew){
				totalBalance += parseFloat(m);
			}
			tmp.push(selectedCards[c]);
		}

		if (!notComputingTotal){
			me.form.getForm().setValues({
				"balance" : (balance - totalBalance)
			})
		}
		store.loadData(tmp);
	},
	processData: function(f, isUpdate){
		var me = this, cardServer = Beet.constants.cardServer, form = me.form.getForm(), results = form.getValues();
		var selectedCards = me.selectedCards;
		var customerId = me.selectedCustomerId;
		var isValid = false;

		if (!customerId){
			Ext.MessageBox.alert("失败", "请选择会员!");
			return;
		}

		if (!me.selectedEmpolyeeId){
			Ext.MessageBox.alert("失败", "请选择顾问!");
			return;
		}

		results["customerid"] = customerId;
		results["eid"] = me.selectedEmpolyeeId;

		//check 
		var cards = [];
		cardStore = me.cardPanel.grid.getStore();
		for (var c = 0; c < cardStore.getCount(); ++c){
			var data = cardStore.getAt(c);
			var startdate = data.get("StartTime"), enddate = data.get("EndTime");
			if (startdate && enddate){
				startdate = +new Date(startdate) / 1000;
				enddate = +new Date(enddate) / 1000;
				if (startdate > enddate){
					Ext.MessageBox.alert("失败","失效日期必须比生效日期大!")
					return;
				}else{
					cards.push({
						id: data.get("CID"),
						starttime: startdate,
						endtime: enddate,
						rate: data.get("raterate"),
						expensecount: data.get("ExpenseCount"),
						stepprice: data.get("StepPrice"),
						balance: data.get("Balance")
					})
				}
			}else{
				Ext.MessageBox.alert("失败","生效日期与失效日期必须填写!")
				return;
			}
		}
		results["cards"] = cards;
		
		if (isUpdate){
			console.log(results)
			cardServer.UpdateCustomerAccount(Ext.JSON.encode(results), {
				success: function(succ){
					if (succ){
						Ext.MessageBox.alert("成功", "更新成功!");
						//console.log(me, me.storeProxy)
						//me.cardPanel.grid.store.loadPage(1)
					}else{
						Ext.MessageBox.alert("失败", "更新失败!");
					}
				},
				failure: function(error){
					Ext.Error.raise(error);
				}
			});
		}else{
			cardServer.AddCustomerAccount(Ext.JSON.encode(results), {
				success: function(succ){
					if (succ){
						Ext.MessageBox.show({
							title: "增加成功",
							msg: "是否需要继续添加?",
							buttons: Ext.MessageBox.YESNO,
							fn: function(btn){
								if (btn == "yes"){
									me.selectedCustomerId = null
									me.selectedEmpolyeeId = null;
									me.selectedCards = {};
									form.reset();
									me.updateCardPanel();
								}
							}
						})
					}else{
						Ext.MessageBox.alert("失败", "添加失败!");
					}
				},
				failure: function(error){
					Ext.Error.raise(error);
				}
			});
		}
	}
})
