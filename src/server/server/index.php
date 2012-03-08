<?php

/**
 * Configure Spyder directory
 */

/*
 * cross domain
 */
header("Access-Control-Allow-Headers: x-requested-with");
header("Access-Control-Allow-Methods:POST, GET, OPTIONS");
header("Access-Control-Allow-Origin:*");
header("Access-Control-Max-Age:1728000");

define("DS", DIRECTORY_SEPARATOR);
define("SITE_ROOT", dirname(__FILE__).DS);
define("LIBS", SITE_ROOT."include".DS);
define("MODULES_PATH", SITE_ROOT."modules".DS);
require_once SITE_ROOT."include/bootloader.php";

bootloader();
?>
