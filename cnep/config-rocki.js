/**
 * Global configuration settings file
 */

var config = {}

config.mysql = {};
config.redis = {};
config.webApplication = {};
config.collectorComponent = {};

// MySQL storage part
// Connection pool for configuration data
config.mysql.host                   = '54.214.83.145';
config.mysql.port                   = '3306';
config.mysql.user                   = 'cnep';
config.mysql.password               = 'twc2014Cnep';
config.mysql.database               = 'data1';
config.mysql.maximumOpenConnections = 200;

// Connection pool for reports data
config.mysql.reportsHost                   = '54.214.83.145';
config.mysql.reportsPort                   = '3306';
config.mysql.reportsUser                   = 'cnep';
config.mysql.reportsPassword               = 'twc2014Cnep';
config.mysql.reportsDatabase               = 'data_analytics';
config.mysql.reportsMaximumOpenConnections = 200;

// Redis storage part
config.redis.host = '54.214.144.41';
config.redis.port = 6379;

// WEB application part
config.webApplication.port                     = 80;
config.webApplication.loggingConfigurationFile = 'dashboards-logging.json';

// Collector component part
config.collectorComponent.url = "https://54.214.83.145:9080";
config.collectorComponent.checkStatusCommand = "/ping";

module.exports = config;
