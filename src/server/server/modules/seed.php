<?php
class Seed{

	public function __construct($action){
		if (method_exists($this, $action)){
			call_user_func(array($this, $action));
		}else{
				send_ajax_response(array("result"=>"failure", "errors"=>"Seed.$action method has not existed."));
		}
	}

	public function AddSeed(){

	}

	public function EditSeed(){

	}

	public function DeleteSeed(){

	}

	public function GetSeedList(){

	}

	/*
	 * 批量启用/禁用种子采集
	 */
	public function ToggleSeed(){

	}
}

module_seed_init($action){
	new Seed($action);
}
?>
