//check 
//If firefox, you install https://addons.mozilla.org/en-US/firefox/addon/html-notifications/
//check current brower is firefox
if (Ext.isGecko){
	if (!!window.webkitNotifications){
		//support
	}else{
		Ext.Msg.alert("警告", "你当前浏览器不支持桌面提醒, 你需要安装https://addons.mozilla.org/en-US/firefox/addon/html-notifications/
");
	}
};

Beet_Notifications = {};
