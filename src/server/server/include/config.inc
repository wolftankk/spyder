<?php
date_default_timezone_set("Asia/Shanghai");

//db config
$database_config = array(
	"dbhost"	=> "127.0.0.1",//db server
	"dbuser"	=> "root",//db username
	"dbpw"		=> "",//db password
	"dbname"	=> "spyder",//database name
	"pconnect"  => 0,
	"dbcharset" => "utf-8"
);

$sitepath = "";

define("DEBUG", true);
//set cookie
define('COOKIEDOMAIN', '');
define('COOKIEPATH', '/');
//php setting
ini_set('session.cache_expire', 200000);
ini_set('session.cache_limiter', 'none');
ini_set('session.cookie_lifetime', 2000000);
ini_set('session.gc_maxlifetime',  2000000);
ini_set('session.use_cookies', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.use_trans_sid', 0);

if (DEBUG){
	ini_set('display_errors', 'on');
}
?>
