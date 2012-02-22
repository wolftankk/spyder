<?php
Class User{
	private $uid;
	
	public function __construct($action){
		print_r($_POST);
	}
}

function module_user_init($action){
	new User($action);
}
?>
