-- MySQL dump 10.13  Distrib 5.1.73, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: data_analytics
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

--
-- Table structure for table `agent_availability`
--

DROP TABLE IF EXISTS `agent_availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agent_availability` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `on_off` int(30) NOT NULL,
  `shipped_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=206203 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agent_count_hourly`
--

DROP TABLE IF EXISTS `agent_count_hourly`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agent_count_hourly` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `agent_count` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13021 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agent_mapping`
--

DROP TABLE IF EXISTS `agent_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agent_mapping` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `mac_address` varchar(255) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `shipped_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=67 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agent_mapping_agents`
--

DROP TABLE IF EXISTS `agent_mapping_agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agent_mapping_agents` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `division_id` varchar(255) NOT NULL,
  `zipcode_id` varchar(255) NOT NULL,
  `mac_address` varchar(255) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `lattitude` float(26,6) NOT NULL,
  `longitude` float(26,6) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `updated_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=113 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agent_mapping_divisions`
--

DROP TABLE IF EXISTS `agent_mapping_divisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agent_mapping_divisions` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `division_id` varchar(255) NOT NULL,
  `division_name` varchar(255) NOT NULL,
  `lattitude` float(26,6) NOT NULL,
  `longitude` float(26,6) NOT NULL,
  `updated_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agent_mapping_zipcodes`
--

DROP TABLE IF EXISTS `agent_mapping_zipcodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agent_mapping_zipcodes` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `zipcode_id` varchar(255) NOT NULL,
  `division_id` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `lattitude` float(26,6) NOT NULL,
  `longitude` float(26,6) NOT NULL,
  `updated_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=92 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buckets_distance_speed_hour`
--

DROP TABLE IF EXISTS `buckets_distance_speed_hour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buckets_distance_speed_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `bucket_distance_km` varchar(255) NOT NULL,
  `avg_speed_km_per_millisec` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `provider` varchar(255) NOT NULL DEFAULT 'Time Warner Cable',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=37149 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client_market_source_metrics`
--

DROP TABLE IF EXISTS `client_market_source_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_market_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `division_id` float NOT NULL,
  `avg_latency` float NOT NULL,
  `std_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `std_loss` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12226 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client_source_metrics`
--

DROP TABLE IF EXISTS `client_source_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `on_off` float NOT NULL,
  `avg_loss` float NOT NULL,
  `avg_latency` float NOT NULL,
  `std_loss` float NOT NULL,
  `std_latency` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=188417 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client_stats`
--

DROP TABLE IF EXISTS `client_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_stats` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `unique_live_count` float NOT NULL,
  `unique_command_count` float NOT NULL,
  `unique_route_count` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2034 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client_zipcode_source_metrics`
--

DROP TABLE IF EXISTS `client_zipcode_source_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_zipcode_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `zipcode_id` float NOT NULL,
  `avg_latency` float NOT NULL,
  `std_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `std_loss` varchar(255) NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=37211 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivered_pis`
--

DROP TABLE IF EXISTS `delivered_pis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivered_pis` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `count` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `disconnected_agents`
--

DROP TABLE IF EXISTS `disconnected_agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disconnected_agents` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `agent_ip` varchar(255) NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=113 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `distance_report`
--

DROP TABLE IF EXISTS `distance_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `distance_report` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `route` varchar(255) NOT NULL,
  `source` varchar(255) NOT NULL,
  `target` varchar(255) NOT NULL,
  `average_latency` float(9,6) NOT NULL,
  `std_dev_latency` float(9,6) NOT NULL,
  `distance_km` float(26,6) NOT NULL,
  `speed_km_per_millisec` float(26,6) NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6404 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `edge_node_surveillance`
--

DROP TABLE IF EXISTS `edge_node_surveillance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `edge_node_surveillance` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `latency` float(26,6) NOT NULL,
  `jitter` float(26,6) NOT NULL,
  `loss` float(26,6) NOT NULL,
  `avg_latency` float(26,6) NOT NULL,
  `avg_jitter` float(26,6) NOT NULL,
  `avg_loss` float(26,6) NOT NULL,
  `std_latency` float(26,6) NOT NULL,
  `std_jitter` float(26,6) NOT NULL,
  `std_loss` float(26,6) NOT NULL,
  `percent_latency_difference` float(26,6) NOT NULL,
  `percent_jitter_difference` float(26,6) NOT NULL,
  `percent_loss_difference` float(26,6) NOT NULL,
  `edge_node` varchar(255) NOT NULL,
  `collector_time` datetime NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1064720 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jitter_edge_nodes_hour`
--

DROP TABLE IF EXISTS `jitter_edge_nodes_hour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jitter_edge_nodes_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `avg_jitter` float NOT NULL,
  `edge_node` varchar(255) NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `provider` varchar(255) NOT NULL DEFAULT 'Time Warner Cable',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=34477 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jitter_loss_latency_edge_node_hour`
--

DROP TABLE IF EXISTS `jitter_loss_latency_edge_node_hour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jitter_loss_latency_edge_node_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `avg_jitter` float NOT NULL,
  `avg_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `edge_node` varchar(255) NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `provider` varchar(255) NOT NULL DEFAULT 'Time Warner Cable',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=39618 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jitter_loss_latency_market_hour`
--

DROP TABLE IF EXISTS `jitter_loss_latency_market_hour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jitter_loss_latency_market_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `avg_jitter` float NOT NULL,
  `avg_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `source_market` varchar(255) NOT NULL,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `provider` varchar(255) NOT NULL DEFAULT 'Time Warner Cable',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=16976 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jitter_loss_router_market`
--

DROP TABLE IF EXISTS `jitter_loss_router_market`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jitter_loss_router_market` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `five_day_avg_jitter` float NOT NULL,
  `five_day_avg_loss` float NOT NULL,
  `division` varchar(255) NOT NULL,
  `avg_jitter` float NOT NULL,
  `avg_loss` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `provider` varchar(255) NOT NULL DEFAULT 'Time Warner Cable',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10484 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jitter_market_hour`
--

DROP TABLE IF EXISTS `jitter_market_hour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jitter_market_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `avg_jitter` float NOT NULL,
  `source_market` varchar(255) NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `provider` varchar(255) NOT NULL DEFAULT 'Time Warner Cable',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14305 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jitter_national_hour`
--

DROP TABLE IF EXISTS `jitter_national_hour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jitter_national_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `five_day_avg_jitter` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `provider` varchar(255) NOT NULL DEFAULT 'Time Warner Cable',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2032 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jitter_rate`
--

DROP TABLE IF EXISTS `jitter_rate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jitter_rate` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `route` varchar(255) NOT NULL,
  `jitter_rate` float(9,6) NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `latency_improvements_trend`
--

DROP TABLE IF EXISTS `latency_improvements_trend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `latency_improvements_trend` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `route` varchar(255) NOT NULL,
  `avg_period` varchar(255) NOT NULL,
  `latency_improvements_trend` float(9,6) NOT NULL,
  `latency_violations_trend` float(9,6) NOT NULL,
  `latency_no_changes_trend` float(9,6) NOT NULL,
  `loss_improvements_trend` float(9,6) NOT NULL,
  `loss_violations_trend` float(9,6) NOT NULL,
  `loss_no_change_trend` float(9,6) NOT NULL,
  `availability_violations_trend` float(9,6) NOT NULL,
  `command_count` int(30) NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `loss_latency_national_hour`
--

DROP TABLE IF EXISTS `loss_latency_national_hour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loss_latency_national_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `five_day_avg_latency` float NOT NULL,
  `five_avg_loss` float NOT NULL,
  `avg_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `provider` varchar(255) NOT NULL DEFAULT 'Time Warner Cable',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2012 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `market_surveillance`
--

DROP TABLE IF EXISTS `market_surveillance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `market_surveillance` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `latency` float(26,6) NOT NULL,
  `jitter` float(26,6) NOT NULL,
  `loss` float(26,6) NOT NULL,
  `avg_latency` float(26,6) NOT NULL,
  `avg_jitter` float(26,6) NOT NULL,
  `avg_loss` float(26,6) NOT NULL,
  `std_latency` float(26,6) NOT NULL,
  `std_jitter` float(26,6) NOT NULL,
  `std_loss` float(26,6) NOT NULL,
  `percent_latency_difference` float(26,6) NOT NULL,
  `percent_jitter_difference` float(26,6) NOT NULL,
  `percent_loss_difference` float(26,6) NOT NULL,
  `market` varchar(255) NOT NULL,
  `hour` float NOT NULL,
  `collector_time` datetime NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1051288 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `national_surveillance`
--

DROP TABLE IF EXISTS `national_surveillance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `national_surveillance` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `latency` float(6,3) NOT NULL,
  `jitter` float(6,3) NOT NULL,
  `loss` float(6,3) NOT NULL,
  `avg_latency` float(6,3) NOT NULL,
  `avg_jitter` float(6,3) NOT NULL,
  `avg_loss` float(6,3) NOT NULL,
  `std_latency` float(6,3) NOT NULL,
  `std_jitter` float(6,3) NOT NULL,
  `std_loss` float(6,3) NOT NULL,
  `percent_latency_difference` float(6,3) NOT NULL,
  `percent_jitter_difference` float(6,3) NOT NULL,
  `percent_loss_difference` float(6,3) NOT NULL,
  `collector_time` datetime NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1044959 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `network_latency_chart`
--

DROP TABLE IF EXISTS `network_latency_chart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `network_latency_chart` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `target_division` varchar(255) DEFAULT NULL,
  `source_division` varchar(255) DEFAULT NULL,
  `latency` int(11) DEFAULT NULL,
  `std_dev_latency` float(26,6) DEFAULT NULL,
  `avg_latency` float(26,6) DEFAULT NULL,
  `avg_latency_changes` float(26,6) DEFAULT NULL,
  `min_latency` float(26,6) DEFAULT NULL,
  `max_latency` float(26,6) DEFAULT NULL,
  `collector_time` datetime NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `operations`
--

DROP TABLE IF EXISTS `operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operations` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) NOT NULL,
  `agent_id` varchar(255) NOT NULL,
  `count` varchar(255) NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `router_latency_market_hour`
--

DROP TABLE IF EXISTS `router_latency_market_hour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `router_latency_market_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `source_market` varchar(255) NOT NULL,
  `avg_latency` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `provider` varchar(255) NOT NULL DEFAULT 'Time Warner Cable',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11521 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `router_mapping`
--

DROP TABLE IF EXISTS `router_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `router_mapping` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `cidr` varchar(255) NOT NULL,
  `ip_type` varchar(255) NOT NULL,
  `router_market` varchar(255) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `zipcode` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=552233 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `router_market_source_metrics`
--

DROP TABLE IF EXISTS `router_market_source_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `router_market_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `division_id` float NOT NULL,
  `avg_latency` float NOT NULL,
  `std_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `std_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `std_jitter` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2998 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `router_source_metrics`
--

DROP TABLE IF EXISTS `router_source_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `router_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `on_off` int(30) DEFAULT NULL,
  `count_of_up_down` float(6,3) NOT NULL,
  `cidr` varchar(255) NOT NULL,
  `avg_latency` float(26,6) NOT NULL,
  `avg_jitter` float(26,6) NOT NULL,
  `avg_loss` float(26,6) NOT NULL,
  `std_latency` float(26,6) NOT NULL,
  `std_jitter` float(26,6) NOT NULL,
  `std_loss` float(26,6) NOT NULL,
  `hour` int(11) NOT NULL,
  `collector_time` datetime NOT NULL,
  `partition_date` datetime NOT NULL,
  `netmask` varchar(255) NOT NULL,
  `ip_type` varchar(255) NOT NULL,
  `router_market` varchar(255) NOT NULL,
  `division_id` varchar(255) NOT NULL,
  `latitude` float(26,6) NOT NULL,
  `longitude` float(26,6) NOT NULL,
  `zipcode_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1481379 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `router_zipcode_source_metrics`
--

DROP TABLE IF EXISTS `router_zipcode_source_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `router_zipcode_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `zipcode_id` float NOT NULL,
  `avg_latency` float NOT NULL,
  `std_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `std_loss` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5138 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `routers_mapping`
--

DROP TABLE IF EXISTS `routers_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `routers_mapping` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `cidr` varchar(255) NOT NULL,
  `ip_type` varchar(255) NOT NULL,
  `router_market` varchar(255) NOT NULL,
  `division_id` varchar(255) NOT NULL,
  `lattitude` float(26,6) NOT NULL,
  `longitude` float(26,6) NOT NULL,
  `zipcode_id` varchar(255) NOT NULL,
  `updated_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12525149 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `speedtest_market_daily`
--

DROP TABLE IF EXISTS `speedtest_market_daily`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `speedtest_market_daily` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `avg_download` float NOT NULL,
  `avg_upload` float NOT NULL,
  `source_market` varchar(255) NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `provider` varchar(255) NOT NULL DEFAULT 'Time Warner Cable',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=235 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `top_25_popular_cidr`
--

DROP TABLE IF EXISTS `top_25_popular_cidr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `top_25_popular_cidr` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `cidr` varchar(255) NOT NULL,
  `ip_count` float NOT NULL,
  `amount_of_pings` float NOT NULL,
  `avg_rtt` float NOT NULL,
  `avg_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `max_rtt` float NOT NULL,
  `min_rtt` float NOT NULL,
  `max_jitter` float NOT NULL,
  `min_jitter` float NOT NULL,
  `max_loss` float NOT NULL,
  `min_loss` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17425 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `top_25_worse_cidr`
--

DROP TABLE IF EXISTS `top_25_worse_cidr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `top_25_worse_cidr` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `cidr` varchar(255) NOT NULL,
  `ip_count` float NOT NULL,
  `amount_of_pings` float NOT NULL,
  `avg_rtt` float NOT NULL,
  `avg_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `max_rtt` float NOT NULL,
  `min_rtt` float NOT NULL,
  `max_jitter` float NOT NULL,
  `min_jitter` float NOT NULL,
  `max_loss` float NOT NULL,
  `min_loss` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17493 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `top_25_worse_routers`
--

DROP TABLE IF EXISTS `top_25_worse_routers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `top_25_worse_routers` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `router_ip` varchar(255) NOT NULL,
  `avg_number_of_hops` float NOT NULL,
  `avg_rtt` float NOT NULL,
  `avg_rtt_negative` float NOT NULL,
  `avg_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `router_market` varchar(255) NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17126 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `top_25_worse_routes`
--

DROP TABLE IF EXISTS `top_25_worse_routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `top_25_worse_routes` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `start_ip` varchar(255) NOT NULL,
  `target_ip` varchar(255) NOT NULL,
  `avg_number_of_hops` float NOT NULL,
  `avg_rtt` float NOT NULL,
  `avg_rtt_negative` float NOT NULL,
  `avg_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `router_market` varchar(255) NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=45201 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `top_worst_sources`
--

DROP TABLE IF EXISTS `top_worst_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `top_worst_sources` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `source_ip` varchar(255) NOT NULL,
  `avg_jitter_rate` float(26,6) NOT NULL,
  `stddev_jitter_rate` float(26,6) NOT NULL,
  `routes_count` int(30) NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-02-05 14:54:30
