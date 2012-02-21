Ext.Loader.setConfig({
	enabled: true,
	paths: {
		"card" : "js/beet/card",
		"customer" : "js/beet/customer",
		"libs" : "js/my"
	}
});

Beet.config = {
	serverUrl: "172.16.88.8",
	getPrivileUrl: function(){
		return this.serverUrl + ":6660";
	},
	getCustomerUrl: function(){
		return this.serverUrl + ":6661";
	},
	getEmployeeUrl: function(){
		return this.serverUrl + ":6662";
	},
	getCardUrl: function(){
		return this.serverUrl + ":6663";
	},
	getWarehouse: function(){
		return this.serverUrl + ":6664";
	}
}

Beet.constants.customerLoginServer = new CTLoginSvc("http://"+Beet.config.getCustomerUrl() +"/JSON");
Beet.constants.privilegeServer = new MyPrivilegeSvc("http://"+Beet.config.getPrivileUrl() + "/JSON");
Beet.constants.customerServer = new MyCustomerSvc("http://"+Beet.config.getCustomerUrl() + "/JSON");
Beet.constants.employeeServer = new MyEMSvc("http://" + Beet.config.getEmployeeUrl() + "/JSON");
Beet.constants.cardServer = new MyCardSvc("http://" + Beet.config.getCardUrl() + "/JSON");
Beet.constants.stockServer = new MyStockSvc("http://" + Beet.config.getWarehouse() + "/JSON");
