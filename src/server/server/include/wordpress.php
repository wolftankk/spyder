<?php
/**
 * Insert a post to wordpress
 *    $post = array(
 *      'ID' => [ <post id> ] //Are you updating an existing post?
 *      'menu_order' => [ <order> ] //If new post is a page, sets the order should it appear in the tabs.
 *      'comment_status' => [ 'closed' | 'open' ] // 'closed' means no comments.
 *      'ping_status' => [ 'closed' | 'open' ] // 'closed' means pingbacks or trackbacks turned off
 *      'pinged' => [ ? ] //?
 *      'post_author' => [ <user ID> ] //The user ID number of the author.
 *      'post_category' => [ array(<category id>, <...>) ] //Add some categories.
 *      'post_content' => [ <the text of the post> ] //The full text of the post.
 *      'post_date' => [ Y-m-d H:i:s ] //The time post was made.
 *      'post_date_gmt' => [ Y-m-d H:i:s ] //The time post was made, in GMT.
 *      'post_excerpt' => [ <an excerpt> ] //For all your post excerpt needs.
 *      'post_name' => [ <the name> ] // The name (slug) for your post
 *      'post_parent' => [ <post ID> ] //Sets the parent of the new post.
 *      'post_password' => [ ? ] //password for post?
 *      'post_status' => [ 'draft' | 'publish' | 'pending'| 'future' ] //Set the status of the new post. 
 *      'post_title' => [ <the title> ] //The title of your post.
 *      'post_type' => [ 'post' | 'page' ] //Sometimes you want to post a page.
 *      'tags_input' => [ '<tag>, <tag>, <...>' ] //For tags.
 *      'to_ping' => [ ? ] //?
 *    );  
 * 
 */

class Wordpress {
    private $options;
    private $wpDB;
    public function __construct($articleData, $websiteData){
	$this->connectDatabase($websiteData);

	//load wordpress options
	$this->wp_options();
    }

    private function connectDatabase($websiteData){
        $this->wpDB = new Crow();
        $this->wpDB->connect($websiteData["host"], $websiteData["name"], $websiteData["passwd"], $websiteData["dbname"]);
        $this->wpDB->query("SET  NAMES UTF8");
    }

    private function wp_insert_post($articleData, $websiteData){
        global $db;
        //$dbcharset = "utf-8";
        //get wp options
        $wp_options = $this->wp_options($siteDB);

        $title = $articleData["title"];
        $content = mysql_escape_string($articleData["content"]);
        $fetchtime = $articleData["fetchtime"];

        $post_ID = 0;
        $post_date = $this->current_time("mysql");
        $post_date_gmt = $this->current_time("mysql", 1);
        $post_title = $title;
        $post_name = sha1($articleData["url"]);//唯一标示
        $post_status = "publish";
        $comment_status = "open";
        $post_parent = 0;
        $menu_order = 0;
        $post_author = 1;
        $post_type = "post";

        //check
        $post = $siteDB->get_one("SELECT ID FROM wp_posts WHERE post_name='$post_name'");
        if (!empty($post) && is_array($post) && count($post) > 0){
            send_ajax_response("error", "此文章已发布");
            exit;
        }

        //insert into db
        $sql = "INSERT INTO wp_posts SET post_author='$post_author', post_date='$post_date', post_date_gmt='$post_date_gmt', post_content='$content', post_title='$post_title', post_status='$post_status', comment_status='$comment_status', post_name='$post_name', post_type='$post_type', post_parent='$post_parent'";
        $succ = $siteDB->query($sql);
        if ($succ === false){
            send_ajax_response("error", "发布文章失败, 原因: ".$siteDB->error());
            exit;
        }
        $post_ID = $siteDB->insert_id();

        //update guid
        $guid = ($wp_options["siteurl"] . "?p=" . $post_ID);
        $sql = "UPDATE wp_posts SET guid='$guid' WHERE ID=$post_ID";
	$succ = $siteDB->query($sql);
	//update status
	//简体转繁体
        send_ajax_response("success", $succ);
    }

    private function current_time($type, $gmt=0){
        switch ($type){
            case "mysql":
                return ($gmt) ? gmdate("Y-m:d H:i:s") : gmdate("Y-m-d H:i:s", time() + 8 * 3600);
                break;
            case "timestamp":
                return $gmt ? time() : (time() + 8 * 3600);
                break;
        }
    }

    private function wp_options(){
        $query = $this->wpDB->query("SELECT * FROM wp_options");
        $options = array();
        while ($data = $db->fetch_array($query)){
            $options[$data["option_name"]] = $data["option_value"];
        }
	$this->options = $options;
    }
}

?>
