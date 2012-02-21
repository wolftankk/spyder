// Javascript JSON-RPC Code Generated for the  MyPrivilegeLib library.

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
// Service: MyPrivilegeSvc
function MyPrivilegeSvc(url){
  this.url = url;
}

MyPrivilegeSvc.prototype.AddUser = function(aUserID, APassword, AUserAgent, ADescription, AGroupID, bOwnerGUID, __callback) {
  var __message = {
    "method" : "MyPrivilegeSvc.AddUser",
    "params" : {
      "aUserID": aUserID,
      "APassword": APassword,
      "AUserAgent": AUserAgent,
      "ADescription": ADescription,
      "AGroupID": AGroupID,
      "bOwnerGUID": bOwnerGUID
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

MyPrivilegeSvc.prototype.AddResources = function(ResourceID, ResourceName, ResTypeID, Descript, __callback) {
  var __message = {
    "method" : "MyPrivilegeSvc.AddResources",
    "params" : {
      "ResourceID": ResourceID,
      "ResourceName": ResourceName,
      "ResTypeID": ResTypeID,
      "Descript": Descript
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

MyPrivilegeSvc.prototype.AddOperators = function(OperatorID, OperatorName, ParentOperatorID, Descript, __callback) {
  var __message = {
    "method" : "MyPrivilegeSvc.AddOperators",
    "params" : {
      "OperatorID": OperatorID,
      "OperatorName": OperatorName,
      "ParentOperatorID": ParentOperatorID,
      "Descript": Descript
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

MyPrivilegeSvc.prototype.GetOperatorList = function(AResourceID, __callback) {
  var __message = {
    "method" : "MyPrivilegeSvc.GetOperatorList",
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

MyPrivilegeSvc.prototype.CheckPrivilege = function(AOperatorID, AResourceID, __callback) {
  var __message = {
    "method" : "MyPrivilegeSvc.CheckPrivilege",
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

MyPrivilegeSvc.prototype.GetGroupListFromOperatorID = function(AOperatorID, IsName, __callback) {
  var __message = {
    "method" : "MyPrivilegeSvc.GetGroupListFromOperatorID",
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

MyPrivilegeSvc.prototype.GetUserInfo = function(__callback) {
  var __message = {
    "method" : "MyPrivilegeSvc.GetUserInfo"
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

MyPrivilegeSvc.prototype.GetUserDataToJSON = function(bOnlySchema, __callback) {
  var __message = {
    "method" : "MyPrivilegeSvc.GetUserDataToJSON",
    "params" : {
      "bOnlySchema": bOnlySchema
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

// End of service: MyPrivilegeSvc
// Service: MyLoginSvc
function MyLoginSvc(url){
  this.url = url;
}

MyLoginSvc.prototype.Login = function(UserName, Password, Language, ConnectionName, __callback) {
  var __message = {
    "method" : "MyLoginSvc.Login",
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

MyLoginSvc.prototype.Logout = function(__callback) {
  var __message = {
    "method" : "MyLoginSvc.Logout",
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
        };
		Ext.util.Cookies.clear("_sid");
      },
      failure : function (o) {
        if ((typeof this.callback == "object") && this.callback.failure) 
            this.callback.failure(o);
	    Ext.util.Cookies.clear("_sid");
      },
      timeout : 30000
    }
  }
  Beet_connection.asyncRequest("POST", this.url, __callbacks, Ext.JSON.encode(__message));
}

MyLoginSvc.prototype.GetConnectionNames = function(__callback) {
  var __message = {
    "method" : "MyLoginSvc.GetConnectionNames",
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

MyLoginSvc.prototype.GetUserPrivileges = function(__callback) {
  var __message = {
    "method" : "MyLoginSvc.GetUserPrivileges",
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

MyLoginSvc.prototype.GetSessionID = function(__callback) {
  var __message = {
    "method" : "MyLoginSvc.GetSessionID",
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

// End of service: MyLoginSvc
