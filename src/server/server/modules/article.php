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

    public function ConvertLanage($sl='zh-cn', $tl = 'zh-tw'){
	checkArgs("AID");
	$aid = post_string("AID");

	$data = $this->_getArticleInfo($aid);
	$lang = $data["lang"] == "" ? "zh-cn" : $data['lang'];

	if ($lang == 'zh-tw'){
	    send_ajax_response("error", "本文已经是繁体了!");
	    exit;
	}

	//这里只需要转两个: title 以及content
	$data["content"] = $this->convertFromHansToHant($data["content"]);
	$data["title"] = $this->convertFromHansToHant($data["title"]);
	$data["lang"]  = 'zh-tw';
	$data['url']   = $data['url'].'(zh-tw)';
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
	$needle = array_keys($this->mTables['zh-tw']);
	$content = str_replace($needle, $this->mTables['zh-tw'], $content);
	return mysql_escape_string($content);
    }

    private function loadDefaultTables(){
        require_once(LIBS.'ZhConversion.php');
	$this->mTables = array(
	    'zh-hans' => $zh2Hans,
	    'zh-hant' => $zh2Hant,
	    'zh-cn'   => array_merge($zh2Hans, $zh2CN),
	    'zh-tw'   => array_merge($zh2Hant, $zh2TW),
	    'zh'      => array()
	);
    }

    //转换语言自动新增一文章
    private function _AddArticle(){

    }

    public function PublicArticleToSite(){
        checkArgs("AID", "WID");
        $aid = post_string("AID");
        $wid = post_string("wid");

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
        $websiteData = array(
            "method"=> "wordpress",
            "host" => "172.16.130.7",
            "name" => "root",
            "passwd"=>"",
            "dbname"=>"bigamer"
        );

        $method = $websiteData["method"];
        //method: wordpress, dedecms, phpcms, ...
        if ($method == "wordpress"){
            $this->wp_insert_post($articleData, $websiteData);
        //#}else{

        }
    }

    /**
     * Insert a post to wordpress
     *    $post = array(
     *      'ID' => [ <post id> ] //Are you updating an existing post?
     *      'menu_order' => [ <order> ] //If new post is a page, sets the order should it appear in the tabs.
     *      'comment_status' => [ 'closed' | 'open' ] // 'closed' means no comments.
     *      'ping_status' => [ 'closed' | 'open' ] // 'closed' means pingbacks or trackbacks turned off
     *      'pinged' => [ ? ] //?
     *      'post_author' => [ <user ID> ] //The user ID number of the author.
     *      'post_category' => [ array(<category id>, <...>) ] //Add some categories.
     *      'post_content' => [ <the text of the post> ] //The full text of the post.
     *      'post_date' => [ Y-m-d H:i:s ] //The time post was made.
     *      'post_date_gmt' => [ Y-m-d H:i:s ] //The time post was made, in GMT.
     *      'post_excerpt' => [ <an excerpt> ] //For all your post excerpt needs.
     *      'post_name' => [ <the name> ] // The name (slug) for your post
     *      'post_parent' => [ <post ID> ] //Sets the parent of the new post.
     *      'post_password' => [ ? ] //password for post?
     *      'post_status' => [ 'draft' | 'publish' | 'pending'| 'future' ] //Set the status of the new post. 
     *      'post_title' => [ <the title> ] //The title of your post.
     *      'post_type' => [ 'post' | 'page' ] //Sometimes you want to post a page.
     *      'tags_input' => [ '<tag>, <tag>, <...>' ] //For tags.
     *      'to_ping' => [ ? ] //?
     *    );  
     * 
     */
    private function wp_insert_post($articleData, $websiteData){
        global $db;
        //$dbcharset = "utf-8";
        $siteDB = new Crow();
        $siteDB->connect($websiteData["host"], $websiteData["name"], $websiteData["passwd"], $websiteData["dbname"]);
        $siteDB->query("SET    NAMES UTF8");
        //get wp options
        $wp_options = $this->wp_options($siteDB);

        $title = $articleData["title"];
        $content = mysql_escape_string($articleData["content"]);
        $fetchtime = $articleData["fetchtime"];

        $post_ID = 0;
        $post_date = $this->current_time("mysql");
        $post_date_gmt = $this->current_time("mysql", 1);
        $post_title = $title;
        $post_name = sha1($articleData["url"]);//唯一标示
        $post_status = "publish";
        $comment_status = "open";
        $post_parent = 0;
        $menu_order = 0;
        $post_author = 1;
        $post_type = "post";

        //check
        $post = $siteDB->get_one("SELECT ID FROM wp_posts WHERE post_name='$post_name'");
        if (!empty($post) && is_array($post) && count($post) > 0){
            send_ajax_response("error", "此文章已发布");
            exit;
        }

        //insert into db
        $sql = "INSERT INTO wp_posts SET post_author='$post_author', post_date='$post_date', post_date_gmt='$post_date_gmt', post_content='$content', post_title='$post_title', post_status='$post_status', comment_status='$comment_status', post_name='$post_name', post_type='$post_type', post_parent='$post_parent'";
        $succ = $siteDB->query($sql);
        if ($succ === false){
            send_ajax_response("error", "发布文章失败, 原因: ".$siteDB->error());
            exit;
        }
        $post_ID = $siteDB->insert_id();

        //update guid
        $guid = ($wp_options["siteurl"] . "?p=" . $post_ID);
        $sql = "UPDATE wp_posts SET guid='$guid' WHERE ID=$post_ID";
	$succ = $siteDB->query($sql);
	//update status
	//简体转繁体
        send_ajax_response("success", $succ);
    }

    private function current_time($type, $gmt=0){
        switch ($type){
            case "mysql":
                return ($gmt) ? gmdate("Y-m:d H:i:s") : gmdate("Y-m-d H:i:s", time() + 8 * 3600);
                break;
            case "timestamp":
                return $gmt ? time() : (time() + 8 * 3600);
                break;
        }
    }

    private function wp_options($db){
        $query = $db->query("SELECT * FROM wp_options");
        $options = array();
        while ($data = $db->fetch_array($query)){
            $options[$data["option_name"]] = $data["option_value"];
        }
        return $options;
    }
}

function module_article_init($action, $sid){
    new Article($action, $sid);
}

?>
