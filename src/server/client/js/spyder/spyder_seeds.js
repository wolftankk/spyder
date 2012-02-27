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
		},
		{
			xtype: "button",
			text: "种子列表",
			tooltip: "包含编辑,删除, 当前状态等功能",
			handler: function(){
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
						{
							fieldLabel: "名称",
							allowBlank: false,
							name: "sname"
						},
						{
							fieldLabel: "所属类别",
							allowBlank: false,
							name: "cid"
						},
						{
							fieldLabel: "采集URL",
							allowBlank: false,
							name: "url"
						},
						{
							fieldLabel: "charset",
							allowBlank: false,
							name: "charset"
						},
						{
							fieldLabel: "采集频率(秒)",
							allowBlank: false,
							name: "frequency"
						},
						{
							fieldLabel: "超时时间",
							allowBlank: false,
							name: "timeout"
						},
						{
							fieldLabel: "尝试次数",
							allowBlank: false,
							name: "tries"
						},
						{
							xtype: "checkboxfield",
							fieldLabel: "启用",
							name: "enabled"
						},
						{
							xtype: "fieldset",
							title: "列表规则",
							collapsible: true,
							defaultType: "textfield",
							fieldDefaults: {
								msgTarget: "side",
								labelAlign: "TOP",
								labelWidth: 60
							},
							items: [
								{
									fieldLabel: "url格式",
									allowBlank: false,
									name: "list[urlformat]"
								},
								{
									fieldLabel: "起始页",
									allowBlank: false,
									name: "list[startpage]"
								},
								{
									fieldLabel: "最大采集页数",
									allowBlank: false,
									name: "list[maxpage]"
								},
								{
									fieldLabel: "step",
									allowBlank: false,
									name: "list[step]"
								},
								{
									fieldLabel: "listParent",
									allowBlank: false,
									name:"list[listparent]"
								},
								{
									fieldLabel: "entryParent",
									allowBlank: false,
									name: "list[entryparent]"
								},
								{
									fieldLabel: "文章URL正则",
									allowBlank: false,
									name: "list[articleurl]"
								},
								{
									fieldLabel: "文章标题正则",
									allowBlank: false,
									name: "list[titleparent]"
								},
								{
									fieldLabel: "文章日期正则",
									allowBlank: false,
									name: "list[dateparent]"
								}
							]
						},
						{
							xtype: "fieldset",
							title: "文章规则",
							collapsible: true,
							defaultType: "textfield",
							fieldDefaults: {
								msgTarget: "side",
								labelAlign: "TOP",
								labelWidth: 60
							},
							items: [
								{
									fieldLabel: "文章正则",
									name: "article[articleparent]",
									allowBlank: false
								},
								{
									fieldLabel: "文章标题正则",
									name: "article[titleparent]",
									allowBlank: false
								},
								{
									fieldLabel: "tags正则"
								},
								{
									fieldLabel: "作者正则",
								},
								{
									fieldLabel: "文章正文正则"
								},
								{
									fieldLabel: "文章页面正则"
								},
								{
									fieldLabel: "文章过滤正则"//array
								}
							]
						},
						{
							xtype: "button",
							text: "submit",
							handler: function(){
								var form = me.form.getForm();
								console.log(form.getValues())
							}
						}
					]
				},
			],
		}

		var form = Ext.widget("form", config);
		me.form = form
		me.add(form)
		me.doLayout();
	}
})
