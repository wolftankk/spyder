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

					Spyder.constants.userServer.Login(usr, hex_md5(passwd), {
						success: function(data){
								if (data){
									var useinfo = Ext.JSON.decode(data),
										uid = useinfo["uid"],
										sid = useinfo["sid"],
										permissions = useinfo["permissions"];
									Ext.util.Cookies.set("uname", usr);
									Ext.util.Cookies.set("uid", uid);
									Ext.util.Cookies.set("upermissions", permissions);
									Ext.util.Cookies.set("sid", sid);
									window.location = "main.html"
								}
						},
						failure: function(error){
							Ext.Error.raise(error)
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

