function SpyderRealmSvc(url){
    this.url = url
}

SpyderRealmSvc.prototype.GetGameDataPageData = function(start, limit, AWhere, __callback){
    var method = "realm.GetGameDataPageData";
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

SpyderRealmSvc.prototype.AddGame = function(GameJSON, __callback){
    var method = "realm.AddGame";
    var __message = {
        method: method,
        params: {
	    GameJSON: GameJSON
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

SpyderRealmSvc.prototype.EditGame = function(GID, GameJSON, __callback){
    var method = "realm.EditGame";
    var __message = {
        method: method,
        params: {
	    GID : GID,
	    GameJSON: GameJSON
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

SpyderRealmSvc.prototype.DeleteGame = function(GID, __callback){
    var method = "realm.DeleteGame";
    var __message = {
        method: method,
        params: {
	    GID : GID
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



SpyderRealmSvc.prototype.GetOperatorPageData = function(start, limit, AWhere, __callback){
    var method = "realm.GetOperatorPageData";
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

SpyderRealmSvc.prototype.AddOperator = function(OperatorJSON, __callback){
    var method = "realm.AddOperator";
    var __message = {
        method: method,
        params: {
	    OperatorJSON: OperatorJSON
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

SpyderRealmSvc.prototype.EditOperator = function(OID, OperatorJSON, __callback){
    var method = "realm.EditOperator";
    var __message = {
        method: method,
        params: {
	    OID: OID,
	    OperatorJSON: OperatorJSON
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

SpyderRealmSvc.prototype.DeleteOperator = function(OID, __callback){
    var method = "realm.DeleteOperator";
    var __message = {
        method: method,
        params: {
	    OID: OID
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


SpyderRealmSvc.prototype.GetRealmPageData = function(start, limit, AWhere, __callback){
    var method = "realm.GetRealmPageData";
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

SpyderRealmSvc.prototype.AddRealm = function(RJSON, __callback){
    var method = "realm.AddRealm";
    var __message = {
        method: method,
        params: {
	    RJSON: RJSON
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

SpyderRealmSvc.prototype.EditRealm = function(RID, RJSON, __callback){
    var method = "realm.EditRealm";
    var __message = {
        method: method,
        params: {
	    RID: RID,
	    RJSON: RJSON
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

SpyderRealmSvc.prototype.DeleteRealm = function(RID, __callback){
    var method = "realm.DeleteRealm";
    var __message = {
        method: method,
        params: {
	    RID : RID
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
