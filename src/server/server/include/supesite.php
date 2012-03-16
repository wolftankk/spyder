<?php
class Supesite {
    private $ssDB;
    private $options;
    private $defaultCatID;

    public function __construct($websiteData){
	$this->connectDatabase($websiteData);
	$this->prefix_t = "supe_";

	//check undefinedCategory is exist
	$this->checkUndefinedCategory();
    }

    private function connectDatabase($websiteData){
        $this->ssDB = new Crow();
        $this->ssDB->connect($websiteData["host"], $websiteData["name"], $websiteData["passwd"], $websiteData["dbname"]);
        $this->ssDB->query("SET  NAMES UTF8");
    }

    private function getTableName($tablename){
	return ($this->prefix_t."$tablename");
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

    public function insert_article($articleData){
	$hash = md5($articleData["url"]);

	//check

	//$setsqlarr = array(
	//    "catid"   => $this->defaultCatID,
	//    "subject" => mysql_escape_string($articleData["title"]),
	//    'hash'    => 
	//);
    }

    private function checkArticleExist($hash){
	$sql = "SELECT itemid FROM {$this->getTableName('postitems')} WHERE hash='$hash'";
	$data = $this->ssDB->query($data);
	if (is_array($data) && count($data) > 0){
	    send_ajax_response("error", "此篇文章已经在此站点发布过");
	    exit;
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
