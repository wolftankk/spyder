Ext.define("Spyder.plugins.LiveSearch",{
    extend: "Ext.grid.Panel",
    searchValue: null,
    indexes: [],
    currentIndex: null,
    searchRegExp: null,
    regExpMode: false,
    defaultStatusText: "没有找到",
    tagsRe: /<[^>]*>/gm,
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

Spyder.plugins.OperatorsList = Ext.create("Ext.data.Store", {
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

Ext.define("Spyder.plugins.AdvanceSearch", {
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
        var form = Ext.create("Spyder.plugins.AdvanceSearchForm", {
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

Ext.define("Spyder.plugins.AdvanceSearchForm", {
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
        var me = this;

        me.advanceFilters = [];
        var metaData = me.searchData["MetaData"];

        for (var k in metaData){
            var item = metaData[k];
            if (!item.fieldHidden){
                //下拉菜单
                me.advanceFilters.push({
                    attr: item.dataIndex,
                    name: item.fieldName,
                    _type: 21
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
			    op = "LIKE";
                            value = "'%"+value+"%'";
                            //switch (filter._type){
                            //    case 21:
                            //        if (op == "LIKE"){
                            //            value = "'%"+value+"%'";
                            //        }else{
                            //            value = "'"+value + "'";
                            //        }
                            //        break;
                            //    defaults:
                            //        if (op == "LIKE"){
                            //            op = "!=";
                            //        }
                            //        value = value;
                            //        break;
                            //}
                        }
                    }
                    filters.push(key + " " + op + " " + value);
                }
                parent.search(filters.join(" AND "));
            }
        }
    ],
    search: function(where){
        var me = this;
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
                    store: Spyder.plugins.OperatorsList,
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
