Spyder = {
	apps : {},
	plugins : {},
	constants : {
		WORKSPACE_WIDTH: Ext.core.Element.getViewWidth(),
		WORKSPACE_HEIGHT: Ext.core.Element.getViewHeight(),
		VIEWPORT_HEIGHT: Ext.core.Element.getViewHeight() - 137
	},
	cache : {
		menus : {},
		containers : {}	
	},
	templates: {},
	menus : {
		seeds: {
			title: "种子",
			menus: {}
		},
		articles:{
			title: "文章",
			menus: {}
		},
		websites:{
			title: "网站",
			menus: {}
		}
	}
}

if (!String.prototype.replaceAll){
	String.prototype.replaceAll = function(reg, str){
		return this.replace(new RegExp(reg, "gm"), str);
	}
}

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
});

function registerMenu(type, title, data){
	if (!Spyder.menus[type]){
		throw new Error("This `" + type + "` has not registed")
	}
	if (!data){
		throw new Error("This `data` must be defined");
	}
	if (Spyder.menus[type].menus[title]){
		throw new Error(title+" has registed");
	}
	setTimeout(function(){
		var panel = Spyder.menus[type].panel;
		if (!!panel){
			Spyder.menus[type].menus[title] = data
			panel.add(data);
			panel.doLayout();	
		}
	}, 500)
}

Ext.define("Spyder.apps.HeaderPanel", {
	extend: "Ext.panel.Panel",
	width: "100%",
	autoHeight: true,
	autoScroll: true,
	layout: "fit",
	renderTo: "header",
	shadow: true,
	border: 0,
	initComponent: function(){
		var me = this;
		
		//将所有的子panel加入到此列表中
		Spyder.cache.containerList = {};

		me.configurePanel = new Ext.tab.Panel(me.getCPanelConfig());

		//当框体变动的时候 进行自动调整大小
		Ext.EventManager.onWindowResize(me.fireResize, me);
		me.callParent(arguments);
		
		me.add(me.configurePanel);
		me.addDocked(Ext.create("Spyder.apps.HeaderToolbar", {
			configurePanel: me.configurePanel	
		}))
		me.doLayout();

		setTimeout(function(){
			var items = me.configurePanel.items.items;
			if (items && items.length > 0){
				for (var c = 0; c < items.length; ++c){
					var item = items[c], _key = item["_key"];
					if (Spyder.menus[_key]){
						Spyder.menus[_key].panel = item.add({
							xtype: "container",
							layout: "hbox",
							defaultType: "buttongroup",
							defaults: {
								height: 100,
								width: 250
							}
						})
					}
				}
			}
		}, 100)
	},
	getCPanelConfig: function(){
		var items = [];
		for (var type in Spyder.menus){
			items.push({
				title: Spyder.menus[type].title,
				_key: type,
				tabConfig: {
					minWidth: 100
				}
			});
		}

		var config = {
			border: 1,
			width: '100%',
			height: 80,//fixed by ext4.0.7
			autoHeight: true,
			autoWidth: true,
			autoScroll: true,
			layout: "fit",
			id: "configurePanel",
			plain: true,
			minTabWidth: 100,
			bodyStyle: "background-color: #dfe8f5",
			defaults: {
				bodyStyle: "background-color: #dfe8f5",
				border: 0,
				plain: true
			},
			items: items
		}

		return config;
	},
	fireResize: function(w, h){
		Spyder.constants.WORKSPACE_HEIGHT = h;
		Spyder.constants.WORKSPACE_WIDTH = w;
		Spyder.constants.VIEWPORT_HEIGHT = h - 137;

		if (w < 960){
			//donothing
		}else{
			this.setWidth(w);
		}
	}
})

Ext.define("Spyder.apps.HeaderToolbar", {
	extend: "Ext.toolbar.Toolbar",
	height: 30,
	width: "100%",
	cls: "beet-navigationbar",
	useQuickTips: true,
	b_collapseDirection : 'top',
	b_collapsed: false,
	b_collapsedCls: 'collapsed',
	border: 0,
	initComponent: function(){
		var me = this;
		if (me.useQuickTips){
			Ext.QuickTips.init();
		}

		if (me.configurePanel == undefined){
			throw new Error("Spyder HeaderToolbar must need configurePanel");
		}

		//导航栏toolbar
		me.navigationToolbar = new Ext.toolbar.Toolbar(me.getNavitionConfig());
		me.navigationToolbar.parent = me;

		me.callParent();

		Ext.defer(function(){
			Ext.EventManager.on(me.configurePanel.getTabBar().body, "click", me.onTabBarClick, me);
		}, 1);
		me.b_collapseDirection = me.b_collapseDirection || Ext.Component.DIRECTION_TOP;


		me.add({
			xtype: "splitbutton",
			text: "Spyder"
		});
		me.add("-");
		me.add(me.navigationToolbar);
		me.add("->");
		var logoutButton = new Ext.toolbar.Toolbar(me.getLogoutButtonConfig());
		me.add(logoutButton);

		me.doLayout();

		//me.helpButton = new Ext.toolbar.Toolbar(me.getHelpButtonConfig());
		//me.toggleButton = new Ext.toolbar.Toolbar(me.getToggleButtonConfig());
		//me.username = new Ext.toolbar.TextItem({
		//	text: "#"
		//}); 

		//me.items = [
		//	//about button / menu
		//	{
		//		xtype: "splitbutton",
		//		text: "Spyder"
		//	}, "-",
		//	me.navigationToolbar,
		//	"->",//设定到右边区域
		//	'-',
		//	//help
		//	//"当前用户: ", me.username, '-', ' ', 
		//	//me.logoutButton, ' ',
		//	//me.toggleButton, ' ',
		//	//me.helpButton,
		//	{
		//		xtype: "trayclock"
		//	}
		//];
		
		//me.updateUsername();
	},
	afterLayout: function(){
		var me = this;
		me.callParent();
	},
	//获取导航栏配置
	getNavitionConfig: function(){
		var me = this, config;
		var configurePanel = me.configurePanel, navigationTab = configurePanel.getTabBar();
		//remove tab from tabpanel dockeditems
		configurePanel.removeDocked(navigationTab, false);
		navigationTab.dock = "";
		navigationTab.setWidth(600);
		navigationTab.setHeight(23);
		navigationTab.border=0;

		config = {
			cls: "beet-navtoolbar",
			width: 600,
			autoWidth: true,
			items: [
				"&#160;",
				navigationTab	
			],
			enableOverflow: false
		}
		return config
	},
	getLogoutButtonConfig: function(){
		var me = this, config;
		config = {
			layout: "fit",
			items: [
				{
					xtype: "button",
					text: "退出",
					tooltip: "安全退出Spyder系统",
					handler: function(){
						//customerLoginServer.Logout({
						//	success: function(){
						//		Ext.util.Cookies.clear("userName");
						//		Ext.util.Cookies.clear("userId");
						//		Ext.util.Cookies.clear("sessionId");
						//		window.location = "index.html";	
						//	},
						//	failure: function(){
						//		window.location = "index.html";		
						//	}
						//});	
					}
				}
			]
		};
		return config;
	},
	//右边区域
	getHelpButtonConfig: function(){
		//var me = this, config;
		//config = {
		//	layout: "fit",
		//	items: [
		//		{
		//			xtype: "tool",
		//			type: "restore",
		//			handler: function(){
		//				if (document.body.webkitRequestFullScreen){
		//					document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		//				}else{
		//					document.body.mozRequestFullScreen()
		//				}
		//				//refresh
		//				setTimeout(function(){
		//					location.reload();
		//				}, 500);

		//				//document.addEventListener("fullscreenchange", function(){
		//				//	console.log(1)
		//				//}, false)
		//			},
		//			tooltip: "切换至全屏模式"
		//		}
		//	]
		//}
		return config;
	},
	getToggleButtonConfig: function(){
		var me = this, config;
		
		//创建expand/collapse工具
		me.collapseTool = me.expandTool = me.createComponent({
			xtype: 'tool',
			type: 'collapse-' + me.b_collapseDirection,
			//expandType:
			handler: Ext.Function.bind(me.toggleCollapse, me, []),
			scope: me
		});
		config = {
			layout: "fit",
			items: [
				me.collapseTool
			]
		};
		return config;
	},
	toggleCollapse: function(){
		var me = this;
		if (me.b_collapsed){
			me.expand();
		}else{
			me.collapse(me.b_collapseDirection);
		}
		return me
	},
	expand: function(){
		if (!this.b_collapsed || this.fireEvent('beforeexpand', this) === false ){
			return false;
		}
		var me = this, parent = me.ownerCt, configurePanel = me.configurePanel, c = Ext.Component,
		direction=me.b_expandDirection, anim,
		toolbarHeight = me.getHeight(), toolbarWidth = me.getWidth();
		
		if (me.collapseTool){
			me.collapseTool.disable();
		}

		//update tool style
		if (me.collapseTool){
			me.collapseTool.setType("collapse-"+me.b_collapseDirection);
		}
		me.b_collapsed = false;
		configurePanel.show();

		me.removeClsWithUI(me.b_collapsedCls);
		anim = {
			to: {
			},
			from: {
				height: toolbarHeight,
				width: toolbarWidth
			},
			listeners: {
				afteranimate: me.afterExpand,
				scope: me
			}
		}
		if (direction == c.DIRECTION_TOP || direction == c.DIRECTION_BOTTOM){
			parent.setCalculatedSize(parent.width, null);
			anim.to.height = parent.getHeight();
			parent.setCalculatedSize(parent.width, anim.from.height);
		}
		
		parent.animate(anim);
		return me;
	},
	afterExpand: function(){
		var me = this, parent = me.ownerCt, configurePanel = me.configurePanel;
		parent.setAutoScroll(parent.initialConfig.autoScroll);
		parent.suspendLayout=null;

		var h = Ext.core.Element.getViewHeight();
		Spyder.constants.VIEWPORT_HEIGHT = h - 137;
		if (Spyder.workspace){
			Spyder.workspace.setAutoScroll(false);
			Spyder.workspace.setHeight(h - 112)
			Spyder.workspace.setAutoScroll(true);
		}

		if (parent.ownerCt){
			parent.ownerCt.doLayout();
		}
		me.fireEvent("expand", me);
		if (me.collapseTool){
			me.collapseTool.enable();
		}

		//update children
		for (var childName in Spyder.cache.containerList){
			var child = Spyder.cache.containerList[childName];
			if (child && child.setHeight){
				child.setHeight(Spyder.constants.VIEWPORT_HEIGHT - 1);
			}
		}
	},
	getOppositeDirection: function(direction){
		var c = Ext.Component;
		switch (direction){
			case c.DIRECTION_TOP:
				return c.DIRECTION_BOTTOM;
			case c.DIRECTION_BOTTOM:
				return c.DIRECTION_TOP;
		}
	},
	collapse: function(direction){
		var me = this, parent = me.ownerCt, configurePanel = me.configurePanel, c = Ext.Component, newSize = 0,
		toolbarHeight = me.getHeight() + 2, toolbarWidth = me.getWidth(),
		parentHeight = parent.getHeight(), parentWidth= parent.getWidth(), 
		panelHeight = configurePanel.getHeight(), panelWidth = configurePanel.getWidth(), pos = 0,
		anim = {
			from:{
				height: parentHeight,
				width: parentWidth
			},
			to: {
				height: toolbarHeight,
				width: toolbarWidth
			},
			listeners: {
				afteranimate: me.afterCollapse,
				scope: me
			},
			duration: Ext.Number.from(true, Ext.fx.Anim.prototype.duration)
		};

		if (!direction){
			direction = me.b_collapseDirection;
		}

		if (me.b_collapsed || me.fireEvent('beforecollapse', me, direction) === false){
			return false;
		}
		me.b_expandDirection = me.getOppositeDirection(direction);

		if (direction == c.DIRECTION_TOP){
			me.b_expandedSize = parent.getHeight();
		}
		
		//no scrollbars	
		parent.setAutoScroll(false);
		parent.suspendLayout = true;
		parent.body.setVisibilityMode(Ext.core.Element.DISPLAY);

		if (me.collapseTool){
			me.collapseTool.disable();
		}
		me.addClsWithUI(me.b_collapsedCls);

		//开始动画
		configurePanel.hide();
		parent.animate(anim);

		return me;
	},
	afterCollapse: function(){
		var me = this, configurePanel = me.configurePanel;
		var h = Ext.core.Element.getViewHeight();
		me.b_collapsed = true;
		Spyder.constants.VIEWPORT_HEIGHT = h - 57;
		if (Spyder.workspace){
			Spyder.workspace.setAutoScroll(false);
			Spyder.workspace.setHeight(h - 32);
			Spyder.workspace.setAutoScroll(true);
		}
		if (me.collapseTool){
			me.collapseTool.setType("expand-"+me.b_expandDirection);
		}
		if (me.collapseTool){
			me.collapseTool.enable();
		}
		//update children
		for (var childName in Spyder.cache.containerList){
			var child = Spyder.cache.containerList[childName];
			if (child && child.setHeight){
				child.setHeight(Spyder.constants.VIEWPORT_HEIGHT - 1);
			}
		}
	},
	onTabBarClick: function(){
		var me = this;
		if (me.b_collapsed){
			//fire expand
			//设置延迟执行函数 避免点击的时候界面乱掉
			Ext.defer(function(){
				me.toggleCollapse();
			}, 1);
		}
	}
});

Ext.define("Spyder.apps.Viewport", {
	extend: "Ext.container.Container",	
	renderTo: "viewport",
	layout: "fit",
	floatable: false,
	border: 0,
	plain: true,
	initComponent: function(){
		var me =this;

		Ext.EventManager.onWindowResize(me.fireResize, me);

		me.callParent();
		me.add(me.createMainPanel());
		me.doLayout();
	},
	onRender: function(){
		var me = this, h = Ext.core.Element.getViewHeight();
		////自动计算高度 总高度 - menu高度
		me.setHeight(h-112);
		me.callParent(arguments);
	},
	createMainPanel: function(){
		var me = this, panel = Ext.create("Ext.tab.Panel", {
			border: false,
			maxTabWidth: 230,
			minTabWidth: 150,
			cls: "iScroll",
			width: "100%",
			id: "beet_workspace",
			height: Spyder.constants.VIEWPORT_HEIGHT,
			shadow: true,
			layout: "anchor",
			defaults: {
				autoScroll: true,
				border: 0,
				closable: true,
				height: Spyder.constants.VIEWPORT_HEIGHT,//child height
				bodyStyle: "background-color: #dfe8f5",
				plain: true
			},
			border: false,
			bodyStyle: "background-color: #dfe8f5",
			autoDestroy: true,
			listeners: {
				remove: function(container, item,opts){
					var name = item.b_name;
					if (!!name){
						if (Spyder.cache.menus[name]){
							Spyder.cache.menus[name] = null;
							Spyder.cache.containers[name] = null;
						}
					}
				},
				add: function(component, item){
					setTimeout(function(){
						var name = item.b_name;
						if (!!name){
							var items = item.items;
							var realPanel = items.getAt(0);
							if (realPanel){
								realPanel.setWidth(Spyder.constants.WORKSPACE_WIDTH);
								realPanel.setHeight(Spyder.constants.VIEWPORT_HEIGHT - 1);
								Spyder.cache.containers[name] = realPanel;

								//force reset width & height
								realPanel.addListener({
									resize: function(f, adjWidth, adjHeight, opts){
										f.setAutoScroll(false);
										f.setWidth(adjWidth);
										f.setHeight(adjHeight);
										f.doLayout();
										f.setAutoScroll(true)
									}
								})
							}
						}
					}, 100);
				}
			}
		})
		me.workspace = panel;
		return panel
	},
	fireResize: function(w, h){
		var me = this;
		if (w >= 960){
			me.setWidth(w);
		}
		if (h > 300){
			me.setHeight(h - 112);
		}

		//update children
		for (var childName in Spyder.cache.constants){
			var child = Spyder.cache.containers[childName];
			if (child && child.setHeight && child.setWidth){
				child.setHeight(Spyder.constants.VIEWPORT_HEIGHT - 1);
				child.setWidth(Spyder.constants.WORKSPACE_WIDTH);
			}
		}
	},
	removePanel: function(name){
		var me = this, item = Spyder.cache.menus[name];
		me.workspace.getTabBar().closeTab(item.tab);
		if (item){
			me.workspace.remove(item, true);
			item.close();
		}
		me.workspace.doLayout();
	},
	addPanel: function(name, title, config){
		var me = this, item = me.workspace.add(Ext.apply({
			inTab: true, 
			title: title,
			tabTip: title
		}, config));
		me.workspace.doLayout();
		//设置一个私有的name名称, 为了能直接摧毁
		item.b_name = name;
		Spyder.cache.menus[name] = item;
		me.workspace.setActiveTab(item);
	}
});
