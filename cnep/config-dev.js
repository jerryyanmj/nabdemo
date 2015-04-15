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
config.mysql.host                   = '127.0.0.1';
config.mysql.port                   = '3306';
config.mysql.user                   = 'root';
config.mysql.password               = 'root';
config.mysql.database               = 'data1';
config.mysql.maximumOpenConnections = 200;

// Connection pool for reports data
config.mysql.reportsHost                   = '127.0.0.1';
config.mysql.reportsPort                   = '3306';
config.mysql.reportsUser                   = 'root';
config.mysql.reportsPassword               = 'root';
config.mysql.reportsDatabase               = 'data_analytics';
config.mysql.reportsMaximumOpenConnections = 200;

// Redis storage part
config.redis.host = '127.0.0.1';
config.redis.port = 6379;

// WEB application part
config.webApplication.port                     = 3000;
config.webApplication.loggingConfigurationFile = 'dashboards-logging.json';
config.webApplication.phantomJSLogin           = 'admin';
config.webApplication.phantomJSPassword        = 'Accenture1';

// Collector component part
config.collectorComponent.url                = "https://dev.hotroute.io:9080";
config.collectorComponent.checkStatusCommand = "/ping";

module.exports = config;
