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

print_r($_FILES);
print_r($_POST);

?>

<html>
<head></head>
<body>
<form action="upload_image.php" method="post">
    <input name="_image" type="file" />
</form>
</body>
</html>
