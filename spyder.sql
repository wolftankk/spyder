-- phpMyAdmin SQL Dump
-- version 3.5.3
-- http://www.phpmyadmin.net
--
-- 主机: local.site
-- 生成日期: 2013 年 01 月 14 日 12:26
-- 服务器版本: 5.5.21
-- PHP 版本: 5.3.15

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `spyder`
--

-- --------------------------------------------------------

--
-- 表的结构 `field_template`
--

CREATE TABLE IF NOT EXISTS `field_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL COMMENT 'field name',
  `title` varchar(64) NOT NULL COMMENT 'nickname',
  `type` enum('article','game','kaifu','kaice','gift','company','gallery') NOT NULL DEFAULT 'article',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`type`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=62 ;

--
-- 转存表中的数据 `field_template`
--

INSERT INTO `field_template` (`id`, `name`, `title`, `type`) VALUES
(1, 'title', '文章标题', 'article'),
(2, 'author', '作者', 'article'),
(3, 'tag', '标签', 'article'),
(4, 'source', '来源', 'article'),
(5, 'content', '正文', 'article'),
(6, 'create_time', '发表时间', 'article'),
(7, 'game_name', '游戏名称', 'game'),
(8, 'game_tag', '游戏模式', 'game'),
(9, 'game_theme', '游戏题材', 'game'),
(10, 'game_effect', '画面方式', 'game'),
(11, 'game_fight', '战斗方式', 'game'),
(12, 'game_area', '游戏产地', 'game'),
(13, 'game_price', '收费模式', 'game'),
(14, 'game_status', '游戏状态', 'game'),
(15, 'game_developer', '开发公司', 'game'),
(16, 'game_intro', '游戏介绍', 'game'),
(17, 'game_website', '官网地址', 'game'),
(18, 'game_thumb', '游戏缩略图', 'game'),
(19, 'game_avatar', '游戏封面', 'game'),
(20, 'create_time', '插入时间', 'game'),
(21, 'game_name', '游戏名称', 'kaifu'),
(22, 'game_tag', '游戏模式', 'kaifu'),
(23, 'oper_name', '运营商名称', 'kaifu'),
(24, 'dev_name', '开发商名称', 'kaifu'),
(25, 'server_name', '服务器名', 'kaifu'),
(26, 'test_date', '测试时间', 'kaifu'),
(27, 'register_url', '注册地址', 'kaifu'),
(28, 'source', '来源', 'kaifu'),
(29, 'game_name', '游戏名称', 'kaice'),
(30, 'game_tag', '游戏模式', 'kaice'),
(31, 'oper_name', '运营商名称', 'kaice'),
(32, 'dev_name', '开发商名称', 'kaice'),
(33, 'server_name', '服务器名', 'kaice'),
(34, 'test_status', '测试状态', 'kaice'),
(35, 'register_url', '注册地址', 'kaice'),
(36, 'test_date', '测试时间', 'kaice'),
(37, 'source', '来源', 'kaice'),
(38, 'game_name', '游戏名称', 'gift'),
(39, 'game_tag', '游戏模式', 'gift'),
(40, 'oper_name', '运营商名称', 'gift'),
(41, 'send_date', '发送时间', 'gift'),
(42, 'get_url', '领取链接', 'gift'),
(43, 'server_name', '服务器名', 'gift'),
(44, 'gift_name', '卡名称', 'gift'),
(45, 'pubdate', '上架时间', 'gift'),
(46, 'expire_date', '有效时间', 'gift'),
(47, 'short_name', '厂商简称', 'company'),
(48, 'full_name', '厂商全称', 'company'),
(49, 'description', '厂商介绍', 'company'),
(50, 'offical_url', '官网地址', 'company'),
(51, 'address', '地址', 'company'),
(52, 'telephone', '电话', 'company'),
(53, 'email', '电子邮件', 'company'),
(54, 'company_thumb', '厂商logo', 'company'),
(55, 'title', '图库标题', 'gallery'),
(56, 'author', '作者', 'gallery'),
(57, 'tag', '标签', 'gallery'),
(58, 'source', '来源', 'gallery'),
(59, 'thumb', '缩略图', 'gallery'),
(60, 'content', '内容图片', 'gallery'),
(61, 'kaice_type', '游戏类型', 'kaice');

-- --------------------------------------------------------

--
-- 表的结构 `seeds`
--

CREATE TABLE IF NOT EXISTS `seeds` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `seed_name` varchar(64) NOT NULL,
  `type` enum('article','game','kaifu','kaice','gift','company','gallery') NOT NULL DEFAULT 'article',
  `guid_rule` varchar(255) DEFAULT NULL,
  `charset` char(10) NOT NULL DEFAULT 'utf-8',
  `lang` char(4) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `listtype` enum('html','feed','json') NOT NULL,
  `rule` mediumtext NOT NULL,
  `frequency` int(10) unsigned NOT NULL,
  `timeout` smallint(6) NOT NULL DEFAULT '300',
  `tries` tinyint(4) NOT NULL DEFAULT '5',
  `created_time` int(11) NOT NULL,
  `update_time` int(11) NOT NULL,
  `start_time` int(11) NOT NULL,
  `finish_time` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  UNIQUE KEY `url` (`guid_rule`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=24 ;

--
-- 转存表中的数据 `seeds`
--

INSERT INTO `seeds` (`sid`, `seed_name`, `type`, `guid_rule`, `charset`, `lang`, `enabled`, `listtype`, `rule`, `frequency`, `timeout`, `tries`, `created_time`, `update_time`, `start_time`, `finish_time`) VALUES
(2, '开服网新闻', 'article', NULL, 'utf-8', 'zhCN', 1, 'html', 'a:12:{s:9:"urlformat";s:55:"http://www.kaifu.com/article-60--0-0-0-0-0-0-$page.html";s:10:"pageparent";s:18:"div[class=''pages'']";s:7:"maxpage";s:1:"5";s:4:"step";s:2:"10";s:7:"filters";s:0:"";s:10:"contenturl";s:76:"div[class=''fl p14 blue news_detailliset lh40'']  a[class=''blue''].attr(''href'')";s:7:"urltype";s:10:"createLink";s:4:"zero";s:1:"1";s:13:"contentparent";s:57:"div[class=''fl newsinfo_topline boder_base newsinfo_left'']";s:10:"listparent";s:57:"div[class=''fl newsinfo_topline boder_base newsinfo_left'']";s:9:"startpage";s:1:"0";s:11:"entryparent";s:18:"li[class=''b_line'']";}', 7200, 30, 5, 0, 1357631062, 1358132468, 1358132898),
(20, '开服网开测表', 'kaice', NULL, 'auto', 'zhCN', 1, 'html', 'a:12:{s:9:"urlformat";s:36:"http://www.kaifu.com/gametest-0.html";s:10:"pageparent";s:0:"";s:7:"maxpage";s:1:"1";s:4:"step";s:1:"1";s:7:"filters";s:0:"";s:10:"contenturl";s:0:"";s:7:"urltype";s:9:"inputLink";s:4:"zero";s:1:"0";s:13:"contentparent";s:0:"";s:10:"listparent";s:16:"div[id=leftlist]";s:9:"startpage";s:1:"1";s:11:"entryparent";s:2:"ul";}', 3600, 10, 5, 1357874593, 1358131137, 1358136512, 1358136520),
(21, '开服网礼包', 'gift', NULL, 'auto', 'zhCN', 1, 'html', 'a:12:{s:9:"urlformat";s:56:"http://ka.kaifu.com/gift-0-0-0-0-0-0-1-0-$page-list.html";s:10:"pageparent";s:0:"";s:7:"maxpage";s:1:"5";s:4:"step";s:2:"22";s:7:"filters";s:0:"";s:10:"contenturl";s:0:"";s:7:"urltype";s:10:"createLink";s:4:"zero";s:1:"1";s:13:"contentparent";s:0:"";s:10:"listparent";s:22:"div[class="gift_list"]";s:9:"startpage";s:1:"0";s:11:"entryparent";s:2:"ul";}', 3600, 10, 5, 1357880497, 1358131142, 1358136520, 1358136528),
(8, '开服网开服', 'kaifu', NULL, 'auto', 'zhCN', 1, 'html', 'a:12:{s:9:"urlformat";s:51:"http://kf.kaifu.com/index-0-1-$page----0-0-0-0.html";s:10:"pageparent";s:0:"";s:7:"maxpage";s:1:"1";s:4:"step";s:1:"1";s:7:"filters";s:0:"";s:10:"contenturl";s:0:"";s:7:"urltype";s:8:"dateLink";s:4:"zero";s:1:"0";s:13:"contentparent";s:0:"";s:10:"listparent";s:17:"div[id="content"]";s:9:"startpage";s:10:"YYYY-MM-DD";s:11:"entryparent";s:20:"div[id="kflist"] >ul";}', 3600, 5, 5, 1357542329, 1358131149, 1358132908, 1358132930),
(18, '开服网新闻20130108125238', 'article', NULL, 'utf-8', 'zhCN', 0, 'html', 'a:12:{s:9:"urlformat";s:55:"http://www.kaifu.com/article-60--0-0-0-0-0-0-$page.html";s:10:"pageparent";s:18:"div[class=''pages'']";s:7:"maxpage";s:1:"5";s:4:"step";s:2:"10";s:7:"filters";s:0:"";s:10:"contenturl";s:76:"div[class=''fl p14 blue news_detailliset lh40'']  a[class=''blue''].attr(''href'')";s:7:"urltype";s:10:"createLink";s:4:"zero";s:1:"1";s:13:"contentparent";s:57:"div[class=''fl newsinfo_topline boder_base newsinfo_left'']";s:10:"listparent";s:57:"div[class=''fl newsinfo_topline boder_base newsinfo_left'']";s:9:"startpage";s:1:"0";s:11:"entryparent";s:18:"li[class=''b_line'']";}', 7200, 30, 5, 1357620758, 1357620758, 0, 0),
(7, '开服网游戏', 'game', NULL, 'auto', 'zhCN', 1, 'html', 'a:12:{s:9:"urlformat";s:62:"http://www.kaifu.com/gamelist-1-0-0-0-0-0-0-0-0-0-1-$page.html";s:10:"pageparent";s:0:"";s:7:"maxpage";s:1:"1";s:4:"step";s:2:"64";s:7:"filters";s:0:"";s:10:"contenturl";s:38:"(p[class=''gl_gname''] > a).attr(''href'')";s:7:"urltype";s:10:"createLink";s:4:"zero";s:1:"1";s:13:"contentparent";s:50:"div[class=''fl boder_base newsinfo_left game_info'']";s:10:"listparent";s:28:"div[class=''box_line picbox'']";s:9:"startpage";s:1:"0";s:11:"entryparent";s:27:"ul[class=''position_div fl'']";}', 3600, 30, 5, 1356075535, 1358131158, 1358132930, 1358133126),
(22, '开服网运营商', 'company', NULL, 'auto', 'zhCN', 1, 'html', 'a:12:{s:9:"urlformat";s:50:"http://www.kaifu.com/platformlist-0-0-2-$page.html";s:10:"pageparent";s:0:"";s:7:"maxpage";s:2:"29";s:4:"step";s:2:"45";s:7:"filters";s:0:"";s:10:"contenturl";s:18:"p > a.attr("href")";s:7:"urltype";s:10:"createLink";s:4:"zero";s:1:"1";s:13:"contentparent";s:20:"div[class="ptsport"]";s:10:"listparent";s:33:"div[class=''boxmodel operator''] ul";s:9:"startpage";s:1:"0";s:11:"entryparent";s:2:"li";}', 3600, 10, 5, 1357883479, 1358131163, 1358133126, 1358133467),
(23, '开服网游戏截图', 'gallery', NULL, 'auto', 'zhCN', 1, 'json', 'a:12:{s:9:"urlformat";s:74:"http://www.kaifu.com/picturebooklet.php?action=getList&type=3&tag=0&page=1";s:10:"pageparent";s:0:"";s:7:"maxpage";s:1:"1";s:4:"step";s:1:"1";s:7:"filters";s:0:"";s:10:"contenturl";s:3:"url";s:7:"urltype";s:9:"inputLink";s:4:"zero";s:1:"0";s:13:"contentparent";s:21:"div[class="box-list"]";s:10:"listparent";s:0:"";s:9:"startpage";s:1:"1";s:11:"entryparent";s:0:"";}', 3600, 30, 5, 1357884365, 1358131168, 1358133467, 1358133475);

-- --------------------------------------------------------

--
-- 表的结构 `seed_fields`
--

CREATE TABLE IF NOT EXISTS `seed_fields` (
  `seed_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `fetch_all` tinyint(2) NOT NULL DEFAULT '0' COMMENT '是否采集所有子元素',
  `page_type` enum('list','content') NOT NULL COMMENT '采集目标页面的类型：列表或者内容页',
  KEY `seed_id` (`seed_id`,`field_id`),
  KEY `seed_id_2` (`seed_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `seed_fields`
--

INSERT INTO `seed_fields` (`seed_id`, `field_id`, `value`, `fetch_all`, `page_type`) VALUES
(2, 1, 'h6[class='' lh40''].text()', 0, 'content'),
(2, 2, 'span[class=author].text()', 0, 'content'),
(2, 3, 'span[class=''gray decoration''] > a.text()', 0, 'list'),
(2, 5, 'div[class=''newsinfo_artical p14 lh24''].html()', 0, 'content'),
(2, 4, '来源：[arg]浏览', 0, 'content'),
(2, 6, '本文[arg]发布', 0, 'content'),
(7, 18, 'img[class=''imgboxs''].attr(''src'')', 0, 'list'),
(7, 17, 'a[class=''bt_playgame''].attr(''href'')', 0, 'content'),
(7, 16, 'div[class=''newsinfo_artical p14 lh24 fl mt_5''] p.text()', 0, 'content'),
(7, 14, '', 0, 'content'),
(7, 15, '<span>开发公司：<a href="(*)" target="_blank">[arg]</a></span>', 0, 'content'),
(7, 13, '<span>收费模式：<a href="(*)" target="_blank">[arg]</a></span>', 0, 'content'),
(7, 12, '<span>游戏产地：<a href="(*)" target="_blank">[arg]</a></span>', 0, 'content'),
(7, 11, '<span>战斗方式：<a href="(*)" target="_blank">[arg]</a></span>', 0, 'content'),
(7, 10, '<span>画面方式：<a href="(*)" target="_blank">[arg]</a></span>', 0, 'content'),
(8, 21, 'li.eq(1).text()', 0, 'list'),
(8, 22, '', 0, 'list'),
(8, 23, 'li.eq(3).text()', 0, 'list'),
(8, 24, '', 0, 'list'),
(8, 25, 'li.eq(2).text()', 0, 'list'),
(8, 26, 'li.eq(0).text()', 0, 'list'),
(8, 27, 'li.eq(5) a.attr("href")', 0, 'list'),
(8, 28, '', 0, 'list'),
(18, 3, 'span[class=''gray decoration''] > a.text()', 0, 'list'),
(18, 4, '来源：[arg]浏览', 0, 'content'),
(18, 5, 'div[class=''newsinfo_artical p14 lh24''].html()', 0, 'content'),
(18, 6, '本文[arg]发布', 0, 'content'),
(18, 2, 'span[class=author].text()', 0, 'content'),
(18, 1, 'h6[class='' lh40''].text()', 0, 'content'),
(7, 9, '<span>游戏题材：<a href="(*)" target="_blank">[arg]</a></span>', 0, 'content'),
(7, 8, '<span>游戏模式：<a href="(*)" target="_blank">[arg]</a></span>', 0, 'content'),
(7, 7, '(div[class=''title''] > h6[class=''fl''] > a:first).text()', 0, 'content'),
(7, 19, 'div[class=''fl pic mr picbd''] img.attr(''src'')', 0, 'content'),
(7, 20, 'p[class=''gray''].text()', 0, 'list'),
(20, 29, 'li.eq(1) a.text()', 0, 'list'),
(20, 30, 'li.eq(3) a.text()', 0, 'list'),
(20, 31, 'li.eq(4) a.text()', 0, 'list'),
(20, 32, '', 0, 'list'),
(20, 33, '', 0, 'list'),
(20, 34, 'li.eq(2).text()', 0, 'list'),
(20, 35, '', 0, 'list'),
(20, 36, 'li.eq(0).text()', 0, 'list'),
(20, 37, '', 0, 'list'),
(20, 61, 'li.eq(5) a.text()', 0, 'list'),
(21, 38, 'li.eq(1) a.text()', 0, 'list'),
(21, 39, '', 0, 'list'),
(21, 40, 'li.eq(5) a.text()', 0, 'list'),
(21, 41, 'li.eq(0).text()', 0, 'list'),
(21, 42, 'li.eq(3) a.attr("href")', 0, 'list'),
(21, 43, 'li.eq(4).text()', 0, 'list'),
(21, 44, 'li.eq(3) a.text()', 0, 'list'),
(21, 45, '', 0, 'list'),
(21, 46, '', 0, 'list'),
(22, 47, 'div[class="rightdiv"] > h2.text()', 0, 'content'),
(22, 48, '', 0, 'content'),
(22, 49, 'div[class="rightdiv"] > div.eq(1).text()', 0, 'content'),
(22, 50, 'div[class="leftdiv2"] > a.attr("href")', 0, 'content'),
(22, 51, '', 0, 'content'),
(22, 52, '', 0, 'content'),
(22, 53, '', 0, 'content'),
(22, 54, 'img.attr("src")', 0, 'list'),
(23, 55, 'div[class="title"] h1.text()', 0, 'content'),
(23, 56, '', 0, 'content'),
(23, 57, '', 0, 'content'),
(23, 58, '', 0, 'content'),
(23, 59, 'cover_pic_list', 0, 'list'),
(23, 60, 'ul[id="item-list"] li.attr("pic")', 1, 'content');

-- --------------------------------------------------------

--
-- 表的结构 `seed_logs`
--

CREATE TABLE IF NOT EXISTS `seed_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `start_time` int(11) NOT NULL,
  `finish_time` int(11) NOT NULL,
  `status` tinyint(2) NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

--
-- 转存表中的数据 `seed_logs`
--

INSERT INTO `seed_logs` (`id`, `sid`, `start_time`, `finish_time`, `status`, `message`) VALUES
(1, 2, 1358131081, 1358131506, 1, '采集成功'),
(2, 20, 1358131715, 1358131717, 1, '采集成功'),
(3, 21, 1358131717, 1358131724, 1, '采集成功'),
(4, 8, 1358131724, 1358131750, 1, '采集成功'),
(5, 7, 1358131750, 1358131936, 1, '采集成功'),
(6, 22, 1358131936, 1358132206, 1, '采集成功'),
(7, 23, 1358132206, 1358132214, 1, '采集成功'),
(8, 2, 1358132468, 1358132898, 1, '采集成功'),
(9, 20, 1358132898, 1358132901, 1, '采集成功'),
(10, 21, 1358132901, 1358132908, 1, '采集成功'),
(11, 8, 1358132908, 1358132930, 1, '采集成功'),
(12, 7, 1358132930, 1358133126, 1, '采集成功'),
(13, 22, 1358133126, 1358133467, 1, '采集成功'),
(14, 23, 1358133467, 1358133475, 1, '采集成功'),
(15, 20, 1358136512, 1358136520, 1, '采集成功'),
(16, 21, 1358136520, 1358136528, 1, '采集成功');

-- --------------------------------------------------------

--
-- 表的结构 `seed_tag`
--

CREATE TABLE IF NOT EXISTS `seed_tag` (
  `sid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  PRIMARY KEY (`sid`,`tid`),
  UNIQUE KEY `sid` (`sid`,`tid`),
  KEY `tid` (`tid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `seed_tag`
--

INSERT INTO `seed_tag` (`sid`, `tid`) VALUES
(2, 4),
(2, 5),
(23, 12);

-- --------------------------------------------------------

--
-- 表的结构 `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL DEFAULT '-1',
  `name` varchar(255) NOT NULL,
  `type` enum('tag','category') NOT NULL DEFAULT 'tag',
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- 转存表中的数据 `tags`
--

INSERT INTO `tags` (`id`, `parent_id`, `name`, `type`, `description`) VALUES
(4, -1, '游戏资讯', 'tag', ''),
(5, -1, '游戏新闻', 'tag', ''),
(6, -1, '海外资讯', 'tag', ''),
(7, -1, '产业新闻', 'tag', ''),
(8, -1, '人物采访', 'tag', ''),
(9, -1, '热点追踪', 'tag', ''),
(11, -1, '美女图片', 'tag', ''),
(12, -1, '游戏截图', 'tag', '');

-- --------------------------------------------------------

--
-- 表的结构 `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `passwd` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `permissions` varchar(255) NOT NULL,
  `salt` char(10) NOT NULL,
  `createtime` int(11) NOT NULL,
  `lastlogintime` int(11) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- 转存表中的数据 `users`
--

INSERT INTO `users` (`uid`, `username`, `passwd`, `email`, `permissions`, `salt`, `createtime`, `lastlogintime`) VALUES
(10, 'admin', '13dbcde8ab9b640d6d725b57750ab3d6', 'admin@admin.com', 'administrator', 'gWT3', 0, 1358134681),
(11, 'fireyy', '793d2dd8ac95f086666650518c69665d', 'fireyy@admin.com', 'administrator', 'at2Y', 1356060783, 1358130133);

-- --------------------------------------------------------

--
-- 表的结构 `websites`
--

CREATE TABLE IF NOT EXISTS `websites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `descript` varchar(255) DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `sync_type` enum('mysql','api') NOT NULL,
  `sync_profile` text NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `websites`
--

INSERT INTO `websites` (`id`, `name`, `descript`, `url`, `sync_type`, `sync_profile`, `status`) VALUES
(1, 'CMDP', 'CMDP站点的入库配置', 'http://cmdp.58apps.com', 'mysql', 'a:16:{s:14:"mysql_password";s:16:"CTCBxwJNHusBC4f6";s:10:"ftp_server";s:13:"58.222.24.174";s:8:"ftp_port";s:4:"2012";s:12:"ftp_username";s:4:"cmdp";s:12:"mysql_dbname";s:4:"cmdp";s:10:"staticType";s:6:"aliyun";s:12:"mysql_prefix";s:0:"";s:9:"access_id";s:40:"wwcO42sOUjCFm7qVQId6a6dAHSglHIG4wgs_JErW";s:8:"ftp_path";s:1:"/";s:12:"ftp_password";s:9:"il@veCMDP";s:9:"staticUrl";s:26:"http://cdn.img.qiniudn.com";s:14:"mysql_username";s:6:"spyder";s:12:"mysql_server";s:13:"58.222.24.171";s:17:"secret_access_key";s:40:"62Be9PyMh6bAPvIHQkIr1-FOGku8t84NI3zkUf9E";s:9:"hook_func";s:5:"kaifu";s:7:"api_url";s:0:"";}', 0);

-- --------------------------------------------------------

--
-- 表的结构 `website_map`
--

CREATE TABLE IF NOT EXISTS `website_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `siteid` int(11) NOT NULL COMMENT '站点ID',
  `table_name` varchar(64) NOT NULL COMMENT '数据库名',
  `seed_type` varchar(64) NOT NULL COMMENT '种子类型',
  `field_id` int(11) NOT NULL COMMENT 'field_template中的ID',
  `site_field` varchar(64) NOT NULL COMMENT '映射目标的field name',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=63 ;

--
-- 转存表中的数据 `website_map`
--

INSERT INTO `website_map` (`id`, `siteid`, `table_name`, `seed_type`, `field_id`, `site_field`) VALUES
(1, 1, 't_spyder_article', 'article', 1, 'title'),
(2, 1, 't_spyder_article', 'article', 2, ''),
(3, 1, 't_spyder_article', 'article', 3, 'keywords'),
(4, 1, 't_spyder_article', 'article', 4, 'copy_from'),
(5, 1, 't_spyder_article', 'article', 5, 'content'),
(7, 1, 't_spyder_article', 'article', 6, ''),
(8, 1, 't_spyder_game', 'game', 7, 'game_name'),
(9, 1, 't_spyder_game', 'game', 8, 'game_tag'),
(10, 1, 't_spyder_game', 'game', 9, 'game_theme'),
(11, 1, 't_spyder_game', 'game', 10, 'game_effect'),
(12, 1, 't_spyder_game', 'game', 11, ''),
(13, 1, 't_spyder_game', 'game', 12, ''),
(14, 1, 't_spyder_game', 'game', 13, 'game_status'),
(15, 1, 't_spyder_game', 'game', 14, 'test_status'),
(16, 1, 't_spyder_game', 'game', 15, 'dev_short_name'),
(17, 1, 't_spyder_game', 'game', 16, 'game_description'),
(18, 1, 't_spyder_game', 'game', 17, ''),
(19, 1, 't_spyder_game', 'game', 18, 'game_thumb'),
(20, 1, 't_spyder_game', 'game', 19, 'game_avatar'),
(21, 1, 't_spyder_game', 'game', 20, 'insert_time'),
(22, 1, 't_spyder_open_server', 'kaifu', 21, 'game_name'),
(23, 1, 't_spyder_open_server', 'kaifu', 22, 'game_tag'),
(24, 1, 't_spyder_open_server', 'kaifu', 23, 'oper_short_name'),
(25, 1, 't_spyder_open_server', 'kaifu', 24, 'dev_short_name'),
(26, 1, 't_spyder_open_server', 'kaifu', 25, 'server_name'),
(27, 1, 't_spyder_open_server', 'kaifu', 26, 'test_date'),
(28, 1, 't_spyder_open_server', 'kaifu', 27, 'register_url'),
(29, 1, 't_spyder_open_server', 'kaifu', 28, ''),
(30, 1, 't_spyder_open_test', 'kaice', 29, 'game_name'),
(31, 1, 't_spyder_open_test', 'kaice', 30, 'game_tag'),
(32, 1, 't_spyder_open_test', 'kaice', 31, 'oper_short_name'),
(33, 1, 't_spyder_open_test', 'kaice', 32, 'dev_short_name'),
(34, 1, 't_spyder_open_test', 'kaice', 33, 'server_name'),
(35, 1, 't_spyder_open_test', 'kaice', 34, 'test_status'),
(36, 1, 't_spyder_open_test', 'kaice', 35, 'register_url'),
(37, 1, 't_spyder_open_test', 'kaice', 36, 'test_date'),
(38, 1, 't_spyder_open_test', 'kaice', 37, ''),
(39, 1, 't_spyder_open_test', 'kaice', 61, ''),
(40, 1, 't_spyder_gift', 'gift', 38, 'game_name'),
(41, 1, 't_spyder_gift', 'gift', 39, 'game_tag'),
(42, 1, 't_spyder_gift', 'gift', 40, 'oper_short_name'),
(43, 1, 't_spyder_gift', 'gift', 41, 'send_date'),
(44, 1, 't_spyder_gift', 'gift', 42, 'get_url'),
(45, 1, 't_spyder_gift', 'gift', 43, 'server_name'),
(46, 1, 't_spyder_gift', 'gift', 44, 'gift_title'),
(47, 1, 't_spyder_gift', 'gift', 45, ''),
(48, 1, 't_spyder_gift', 'gift', 46, ''),
(49, 1, 't_spyder_company', 'company', 47, 'short_name'),
(50, 1, 't_spyder_company', 'company', 48, 'full_name'),
(51, 1, 't_spyder_company', 'company', 49, 'company_desc'),
(52, 1, 't_spyder_company', 'company', 50, 'offical_url'),
(53, 1, 't_spyder_company', 'company', 51, 'address'),
(54, 1, 't_spyder_company', 'company', 52, 'telephone'),
(55, 1, 't_spyder_company', 'company', 53, 'email'),
(56, 1, 't_spyder_company', 'company', 54, 'logo_path'),
(57, 1, 't_spyder_gallery', 'gallery', 55, 'title'),
(58, 1, 't_spyder_gallery', 'gallery', 56, ''),
(59, 1, 't_spyder_gallery', 'gallery', 57, 'category_id'),
(60, 1, 't_spyder_gallery', 'gallery', 58, ''),
(61, 1, 't_spyder_gallery', 'gallery', 59, 'thumb'),
(62, 1, 't_spyder_gallery', 'gallery', 60, 'gallery_path');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
