Ext.define("Beet.plugins.TabScrollerMenu", {
	alias: "plugin.tabscrollmenu",
	uses: ["Ext.menu.Menu"],
	pageSize: 10,
	maxText: 15,
	menuPrefixText: "Items",
	position: "left",
	constructor: function(config){
		config = config || {};
		Ext.apply(this, config);
	},
	init: function(tabPanel){
		var that = this;
		Ext.apply(tabPanel, that.parentOverrides);
		that.tabPanel = tabPanel;

		tabPanel.on({
			render: function(){
				that.tabBar = tabPanel.tabBar;
				that.layout = that.tabBar.layout;	
				that.layout.overflowHandler.handleOverflow = Ext.Function.bind(that.showButton, that);
				that.layout.overflowHandler.clearOverflow = Ext.Function.createSequence(that.layout.overflowHandler.clearOverflow, that.hideButton, that);
			},
			single: true
		})
	},
	showButton: function(){
		var that = this, 
			result = Ext.getClass(that.layout.overflowHandler).prototype.handleOverflow.apply(that.layout.overflowHandler, arguments);
		if (!that.menuButton){
			//移动到左边
			that.menuButton = that.tabBar.body.createChild({
				cls: Ext.baseCSSPrefix + 'tab-tabmenu-left'	
			}, that.tabBar.body.child("." + Ext.baseCSSPrefix + "box-scroller-left"));
			that.menuButton.addClsOnOver(Ext.baseCSSPrefix + "tab-tabmenu-over");
			that.menuButton.on("click", that.showTabsMenu, that)
		}
		that.menuButton.show();
		result.targetSize.width -= that.menuButton.getWidth();
		return result;
	},
	hideButton: function(){
		var that = this;
		if (that.menuButton){
			that.menuButton.hide();
		}
	},
	getPageSize:function(){
		return this.pageSize
	},
	setPageSize: function(pageSize){
		this.pageSize = pageSize
	},
	getMaxText: function(){
		return this.maxText
	},
	setMaxText:function(t){
		this.maxText = t;
	},
	getMenuPrefixText: function(){
		return this.menuPrefixText;
	},
	setMenuPrefixText: function(preText){
		this.menuPrefixText = preText
	},
	showTabsMenu: function(e){
		var that = this;
		if (that.tabsMenu){
			that.tabsMenu.removeAll();
		} else {
			that.tabsMenu = Ext.create("Ext.menu.Menu");
			that.tabPanel.on("destroy", that.tabsMenu.destroy, that.tabsMenu);
		}
		
		that.generateTabMenuItems();

		var target = Ext.get(e.getTarget())
		var xy = target.getXY();

		xy[1] += 24;

		that.tabsMenu.showAt(xy);
	},
	generateTabMenuItems: function(){
		var that = this, tabPanel = that.tabPanel,
			currentActive = tabPanel.getActiveTab(), totalItems = tabPanel.items.getCount(),
			pageSize = that.getPageSize, numSubMenus = Math.floor(totalItems/pageSize),
			remainder = totalItems % pageSize, currentPage, menuItems, item, start, index,
			i, x;

		if (totalItems > pageSize){
			for (i = 0; i < numSubMenus; i++){
				currentPage = ( i + 1 ) * pageSize;
				menuItems = []
				for (x = 0; x < pageSize; x++){
					index = x + currentPage - pageSize;
					item = tabPanel.items.get(index);
					menuItems.push(that.autoGenMenuItem(item))
				}

				that.tabsMenu.add({
					text: me.getMenuPrefixText() + ' ' + ( currentPage - pageSize + 1 ) + ' - ' + currentPage,
					menu: menuItems
				});
			}

			if (remainder > 0 ){
				start = numSubMenus * pageSize;
				menuItems = [];
				for (i = start; i < totalItems; i++){
					item = tabPanel.items.get(i);
					menuItems.push(that.autoGenMenuItem(item));
				}

				that.tabsMenu.add({
					text: me.getMenuPrefixText() + ' ' + ( start + 1 ) + ' - ' + (start + menuItems.length),
					menu: menuItems
				});
			}
		}else{
			tabPanel.items.each(function(item){
				if (item.id != currentActive.id && !item.hidden){
					that.tabsMenu.add(that.autoGenMenuItem(item));
				}
			});
		}
	},
	autoGenMenuItem: function(item){
		var maxText = this.getMaxText(),
			text = Ext.util.Format.ellipsis(item.title, maxText);

		return {
			text: text,
			handler: this.showTabFromMenu,
			scope: this,
			disabled: item.disabled,
			tabToShow: item,
			iconCls: item.iconCls
		}
	},
	showTabFromMenu: function(menuItem){
		this.tabPanel.setActiveTab(menuItem.tabToShow);
	}
});

Ext.define("Beet.plugins.TrayClock", {
	extend: "Ext.toolbar.TextItem",
	alias: "widget.trayclock",
	html: "&#160;",
	timeFormat: "G:i:s",
	tpl: "{time}",
	initComponent: function(){
		var that = this;
		that.callParent(arguments);

		if (typeof that.tpl == "string"){
			that.tpl = new Ext.XTemplate(that.tpl)
		}
	},
	afterRender: function(){
		var that = this;
		Ext.defer(that.updateTime, 100, that);
		//create a tip
		that.tooltip = Ext.create("Ext.tip.ToolTip", {
			target: that.id,
			trackMouse: true,
			html: "&#160;",
			listeners: {
				beforeshow: function(){
					that.tooltip.update((new Date()).toLocaleDateString());
				}
			}
		});

		that.callParent();
	},
	onDestroy:function(){
		var that = this;
		if (that.timer){
			clearTimeout(that.timer);
			that.timer = null;
		}
		that.callParent();
	},
	updateTime: function(){
		var that = this,
			date = Ext.Date.format(new Date(), that.timeFormat),
			dateStr = that.tpl.apply({
				time: date
			})
		if (that.lastText != dateStr){
			that.setText(dateStr);
			that.lastText = dateStr;	
		}
		that.timer = Ext.defer(that.updateTime, 1000, that);
	}
});

Ext.define("Beet.plugins.CheckColumn", {
	extend: "Ext.grid.column.Column",
	alias: "widget.checkcolumn",
	constructor: function(){
		this.addEvents(
			/*
			 * @event chechchange
			 * 监控checkbox是否被check/unckeck
			 * @param {Beet.plugins.CheckColumn} this
			 * @param {Number} rowIndex
			 * @param {Boolean} cheched true if the box is cheched 
			 */
			'checkchange'
		);
		
		this.callParent(arguments);
	},
	/**
	 *	构建event, 并且触发定制的event
	 */
	processEvent: function(type, view, call, recordIndex, cellIndex, e){
		if (type == "mousedown" || (type == "keydown" && (e.getKey() == e.ENTER || e.getKey() == e.SPACE)) ){
			var record = view.panel.store.getAt(recordIndex),
				dataIndex = this.dataIndex,
				checked = !record.get(dataIndex);

			record.set(dataIndex, checked);
			this.fireEvent("checkchange", this, recordIndex, checked);
			return false;
		} else {
			return this.callParent(arguments);
		}
	},
	renderer: function(value){
		var cssPrefix = Ext.baseCSSPrefix,
			cls = [cssPrefix + 'grid-checkheader'];

		if (value){
			cls.push(cssPrefix + 'grid-checkheader-checked');
		}
		
		return '<div class="' + cls.join(' ') + '">&#160;</div>';
	}
});


Ext.define("Beet.plugins.contextMenu", {
	alias: "plugin.b_contextmenu",
	mixins: {
		observable: "Ext.util.Observable"
	},
	
	contextMenu: [],

	constructor: function(config){
		var that = this;
		Ext.apply(that, config);
	},

	//private
	init: function(grid){
		var that = this;
		that.grid = grid;
		that.view = grid.view;

		that.initEvents();
	},

	initEvents: function(){
		var that = this;
		that.initMouseTriggers();
	},
	startPopupByClick: function(view, record, item, index, e){
		this.Popup(record, e);
	},
	Popup: function(record, e){
		//raw 原始数据
		var that = this, data = record.data, raw = record.raw;
		e.stopEvent();
		if (!record.contextMenu){
			record.contextMenu = new Ext.menu.Menu({
				plain: true,
				items: that.contextMenu,
				rawData: raw
			})
		}
		var xy = e.getXY();
		record.contextMenu.showAt(xy);
		return false;
	},
	//private
	initMouseTriggers: function(){
		var that = this, view = that.view;
		//开始设定事件
		//mon addManagedListener
		that.mon(view, "beforeitemcontextmenu", that.startPopupByClick, that);
	}
});


Ext.define("Beet.plugins.LiveSearch",{
	extend: "Ext.grid.Panel",
	searchValue: null,
	indexes: [],
	currentIndex: null,
	searchRegExp: null,
	regExpMode: false,
	defaultStatusText: "没有找到",
	tagsRe: /<[^>]*>/gm,
	width: "100%",
	tagsProtect: '\x0f',
	regExpProtect: /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm,
	matchCls: 'x-livesearch-match',
	cls: 'iScroll',
	initComponent: function(){
		var me = this;
		me.tbar = me.tbar || [];
		Ext.Array.each([
			'搜索', {
				xtype: "textfield",
				name: "searchField",
				hideLabel: true,
				width: 200,
				listeners: {
					change: {
						fn: me.onTextFieldChange,
						scope: this,
						buffer: 1000
					}
				}
			},{
				xtype: "button",
				text: "<",
				handler: me.onPreviousClick,
				scope: me,
				tooltip: "查找前一项"
			},
			{
				xtype: "button",
				text: ">",
				handler: me.onNextClick,
				scope: me,
				tooltip: "查找后一项"
			},
		], function(a){
			me.tbar.push(a);
		});

		//调整位置
		var tmp = me.tbar.splice(-4, 4);
		me.tbar = tmp.concat(me.tbar);

		Ext.apply(me, arguments);
		me.callParent(arguments);
	},
	afterRender: function(){
		var me = this;
		me.callParent(arguments);

		me.textField = me.down('textfield[name=searchField]');
	},
	getSearchValue: function(){
		var me = this, value = me.textField.getValue();

		if (value ===''){return null;}

		if (!me.regExpMode){
			value = value.replace(me.regExpProtect, function(m) {
                return '\\' + m;
            });
		}else{
			try {
                new RegExp(value);
            } catch (error) {
                return null;
            }
            // this is stupid
            if (value === '^' || value === '$') {
                return null;
            }
		}
			
		var length = value.length, resultArray = [me.tagsProtect + '*'],
			i = 0,
			c;
            
		for(; i < length; i++) {
			c = value.charAt(i);
			resultArray.push(c);
			if (c !== '\\') {
				resultArray.push(me.tagsProtect + '*');
			}	 
		}
		return resultArray.join('');
	},
	onTextFieldChange: function(){
		var me = this, count = 0;

		me.view.refresh();

		me.searchValue = me.getSearchValue();
		me.indexes = [];

		me.currentIndex = null;

         if (me.searchValue !== null) {
             me.searchRegExp = new RegExp(me.searchValue, 'g');
             
             me.store.each(function(record, idx) {
                 var td = Ext.fly(me.view.getNode(idx)).down('td'),
                     cell, matches, cellHTML;
                 while(td) {
                     cell = td.down('.x-grid-cell-inner');
                     matches = cell.dom.innerHTML.match(me.tagsRe);
                     cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);
                     
                     // populate indexes array, set currentIndex, and replace wrap matched string in a span
                     cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
                        count += 1;
                        if (Ext.Array.indexOf(me.indexes, idx) === -1) {
                            me.indexes.push(idx);
                        }
                        if (me.currentIndex === null) {
                            me.currentIndex = idx;
                        }
                        return '<span class="' + me.matchCls + '">' + m + '</span>';
                     });
                     // restore protected tags
                     Ext.each(matches, function(match) {
                        cellHTML = cellHTML.replace(me.tagsProtect, match); 
                     });
                     // update cell html
                     cell.dom.innerHTML = cellHTML;
                     td = td.next();
                 }
             }, me);

             // results found
             if (me.currentIndex !== null) {
                 me.getSelectionModel().select(me.currentIndex);
             }
         }

         // no results found
         if (me.currentIndex === null) {
             me.getSelectionModel().deselectAll();
         }

         me.textField.focus();

	},
	onPreviousClick: function(){
		var me = this, idx;
		
		if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
            me.getSelectionModel().select(me.currentIndex);
        }
		
	},
	onNextClick: function(){
		var me = this, idx;
        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
			me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
			me.getSelectionModel().select(me.currentIndex);
        }
		
	}
});

Beet.constants.OperatorsList = Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{ attr: ">", name: "大于"},
		{ attr: ">=", name: "大于等于"},
		{ attr: "<", name: "小于"},
		{ attr: "<=", name: "小于等于"},
		{ attr: "=", name: "等于"},
		{ attr: "!=", name: "不等于"},
		{ attr: "LIKE", name: "约等于"}
	]
});

Beet.constants.monthesList = Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{ attr: 1, name: "01"},
		{ attr: 2, name: "02"},
		{ attr: 3, name: "03"},
		{ attr: 4, name: "04"},
		{ attr: 5, name: "05"},
		{ attr: 6, name: "06"},
		{ attr: 7, name: "07"},
		{ attr: 8, name: "08"},
		{ attr: 9, name: "09"},
		{ attr: 10, name: "10"},
		{ attr: 11, name: "11"},
		{ attr: 12, name: "12"}
	]	
})

Beet.constants.daysList = Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{ attr: 1, name: "01"},
		{ attr: 2, name: "02"},
		{ attr: 3, name: "03"},
		{ attr: 4, name: "04"},
		{ attr: 5, name: "05"},
		{ attr: 6, name: "06"},
		{ attr: 7, name: "07"},
		{ attr: 8, name: "08"},
		{ attr: 9, name: "09"},
		{ attr: 10, name: "10"},
		{ attr: 11, name: "11"},
		{ attr: 12, name: "12"},
		{ attr: 13, name: "13"},
		{ attr: 14, name: "14"},
		{ attr: 15, name: "15"},
		{ attr: 16, name: "16"},
		{ attr: 17, name: "17"},
		{ attr: 18, name: "18"},
		{ attr: 19, name: "19"},
		{ attr: 20, name: "20"},
		{ attr: 21, name: "21"},
		{ attr: 22, name: "22"},
		{ attr: 23, name: "23"},
		{ attr: 24, name: "24"},
		{ attr: 25, name: "25"},
		{ attr: 26, name: "26"},
		{ attr: 27, name: "27"},
		{ attr: 28, name: "28"},
		{ attr: 29, name: "29"},
		{ attr: 30, name: "30"},
		{ attr: 31, name: "31"}
	]	
});

Beet.constants.sexList = Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{ attr: 1, name: "先生"},
		{ attr: 2, name: "女士"}
	]	
});

Beet.constants.MarryList = Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{attr: 0, name: "未知"},
		{attr: 1, name: "未婚"},
		{attr: 2, name: '已婚'}
	]	
});

Beet.constants.NewUpdateModes = Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{attr: 0, name: "电话"},
		{attr: 1, name: "短信"},
		{attr: 2, name: 'Email'},
		{attr: 3, name: '邮寄'},
		{attr: 4, name: '微薄'}
	]	
});

Beet.constants.DateType = Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{attr: 0, name: "年"},
		{attr: 1, name: "月"},
		{attr: 2, name: "日"}	
	]	
});

Beet.constants.RaterType= Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{attr: 0, name: "面值"},
		{attr: 1, name: "实耗"},
	]	
});

Beet.constants.EducationList = Ext.create("Ext.data.Store", {
	fields: ["attr", "name"],
	data: [
		{attr: 0, name: "大专"},
		{attr: 1, name: "本科"},
		{attr: 2, name: '硕士及以上'},
		{attr: 3, name: '其他'}
	]	
});

Beet.constants.EnjoyModeList = Ext.create("Ext.data.Store", {
	fields: ["attr"],
	data: [
		{attr: "友人介绍"},
		{attr: "杂志"},
		{attr: "广告"},
		{attr: "报纸"},
		{attr: "电视"},
		{attr: "网络"}
	]	
});

Beet.constants.ServiceList = Ext.create("Ext.data.Store",{
	fields: ["attr", "name"],
	data: [
		{attr:"{C3DCAA88-D92F-435F-96B2-50BDC665F407}" ,name: "美容"},
		{attr:"{BC6B8E96-51A4-40EB-9896-2BC26E97FAE4}" ,name: "美发"},
		{attr:"{8CB1DD70-0669-4421-B9BF-EB20015FB03D}" ,name: "瑜伽"},
		{attr:"{BA33BC91-FE7F-44A0-8C9D-D53147992B0E}" ,name: "美甲"}
	]
});

Ext.define("Beet.plugins.selectCustomerWindow", {
	extend: "Ext.window.Window",
	title: "选择客户",
	id: "selectCustomerWindow",
	width: 650,
	height: 550,
	minHeight: 450,
	autoDestroy: true,
	autoHeight: true,
	autoScroll: true,
	layout: "fit",
	resizable: true,
	border: false,
	modal: false,
	maximizable: true,
	border: 0,
	bodyBorder: false,
	b_filter: "",
	initComponent: function(config){
		var me = this, customerServer = Beet.constants.customerServer;
		me.items = [];
		me.createCustomerInfo();
		me.callParent();

		me.buildStoreAndModel(me.b_filter);
	},
	createCustomerInfo: function(){
		var me = this;
		var _actions = {
			xtype: 'actioncolumn',
			width: 30,
			items: [
			]
		}
		_actions.items.push(
			"-","-","-",{
				icon: './resources/themes/images/fam/user_edit.png',
				tooltip: "查看用户详情",
				id: "",
				handler:function(grid, rowIndex, colIndex){
					var win = Ext.create("Beet.plugins.ViewCustomerInfo", {
						storeProxy: me.storeProxy,
						_rowIndex: rowIndex,
						_colIndex: colIndex	
					});
					win.show();
				}
			}
		);

		me.viewCustomerInfo = _actions;
	},
	buildStoreAndModel: function(where){
		var me = this;
		if (me.storeProxy){
			me.storeProxy.setProxy({
				type: "b_proxy",
				b_method: Beet.constants.customerServer.GetCustomerPageData,
				startParam: "start",
				limitParam: "limit",
				b_params: {
					"filter": where
				},
				b_scope: Beet.constants.customerServer,
				reader: {
					type: "json",
					root: "Data",
					totalProperty: "TotalCount"
				}
			});
			me.createSelectorForm();
			return;
		}

		if (!Ext.isDefined(Beet.plugins.selectCustomerWindowCustomerListModel)){
			Ext.define("Beet.plugins.selectCustomerWindowCustomerListModel", {
				extend: "Ext.data.Model",
				fields: [
					"CTGUID",
					"CTCardNo",
					"CTName",
					"CTNikeName",
					"CTMobile"
				]
			});
		}


		if (!Ext.isDefined(Beet.plugins.selectCustomerWindowCustomerListStore)){
			Ext.define("Beet.plugins.selectCustomerWindowCustomerListStore", {
				extend: "Ext.data.Store",
				model: Beet.plugins.selectCustomerWindowCustomerListModel,
				autoLoad: true,
				pageSize: Beet.constants.PageSize,
				b_filter: "",
				load: function(options){
					var me = this;
					options = options || {};
					if (Ext.isFunction(options)) {
						options = {
							callback: options
						};
					}

					Ext.applyIf(options, {
						groupers: me.groupers.items,
						page: me.currentPage,
						start: (me.currentPage - 1) * me.pageSize,
						limit: me.pageSize,
						addRecords: false
					});      
					me.proxy.b_params["start"] = options["start"];
					me.proxy.b_params["limit"] = options["limit"]

					return me.callParent([options]);
				},
				proxy: {
					type: "b_proxy",
					b_method: Beet.constants.customerServer.GetCustomerPageData,
					startParam: "start",
					limitParam: "limit",
					b_params: {
						"filter": where
					},
					b_scope: Beet.constants.customerServer,
					reader: {
						type: "json",
						root: "Data",
						totalProperty: "TotalCount"
					}
				}
			});
		}

		me.storeProxy = Ext.create("Beet.plugins.selectCustomerWindowCustomerListStore");
		me.createSelectorForm();
	},
	createSelectorForm: function(){
		var form, me = this, customerServer = Beet.constants.customerServer;
		var sm = Ext.create("Ext.selection.CheckboxModel", {
			mode: me.b_selectionMode ? me.b_selectionMode : "MULTI"	
		});
		me.selModel = sm;
		

		form = Ext.create("Beet.plugins.LiveSearch", {
			store: me.storeProxy,
			selModel: sm,
			frame: true,
			collapsible: false,	
			rorder: false,
			bodyBorder: false,
			autoScroll: true,
			autoHeight: true,
			border: 0,
			columnLines: true,
			viewConfig: {
				trackOver: false,
				stripeRows: true
			},
			columns: [
				me.viewCustomerInfo,
				{
					text: "会员卡号",
					flex: 1,
					dataIndex: "CTCardNo"
				},
				{
					text: "会员名",
					flex: 1,
					dataIndex: "CTName"
				},
				{
					text: "会员手机",
					flex: 1,
					dataIndex: "CTMobile"
				},
				{
					text: "地址",
					flex: 1,
					dataIndex: "CTAddress"
				}
			],
			tbar: [
				"-",
				{
					xtype: "button",
					text: "高级搜索",
					handler: function(){
						customerServer.GetCustomerPageData(0, 1, "", {
							success: function(data){
								var win = Ext.create("Beet.apps.AdvanceSearch", {
									searchData: Ext.JSON.decode(data),
									b_callback: function(where){
										me.storeProxy.setProxy({
											type: "b_proxy",
											b_method: Beet.constants.customerServer.GetCustomerPageData,
											startParam: "start",
											limitParam: "limit",
											b_params: {
												"filter": where
											},
											b_scope: Beet.constants.customerServer,
											reader: {
												type: "json",
												root: "Data",
												totalProperty: "TotalCount"
											}
										});
										me.storeProxy.loadPage(1)
									}
								})
								win.show();
							},
							failure: function(error){
								Ext.Error.raise(error);
							}
						});
					}
				}
			],
			bbar: Ext.create('Ext.PagingToolbar', {
				store: this.storeProxy,
				displayInfo: true,
				displayMsg: '当前显示 {0} - {1}, 总共{2}条数据',
				emptyMsg: "没有数据"
			})
		});

		me.customerListGrid = form;

		me.add(form)
		me.doLayout();
	},
	buttons: [
		{
			text: "确定",
			handler: function(){
				var me = this, parent = Ext.getCmp("selectCustomerWindow");
				var selectedData = parent.selModel.getSelection();	
				parent._callback(selectedData);
				parent.close();
			}
		},
		{
			text: "取消",
			handler: function(){
				var me = this, parent = Ext.getCmp("selectCustomerWindow");
				parent.close();
			}
		}
	]
});

Ext.define("Beet.plugins.ViewCustomerInfo", {
	extend: "Ext.window.Window",
	width: 900,
	height: 600,
	minHeight: 550,	
	autoHeight: true,
	autoScroll: true,
	cls: "iScroll",
	layout: "fit",
	resizable: true,
	border: false,
	modal: true,
	maximizable: true,
	maximized: true,
	border: 0,
	bodyBorder: false,
	editable: false,
	_rowIndex: null,
	initComponent: function(){
		var me = this, storeProxy = me.storeProxy, customerServer = Beet.constants.customerServer;

		if (me.rawData){
			rawData = me.rawData;
		}else{
			if (me._rowIndex != null){
				var d = storeProxy.getAt(me._rowIndex), rawData = d.data;
				me.rawData = rawData;
			}
		}
		
		//create staff
		me.createTabPanel();
		me.createCustomeBase(rawData);


		me.callParent();
		me.updateCustomerTitle(rawData["CTName"] + " 的会员资料");

		me.add(me.settingTabPanel);
		me.doLayout();

		var _basic = me.settingTabPanel.add({
			title : "基础信息",
			layout: "fit",
			border: 0,
			items: [
				me.customerBaseInfo
			]
		});
		me.settingTabPanel.setActiveTab(_basic);

		var CTGUID = rawData["CTGUID"];
		if (CTGUID){
			customerServer.GetCustomerItemToJson("CTGUID='"+CTGUID+"'", {
				success: function(data){
					data = Ext.JSON.decode(data);
					me.createCustomerAdvanceInfo(rawData, data["Data"]);
				},
				failure: function(error){
					Ext.error.raise(error);
				}
			});
		}
	},
	afterRender: function(){
		var me = this;
		me.callParent();
		//TODO update
		me.updateEnjoyModeValue();
	},
	updateEnjoyModeValue: function(){
		var me = this;
		document.getElementById("customerinfo_enjoymode").childNodes[1].childNodes[0].value = me.rawData.CTEnjoyMode;
	},
	createCustomerAdvanceInfo: function(rawData, customerData){
		var me = this, customerServer = Beet.constants.customerServer, CTName = rawData["CTName"], CTGUID = rawData["CTGUID"];
		var advanceTab = Ext.create("Ext.tab.Panel", {
			border: false,
			plain: true,
			height: "100%",
			bodyBorder: false,
			bodyStyle: 'background-color:#dfe8f5;',
			defaults: {
				border: 0,
				bodyStyle: 'background-color:#dfe8f5;',
				frame: true,
				autoScroll: true,
				autoHeight: true
			},
			items: []
		});
		
		var advanceformConfig = {
			frame: true,
			border: false,
			bodyStyle: 'background-color:#dfe8f5;',
			defaults: {
				margin: "0 0 10 0",
				bodyStyle: 'background-color:#dfe8f5;'
			},
			plain: true,
			height: "100%",
			fieldDefaults: {
				msgTarget: "side",
				labelAlign: "left",
				labelWidth: 75
			},
			items:[
				advanceTab
			],
		};

		if (me.editable){
			advanceformConfig.buttons = [
				{
					text: "提交修改",
					handler: function(widget, e){
						var that = this, form = that.up("form").getForm(), result = form.getValues();
						//if (!form.isValid()){}
						var Items = [], Texts = [], needSubmitData;
						for (var k in result){
							var r = result[k];
							if (k.indexOf("text") > -1 && r !== ""){
								var id = k.split("_")[2];
								Texts.push({ID: id, Text: r});
							}else{
								if (r !== ""){
									if (Ext.isArray(r)){
										for (var _c in r){
											Items.push(r[_c]);
										}	
									}else{
										Items.push(r);
									}
								}
							}
						}
						
						needSubmitData = {
							"CustomerID" : CTGUID
						}
						if (Items.length > 0){
							needSubmitData["Items"] = Items;
						}
						if (Texts.length > 0){
							needSubmitData["Texts"] = Texts;
						}
						
						needSubmitData = Ext.JSON.encode(needSubmitData);
						customerServer.UpdateCustomerItem(CTGUID, needSubmitData, {
							success: function(isSuccess){
								if (isSuccess){
									Ext.MessageBox.show({
										title: "更新成功!",
										msg: "更新成功!",
										buttons: Ext.MessageBox.OK,
										handler: function(btn){
											me.close();
										}
									})
								}
							},
							failure: function(error){
								Ext.Error.raise(error)
							}
						})
					}
				}
			]
		}
		me.advancePanel = Ext.create("Ext.form.Panel", advanceformConfig);

		me.settingTabPanel.add({
			title : "高级信息",
			layout: "fit",
			border: 0,
			items: [
				me.advancePanel
			]
		});

		//高级面板选项
		var _replace = function(target, needId, typeText){
			for (var k in target){
				var _data = target[k];
				if (_data["items"] && _data["items"].length > 0){
					_replace(_data["items"], needId, typeText);
				}
				if (_data["inputValue"] == needId){
					_data["checked"] = true;
				}
				if (_data["_id"] == needId && _data["xtype"] == "textfield"){
					_data["value"] = typeText;
				}

				_data["readOnly"] = !me.editable;
			}
		}

		var serviceItems = Beet.constants.CTServiceType;

		//复制一个 不影响原有的
		var advanceProfile = [], _firsttab;
		advanceProfile = Ext.clone(Beet.cache.advanceProfile);
		
		if (customerData.length > 0){
			for (var k in customerData){
				var _data = customerData[k];
				var st = _data["CustomerType"], typeId = _data["CTTypeID"], typeText = _data["TypeText"];
				if (advanceProfile[st]){
					_replace(advanceProfile[st], typeId, typeText);
				}
			}
		}

		for (var service in serviceItems){
			var title = serviceItems[service], data = advanceProfile[service], items = [];
			if (!data || data.length < 0){continue;}
			var _t = advanceTab.add({
				title : title,
				flex: 1,
				border: 0,
				layout: "anchor",
				height: "100%",
				defaults: {
					margin: "0 0 10 0"
				},
				fieldDefaults: {
					msgTarget : "side",
					labelAlign: "left",
					labelWidth: 75
				},
				items: data
			});

			if (_firsttab == undefined){
				_firsttab = _t;
			}
		}
		advanceTab.setActiveTab(_firsttab);
	},
	updateCustomerTitle: function(title){
		var me = this;
		me.setTitle(title);
	},
	createTabPanel: function(){
		var me = this;
		me.settingTabPanel = Ext.create("Ext.tab.Panel", {
			border: false,
			bodyBorder: false,
			autoHeight: true,
			autoHeight: true,
			plain: true,
			defaults: {
				border: false,
				autoHeight: true,
				autoScroll: true
			},
			items: []
		});
	},
	createCustomeBase: function(rawData){
		var me = this, editable = me.editable, customerServer = Beet.constants.customerServer, CTName = rawData["CTName"], CTGUID = rawData["CTGUID"];
		var basicformConfig = {
			autoHeight: true,
			autoScroll: true,
			border: false,
			bodyBorder: false,
			bodyPadding: 10,
			bodyStyle: 'background-color:#dfe8f5;',
			defaults: {
				bodyStyle: 'background-color:#dfe8f5;',
				margin: "0 0 10 0"
			},
			plain: true,
			flex: 1,
			defaultType: "textfield",
			fieldDefaults: {
				msgTarget: "side",
				labelAlign: "left",
				labelWidth: 75
			},
			items: [
				{
					xtype: "container",
					autoScroll: true,
					autoHeight: true,
					border: false,
					items: [
						{
							layout: 'column',
							border: false,
							bodyStyle: 'background-color:#dfe8f5;',
							defaults: {
								bodyStyle: 'background-color:#dfe8f5;',
								readOnly: !me.editable 
							},
							items: [
								{
									columnWidth: .5,
									border: false,
									layout: 'anchor',
									defaultType: "textfield",
									fieldDefaults: {
										msgTarget: 'side',
										labelAlign: "left",
										labelWidth: 75,
									},
									defaults: {
										readOnly: !me.editable 
									},
									items: [
										{
											fieldLabel: "会员姓名",
											name: "name",
											allowBlank: false,
											value: rawData.CTName,
											dataIndex: "CTName"
										},
										{
											fieldLabel: "会员昵称",
											name: "nike",
											value: rawData.CTNikeName,
											dataIndex: "CTNikeName"
										},
										{
											fieldLabel: "会员性别",
											name: "sex",
											value: parseInt(rawData.CTSex, 10),
											dataIndex: "CTSex",
											xtype: "combobox",
											store: Beet.constants.sexList,
											queryMode: "local",
											displayField: "name",
											valueField: "attr",
											editable: false
										},
										{
											fieldLabel: "婚否",
											name: "marry",
											value: parseInt(rawData.CTMarry, 10),
											dataIndex: "CTMarry",
											xtype: "combobox",
											store: Beet.constants.MarryList,
											queryMode: "local",
											displayField: "name",
											valueField: "attr",
											editable: false
										},
										{
											fieldLabel: "籍贯",
											name: "province",
											value: rawData.CTProvince,
											dataIndex: "CTProvince"
										},
										{
											fieldLabel: "学历",
											name: "education",
											xtype: "combobox",
											store: Beet.constants.EducationList,
											queryMode: "local",
											displayField: "name",
											valueField: "attr",
											value: parseInt(rawData.CTEducation, 10),
											dataIndex: "CTEducation",
											editable: false
										},
										{
											fieldLabel: "入会方式",
											id: "customerinfo_enjoymode",
											name: "enjoymode",
											value: rawData.CTEnjoyMode,
											dataIndex: "CTEnjoyMode",
											xtype: "combobox",
											store: Beet.constants.EnjoyModeList,
											queryMode: "local",
											displayField: "attr",
											valueField: "attr"
										},
										{
											fieldLabel: "资讯更新方式",
											name: "updatemode",
											value: parseInt( rawData.CTUpdateMode, 10),
											dataIndex: "CTUpdateMode",
											xtype: "combobox",
											store: Beet.constants.NewUpdateModes,
											queryMode: "local",
											displayField: "name",
											valueField: "attr",
											editable: false
										},
									]
								},
								{
									columnWidth: .5,
									border: false,
									layout: 'anchor',
									defaultType: "textfield",
									fieldDefaults: {
										msgTarget: 'side',
										labelAlign: "left",
										labelWidth: 75
									},
									defaults: {
										readOnly: !me.editable 
									},
									items: [
										{
											fieldLabel: "身份证",
											name: "personid",
											value: rawData.CTPersonID,
											dataIndex: "CTPersonID"
										},
										{
											fieldLabel: "出生月份",
											name: "month",
											xtype: "combobox",
											editable: false,
											store: Beet.constants.monthesList,
											queryMode: "local",
											displayField: "name",
											valueField: "attr",
											validator: function(value){
												if (value > 12){
													return "输入的月份值太大";
												}else if (value < 1){
													return "输入的月份值太小";
												}
												return true;
											},
											allowBlank: false,
											value: parseInt(rawData.CTBirthdayMonth, 10)
										},
										{
											xtype: "combobox",
											fieldLabel: "出生日期",
											editable: false,
											store: Beet.constants.daysList,
											name: "day",
											queryMode: "local",
											displayField: "name",
											valueField: "attr",
											validator: function(value){
												if (value > 31){
													return "输入的日期太大";
												}else if (value < 1){
													return "输入的日期太小";
												}
												return true;
											},
											allowBlank: false,
											value: parseInt(rawData.CTBirthdayDay, 10)
										},
										{
											fieldLabel: "手机号码",
											name: "mobile",
											validator: function(value){
												var check = new RegExp(/\d+/g);
												if (value.length == 11 && check.test(value)){
													return true;
												}
												return "手机号码输入有误";
											},
											allowBlank: false,
											value: rawData.CTMobile,
											dataIndex: "CTMobile"
										},
										{
											fieldLabel: "座机号码",
											name: "phone",
											value: rawData.CTPhone,
											dataIndex: "CTPhone"
										},
										{
											fieldLabel: "电子邮件",
											name: "email",
											value: rawData.CTEmail,
											dataIndex: "CTEmail"
										},
										{
											fieldLabel: "QQ/MSN",
											name: "im",
											value: rawData.CTIM,
											dataIndex: "CTIM"
										},
										{
											fieldLabel: "地址",
											name: "address",
											allowBlank: false,
											value: rawData.CTAddress,
											dataIndex: "CTAddress"
										},
										{
											fieldLabel: "职业",
											name: "job",
											value: rawData.CTJob,
											dataIndex:"CTJob"
										},
										{	
											fieldLabel: "所属分店",
											name: "storeid",
											xtype: "combobox",
											editable: false,
											store: Beet.cache.branchesList,
											queryMode: "local",
											displayField: "name",
											valueField: "attr",
											value: rawData.CTStoreID,
											dataIndex: "CTStoreID",
											allowBlank: false,
											emptyText: "若不选则由系统智能选择",
											listeners: {
												change: function(field, newvalue){
													if (newvalue == -1){
														field.clearValue();
													}
												}
											}
										},
										//TODO: 专属顾问选择列表
									]
								}
							]
						},
						{
							fieldLabel: "备注",
							name: "descript",
							xtype: "textarea",
							labelAlign: "top",
							readOnly: !me.editable,
							enforceMaxLength: true,
							maxLength: 200,
							width: 400,
							height: 200,
							value: rawData.CTDescript,
							dataIndex: "CTDescript"
						},
						{
							xtype: "component",
							width: 5
						}
					]
				},
			]
		};
		if (me.editable){
			basicformConfig.buttons = [{
				text: "提交修改",
				handler: function(direction, e){
					var _b = this, form = _b.up("form").getForm(), result = form.getValues();
					if (result["name"] != "" && result["mobile"] != ""){
						var needSubmitData = Ext.JSON.encode(result);
						customerServer.UpdateCustomer(CTGUID, needSubmitData, {
							success: function(){
								Ext.MessageBox.show({
									title: "更新成功",
									msg: "更新 " + CTName + " 用户基础资料成功!",
									buttons: Ext.MessageBox.OK,
									fn: function(btn){
										if (me.editable){
											me.storeProxy.loadPage(me.storeProxy.currentPage);
											me.close();
										}
									}
								});	
							},
							failure: function(error){
								Ext.Error.raise(error);
							}
						});
					}
				}
			}];
		}
		var basicform = Ext.widget("form", basicformConfig);

		me.customerBaseInfo = basicform;
	}
});


Ext.define("Beet.plugins.ViewCustomerInfoExtra", {
	extend: "Ext.window.Window",
	width: 700,
	height: 600,
	minHeight: 550,	
	autoHeight: true,
	autoScroll: true,
	resizable: true,
	border: false,
	modal: true,
	maximizable: true,
	border: 0,
	bodyBorder: false,
	editable: false,
	_rowIndex: null,
	initComponent: function(){
		var me = this, storeProxy = me.storeProxy, customerServer = Beet.constants.customerServer;

		//add close button on the bbar
		/*
		me.bbar = [
			"->",
			{
				type: "button",
				text: "关闭",
				handler: function(){
					me.close();
				}
			}
		]*/

		if (me.rawData){
			rawData = me.rawData;
		}else{
			if (me._rowIndex != null){
				var d = storeProxy.getAt(me._rowIndex), rawData = d.data;
				me.rawData = rawData;
			}
		}

		//create staff
		me.createTabPanel();
		me.createCustomeBase(rawData);

		me.callParent();

		me.updateCustomerTitle(rawData["CTName"] + " 的会员资料");
		me.add(me.settingTabPanel);
		me.doLayout();

		var CTGUID = rawData["CTGUID"];
		if (CTGUID){
			customerServer.GetCustomerItemToJson("CTGUID='"+CTGUID+"'", {
				success: function(data){
					data = Ext.JSON.decode(data);
					me.createCustomerAdvanceInfo(rawData, data["Data"]);
				},
				failure: function(error){
					Ext.error.raise(error);
				}
			});
		}
	},
	afterRender: function(){
		var me = this;
		me.callParent();
	},
	updateCustomerTitle: function(title){
		var me = this;
		me.setTitle(title);
	},
	createCustomerAdvanceInfo: function(rawData, customerData){
		var me = this, customerServer = Beet.constants.customerServer, CTName = rawData["CTName"], CTGUID = rawData["CTGUID"];
		var advanceTab = Ext.create("Ext.tab.Panel", {
			border: false,
			plain: true,
			height: 300,
			width: "100%",
			cls: "iScroll",
			bodyBorder: false,
			autoHeight: true,
			autoScroll: true,
			defaults: {
				border: 0,
				frame: true,
				autoScroll: true,
				autoHeight: true
			},
			items: []
		});
		
		var advanceformConfig = {
			border: false,
			width: "100%",
			height: "100%",
			autoHeight: true,
			autoScroll: true,
			flex: 1,
			defaults: {
				bodyStyle: 'background-color:#dfe8f5;',
				readOnly: !me.editable 
			},
			bodyStyle: 'background-color:#dfe8f5;',
			plain: true,
			fieldDefaults: {
				msgTarget: "side",
				labelAlign: "left",
				labelWidth: 75
			},
			items:[
				advanceTab
			],
		};

		me.advancePanel = Ext.create("Ext.panel.Panel", advanceformConfig);


		//高级面板选项
		var _replace = function(target, needId, typeText){
			for (var k in target){
				var _data = target[k];
				if (_data["items"] && _data["items"].length > 0){
					_replace(_data["items"], needId, typeText);
				}
				if (_data["inputValue"] == needId){
					_data["checked"] = true;
				}
				if (_data["_id"] == needId && _data["xtype"] == "textfield"){
					_data["value"] = typeText;
				}

				_data["readOnly"] = !me.editable;
			}
		}

		var serviceItems = Beet.constants.CTServiceType;

		//复制一个 不影响原有的
		var advanceProfile = [], _firsttab;
		advanceProfile = Ext.clone(Beet.cache.advanceProfile);
		
		if (customerData.length > 0){
			for (var k in customerData){
				var _data = customerData[k];
				var st = _data["CustomerType"], typeId = _data["CTTypeID"], typeText = _data["TypeText"];
				if (advanceProfile[st] && advanceProfile[st].length > 0){
					_replace(advanceProfile[st], typeId, typeText);
				}
			}
		}

		for (var service in serviceItems){
			var title = serviceItems[service], data = advanceProfile[service], items = [];
			if (!data || data.length < 0){continue;}
			for (var _k in data){
				data[_k].layout = {
					type : "table",
					columns: 1,
					tableAttrs: {
						cellspacing: 10,
						style: {
							width: "100%"
						}
					}
				}
			}

			var _t = advanceTab.add({
				title : title,
				flex: 1,
				border: 0,
				height: "100%",
				width: "100%",
				autoHeight: true,
				autoScroll: true,
				defaults: {
					margin: "0 0 10 0"
				},
				fieldDefaults: {
					msgTarget : "side",
					labelAlign: "left",
					labelWidth: 75
				},
				items: data
			});

			if (_firsttab == undefined){
				_firsttab = _t;
			}
		}
		advanceTab.setActiveTab(_firsttab);
		advanceTab.doLayout();//update layout
		
		me.advancePanel.doLayout();
		me.settingTabPanel.add(me.advancePanel);
		me.doLayout();
		advanceTab.setHeight(me.advancePanel.getHeight() * 0.6);
	},
	createTabPanel: function(){
		var me = this;
		me.settingTabPanel = Ext.create("Ext.panel.Panel", {
			border: false,
			bodyBorder: false,
			width: "100%",
			height: "100%",
			autoHeight: true,
			autoHeight: true,
			plain: true,
			bodyStyle: 'background-color:#dfe8f5;',
			defaults: {
				border: false,
				bodyStyle: 'background-color:#dfe8f5;',
				autoHeight: true,
				autoScroll: true
			}
		});
	},
	createCustomeBase: function(rawData){
		var me = this, editable = me.editable, customerServer = Beet.constants.customerServer, CTName = rawData["CTName"], CTGUID = rawData["CTGUID"];
		var basicformConfig = {
			autoHeight: true,
			autoScroll: true,
			width: "100%",
			border: false,
			collapsible: true,
			title: "会员基本资料",
			bodyBorder: false,
			plain: true,
			bodyPadding: 5,
			flex: 1,
			items: [
				{
					layout: {
						type: "table",
						columns: 4,
						tableAttrs: {
							cellspacing: 10,
							style: {
								width: "100%"
							}
						}
					},
					border: false,
					bodyStyle: 'background-color:#dfe8f5;',
					defaults: {
						bodyStyle: 'background-color:#dfe8f5;',
						readOnly: !me.editable 
					},
					defaultType: "textfield",
					fieldDefaults: {
						msgTarget: 'side',
						labelAlign: "top",
						labelWidth: 75,
					},
					items:[
						{
							fieldLabel: "会员姓名",
							name: "name",
							allowBlank: false,
							value: rawData.CTName,
							dataIndex: "CTName"
						},
						{
							fieldLabel: "会员昵称",
							name: "nike",
							value: rawData.CTNikeName,
							dataIndex: "CTNikeName"
						},
						{
							fieldLabel: "会员性别",
							name: "sex",
							value: parseInt(rawData.CTSex, 10),
							dataIndex: "CTSex",
							xtype: "combobox",
							store: Beet.constants.sexList,
							queryMode: "local",
							displayField: "name",
							valueField: "attr",
							editable: false
						},
						{
							fieldLabel: "婚否",
							name: "marry",
							value: parseInt(rawData.CTMarry, 10),
							dataIndex: "CTMarry",
							xtype: "combobox",
							store: Beet.constants.MarryList,
							queryMode: "local",
							displayField: "name",
							valueField: "attr",
							editable: false
						},
						{
							fieldLabel: "籍贯",
							name: "province",
							value: rawData.CTProvince,
							dataIndex: "CTProvince"
						},
						{
							fieldLabel: "学历",
							name: "education",
							xtype: "combobox",
							store: Beet.constants.EducationList,
							queryMode: "local",
							displayField: "name",
							valueField: "attr",
							value: parseInt(rawData.CTEducation, 10),
							dataIndex: "CTEducation",
							editable: false
						},
						{
							fieldLabel: "入会方式",
							id: "customerinfo_enjoymode",
							name: "enjoymode",
							value: rawData.CTEnjoyMode,
							dataIndex: "CTEnjoyMode"
						},
						{
							fieldLabel: "资讯更新方式",
							name: "updatemode",
							value: parseInt( rawData.CTUpdateMode, 10),
							dataIndex: "CTUpdateMode",
							xtype: "combobox",
							store: Beet.constants.NewUpdateModes,
							queryMode: "local",
							displayField: "name",
							valueField: "attr",
							editable: false
						},
						{
							fieldLabel: "身份证",
							name: "personid",
							value: rawData.CTPersonID,
							dataIndex: "CTPersonID"
						},
						{
							fieldLabel: "出生月份",
							name: "month",
							xtype: "combobox",
							editable: false,
							store: Beet.constants.monthesList,
							queryMode: "local",
							displayField: "name",
							valueField: "attr",
							validator: function(value){
								if (value > 12){
									return "输入的月份值太大";
								}else if (value < 1){
									return "输入的月份值太小";
								}
								return true;
							},
							allowBlank: false,
							value: parseInt(rawData.CTBirthdayMonth, 10)
						},
						{
							xtype: "combobox",
							fieldLabel: "出生日期",
							editable: false,
							store: Beet.constants.daysList,
							name: "day",
							queryMode: "local",
							displayField: "name",
							valueField: "attr",
							validator: function(value){
								if (value > 31){
									return "输入的日期太大";
								}else if (value < 1){
									return "输入的日期太小";
								}
								return true;
							},
							allowBlank: false,
							value: parseInt(rawData.CTBirthdayDay, 10)
						},
						{
							fieldLabel: "手机号码",
							name: "mobile",
							validator: function(value){
								var check = new RegExp(/\d+/g);
								if (value.length == 11 && check.test(value)){
									return true;
								}
								return "手机号码输入有误";
							},
							allowBlank: false,
							value: rawData.CTMobile,
							dataIndex: "CTMobile"
						},
						{
							fieldLabel: "座机号码",
							name: "phone",
							value: rawData.CTPhone,
							dataIndex: "CTPhone"
						},
						{
							fieldLabel: "电子邮件",
							name: "email",
							value: rawData.CTEmail,
							dataIndex: "CTEmail"
						},
						{
							fieldLabel: "QQ/MSN",
							name: "im",
							value: rawData.CTIM,
							dataIndex: "CTIM"
						},
						{
							fieldLabel: "地址",
							name: "address",
							allowBlank: false,
							value: rawData.CTAddress,
							dataIndex: "CTAddress"
						},
						{
							fieldLabel: "职业",
							name: "job",
							value: rawData.CTJob,
							dataIndex:"CTJob"
						},
						{	
							fieldLabel: "所属分店",
							name: "storeid",
							xtype: "combobox",
							editable: false,
							store: Beet.cache.branchesList,
							queryMode: "local",
							displayField: "name",
							valueField: "attr",
							value: rawData.CTStoreID,
							dataIndex: "CTStoreID",
							allowBlank: false,
							emptyText: "若不选则由系统智能选择",
							listeners: {
								change: function(field, newvalue){
									if (newvalue == -1){
										field.clearValue();
									}
								}
							}
						},
						{
							xtype: "component",
							width: 5
						},
						{
							fieldLabel: "备注",
							colspan: 5,
							name: "descript",
							xtype: "textarea",
							labelAlign: "left",
							readOnly: !me.editable,
							enforceMaxLength: true,
							maxLength: 200,
							width: 570,
							height: 80,
							value: rawData.CTDescript,
							dataIndex: "CTDescript"
						},
					]
				}
			]
		};
		var basicform = Ext.widget("panel", basicformConfig);

		
		me.settingTabPanel.add(basicform);
		me.doLayout();	
		me.customerBaseInfo = basicform;
	}
});

//高级搜索需要的一些元素
//store 如果全局 直接提供出来
//fields
//b_where
//callback
Ext.define("Beet.apps.AdvanceSearch", {
	extend: "Ext.window.Window",
	title: "高级搜索",
	height: 400,
	width: 700,
	layout: "fit",
	closable: true,
	maximizable: true,
	minimizable: true,
	autoScroll: true,
	autoHeight: true,
	resizable: true,
	modal: true,
	border: 0,
	bodyBorder: 0,
	checkable: false,
	initComponent: function(){
		var me = this;
		var form = Ext.create("Beet.apps.AdvanceSearchForm", {
			checkable : me.checkable,
			b_callback: me.b_callback,
			searchData: me.searchData
		});
		form.parent = me;
		me.callParent(arguments);
		me.add(form);
		me.doLayout();
	}
});

Ext.define("Beet.apps.AdvanceSearchForm", {
	extend: "Ext.form.Panel",
	frame: true,
	bodyBorder: 0,
	border: 0,
	height: "100%",
	width: "100%",
	flex: 1,
	autoHeight: true,
	autoScroll: true,
	autoDestory: true,
	plain: true,
	currentIndex: 0,
	initComponent: function(){
		var me = this, customerServer = Beet.constants.customerServer;

		me.advanceFilters = [];
		var metaData = me.searchData["MetaData"];

		for (var k in metaData){
			var item = metaData[k];
			if (!item.FieldHidden && !item.FilterHidden){
				//下拉菜单
				me.advanceFilters.push({
					attr: item.FieldName,
					name: item.FieldLabel,
					_type: item.FieldType
				});
			}
		}

		me.tbar = [
			{
				xtype: "button",
				text: "增加过滤条件",
				icon: "./resources/themes/images/fam/add.png",
				scope: me,
				handler: me.onAddBtnClick
			}
		]
		me.callParent(arguments);
	},
	buttons: [
		{
			text: "搜索",
			handler: function(widget, e){
				var me = this, parent = me.up("form"), form = parent.getForm(), result = form.getValues();
				if (!form.isValid()){
					return;
				}
				var filters = [];
				for (var c in result){
					var item = result[c];
					var key = item[0], op = item[1], value = item[2];
					for (var _s in parent.advanceFilters){
						var filter = parent.advanceFilters[_s];
						if (filter.attr == key){
							switch (filter._type){
								case 1:
								case 2:
								case 9:
								case 11:	
								case 12:
								case 20:
								case 21:
									if (op == "LIKE"){
										value = "'%"+value+"%'";
									}else{
										value = "'"+value + "'";
									}
									break;
								defaults:
									if (op == "LIKE"){
										op = "!=";
									}
									value = value;
									break;
							}
						}
					}
					filters.push(key + " " + op + " " + value);
				}
				parent.search(filters.join(" AND "));
			}
		}
	],
	search: function(where){
		var me = this, customerServer = Beet.constants.customerServer;
		if (me.b_callback){
			me.b_callback(where);
		}

		if (me.parent){
			me.parent.close();
		}
	},
	onAddBtnClick: function(widget, e){
		var me = this;
		me.currentIndex++;

		var FiltersStore = Ext.create("Ext.data.Store", {
			fields: ["attr", "name"],
			data: me.advanceFilters
		});
		
		var filter = new Ext.form.FieldSet({
			layout: "column",
			frame: true,
			title: "搜索条件",
			autoWidth: true,
			defaults: {
				hideLabel: true,
				margin: "0 5 0 0",
				padding: "5 0"
			},
			columnWidth: 0.5,
			id: "customerFilter" + me.currentIndex,
			items: [
				{
					id: "customerFilter" + me.currentIndex + "_dropdown",
					xtype: "combobox",
					allowBlank: false,
					editable: true,
					store: FiltersStore,
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					name: "customerFilter"+me.currentIndex
				},
				{
					id: "customerFilter" + me.currentIndex + "_operater",
					xtype: "combobox",
					width: 75,
					allowBlank: false,
					editable: false,
					store: Beet.constants.OperatorsList,
					queryMode: "local",
					displayField: "name",
					valueField: "attr",
					value: "=",
					name: "customerFilter"+me.currentIndex
				},
				{
					id: "customerFilter" + me.currentIndex + "_value",
					xtype: "textfield",
					allowBlank: false,
					width: 230,
					name: "customerFilter"+me.currentIndex
				},
				{
					xtype: "button",
					icon: "./resources/themes/images/fam/delete.gif",
					margin: "0 0 0 20",
					tooltip: "删除此过滤",
					handler: function(widget, e){
						var parent = widget.up("fieldset");
						parent.removeAll(true);
						me.remove(parent, true);
						me.doLayout();
						me.setAutoScroll(true);
					}
				}
			]
		})

		me.add(filter)
		me.doLayout();
		me.setAutoScroll(true);
	},
});
