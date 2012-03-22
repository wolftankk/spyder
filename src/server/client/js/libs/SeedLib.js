function SpyderSeedSvc(url){
    this.url = url
}

SpyderSeedSvc.prototype.AddSeed= function(seedJSON, __callback){
    var method = "seed.AddSeed";
    var __message = {
        method: method,
        params: {
            seedJSON: seedJSON    
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

SpyderSeedSvc.prototype.EditSeed= function(sid, seedJSON, __callback){
    var method = "seed.EditSeed";
    var __message = {
        method: method,
        params: {
            SID: sid,
            seedJSON: seedJSON    
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

SpyderSeedSvc.prototype.DeleteSeed= function(sid, __callback){
    var method = "seed.DeleteSeed";
    var __message = {
        method: method,
        params: {
            SID: sid
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

SpyderSeedSvc.prototype.GetSeedRule = function(sid, __callback){
    var method = "seed.GetSeedRule";
    var __message = {
        method: method,
        params: {
            SID: sid
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

SpyderSeedSvc.prototype.TestSeed = function(sid, __callback){
    var method = "seed.TestSeed";
    var __message = {
        method: method,
        params: {
            SID: sid
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

SpyderSeedSvc.prototype.GetSeedList = function(start, limit, AWhere, __callback){
    var method = "seed.GetSeedList";
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

SpyderSeedSvc.prototype.AddSeedCategory= function(seedCategoryJSON, __callback){
    var method = "seed.AddSeedCategory";
    var __message = {
        method: method,
        params: {
            seedCategoryJSON: seedCategoryJSON 
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

SpyderSeedSvc.prototype.EditSeedCategory= function(cid, seedCategoryJSON, __callback){
    var method = "seed.EditSeedCategory";
    var __message = {
        method: method,
        params: {
            CID: cid,
            seedCategoryJSON: seedCategoryJSON 
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

SpyderSeedSvc.prototype.DeleteSeedCategory = function(cid, __callback){
    var method = "seed.DeleteSeedCategory";
    var __message = {
        method: method,
        params: {
            CID: cid
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

SpyderSeedSvc.prototype.GetSeedCategoryList = function(Where, __callback){
    var method = "seed.GetSeedCategoryList";
    var __message = {
        method: method,
        params: {
	    Where: Where
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
