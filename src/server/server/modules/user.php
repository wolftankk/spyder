<?php
Class User{
	private $uid;
	
	public function __construct($action){

	}
}

function module_user_init($action){
	new User($action);
}
?>
