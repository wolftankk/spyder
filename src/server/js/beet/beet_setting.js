registerBeetAppsMenu("configure", 
{
	title: "设置",
	items: [
		{
			xtype: "container",
			layout: "hbox",
			defaultType: "buttongroup",
			defaults: {
				height: 100,
				width: 250,
				autoWidth: true
			},
			items: [
				{
					title: '客户管理',
					layout: "anchor",
					width: 100,
					defaults: {
						scale: "large",
						rowspan: 1
					},
					items: [
						{
							text: "会员属性",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["customerAttr"];
								if (!item){
									Beet.workspace.addPanel("customerAttr", "会员属性", {
										items: [
											Ext.create("Beet.apps.Viewport.SettingViewPort")
										]
									});	
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						}
					]
				},
				{
					title: "员工管理",
					layout: "anchor",
					defaults: {
						scale: "large",
						rowspan: 3
					},
					width: 160,
					items: [
						{
							text: "部门设定",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["employeeAttr"];
								if (!item){
									Beet.workspace.addPanel("employeeAttr", "部门设定", {
										items: [
											Ext.create("Beet.apps.EmployeeSettingViewPort.Viewport")
										]
									});
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							text: "分店设定",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["subbranch"];
								if (!item){
									Beet.workspace.addPanel("subbranch", "分店设定", {
										items: [
											Ext.create("Beet.apps.ShopSettingViewPort.Viewport")
										]
									});
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						}
					]
				},
				{
					title: "产品管理",
					width: 420,
					columns: 6,
					defaults: {
						scale : "large"
					},
					autoWidth: true,
					items: [
						{
							text: "产品设置",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["productsList"];
								if (!item){
									Beet.workspace.addPanel("productsList", "产品设置", {
										items: [
										Ext.create("Beet.apps.ProductsViewPort.UpdateProducts")
										]
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						/*
						{
							text: "增加费用",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["addCharge"]
								if (!item){
									Beet.workspace.addPanel("addCharge", "增加费用", {
										items: [
											Ext.create("Beet.apps.ProductsViewPort.AddCharge")
										]
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},*/
						{
							text: "费用设置",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["chargeList"];
								if (!item){
									Beet.workspace.addPanel("chargeList", "费用设置", {
										items: [
											Ext.create("Beet.apps.ProductsViewPort.UpdateCharge")
										]
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							text: "项目设置",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["itemList"]
								if (!item){
									Beet.workspace.addPanel("itemList", "项目设置", {
										items: [
											Ext.create("Beet.apps.ProductsViewPort.ItemList")
										]
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						/*
						{
							text: "增加套餐",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["addPackage"]
								if (!item){
									Beet.workspace.addPanel("addPackage", "增加套餐", {
										items: [
											Ext.create("Beet.apps.ProductsViewPort.AddPackage")
										]
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						*/
						{
							text: "套餐设置",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["packageList"]
								if (!item){
									Beet.workspace.addPanel("packageList", "套餐设置", {
										items: [
											Ext.create("Beet.apps.ProductsViewPort.PackageList")
										]
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
					]
				}
			]
		}
	]
});


Ext.namespace("Beet.apps.Viewport.Setting");
Ext.define("Beet.apps.Viewport.Setting.Store", {
	extend: "Ext.data.TreeStore",
	autoLoad: true,
	root: {
		text: "客户总分类",
		id: "src",
		expanded: true
	},
	proxy: {
		type: "b_proxy",
		b_method: Beet.constants.customerServer.GetCTTypeDataToJSON,
		b_params: {
			awhere: "",
			WhereInCategory: false,
		},
		preProcessData: function(data){
			data = data["category"];
			var bucket = [];

			var processData = function(target, cache, leaf){
				for (var k in target){
					var _tmp = target[k];
					var _item = {
						text: _tmp["label"],
						_id: _tmp["id"],
						_pid: _tmp["pid"]
					}
					if (leaf){
						_item["leaf"] = true;
						_item["name"] = "item_" + _tmp["id"];
						_item["inputmode"] = _tmp["inputmode"];
					}else{
						_item["serviceid"] = _tmp["serviceid"];
						_item["expanded"] = false;
						_item["name"] = "category_" + _tmp["id"];
						_item["children"] = [];
					}

					if (_tmp["category"] && _tmp["category"].length > 0){
						processData(_tmp["category"], _item["children"]);
					}
					if (_tmp["item"] && _tmp["item"].length > 0){
						processData(_tmp["item"], _item["children"], true);
					}
					cache.push(_item);
				}
			}
			processData(data, bucket);

			return bucket;
		},
		b_scope: Beet.constants.customerServer,
		reader: {
			type: "json",
		}
	},
});

Ext.define("Beet.apps.Viewport.SettingViewPort", {
	extend: "Ext.panel.Panel",
	layout: {
		type: "hbox",
		align: "stretch",
	},
	shadow: true,
	cls: "iScroll",
	frame: true,
	defaults: {
		border: 0
	},
	rootVisible: false,
	initComponent: function(){
		var that = this, customerServer = Beet.constants.customerServer;
		Ext.apply(this, {
			storeProxy: Ext.create("Beet.apps.Viewport.Setting.Store")
		});
		
		that.items = [
			that.createTreeList(),
			{
				xtype: 'splitter'   // A splitter between the two child items
			},
			that.createDetailPanel()
		];
		that.callParent(arguments);
	},
	afterRender: function(){
		var that = this;
		that.callParent(arguments);
	},
	
	refreshTreeList: function(callback){
		var that = this;
		that.storeProxy.load();
		//update
		Beet.apps.Viewport.getCTTypeData(callback, true);
	},
	createTreeList: function(){
		var that = this, store = that.storeProxy, customerServer = Beet.constants.customerServer;
		that.treeList = Ext.create("Ext.tree.Panel", {
			store: store,
			frame: true,
			lookMask: true,
			width: 230,
			height: "100%",
			border: 0,
			useArrow: true,
			split: true,
			dockedItems: [
				{
					ptype: "tooltip",
					frame: true,
					items: [
						{
							html: "右键打开功能菜单, 进行编辑删除",
							frame: true,
						}
					],
				}
			]
		});

		//serviceType comboBox
		var st = Ext.create("Ext.data.Store", {
			fields: ["attr", "name"],
			data: [
				{"attr" : "{AFF7BC81-ACA3-4E46-B5B1-87A90F45FE8D}", "name" : "基础信息"},
				{"attr" : "{C3DCAA88-D92F-435F-96B2-50BDC665F407}", "name" : "美容"},
				{ "attr" : "{BC6B8E96-51A4-40EB-9896-2BC26E97FAE4}", "name" : "美发"},
				{ "attr" : "{8CB1DD70-0669-4421-B9BF-EB20015FB03D}", "name" : "瑜伽"},
				{ "attr" : "{BA33BC91-FE7F-44A0-8C9D-D53147992B0E}", "name" : "美甲"}
			]
		});

		var inputmodeStore = Ext.create("Ext.data.Store", {
			fields: ["attr", "name"],
			data: [
				{ attr: 0, name : "文本"},
				{ attr: 1, name : "单选"},
				{ attr: 2, name: "多选"}
			]	
		})

		var updateCategoryData = function(){
			var customerServer = Beet.constants.customerServer;
			var __preProcessData = function(data, _id){
				var t = 0, __temp={};
				while(true){
					if (data[t] == undefined){ break;}
					var id = data[t][_id];
					__temp[id] = data[t];
					t++;
				}
				return __temp;
			}

			Beet.cache.configArgs = Beet.cache.configArgs || {};
			customerServer.GetCTCategoryDataTOJSON("", false, {
				success: function(data){
					data = Ext.JSON.decode(data);
					var _data = data["Data"], metaData = data["MetaData"];

					Beet.cache.configArgs["customer_category"] = metaData;
					Beet.cache.categoriesData = __preProcessData(_data, "CTCategoryID");
				},
				failure:function(error){
					Ext.Error.raise(error);
				}
			})

			customerServer.GetCTItemDataToJSON("", true, {
				success: function(data){
					data = Ext.JSON.decode(data);
					var metaData = data["MetaData"];
					Beet.cache.configArgs["customer_item"] = metaData;
				},
				failure: function(error){
					Ext.Error.raise(error);
				}
			});
		}

		updateCategoryData();

		var _addItem = function(widget, e, _type){
			var parentMenu = widget.parentMenu, rawData = parentMenu.raw, leaf = (_type == "category" ? false : true), method;
			method = leaf ? customerServer.UpdateCTItem : customerServer.UpdateCTCategory;
			var formItems = [], actionName = leaf ? "customer_item" : "customer_category";
			var btnHandler;
			var categoryStore = (function(){
				var _data = [];
				if (!leaf){
					_data.push({ "attr" : -1, "name" : "客户总分类"});
				}
				if (Beet.cache.categoriesData){
					for (var k in Beet.cache.categoriesData){
						var _d = Beet.cache.categoriesData[k];
						_data.push({ attr : _d.CTCategoryID, name: _d.CTCategoryName });
					}
				}

				return Ext.create("Ext.data.Store", {
					fields: ["attr", "name"],
					data : _data
				});
			})();
			//项目
			if (leaf){
				for (var k in Beet.cache.configArgs[actionName]){
					var row = Beet.cache.configArgs[actionName][k],
						hidden = row.FieldHidden, label = row.FieldLabel, name = row.FieldName,
						item = {
							fieldLabel : label,
							name : name
						}
					if (name == "CTTypeID"){
						hidden = true;
					}

					if (!hidden){
						switch (name){
							case "CTTypeName":
								break;
							case "CTCategoryID":
								item = Ext.create("Ext.form.ComboBox", {
									fieldLabel: label,
									store: categoryStore,
									name: name,
									queryMode: "local",
									displayField: "name",
									valueField: "attr"	
								});
								break;
							case "InputMode":
								item = Ext.create("Ext.form.ComboBox", {
									fieldLabel: label,
									store: inputmodeStore,
									name: name,
									allowBlank: false,
									queryMode: "local",
									displayField: "name",
									valueField: "attr"	
								});
								break;	
						}

						formItems.push(item);
					}
				}
				btnHandler = function(direction, e){
					var me = this, form = me.up("form").getForm(), result = form.getValues();

					var needSubmitData = Ext.JSON.encode(result);

					customerServer.AddCTItem(needSubmitData, {
						success: function(uid){
							if (uid > -1){
								Ext.MessageBox.show({
									title: "添加项目成功",
									msg : "添加项目" + result["CTTypeName"] + "成功",
									buttons: Ext.MessageBox.OK	
								});
								form.reset();
								that.refreshTreeList();
							}else{
								Ext.MessageBox.alert("添加失败", "添加项目失败");
							}
						},
						failure: function(error){
							Ext.Error.railse(error);
						}
					})
				}
			}else{
				for (var k in Beet.cache.configArgs[actionName]){
					var row = Beet.cache.configArgs[actionName][k]
						hidden = row.FieldHidden, label = row.FieldLabel, name = row.FieldName,
						item = {
							fieldLabel : label,
							name : name
						}

					if (name == "CTCategoryID"){
						hidden = true;
					}

					if (!hidden){
						switch (name){
							case "CTCategoryName":
								break;
							case "ParentCategoryID":
								item = Ext.create("Ext.form.ComboBox", {
									fieldLabel: label,
									store: categoryStore,
									name: name,
									queryMode: "local",
									displayField: "name",
									valueField: "attr"	
								});
								break;
							case "CustomerType":
								//重置item
								item = Ext.create("Ext.form.ComboBox", {
									fieldLabel: label,
									store: st,
									name: "CustomerType",
									queryMode: "local",
									displayField: "name",
									valueField: "attr",
									value: ((rawData && rawData["serviceid"]) ? rawData["serviceid"] : "")
								});
								break;
						}

						formItems.push(item)
					}
				}
				btnHandler = function(direction, e){
					var me = this, form = me.up("form").getForm(), result = form.getValues();
					if (result["ParentCategoryID"] == ""){
						result["ParentCategoryID"] = -1;
					}
					var needSubmitData = Ext.JSON.encode(result);

					customerServer.AddCTCategory(needSubmitData, {
						success: function(uid){
							if (uid > -1){
								Ext.MessageBox.show({
									title: "添加属性成功",
									msg : "添加属性" + result["CTCategoryName"] + "成功",
									buttons: Ext.MessageBox.OK	
								});
								form.reset();
								that.refreshTreeList(updateCategoryData);
							}else{
								Ext.MessageBox.alert("添加失败", "添加属性失败");
							}
						},
						failure: function(error){
							Ext.Error.raise(error);
						}
					})
				}
			}

			//开始弹出面板
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
						handler: btnHandler
					}
				]
			})

			//appendTo detailPanel
			var item = that.detailPanel.add({
				title : "添加" + (leaf ? "项目 " : "分类 "),
				inTab: true,
				items: [
					form
				]
			})

			that.detailPanel.setActiveTab(item)
		}
		

		//编辑 分类/项目
		///{{
		var _editItem = function(widget, e){
			var parentMenu = widget.parentMenu, rawData = parentMenu.raw, leaf = parentMenu.leaf, method,
				customerServer = Beet.constants.customerServer;
			method = leaf ? customerServer.UpdateCTItem : customerServer.UpdateCTCategory;
			//需要编辑项目/属性的ID
			var needUpdateId = rawData._id;

			var formItems = [], actionName = leaf ? "customer_item" : "customer_category";
			/*
			 * @description 点击提交按钮 触发的动作
			 */
			var btnHandler;
			var categoryStore = (function(){
				var _data = [];
				if (!leaf){
					_data.push({ "attr" : -1, "name" : "客户总分类"});
				}
				if (Beet.cache.categoriesData){
					for (var k in Beet.cache.categoriesData){
						var _d = Beet.cache.categoriesData[k];
						_data.push({ attr : parseInt(_d.CTCategoryID, 10), name: _d.CTCategoryName });
					}
				}
				
				return Ext.create("Ext.data.Store", {
					fields: ["attr", "name"],
					data : _data
				});
			})();
			
			//项目
			if (leaf){
				for (var k in Beet.cache.configArgs[actionName]){
					var row = Beet.cache.configArgs[actionName][k],
						hidden = row.FieldHidden, label = row.FieldLabel, name = row.FieldName;

					if (name == "CTTypeID"){
						hidden = true;
					}
					if (hidden){continue;}

					var item = {
						fieldLabel : label,
						name : name
					}
					switch (name){
						case "CTTypeName":
							item["value"] = rawData["text"];
							break;
						case "CTCategoryID":
							item = Ext.create("Ext.form.ComboBox", {
								fieldLabel: label,
								store: categoryStore,
								name: name,
								queryMode: "local",
								displayField: "name",
								valueField: "attr",
								value: rawData["_pid"]	
							});
							break;
						case "InputMode":
							item = Ext.create("Ext.form.ComboBox", {
								fieldLabel: label,
								store: inputmodeStore,
								name: name,
								queryMode: "local",
								displayField: "name",
								valueField: "attr",
								value: rawData["inputmode"]
							});
							break;	
					}

					formItems.push(item);
				}
				btnHandler = function(direction, e){
					var me = this, form = me.up("form").getForm(), result = form.getValues();
					var needSubmitData = Ext.JSON.encode(result);

					Ext.MessageBox.show({
						title: "提示",
						msg: "是否需要提交修改?",
						buttons: Ext.MessageBox.YESNO,
						fn: function(btn){
							if (btn == "yes"){
								customerServer.UpdateCTItem(needUpdateId, needSubmitData, {
									success: function(isSuccess){
										if (isSuccess){
											Ext.MessageBox.alert("提示", "编辑项目成功");
										}else{
											Ext.MessageBox.alert("提示", "编辑项目失败");
										}
										that.refreshTreeList(updateCategoryData);
									},
									failure: function(error){
										Ext.Error.raise(error);
									}
								});			
							}
						}
					});
				}
			}else{
				for (var k in Beet.cache.configArgs[actionName]){
					var row = Beet.cache.configArgs[actionName][k]
						hidden = row.FieldHidden, label = row.FieldLabel, name = row.FieldName;
						
					if (name == "CTCategoryID"){
						hidden = true;
					}
					
					if (!hidden){
						var item = {
							fieldLabel : label,
							name : name
						}
						switch (name){
							case "CTCategoryName":
								item["value"] = rawData["text"];
								break;
							case "ParentCategoryID":
								item = Ext.create("Ext.form.ComboBox", {
									fieldLabel: label,
									store: categoryStore,
									name: name,
									queryMode: "local",
									displayField: "name",
									valueField: "attr",
									value: rawData["_pid"]
								});
								break;
							case "CustomerType":
								item = Ext.create("Ext.form.ComboBox", {
									fieldLabel: label,
									store: st,
									name: "CustomerType",
									queryMode: "local",
									displayField: "name",
									valueField: "attr",
									value: rawData["serviceid"]
								})
								break;
						}
						formItems.push(item)
					}
				}
				btnHandler = function(direction, e){
					var me = this, form = me.up("form").getForm(), result = form.getValues();
					if (result["ParentCategoryID"] == ""){
						result["ParentCategoryID"] = -1;
					}
					var needSubmitData = Ext.JSON.encode(result);
					Ext.MessageBox.show({
						title: "提示",
						msg: "是否需要提交修改?",
						buttons: Ext.MessageBox.YESNO,
						fn: function(btn){
							if (btn == "yes"){
								customerServer.UpdateCTCategory(needUpdateId, needSubmitData, {
									success: function(isSuccess){
										if (isSuccess){
											Ext.MessageBox.alert("提示", "编辑分类成功");
										}else{
											Ext.MessageBox.alert("提示", "编辑分类失败");
										}
										that.refreshTreeList(updateCategoryData);
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

			//开始弹出面板
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
					labelAlign: "left",
					labelWidth: 90
				},
				items: formItems,
				buttons: [
					{
						text: "提交修改",
						handler: btnHandler
					}
				]
			});
			
			//appendTo detailPanel
			var item = that.detailPanel.add({
				title : "编辑" + (leaf ? "项目 " : "分类 ") + rawData.text,
				inTab: true,
				items: [
					form
				]
			});

			that.detailPanel.setActiveTab(item)
		}
		///}}

		var _delItem = function(widget, e){
			var parentMenu = widget.parentMenu, rawData = parentMenu.raw, leaf = parentMenu.leaf, method,
				customerServer = Beet.constants.customerServer;
			method = leaf ? customerServer.DeleteCTItem : customerServer.DeleteCTCategory;
			var needDeleteId = rawData._id;
			var msg = "你是否需要删除" + (leaf ? "项目" : "分类") + ": " + rawData.text + " ?";
			Ext.MessageBox.show({
				title: "警告",
				msg: msg,
				buttons: Ext.MessageBox.YESNO,
				fn: function(btn){
					if (btn == "yes"){
						method.call(customerServer, needDeleteId, {
							success: function(){
								Ext.MessageBox.show({
									title: "删除成功",
									msg: "删除" + (leaf ? "项目" : "分类") + ": " + rawData.text + "成功",
									buttons: Ext.MessageBox.OK,
									fn: function(btn){
										that.refreshTreeList(updateCategoryData);
									}
								})	
							},
							failure: function(error){
								Ext.Error.raise("删除失败" + error)
							}
						})
					}
				}
			})
		}
		
		/*
		 * @description 邮件菜单函数
		 */
		var _itemRClick = function(view, record, item, index, e, options){
			var rawData = record.raw, leaf = record.isLeaf();
			
			if (!record.contextMenu){
				var citems = [];

				if (record.isRoot()){
					citems = [{text: "添加分类", handler: function(direction, e){
							_addItem(direction, e, "category")	
						}
					}]
				}else{
					if (record.isLeaf()){
						citems = [
							{text: "编辑", handler: _editItem },
							{text: "删除", handler: _delItem }
						];
					}else{
						citems = [
							{text: "添加分类", handler: function(direction, e){
									_addItem(direction, e, "category")	
								}
							},
							{text: "添加项目", handler: function(direction, e){
									_addItem(direction, e, "type")
								}
							},
							"-",
							{text: "编辑", handler: _editItem},
							{text: "删除", handler: _delItem}
						]
					}
				}

				record.contextMenu = Ext.create("Ext.menu.Menu", {
					style: {
						overflow: 'visible',
					},
					plain: true,
					items: citems,
					raw : rawData,
					leaf: leaf
				});
			}

			e.stopEvent();
			record.contextMenu.showAt(e.getXY());

			return false;
		}

		//click event
		var _itemClick = function(view, record, item, index, e, options){

		}
				
		that.treeList.on({
			'itemclick' : _itemClick,
			"beforeitemcontextmenu" : _itemRClick
		})
		
		return that.treeList;
	},
	createDetailPanel: function(){
		var that = this, customerServer = Beet.constants.customerServer;
		that.detailPanel = Ext.create("Ext.tab.Panel", {
			minWidth: 800,
			width: Beet.constants.WORKSPACE_WIDTH - 240,
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
		return that.detailPanel;
	}
});

