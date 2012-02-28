<?php
/*
 * 基础函数库
 * 
 */

define("SECOND", 1);
define("MINUTE", 60);
define("HOUR", 3600);
define("DAY", 86400);
define("WEEK", 604800);
define("MONTH", 2592000);
define("YEAR", 31536000);

define("COPPER_PER_SILVER", 100);
define("SILVER_PER_GOLD", 100);
define("COPPER_PER_GLOD", 10000);

function formatTime($time){
	$str = "";
	if ($time < MINUTE){
		$str = $time."秒";
	}elseif ($time < HOUR){
		$str = floor($time/MINUTE)."分钟";
	}elseif ($time < DAY){
		$str = floor($time/HOUR)."小时";
	}else{
		$str = round($time/DAY,1)."天";
	}

	return $str;
}

/*
 * 从LIBS中动态加载库文件
 * 
 * uses("spell", "item");
 */
function uses(){
	$args = func_get_args();
	foreach ($args as $file){
		require_once(LIBS. strtolower($file).'.php');
	}
}

function usesmodules(){
	$args = func_get_args();
	foreach ($args as $file){
		require_once(MODULES_PATH. strtolower($file).'.php');
	}
}

function getMicrotime(){
	list($usec, $sec) = explode(' ', microtime());
	return ((float)$usec + (float)$sec);
}

/*
 * 获取环境变量.
 * @param string key 环境变量名
 * @return string 环境变量值
 */
function env($key){
	if ($key == "HTTPS"){
		if (isset($_SERVER["HTTPS"])){
			return (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off"); 
		}
		return (strpos(env('SCRIPT_URI'), 'https://') === 0);
	}
	
	if ($key == "SCRIPT_NAME"){
		if (env('CGI_MODE') && isset($_ENV['SCRIPT_URL'])){
			$key = 'SCRIPT_URL';
		}
	}
	
	$val = null;
	if (isset($_SERVER[$key])){
		$val = $_SERVER[$key];
	}elseif (isset($_ENV[$key])){
		$val = $_ENV[$key];
	}elseif (getenv($key) !== false){
		$val = getenv($key);
	}
	
	if ($key == "REMOTE_ADDR" && $val === env('SERVER_ADDR')){
		$addr = env("HTTP_PC_REMOTE_ADDR");
		if ($addr !== null){
			$val = $addr;
		}
	}
	
	if ($val !== null){
		return $val;
	}
	
	switch ($key){
		case 'DOCUMENT_ROOT':
			$name = env("SCRIPT_NAME");
			$filename = env("SCRIPT_FILENAME");
			$offset = 0;
			if (!strpos($name, ".php")){
				$offset = 4;
			}
			return substr($filename, 0, strlen($filename) - (strlen($name) + $offset));
			break;
		case 'PHP_SELF':
			return str_replace(env('DOCUMENT_ROOT'), '', env('SCRIPT_FILENAME'));
			break;
		case 'CGI_MODE':
			return (PHP_SAPI === 'cgi');
			break;
		case 'HTTP_BASE':
			$host = env('HTTP_HOST');
			$parts = explode('.', $host);
			$count = count($parts);
			if ($count === 1){
				return '.' . $host;
			}elseif ($count === 2){
				return '.' . $host;
			}elseif ($count === 3){
				$gTLD = array('aero', 'asia', 'biz', 'cat', 'com', 'coop', 'edu', 'gov', 'info', 'int', 'jobs', 'mil', 'mobi', 'museum', 'name', 'net', 'org', 'pro', 'tel', 'travel', 'xxx');
				if (in_array($parts[1], $gTLD)){
					return '.' . $host;
				}
			}
			array_shift($parts);
			return '.' . implode('.', $parts);
			break;
	}
	
	return null;
}

function cache($path, $data=null, $expires="+10 day"){
	if (ENABLE_CACHING == false){
		return $data;
	}

	$now = time();
	if (!is_numeric($expires)){
		$expires = strtotime($expires);
	}

	$path = sha1($path);
	$path1 = substr($path, 0, 2);
	$path2 = substr($path, 2, 2);

	$cache_dir = CACHE_PATH . $path1;
	if (!is_dir($cache_dir)){
		@mkdir($cache_dir);
	}
	$cache_dir = $cache_dir . DS . $path2;
	if (!is_dir($cache_dir)){
		@mkdir($cache_dir);
	}
	
	$filename = CACHE_PATH . $path1 . DS . $path2 . DS . $path;

	$timediff = $expires - $now;
	$filetime = false;

	if (file_exists($filename)){
		$filetime = @filemtime($filename);
	}

	if ($data === null){
		if (file_exists($filename) && $filetime !== false){
			if ($filetime + $timediff < $now){
				@unlink($filename);
			} else {
				$data = @file_get_contents($filename);
			}
		}
	}elseif (is_writable(dirname($filename))){
		@file_put_contents($filename, $data);
	}
	return $data;
}

function clearCache(){
	
}

function send_ajax_response($type, $data){
	header("Content-type: application/json");

	$result = array(
		"id" => session_id(),
		"version" => "1.0"
	);
	
	if ($type == "error"){
		$result["error"] = array("message"=>$data);
	}elseif ($type == "success"){
		if ($data && is_array($data)){
			$data = json_encode($data);
		}
		$result["result"] = $data;
	}

	echo json_encode($result);
}

function checkArg($argName, $obj = null){
	if ($obj){
		if (is_object($obj)){
			$obj = get_object_vars($obj);
		}
		$arg = $obj[$argName];
	}else{
		$arg = post_string($argName);
	}
	if ($arg == null || empty($arg)){
		send_ajax_response("error", $argName . " cannot be empty");
		exit();
	}else{
		return trim($obj[$argName]);
	}
}

function checkArgs(){
	$args = func_get_args();
	for ($c = 0; $c < count($args); $c++){
		checkArg($args[$c]);	
	}
}

function getCurrentPermissions($sid){
}

?>
