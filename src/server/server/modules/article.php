<?php
class Article{
    private $sessionId;
    public function __construct($action, $sid){
	$this->sessionId = $sid;
	$this->loadDefaultTables();
        if (method_exists($this, $action)){
            call_user_func(array($this, $action));
        }else{
            send_ajax_response("error", "Article.$action method has not existed.");
        }
    }

    public function GetArticleList(){
        checkArgs("Start", "Limit", "AWhere");
        $start = post_string("Start");
        $limit = post_string("Limit");
        $where = post_string("AWhere");
        global $db;
        if (strlen($where) > 0) {
            $where = "WHERE $where";
        }

        $sql = "SELECT a.aid, a.lang, a.title, a.url, a.sid, b.sname, a.status, a.fetchTime FROM spyder.articles as a LEFT JOIN spyder.seeds as b ON a.sid = b.sid $where ORDER BY a.fetchTime DESC LIMIT $start, $limit";
        $query = $db->query($sql);
        $Data = array();
        $MetaData = array();
        $isGetMetaData = false;
        while ($data = $db->fetch_array($query)){
            if (!$isGetMetaData){
                $keys = array_keys($data);
                for ($c = 0; $c < count($keys); $c++){
                    $key = $keys[$c];
                    $fieldHidden = false;
                    if ($key == "sid"){
                        $fieldHidden = true;
		    }
                    $MetaData[] = array(
                        "fieldName" => $keys[$c],
                        "dataIndex" => $keys[$c],
                        "fieldHidden" => $fieldHidden
                    );
                }
                $isGetMetaData = true;
            }
            $Data[] = array_values($data);
        }
        
        $count = $db->get_one("SELECT COUNT(*) as count FROM spyder.articles $where");

        send_ajax_response("success", array("TotalCount"=>$count["count"], "Data"=>$Data, "MetaData"=>$MetaData));
    }

    private function _getArticleInfo($aid){
        global $db;

        $sql = "SELECT aid, lang, title, content, url, sid, status, fetchtime, lasteditor, lastupdatetime FROM spyder.articles WHERE aid = $aid";
        $data = $db->get_one($sql);

	return $data;
    }

    public function GetArticleInfo(){
        checkArg("AID");
        $aid = post_string("AID");
	$data = $this->_getArticleInfo($aid);
        if (empty($data) || (is_array($data) && count($data) == 0)){
            send_ajax_response("error", "$aid不存在");
            exit();
        }

        send_ajax_response("success", $data);
        
    }

    public function GetArticleCategoryList(){
        global $db;
        
        $root = array();

        #first get seed category
        $sql = "SELECT cid, pid, cname FROM seed_category ORDER BY pid ASC";
        $query = $db->query($sql);
        while ($data = $db->fetch_array($query)){
            //$cid = $data["cid"];
            //$pid = $data["pid"];
            //$cname = $data["cname"];
            //if ($pid == -1){
            //    $root[$cid] = array(
            //        "cid" => $cid,
            //        "pid" => $pid,
            //        "text" => $cname
            //    );
            //}
            //if ($root[$pid] && is_array($root[$pid])){
            //    if (!$root[$pid]["children"] || !is_array($root[$pid]["children"])){
            //        $root[$pid]["children"] = array();
            //        $root[$pid]["expanded"] = true;
            //    }
            //}    
        }
    }

    public function EditArticle(){
        checkArgs("ArticleJSON");
        $data = json_decode(post_string("ArticleJSON"));
	if ($data == NULL){
	    require_once(LIBS."JSON.php");
	    $JSON = new Services_JSON();
	    $data = $JSON->decode(post_string("ArticleJSON"));
	}
        $title = mysql_escape_string($data->title);
        $content = mysql_escape_string($data->content);
        $aid = checkArg("aid", $data);
        
        global $db;
        $now = time();
        $userInfo = getCurrentSessionData($this->sessionId);
        $uid = $userInfo["uid"];
        $permissions = $userInfo["permissions"];

        $sql = "UPDATE spyder.articles SET title='$title', content='$content', lasteditor='$uid', lastupdatetime='$now' WHERE aid = $aid";

        $succ = $db->query($sql);

        send_ajax_response("success", $succ);
    }

    public function DeleteArticle(){
        checkArgs("AID");
        $aid = post_string("AID");
        global $db;
        $sql = "DELETE FROM spyder.articles WHERE aid =$aid";
        $succ = $db->query($sql);

        send_ajax_response("success", $succ);
    }

    public function ConvertLanage(){
	checkArgs("AID");
	$aid = post_string("AID");

	$data = $this->_getArticleInfo($aid);
	$lang = $data["lang"] == "" ? "zhCN" : $data['lang'];

	if ($lang == 'zhTW'){
	    send_ajax_response("error", "本文已经是繁体了!");
	    exit;
	}

	//目标只有繁体 > <
	$data["content"] = $this->convertFromHansToHant($data["content"]);
	$data["title"] = $this->convertFromHansToHant($data["title"]);
	$data["lang"]  = 'zhTW';
	$data['url']   = $data['url'];
	$data["fetchtime"] = time();
	$data["lastupdatetime"] = time();

	//另存为
	$sql = "INSERT INTO spyder.articles SET ";
	unset($data["aid"]);
	$v = array();
	foreach ($data as $key => $val){
	    $v[] = $key . "='" . "$val'";
	}
	$sql .= join($v, ", ");

	global $db;
	$succ = $db->query($sql);
	if ($succ){
	    $id = $db->insert_id();
	    send_ajax_response("success", $id);
	    exit();
	}
	send_ajax_response("error", "转换失败");
    }

    private function convertFromHansToHant($content){
	$needle = array_keys($this->mTables['zhTW']);
	$content = str_replace($needle, $this->mTables['zhTW'], $content);
	return mysql_escape_string($content);
    }

    private function loadDefaultTables(){
        require_once(LIBS.'ZhConversion.php');
	$this->mTables = array(
	    'zh-hans' => $zh2Hans,
	    'zh-hant' => $zh2Hant,
	    'zhCN'   => array_merge($zh2Hans, $zh2CN),
	    'zhTW'   => array_merge($zh2Hant, $zh2TW),
	    'zh'      => array()
	);
    }

    //文章发布系统
    public function PublicArticleToSite(){
        checkArgs("AID", "WID");
        $aid = post_string("AID");
	$wid = post_string("wid");
	$options = post_string("Options");

        global $db;
        $articleData = $db->get_one("SELECT * FROM spyder.articles WHERE aid = '$aid'");
        if (empty($articleData) || !is_array($articleData) || count($articleData) == 0){
            send_ajax_response("error", "This article #$aid is not found.");
        }

        //get website
        #$websiteData = $db->get_one("SELECT * FROM spyder.website_extra WHERE wid = '$wid'");
        #if (empty($websiteData) || !is_array($websiteData) || count($websiteData)){
        #    send_ajax_response("error", "This website #$wid is not found.");
        #}

	# wordpress
        //$websiteData = array(
        //    "method"=> "wordpress",
        //    "host" => "172.16.130.7",
        //    "name" => "root",
        //    "passwd"=>"",
        //    "dbname"=>"bigamer"
	//);
	#supesite
        $websiteData = array(
            "method"=> "supesite",
            "host" => "172.16.130.7",
            "name" => "root",
            "passwd"=>"",
            "dbname"=>"supesite"
	);
	

        $method = $websiteData["method"];
        //method: wordpress, dedecms, phpcms, supesite ...
	switch ($method){
	    case "wordpress":
		uses("wordpress");
		break;
	    case "supesite":
		uses("supesite");
		$website = new Supesite($websiteData);
		$id = $website->insert_article($articleData);
		break;
	    default:
		send_ajax_response("error", "Sorry, Spyder donot support $method.");
		exit;
	}
    }

}

function module_article_init($action, $sid){
    new Article($action, $sid);
}

?>
