<?php
require_once("config.inc");
session_start();
require_once SITE_ROOT.'include/basics.php';
require_once SITE_ROOT.'include/user.class.php';

$timestamp = time();
$TIME_START = getMicrotime();

//initialize mysql database;
function db_init(){
	global $dbhost, $dbuser, $dbpw, $dbname, $pconnect, $db;
	require_once SITE_ROOT."include/mysql.class.php";
	$db = new Crow();
	$db->connect($dbhost, $dbuser, $dbpw, $dbname, $pconnect);
	$db->query("SET NAMES UTF8");
	unset($dbhost, $dbuser, $dbpw, $dbname, $pconnect);
	return $db;
}
?>
