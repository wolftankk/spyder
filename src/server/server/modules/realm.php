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
        checkArgs("GameJSON");
        
        //json_decode 有问题
        $data = post_string("GameJSON");
	$data = json_decode($data);

        $name = checkArg("name", $data);

	$desc = $data->description;
	$url  = $data->url;
	$category  = $data->category;
	$developer = $data->developer;
	$type = $data->type;
	$theme = $data->theme;

	$sql = "INSERT INTO supe_gamesitems (name, description, url, category, developer) VALUES ('$name', '" . mysql_escape_string($desc) . "', '$url', '$category', '$developer')";
        $this->ssDB->query($sql);
        $gid = $this->ssDB->insert_id();
        send_ajax_response("success", $gid);
    }

    public function EditGame(){
	checkArgs("GID");
        checkArgs("GameJSON");
        
        //json_decode 有问题
	$gid = post_string("GID");
        $data = post_string("GameJSON");
	$data = json_decode($data);

        $name = checkArg("name", $data);

	$desc = mysql_escape_string($data->description);
	$url  = $data->url;
	$category  = $data->category;
	$developer = $data->developer;
	$type = $data->type;
	$theme = $data->theme;

	$sql = "UPDATE supe_gamesitems SET name='$name', description = '$desc', url = '$url', category = '$category', developer = '$developer' WHERE itemid = $gid";
        $succ = $this->ssDB->query($sql);
        send_ajax_response("success", $succ);
    }

    public function DeleteGame(){
	checkArgs("GID");

	$gid = post_string("GID");

	$sql = "DELETE FROM supe_gamesitems WHERE itemid=$gid";
	$succ = $this->ssDB->query($sql);
	//自动移除realms上的相关数据
	$sql = "DELETE FROM supe_gamerealms WHERE gid = $gid";
	$succ = $succ && ($this->ssDB->query($sql));
	send_ajax_response("success", $succ);
    }

    public function GetGameDataPageData(){
	checkArgs("Start", "Limit", "AWhere");
        $start = post_string("Start");
        $limit = post_string("Limit");
        $where = post_string("AWhere");
        if (strlen($where) > 0) {
            $where = "WHERE $where";
	}

	$sql = "SELECT * FROM supe_gamesitems $where LIMIT $start, $limit";
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
                    if ($key == "itemid"){
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
        $count = $this->ssDB->get_one("SELECT COUNT(*) as count FROM supe_gamesitems $where");
        send_ajax_response("success", array("TotalCount"=>$count["count"], "Data"=>$Data, "MetaData"=>$MetaData));
    }

    public function AddOperator(){
        checkArgs("OperatorJSON");
        
        //json_decode 有问题
        $data = post_string("OperatorJSON");
	$data = json_decode($data);

        $name = checkArg("name", $data);

	$url  = $data->url;

	$sql = "INSERT INTO supe_gameoperators (name, url) VALUES ('$name', '$url')";
        $this->ssDB->query($sql);
        $gid = $this->ssDB->insert_id();
        send_ajax_response("success", $gid);
    }

    public function EditOperator(){
	checkArgs("OID");
        checkArgs("OperatorJSON");
        
        //json_decode 有问题
	$oid = post_string("OID");
        $data = post_string("OperatorJSON");
	$data = json_decode($data);

        $name = checkArg("name", $data);

	$url  = $data->url;

	$sql = "UPDATE supe_gameoperators SET name='$name', url = '$url' WHERE id = $oid";
        $succ = $this->ssDB->query($sql);
        send_ajax_response("success", $succ);
    }

    public function DeleteOperator(){
	checkArgs("OID");

	$oid = post_string("OID");

	$sql = "DELETE FROM supe_gameoperators WHERE id = $oid";
	$succ = $this->ssDB->query($sql);
	//自动移除realms上的相关数据
	$sql = "DELETE FROM supe_gamerealms WHERE oid = $oid";
	$succ = $succ && ($this->ssDB->query($sql));
        send_ajax_response("success", $succ);
    }

    public function GetOperatorPageData(){
	checkArgs("Start", "Limit", "AWhere");
        $start = post_string("Start");
        $limit = post_string("Limit");
        $where = post_string("AWhere");
        if (strlen($where) > 0) {
            $where = "WHERE $where";
	}

	$sql = "SELECT * FROM supe_gameoperators $where LIMIT $start, $limit";
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
        $count = $this->ssDB->get_one("SELECT COUNT(*) as count FROM supe_gameoperators $where");
        send_ajax_response("success", array("TotalCount"=>$count["count"], "Data"=>$Data, "MetaData"=>$MetaData));
    }

    public function AddRealm(){
        checkArgs("RJSON");
        
        //json_decode 有问题
        $data = post_string("RJSON");
	$data = json_decode($data);

        $name = checkArg("name", $data);
	$gid  = checkArg("gid", $data);
	$oid  = checkArg("oid", $data);

	$url = $data->url;
	$date = $data->date;
	$status = $data->status;

	$sql = "INSERT INTO supe_gamerealms (name, gid, oid, url, date, status) VALUES ('$name', $gid, $oid, '$url', '$date', '$status')";
        $this->ssDB->query($sql);
        $rid = $this->ssDB->insert_id();
        send_ajax_response("success", $rid);
    }

    public function EditRealm(){
        checkArgs("RID", "RJSON");
        
        //json_decode 有问题
	$rid = post_string("RID");
        $data = post_string("RJSON");
	$data = json_decode($data);

        $name = checkArg("name", $data);
	$gid  = checkArg("gid", $data);
	$oid  = checkArg("oid", $data);

	$url = $data->url;
	$date = $data->date;
	$status = $data->status;

	$sql = "UPDATE supe_gamerealms set name='$name', gid = '$gid', oid = '$oid', url = '$url', date='$date', status='$status' WHERE id=$rid";
        $succ = $this->ssDB->query($sql);
        send_ajax_response("success", $succ);
    }

    public function DeleteRealm(){
	checkArgs("RID");

	$rid = intval(post_string("RID"));

	$sql = "DELETE FROM supe_gamerealms WHERE id = $rid";
	$succ = $this->ssDB->query($sql);
        send_ajax_response("success", $succ);
    }

    public function GetRealmPageData(){
	checkArgs("Start", "Limit", "AWhere");
        $start = post_string("Start");
        $limit = post_string("Limit");
        $where = post_string("AWhere");
        if (strlen($where) > 0) {
            $where = "WHERE $where";
	}

	$sql = "SELECT a.id, a.gid, b.name as gname, a.oid, c.name as oname, a.url, a.date, a.name, a.status  FROM supe_gamerealms as a LEFT JOIN supe_gamesitems as b ON a.gid = b.itemid LEFT JOIN supe_gameoperators as c ON a.oid = c.id $where LIMIT $start, $limit";
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
                    if (in_array($key, array("itemid", "id", "gid", "oid"))){
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
        $count = $this->ssDB->get_one("SELECT COUNT(*) as count FROM supe_gamerealms $where");
        send_ajax_response("success", array("TotalCount"=>$count["count"], "Data"=>$Data, "MetaData"=>$MetaData));
    }
}

function module_realm_init($action, $sid){
    new Realm($action, $sid);
}
?>
