<?php
class Article{
	private $sessionId;
	public function __construct($action, $sid){
		$this->sessionId = $sid;
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

		$sql = "SELECT a.aid, a.title, a.url, a.sid, b.sname, a.status, a.fetchTime FROM spyder.articles as a LEFT JOIN spyder.seeds as b ON a.sid = b.sid $where LIMIT $start, $limit";
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

	public function GetArticleInfo(){
		checkArg("AID");
		$aid = post_string("AID");
		global $db;

		$sql = "SELECT aid, lang, title, content, url, sid, status, fetchtime, lasteditor, lastupdatetime FROM spyder.articles WHERE aid = $aid";
		$data = $db->get_one($sql);
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
			//	$root[$cid] = array(
			//		"cid" => $cid,
			//		"pid" => $pid,
			//		"text" => $cname
			//	);
			//}
			//if ($root[$pid] && is_array($root[$pid])){
			//	if (!$root[$pid]["children"] || !is_array($root[$pid]["children"])){
			//		$root[$pid]["children"] = array();
			//		$root[$pid]["expanded"] = true;
			//	}
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

	}

	//转换语言自动新增一文章
	private function _AddArticle(){

	}

	public function PublicArticleToSite(){

	}
}

function module_article_init($action, $sid){
	new Article($action, $sid);
}

?>
