# cnep_reboot
New Modern Version of CNEP



## Setup guide:

### This guide assumes you are working on a fresh install of Centos 6.5 or later and have already setup the root and 'dev' accounts already.

### Install necessary build tools
sudo yum update -y
sudo yum groupinstall "Development Tools" -y

### Build nodejs from source
### Download the latest source from nodejs.org/download
### As of writing this readme, the latest is...
wget nodejs.org/dist/v0.10.25/node-v0.10.25.tar.gz
tar -xvf node-v0.10.25.tar.gz
cd node-v0.10.25
./configure
make
sudo make install

### Sometimes root user can't see npm or node as commands
### Found at http://stackoverflow.com/questions/4976658/on-ec2-sudo-node-command-not-found-but-node-without-sudo-is-ok
sudo ln -s /usr/local/bin/node /usr/bin/node
sudo ln -s /usr/local/lib/node /usr/lib/node
sudo ln -s /usr/local/bin/npm /usr/bin/npm
sudo ln -s /usr/local/bin/node-waf /usr/bin/node-waf

### Install node package dependencies
sudo npm install -g bower

### Build Redis storage from source
cd $HOME
wget download.redis.io/redis-stable.tar.gz
tar -xvf redis-stable.tar.gz
cd redis-stable
make
sudo make install

### From $HOME, make a logs directory
cd $HOME
mkdir ~/logs

### Run Redis storage as a daemon
nohup redis-server > logs/redis.log & 2>&1

### Clone the Web application repository to $HOME:
git clone git@innersource.accenture.com:cnep/dashboards.git
cd dashboards

### Install npm
npm install

### Bower might not resolve github URL fix found at - https://github.com/bower/bower/issues/50
git config --global url."https://".insteadOf git://

### Install bower
bower install

### Untar the data example folder in $HOME/dashboards directory
tar -xvf data.tar.gz

### Install MySQL storage. From $HOME directory
sudo yum install mysql-server
sudo service mysqld start

### Create user root with password root
mysqladmin -u root password root

### Create configuration database from the MySQL database schema
mysql -u root -p < /path/to/database_data1.ddl

### Create reports database from the MySQL database schema
mysql -u root -p < /path/to/database_data_analytics.ddl

### Sign in to check, that everything is OK in MySQL storage
mysql -u root -p

### Set all the neccesary configuration parameters in $HOME/dashboards/config.js global configuration resource

### You also need sample data in Redis storage for different screens
### To do so run from $HOME directory
cd $HOME/dashboards/python
python exec_db_v2.py
python live_routes_testing.py
python sla_monitoring_testingv2.py

### Create logs directory, where dashboards module logs will be stored
mkdir $HOME/dashboards/logs

### To start Web application, run from $HOME/dashboards directory 
sudo npm start

### Or, run it as a daemon--
sudo nohup npm start > ~/logs/dashboards.log & 2>&1

