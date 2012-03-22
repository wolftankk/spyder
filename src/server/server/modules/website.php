<?php
class Website{
    public function __construct($action){
	if (method_exists($this, $action)){
	    call_user_func(array($this, $action));
	}else{
	    send_ajax_response("error", "Website.$action method has not existed.");
	}
    }

    public function AddWebsite(){

    }

    public function EditWebsite(){

    }

    public function DeleteWebsite(){

    }

    public function GetWebsiteList(){

    }

    public function GetCategoriesFromWebsite(){
	//checkArgs("WID");
	$websiteData = array(
	    "method"=> "supesite",
	    "host" => "172.16.130.7",
	    "name" => "root",
	    "passwd"=>"",
	    "dbname"=>"supesite"
	);
	$method = $websiteData["method"];

	switch ($method){
	    case "wordpress":
		uses("wordpress");
		break;
	    case "supesite":
		uses("supesite");
		$website = new Supesite($websiteData, array(), 0);
		$website->getCategories();
		break;
	    default:
		send_ajax_response("error", "Sorry, Spyder donot support $method.");
		exit;
	}
    }
}

function module_website_init($action){
    new Website($action);
}

?>
