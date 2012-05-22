<?php
class Supesite {
    private $ssDB;
    private $options;
    private $defaultCatID;

    public function __construct($websiteData, $errors, $catID = null){
	$this->connectDatabase($websiteData);
	$this->prefix_t = "supe_";
	//$this->tagsList = array();
	$this->errors = $errors;
	//check undefinedCategory is exist
	if ($catID == null){
	    $this->checkUndefinedCategory();
	}else{
	    $this->defaultCatID = $catID;
	}
	//$this->buildTagsList();
    }

    private function connectDatabase($websiteData){
        $this->ssDB = new Crow();
        $this->ssDB->connect($websiteData["host"], $websiteData["name"], $websiteData["passwd"], $websiteData["dbname"]);
        $this->ssDB->query("SET  NAMES UTF8");
    }

    private function getTableName($tablename){
	return ($this->prefix_t."$tablename");
    }

    public function getGames(){
	$query = $this->ssDB->query("SELECT itemid, name FROM {$this->getTableName('gamesitems')}");
	$list = array();
	while ($data = $this->ssDB->fetch_array($query)){
	    $list[] = $data;
	}

	send_ajax_response("success", $list);
	exit;
    }

    private function checkUndefinedCategory(){
	$sql = "SELECT catid FROM {$this->getTableName('categories')} WHERE name = 'UNDEFINED'";
	$data = $this->ssDB->get_one($sql);
	if (empty($data) || !is_array($data) || (is_array($data) && count($data) == 0)){
	    $catid = $this->inserttable("categories", array(
		"catid" => 0,
		"name"  => "UNDEFINED",
		"type"  => "news"	
	    ), 1);

	    $this->defaultCatID = $catid;
	}else{
	    $this->defaultCatID = $data["catid"];
	}
    }

    public function getErrors(){
	return $this->errors;
    }

    public function getCategories(){
	$sql = "SELECT catid, name FROM {$this->getTableName('categories')} WHERE type = 'news'";
	$query = $this->ssDB->query($sql);
	$data = array();
	while ($d = $this->ssDB->fetch_array($query)){
	    $data[] = $d;
	}

	send_ajax_response("success", $data);
	exit;
    }

    public function insert_article($articleData, $gameid=0){
	$hash = substr(md5($articleData["url"]), 0, 16);

	//check
	$isExist = $this->checkArticleExist($hash, $articleData["title"]);
	if ($isExist){
	    return false;
	}

	//get 编辑
	$sql = "SELECT uid, username FROM {$this->getTableName('members')} WHERE uid > 10000 AND uid <= 10010";
	$query = $this->ssDB->query($sql);
	$users = array();

	while ($d = $this->ssDB->fetch_array($query)){
	    if ($d && is_array($d)){
		$users[] = $d;
	    }
	}

	$pUsername = "";
	$pUserID   = "";
	if (count($users) > 0){
	    $rs = rand(0, (count($users) - 1));
	    $d = $users[$rs];
	    $pUsername = $d["username"];
	    $pUserID   = $d["uid"];
	}else{
	    $pUsername = "admin";
	    $pUserID   = 3;
	}

	//插入到postitems
	$setsqlarr = array(
	    'catid'   => $this->defaultCatID,
	    'subject' => mysql_escape_string($articleData["title"]),
	    'hash'    => $hash,
	    'picid'   => 0, //图文咨询标志
	    'uid'     => $pUserID,
	    'username'=> $pUsername, 
	    'type'    => "news",
	    'folder'  => 1,
	    "fromtype"=> "adminpost"
	);

	if (!empty($gameid)){
	    $setsqlarr["gameid"] = $gameid;
	}

	$images = $articleData["images"];
	if (!empty($images)){
	    $images = unserialize($images);
	}


	//styletitle 标题样式
	$setsqlarr["haveattach"] = 0;
	if (is_array($images) && count($images) > 0){
	    $setsqlarr["haveattach"] = 1;
	}
	$setsqlarr["dateline"]   = time();

	$itemid = $this->inserttable("postitems", $setsqlarr, 1);

	if (is_array($images) && count($images) > 0){
	    for ($i = 0; $i < count($images); $i++){
		$image = $images[$i];
		//get path, name, type
		$image = str_replace("http://res.bigamer.tw/", "", $image);
		$img_path = $image;
		$image_info = explode("/", $image);
		$image_file = end($image_info);
		list($image_name, $image_type) = explode(".", $image_file);
		$imgsql = array(
		    'isavailable' => 1,
		    'type' => 'news',
		    'uid' => $pUserID,
		    'itemid' => $itemid,
		    'catid' => $this->defaultCatID,
		    'dateline' => time(),
		    'filename' => $image_file,
		    'subject' => $image_name,
		    'attachtype' => $image_type,
		    'isimage' => 1,
		    'size' => 4000,
		    'filepath' => $img_path,
		    'hash' => $hash
		);
		$this->inserttable('attachments', $imgsql, 1);
	    }
	}

	//插入到spacenews
	$setsqlarr = array(
	    'message' => mysql_escape_string($articleData['content']),
	    'postip'  => '127.0.0.1'
	);
	//TAG line360
	//include tags
	$setsqlarr["itemid"] = $itemid;

	$nid = $this->inserttable("postmessages", $setsqlarr, 1);

	if ($nid > 0){
	//    #send_ajax_response("success", true);
	    return $nid;
	}
    }

    private function checkArticleExist($hash, $title){
	$sql = "SELECT itemid FROM {$this->getTableName('postitems')} WHERE hash='$hash'";
	$data = $this->ssDB->get_one($sql);
	if (is_array($data) && count($data) > 0){
	    //send_ajax_response("error", "此篇文章已经在此站点发布过");
	    //exit;
	    $this->errors[] = "<$title>已经在此站点发布过";
	    return true;
	}
	$sql = "SELECT itemid FROM {$this->getTableName('spaceitems')} WHERE hash='$hash'";
	$data = $this->ssDB->get_one($sql);
	if (is_array($data) && count($data) > 0){
	    $this->errors[] = "<$title>已经在此站点发布过";
	    return true;
	    //send_ajax_response("error", "此篇文章已经在此站点发布过");
	    //exit;
	}
    }

    private function inserttable($tablename, $insertsqlarr, $returnid=0, $replace=false, $silent=0){
	$insertkeysql = $insertvaluesql = $comma = '';
	foreach ($insertsqlarr as $insert_key => $insert_value) {
	    $insertkeysql .= $comma . '`'.$insert_key.'`';
	    $insertvaluesql .= $comma . "'" . $insert_value . "'";
	    $comma = ", ";
	}
	$method = $replace ? "REPLACE" : "INSERT";
	$this->ssDB->query($method . " INTO ". $this->getTableName($tablename) . ' (' . $insertkeysql . ') VALUES (' . $insertvaluesql . ') ', $silent ? "SILENT" : "");
	if ($returnid && !$replace){
	    return $this->ssDB->insert_id();
	}
    }
}

?>
