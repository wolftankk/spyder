function SpyderArticleSvc(url){
    this.url = url
}

SpyderArticleSvc.prototype.GetArticleList = function(start, limit, AWhere, __callback){
    var method = "article.GetArticleList";
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

SpyderArticleSvc.prototype.GetArticleInfo = function(AID, __callback){
    var method = "article.GetArticleInfo";
    var __message = {
        method: method,
        params: {
            AID: AID
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

SpyderArticleSvc.prototype.ConvertLanage = function(AID, __callback){
    var method = "article.ConvertLanage";
    var __message = {
        method: method,
        params: {
            AID: AID
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

SpyderArticleSvc.prototype.EditArticle = function(ArticleJSON, __callback){
    var method = "article.EditArticle";
    var __message = {
        method: method,
        params: {
            ArticleJSON : ArticleJSON
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

SpyderArticleSvc.prototype.DeleteArticle = function(AID, __callback){
    var method = "article.DeleteArticle";
    var __message = {
        method: method,
        params: {
            AID: AID
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

SpyderArticleSvc.prototype.PublicArticleToSite = function(AID, WID, Options, __callback){
    var method = "article.PublicArticleToSite";
    var __message = {
        method: method,
        params: {
            AID: AID,
            WID: WID,
	    Options: Options
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
