<?php
class Article{
	public function __construct($action){
		if (method_exists($this, $action)){
			call_user_func(array($this, $action));
		}else{
				send_ajax_response(array("result"=>"failure", "errors"=>"Article.$action method has not existed."));
		}
	}

	public function GetArticleList(){

	}

	public function EditArticle(){

	}

	public function DeleteArticle(){

	}

	//转换语言自动新增一文章
	private function _AddArticle(){

	}
}

function module_article_init($action){
	new Article($action);
}

?>
