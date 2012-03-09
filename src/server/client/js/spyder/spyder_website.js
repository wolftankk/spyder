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
				var item = Spyder.cache.menus["websites.addWebsite"];
				if (!item){
					Spyder.workspace.addPanel("websites.addWebsite", "增加网站", {
						items: [
							Ext.create("Spyder.apps.websites.addWebsite")
						]	
					})
				}
			}
		}
	]
});

Ext.define("Spyder.apps.websites.addWebsite", {
	extend: "Ext.panel.Panel",
	layout: "anchor",
	height: Spyder.constants.VIEWPORT_HEIGHT - 5,
	width: "100%",
	autoScroll: true,
	autoHeight: true,
	border: 0,
	bodyStyle: "background-color: #dfe8f5",
	defaults: {
		bodyStyle: "background-color: #dfe8f5",
		border: 0	
	},
	suspandLayout: true,
	initComponent: function(){
		var me = this;

		me.callParent();

		me.createMainPanel();
	},
	createMainPanel: function(){
		var me = this;
		var config = {
			autoHeight: true,
			autoScroll: true,
			cls: "iScroll",
			height: "100%",
			width: "100%",
			anchor: "fit",
			border: false,
			bodyBorder: false,
			plain: true,
			bodyPadding: "10",
			items: [
				{
					layout: {
						type:"table",
						columns: 2,
						tableAttrs: {
							cellspacing: 10,
							style: {
								width: "100%"
							}
						}
					},
					border: false,
					bodyStyle: "background-color: #dfe8f5",
					defaults: {
						bodyStyle: "background-color: #dfe8f5",
						width: "95%" 
					},
					defaultType: "textfield",
					fieldDefaults: {
						msgTarget: "side",
						labelAlign: "TOP",
						labelWidth: 60
					},
					items: [

					]
				}
			]
		}
	}
})
