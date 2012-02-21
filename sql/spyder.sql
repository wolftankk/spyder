SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

CREATE DATABASE `spyder` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `spyder`;

DROP TABLE IF EXISTS `article_categoris`;
CREATE TABLE IF NOT EXISTS `article_categoris` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL DEFAULT '-1',
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `article_relationships`;
CREATE TABLE IF NOT EXISTS `article_relationships` (
  `aid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  UNIQUE KEY `aid` (`aid`,`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `lang` varchar(150) NOT NULL,
  `title` varchar(255) NOT NULL,
  `article` longtext NOT NULL,
  `url` varchar(255) NOT NULL,
  `sid` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `fetchtime` int(11) NOT NULL,
  `lasteditor` int(11) NOT NULL,
  `lastupdatetime` int(11) NOT NULL,
  KEY `aid` (`aid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `seed_category`;
CREATE TABLE IF NOT EXISTS `seed_category` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL DEFAULT '-1',
  `cname` varchar(255) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `seed_logs`;
CREATE TABLE IF NOT EXISTS `seed_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `comment` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `seeds`;
CREATE TABLE IF NOT EXISTS `seeds` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `sname` varchar(255) NOT NULL,
  `cid` int(11) NOT NULL DEFAULT '0',
  `url` varchar(255) NOT NULL,
  `charset` varchar(255) NOT NULL DEFAULT 'utf-8',
  `rule` varchar(255) NOT NULL,
  `frequency` int(11) NOT NULL,
  `timeout` int(11) NOT NULL DEFAULT '300',
  `tries` int(11) NOT NULL DEFAULT '5',
  `uid` int(11) NOT NULL,
  `createdtime` int(11) NOT NULL,
  `lastUpdateTime` int(11) NOT NULL,
  `debugMode` tinyint(4) NOT NULL,
  `starttime` int(11) NOT NULL,
  `finishtime` int(11) NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `user_permission`;
CREATE TABLE IF NOT EXISTS `user_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `flag` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `uid` int(11) NOT NULL,
  `uname` varchar(255) NOT NULL,
  `passwd` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `permissions` int(11) NOT NULL,
  `salt` char(10) NOT NULL,
  `createtime` int(11) NOT NULL,
  `lastlogintime` int(11) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `website_extra`;
CREATE TABLE IF NOT EXISTS `website_extra` (
  `wid` int(11) NOT NULL,
  `method` char(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `passwd` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `extra` varchar(255) NOT NULL,
  PRIMARY KEY (`wid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `website_relationships`;
CREATE TABLE IF NOT EXISTS `website_relationships` (
  `aid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  UNIQUE KEY `aid` (`aid`,`tid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `website_terms`;
CREATE TABLE IF NOT EXISTS `website_terms` (
  `id` int(11) NOT NULL,
  `wid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(32) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `websites`;
CREATE TABLE IF NOT EXISTS `websites` (
  `wid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `descript` varchar(255) DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `cid` int(11) NOT NULL,
  `lastsynctime` int(11) NOT NULL,
  PRIMARY KEY (`wid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
