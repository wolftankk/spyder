Ext.namespace("Spyder.apps.realms");
registerMenu("realms", "realmsAmin", {
    xtype: "buttongroup",
    title: "开服管理",
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
            text: "游戏列表",
            handler: function(){
                var item = Spyder.cache.menus["realms.gameList"];
                if (!item){
                    Spyder.workspace.addPanel("realms.gameList", "游戏列表", {
                        items: [
                            Ext.create("Spyder.apps.realms.gameList")
                        ]    
                    })
                }
            }
        },
	{
	    xtype: "button",
	    text: "运行商列表",
            handler: function(){
                var item = Spyder.cache.menus["realms.operaList"];
                if (!item){
                    Spyder.workspace.addPanel("realms.operaList", "游戏列表", {
                        items: [
                            Ext.create("Spyder.apps.realms.operaList")
                        ]    
                    })
                }
            }
	},
	{
	    text: "开服列表",
	    xtype : "button",
            handler: function(){
                var item = Spyder.cache.menus["realms.realmList"];
                if (!item){
                    Spyder.workspace.addPanel("realms.realmList", "游戏列表", {
                        items: [
                            Ext.create("Spyder.apps.realms.realmList")
                        ]    
                    })
                }
            }
	}
    ]
});
