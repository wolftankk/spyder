Spyder_server = "http://172.16.130.103/spyder";


Ext.Ajax.addListener("requestcomplete", function(conn, response, opts, eopts){
	//rewrite callback
	var responseText = Ext.JSON.decode(response.responseText);
	if (responseText.data){
		var data = responseText.data;
		if (data["result"] == "relogin"){
			Ext.MessageBox.show({
				title: "错误",
				msg: "因较长时间未操作, 用户已被注销, 请重新登陆!",
				buttons: Ext.MessageBox.OK,
				fn: function(btn){
					Ext.util.Cookies.clear();
					window.location = "index.html";
				}
			})
			return;
		}
	}
})
