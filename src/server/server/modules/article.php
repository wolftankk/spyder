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

		print_r(post_string());
		$sql = "SELECT a.aid, a.title, a.url, a.sid, b.sname, a.status, a.fetchTime FROM spyder.articles as a LEFT JOIN spyder.seeds as b ON a.sid = b.sid $where LIMIT $start, $limit";
		$query = $db->query($sql);
		print_r($db->fetch_array($query));
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
