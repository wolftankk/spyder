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
		
		//json_decode 有问题
		$data = json_decode(post_string("seedJSON"));
		$sname = checkArg("sname", $data);
		$url = checkArg("url", $data);
		$charset = checkArg("charset", $data);
		$frequency = checkArg("frequency", $data);
		$timeout = checkArg("timeout", $data);
		$tries = checkArg("tries", $data);
		$enabled = checkArg("enabled", $data);

		$data = get_object_vars($data);
		//0 undefined category
		$cid = $data["cid"] ? $data["cid"] : 0;
		$list = array(
			"urlformat" => $data["list[urlformat]"],
			"startpage" => $data["list[startpage]"],
			"maxpage" => $data["list[maxpage]"],
			"step" => $data["list[step]"],
			"listparent" => $data["list[listparent]"],
			"entryparent" => $data["list[entryparent]"],
			"articleparent" => $data["list[articleparent]"],
			"titleparent" => $data["list[titleparent]"],
			"dateparent" => $data["list[dateparent]"]
		); 
		$article = array(
			"articleparent" => $data["article[articleparent]"],
			"titleparent"   => $data["article[titleparent]"],
			"tagsparent"    => $data["article[tagparten]"],
			"authorparent"  => $data["article[authorparent]"],
			"contextparent" => $data["article[contextparent]"],
			"pageparent"    => $data["article[pageparent]"]
		);

		$rule = array(
			"list" => $list,
			"article" => $article
		);

		$createdTime = time();

		//get uid
		$userInfo = getCurrentSessionData($this->sessionId);
		$uid = $userInfo["uid"];
		$permissions = $userInfo["permissions"];

		global $db;
		$sql = ("INSERT INTO spyder.seeds (sname, cid, url, charset, enabled, rule, frequency, timeout, tries, uid, createdtime) VALUES ('$sname','$cid', '$url', '$charset', '$enabled', '" . serialize($rule) . "', '$frequency', '$timeout', '$tries', $uid, $createdTime)");
		$db->query($sql);
		$sid = $db->insert_id();
		send_ajax_response("success", $sid);
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
