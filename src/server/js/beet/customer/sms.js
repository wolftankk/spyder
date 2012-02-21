Ext.define("Beet.apps.Viewport.SendMessages", {
	extend: "Ext.panel.Panel",
	layout: "anchor",
	height: Beet.constants.VIEWPORT_HEIGHT - 5, 
	width: "100%",
	defaults:{
		border: 0
	},
	border: 0,
	suspendLayout: true,
	initComponent: function(){
		var me = this;
		me.items = [
			me.createMainWindow()
		]
		me.callParent(arguments);
	},
	createMainWindow: function(){
		var me = this, msgBox = me.msgBox;
		msgBox = Ext.create("Ext.form.Panel", {
			frame: true,
			bodyPadding: 10,
			layout: "anchor",
			height: "100%",
			autoHeight: true,
			autoScroll: true,
			fieldDefaults: {
				msgTarget: "side",
				allowBlank: false,
				labelAlign: "left",
				labelWidth: 75
			},
			defaultType: "textfield",
			items: [
				{
					fieldLabel: "手机号码",
					xtype: "trigger",
					width: 400,
					name: "mobiles",
					id: "mobileNumberFrame",
					onTriggerClick: function(){
						//这里需要一个高级查询
						win = Ext.create("Beet.plugins.selectCustomerWindow", {
							_callback: Ext.bind(me.processSelectedData, me),
							_selectedData: me.selectedData
						});
						win.show();
					}
				},
				{
					fieldLabel: "短信内容",
					xtype: "textarea",
					name: "message",
					width: 400,
					height: 100
				},
				{
					xtype: "button",
					name: "send",
					text: "发送",
					handler: function(direction, e){
						var that = this, form = that.up("form").getForm(), result = form.getValues(),needSubmitData, customerServer = Beet.constants.customerServer;
						if (form.isValid()){
							needSubmitData = Ext.JSON.encode(result);
							Ext.MessageBox.show({
								title: "发送短消息",
								buttons: Ext.MessageBox.YESNO,
								msg: result["message"],
								fn: function(btn){
									if (btn == "yes"){
										if (me.mobileNumberList && me.mobileNumberList.length > 0){
											result["mobiles"] = me.mobileNumberList;
											needSubmitData = Ext.JSON.encode(result);
											customerServer.SendSMS(needSubmitData, {
												success: function(data){
													if (data.indexOf("-") > 0){
														Ext.Error.raise("发送失败, 返回值为: " + data);
													}
												},
												failure: function(error){
													Ext.Error.raise(error);
												}
											});
											me.mobileNumberList = {};
										}else{
											customerServer.SendSMS(needSubmitData, {
												success: function(data){
													if (data.indexOf("-") == -1){
														Ext.Error.raise("发送失败, 返回值为: " + data);
													}
												},
												failure: function(error){
													Ext.Error.raise(error);
												}
											})
										}
									}
								}
							});
						}
					}
				}
			]
		});
			
		me.msgBox = msgBox;
		return msgBox
	},
	processSelectedData: function(data){
		var me = this, mobileNameList = [], mobileNumberList = [];
		me.selectedData = data;

		for (var c = 0; c < data.length; ++c){
			var customer = data[c], customerData = customer["data"];
			if (customerData["CTMobile"] && customerData["CTMobile"].length == 11){
				var mobileNumber = customerData["CTMobile"], mobileName = customerData["CTName"];
				mobileNameList.push(mobileName);
				mobileNumberList.push(mobileNumber);
			}
		}
		me.mobileNumberList = mobileNumberList;
		var typeFrame = Ext.getCmp("mobileNumberFrame");
		typeFrame.setValue(mobileNameList.join(", "));
	}
});

Ext.define("Beet.apps.Viewport.SMSHistory", {
	extend: "Ext.panel.Panel",
	layout: "anchor",
	height: "100%",
	width: "100%",
	autoHeight: true,
	autoScroll: true,
	border: 0,
	initComponent: function(){
		var me = this;

		
	}
});
