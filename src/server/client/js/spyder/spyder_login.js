Ext.namespace("Spyder.apps.Login");
Ext.define("Spyder.apps.Login.LoginDialog", {
	extend : "Ext.Window", //继承
	title : "登陆",
	plain: true,
	closable: false,
	closeAction: 'hide',
	width : 300,
	height: 150,
	layout: 'fit',
	border: false,
	modal: true,
	items: {
		itemId: "LoginFormPanel",
		xtype: "LoginFormPanel"
	}
});

Ext.define("Spyder.apps.Login.LoginFormPanel", {
	extend: 'Ext.form.Panel',
	initComponent: function(){
		Ext.apply(this, {});
		this.callParent();
	},
	alias: "widget.LoginFormPanel",
	labelAlign: "left",
	buttonAlign: "center",
	bodyStyle: "padding:5px;margin:5px;",
	frame: true,
	defaults: {
		labelWidth: 50,
		xtype: "textfield",
		flex: 1
	},
	items : [
		{
			xtype : "textfield",
			name : "username",
			fieldLabel: "用户名",
			allowBlank: false,
			anchor: '90%',
			enableKeyEvents: true,
			listeners: {
				keydown: function(field, e){
					var keyCode = e.getKey();
					if (keyCode == e.ENTER){
						this.nextSibling().focus();
					}
				}
			}
		},
		{
			xtype: "textfield",
			name: "password",
			inputType: "password",
			fieldLabel: "密码",
			allowBlank: false,
			anchor: '90%',
			enableKeyEvents: true,
			listeners: {
				keydown: function(field, e){
					if (e.getKey() == e.ENTER){
						var form = this.up("form");
						var loginbtn = form.down("button[name=loginbtn]");
						if (loginbtn){
							loginbtn.focus();
						}
					}
				}
			}
		}
	],
	buttons: [
		{
			text: "确定",
			formBind: true,
			disabled: true,
			name: "loginbtn",
			handler: function(){
				var form = this.up('form').getForm()	
				if (form.isValid()){
					var result = form.getValues();
					var usr = result["username"], passwd = result["password"];	

					Ext.Ajax.request({
						url: Spyder_server+"/user.login",
						method: "post",
						params: {
							username: usr,
							passwd: hex_md5(passwd)	
						},
						success: function(response){
							var responseText = response.responseText;
							responseText = Ext.JSON.decode(responseText);
							if (responseText.data){
								var data = responseText.data;
								if (data["result"] == "success"){
									var useinfo = data["data"],
										uid = useinfo["uid"],
										permissions = useinfo["permissions"];
								}else{
									Ext.Msg.alert("登陆失败", "登陆失败");
								}
							}
						},
						failure: function(){
						}
					})
				}
			}
		},
		{
			text: "重置",		
			handler: function(){
				this.up('form').getForm().reset();
			}
		}
	]
});

