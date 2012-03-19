<?php
// Server image updload
define("UPLOAD_PATH", "/Users/wolftankk/home/workspace/spyder/static");

$ua = $_SERVER["HTTP_USER_AGENT"];

if ($ua == "Python-Spyder/1.1"){
    $imageData = $_POST["XiMaGe"];
    $imageName = $_POST["imageName"];
    $imageType = $_POST["imageType"];
    
    if (in_array($imageType, array("png", "gif", "jpg", "jpeg"))){
	#create path
	$path = "";
	for ($i = 0; $i < 8; $i=$i+2){
	    $path = $path."/".substr($imageName, $i, 2);
	    #check and create
	    $phyPath = UPLOAD_PATH . $path;

	    if (!is_dir($phyPath)){
	        if (!mkdir($phyPath, 0755)){
	            return;
	        }
	        if (!chmod($phyPath, 0755)){
	            return;
	        }
	    }
	}
	$path = $path . "/" . $imageName . "." . $imageType;

	$phyPath = UPLOAD_PATH . $path;
	$fhandle = fopen($phyPath, "wb");
	if (!$fhandle){
	    return;
	}
	$fwrite  = fwrite($fhandle, $imageData);
	if ($fwrite){
	    fclose($fhandle);
	    echo $path; 
	}
    }
}
?>
