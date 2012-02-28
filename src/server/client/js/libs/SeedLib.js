function SpyderSeedSvc(url){
	this.url = url
}

SpyderSeedSvc.prototype.AddSeed= function(json, __callback){
	var method = "seed.AddSeed";
	var __message = {
		method: method,
		params: {
			seedJson: json
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

SpyderSeedSvc.prototype.AddSeedCategory= function(json, __callback){
	var method = "seed.AddSeedCategory";
	var __message = {
		method: method,
		params: {
			seedCategoryJSON: json
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
