<?php
class Article{
	public function __construct($action){
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

	public function EditArticle(){

	}

	public function DeleteArticle(){

	}

	//转换语言自动新增一文章
	private function _AddArticle(){

	}

	public function PublicArticleToSite(){

	}
}

function module_article_init($action){
	new Article($action);
}

?>
