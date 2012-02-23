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
		$sql = "SELECT uid, passwd, permissions, salt FROM spyder.users WHERE uname = '$user'";
		$data = $db->get_one($sql);
		if (!is_array($data) || sizeof($data) == 0){
			send_ajax_response(array("result"=>"failure", "errors" => "用户不存在"));
		}elseif ($data && $data["uid"] && $data["passwd"]){
			$uid = $data["uid"];
			$spasswd = $data["passwd"];
			$salt = $data["salt"];
			$permissions = $data["permissions"];
			
			//firset check user name
			$passwd = sha1($passwd . "{$data["salt"]}");

			if ($passwd == $spasswd){
				//无效用户
				//if ($permissions & 16384){
				//	send_ajax_response(array("result"=>"failure", "errors"=>"此用户无权登陆系统"));
				//}else{
					session_regenerate_id(true);
					setcookie("sid", session_id(), 0, "/");
					send_ajax_response(array("result"=>"success", "data"=>array("uid"=>$uid, "permissions"=>$permissions)));
				//}	
			}else{
				send_ajax_response(array("result"=>"failure", "errors"=>"密码错误"));
			}
		}
	}
}

function module_user_init($action){
	new User($action);
}
?>
