<?php
Class User{
	private $sid;

	//需要验证这种方法的安全性
	public function __construct($action, $sid){
		$this->sid = $sid;
		if (method_exists($this, $action)){
			call_user_func(array($this, $action));
		}else{
			send_ajax_response("error", "User.$action method has not existed.");
		}
	}

	/**
	 * @api: user.Login
	 * @params: username
	 * @params: passwd
	 */
	public function Login(){
		global $db, $M;
		//get data from $_POST
		$user = post_string("username");
		$passwd = post_string("passwd");

		$user = mysql_escape_string($user);
		$sql = "SELECT uid, passwd, permissions, salt FROM spyder.users WHERE uname = '$user'";
		$data = $db->get_one($sql);
		if (!is_array($data) || sizeof($data) == 0){
			send_ajax_response("error", "用户不存在");
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
					$sid = session_id();
					setcookie("sid", $sid, 0, "/");
					if ($M->add($sid, serialize(array("uid"=>$uid, "permissions"=>$permissions)), false, 6000)){
						$db->query("UPDATE spyder.users SET lastlogintime = '" . time() . "' WHERE uid = $uid");
						send_ajax_response("success", array("uid"=>$uid, "permissions"=>$permissions, "sid"=>$sid));
					}
				//}	
			}else{
				send_ajax_response("error", "密码错误");
				exit();
			}
		}
	}

	/**
	 * @api: user.Logout
	 */
	public function Logout(){
		global $M;
		$M->delete($this->sid);
		setcookie("sid", 0, -99999, "/");
		send_ajax_response("success", true);
	}

	/**
	 * @api: user.GetUserInfo
	 * @params: uid
	 */
	public function GetUserInfo($uid = null){
		$_tmp = null;
		if ($uid && isset($uid)){
			$_tmp = $uid;	
		}elseif (post_string("uid")){
			$_tmp = $uid;	
		}
		$uid = $_tmp;

		if (!isset($uid) && empty($uid)){
			send_ajax_response("error", "uid can not null");
			exit();
		}

		//select uid data
		global $db;
		$uid = mysql_escape_string($uid);
		$sql = "SELECT uname, email, permissions, createtime, lastlogintime FROM spyder.users WHERE uid = $uid";
		$data = $db->get_one($sql);
		if (!is_array($data) || sizeof($data) == 0){
			send_ajax_response("errors",  "用户不存在");
			exit();
		}elseif ($data && $data["uname"]){
			$data["uid"] = $uid;
			send_ajax_response("success", $data);
		}
	}

	/**
	 * @api: user.AddUser
	 * @params: userJSON
	 */
	public function AddUser(){
		global $db;
	}

	/**
	 * @api: user.EditUser
	 * @params: uid
	 * @params: userJSON
	 */
	public function EditUser(){

	}

	/**
	 * @api: user.DeleteUser
	 * @params: uid
	 */
	public function DeleteUser(){

	}
}

function module_user_init($action, $sid){
	new User($action, $sid);
}
?>
