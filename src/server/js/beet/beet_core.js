//Beet 框架 namespace  所有子元素 继承于此
//使用namespace 规范代码机制 方便调用
Ext.namespace("Beet");
//app namespace
Ext.namespace("Beet.apps");

//临时数据表
Ext.namespace("Beet.cache");
Beet.cache.Users = {};

//plugin
Ext.namespace("Beet.plugins");

//constant namespace
Beet.constants = {
	FAILURE: "{00000000-0000-0000-0000-000000000000}",
	GRANDMADATE: -2208988800,
	PageSize: 30,
	CTServiceType : {
		"{AFF7BC81-ACA3-4E46-B5B1-87A90F45FE8D}" : "基础信息", 
		"{C3DCAA88-D92F-435F-96B2-50BDC665F407}" : "美容",
		"{BC6B8E96-51A4-40EB-9896-2BC26E97FAE4}" : "美发",
		"{8CB1DD70-0669-4421-B9BF-EB20015FB03D}" : "瑜伽",
		"{BA33BC91-FE7F-44A0-8C9D-D53147992B0E}" : "美甲"
	},
	CTInputMode : {
		0 : "textfield",
		1 : "radiogroup",
		2 : "checkboxgroup"
	},

	RES_CUSTOMER_IID: '{83456921-B754-4F13-B858-22E59EC1F827}',//客户表
	RES_CUSTERMTYPE_IID: '{033CB335-645E-485F-AE1E-CB1C241AEB21}',//客户项目		
	RES_DEPARTMENT_IID: '{28060FBC-3AF5-4988-86F5-6A4068CCC39D}',
	RES_STORE_IID: '{EF65A77F-EBEE-4D60-85FB-52577BF0D658}',
	

	ACT_ALLACT_IID: '{B6CC3DDC-4D92-4792-A667-311568B80AB9}',
	ACT_INSERT_IID: '{91677AFA-78C0-4A61-A4C0-C73C9F415819}',
	ACT_UPDATE_IID: '{C8D8D41F-6885-4C66-A25D-58A6E4D4F116}',
	ACT_DELETE_IID: '{593DD697-70AC-44AE-892E-5588041054A1}',
	ACT_SELECT_IID: '{D61570E6-EB82-4B22-A218-8881C71D692A}',

	privileges: {
		customer_addBtn : [
			'{91677AFA-78C0-4A61-A4C0-C73C9F415819}'
		],
		customer_editBtn : [
			'{D61570E6-EB82-4B22-A218-8881C71D692A}' 
		]
	},

	WORKSPACE_WIDTH: Ext.core.Element.getViewWidth(),
	WORKSPACE_HEIGHT: Ext.core.Element.getViewHeight(),
	VIEWPORT_HEIGHT: Ext.core.Element.getViewHeight() - 137
}
if (!Beet.constants.now){
	now = new Date();
	Beet.constants.now = +now;	
	Beet.constants.timezoneOffset = now.getTimezoneOffset() * 60;
}


function registerBeetAppsMenu(title, data){
	if (Beet.cache.MenuItems == undefined){
		Beet.cache.MenuItems = {};
	}
	Beet.cache.MenuItems[title] = data;
}

if (!String.prototype.replaceAll){
	String.prototype.replaceAll = function(reg, str){
		return this.replace(new RegExp(reg, "gm"), str);
	}
}


BEET_EVENTS_BUCKET = {}
function registerEvent(frame, event, callback){
	if (!BEET_EVENTS_BUCKET[frame] || typeof(BEET_EVENTS_BUCKET[frame]) !== "object"){
		BEET_EVENTS_BUCKET[frame] = {}
	}
	if (BEET_EVENTS_BUCKET[frame][event]){
		throw 'This frame\'s ' + event + " has registered!";
	}else{
		BEET_EVENTS_BUCKET[frame][event] = callback
		return true
	}
	return false
}

function unregisterEvent(frame, event, callback){
	if (BEET_EVENTS_BUCKET[frame] && BEET_EVENTS_BUCKET[frame][event]){
		BEET_EVENTS_BUCKET[frame][event] = undefined;
		delete BEET_EVENTS_BUCKET[frame][event]
		if (callback){
			callback()
		}
		return true
	}
}
