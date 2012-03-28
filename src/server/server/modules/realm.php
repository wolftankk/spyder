<?php
class Realm{
    private $sessionId;
    public function __construct($action, $sid){
        $this->sessionId = $sid;
        if (method_exists($this, $action)){
	    $this->ssDB = new Crow();
	    $this->ssDB->connect("172.16.130.7", "root", "", "supesite");
	    $this->ssDB->query("SET  NAMES UTF8");
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
	checkArgs("Start", "Limit", "AWhere");
        $start = post_string("Start");
        $limit = post_string("Limit");
        $where = post_string("AWhere");
        if (strlen($where) > 0) {
            $where = "WHERE $where";
	}

	$sql = "SELECT * FROM supe_webgames $where LIMIT $start, $limit";
        $Data = array();
        $MetaData = array();
	$isGetMetaData = false;

        $query = $this->ssDB->query($sql);

        while ($data = $this->ssDB->fetch_array($query)){
            if (!$isGetMetaData){
                $keys = array_keys($data);
                for ($c = 0; $c < count($keys); $c++){
                    $key = $keys[$c];
                    $fieldHidden = false;
                    if ($key == "id"){
                        $fieldHidden = true;
                    }
                    $MetaData[] = array(
                        "fieldName" => $keys[$c],
                        "dataIndex" => $keys[$c],
                        "fieldHidden" => $fieldHidden
                    );
                }
                $isGetMetaData = true;
            }
            $Data[] = array_values($data);
	}
        $count = $this->ssDB->get_one("SELECT COUNT(*) as count FROM supe_webgames $where");
        send_ajax_response("success", array("TotalCount"=>$count["count"], "Data"=>$Data, "MetaData"=>$MetaData));
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
