Ext.namespace("Spyder.apps.articles");
registerMenu("articles", "articleAdmin", {
	xtype: "buttongroup",
	title: "文章管理",
	layout: "anchor",
	frame: true,
	width: 200,
	defaults: {
		scale: "large",
		rowspan: 3	
	},
	items: [
		{
			xtype: "button",
			text: "文章列表",
			handler: function(){
				var item = Spyder.cache.menus["articleList"];
				if (!item){
					Spyder.workspace.addPanel("articleList", "添加种子", {
						items: [
								Ext.create("Spyder.apps.articles.ArticleList")
						]	
					})
				}
			}
		},
	]
});


Ext.define("Spyder.apps.articles.ArticleList", {
	extend: "Ext.panel.Panel",	
	layout: "fit",
	width: "100%",
	bodyBorder: false,
	autoHeight: true,
	frame: true,
	b_filter: "",
	b_type: "list",
	defaults: {
		border: 0
	},
	initComponent: function(){
		var me = this

		me.callParent();

		Spyder.constants.articleServer.GetArticleList(0, 1, "", {
			success: function(data){
				console.log(data)	
			},
			failure: function(error){
				Ext.Error.raise(error)
			}
		})
	}
})
