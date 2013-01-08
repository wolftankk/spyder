var Typecho = {};
Typecho.guid = function(c, d) {
    var b = $(c);
    if (null == b) {
        return
    }
    var h = b.getElements("dt");
    var f = b.getElements("dd");
    var a = null,
        e = null,
        i = null;
    var g = {
        reSet: function() {
            h.removeClass("current");
            f.setStyle("display", "none")
        },
        popUp: function(k) {
            k = a = $(k) || k;
            k.addClass("current");
            var j = k.getNext("dd");
            if (j) {
                j.setStyle("left", k.getPosition()
                    .x - k.getParent("dl")
                    .getPosition()
                    .x - d.offset);
                if (j.getStyle("display") != "none") {
                    j.setStyle("display", "none")
                } else {
                    j.setStyle("display", "block");
                    j.getElement("ul li:first-child")
                        .setStyle("border-top", "none");
                    j.getElement("ul li:last-child")
                        .setStyle("border-bottom", "none");
                    if (Browser.Engine.trident) {
                        j.getElements("ul li")
                            .setStyle("width", j.getCoordinates()
                            .width - 22)
                    }
                }
            }
        }
    };
    if (d.type == "mouse") {
        h.addEvent("mouseenter", function(j) {
            e = $clear(e);
            g.reSet();
            if (j.target.nodeName.toLowerCase() == "a") {
                j.target = $(j.target)
                    .getParent("dt")
            }
            g.popUp(j.target)
        });
        h.addEvent("mouseout", function(j) {
            if (!e) {
                e = g.reSet.delay(500)
            }
        });
        f.addEvent("mouseenter", function(j) {
            if (e) {
                e = $clear(e)
            }
        });
        f.addEvent("mouseleave", function(j) {
            if (!e) {
                e = g.reSet.delay(50)
            }
        })
    }
    if (d.type == "click") {
        h.addEvent("click", function(j) {
            g.reSet();
            if (j.target.nodeName.toLowerCase() == "a") {
                j.target = $(j.target)
                    .getParent("dt")
            }
            g.popUp(j.target);
            j.stop()
        });
        $(document)
            .addEvent("click", g.reSet)
    }
    return g
};
Typecho.Table = {
    table: null,
    draggable: false,
    draggedEl: null,
    draggedFired: false,
    init: function(a) {
        $(document)
            .getElements(a)
            .each(function(b) {
            Typecho.Table.table = b;
            Typecho.Table.draggable = b.hasClass("draggable");
            Typecho.Table.bindButtons();
            Typecho.Table.reset()
        })
    },
    reset: function() {
        var c = Typecho.Table.table;
        Typecho.Table.draggedEl = null;
        if ("undefined" == typeof(c._childTag)) {
            switch (c.get("tag")) {
            case "ul":
                c._childTag = "li";
                break;
            case "table":
                c._childTag = "tr";
                break;
            default:
                break
            }
            var b = c.getElements(c._childTag + " input[type=checkbox]")
                .each(function(d) {
                d._parent = d.getParent(Typecho.Table.table._childTag);
                d.addEvent("click", Typecho.Table.checkBoxClick)
            })
        }
        var a = c.getElements(c._childTag + ".even")
            .length > 0;
        c.getElements(c._childTag)
            .filter(function(e, d) {
            return "tr" != e.get("tag") || 0 == e.getChildren("th")
                .length
        })
            .each(function(e, d) {
            if (a) {
                if (d % 2) {
                    e.removeClass("even")
                } else {
                    e.addClass("even")
                }
                if (e.hasClass("checked") || e.hasClass("checked-even")) {
                    e.removeClass(d % 2 ? "checked-even" : "checked")
                        .addClass(d % 2 ? "checked" : "checked-even")
                }
            }
            Typecho.Table.bindEvents(e)
        })
    },
    checkBoxClick: function(a) {
        var b = $(this);
        if (b.getProperty("checked")) {
            b.setProperty("checked", false);
            b._parent.removeClass(b._parent.hasClass("even") ? "checked-even" : "checked");
            Typecho.Table.unchecked(this, b._parent)
        } else {
            b.setProperty("checked", true);
            b._parent.addClass(b._parent.hasClass("even") ? "checked-even" : "checked");
            Typecho.Table.checked(this, b._parent)
        }
    },
    itemMouseOver: function(a) {
        if (!Typecho.Table.draggedEl || Typecho.Table.draggedEl == this) {
            $(this)
                .addClass("hover");
            if (Browser.Engine.trident) {
                $(this)
                    .getElements(".hidden-by-mouse")
                    .setStyle("display", "inline")
            }
        }
    },
    itemMouseLeave: function(a) {
        if (!Typecho.Table.draggedEl || Typecho.Table.draggedEl == this) {
            $(this)
                .removeClass("hover");
            if (Browser.Engine.trident) {
                $(this)
                    .getElements(".hidden-by-mouse")
                    .setStyle("display", "none")
            }
        }
    },
    itemClick: function(a) {
        if ("undefined" != typeof(a)) {
            var c = $(this)
                .getElement("input[type=checkbox]"),
                b = $(a.target);
            if (c && ("a" != b.get("tag") && ("input" != b.get("tag") || ("text" != b.get("type") && "button" != b.get("type") && "submit" != b.get("type"))) && "textarea" != b.get("tag") && "label" != b.get("tag") && "img" != b.get("tag") && "button" != b.get("tag"))) {
                c.fireEvent("click")
            }
        }
    },
    itemMouseDown: function(a) {
        if (!Typecho.Table.draggedEl) {
            Typecho.Table.draggedEl = this;
            Typecho.Table.draggedFired = false;
            return false
        }
    },
    itemMouseMove: function(a) {
        if (Typecho.Table.draggedEl) {
            if (!Typecho.Table.draggedFired) {
                Typecho.Table.dragStart(this);
                $(this)
                    .setStyle("cursor", "move");
                Typecho.Table.draggedFired = true
            }
            if (Typecho.Table.draggedEl != this) {
                if ($(this)
                    .getCoordinates(Typecho.Table.draggedEl)
                    .top < 0) {
                    $(this)
                        .inject(Typecho.Table.draggedEl, "after")
                } else {
                    $(this)
                        .inject(Typecho.Table.draggedEl, "before")
                }
                if ($(this)
                    .hasClass("even")) {
                    if (!$(Typecho.Table.draggedEl)
                        .hasClass("even")) {
                        $(this)
                            .removeClass("even");
                        $(Typecho.Table.draggedEl)
                            .addClass("even")
                    }
                    if ($(this)
                        .hasClass("checked-even") && !$(Typecho.Table.draggedEl)
                        .hasClass("checked-even")) {
                        $(this)
                            .removeClass("checked-even");
                        $(Typecho.Table.draggedEl)
                            .addClass("checked-even")
                    }
                } else {
                    if ($(Typecho.Table.draggedEl)
                        .hasClass("even")) {
                        $(this)
                            .addClass("even");
                        $(Typecho.Table.draggedEl)
                            .removeClass("even")
                    }
                    if ($(this)
                        .hasClass("checked") && $(Typecho.Table.draggedEl)
                        .hasClass("checked")) {
                        $(this)
                            .removeClass("checked");
                        $(Typecho.Table.draggedEl)
                            .addClass("checked")
                    }
                }
                return false
            }
        }
    },
    itemMouseUp: function(d) {
        if (Typecho.Table.draggedEl) {
            var c = Typecho.Table.table.getElements(Typecho.Table.table._childTag + " input[type=checkbox]");
            var a = "";
            for (var b = 0; b < c.length; b++) {
                if (a.length > 0) {
                    a += "&"
                }
                a += c[b].name + "=" + c[b].value
            }
            if (Typecho.Table.draggedFired) {
                $(this)
                    .fireEvent("click");
                $(this)
                    .setStyle("cursor", "");
                Typecho.Table.dragStop(this, a);
                Typecho.Table.draggedFired = false;
                Typecho.Table.reset()
            }
            Typecho.Table.draggedEl = null;
            return false
        }
    },
    checked: function(a, b) {
        return false
    },
    unchecked: function(a, b) {
        return false
    },
    dragStart: function(a) {
        return false
    },
    dragStop: function(b, a) {
        return false
    },
    bindButtons: function() {
        $(document)
            .getElements(".typecho-table-select-all")
            .addEvent("click", function() {
            Typecho.Table.table.getElements(Typecho.Table.table._childTag + " input[type=checkbox]")
                .each(function(a) {
                if (!a.getProperty("checked")) {
                    a.fireEvent("click")
                }
            })
        });
        $(document)
            .getElements(".typecho-table-select-none")
            .addEvent("click", function() {
            Typecho.Table.table.getElements(Typecho.Table.table._childTag + " input[type=checkbox]")
                .each(function(a) {
                if (a.getProperty("checked")) {
                    a.fireEvent("click")
                }
            })
        });
        $(document)
            .getElements(".typecho-table-select-submit")
            .addEvent("click", function() {
            var b = this.get("lang");
            var a = b ? confirm(b) : true;
            if (a) {
                var c = Typecho.Table.table.getParent("form");
                c.getElement("input[name=do]")
                    .set("value", $(this)
                    .getProperty("rel"));
                c.submit()
            }
        })
    },
    bindEvents: function(a) {
        a.removeEvents();
        a.addEvents({
            mouseover: Typecho.Table.itemMouseOver,
            mouseleave: Typecho.Table.itemMouseLeave,
            click: Typecho.Table.itemClick
        });
        if (Typecho.Table.draggable && Typecho.Table.table.getElements(Typecho.Table.table._childTag + " input[type=checkbox]")
            .length > 0) {
            a.addEvents({
                mousedown: Typecho.Table.itemMouseDown,
                mousemove: Typecho.Table.itemMouseMove,
                mouseup: Typecho.Table.itemMouseUp
            })
        }
    }
};
Typecho.toggleEl = null;
Typecho.toggleBtn = null;
Typecho.toggleHideWord = null;
Typecho.toggleOpened = false;
Typecho.toggle = function(e, c, b, a) {
    var d = $(document)
        .getElement(e);
    if (null != Typecho.toggleBtn && c != Typecho.toggleBtn) {
        $(Typecho.toggleBtn)
            .set("html", Typecho.toggleHideWord);
        Typecho.toggleEl.setStyle("display", "none");
        Typecho.toggleEl.fireEvent("tabHide");
        $(Typecho.toggleBtn)
            .toggleClass("close")
    }
    $(c)
        .toggleClass("close");
    if ("none" == d.getStyle("display")) {
        $(c)
            .set("html", b);
        d.setStyle("display", "block");
        d.fireEvent("tabShow");
        Typecho.toggleOpened = true
    } else {
        $(c)
            .set("html", a);
        d.setStyle("display", "none");
        d.fireEvent("tabHide");
        Typecho.toggleOpened = false
    }
    Typecho.toggleEl = d;
    Typecho.toggleBtn = c;
    Typecho.toggleHideWord = a
};
Typecho.autoSave = new Class({
    Implements: [Options],
    options: {
        time: 10,
        getContentHandle: null,
        messageElement: null,
        leaveMessage: "leave?",
        form: null
    },
    initialize: function(b, a) {
        this.setOptions(a);
        this.duration = 0;
        this.start = false;
        this.url = b;
        this.rev = 0;
        this.saveRev = 0;
        window.onbeforeunload = this.leaveListener.bind(this);
        $(this.options.form)
            .getElements(".submit button")
            .addEvent("mousedown", (function() {
            this.saveRev = this.rev
        })
            .bind(this));
        (function() {
            if (this.start) {
                this.duration++
            }
            if (this.duration > this.options.time) {
                this.start = false;
                this.onContentChange()
            }
        })
            .periodical(1000, this)
    },
    leaveListener: function() {
        if (this.saveRev != this.rev) {
            return this.options.leaveMessage
        }
    },
    onContentChange: function() {
        this.start = true;
        this.rev++;
        if (this.duration > this.options.time) {
            var a = {
                text: this.options.getContentHandle()
            };
            this.start = false;
            this.duration = 0;
            this.saveText = a.text;
            this.saveRev = this.rev;
            $(this.options.form)
                .getElement("input[name=do]")
                .set("value", "save");
            new Request.JSON({
                url: this.url,
                onSuccess: (function(b) {
                    if (b.success) {
                        $(this.options.form)
                            .getElement("input[name=cid]")
                            .set("value", b.cid)
                    }
                    if (null != this.options.messageElement) {
                        $(this.options.messageElement)
                            .set("html", b.message);
                        $(this.options.messageElement)
                            .highlight("#ff0000")
                    }
                })
                    .bind(this)
            })
                .send($(this.options.form)
                .toQueryString() + "&" + Hash.toQueryString(a))
        }
    }
});
Typecho.textarea = new Class({
    Implements: [Options],
    options: {
        resizeAble: false,
        resizeClass: "size-btn",
        resizeUrl: "",
        autoSave: false,
        autoSaveMessageElement: null,
        autoSaveLeaveMessage: "leave?",
        autoSaveTime: 60,
        minSize: 30
    },
    initialize: function(c, b) {
        this.textarea = $(document)
            .getElement(c);
        this.range = null;
        this.setOptions(b);
        if (this.options.autoSave) {
            this.autoSave = new Typecho.autoSave(this.textarea.getParent("form")
                .getProperty("action"), {
                time: this.options.autoSaveTime,
                getContentHandle: this.getContent.bind(this),
                messageElement: this.options.autoSaveMessageElement,
                leaveMessage: this.options.autoSaveLeaveMessage,
                form: this.textarea.getParent("form")
            })
        }
        var a = this.recordRange.bind(this);
        this.textarea.addEvents({
            mouseup: a,
            keyup: (function() {
                a();
                if (this.options.autoSave) {
                    this.autoSave.onContentChange()
                }
            })
                .bind(this)
        });
        if (this.options.resizeAble) {
            this.makeResizeAble()
        }
    },
    recordRange: function() {
        this.range = this.textarea.getSelectedRange()
    },
    makeResizeAble: function() {
        this.resizeOffset = this.textarea.getStyle("height") ? this.textarea.getSize()
            .y - parseInt(this.textarea.getStyle("height")) : 0;
        this.resizeMouseY = 0;
        this.lastMouseY = 0;
        this.isResizePressed = false;
        var a = new Element("span", {
            "class": this.options.resizeClass,
            events: {
                mousedown: this.resizeMouseDown.bind(this)
            }
        })
            .inject(this.textarea, "after");
        $(document)
            .addEvents({
            mouseup: this.resizeMouseUp.bind(this),
            mousemove: this.resizeMouseMove.bind(this)
        });
        this.resizeListener.periodical(10, this)
    },
    resizeListener: function() {
        if (this.isResizePressed) {
            var a = (0 == this.lastMouseY) ? 0 : this.resizeMouseY - this.lastMouseY;
            this.lastMouseY = this.resizeMouseY;
            var b = this.textarea.getSize()
                .y - this.resizeOffset + a;
            if (b > this.options.minSize) {
                this.textarea.setStyle("height", b)
            }
        }
    },
    resizeMouseDown: function(a) {
        this.isResizePressed = true;
        a.stop()
    },
    resizeMouseUp: function(b) {
        if (this.isResizePressed) {
            this.isResizePressed = false;
            var a = this.textarea.getSize()
                .y - this.resizeOffset;
            new Request({
                method: "post",
                url: this.options.resizeUrl
            })
                .send("size=" + a + "&do=editorResize");
            this.resizeMouseY = 0;
            this.lastMouseY = 0
        }
    },
    resizeMouseMove: function(a) {
        if (this.isResizePressed) {
            this.resizeMouseY = a.page.y
        }
    },
    getContent: function() {
        return this.textarea.get("value")
    },
    setContent: function(b, e) {
        var a = (null == this.range) ? this.textarea.getSelectedRange() : this.range,
            d = this.textarea.get("value"),
            f = d.substr(a.start, a.end - a.start),
            c = this.textarea.scrollTop;
        this.textarea.set("value", d.substr(0, a.start) + b + f + e + d.substr(a.end));
        (function() {
            this.textarea.scrollTop = c
        })
            .bind(this)
            .delay(0);
        this.textarea.focus();
        this.textarea.selectRange(a.start, a.end + b.length + e.length)
    }
});
Typecho.autoComplete = function(k, i) {
    var g = ",",
        q, h = -1,
        m = false,
        p = 0,
        o = $(document)
            .getElement(k)
            .setProperty("autocomplete", "off");
    var e = function() {
        var s = 0,
            t = o.get("value");
        q = [];
        if (t.length > 0) {
            t.split(g)
                .each(function(x, v) {
                var u = s + x.length,
                    w = 0,
                    y = 0;
                x = x.replace(/(\s*)(.*)(\s*)/, function(B, A, z, C) {
                    w = A.length;
                    y = C.length;
                    return z
                });
                q[v] = {
                    txt: x,
                    start: v * 1 + s,
                    end: v * 1 + u,
                    offsetStart: v * 1 + s + w,
                    offsetEnd: v * 1 + u - y
                };
                s = u
            })
        }
    };
    var l = function(t, u) {
        return u ? u.txt.substr(0, t - u.offsetStart) : ""
    };
    var r = function(s) {
        var u = s.length > 0 ? i.filter(function(v) {
            return 0 == v.indexOf(s)
        }) : [];
        var t = s.length > 0 ? i.filter(function(v) {
            return (0 == v.toLowerCase()
                .indexOf(s.toLowerCase()) && !u.contains(v))
        }) : [];
        return u.extend(t)
    };
    var a = function(t, u) {
        o.selectRange(u.offsetStart > t ? u.offsetStart : t, u.offsetEnd)
    };
    var f = function(u) {
        for (var t in q) {
            if (u >= q[t].start && u <= q[t].end) {
                return q[t]
            }
        }
        return false
    };
    var j = function(t, u, v) {
        var x = o.get("value");
        return o.set("value", x.substr(0, u) + t + x.substr(v))
    };
    var n = function(s, t) {
        h = -1;
        m = false;
        var u = new Element("ul", {
            "class": "autocompleter-choices",
            styles: {
                width: o.getSize()
                    .x - 2,
                left: o.getPosition()
                    .x,
                top: o.getPosition()
                    .y + o.getSize()
                    .y
            }
        });
        t.each(function(w, v) {
            u.grab(new Element("li", {
                rel: v,
                html: '<span class="autocompleter-queried">' + w.substr(0, s.length) + "</span>" + w.substr(s.length),
                events: {
                    mouseover: function() {
                        m = true;
                        this.addClass("autocompleter-hover")
                    },
                    mouseleave: function() {
                        m = false;
                        this.removeClass("autocompleter-hover")
                    },
                    click: function() {
                        var z = parseInt(this.get("rel"));
                        var y = p > 0 ? p : o.getSelectedRange()
                            .start,
                            x = f(y);
                        j(t[z], x.offsetStart, x.offsetEnd);
                        e();
                        x = f(y);
                        o.selectRange(x.offsetEnd, x.offsetEnd);
                        d()
                    }
                }
            }))
        });
        $(document)
            .getElement("body")
            .grab(u)
    };
    var d = function() {
        var s = $(document)
            .getElement(".autocompleter-choices");
        if (s) {
            s.destroy();
            m = false
        }
    };
    e();
    var c, b;
    o.addEvents({
        mouseup: function(u) {
            var t = o.getSelectedRange()
                .start,
                s = f(t);
            d();
            a(t, s);
            this.fireEvent("keyup", u);
            p = o.getSelectedRange()
                .end;
            u.stop();
            return false
        },
        blur: function() {
            if (!m) {
                d()
            }
        },
        keydown: function(u) {
            e();
            var t = o.getSelectedRange()
                .start,
                s = f(t);
            p = o.getSelectedRange()
                .end;
            switch (u.key) {
            case "up":
                if (b.length > 0 && h >= 0) {
                    if (h < b.length) {
                        $(document)
                            .getElement(".autocompleter-choices li[rel=" + h + "]")
                            .removeClass("autocompleter-selected")
                    }
                    if (h > 0) {
                        h--
                    } else {
                        h = b.length - 1
                    }
                    $(document)
                        .getElement(".autocompleter-choices li[rel=" + h + "]")
                        .addClass("autocompleter-selected");
                    j(b[h], s.offsetStart, s.offsetEnd);
                    e();
                    s = f(t);
                    a(t, s)
                }
                u.stop();
                return false;
            case "down":
                if (b.length > 0 && h < b.length) {
                    if (h >= 0) {
                        $(document)
                            .getElement(".autocompleter-choices li[rel=" + h + "]")
                            .removeClass("autocompleter-selected")
                    }
                    if (h < b.length - 1) {
                        h++
                    } else {
                        h = 0
                    }
                    $(document)
                        .getElement(".autocompleter-choices li[rel=" + h + "]")
                        .addClass("autocompleter-selected");
                    j(b[h], s.offsetStart, s.offsetEnd);
                    e();
                    s = f(t);
                    a(t, s)
                }
                u.stop();
                return false;
            case "enter":
                d();
                o.selectRange(s.offsetEnd, s.offsetEnd);
                u.stop();
                return false;
            default:
                break
            }
        },
        keyup: function(u) {
            e();
            var t = o.getSelectedRange()
                .start,
                s = f(t);
            p = o.getSelectedRange()
                .end;
            switch (u.key) {
            case "left":
            case "right":
            case "backspace":
            case "delete":
            case "esc":
                d();
                u.key = "a";
                this.fireEvent("keyup", u, 1000);
                break;
            case "enter":
                return false;
            case "up":
            case "down":
                return false;
            case "space":
            default:
                d();
                c = l(t, s);
                b = r(c);
                if (b.length > 0) {
                    a(t, s);
                    n(c, b)
                }
                break
            }
        }
    })
};
