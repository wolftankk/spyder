registerBeetAppsMenu("employee",
{
	title: "员工管理",
	items:[
		{
			xtype: "container",
			layout: "hbox",
			defaultType: "buttongroup",
			defaults:{
				height: 100,
				width: 250
			},
			items: [
				{
					xtype: "buttongroup",
					title: "员工管理",
					width: "100%",
					layout: "anchor",
					frame: true,
					defaults: {
						scale: 'large',
						rowspan: 3
					},
					items: [
						{
							xtype: "button",
							text: "增加员工",
							id: "employee_addBtn",
							tooltip: "点击添加员工",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["addEmployee"];
								if (!item){
									Beet.workspace.addPanel("addEmployee", "添加员工", {
										items: [
											Ext.create("Beet.apps.Viewport.AddEmployee")
										]	
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							xtype: "button",
							text: "编辑员工",
							id: "employee_editBtn",
							tooltip:"编辑或者删除员工",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["employeeList"];
								if (!item){
									Beet.workspace.addPanel("employeeList", "编辑员工", {
										items: [
											Ext.create("Beet.apps.Viewport.EmployeeList")
										]	
									})
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

Ext.define("Beet.apps.Viewport.AddEmployee", {
	extend: "Ext.panel.Panel",
	layout: "anchor",
	height: Beet.constants.VIEWPORT_HEIGHT - 5,
	width : "100%",
	defaults: {
		border: 0
	},
	border: 0,
	suspendLayout: true,
	lookMask: true,
	initComponent: function(){
		var me = this;
		Ext.apply(this, {});

		if (!me.departmentList){
			me.createDeparentList();
		}
		if (!me.branchesList){
			me.createBranchesList();
		}
		
		me.baseInfoPanel = Ext.create("Ext.form.Panel", me.getBaseInfoPanelConfig());
		me.items = [
			me.baseInfoPanel
		]

		me.callParent(arguments);
	},
	createDeparentList: function(){
		var me = this;
		me.departmentList = Ext.create("Ext.data.Store", {
			fields: ["attr", "name"],
			data: Beet.cache.employee.departmentList	
		});
	},
	createBranchesList: function(){
		var me = this;
		me.branchesList = Ext.create("Ext.data.Store", {
			fields: ["attr", "name"],
			data: Beet.cache.employee.branchesList
		});
	},
	getBaseInfoPanelConfig: function(){
		var me = this, config;

		config = {
			frame: true,
			bodyPadding: 10,
			layout: "anchor",
			height: "100%",
			autoScroll: true,
			autoHeight: true,
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left',
				labelWidth: 75,
				allowBlank: false
			},
			defaultType: "textfield",
			items: [
				{
					fieldLabel: "登录名",
					name: "username",
				},
				{
					fieldLabel: "登陆密码",
					inputType: 'password',
					name: "password",
					minLength: 6
				},
				{
					fieldLabel: "重新输入密码",
					inputType: 'password',
					validator: function(value){
						var pw  = this.previousSibling('[name=password]');
						return (pw.getValue() === value) ? true : '密码不匹配'; 
					}
				},
				{
					fieldLabel: "员工姓名",
					name: "emname"
				},
				{
					fieldLabel: "所属部门",
					name: "emdep",
					xtype: "combobox",
					editable: false,
					store: me.departmentList,
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					allowBlank: false,
				},
				{
					fieldLabel: "所属分店",
					name: "emstore",
					xtype: "combobox",
					editable: false,
					store: me.branchesList,
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					allowBlank: false,
				},
				{
					fieldLabel: "身份证号",
					name: "empid",
					allowBlank: true
				},
				{
					fieldLabel: "分机号",
					name: "emext",
					allowBlank: true
				},
				{
					fieldLabel: "地址",
					name: "emaddr",
					allowBlank: true
				},
				{
					fieldLabel: "QQ/MSN",
					name: "emim",
					allowBlank: true
				},
				{
					fieldLabel: "手机",
					name: "emmobile",
					allowBlank: true
				},
				{
					fieldLabel: "座机号",
					name: "emphone",
					allowBlank: true
				},
				{
					fieldLabel: "出生月份",
					xtype: "combobox",
					store: Beet.constants.monthesList,
					name: "embirthmonth",
					queryMode: "local",
					editable: false,
					displayField: "name",
					valueField: "attr",
					allowBlank: true,
				},
				{
					fieldLabel: "出生日期",
					xtype: "combobox",
					editable: false,
					store: Beet.constants.daysList,
					name: "embirthday",
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					allowBlank: true
				},
				{
					fieldLabel: "入职日期",
					xtype: "datefield",
					editable: false,
					name: "emindate",
					format: "Y/m/d",
					value: new Date(),
					allowBlank: false
				},
				{
					fieldLabel: "备注",
					xtype: "textfield",
					name: "descript"
				},
				{
					xtype: "button",
					id : "move-next",
					scale: "large",
					formBind: true,
					disabled: true,
					text: "增加",
					handler: me._addEmployee
				}
				
			]
		}
		return config;
	},
	createAdminSeletorWindow: function(needSumbitData, _form){
		var me = this, privilegeServer = Beet.constants.privilegeServer, employeeServer = Beet.constants.employeeServer;
		var createWin = function(){
			var list = [], _data = Beet.cache.adminData.data, _metadata = Beet.cache.adminData.metaData;

			for (var c in _data){
				var item = _data[c];
				list.push({
					inputValue: item["UserGUID"],
					name: "_etype",
					boxLabel: item["UserName"] + "   "  + item["Descript"]
				});
			}

			var win = Ext.widget("window", {
				title: "选择员工关联的操作员",
				width: 450,
				height: 300,
				minHeight: 200,
				autoHeight: true,
				autoScroll: true,
				layout: "fit",
				resizable: true,
				border: false,
				modal: true,
				maximizable: true,
				border: 0,
				bodyBorder: false,
				items: [
					{
						xtype: "form",
						frame: true,
						border: false,
						plain: true,
						height: "100%",
						fieldDefaults: {
							msgTarget: "side",
							labelAlign: "left",
							labelWidth: 75
						},
						defaultType: "radio",
						items: list,
						buttons: [
							{
								text: "提交",
								handler: function(widget, e){
									var t = this, form = t.up("form").getForm(), result = form.getValues();
									if (result["_etype"]){
										var _id = result["_etype"];
										win.close();
										employeeServer.AddEmployee(_id, needSumbitData, {
											success: function(uid){
												if (uid > -1){
													Ext.MessageBox.show({
														title: "添加成功!",
														msg: "是否需要继续添加员工?",
														buttons: Ext.MessageBox.YESNO,
														fn: function(btn){
															if (btn == "yes"){
																_form.reset();
															}else{
																if (Beet.apps.Menu.Tabs["addEmployee"]){
																	Beet.workspace.removePanel("addEmployee");
																}
															}
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
							}
						]
					}
				]
			})

			me.popAdminSelectorWindow = win;
			win.show();
		}

		if (Beet.cache.adminData == undefined){
			Beet.cache.adminData = {};
			privilegeServer.GetUserDataToJSON(false, {
				success: function(data){
					data = Ext.JSON.decode(data);
					Beet.cache.adminData.data = data["Data"];
					Beet.cache.adminData.metaData = data["MetaData"];

					createWin();
				},
				failure: function(error){
					Ext.Error.raise(error);
				}
			})
		}else{
			createWin();
		}
	},
	_addEmployee: function(direction, e){
		var me = this, form = me.up("form").getForm(), parent = me.ownerCt.ownerCt, result = form.getValues(),needSumbitData, employeeServer = Beet.constants.employeeServer;
		if (form.isValid()){
			result["emindate"] = +(new Date(result["emindate"]))/1000;
			result["password"] = xxtea_encrypt(result["password"])

			needSumbitData = Ext.JSON.encode(result);
			Ext.MessageBox.show({
				title: "增加员工",
				msg: "是否需要添加员工: " + result["emname"],
				buttons: Ext.MessageBox.YESNO,
				fn: function(btn){
					if (btn == "yes"){
						employeeServer.AddEmployee(needSumbitData, {
							success: function(uid){
								 if (uid !== Beet.constants.FAILURE){
									 Ext.MessageBox.show({
										 title: "添加成功!",
										 msg: "是否需要继续添加员工?",
										 buttons: Ext.MessageBox.YESNO,
										 fn: function(btn){
											 if (btn == "yes"){
												 form.reset();
											 }else{
												 if (Beet.apps.Menu.Tabs["addEmployee"]){
													 Beet.workspace.removePanel("addEmployee");
												 }
											 }
										 }
									 })
								 }
							 },
							failure: function(error){
								Ext.Error.raise(error);
							}
						})
						//parent.createAdminSeletorWindow(needSumbitData, form);
					}
				}
			});
		}
	}
});



Ext.define("Beet.apps.Viewport.EmployeeList", {
	extend: "Ext.panel.Panel",
	layout: "fit",
	width: "100%",
	bodyBorder: false,
	autoHeight: true,
	frame: true,
	b_filter: "",
	b_selectionMode: "MULTI",
	b_type: "list", 
	defaults:{
		border: 0
	},
	initComponent: function(){
		var me = this;

		me.createDeparentList();
		me.createBranchesList();

		me.callParent();
		
		Beet.constants.employeeServer.GetEmployeeData(0, 1, "", true, {
			success: function(data){
				var data = Ext.JSON.decode(data);
				me.buildStoreAndModel(data["MetaData"]);
			},
			failure: function(error){
				Ext.Error.raise(error)
			}
		})
	},
	buildStoreAndModel: function(metaData){
		var me = this, fields = [], columns = [];
		me.columns = columns;
		for (var c = 0; c < metaData.length; ++c){
			var d = metaData[c];
			if (d["FieldName"] == "EM_INDATE"){
				fields.push({ 
					name: "EM_INDATE", 
					convert: function(value, record){
						 var date = new Date(value * 1000);
						 if (date){
							 return Ext.Date.format(date, "Y/m/d");
						 }
					 }
				});
			}else{
				fields.push(d["FieldName"]);
			}
			if (!d["FieldHidden"]) {
				columns.push({
					flex: 1,
					header: d["FieldLabel"],
					dataIndex: d["FieldName"]	
				})
			}
		};
		if (!Beet.apps.Viewport.EmployeeListModel){
			Ext.define("Beet.apps.Viewport.EmployeeListModel", {
				extend: "Ext.data.Model",
				fields: fields
			});
		}

		if (!Ext.isDefined(Beet.apps.Viewport.EmployeeListStore)){
			Ext.define("Beet.apps.Viewport.EmployeeListStore", {
				extend: "Ext.data.Store",
				model: Beet.apps.Viewport.EmployeeListModel,
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
			});
		};
		
		me.storeProxy = Ext.create("Beet.apps.Viewport.EmployeeListStore");
		me.storeProxy.setProxy(me.updateProxy());
		me.createEmployeeGrid();
	},
	updateProxy: function(){
		var me = this, employeeServer = Beet.constants.employeeServer;
		return {
			type: "b_proxy",
			b_method: Beet.constants.employeeServer.GetEmployeeData,
			startParma: "start",
			limitParma: "limit",
			b_params: {
				"filter" : me.b_filter,
				"b_onlySchema": false
			},
			b_scope: Beet.constants.employeeServer,
			reader: {
				type: "json",
				root: "Data",
				totalProperty: "TotalCount"
			}
		}
	},
	createDeparentList: function(){
		var me = this;
		me.departmentList = Ext.create("Ext.data.Store", {
			fields: ["attr", "name"],
			data: Beet.cache.employee.departmentList	
		});
	},
	createBranchesList: function(){
		var me = this;
		me.branchesList = Ext.create("Ext.data.Store", {
			fields: ["attr", "name"],
			data: Beet.cache.employee.branchesList
		});
	},
	createEmployeeGrid: function(){
		var me = this, grid = me.grid, store = me.storeProxy, actions;

		if (me.b_type == "list"){
			var _actions = {
				xtype: "actioncolumn",
				widget: 20,
				items: []
			}

			_actions.items.push(
				"-","-","-", {
					icon: './resources/themes/images/fam/user_edit.png',
					tooltip: "编辑员工",
					id: "employee_grid_edit",
					handler: function(grid, rowIndex, colIndex){
						var d = me.storeProxy.getAt(rowIndex)
						me.editEmployeeFn(d);
					}
				}, "-", "-"
			);

			_actions.items.push("-", {
				icon: "./resources/themes/images/fam/delete.gif",	
				tooltip: "删除员工",
				id: "employee_grid_delete",
				handler: function(grid, rowIndex, colIndex){
					var d = me.storeProxy.getAt(rowIndex)
					me.deleteEmployeeFn(d);
				}
				} 
			);

			me.columns.splice(0, 0, _actions);
		}

		var sm;
		if (me.b_type == "selection"){
			sm = Ext.create("Ext.selection.CheckboxModel", {
				mode: me.b_selectionMode ? me.b_selectionMode : "SINGLE"
			});
		}

		me.grid = Ext.create("Beet.plugins.LiveSearch", {
			store: store,
			lookMask: true,
			frame: true,
			width: "100%",
			height: me.b_type == "list" ? "100%" : "95%",
			selModel: sm,
			cls: "iScroll",
			collapsible: false,
			rorder: false,
			bodyBorder: 0,
			autoScroll: true,
			autoHeight: true,
			border: 0,
			columnLines: true,
			viewConfig: {
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
						var employeeServer = Beet.constants.employeeServer;
						employeeServer.GetEmployeeData(0, 1, "", true, {
							success: function(data){
								var win = Ext.create("Beet.apps.AdvanceSearch", {
									searchData: Ext.JSON.decode(data),
									b_callback: function(where){
										me.b_filter = where;
										me.filterEmployee();
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
		});

		me.add(me.grid);
		me.doLayout();

		if (me.b_type == "selection"){
			me.add(Ext.widget("button", {
				text: "确定",
				floating: false,
				style: {
					float: "right"
				},
				width: 100,
				handler: function(){
					if (me.b_selectionCallback){
						me.b_selectionCallback(me.grid.selModel.getSelection());
					}
				}
			}));
			me.doLayout();
		}
	},
	filterEmployee: function(){
		var me = this;
		me.storeProxy.setProxy(me.updateProxy());

		me.storeProxy.loadPage(1);
	},
	editEmployeeFn: function(parentMenu){
		var me = this, rawData = parentMenu.rawData || parentMenu.raw, guid = rawData.EM_UserID , EmName= rawData.EM_NAME, employeeServer = Beet.constants.employeeServer;
		if (guid){
			Ext.MessageBox.show({
				title: "编辑员工",
				msg: "是否要修改 " + EmName + " 的资料",
				buttons: Ext.MessageBox.YESNO,
				fn : function(btn){
					if (btn == "yes"){
						me.popEditWindow(rawData, guid);
					}
				}
			});
		}
	},
	getBaseInfoPanelConfig: function(rawData, guid){
		var me = this, config;

		config = {
			frame: true,
			bodyPadding: 10,
			layout: "anchor",
			height: "100%",
			autoScroll: true,
			autoHeight: true,
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left',
				labelWidth: 75,
				allowBlank: false
			},
			defaultType: "textfield",
			items: [
				{
					fieldLabel: "员工姓名",
					name: "emname",
					value: rawData["EM_NAME"]
				},
				{
					fieldLabel: "登陆名",
					name: "name",
					emptyText: "留空则不做修改",
					allowBlank: true,
				},
				{
					fieldLabel: "登陆密码",
					inputType: 'password',
					name: "password",
					minLength: 6,
					emptyText: "留空则不做修改",
					allowBlank: true
				},
				{
					fieldLabel: "重新输入密码",
					inputType: 'password',
					allowBlank: true,
					emptyText: "留空则不做修改",
					validator: function(value){
						var pw  = this.previousSibling('[name=password]');
						return (pw.getValue() === value) ? true : '密码不匹配'; 
					}
				},
				{
					fieldLabel: "所属部门",
					name: "emdep",
					xtype: "combobox",
					store: me.departmentList,
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					allowBlank: false,
					value: rawData["EM_DEP"]
				},
				{
					fieldLabel: "所属分店",
					name: "emstore",
					xtype: "combobox",
					store: me.branchesList,
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					allowBlank: false,
					value: rawData["EM_STOREID"]
				},
				{
					fieldLabel: "身份证号",
					name: "empid",
					allowBlank: true,
					value: rawData["EM_PID"]
				},
				{
					fieldLabel: "分机号",
					name: "emext",
					allowBlank: true,
					value: rawData["EM_EXT"]
				},
				{
					fieldLabel: "地址",
					name: "emaddr",
					allowBlank: true,
					value: rawData["EM_ADDR"]
				},
				{
					fieldLabel: "QQ/MSN",
					name: "emim",
					allowBlank: true,
					value: rawData["EM_IM"]
				},
				{
					fieldLabel: "手机",
					name: "emmobile",
					allowBlank: true,
					value: rawData["EM_MOBILE"]
				},
				{
					fieldLabel: "座机号",
					name: "emphone",
					allowBlank: true,
					value: rawData["EM_PHONE"]
				},
				{
					fieldLabel: "出生月份",
					xtype: "combobox",
					store: Beet.constants.monthesList,
					name: "embirthmonth",
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					allowBlank: true,
					value: rawData["EM_BIRTHMONTH"]
				},
				{
					fieldLabel: "出生日期",
					xtype: "combobox",
					store: Beet.constants.daysList,
					name: "embirthday",
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					allowBlank: true,
					value: rawData["EM_BIRTHDAY"]
				},
				{
					fieldLabel: "入职日期",
					xtype: "datefield",
					name: "emindate",
					allowBlank: false,
					format: "Y/m/d",
					value: new Date(rawData["EM_INDATE"] * 1000)
				},
				{
					fieldLabel: "备注",
					allowBlank: true,
					value: rawData["EM_DESCRIPT"]
				},
				{
					xtype: "button",
					id : "move-next",
					scale: "large",
					text: "修改",
					handler: function(){
						var that = this, form = that.up("form").getForm(), result = form.getValues(), employeeServer = Beet.constants.employeeServer;
						result["emindate"] = (+new Date(result["emindate"])) / 1000;
						if (result["name"] == "" && result["name"].length == 0){
							delete result["name"];
						}
						if (result["password"] == "" && result["password"].length == 0){
							delete result["password"];
						}else{
							result["password"] = xxtea_encrypt(result["password"]);
						}

						var needSumbitData;
						//if (form.isValid()){
							needSumbitData = Ext.JSON.encode(result);
							employeeServer.UpdateEmployee(guid, needSumbitData, {
								success: function(isSuccess){
									if (isSuccess){
										Ext.MessageBox.show({
											title: "更新成功!",
											msg: "更新成功!",
											buttons: Ext.MessageBox.OK,
											fn: function(btn){
												me.storeProxy.loadPage(me.storeProxy.currentPage);
												me.editorWin.close();
											}
										})
									}
								},
								failure: function(error){
									Ext.Error.raise(error);
								}
							})
						//}
					}
				}
				
			]
		}
		return config;
	},
	popEditWindow: function(rawData, guid){
		var me = this, EmName = rawData.EM_NAME, employeeServer = Beet.constants.employeeServer, win;
		
		me.editorWin = win = Ext.widget("window", {
			title: EmName + " 的资料信息",
			width: 650,
			height: 600,
			minHeight: 400,
			autoHeight: true,
			autoScroll: true,
			layout: "fit",
			resizable: true,
			border: false,
			modal: true,
			maximizable: true,
			border: 0,
			bodyBorder: false,
			items: [
				Ext.create("Ext.form.Panel", me.getBaseInfoPanelConfig(rawData, guid))
			],
			buttons: [
				{
					text: "关闭",
					handler:function(){
						win.close();
					}
				}
			]
		})
		win.show();
	},
	deleteEmployeeFn: function(parentMenu){
		var me = this, rawData = parentMenu.rawData || parentMenu.raw, guid = rawData.EM_UserID , EmName= rawData.EM_NAME, employeeServer = Beet.constants.employeeServer;
		if (guid){
			Ext.MessageBox.show({
				title: "删除员工",
				msg: "是否要删除 " + EmName + " ?",
				buttons: Ext.MessageBox.YESNO,
				fn: function(btn){
					if (btn == "yes"){
						employeeServer.DelEmployee(guid, {
							success: function(){
								Ext.MessageBox.show({
									title: "删除成功",
									msg: "删除员工: " + EmName + " 成功",
									buttons: Ext.MessageBox.OK,
									fn: function(){
										me.storeProxy.loadPage(me.storeProxy.currentPage);
									}
								})
							},
							failure: function(error){
								Ext.Error.raise("删除员工失败");
							}
						})
					}
				}
			});
		}else{
			Ext.Error.raise("删除用户失败");
		}
	}
});

//////////////////////// employee setting ////////////////
Ext.namespace("Beet.apps.EmployeeSettingViewPort");
Ext.define("Beet.apps.EmployeeSettingViewPort.Store", {
	extend: "Ext.data.TreeStore",
	autoLoad: true,
	root: {
		text: "部门",
		id: "src",
		expanded: true	
	},
	proxy: {
		type: "b_proxy",
		b_method: Beet.constants.employeeServer.GetDepartmentData,
		b_params: {
			filter: "",
			b_onlySchema: false
		},
		b_scope: Beet.constants.employeeServer,
		preProcessData: function(data){
			var metaData = data["MetaData"], data = data["Data"], bucket = [];
			if (Beet.cache.employee == undefined){
				Beet.cache.employee = {}
			}
			Beet.cache.employee.department = metaData;

			for (var c in data){
				var item = data[c];
				bucket.push({
					leaf: true,
					name: "depid_" + item["MD_DEPID"],
					text: item["MD_DEPNAME"],
					_id: item["MD_DEPID"]
				})
			}
			return bucket;
		},
		reader: {
			type: "json"
		}
	}
})

Ext.define("Beet.apps.EmployeeSettingViewPort.Viewport", {
	extend: "Ext.panel.Panel",
	layout: {
		type: "hbox",
		align: "stretch"
	},
	shadow: true,
	frame: true,
	defaults: {
		border: 0
	},
	rootVisible: false,
	initComponent: function(){
		var me = this, employeeServer = Beet.constants.employeeServer;
		Ext.apply(this, {
			storeProxy: Ext.create("Beet.apps.EmployeeSettingViewPort.Store")
		})

		me.items = [
			me.createTreeList(),
			{
				xtype: 'splitter'   // A splitter between the two child items
			},
			me.createDetailPanel()		
		]
		me.callParent(arguments);	
	},
	afterRender: function(){
		var me = this;
		me.callParent(arguments);
	},
	refreshTreeList: function(callback){
		var me = this;
		me.storeProxy.load();
	},
	createTreeList: function(){
		var me = this, store = me.storeProxy, employeeServer = Beet.constants.employeeServer;
		
		me.treeList = Ext.create("Ext.tree.Panel", {
			frame: true,
			store: store,
			lookMask: true,
			width: 230,
			height: "100%",
			border: 0,
			useArrow: true,
			split: true,
		});


		var _addDepartment = function(widget, e){
			var parentMenu = widget.parentMenu, rawData = parentMenu.raw, formItems = [];
			
			if (Beet.cache.employee.department){
				var item;
				for (var d =0; d < Beet.cache.employee.department.length; ++d){
					var c = Beet.cache.employee.department[d];
					if (!c["FieldHidden"] && c["FieldName"] != "MD_DEPID"){
						item = {
							fieldLabel: c["FieldLabel"],
							name: c["FieldName"],
							allowBlank: false
						}

						formItems.push(item);
					}
				}
			}
				
			var form = new Ext.form.Panel({
				frame: true,
				border: 0,
				plain: true,
				layout: {
					type: "vbox"	
				},
				width: "100%",
				defaultType: "textfield",
				defaults: {
					labelAlign: "left",
					labelWidth: 90
				},
				items: formItems,
				buttons: [
					{
						text: "提交",
						formBind: true,
						disabled: true,
						handler: function(direction, e){
							var that = this, form = that.up("form").getForm(), result=form.getValues();
							if (form.isValid()){
								employeeServer.AddDepartment(result["MD_DEPNAME"], {
									success: function(uid){
										if (uid > -1){
											Ext.MessageBox.show({
												title: "添加部门成功",
												msg: "添加部门 " +	result["MD_DEPNAME"] + " 成功!",
												buttons: Ext.MessageBox.OK	
											});
											form.reset();
											me.refreshTreeList();
										}
									},
									failure: function(error){
										Ext.Error.raise(error)
									}
								});
							}
						}
					}
				]
			});
			
			var item = me.detailPanel.add({
				title: "添加部门",
				inTab: true,
				items: [
					form	
				]	
			});
		}

		var _editDepartment = function(widget, e){
			var parentMenu = widget.parentMenu, rawData = parentMenu.raw, needUpdateId = rawData._id, formItems = [];
			if (Beet.cache.employee.department){
				for (var d in Beet.cache.employee.department){
					var c = Beet.cache.employee.department[d];
					if (!c["FieldHidden"] && c["FieldName"] != "MD_DEPID"){
						item = {
							value: rawData["text"],
							fieldLabel: c["FieldLabel"],
							name: c["FieldName"],
							allowBlank: false
						}
						formItems.push(item);
					}
				}
			}

			var form = new Ext.form.Panel({
				frame: true,
				border: 0,
				plain: true,
				layout: {
					type: "vbox",
					align: "stretch"
				},
				width: "100%",
				defaultType: "textfield",
				defaults: {
					labelWidth: 90,
					labelAlign: "left"
				},
				items: formItems,
				buttons: [
					{
						text: "提交修改",
						formBind: true,
						disabled: true,
						handler: function(direction, e){
							var that = this, form = that.up("form").getForm(), result = form.getValues();
							Ext.MessageBox.show({
								title: "提示",
								msg: "是否需要提交修改?",
								buttons: Ext.MessageBox.YESNO,
								fn: function(btn){
									if (btn == "yes"){
										employeeServer.UpdateDepartment(result["MD_DEPNAME"], needUpdateId, {
											success: function(isSuccess){
												if (isSuccess){
													Ext.MessageBox.alert("提示", "修改成功");	
												}else{
													Ext.MessageBox.alert("提示", "修改失败");
												}
												me.refreshTreeList();
											},
											failure: function(error){
												Ext.Error.raise(error);
											}
										});	
									}
								}	
							});	
						}
					}
				]
			});
			var item = me.detailPanel.add({
				title: "编辑部门: " + rawData.text,
				inTab: true,
				items: [
					form
				]	
			});
		}

		var _deleteDeparment = function(widget, e){
			var parentMenu = widget.parentMenu, rawData = parentMenu.raw;
			var needDeletedId = rawData._id;
			Ext.MessageBox.show({
				title: '警告',
				msg: "是否需要删除 " + rawData["text"],
				buttons: Ext.MessageBox.YESNO,
				fn: function(btn){
					if (btn == "yes"){
						employeeServer.DelDepartment(needDeletedId, {
							success: function(isSuccess){
								Ext.MessageBox.show({
									title: "删除成功",
									msg: "删除部门: " + rawData["text"] + " 成功",
									buttons: Ext.MessageBox.OK,
									fn: function(btn){
										me.refreshTreeList();
									}
								});
							},
							failure: function(error){
								Ext.Error.raise(error);
							}
						})
					}
				}
			});
		}

		var _itemRClick = function(view, record, item, index, e, options){
			var rawData = record.raw, leaf = record.isLeaf();
			if (!record.contextMenu){
				record.contextMenu = Ext.create("Ext.menu.Menu", {
					plain: true,
					items:[
						{
							text: "添加部门", handler: 
							function(direction, e){
								_addDepartment(direction, e);
							}
						},
						{
							text: "编辑部门", handler: function(direction, e){
								_editDepartment(direction, e)
						}},
						{
							text: "删除部门", handler: function(direction, e){
								_deleteDeparment(direction, e)
							}
						}
					],
					raw: rawData,
					leaf: leaf	
				})
			}

			e.stopEvent();
			record.contextMenu.showAt(e.getXY());

			return false;
		}
		
		me.treeList.on({
			"beforeitemcontextmenu" : _itemRClick
		})
		

		return me.treeList	
	},
	createDetailPanel: function(){
		var me = this;
		me.detailPanel = Ext.create("Ext.tab.Panel",{
			width: Beet.constants.WORKSPACE_WIDTH - 245,
			height: "100%",
			layout: "card",
			frame: true,
			border: 0,
			defaults: {
				frame: true,
				border: 0,
				layout: "card",
				closable: true
			},
			items: [
			]
		});

		return me.detailPanel
	}
});





//////////////////////// shop setting ////////////////
Ext.namespace("Beet.apps.ShopSettingViewPort");
Ext.define("Beet.apps.ShopSettingViewPort.Store", {
	extend: "Ext.data.TreeStore",
	autoLoad: true,
	root: {
		text: "分店",
		id: "src",
		expanded: true	
	},
	proxy: {
		type: "b_proxy",
		b_method: Beet.constants.employeeServer.GetStoreData,
		b_params: {
			filter: "",
			b_onlySchema: false
		},
		b_scope: Beet.constants.employeeServer,
		preProcessData: function(data){
			var metaData = data["MetaData"], data = data["Data"], bucket = [];
			if (Beet.cache.employee == undefined){
				Beet.cache.employee = {}
			}
			Beet.cache.employee.subbranch = metaData;
			for (var c in data){
				var item = data[c];
				bucket.push({
					leaf: true,
					name: "depid_" + item["MD_StoreID"],
					text: item["MD_StoreName"],
					_id: item["MD_StoreID"]
				})
			}
			return bucket; 
		},
		reader: {
			type: "json"
		}
	}
})

Ext.define("Beet.apps.ShopSettingViewPort.Viewport", {
	extend: "Ext.panel.Panel",
	layout: {
		type: "hbox",
		align: "stretch"
	},
	shadow: true,
	frame: true,
	defaults: {
		border: 0
	},
	rootVisible: false,
	initComponent: function(){
		var me = this, employeeServer = Beet.constants.employeeServer;
		Ext.apply(this, {
			storeProxy: Ext.create("Beet.apps.ShopSettingViewPort.Store")
		})

		me.items = [
			me.createTreeList(),
			{
				xtype: 'splitter'   // A splitter between the two child items
			},
			me.createDetailPanel()		
		]
		me.callParent(arguments);	
	},
	afterRender: function(){
		var me = this;
		me.callParent(arguments);
	},
	refreshTreeList: function(callback){
		var me = this;
		me.storeProxy.load();

		getDepartmentList();
		getSubbrachesList();
	},
	createTreeList: function(){
		var me = this, store = me.storeProxy, employeeServer = Beet.constants.employeeServer;
		
		me.treeList = Ext.create("Ext.tree.Panel", {
			frame: true,
			store: store,
			lookMask: true,
			width: 230,
			height: "100%",
			border: 0,
			useArrow: true,
			split: true,
		});


		var _addBranch = function(widget, e){
			var parentMenu = widget.parentMenu, rawData = parentMenu.raw, formItems = [];
			
			if (Beet.cache.employee.subbranch){
				var item;
				for (var d =0; d < Beet.cache.employee.subbranch.length; ++d){
					var c = Beet.cache.employee.subbranch[d];
					if (!c["FieldHidden"] && c["FieldName"] != "MD_StoreID"){
						item = {
							fieldLabel: c["FieldLabel"],
							name: c["FieldName"],
							allowBlank: false
						}

						formItems.push(item);
					}
				}
			}
				
			var form = new Ext.form.Panel({
				frame: true,
				border: 0,
				plain: true,
				layout: {
					type: "vbox"	
				},
				width: "100%",
				defaultType: "textfield",
				defaults: {
					labelAlign: "left",
					labelWidth: 90
				},
				items: formItems,
				buttons: [
					{
						text: "提交",
						formBind: true,
						disabled: true,
						handler: function(direction, e){
							var that = this, form = that.up("form").getForm(), result=form.getValues();
							if (form.isValid()){
								employeeServer.AddStore(result["MD_StoreName"], {
									success: function(uid){
										if (uid > -1){
											Ext.MessageBox.show({
												title: "添加分店成功",
												msg: "添加分店 " +	result["MD_StoreName"] + " 成功!",
												buttons: Ext.MessageBox.OK	
											});
											form.reset();
											me.refreshTreeList();
										}
									},
									failure: function(error){
										Ext.Error.raise(error)
									}
								});
							}
						}
					}
				]
			});
			
			var item = me.detailPanel.add({
				title: "添加分店",
				inTab: true,
				items: [
					form	
				]	
			});
		}

		var _editBranch = function(widget, e){
			var parentMenu = widget.parentMenu, rawData = parentMenu.raw, needUpdateId = rawData._id, formItems = [];
			if (Beet.cache.employee.subbranch){
				for (var d in Beet.cache.employee.subbranch){
					var c = Beet.cache.employee.subbranch[d];
					if (!c["FieldHidden"] && c["FieldName"] != "MD_StoreID"){
						item = {
							value: rawData["text"],
							fieldLabel: c["FieldLabel"],
							name: c["FieldName"],
							allowBlank: false
						}
						formItems.push(item);
					}
				}
			}

			var form = new Ext.form.Panel({
				frame: true,
				border: 0,
				plain: true,
				layout: {
					type: "vbox",
					align: "stretch"
				},
				width: "100%",
				defaultType: "textfield",
				defaults: {
					labelWidth: 90,
					labelAlign: "left"
				},
				items: formItems,
				buttons: [
					{
						text: "提交修改",
						formBind: true,
						disabled: true,
						handler: function(direction, e){
							var that = this, form = that.up("form").getForm(), result = form.getValues();
							Ext.MessageBox.show({
								title: "提示",
								msg: "是否需要提交修改?",
								buttons: Ext.MessageBox.YESNO,
								fn: function(btn){
									if (btn == "yes"){
										employeeServer.UpdateStore(result["MD_StoreName"], needUpdateId, {
											success: function(isSuccess){
												if (isSuccess){
													Ext.MessageBox.alert("提示", "修改成功");	
												}else{
													Ext.MessageBox.alert("提示", "修改失败");
												}
												me.refreshTreeList();
											},
											failure: function(error){
												Ext.Error.raise(error);
											}
										});	
									}
								}	
							});	
						}
					}
				]
			});
			var item = me.detailPanel.add({
				title: "编辑分店: " + rawData.text,
				inTab: true,
				items: [
					form
				]	
			});
		}

		var _deleteBranch = function(widget, e){
			var parentMenu = widget.parentMenu, rawData = parentMenu.raw;
			var needDeletedId = rawData._id;
			Ext.MessageBox.show({
				title: '警告',
				msg: "是否需要删除 " + rawData["text"],
				buttons: Ext.MessageBox.YESNO,
				fn: function(btn){
					if (btn == "yes"){
						employeeServer.DelStore(needDeletedId, {
							success: function(isSuccess){
								Ext.MessageBox.show({
									title: "删除成功",
									msg: "删除分店: " + rawData["text"] + " 成功",
									buttons: Ext.MessageBox.OK,
									fn: function(btn){
										me.refreshTreeList();
									}
								});
							},
							failure: function(error){
								Ext.Error.raise(error);
							}
						})
					}
				}
			});
		}

		var _itemRClick = function(view, record, item, index, e, options){
			var rawData = record.raw, leaf = record.isLeaf();
			if (!record.contextMenu){
				record.contextMenu = Ext.create("Ext.menu.Menu", {
					plain: true,
					items:[
						{
							text: "添加分店", handler: 
							function(direction, e){
								_addBranch(direction, e);
							}
						},
						{
							text: "编辑分店", handler: function(direction, e){
								_editBranch(direction, e)
						}},
						{
							text: "删除分店", handler: function(direction, e){
								_deleteBranch(direction, e)
							}
						}
					],
					raw: rawData,
					leaf: leaf	
				})
			}

			e.stopEvent();
			record.contextMenu.showAt(e.getXY());

			return false;
		}
		
		me.treeList.on({
			"beforeitemcontextmenu" : _itemRClick
		})
		

		return me.treeList	
	},
	createDetailPanel: function(){
		var me = this;
		me.detailPanel = Ext.create("Ext.tab.Panel",{
			minWidth: Beet.constants.WORKSPACE_WIDTH - 245,
			height: "100%",
			layout: "card",
			frame: true,
			border: 0,
			defaults: {
				frame: true,
				border: 0,
				layout: "card",
				closable: true
			},
			items: [
			]
		});

		return me.detailPanel
	}
});

