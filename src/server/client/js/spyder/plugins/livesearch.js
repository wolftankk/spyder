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
