<?php
Class User{
	private $uid;
	
	public function __construct($action){
		if ($action == "login"){
			$this->login($_POST["username"], $_POST["passwd"]);
		}
	}

	/**
	 * user.login
	 * User login spyder system
	 *
	 * default user: admin
	 * default passwd: admin
	 *
	 */
	function login($user, $passwd){
		global $db;
		$user = mysql_escape_string($user);
		$query = $db->query("SELECT uid, passwd, permissions, salt FROM spyder.users WHERE uname = '$user'");
		$data = $db->get_one($query);
		if (!$data){
			//failture
		}elseif ($data && $data["uid"] && $data["passwd"]){
			$passwd = sha1($passwd . "{$data["salt"]}");
			echo $passwd;
		}
		echo 1;
	}
}

function module_user_init($action){
	new User($action);
}
?>
