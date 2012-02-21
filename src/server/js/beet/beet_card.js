registerBeetAppsMenu("card", {
	title: "卡项管理",
	items: [
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
					title: '卡项管理',
					layout: "anchor",
					width: 300,
					defaults: {
						scale: "large",
						rowspan: 1
					},
					items: [
						{
							text: "增加卡项",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["addCard"]
								if (!item){
									Beet.workspace.addPanel("addCard", "增加卡项", {
										items: [
											Ext.create("Beet.apps.ProductsViewPort.AddCard")
										]
									})
								}else{
									Beet.workspace.workspace.setActiveTab(item);
								}
							}
						},
						{
							text: "编辑卡项",
							handler: function(){
								var item = Beet.apps.Menu.Tabs["cardList"]
								if (!item){
									Beet.workspace.addPanel("cardList", "编辑卡项", {
										items: [
											Ext.create("Beet.apps.ProductsViewPort.CardList")
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


Ext.namespace("Beet.apps.ProductsViewPort");

//GetCategoryData  
//0 产品,  1, 项目
//2 套餐,  3 卡项
//4 费用
function buildCategoryTreeStore(type){
	var typedict = {
		0 : "Products",
		1 : "Items",
		2 : "Packages",
		3 : "Cards",
		4 : "Charges"
	}
	if (typedict[type] == undefined){
		Ext.Error.raise("传入的type错误, 请检查!");
		return;
	}
	
	if (!Beet.apps.ProductsViewPort[typedict[type]+"CatgoryTreeStore"]){
		Ext.define(("Beet.apps.ProductsViewPort."+typedict[type]+"CatgoryTreeStore"), {
			extend: "Ext.data.TreeStore",
			fields: [
				"rate",//add for rate
				"id",
				"text",
				"name"
			],
			autoLoad: true,
			root: {
				text: "总分类",
				id: "-1",
				rate: "",
				expanded: true
			},
			proxy: {
				type: "b_proxy",
				b_method: Beet.constants.cardServer.GetCategoryData,
				b_params: {
					"CategoryType" : type
				},
				preProcessData: function(data){
					var originData = data["root"];
					var bucket = [];
					var me = this;
					me.categoryList = [];
					var processData = function(target, cache, pid){
						var k;
						for (k = 0; k < target.length; ++k){
							var _tmp = target[k];
							_tmp["rate"] = (_tmp["rate"] == -1 ? "无" : _tmp["rate"]);
							var item = {};
							if (_tmp.data && _tmp.data.length > 0){
								item["expanded"] = false;
								item["text"] = _tmp["name"];
								item["id"] = _tmp["id"];
								item["pid"] = pid;
								item["children"] = [];
								item["rate"] = _tmp["rate"];
								processData(_tmp.data, item["children"], item["id"]);
							}else{
								item = _tmp;
								item["text"] = _tmp["name"];
								item["leaf"] = true;
								item["pid"] = pid;
								item["rate"] = _tmp["rate"];
								//item["checked"] = false;
							}

							cache.push(item);
							me.categoryList.push({
								id: _tmp["id"],
								text: _tmp["name"],
								rate: _tmp["rate"]
							})
						}
					}

					processData(originData, bucket, -1);

					return bucket;
				},
				b_scope: Beet.constants.cardServer,
				reader: {
					type: "json"	
				}
			},
		})
	}
}


Ext.onReady(function(){
	Ext.require(["card.products", "card.cards", "card.interests", "card.packages", "card.items", "card.charges", "card.rebate"]);
});
