// Javascript JSON-RPC Code Generated for the  MyEmLib library.

/* This codegen depends on the Yahoo YUI (http://developer.yahoo.com/yui/) toolkit and requires the 
   following libraries. Note that it's recommended to download yui and place a local copy next to
   your html.

  <script type="text/javascript" src="http://yui.yahooapis.com/2.5.1/build/yahoo/yahoo.js"></script> 
  <script type="text/javascript" src="http://yui.yahooapis.com/2.5.1/build/json/json.js"></script>
  <script type="text/javascript" src="http://yui.yahooapis.com/2.5.1/build/connection/connection.js"></script>
*/

// Service: DataAbstractService
function DataAbstractService(url){
  this.url = url;
}

DataAbstractService.prototype.GetSchema = function(aFilter, __callback) {
  var __message = {
    "method" : "DataAbstractService.GetSchema",
    "params" : {
      "aFilter": aFilter
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.GetData = function(aTableNameArray, aTableRequestInfoArray, __callback) {
  var __message = {
    "method" : "DataAbstractService.GetData",
    "params" : {
      "aTableNameArray": aTableNameArray,
      "aTableRequestInfoArray": aTableRequestInfoArray
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.UpdateData = function(aDelta, __callback) {
  var __message = {
    "method" : "DataAbstractService.UpdateData",
    "params" : {
      "aDelta": aDelta
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.ExecuteCommand = function(aCommandName, aParameterArray, __callback) {
  var __message = {
    "method" : "DataAbstractService.ExecuteCommand",
    "params" : {
      "aCommandName": aCommandName,
      "aParameterArray": aParameterArray
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.ExecuteCommandEx = function(aCommandName, aInputParameters, __callback) {
  var __message = {
    "method" : "DataAbstractService.ExecuteCommandEx",
    "params" : {
      "aCommandName": aCommandName,
      "aInputParameters": aInputParameters
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.GetTableSchema = function(aTableNameArray, __callback) {
  var __message = {
    "method" : "DataAbstractService.GetTableSchema",
    "params" : {
      "aTableNameArray": aTableNameArray
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.GetCommandSchema = function(aCommandNameArray, __callback) {
  var __message = {
    "method" : "DataAbstractService.GetCommandSchema",
    "params" : {
      "aCommandNameArray": aCommandNameArray
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.SQLGetData = function(aSQLText, aIncludeSchema, aMaxRecords, __callback) {
  var __message = {
    "method" : "DataAbstractService.SQLGetData",
    "params" : {
      "aSQLText": aSQLText,
      "aIncludeSchema": aIncludeSchema,
      "aMaxRecords": aMaxRecords
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.SQLGetDataEx = function(aSQLText, aIncludeSchema, aMaxRecords, aDynamicWhereXML, __callback) {
  var __message = {
    "method" : "DataAbstractService.SQLGetDataEx",
    "params" : {
      "aSQLText": aSQLText,
      "aIncludeSchema": aIncludeSchema,
      "aMaxRecords": aMaxRecords,
      "aDynamicWhereXML": aDynamicWhereXML
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.SQLExecuteCommand = function(aSQLText, __callback) {
  var __message = {
    "method" : "DataAbstractService.SQLExecuteCommand",
    "params" : {
      "aSQLText": aSQLText
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.SQLExecuteCommandEx = function(aSQLText, aDynamicWhereXML, __callback) {
  var __message = {
    "method" : "DataAbstractService.SQLExecuteCommandEx",
    "params" : {
      "aSQLText": aSQLText,
      "aDynamicWhereXML": aDynamicWhereXML
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.GetDatasetScripts = function(DatasetNames, __callback) {
  var __message = {
    "method" : "DataAbstractService.GetDatasetScripts",
    "params" : {
      "DatasetNames": DatasetNames
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.RegisterForDataChangeNotification = function(aTableName, __callback) {
  var __message = {
    "method" : "DataAbstractService.RegisterForDataChangeNotification",
    "params" : {
      "aTableName": aTableName
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

DataAbstractService.prototype.UnregisterForDataChangeNotification = function(aTableName, __callback) {
  var __message = {
    "method" : "DataAbstractService.UnregisterForDataChangeNotification",
    "params" : {
      "aTableName": aTableName
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

// End of service: DataAbstractService
// Service: SimpleLoginService
function SimpleLoginService(url){
  this.url = url;
}

SimpleLoginService.prototype.Login = function(aUserID, aPassword, __callback) {
  var __message = {
    "method" : "SimpleLoginService.Login",
    "params" : {
      "aUserID": aUserID,
      "aPassword": aPassword
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

// End of service: SimpleLoginService
// Service: BaseLoginService
function BaseLoginService(url){
  this.url = url;
}

BaseLoginService.prototype.LoginEx = function(aLoginString, __callback) {
  var __message = {
    "method" : "BaseLoginService.LoginEx",
    "params" : {
      "aLoginString": aLoginString
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

BaseLoginService.prototype.Logout = function(__callback) {
  var __message = {
    "method" : "BaseLoginService.Logout",
    "params" : {
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

// End of service: BaseLoginService
// Service: MultiDbLoginService
function MultiDbLoginService(url){
  this.url = url;
}

MultiDbLoginService.prototype.Login = function(aUserID, aPassword, aConnectionName, __callback) {
  var __message = {
    "method" : "MultiDbLoginService.Login",
    "params" : {
      "aUserID": aUserID,
      "aPassword": aPassword,
      "aConnectionName": aConnectionName
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

// End of service: MultiDbLoginService
// Service: MultiDbLoginServiceV5
function MultiDbLoginServiceV5(url){
  this.url = url;
}

MultiDbLoginServiceV5.prototype.GetConnectionNames = function(__callback) {
  var __message = {
    "method" : "MultiDbLoginServiceV5.GetConnectionNames",
    "params" : {
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MultiDbLoginServiceV5.prototype.GetDefaultConnectionName = function(__callback) {
  var __message = {
    "method" : "MultiDbLoginServiceV5.GetDefaultConnectionName",
    "params" : {
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

// End of service: MultiDbLoginServiceV5
// Service: MyEMSvc
function MyEMSvc(url){
  this.url = url;
}

MyEMSvc.prototype.CheckPrivilege = function(AOperatorID, AResourceID, __callback) {
  var __message = {
    "method" : "MyEMSvc.CheckPrivilege",
    "params" : {
      "AOperatorID": AOperatorID,
      "AResourceID": AResourceID
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.GetGroupListFromOperatorID = function(AOperatorID, IsName, __callback) {
  var __message = {
    "method" : "MyEMSvc.GetGroupListFromOperatorID",
    "params" : {
      "AOperatorID": AOperatorID,
      "IsName": IsName
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.GetOperatorList = function(AResourceID, __callback) {
  var __message = {
    "method" : "MyEMSvc.GetOperatorList",
    "params" : {
      "AResourceID": AResourceID
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.AddDepartment = function(ADepName, __callback) {
  var __message = {
    "method" : "MyEMSvc.AddDepartment",
    "params" : {
      "ADepName": ADepName
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.UpdateDepartment = function(ADepName, AOLDDepID, __callback) {
  var __message = {
    "method" : "MyEMSvc.UpdateDepartment",
    "params" : {
      "ADepName": ADepName,
      "AOLDDepID": AOLDDepID
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.DelDepartment = function(ADepID, __callback) {
  var __message = {
    "method" : "MyEMSvc.DelDepartment",
    "params" : {
      "ADepID": ADepID
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.GetDepartmentData = function(Where, OnlySchema, __callback) {
  var __message = {
    "method" : "MyEMSvc.GetDepartmentData",
    "params" : {
      "Where": Where,
      "OnlySchema": OnlySchema
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.AddStore = function(AStoreName, __callback) {
  var __message = {
    "method" : "MyEMSvc.AddStore",
    "params" : {
      "AStoreName": AStoreName
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.UpdateStore = function(AStoreName, AOLDStoreID, __callback) {
  var __message = {
    "method" : "MyEMSvc.UpdateStore",
    "params" : {
      "AStoreName": AStoreName,
      "AOLDStoreID": AOLDStoreID
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.DelStore = function(AStoreID, __callback) {
  var __message = {
    "method" : "MyEMSvc.DelStore",
    "params" : {
      "AStoreID": AStoreID
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.GetStoreData = function(AWhere, OnlySchema, __callback) {
  var __message = {
    "method" : "MyEMSvc.GetStoreData",
    "params" : {
      "AWhere": AWhere,
      "OnlySchema": OnlySchema
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.AddEmployee = function(AEmployessJSONData, __callback) {
  var __message = {
    "method" : "MyEMSvc.AddEmployee",
    "params" : {
      "AEmployessJSONData": AEmployessJSONData
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.UpdateEmployee = function(AUserID, UpdateJSONData, __callback) {
  var __message = {
    "method" : "MyEMSvc.UpdateEmployee",
    "params" : {
      "AUserID": AUserID,
      "UpdateJSONData": UpdateJSONData
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.DelEmployee = function(AUserID, __callback) {
  var __message = {
    "method" : "MyEMSvc.DelEmployee",
    "params" : {
      "AUserID": AUserID
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyEMSvc.prototype.GetEmployeeData = function(Start, Limit, AWhere, OnlySchema, __callback) {
  var __message = {
    "method" : "MyEMSvc.GetEmployeeData",
    "params" : {
      "Start": Start,
      "Limit": Limit,
      "AWhere": AWhere,
      "OnlySchema": OnlySchema
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

// End of service: MyEMSvc
// Service: EMLoginSvc
function EMLoginSvc(url){
  this.url = url;
}

EMLoginSvc.prototype.Login = function(UserName, Password, Language, ConnectionName, __callback) {
  var __message = {
    "method" : "EMLoginSvc.Login",
    "params" : {
      "UserName": UserName,
      "Password": Password,
      "Language": Language,
      "ConnectionName": ConnectionName
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

EMLoginSvc.prototype.Logout = function(__callback) {
  var __message = {
    "method" : "EMLoginSvc.Logout",
    "params" : {
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

EMLoginSvc.prototype.GetConnectionNames = function(__callback) {
  var __message = {
    "method" : "EMLoginSvc.GetConnectionNames",
    "params" : {
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

EMLoginSvc.prototype.GetSessionID = function(__callback) {
  var __message = {
    "method" : "EMLoginSvc.GetSessionID",
    "params" : {
      }
  }
  var __callbacks = null;
  if (__callback) {
    __callbacks = {
      callback : __callback,
      success : function (o) {
        var __result = JSON.parse(o.responseText);
        if (__result.error)
        {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.failure(__result.error);
        } else {
          if ((typeof this.callback == "object") && this.callback.failure)
            this.callback.success(__result.result);
          else
            this.callback(__result.result);
        }
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

// End of service: EMLoginSvc
