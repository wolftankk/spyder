<?php
require_once "common.inc";

function bootloader(){
	setAllowHeader();
	$result = path_init();
	if (!$result){
		call_404_page();
	}
}

function path_init(){
	if (!empty($_GET['do'])){
		get_normal_path(trim($_GET['do'], '/'));
	}else{
		if (count($_GET) == 0){
			echo "Spyder Server is working OK";
		}else{
			if (!empty($_SERVER["QUERY_STRING"])){
				//header("Location: http://".$_SERVER['HTTP_HOST']."/".$_SERVER["QUERY_STRING"]);
			}else{
				//do something
			}
		}
		return false;
	}
}

function call_404_page(){
	header("HTTP/1.0 404 Not Found");
	exit;
}

function setAllowHeader(){
	//for cross-domain
	header("Access-Control-Allow-Methods:POST, GET, OPTIONS");
	header("Access-Control-Allow-Origin:*");
	header("Access-Control-Max-Age:1728000");
}

/**
 * 获取url参数.
 * @param $index 需要节点
 * @param $path 访问路径
 */
function arg($index=null, $path=null){
	static $arguments;
	if (!isset($path)){
		$path = $_GET["do"];
	}
	if (!isset($arguments[$path])){
		$arguments[$path] = explode("/", $path);
	}
	if (!isset($index)){
		return $arguments[$path];
	}
	if (isset($arguments[$path][$index])){		
		return $arguments[$path][$index];
	}
}

/**
 * 获得查询字符串数据
 * @param Int $index
 */
function query_string($index=null){
	//parse data, remove first element
	$tmp = $_GET;
	array_shift($tmp);
	$args = array();
	foreach ($tmp as $k=>$v){
		if (empty($v)){
			$args[$k] = true;
		}else{
			$args[$k] = $v;
		}
	}

	if (!isset($index)){
		return $args;
	}
	
	if (isset($args[$index])){
		return $args[$index];
	}
}

/*
 * load Module
 */
function get_normal_path($path){
	$modules = scandir(MODULES_PATH);
	list($t) = arg();
	list($method, $action) = explode(".", $t);//get method and action from url

	if (empty($action)){
		call_404_page();
		return;
	}

	//check session id
	if ($method == "user" && ($action == "login" || $action == "logout")){
		//continue;
	}else{
		$sid = session_id();
		if (!$_COOKIE["sid"] || ($_COOKIE["sid"] && ($_COOKIE["sid"] != $sid))){
			//fail, please login again
		}
	}
	
	$module = $method.".php";
	if (in_array($module, $modules)){
		$loadfile = MODULES_PATH.$module;
		if (is_file($loadfile)){
			$db = db_init();//启动数据库
			try{
				require_once($loadfile);//加载模块文件
			}catch (Exception $e){
				echo $e->getMessage();
			}
			$func = "module_".$method."_init";//call hook
			if (function_exists($func)){
				@call_user_func($func, $action);
				return;
			}
		}
	}
	call_404_page();
}
?>
