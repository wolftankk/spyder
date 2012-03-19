<?php
// Server image updload
define("UPLOAD_PATH", "/Users/wolftankk/home/workspace/spyder/temp");

class Image{
    private $fileNameKey;
    private $maxFileSize;
    private $maxImageHeight;
    private $maxImageWidth;
    private $isOverwriteFile;
    private $acceptFileTypeList;
    private $denyFileTypeList;
    private $errorCode;

    public function __construct($args){
	$this->acceptFileTypeList = array();
	$this->denyFileTypeList   = array();
	$this->isOverwriteFile    = true;
	$this->fileNameKey        = $args;
    }

    public function setMaxFileSize($size){
	$this->maxFileSize = $size;
    }

    public function setMaxImage($height, $width){
	$this->maxImageHeight = $height;
	$this->maxImageWidth  = $width;
    }

    public function setOverwriteFile($isOverwirte){
	$this->isOverwriteFile = $isOverwirte;
    }

    public function upload($dest, $fileName = ''){

    }
}

#print_r($_FILES);
#print_r($_POST);

if ($_FILES && $_FILES["XiMaGe"]){

}

?>
<!--
<html>
<head></head>
<body>
<form enctype="multipart/form-data" action="upload_image.php" method="post">
    <input type="hidden" name="_header" value="py-spyder"/>
    <input type="hidden" name="imgname" value="" />
    <input name="XiMaGe" type="file" />
    <input type="submit" />
</form>
</body>
</html>
-->
