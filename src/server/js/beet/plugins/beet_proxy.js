/**
 * @description Beet proxy client
 *
 */
Ext.define("Beet.plugins.proxyClient", {
	extend: "Ext.data.proxy.Proxy",
	alias: "proxy.b_proxy",
	uses: ['Ext.data.Request'],
	/*
	 * @cfg {String} pageParam 请求页数时候的参数名, 默认为page
	 */
	pageParam: "page",
	/*
	 * @cfg {String} startParam 请求开始时候的参数名, 默认为start
	 */
	startParam: "start",
	/*
	 * @cfg {String} limitParam 请求数据数量的参数名, 默认为limit
	 */
	limitParam: "limit",
	filterParam: "filter",
	filters: [],
	//sortParam: "sort",
	directionParam: "dir",
	/*
	 * @cfg {Boolean} noCache (可选) 默认为true, Disable caching by adding a unique parameter name to the request
	 */
	noCache: true,
	cacheString: "_dc",
	
	/*
	 * @cfg {Object} b_scope 设置调用callback函数时候的作用域
	 */
	b_scope: undefined,

	/*
	 * @cfg {Function} b_method callback函数. 如果没用设定将抛出异常
	 */
	b_method: undefined,
	
	constructor: function(config){
		var that = this;
		config = config || {}
		this.addEvents(
			'exception'
		);
	
		that.callParent([config])
		if (!config.b_method){
			Ext.Error.raise("No process function specified for this proxy");
		}

		that.nocache = that.nocache;
	},
	
	create: function(){
		return this.doRequest.apply(this, arguments);
	},
	read: function(){
		return this.doRequest.apply(this, arguments);
	},
	update: function(){
		return this.doRequest.apply(this, arguments);
	},
	destroy: function(){
		return this.doRequest.apply(this, arguments);
	},
	buildRequest: function(operation){
		var params = Ext.applyIf(operation.params || {}, this.b_params || {}),
			request = [];
		//params = Ext.applyIf(params, this.getParams(params, operation));

		request = this.getParams(params, operation);

		//operation.request = request;

		return request;
	},
	processResponse: function(operation, callback, scope, data){
		var that = this, 
			mc,
			reader = that.getReader();
		
		if (that.preProcessData && Ext.isFunction(that.preProcessData)){
			data = that.preProcessData(data);
		}

		var result = reader.read(data),
		records = result.records,
		length = records.length;

		//mc = Ext.create('Ext.util.MixedCollection', true, function(r) {return r.getId();});
		//mc.addAll(operation.records);

		Ext.apply(operation, {
			response: data,
			resultSet: result
		});

		operation.setCompleted();
		operation.setSuccessful();

		if (typeof callback == "function"){
			Ext.callback(callback, scope || that, [operation]);
		}
	},
	setException: function(){

	},
	applyEncoding: function(value){
		return Ext.encode(value)
	},
	encodeFilters: function(filters){
		var min = [], length = filters.length, i = 0;
		for (; i < length; i++){
			min[i] = {
				property: filters[i].property,
				value: filters[i].value
			}
		}

		return this.applyEncoding(min)
	},
	getParams: function(params, operation){
		params = params || {};
		var me = this,
			request = [],
			isDef = Ext.isDefined,
			page = operation.page,
			start = operation.start,
			limit = operation.limit,

			pageParam = me.pageParam,
			startParam = me.startParam,
			limitParam = me.limitParam,
			filterParam = me.filterParam;

		if (startParam && Ext.isDefined(params[startParam])){
			request.push(params[startParam]);
			delete params[startParam];
		}
		
		if (limitParam && isDef(params[limitParam])){
			request.push(params[limitParam]);
			delete params[limitParam]
		}

		if (filterParam && isDef(params[filterParam])){
			request.push(params[filterParam]);
			delete params[filterParam]
		}

		if (isDef(params["b_onlySchema"])){
			request.push(params["b_onlySchema"]);
			delete params["b_onlySchema"];
		}

		if (isDef(params["awhere"])){
			request.push(params["awhere"]);
			delete params["awhere"];
		}

		for (var k in params){
			if (k && k != "node"){
				request.push(params[k]);
				delete params[k];
			}
		}
		return request;
	},
	/**
	 * @description Handler data from the server. and restore data
	 *
	 * @param data form server json data
	 *
	 * @return JSON stringfy str
	 */
	/**
	 *
	 * @param {}operation
	 * @param {Function} callback
	 * @param {}scope 
	 */
	doRequest: function(operation, callback, scope){
		var that = this, filter = "", filters = that.filters, method = that.b_method, writer = that.getWriter(), request = [], ajax_callback;
		
		request = that.buildRequest(operation);

		if (Ext.isFunction(method)){
			ajax_callback = {
				success: function(data){
					data = Ext.JSON.decode(data);
					that.processResponse(operation, callback, scope, data)
				},
				failure: function(error){
					Ext.Error.raise(error);
				}
			}
			request.push(ajax_callback);
			method.apply(that.b_scope, request);
		}else{
			if (Ext.isArray(method) && method.length > 1){
				var _cache = [], methods = method;//cache ajax data
				var __method = methods.pop();
				var ajax_callback = {
					success: function(data){
						_cache.push(data);
						if (methods.length == 0){
							that.processResponse(operation, callback, scope, _cache);
						}else{
							var _nextMethod = methods.pop();
							_nextMethod.apply(that.b_scope, request);
						}
					},
					failure: function(error){
						Ext.Error.raise(error);
					}
				}
				request.push(ajax_callback);
				__method.apply(that.b_scope, request);
			}
		}

		operation.setStarted();

		return request;
	},

	afterRequest: Ext.emptyFn,
	onDestroy: function(operation, callback, scope){
		Ext.destroy(this.reader, this.writer)
	}
})
