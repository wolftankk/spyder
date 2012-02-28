<?php
class Seed{
	private $sessionId;
	public function __construct($action, $sid){
		$this->sessionId = $sid;
		if (method_exists($this, $action)){
			call_user_func(array($this, $action));
		}else{
			send_ajax_response("error", "seed.$action method has not existed.");
		}
	}

	/**
	 * @api: seed.AddSeed
	 * @params: seedJSON
	 */
	public function AddSeed(){
		checkArgs("seedJSON");
		$data = json_decode(post_string("seedJSON"));
		$sname = checkArg("sname", $data);
		echo $sname;
	}

	/**
	 * @api: seed.EditSeed
	 * @params: sid
	 * @params: seedJSON
	 */
	public function EditSeed(){
		checkArgs("sid");
		checkArgs("seedJSON");
	}

	/**
	 * @api: seed.DeleteSeed
	 * @params: sid
	 */
	public function DeleteSeed(){
		checkArgs("sid");
	}

	/**
	 * @api: seed.TestSeed
	 * @params: sid
	 */
	public function TestSeed(){
		checkArgs("sid");
	}

	/**
	 * @api: seed.GetSeedList
	 * @params: start 
	 * @params: limit
	 * @params: AWhere
	 */
	public function GetSeedList(){
		checkArgs("start");
		checkArgs("limit");
		checkArgs("AWhere");
	}

	/**
	 * @api: seed.AddSeedCategory
	 * @params: seedCategoryJSON
	 */
	public function AddSeedCategory(){
		//$permissions = getCurrentPermissions();
		checkArgs("seedCategoryJSON");
		$data = JSON_decode(post_string("seedCategoryJSON"));
		$name = $data->name;
		$parentId = $data->parentid;

		if ($name == null || empty($name)){
			send_ajax_response(array("result"=>"failure", "errors" => "AddSeedCategory must need `name`"));
			exit();
		}

		if ($parentId == null || empty($parentId) || strlen($parentId) == 0){
			$parentId = -1;
		}

		$name = mysql_escape_string($name);
		global $db;
		$db->query("INSERT INTO spyder.seed_category (pid, cname) VALUES ('$parentId','$name')");
		$cid = $db->insert_id();
		send_ajax_response("success", $cid);
	}

	/**
	 * @api: seed.EditSeedCategory
	 * @params: sid
	 * @params: seedCategoryJSON
	 */
	public function EditSeedCategory(){
		checkArgs("cid");
		checkArgs("seedCategoryJSON");
		$sid = post_string("cid");
		$data = post_string("seedCategoryJSON");
	}

	/**
	 * @api: seed.DeleteSeedCategory
	 * @params: sid
	 */
	public function DeleteSeedCategory(){
		checkArgs("cid");
	}

	public function GetSeedCategoryList(){

	}

	/**
	 * @api: seed.ToggleSeed
	 * @params: seedJSON
	 */
	public function ToggleSeed(){

	}
}

function module_seed_init($action, $sid){
	new Seed($action, $sid);
}
?>
