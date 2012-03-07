<?php
class Website{
		if (method_exists($this, $action)){
			call_user_func(array($this, $action));
		}else{
			send_ajax_response("error", "Website.$action method has not existed.");
		}

		public function AddWebsite(){
			checkArgs("websiteJSON");
			$data = post_string("websiteJSON");
			$data = json_decode($data);
		}

		public function EditWebsite(){

		}

		public function DeleteWebsite(){
			checkArgs("WID");
			$wid = post_string("WID");
			global $db;
			$succ = $db->query("DELETE FROM spyder.websites WHERE wid = $wid");
			$succ = $succ && ($db->query("DELETE FROM spyder.website_extra WHERE wid=$wid"));
			$db->query("DELETE FROM spyder.website_terms WHERE wid=$wid");
			send_ajax_response("success", $succ);
		}

		public function GetWebsiteList(){

		}
}

function module_website_init($action){
	new Website($action);
}

?>
