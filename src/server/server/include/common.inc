<?php
require_once("config.inc");
session_start();
require_once SITE_ROOT.'include/basics.php';

$timestamp = time();
$TIME_START = getMicrotime();

//initialize mysql database;
function db_init(){
	global $database_config, $db;
	$dbhost = $database_config["dbhost"];
	$dbuser = $database_config["dbpw"];
	$dbname = $database_config["dbname"];
	$pconnect = $database_config["pconnect"];
	require_once SITE_ROOT."include/mysql.class.php";
	$db = new Crow();
	$db->connect($dbhost, $dbuser, $dbpw, $dbname, $pconnect);
	$db->query("SET NAMES UTF8");
	unset($database_config);
	return $db;
}
?>
