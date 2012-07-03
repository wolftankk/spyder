<?php
function str_cut($string, $length, $dot = '...') {
    $strlen = strlen($string);
    if($strlen <= $length) return $string;
    $string = str_replace(array(' ','&nbsp;', '&amp;', '&quot;', '&#039;', '&ldquo;', '&rdquo;', '&mdash;', '&lt;', '&gt;', '&middot;', '&hellip;'), array('∵',' ', '&', '"', "'", '“', '”', '—', '<', '>', '·', '…'), $string);
    $strcut = '';
    if(strtolower(CHARSET) == 'utf-8') {
	$length = intval($length-strlen($dot)-$length/3);
	$n = $tn = $noc = 0;
	while($n < strlen($string)) {
	    $t = ord($string[$n]);
	    if($t == 9 || $t == 10 || (32 <= $t && $t <= 126)) {
		$tn = 1; $n++; $noc++;
	    } elseif(194 <= $t && $t <= 223) {
		$tn = 2; $n += 2; $noc += 2;
	    } elseif(224 <= $t && $t <= 239) {
		$tn = 3; $n += 3; $noc += 2;
	    } elseif(240 <= $t && $t <= 247) {
		$tn = 4; $n += 4; $noc += 2;
	    } elseif(248 <= $t && $t <= 251) {
		$tn = 5; $n += 5; $noc += 2;
	    } elseif($t == 252 || $t == 253) {
		$tn = 6; $n += 6; $noc += 2;
	    } else {
		$n++;
	    }
	    if($noc >= $length) {
		break;
	    }
	}
	if($noc > $length) {
	    $n -= $tn;
	}
	$strcut = substr($string, 0, $n);
	$strcut = str_replace(array('∵', '&', '"', "'", '“', '”', '—', '<', '>', '·', '…'), array(' ', '&amp;', '&quot;', '&#039;', '&ldquo;', '&rdquo;', '&mdash;', '&lt;', '&gt;', '&middot;', '&hellip;'), $strcut);
    } else {
	$dotlen = strlen($dot);
	$maxi = $length - $dotlen - 1;
	$current_str = '';
	$search_arr = array('&',' ', '"', "'", '“', '”', '—', '<', '>', '·', '…','∵');
	$replace_arr = array('&amp;','&nbsp;', '&quot;', '&#039;', '&ldquo;', '&rdquo;', '&mdash;', '&lt;', '&gt;', '&middot;', '&hellip;',' ');
	$search_flip = array_flip($search_arr);
	for ($i = 0; $i < $maxi; $i++) {
	    $current_str = ord($string[$i]) > 127 ? $string[$i].$string[++$i] : $string[$i];
	    if (in_array($current_str, $search_arr)) {
		$key = $search_flip[$current_str];
		$current_str = str_replace($search_arr[$key], $replace_arr[$key], $current_str);
	    }
	    $strcut .= $current_str;
	}
    }
    return $strcut.$dot;
}


class Phpcms {
    private $pc_db;
    private $options;

    public function __construct($websiteData, $errors, $catID = null){
	$this->connectDatabase($websiteData);
	$this->prefix_t = "bg_";
	$this->defaultCatID = $catID ? $catID : 25;//默认放在本岛中
	$this->errors = $errors;
    }

    private function connectDatabase($websiteData){
        $this->pc_db = new Crow();
        $this->pc_db->connect($websiteData["host"], $websiteData["name"], $websiteData["passwd"], $websiteData["dbname"]);
        $this->pc_db->query("SET NAMES UTF8");
    }

    private function getTableName($tablename){
	return ($this->prefix_t."$tablename");
    }

    public function getGames(){
	$query = $this->pc_db->query("SELECT id, title as name FROM {$this->getTableName('games')}");
	$list = array();
	while ($data = $this->pc_db->fetch_array($query)){
	    $list[] = $data;
	}

	send_ajax_response("success", $list);
	exit;
    }

    public function getErrors(){
	return $this->errors;
    }

    public function getCategories(){
	$sql = "SELECT catid, catname as name FROM {$this->getTableName('category')} WHERE modelid = '1' AND child = 0";
	$query = $this->pc_db->query($sql);
	$data = array();
	while ($d = $this->pc_db->fetch_array($query)){
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
	$sql = "SELECT username FROM {$this->getTableName('admin')} WHERE userid > 2 AND userid <= 12";
	$query = $this->pc_db->query($sql);
	$users = array();

	while ($d = $this->pc_db->fetch_array($query)){
	    if ($d && is_array($d)){
		$users[] = $d;
	    }
	}

	$pUsername = "";
	if (count($users) > 0){
	    $rs = rand(0, (count($users) - 1));
	    $d = $users[$rs];
	    $pUsername = $d["username"];
	}else{
	    $pUsername = "Nobody";
	}

	//插入到news
	$setsqlarr = array(
	    'catid'   => $this->defaultCatID,
	    'title' => mysql_escape_string($articleData["title"]),
	    'hash'    => $hash,
	    'username'=> $pUsername, 
	    'description' => str_cut($articleData['content'], 200),
	    'status' => 1,
	    'sysadd' => 1,
	    'inputtime' => time(),
	    'updatetime'=> time(),
	);

	if (!empty($gameid)){
	    $setsqlarr["gameid"] = $gameid;
	}

	$content = stripslashes($articleData["content"]);
	if (preg_match_all("/(src=)([\"|']?)([^ \"']+\.(gif|jpg|png|jpeg))\\2/i", $content, $matches)) {
	    $setsqlarr["thumb"] = $matches[3][0];
	}

	$itemid = $this->inserttable("news", $setsqlarr, 1);

	$data = array(
	    'id' => $itemid,
	    'content' => mysql_escape_string($articleData["content"])
	);
	$this->inserttable("news_data", $data, 1);

	$hitsid = 'c-1-'.$itemid;
	$data = array(
	    'hitsid' => $hitsid,
	    'catid' => $this->defaultCatID,
	    'updatetime' => time()
	);
	$this->inserttable("hits", $data);

	$this->pc_db->query("UPDATE bg_category set items=items+1 where catid=".$this->defaultCatID);

	$data = array(
	    'checkid' => 'c-'.$itemid.'-1',
	    'catid' => $this->defaultCatID,
	    'siteid' => 1,
	    'title' => mysql_escape_string($articleData['title']),
	    'username' => $pUsername,
	    'inputtime' => time(),
	    'status' => 1
	);
	$this->inserttable('content_check', $data);

	if ($itemid > 0){
	    #send_ajax_response("success", true);
	    return $itemid;
	}
    }

    private function checkArticleExist($hash, $title){
	$sql = "SELECT id FROM {$this->getTableName('news')} WHERE hash='$hash'";
	$data = $this->pc_db->get_one($sql);
	if (is_array($data) && count($data) > 0){
	    $this->errors[] = "<$title>已经在此站点发布过";
	    return true;
	}
	//$sql = "SELECT itemid FROM {$this->getTableName('spaceitems')} WHERE hash='$hash'";
	//$data = $this->ssDB->get_one($sql);
	//if (is_array($data) && count($data) > 0){
	//    $this->errors[] = "<$title>已经在此站点发布过";
	//    return true;
	//    //send_ajax_response("error", "此篇文章已经在此站点发布过");
	//    //exit;
	//}
    }

    private function inserttable($tablename, $insertsqlarr, $returnid=0, $replace=false, $silent=0){
	$insertkeysql = $insertvaluesql = $comma = '';
	foreach ($insertsqlarr as $insert_key => $insert_value) {
	    $insertkeysql .= $comma . '`'.$insert_key.'`';
	    $insertvaluesql .= $comma . "'" . $insert_value . "'";
	    $comma = ", ";
	}
	$method = $replace ? "REPLACE" : "INSERT";
	$this->pc_db->query($method . " INTO ". $this->getTableName($tablename) . ' (' . $insertkeysql . ') VALUES (' . $insertvaluesql . ') ', $silent ? "SILENT" : "");
	if ($returnid && !$replace){
	    return $this->pc_db->insert_id();
	}
    }
}

?>
