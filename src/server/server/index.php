<?php

/**
 * Configure Spyder directory
 */

define("DS", DIRECTORY_SEPARATOR);
define("SITE_ROOT", dirname(__FILE__).DS);
define("MODULES_PATH", SITE_ROOT."modules".DS);
require_once SITE_ROOT."include/bootloader.php";

bootloader();
?>
