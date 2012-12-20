function openWin(url,w,h){
  var width = w||500, height = h||500;
  window.open(url, 'mywin', 'width='+width+',height='+height+',toolbar=0,resizable=0');
}
Typecho.replaceText = {
  init: function(){
    $(document).getElements("*[rel='replace']").each(function(el){
      $(el).addEvent("click",function(){
        var obj = $(el).get("data-target"),
        t = $(el).get("text");
        Typecho.replaceText.replace(t, obj);
      });
    });
  },
  replace: function(t, obj){
    replaceText(t, obj);
  }
}
function previewcreateLink() {
  var max = $("createLinkPane").getElement("[name=max]").get("value")*1,
  step = $("createLinkPane").getElement("[name=step]").get("value")*1,
  start = $("createLinkPane").getElement("[name=start]").get("value")*1,
  link = $("createLinkPane").getElement("[name=link_name]").get("value"),
  zero = $("createLinkPane").getElement("[name=zero]"),
  data = "",
  a = start;
  for (var i=0; i < max; i++) {
    if(i == 4 && max > 5) {
      data += "........\n";
      break;
    }
    var b = (zero.checked && a < 10) ? "0"+a : a;
    data += link.replace("(*)", b)+"\n";
    a += (step);
  };
  if(max > 5) data += link.replace("(*)", (start+step*(max-1)));
  $("createLinkPane").getElementById("createLinkText").set("value", data);
}
function previewdateLink() {
  var max = $("dateLinkPane").getElement("[name=max]").get("value")*1,
  date_style = $("dateLinkPane").getElement("[name=date_style]").get("value"),
  link = $("dateLinkPane").getElement("[name=date_link]").get("value"),
  data = "";
  for (var i=0; i <= max; i++) {
    var b = moment().add('hours', 24*i).format(date_style);
    data += link.replace("(*)", b)+"\n";
  };
  $("dateLinkPane").getElementById("dateLinkText").set("value", data);
}
var replaceText = function(t, obj) {
 var textarea = document.getElementById(obj);
 var rangeData = getCursorPosition(textarea);
 if (rangeData == null) {
  return;
 }
 var i = rangeData.start;
 var all = textarea.value;
 var temp1 = all.substring(0, i);
 var temp2 = all.substring(i);
 var temp3 = t + temp2.substring(rangeData.text.length);
 textarea.value = temp1 + temp3;
}
var getCursorPosition = function(textarea) {
 var rangeData = {
  text : "",
  start : 0,
  end : 0
 };
 textarea.focus();
 if (textarea.setSelectionRange) { // W3C
  rangeData.start = textarea.selectionStart;
  rangeData.end = textarea.selectionEnd;
  rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
 } else if (document.selection) { // IE
  var i, oS = document.selection.createRange(),
  oR = document.body.createTextRange();
  oR.moveToElementText(textarea);
  rangeData.text = oS.text;
  rangeData.bookmark = oS.getBookmark();
  for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0
    && oS.moveStart("character", -1) !== 0; i++) {
   if (textarea.value.charAt(i) == '\n') {
    i++;
   }
  }
  rangeData.start = i;
  rangeData.end = rangeData.text.length + rangeData.start;
 }
 if (rangeData.text == ""
   || (rangeData.text.length + 2) == textarea.value.length) {
  return null;
 } else {
  return rangeData;
 }
}
Typecho.Tab = {
  init: function(el){
    $(document).getElements(el).each(function(b){
      $(b).getElements(".typecho-option-tabs li a").each(function(c){
        $(c).addEvent("click", function(){
          Typecho.Tab.hide(b);
          Typecho.Tab.show(c);
        });
      });
    });
    var _href = location.href;
    if (_href.indexOf("#") != -1) {
      $(document).getElements("a[href$="+location.hash.replace("#","")+"]").fireEvent("click");
    }
  },
  hide: function(el){
    $(el).getElements(".typecho-option-tabs li").each(function(c){
      $(c).removeClass("current");
    });
    $(el).getElements(".typecho-option-tabPane").each(function(c){
      $(c).addClass("hidden");
    });
  },
  show: function(el){
    var id = $(el).get("href").replace("#","");
    $("urltype") && $("urltype").set("value", id);
    $(el).getParent("li").addClass("current");
    $(id+"Pane").removeClass("hidden");
  }
};
(function () {
  window.addEvent('domready', function() {
      var _d = $(document);
      var handle = new Typecho.guid('typecho:guid', {offset: 1, type: 'mouse'});
            
      //增加高亮效果
      (function () {
          var _hlId = '';
                
          if (_hlId) {
              var _hl = _d.getElement('#' + _hlId);
                    
              if (_hl) {
                  _hl.set('tween', {duration: 1500});
            
                  var _bg = _hl.getStyle('background-color');
                  if (!_bg || 'transparent' == _bg) {
                      _bg = '#F7FBE9';
                  }

                  _hl.tween('background-color', '#AACB36', _bg);
              }
          }
      })();

      //增加淡出效果
      (function () {
          var _msg = _d.getElement('.popup');
            
          if (_msg) {
              (function () {

                  var _messageEffect = new Fx.Morph(this, {
                      duration: 'short', 
                      transition: Fx.Transitions.Sine.easeOut
                  });

                  _messageEffect.addEvent('complete', function () {
                      this.element.setStyle('display', 'none');
                  });

                  _messageEffect.start({'margin-top': [30, 0], 'height': [21, 0], 'opacity': [1, 0]});

              }).delay(5000, _msg);
          }
      })();
            
      //增加滚动效果,滚动到上面的一条error
      (function () {
          var _firstError = _d.getElement('.typecho-option .error');
    
          if (_firstError) {
              var _errorFx = new Fx.Scroll(window).toElement(_firstError.getParent('.typecho-option'));
          }
      })();

      //禁用重复提交
      (function () {
          _d.getElements('input[type=submit]').removeProperty('disabled');
          _d.getElements('button[type=submit]').removeProperty('disabled');
    
          var _disable = function (e) {
              e.stopPropagation();
                    
              this.setProperty('disabled', true);
              this.getParent('form').submit();
                    
              return false;
          };

          _d.getElements('input[type=submit]').addEvent('click', _disable);
          _d.getElements('button[type=submit]').addEvent('click', _disable);
      })();

      //打开链接
      (function () {
                
          _d.getElements('a').each(function (item) {
              var _href = item.href;
                    
              if (_href && 0 != _href.indexOf('#')) {
                  //确认框
                  item.addEvent('click', function (event) {
                      var _lang = this.get('lang');
                      var _c = _lang ? confirm(_lang) : true;
                
                      if (!_c) {
                          event.stop();
                      }
                  });
        
                  /** 如果匹配则继续 */
                  if (/^http\:\/\/local\.site\/typecho\/admin\/.*$/.exec(_href) 
                      || /^http\:\/\/local\.site\/typecho\/index\.php\/action\/[_a-zA-Z0-9\/]+.*$/.exec(_href)) {
                      return;
                  }
            
                  //item.set('target', '_blank');
              }
          });
      })();
            
      Typecho.Table.init('.typecho-list-table');
      Typecho.Table.init('.typecho-list-notable');
      Typecho.replaceText.init();
  });
})();