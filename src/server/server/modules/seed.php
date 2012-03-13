<?php
class Seed{
    private $sessionId;
    public function __construct($action, $sid){
        $this->sessionId = $sid;
        if (method_exists($this, $action)){
            call_user_func(array($this, $action));
        }else{
            send_ajax_response("error", "seed.$action method has not existed.");
        }
    }

    /**
     * @api: seed.AddSeed
     * @params: seedJSON
     */
    public function AddSeed(){
        checkArgs("seedJSON");
        
        //json_decode 有问题
        $data = post_string("seedJSON");
        $data = json_decode($data);

        $sname = checkArg("sname", $data);
        $url = checkArg("url", $data);
        $charset = checkArg("charset", $data);
        $frequency = checkArg("frequency", $data);
        $timeout = checkArg("timeout", $data);
        $tries = checkArg("tries", $data);
        $enabled = checkArg("enabled", $data);
        $listtype = checkArg("listtype", $data);

        $data = get_object_vars($data);

        //0 undefined category
        $cid = $data["cid"] ? $data["cid"] : 0;
        $list = array(
            "urlformat" => $data["list[urlformat]"],
            "startpage" => $data["list[startpage]"],
            "maxpage" => $data["list[maxpage]"],
            "step" => $data["list[step]"],
            "listparent" => $data["list[listparent]"],
            "entryparent" => $data["list[entryparent]"],
            "articleparent" => $data["list[articleparent]"],
            "titleparent" => $data["list[titleparent]"],
            "dateparent" => $data["list[dateparent]"]
        ); 
        $article = array(
            "articleparent" => $data["article[articleparent]"],
            "titleparent"   => $data["article[titleparent]"],
            "tagsparent"    => $data["article[tagparten]"],
            "authorparent"  => $data["article[authorparent]"],
            "contextparent" => $data["article[contextparent]"],
            "pageparent"    => $data["article[pageparent]"],
	    "filterscript"  => $data["article[filterscript]"],
	    "filters"	    => $data["filters"]
        );

        $rule = array(
            "list" => $list,
            "article" => $article
        );

        $createdTime = time();

        //get uid
        $userInfo = getCurrentSessionData($this->sessionId);
        $uid = $userInfo["uid"];
        $permissions = $userInfo["permissions"];

        global $db;
        $sql = ("INSERT INTO spyder.seeds (sname, cid, url, charset, enabled, listtype, rule, frequency, timeout, tries, uid, createdtime) VALUES ('$sname','$cid', '$url', '$charset', '$enabled', '$listtype', '" . mysql_escape_string(serialize($rule)) . "', '$frequency', '$timeout', '$tries', $uid, $createdTime)");
        $db->query($sql);
        $sid = $db->insert_id();
        send_ajax_response("success", $sid);
    }

    /**
     * @api: seed.EditSeed
     * @params: sid
     * @params: seedJSON
     */
    public function EditSeed(){
        checkArgs("SID");
        checkArgs("seedJSON");

        $sid  = post_string("SID");
        $data = post_string("seedJSON");
        $data = json_decode($data);

        $sname = checkArg("sname", $data);
        $url = checkArg("url", $data);
        $charset = checkArg("charset", $data);
        $frequency = checkArg("frequency", $data);
        $timeout = checkArg("timeout", $data);
        $tries = checkArg("tries", $data);
        $enabled = checkArg("enabled", $data);
        $listtype = checkArg("listtype", $data);

        $data = get_object_vars($data);

        $cid = $data["cid"] ? $data["cid"] : 0;
        $list = array(
            "urlformat" => $data["list[urlformat]"],
            "startpage" => $data["list[startpage]"],
            "maxpage" => $data["list[maxpage]"],
            "step" => $data["list[step]"],
            "listparent" => $data["list[listparent]"],
            "entryparent" => $data["list[entryparent]"],
            "articleparent" => $data["list[articleparent]"],
            "titleparent" => $data["list[titleparent]"],
            "dateparent" => $data["list[dateparent]"]
        ); 
        $article = array(
            "articleparent" => $data["article[articleparent]"],
            "titleparent"   => $data["article[titleparent]"],
            "tagsparent"    => $data["article[tagparten]"],
            "authorparent"  => $data["article[authorparent]"],
            "contextparent" => $data["article[contextparent]"],
            "pageparent"    => $data["article[pageparent]"],
	    "filterscript"  => $data["article[filterscript]"],
	    "filters"	    => $data["filters"]
        );

        $rule = array(
            "list" => $list,
            "article" => $article
        );


        $lastupdatetime = time();
        $userInfo = getCurrentSessionData($this->sessionId);
        $uid = $userInfo["uid"];
        $permissions = $userInfo["permissions"];

        global $db;
        $sql = "UPDATE spyder.seeds SET sname='$sname', cid='$cid', url='$url', charset='$charset', enabled='$enabled', listtype='$listtype', rule='".mysql_escape_string(serialize($rule))."', frequency='$frequency', timeout='$timeout', tries='$tries', uid='$uid', lastUpdateTime='$lastupdatetime' WHERE sid='$sid'";
        $succ = $db->query($sql);
        send_ajax_response("success", $succ);
    }

    /**
     * @api: seed.DeleteSeed
     * @params: sid
     */
    public function DeleteSeed(){
        checkArgs("SID");
        $sid = post_string("sid");
        global $db;
        $sql = "DELETE FROM spyder.seeds WHERE sid='$sid'";
        $succ = $db->query($sql);

        send_ajax_response("success", $succ);
    }

    /**
     * @api: seed.TestSeed
     * @params: sid
     */
    public function TestSeed(){
        checkArgs("SID");
        //call python
    }

    public function GetSeedRule(){
	checkArgs("SID");

	$sid = post_string("SID");

	global $db;
	$sql = "SELECT rule FROM spyder.seeds WHERE sid = '$sid'";
	$result = $db->get_one($sql);
	$rule = $result["rule"];
	$rule = unserialize($rule);

	send_ajax_response("success", $rule);
    }

    /**
     * @api: seed.GetSeedList
     * @params: start 
     * @params: limit
     * @params: AWhere
     */
    public function GetSeedList(){
        checkArgs("Start", "Limit", "AWhere");
        $start = post_string("Start");
        $limit = post_string("Limit");
        $where = post_string("AWhere");
        global $db;
        if (strlen($where) > 0) {
            $where = "WHERE $where";
        }

        $sql = "SELECT a.sid, a.sname, a.cid, b.cname, a.url, a.charset, a.enabled, a.listtype, a.frequency, a.timeout, a.tries, a.uid, c.uname, a.createdtime, a.lastupdatetime, a.starttime, a.finishtime FROM spyder.seeds as a LEFT JOIN spyder.seed_category as b ON a.cid = b.cid LEFT JOIN spyder.users as c ON a.uid = c.uid $where LIMIT $start, $limit";
        $query = $db->query($sql);
        $Data = array();
        $MetaData = array();
        $isGetMetaData = false;
        while ($data = $db->fetch_array($query)){
            if (!$isGetMetaData){
                $keys = array_keys($data);
                for ($c = 0; $c < count($keys); $c++){
                    $key = $keys[$c];
                    $fieldHidden = false;
                    if ($key == "uid" || $key == "cid"){
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
        
        $count = $db->get_one("SELECT COUNT(*) as count FROM spyder.seeds $where");

        send_ajax_response("success", array("TotalCount"=>$count["count"], "Data"=>$Data, "MetaData"=>$MetaData));
    }

    /**
     * @api: seed.AddSeedCategory
     * @params: seedCategoryJSON
     */
    public function AddSeedCategory(){
        //$permissions = getCurrentPermissions();
        checkArgs("seedCategoryJSON");
        $data = JSON_decode(post_string("seedCategoryJSON"));
        $name = $data->name;
        $parentId = $data->parentid;

        if ($name == null || empty($name)){
            send_ajax_response("error", "AddSeedCategory must need `name`");
            exit();
        }

        if ($parentId == null || empty($parentId) || strlen($parentId) == 0){
            $parentId = -1;
        }

        $name = mysql_escape_string($name);
        global $db;
        $db->query("INSERT INTO spyder.seed_category (pid, cname) VALUES ('$parentId','$name')");
        $cid = $db->insert_id();
        send_ajax_response("success", $cid);
    }

    /**
     * @api: seed.EditSeedCategory
     * @params: sid
     * @params: seedCategoryJSON
     */
    public function EditSeedCategory(){
        checkArgs("CID");
        checkArgs("seedCategoryJSON");
        $cid = post_string("CID");
        $data = post_string("seedCategoryJSON");

        $name = $data->name;
        $parentId = $data->parentid;

        if ($name == null || empty($name)){
            send_ajax_response("error", "EditSeedCategory must need `name`");
            exit();
        }

        if ($parentId == null || empty($parentId) || strlen($parentId) == 0){
            $parentId = -1;
        }

        $name = mysql_escape_string($name);
        global $db;
        $succ = $db->query("UPDATE spyder.seed_category SET pid='$parentId', cname='$name' WHERE cid='$cid'");
        send_ajax_response("success", $succ);
    }

    /**
     * @api: seed.DeleteSeedCategory
     * @params: sid
     */
    public function DeleteSeedCategory(){
        checkArgs("CID");
        $cid = post_string("CID");
        global $db;
        $sql = "DELETE FROM spyder.seed_category WHERE cid='$cid'";
        $succ = $db->query($sql);

        send_ajax_response("success", $succ);
    }

    public function GetSeedCategoryList(){

    }

    /**
     * @api: seed.ToggleSeed
     * @params: seedJSON
     */
    public function ToggleSeed(){

    }
}

function module_seed_init($action, $sid){
    new Seed($action, $sid);
}
?>
