function SpyderWebsiteSvc(url){
    this.url = url
}

SpyderWebsiteSvc.prototype.AddWebsite = function(WebsiteJSON, __callback){
    var method = "website.AddWebsite";
    var __message = {
        method: method,
        params: {
            WebsiteJSON: WebsiteJSON
        }
    }

    var __callbacks = null
    if (__callback){
        __callbacks = {
            callback: __callback,
            success: function(o){
                var __result = JSON.parse(o.responseText);
                if (__result.error){
                    if ((typeof this.callback == "object") && this.callback.failure){
                        this.callback.failure(__result.error);
                    }
                }else{
                    if ((typeof this.callback == "object") && this.callback.success){
                        this.callback.success(__result.result);
                    }else{
                        this.callback(__result.result);
                    }
                }
            },
            failure: function(o){
                if ((typeof this.callback == "object") && this.callback.failure){
                    this.callback.failure(o);
                }
            },
            timeout: 3000
        }
    }

    Spyder.Ajax.asyncRequest("POST", this.url+method, __callbacks, Ext.JSON.encode(__message));
}

SpyderWebsiteSvc.prototype.EditWebsite = function(WID, WebsiteJSON, __callback){
    var method = "website.EditWebsite";
    var __message = {
        method: method,
        params: {
            WID: WID,
            WebsiteJSON: WebsiteJSON
        }
    }

    var __callbacks = null
    if (__callback){
        __callbacks = {
            callback: __callback,
            success: function(o){
                var __result = JSON.parse(o.responseText);
                if (__result.error){
                    if ((typeof this.callback == "object") && this.callback.failure){
                        this.callback.failure(__result.error);
                    }
                }else{
                    if ((typeof this.callback == "object") && this.callback.success){
                        this.callback.success(__result.result);
                    }else{
                        this.callback(__result.result);
                    }
                }
            },
            failure: function(o){
                if ((typeof this.callback == "object") && this.callback.failure){
                    this.callback.failure(o);
                }
            },
            timeout: 3000
        }
    }

    Spyder.Ajax.asyncRequest("POST", this.url+method, __callbacks, Ext.JSON.encode(__message));
}

SpyderWebsiteSvc.prototype.DeleteWebsite = function(WID, __callback){
    var method = "website.DeleteWebsite";
    var __message = {
        method: method,
        params: {
            WID: WID
        }
    }

    var __callbacks = null
    if (__callback){
        __callbacks = {
            callback: __callback,
            success: function(o){
                var __result = JSON.parse(o.responseText);
                if (__result.error){
                    if ((typeof this.callback == "object") && this.callback.failure){
                        this.callback.failure(__result.error);
                    }
                }else{
                    if ((typeof this.callback == "object") && this.callback.success){
                        this.callback.success(__result.result);
                    }else{
                        this.callback(__result.result);
                    }
                }
            },
            failure: function(o){
                if ((typeof this.callback == "object") && this.callback.failure){
                    this.callback.failure(o);
                }
            },
            timeout: 3000
        }
    }

    Spyder.Ajax.asyncRequest("POST", this.url+method, __callbacks, Ext.JSON.encode(__message));
}

SpyderWebsiteSvc.prototype.GetWebsiteList = function(start, limit, AWhere, __callback){
    var method = "website.GetWebsiteList";
    var __message = {
        method: method,
        params: {
            Start: start,
            Limit: limit,
            AWhere: AWhere
        }
    }

    var __callbacks = null
    if (__callback){
        __callbacks = {
            callback: __callback,
            success: function(o){
                var __result = JSON.parse(o.responseText);
                if (__result.error){
                    if ((typeof this.callback == "object") && this.callback.failure){
                        this.callback.failure(__result.error);
                    }
                }else{
                    if ((typeof this.callback == "object") && this.callback.success){
                        this.callback.success(__result.result);
                    }else{
                        this.callback(__result.result);
                    }
                }
            },
            failure: function(o){
                if ((typeof this.callback == "object") && this.callback.failure){
                    this.callback.failure(o);
                }
            },
            timeout: 3000
        }
    }

    Spyder.Ajax.asyncRequest("POST", this.url+method, __callbacks, Ext.JSON.encode(__message));
}

SpyderWebsiteSvc.prototype.GetCategoriesFromWebsite = function(WID, __callback){
    var method = "website.GetCategoriesFromWebsite";
    var __message = {
        method: method,
        params: {
            WID: WID
        }
    }

    var __callbacks = null
    if (__callback){
        __callbacks = {
            callback: __callback,
            success: function(o){
                var __result = JSON.parse(o.responseText);
                if (__result.error){
                    if ((typeof this.callback == "object") && this.callback.failure){
                        this.callback.failure(__result.error);
                    }
                }else{
                    if ((typeof this.callback == "object") && this.callback.success){
                        this.callback.success(__result.result);
                    }else{
                        this.callback(__result.result);
                    }
                }
            },
            failure: function(o){
                if ((typeof this.callback == "object") && this.callback.failure){
                    this.callback.failure(o);
                }
            },
            timeout: 3000
        }
    }

    Spyder.Ajax.asyncRequest("POST", this.url+method, __callbacks, Ext.JSON.encode(__message));
}

SpyderWebsiteSvc.prototype.GetGamesFromWebsite = function(WID, __callback){
    var method = "website.GetGamesFromWebsite";
    var __message = {
        method: method,
        params: {
            WID: WID
        }
    }

    var __callbacks = null
    if (__callback){
        __callbacks = {
            callback: __callback,
            success: function(o){
                var __result = JSON.parse(o.responseText);
                if (__result.error){
                    if ((typeof this.callback == "object") && this.callback.failure){
                        this.callback.failure(__result.error);
                    }
                }else{
                    if ((typeof this.callback == "object") && this.callback.success){
                        this.callback.success(__result.result);
                    }else{
                        this.callback(__result.result);
                    }
                }
            },
            failure: function(o){
                if ((typeof this.callback == "object") && this.callback.failure){
                    this.callback.failure(o);
                }
            },
            timeout: 3000
        }
    }

    Spyder.Ajax.asyncRequest("POST", this.url+method, __callbacks, Ext.JSON.encode(__message));
}
