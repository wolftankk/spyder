<?php
class Website{
		if (method_exists($this, $action)){
			call_user_func(array($this, $action));
		}else{
				send_ajax_response(array("result"=>"failure", "errors"=>"Website.$action method has not existed."));
		}

		public function AddWebsite(){

		}

		public function EditWebsite(){

		}

		public function DeleteWebsite(){

		}

		public function GetWebsiteList(){

		}
}

function module_website_init($action){
	new Website($action);
}

?>
