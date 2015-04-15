-- MySQL modify script
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

use data_analytics;

--
-- Modify table 'distance_report'
--
ALTER TABLE distance_report CHANGE average_latency average_latency float(9, 6) NOT NULL;
ALTER TABLE distance_report CHANGE std_dev_latency std_dev_latency float(9, 6) NOT NULL;
ALTER TABLE distance_report CHANGE distance_km distance_km float(26, 6) NOT NULL;
ALTER TABLE distance_report CHANGE speed_km_per_millisec speed_km_per_millisec float(26, 6) NOT NULL;

--
-- Modify table 'jitter_rate'
--
ALTER TABLE jitter_rate CHANGE jitter_rate jitter_rate float(9, 6) NOT NULL;

--
-- Modify table 'latency_improvements_trend'
--
ALTER TABLE latency_improvements_trend CHANGE latency_improvements_trend latency_improvements_trend float(9, 6) NOT NULL;
ALTER TABLE latency_improvements_trend CHANGE latency_violations_trend latency_violations_trend float(9, 6) NOT NULL;
ALTER TABLE latency_improvements_trend CHANGE latency_no_changes_trend latency_no_changes_trend float(9, 6) NOT NULL;
ALTER TABLE latency_improvements_trend CHANGE loss_improvements_trend loss_improvements_trend float(9, 6) NOT NULL;
ALTER TABLE latency_improvements_trend CHANGE loss_violations_trend loss_violations_trend float(9, 6) NOT NULL;
ALTER TABLE latency_improvements_trend CHANGE loss_no_change_trend loss_no_change_trend float(9, 6) NOT NULL;
ALTER TABLE latency_improvements_trend CHANGE availability_violations_trend availability_violations_trend float(9, 6) NOT NULL;

--
-- Modify table 'disconnected_agents'
--
CREATE TABLE IF NOT EXISTS `disconnected_agents` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `agent_ip` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- ALTER TABLE disconnected_agents ADD partition_date datetime NOT NULL AFTER agent_ip;

) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Modify table 'agent_mapping'
--

CREATE TABLE IF NOT EXISTS `agent_mapping` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `division_id` varchar(255) NOT NULL,
  `zipcode_id` varchar(255) NOT NULL,
  `mac_address` varchar(255) NOT NULL,
  `lattitude` float(26,6) NOT NULL,
  `longitude` float(26,6) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `updated_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- ALTER TABLE agent_mapping ADD ip_address varchar(255) NOT NULL AFTER mac_address;
-- DROP TABLE IF EXISTS agent_mapping;


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
) ENGINE=MyISAM AUTO_INCREMENT=15276 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Modify table 'agent_mapping_agents'
--

CREATE TABLE IF NOT EXISTS `agent_mapping_agents` (
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
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Modify table 'agent_mapping_zipcodes'
--

CREATE TABLE IF NOT EXISTS `agent_mapping_zipcodes` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `zipcode_id` varchar(255) NOT NULL,
  `division_id` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `lattitude` float(26,6) NOT NULL,
  `longitude` float(26,6) NOT NULL,
  `updated_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Modify table 'agent_mapping_divisions'
--

CREATE TABLE IF NOT EXISTS `agent_mapping_divisions` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `division_id` varchar(255) NOT NULL,
  `division_name` varchar(255) NOT NULL,
  `lattitude` float(26,6) NOT NULL,
  `longitude` float(26,6) NOT NULL,
  `updated_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Modify table 'agent_availability'
--

CREATE TABLE IF NOT EXISTS `agent_availability` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `on_off` boolean NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

ALTER TABLE agent_availability ADD shipped_date datetime NOT NULL AFTER on_off;

--
-- Modify table 'operations'
--

CREATE TABLE IF NOT EXISTS `operations` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) NOT NULL,
  `agent_id` varchar(255) NOT NULL,
  `count` varchar(255) NOT NULL,
  `partition_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Modify table 'jitter_loss_latency_market_hour'
--
CREATE TABLE IF NOT EXISTS `jitter_loss_latency_market_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `avg_jitter` float NOT NULL,
  `avg_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `collector_time` TIMESTAMP DEFAULT 0,
  `source_market` varchar(255) NOT NULL,
  `partition_date` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Modify table 'jitter_loss_latency_national_hour'
--
CREATE TABLE IF NOT EXISTS `jitter_loss_latency_national_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `avg_jitter` float NOT NULL,
  `avg_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `collector_time` TIMESTAMP DEFAULT 0,
  `partition_date` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Modify table 'jitter_loss_latency_edge_node_hour'
--
CREATE TABLE IF NOT EXISTS `jitter_loss_latency_edge_node_hour` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `avg_jitter` float NOT NULL,
  `avg_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `edge_node` varchar(255) NOT NULL,
  `collector_time` TIMESTAMP DEFAULT 0,
  `partition_date` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Modify table 'delivered_pis'
--
CREATE TABLE IF NOT EXISTS `delivered_pis` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `count` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Modify table 'client_stats'
--
CREATE TABLE IF NOT EXISTS `client_stats` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `unique_live_count` float NOT NULL,
  `unique_command_count` float NOT NULL,
  `unique_route_count` float NOT NULL,
  `collector_time` timestamp default 0,
  `partition_date` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Modify table 'agent_count_hourly'
--
CREATE TABLE IF NOT EXISTS `agent_count_hourly` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `agent_count` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Modify table 'client_market_source_metrics'
--
CREATE TABLE IF NOT EXISTS `client_market_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `division_id` varchar(255) NOT NULL,
  `avg_latency` float NOT NULL,
  `std_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `std_loss` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Modify table 'client_zipcode_source_metrics'
--
CREATE TABLE IF NOT EXISTS `client_zipcode_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `zipcode_id` varchar(255) NOT NULL,
  `avg_latency` float NOT NULL,
  `std_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `std_loss` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Modify table 'client_source_metrics'
--
CREATE TABLE IF NOT EXISTS `client_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `agent_id` varchar(255) NOT NULL,
  `on_off` boolean NOT NULL,
  `avg_latency` float NOT NULL,
  `std_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `std_loss` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Modify table 'routers_mapping'
--
CREATE TABLE IF NOT EXISTS `routers_mapping` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `router_id` varchar(255) NOT NULL,
  `division_id` varchar(255) NOT NULL,
  `zipcode_id` varchar(255) NOT NULL,
  `router_ip` varchar(255) NOT NULL,
  `netmask` varchar(255) NOT NULL,
  `ip_type` varchar(255) NOT NULL,
  `cidr` varchar(255) NOT NULL,
  `lattitude` float(26,6) NOT NULL,
  `longitude` float(26,6) NOT NULL,
  `updated_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

ALTER TABLE routers_mapping DROP router_id;
ALTER TABLE routers_mapping ADD router_market varchar(255) NOT NULL AFTER zipcode_id;
ALTER TABLE routers_mapping CHANGE cidr cidr varchar(255) NOT NULL AFTER id;
ALTER TABLE routers_mapping DROP router_ip;
ALTER TABLE routers_mapping DROP netmask;

--
-- Modify table 'router_source_metrics'
--
CREATE TABLE IF NOT EXISTS `router_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `router_id` varchar(255) NOT NULL,
  `division_id` varchar(255) NOT NULL,
  `zipcode_id` varchar(255) NOT NULL,
  `avg_loss` float NOT NULL,
  `std_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `std_jitter` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

ALTER TABLE router_source_metrics ADD on_off boolean NOT NULL AFTER zipcode_id;
ALTER TABLE router_source_metrics ADD avg_latency float NOT NULL AFTER std_loss;
ALTER TABLE router_source_metrics ADD std_latency float NOT NULL AFTER avg_latency;
ALTER TABLE router_source_metrics DROP router_id;
ALTER TABLE router_source_metrics ADD cidr varchar(255) NOT NULL AFTER id;
ALTER TABLE router_source_metrics ADD up_down int NOT NULL AFTER on_off;
ALTER TABLE router_source_metrics ADD count_of_up_down int NOT NULL AFTER up_down;
ALTER TABLE router_source_metrics ADD historical_avg_latency float NOT NULL AFTER std_jitter;
ALTER TABLE router_source_metrics ADD historical_avg_loss float NOT NULL AFTER historical_avg_latency;
ALTER TABLE router_source_metrics ADD historical_avg_jitter float NOT NULL AFTER historical_avg_loss;

--
-- Modify table 'router_zipcode_source_metrics'
--
CREATE TABLE IF NOT EXISTS `router_zipcode_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `zipcode_id` varchar(255) NOT NULL,
  `avg_loss` float NOT NULL,
  `std_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `std_jitter` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

ALTER TABLE router_zipcode_source_metrics ADD avg_latency float NOT NULL AFTER std_loss;
ALTER TABLE router_zipcode_source_metrics ADD std_latency float NOT NULL AFTER avg_latency;

--
-- Modify table 'router_market_source_metrics'
--
CREATE TABLE IF NOT EXISTS `router_market_source_metrics` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `division_id` varchar(255) NOT NULL,
  `avg_loss` float NOT NULL,
  `std_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `std_jitter` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

ALTER TABLE router_market_source_metrics ADD avg_latency float NOT NULL AFTER std_loss;
ALTER TABLE router_market_source_metrics ADD std_latency float NOT NULL AFTER avg_latency;

--
-- Modify table 'national_surveillance'
--
CREATE TABLE IF NOT EXISTS `national_surveillance` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `latency` float NOT NULL,
  `loss` float NOT NULL,
  `jitter` float NOT NULL,
  `avg_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `std_latency` float NOT NULL,
  `std_loss` float NOT NULL,
  `std_jitter` float NOT NULL,
  `percent_latency_difference` float NOT NULL,
  `percent_loss_difference` float NOT NULL,
  `percent_jitter_difference` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

ALTER TABLE national_surveillance CHANGE latency latency float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE loss loss float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE jitter jitter float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE avg_latency avg_latency float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE avg_loss avg_loss float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE avg_jitter avg_jitter float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE std_latency std_latency float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE std_loss std_loss float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE std_jitter std_jitter float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE percent_latency_difference percent_latency_difference float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE percent_loss_difference percent_loss_difference float(6, 3) NOT NULL;
ALTER TABLE national_surveillance CHANGE percent_jitter_difference percent_jitter_difference float(6, 3) NOT NULL;

--
-- Modify table 'market_surveillance'
--
CREATE TABLE IF NOT EXISTS `market_surveillance` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `market` varchar(255) NOT NULL,
  `latency` float NOT NULL,
  `loss` float NOT NULL,
  `jitter` float NOT NULL,
  `avg_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `std_latency` float NOT NULL,
  `std_loss` float NOT NULL,
  `std_jitter` float NOT NULL,
  `percent_latency_difference` float NOT NULL,
  `percent_loss_difference` float NOT NULL,
  `percent_jitter_difference` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

ALTER TABLE market_surveillance CHANGE latency latency float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE loss loss float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE jitter jitter float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE avg_latency avg_latency float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE avg_loss avg_loss float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE avg_jitter avg_jitter float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE std_latency std_latency float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE std_loss std_loss float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE std_jitter std_jitter float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE percent_latency_difference percent_latency_difference float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE percent_loss_difference percent_loss_difference float(6, 3) NOT NULL;
ALTER TABLE market_surveillance CHANGE percent_jitter_difference percent_jitter_difference float(6, 3) NOT NULL;

--
-- Modify table 'edge_node_surveillance'
--
CREATE TABLE IF NOT EXISTS `edge_node_surveillance` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `edge_node` varchar(255) NOT NULL,
  `latency` float NOT NULL,
  `loss` float NOT NULL,
  `jitter` float NOT NULL,
  `avg_latency` float NOT NULL,
  `avg_loss` float NOT NULL,
  `avg_jitter` float NOT NULL,
  `std_latency` float NOT NULL,
  `std_loss` float NOT NULL,
  `std_jitter` float NOT NULL,
  `percent_latency_difference` float NOT NULL,
  `percent_loss_difference` float NOT NULL,
  `percent_jitter_difference` float NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

ALTER TABLE edge_node_surveillance CHANGE latency latency float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE loss loss float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE jitter jitter float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE avg_latency avg_latency float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE avg_loss avg_loss float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE avg_jitter avg_jitter float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE std_latency std_latency float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE std_loss std_loss float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE std_jitter std_jitter float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE percent_latency_difference percent_latency_difference float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE percent_loss_difference percent_loss_difference float(6, 3) NOT NULL;
ALTER TABLE edge_node_surveillance CHANGE percent_jitter_difference percent_jitter_difference float(6, 3) NOT NULL;

--
-- Modify table `network_latency_chart`
--
CREATE TABLE IF NOT EXISTS `network_latency_chart` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `source_division` varchar(255) NOT NULL,
  `target_division` varchar(255) NOT NULL,
  `latency` float(6, 3) NOT NULL,
  `loss` float(6, 3) NOT NULL,
  `jitter` float(6, 3) NOT NULL,
  `std_dev_latency` float(6, 3) NOT NULL,
  `std_dev_loss` float(6, 3) NOT NULL,
  `std_dev_jitter` float(6, 3) NOT NULL,
  `avg_latency` float(6, 3) NOT NULL,
  `avg_loss` float(6, 3) NOT NULL,
  `avg_jitter` float(6, 3) NOT NULL,
  `avg_latency_p_changes` float(6, 3) NOT NULL,
  `avg_loss_p_changes` float(6, 3) NOT NULL,
  `avg_jitter_p_changes` float(6, 3) NOT NULL,
  `collector_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `partition_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- End of modify script
--
