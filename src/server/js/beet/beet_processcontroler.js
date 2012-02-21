/**
 * @description 为每个队列中建立一个小进程
 * @param name String Process's name
 * @param callback Function process callback function
 */
Beet_Process = function(name, callback){
	//set process name
	this.name = name;
	//set process callback function
	this.callback = callback;
	//set process status. default: ready.
	this.status = "ready";
	//set process resultText when process is failure
	this.resultText = "";
}
/**
 * @description Get the name about the Process
 */
Beet_Process.prototype.getName = function(){
	return this.name;
}
/**
 * @description Get the response of the process error
 */
Beet_Process.prototype.getErrorResponse = function(){
	return this.resultText;
}
/**
 * @description executing the process.
 * @param needWaitProcess String  This list need dep process list
 *	it execute now when needWaitProcess is empty string, either
 *	the current process need wait other processes that it's finish.
 * @param queue Function This is a process controler of the process.
 */
Beet_Process.prototype.execute = function(needWaitProcess, queue){
	if (!!!needWaitProcess){
		this.callback();	
	}else{
		needWaitProcess = needWaitProcess.split(",");
		var me = this;
		this.executing = setInterval(function(){
			var isReady = true;
			for (var c = 0; c < needWaitProcess.length; ++c){
				var processName = needWaitProcess[c].trim(), process = queue.getProcess(processName);
				if (!!!process || process == undefined){
					clearInterval(me.executing);
					throw processName + " not found!";
					return;
				}
				if (process.getStatus() == "failure"){
					queue.addToFailureList(process);
				}
				isReady = process.getStatus() == "success" && isReady;
			}

			if (isReady){
				me.callback();
				clearInterval(me.executing);
				return;
			}else{
				if (queue.getErrorCount() > 0){
					clearInterval(me.executing);
					return queue.getErrorList();
				}
			}
		}, 100);
	}
}
/**
 * @description Set the status of the current process
 * @param s String status
 * @param response String error response
 */
Beet_Process.prototype.setStatus = function(s, response){
	this.status = s;
	this.resultText = response;
}
Beet_Process.prototype.getStatus = function(){
	return this.status
}

/**
 * @description 队列, 进程控制器
 * @param name String The Queue's name
 */
Beet_Queue = function(name){
	this.name = name;
	this.queueByName = {};
	this.failureList = [];
}
/**
 * @description 增加一个新的进程到队列中
 * @param indexName 进程名
 * @param needWaitProcess 需要等待进程列表. 默认为空
 * @param callback Function process callback function
 */
Beet_Queue.prototype.Add = function(indexName, needWaitProcess ,callback){
	if (typeof needWaitProcess == "function" && callback == undefined){
		callback = needWaitProcess;
		needWaitProcess = "";
	}
	if (callback == undefined || callback == null){
		throw "Callback need defined!";
	}
	var me = this;
	var newProcess = new Beet_Process(indexName, callback);
	me.queueByName[indexName] = newProcess;
	newProcess.execute(needWaitProcess, this);
}
/**
 * @description 根据key名获取进程实例
 */
Beet_Queue.prototype.getProcess = function(indexName){
	return this.queueByName[indexName];
}
/**
 * @description 触发进程事件
 */
Beet_Queue.prototype.triggle = function(indexName, status, response){
	var process = this.getProcess(indexName);
	if (!process || process == undefined){
		throw indexName + " not found!";
		return;
	}else{
		process.setStatus(status, response);
	}
}
//alice
Beet_Queue.prototype.trigger = Beet_Queue.prototype.triggle;
/**
 * @description 获取当前正在执行的进程
 */
Beet_Queue.prototype.getCurrentNumProcesses = function(){
	var list = [];
	for (var k in this.queueByName){
		list.push(this.queueByName[k]);
	}
	if (list.length == 0){
		return 0;
	}

	var processCount = 0;//正在执行的进程数量, 初始化为0
	for (var c = 0; c < list.length; ++c){
		var p = list[c];
		if (p.getStatus() != "success"){
			processCount++;
		}
	}
	return processCount;
}
/**
 * @description 重置队列
 */
Beet_Queue.prototype.reset = function(){
	this.queueByName = {};
	this.failureList = [];
}
Beet_Queue.prototype.addToFailureList = function(process){
	this.failureList.push(process);
}
Beet_Queue.prototype.getErrorCount = function(){
	return this.failureList.length;
}
Beet_Queue.prototype.getErrorList = function(){
	var list = [], failureList = this.failureList;
	for (var c = 0; c < failureList.length; ++c){
		var process = failureList[c];
		list.push = {
			name: process.getName(),
			response: process.getErrorResponse()
		}
	}
}
