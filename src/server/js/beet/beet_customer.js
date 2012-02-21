//register menu
registerBeetAppsMenu("customer", 
{
	title: "会员管理",
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
					title: '会员管理',
					layout: "anchor",
					frame: true,
					width: 400,
					defaults: {
						scale: "large",
						rowspan: 3
					},
					items: [
						{
							xtype: "button",
							text: "增加会员",
							id: "customer_addBtn",
							tooltip: "点击打开新增会员界面",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["addCustomer"];
								if (!item){
									Beet.apps.Viewport.getCustomerTypes(
										function(){
											Beet.workspace.addPanel("addCustomer", "添加会员", {
												items: [
													Ext.create("Beet.apps.Viewport.AddUser")
												]
											});
											Beet.apps.Viewport.getCTTypeData();
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							xtype: "button",
							text: "编辑会员",
							id: "customer_editBtn",
							tooltip: "编辑会员个人资料或者删除会员.",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["editCustomer"];
								var customerServer = Beet.constants.customerServer;
								if (!item){
									Beet.workspace.addPanel("editCustomer", "编辑会员", {
										items: [
											Ext.create("Beet.apps.Viewport.CustomerList")
										]	
									});
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							xtype: "button",
							text: "高级搜索",
							id: "customer_searchBtn",
							tooltip: "高级搜索",
							handler: function(){
								var win = Ext.create("Beet.apps.CustomerAdvanceSearch", {});
								Beet.cache.AdvanceSearchWin = win;
								win.show();
							}
						},
						{
							xtype: "button",
							text: "会员卡编辑",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["addCustomerCard"]
								if (!item){
									Beet.workspace.addPanel("addCustomerCard", "会员卡编辑", {
										items: [
											Ext.create("Beet.apps.AddCustomerCard")
										]
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							xtype: "button",
							text: "下单",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["createOrder"];
								if (!item){
									Beet.workspace.addPanel("createOrder", "下单", {
										items: [
											Ext.create("Beet.apps.CreateOrder")
										]	
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							xtype: "button",
							text: "结算",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["endConsumer"];
								if (!item){
									Beet.workspace.addPanel("endConsumer", "结算", {
										items: [
											Ext.create("Beet.apps.EndConsumer")
										]	
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						}
					]
				},
				{
					xtype: "buttongroup",
					title: "客户联系",
					layout: "anchor",
					defaults: {
						scale: "large",
						rowspan: 3
					},
					items: [ 
						{
							xtype: "button",
							text: "发送短信",
							id: "customer_sendmsg",
							tooltip: "点击打开发送短信界面, 向客户发送短信",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["sendMessages"];
								if (!item){
									Beet.workspace.addPanel("sendMessages", "发送短信", {
										items: [
											Ext.create("Beet.apps.Viewport.SendMessages")
										]
									});
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							xtype: "button",
							text: "历史查询",
							id: "customer_smshistory",
							tooltip: "点击查询短信发送历史记录",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["smsHistory"];
								if (!item){
									Beet.workspace.addPanel("smsHistory", "短信历史记录", {
										items: [
											Ext.create("Beet.apps.Viewport.SMSHistory")
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
					title: "活动管理",
					layout: "anchor",
					defaults: {
						scale: 'large',
						rowspan: 3
					},
					items: [
						{
							xtype: "button",
							text: "新增活动",
							id: "customer_activity",
							tooltip: "点击添加活动",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["vipActivity"];
								if (!item){
									Beet.workspace.addPanel("vipActivity", "新增活动", {
										items: [
											Ext.create("Beet.apps.Viewport.VIPActivity")
										]
									});
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							xtype: "button",
							text: "活动列表",
							tooltip: "查看,编辑已有的活动",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["activityList"];
								if (!item){
									Beet.workspace.addPanel("activityList", "活动列表", {
										items: [
											Ext.create("Beet.apps.Viewport.ActivityList")
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


function time(){
	return +(new Date());
}

Ext.onReady(function(){
	Ext.require([
		'customer.acticity',
		"customer.adduser",
		"customer.card",
		"customer.customerlist",
		"customer.order",
		"customer.sms"
	]);
});
