<?php
Class User{
	private $uid;
	private $username;
	private $password;
	private $email;
	private $roles = 0;
	private $characters = array();//提供armory后 会保存
	
	function __construct(){
		
	}
	
	function user_login(){
	
	}
	
	function user_logout(){
	
	}
	
	function user_register(){
	
	}
	
	function user_forget(){
	
	}
	
	//update config
	function user_update(){
	}
	
	function user_avatar(){
		
	}
	
	/**
	 * 用于加密/解密cookie中的用户数据
	 * @param $str 需要加密或者解密的字符串
	 * @param $operation 默认为解密, 加密传入"encode", 解密传入"decode"
	 * @param $key 
	 * @param $expiry
	 */
	function authcode($str, $operation="DECODE", $key = '', $expiry =0){
		$ckey_length = 4;
		$key = md5($key ? $key : 'db.wowshell.com');
		$keya = md5(substr($key, 0, 16));
		$keyb = md5(substr($key, 16, 16));
		$keyc = $ckey_length ? ($operation == "DECODE" ? substr($str, 0, $ckey_length) : substr(md5(microtime()), -$ckey_length)) : '';
		
		$crypt_key = $keya.md5($keya.$keyc);
		$key_length = strlen($crypt_key);
		
		$str = $operation == "DECODE" ? base64_decode(substr($str, $ckey_length)) : sprintf("%010d", $expiry ? $expiry + time() : 0).substr(md5($str.$keyb), 0, 16).$str;
		$string_length = strlen($str);
		
		$result = '';
		$box = range(0, 255);
		$rndkey = array();
		for ($i = 0; $i <= 255; $i++){
			$rndkey[$i] = ord($crypt_key[$i % $key_length]);
		}
		
		for ($j = $i = 0; $i < 256; $i++){
			$j = ($j + $box[$i] + $rndkey[$i]) % 256;
			$tmp = $box[$i];
			$box[$i] = $box[$j];
			$box[$j] = $tmp;
		}
		
		for($a = $j = $i = 0; $i < $string_length; $i++) {
			$a = ($a + 1) % 256;
			$j = ($j + $box[$a]) % 256;
			$tmp = $box[$a];
			$box[$a] = $box[$j];
			$box[$j] = $tmp;
			$result .= chr(ord($str[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
		}
		
		if ($operation == "DECODE"){
			if((substr($result, 0, 10) == 0 || substr($result, 0, 10) - time() > 0) && substr($result, 10, 16) == substr(md5(substr($result, 26).$keyb), 0, 16)) {
				return substr($result, 26);
			} else {
				return '';
			}
		}else{
			return $keyc.str_replace('=', '', base64_encode($result));
		}
		
	}
	
	private function user_decrypt($txt, $key){
		$txt = $this->user_key(base64_decode($txt), $key);
		$tmp = "";
		for ($i = 0; $i < strlen($txt); $i++){
			$tmp .= $txt[$i] ^ $txt[++$i];
		}
		return $tmp;
	}
	
	private function user_key($txt, $encrypt_key){
		//md5 $encrypt_key的值
		$encrypt_key = md5($encrypt_key);
		$ctr = 0;
		$tmp = "";
		for ($i = 0; $i < strlen($txt); $i++){
			//如果$ctr = $encrypt_key的长度时, 重置ctr为0
			$ctr = $ctr == strlen($encrypt_key) ? 0 : $ctr;
			
			//tmp字串在末尾增加一位, 其内容为$txt的$i位与$encrypt_key的$crt+1位取异或
			$tmp .= $txt[$i] ^ $encrypt_key[$ctr++];
		}
		return $tmp;
	}
}
?>