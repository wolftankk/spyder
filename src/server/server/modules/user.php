<?php
Class User{
	private $uid;

	//需要验证这种方法的安全性
	public function __construct($action){
		if (method_exists($this, $action)){
			call_user_func(array($this, $action));
		}else{
				send_ajax_response(array("result"=>"failure", "errors"=>"User.$action method has not existed."));
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
	public function Login(){
		global $db;
		//get data from $_POST
		$user = post_string("username");
		$passwd = post_string("passwd");

		$user = mysql_escape_string($user);
		$sql = "SELECT uid, passwd, permissions, salt FROM spyder.users WHERE uname = '$user'";
		$data = $db->get_one($sql);
		if (!is_array($data) || sizeof($data) == 0){
			send_ajax_response(array("result"=>"failure", "errors" => "用户不存在"));
			exit();
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
					$db->query("UPDATE spyder.users SET lastlogintime = '" . time() . "' WHERE uid = $uid");
					send_ajax_response(array("result"=>"success", "data"=>array("uid"=>$uid, "permissions"=>$permissions, "sid"=>session_id())));
				//}	
			}else{
				send_ajax_response(array("result"=>"failure", "errors"=>"密码错误"));
				exit();
			}
		}
	}

	public function Logout(){
		session_regenerate_id(true);
		setcookie("sid", 0, -99999, "/");
		send_ajax_response(array("result"=>"success", "data"=>array("success"=>true)));
	}

	public function GetUserInfo($uid = null){
		$_tmp = null;
		if ($uid && isset($uid)){
			$_tmp = $uid;	
		}elseif (post_string("uid")){
			$_tmp = $uid;	
		}
		$uid = $_tmp;

		if (!isset($uid) && empty($uid)){
			send_ajax_response(array("result"=>"failure", "errors"=>"uid can not null"));
			exit();
		}

		//select uid data
		global $db;
		$uid = mysql_escape_string($uid);
		$sql = "SELECT uname, email, permissions, createtime, lastlogintime FROM spyder.users WHERE uid = $uid";
		$data = $db->get_one($sql);
		if (!is_array($data) || sizeof($data) == 0){
			send_ajax_response(array("result"=>"failure", "errors" => "用户不存在"));
			exit();
		}elseif ($data && $data["uname"]){
			$data["uid"] = $uid;
			send_ajax_response(array("result"=>"success", "data"=>$data));
		}
	}
}

function module_user_init($action){
	new User($action);
}
?>
