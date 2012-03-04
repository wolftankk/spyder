Ext.namespace("Spyder.apps.websites");
registerMenu("websites", "websiteAdmin", {
	xtype: "buttongroup",
	title: "网站管理",
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
			text: "增加网站",
			handler: function(){
				var item = Spyder.cache.menus["addWebsite"];
				if (!item){
					Spyder.workspace.addPanel("addWebsite", "文章列表", {
						items: [
								Ext.create("Spyder.apps.websites.addWebsite")
						]	
					})
				}
			}
		},
	]
});
