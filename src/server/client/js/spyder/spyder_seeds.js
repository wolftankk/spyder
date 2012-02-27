Ext.namespace("Spyder.apps.seeds");
registerMenu("seeds", "seedAdmin", {
	xtype: "buttongroup",
	title: "种子管理",
	layout: "anchor",
	frame: true,
	width: 400,
	defaults: {
		scale: "large",
		rowspan: 3	
	},
	items: [
		{
			xtype: "button",
			text: "添加种子",
			tooltip: "点击打开,并且新增一个采集种子",
			handler: function(){
				var item = Spyder.cache.menus["addSeed"];
				if (!item){
					Spyder.workspace.addPanel("addSeed", "添加种子", {
						items: [
								Ext.create("Spyder.apps.seeds.AddSeed")
						]	
					})
				}
			}
		}
	]
});

Ext.define("Spyder.apps.seeds.AddSeed", {
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

		me.callParent()
	}
})
