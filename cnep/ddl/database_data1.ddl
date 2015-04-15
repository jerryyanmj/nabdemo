-- MySQL dump 10.13  Distrib 5.1.73, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: data1
-- ------------------------------------------------------
-- Server version	5.1.73

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS data1;
use data1;

--
-- Table structure for table `RUN`
--

DROP TABLE IF EXISTS `RUN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `RUN` (
  `rid` int(10) NOT NULL AUTO_INCREMENT,
  `mid` int(10) unsigned NOT NULL,
  `cid` int(10) unsigned NOT NULL,
  `aid` varchar(40) NOT NULL,
  `repeat` int(3) unsigned NOT NULL,
  `priority` int(3) unsigned NOT NULL,
  `frequency` int(6) unsigned NOT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
   PRIMARY KEY (`rid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agentclass`
--

DROP TABLE IF EXISTS `agentclass`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agentclass` (
  `aid` varchar(40) NOT NULL,
  `cid` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`aid`,`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agents`
--

DROP TABLE IF EXISTS `agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agents` (
  `aid` varchar(40) NOT NULL,
  `hostname` varchar(40) NOT NULL DEFAULT '',
  `address` varchar(15) NOT NULL DEFAULT '',
  `model` varchar(255) NOT NULL DEFAULT '',
  `serialnumber` varchar(255) NOT NULL DEFAULT '',
  `os` varchar(255) NOT NULL DEFAULT '',
  `ssh` varchar(255) NOT NULL DEFAULT '',
  `city` varchar(40) NOT NULL DEFAULT '',
  `state` varchar(40) NOT NULL DEFAULT '',
  `mac_address` varchar(17) NOT NULL DEFAULT '',
  `unknown` bool NOT NULL default false,
  `dataset` varchar(17) NOT NULL DEFAULT '',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `class` (
  `cid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`cid`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commands`
--

DROP TABLE IF EXISTS `commands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commands` (
  `mid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL DEFAULT '',
  `handler` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `gid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`gid`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usergroup`
--

DROP TABLE IF EXISTS `usergroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usergroup` (
  `uid` int(10) unsigned NOT NULL DEFAULT '0',
  `gid` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`,`gid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(40) NOT NULL DEFAULT '',
  `hash` varchar(200) NOT NULL DEFAULT '',
  `salt` varchar(200) NOT NULL DEFAULT '',
  `firstname` varchar(255) NOT NULL DEFAULT '',
  `lastname` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

--
-- Add default classes
--
insert into class SET name = 'TWC';
insert into class SET name = 'CNEP';

--
-- Add default agentclasses
--
insert into agentclass (cid, aid) VALUES (1, 'dc9620a7-767d-4516-4543-06474fe93cdc');
insert into agentclass (cid, aid) VALUES (2, 'de4b1920-5596-4459-7934-a1267f078d35');
insert into agentclass (cid, aid) VALUES (1, 'aa651238-623f-4206-6b4f-e12bbd3a77d1');

--
-- Add default agents
--
INSERT INTO agents (aid, hostname, address, model, os, ssh, city, state, mac_address) 
  VALUES ('dc9620a7-767d-4516-4543-06474fe93cdc', 'google.com', '56.128.64.92', 'A', 'Rasbian', '', 'Atlanta', 'GA', '08:00:27:2c:7b:97');  

INSERT INTO agents (aid, hostname, address, model, os, ssh, city, state, mac_address) 
  VALUES ('de4b1920-5596-4459-7934-a1267f078d35', 'localhost', '127.0.09.1', 'B', 'Rasbian', '', 'Atlanta', 'GA', '08:00:27:2c:7b:97');  

INSERT INTO agents (aid, hostname, address, model, os, ssh, city, state, mac_address) 
  VALUES ('aa651238-623f-4206-6b4f-e12bbd3a77d1', 'google.lv', '192.168.0.12', 'C', 'Rasbian', '', 'Atlanta', 'GA', '08:00:27:2c:7b:97');  

--
-- Add default command for unknown/known agents
--
INSERT INTO commands (commands.mid, commands.text, commands.handler, commands.description) VALUES (1, 'mtr -n -c 5 --report google.com', 'mtr', 'Traceroute to google servers');  
INSERT INTO RUN (RUN.mid, RUN.cid, RUN.aid, RUN.repeat, RUN.priority, RUN.frequency, RUN.start, RUN.end, RUN.active) VALUES (1, 2, '', 0, 100, 60000, '2014-01-01 00:00:00', '2024-01-01 00:00:00', 1);
INSERT INTO RUN (RUN.mid, RUN.cid, RUN.aid, RUN.priority, RUN.frequency, RUN.start, RUN.end, RUN.active) VALUES (1, 2, 'de4b1920-5596-4459-7934-a1267f078d35', 200, 60000, '2014-01-01 00:00:00', '2024-01-01 00:00:00', 1);  

--
-- Add default users
--
INSERT INTO users (login, hash, salt, firstname, lastname, email) 
  VALUES ('guest', '3sms//IIe97fwsG8BHdHSBjIp8SNuF9oRq/V+jAMN3mQ/9nKb2WCs1X26/LMhT+O7vktY6KbEIKGBEADXRwZiI/Amqr1DmWgKUv0T8YGafTf841K7KcqTq2N5N+9FRtIM6ZLfAzXw+SvIDB/t+vLHaIprmmlX32oYLrP8hX6vZc=', 'ETpg4PvHwxyzx+tvV2ha7+hoqU19lqpEhhDx+sBb68UixbFgBOPez6HFZaWo2DzVAU/tWHFSL+S/yTMR1XtY7xJGpXEG577y7BrJ8qGTf53+yPl67VzlRgmdJ0y7obyVHAewh3uG+TU8HoL5SlAKG1Gx84vtRKbCQhar0NIbyUM=', 'foo', 'bar', 'foobar@example.com');  

INSERT INTO users (login, hash, salt, firstname, lastname, email) 
  VALUES ('TWCPoC', 'PYbNFQSIsR3U81BN8huI5bGp86JWP+XMXQ4F3f+EsiVlbInFX3rrvrQUJGsbPd6+zxQqHGcsn+aymUEWjtgKwYVa9jZkf8UXouONlOgvuMXxKAdAcnI8HdVs5M1WkU1DsSoGhNozI0mAmBDTdBkvhk9cB56JTIpl7an0EaicH08=', 'x0RBvlsb2UTLniTVMSUb67j5O4LkFQcdzFq60JMQHZD5Yb/HbA3IlocFQkVda8ywGW4wZqV6AVYCZw9TX7Lbhx/1AQM5q1WIHzwPKFi6o+zCdBGF7MrwY1yP8vJQnIxFgQUi/xcekHqt71X79/W6RGQIgYn7Z5KjD8Go2+3K5Cc=', 'Vitally', 'Marinchenko', 'vitalijs.marincenko@accenture.com');  

INSERT INTO users (login, hash, salt, firstname, lastname, email) 
  VALUES ('admin', '3sms//IIe97fwsG8BHdHSBjIp8SNuF9oRq/V+jAMN3mQ/9nKb2WCs1X26/LMhT+O7vktY6KbEIKGBEADXRwZiI/Amqr1DmWgKUv0T8YGafTf841K7KcqTq2N5N+9FRtIM6ZLfAzXw+SvIDB/t+vLHaIprmmlX32oYLrP8hX6vZc=', 'ETpg4PvHwxyzx+tvV2ha7+hoqU19lqpEhhDx+sBb68UixbFgBOPez6HFZaWo2DzVAU/tWHFSL+S/yTMR1XtY7xJGpXEG577y7BrJ8qGTf53+yPl67VzlRgmdJ0y7obyVHAewh3uG+TU8HoL5SlAKG1Gx84vtRKbCQhar0NIbyUM=', 'Vitally', 'Marinchenko', 'vitally.marinchenko@gmail.com');

--
-- Add default groups
--
insert into groups SET name = 'user';
insert into groups SET name = 'admin';

insert into usergroup (gid, uid) VALUES (1, 1);
insert into usergroup (gid, uid) VALUES (2, 2);
insert into usergroup (gid, uid) VALUES (2, 3);

-- Dump completed on 2014-03-06 17:08:03
