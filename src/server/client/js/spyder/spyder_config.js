Spyder_server = "http://172.16.130.103/spyder";


//Ext.Ajax.addListener("requestcomplete", function(conn, response, opts, eopts){
//	//rewrite callback
//	var responseText = Ext.JSON.decode(response.responseText);
//	if (responseText.data){
//		var data = responseText.data;
//		if (data["result"] == "success"){
//			Ext.callback(opts.success, opts.scope, [data["data"]]);
//			return;
//		}else{
//			Ext.callback(opts.success, opts.scope, [data["errors"]]);
//			return;
//		}
//	}
//})
