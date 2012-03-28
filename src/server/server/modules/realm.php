<?php
class Realm{
    private $sessionId;
    public function __construct($action, $sid){
        $this->sessionId = $sid;
        if (method_exists($this, $action)){
            call_user_func(array($this, $action));
        }else{
            send_ajax_response("error", "seed.$action method has not existed.");
        }
    }

    public function AddGame(){

    }

    public function EditGame(){

    }

    public function DeleteGame(){

    }

    public function GetGameDataPageData(){

    }

    public function AddOperator(){

    }

    public function EditOperator(){

    }

    public function DeleteOperator(){

    }

    public function GetOperatorPageData(){

    }

    public function AddRealm(){

    }

    public function EditRealm(){

    }

    public function DeleteRealm(){

    }

    public function GetRealmPageData(){

    }
}

function module_realm_init($action, $sid){
    new Realm($action, $sid);
}
?>
