import redis;
#import random

r=redis.StrictRedis(host='localhost', port=6379, db=0);


######################################################
##########      No need to run this script unless desired.
#########   Purpose is to show the new structure of collections on redis.
########   Reading the comments will display what purpose is for these collections.
#########  These collections are SPECIFIC TO executive dashboard page!!
#########
#########################################################





#RAW MTR DATA --- all raw data from collector goes straight here .... UI DOES NOT NEED TO CARE ABOUT THIS COLLECTION!
##################################################################################
r.lpush('raw_mtr_queue',{"Client":{"ID":"4d15236e-5fb5-4f67-77c6-c0aa4ec1fecd","IP":"54.186.56.213","Dataset":"N/A","Runtime":"linux","StartTime":1394053449},"StartTime":1394053449,"StopTime":1394053454,"Command":["mtr","-n","-c","5","--report","173.194.33.38"],"Output":"HOST: ip-172-31-16-65             Loss%   Snt   Last   Avg  Best  Wrst StDev\u0000  1. 50.112.0.152                  0.0%     5    0.9   0.9   0.9   1.0   0.1\u0000  2. 205.251.232.254               0.0%     5    1.4  14.6   1.2  35.1  17.9\u0000  3. 205.251.232.148               0.0%     5    1.3   7.8   1.3  33.0  14.1\u0000  4. 205.251.232.91                0.0%     5   20.1  20.6  13.7  27.4   4.9\u0000  5. 205.251.226.188               0.0%     5   28.2  25.7  20.0  30.7   5.2\u0000  6. 72.21.221.191                 0.0%     5   13.7  13.5  13.4  13.7   0.1\u0000  7. 66.249.94.214                 0.0%     5   13.5  13.4  13.3  13.5   0.1\u0000  8. 209.85.253.26                 0.0%     5   20.5  20.4  20.3  20.5   0.1\u0000  9. 173.194.33.38                 0.0%     5   13.2  13.4  13.2  13.6   0.1\u0000","Error":""})
r.lpush('raw_mtr_queue', {"Client":{"ID":"4d15236e-5fb5-4f67-77c6-c0aa4ec1fecd","IP":"54.186.56.213","Dataset":"N/A","Runtime":"linux","StartTime":1394053449},"StartTime":1394053509,"StopTime":1394053514,"Command":["mtr","-n","-c","5","--report","173.194.33.37"],"Output":"HOST: ip-172-31-16-65             Loss%   Snt   Last   Avg  Best  Wrst StDev\u0000  1. 50.112.0.244                  0.0%     5    2.9   1.9   0.9   2.9   0.9\u0000  2. 205.251.232.254               0.0%     5    1.7   8.3   1.6  34.7  14.8\u0000  3. 205.251.232.142               0.0%     5    1.4   1.6   1.4   2.3   0.4\u0000  4. 205.251.232.89                0.0%     5   20.2  17.6  13.6  20.2   3.6\u0000  5. 205.251.226.186               0.0%     5   13.2  13.3  13.2  13.4   0.1\u0000  6. 72.21.221.191                 0.0%     5   13.3  17.6  13.3  34.3   9.3\u0000  7. 66.249.94.214                 0.0%     5   13.6  13.6  13.5  13.7   0.1\u0000  8. 209.85.253.26                 0.0%     5   20.5  20.6  20.4  20.9   0.2\u0000  9. 173.194.33.37                 0.0%     5   20.2  20.2  20.2  20.4   0.1\u0000","Error":""})

out1 =r.lrange('raw_mtr_queue',0,1)
##################################################################################
##################################################################################




#Executive Summary Target Routes
#using a SET 
#this will be populated with routes that have been deemed as having the worst "scores"
#thought process:  the score will be determined by looking at latency AND loss
#UI will use this to know what routes to populate Executive Summary Routes
r.sadd('exec_summary_target_routes_by_score',"54.186.56.213|173.194.33.38")
r.sadd('exec_summary_target_routes_by_score',"54.186.56.213|173.194.33.37")
r.sadd('exec_summary_target_routes_by_score',"54.186.56.213|173.194.33.36")
r.sadd('exec_summary_target_routes_by_score',"54.186.56.213|173.194.33.35")
r.sadd('exec_summary_target_routes_by_score',"54.186.56.213|173.194.33.71")
#-- use 'sscan exec_summary_target_routes_by_score 0 match * ' to get all
#############################################################################



#Executive Summary Target Routes By Loss
#using a SET -- use 'sscan exec_summary_target_routes_by_loss 0 match *' to get all
#this will be populated with routes that have been deemed as having the worst "loss" performance
#a score will be calculated(sub_score_loss) looking at deviation from historical & current loss value
r.sadd('exec_summary_target_routes_by_loss',"54.186.56.213|173.194.33.38")
r.sadd('exec_summary_target_routes_by_loss',"54.186.56.213|173.194.33.37")
r.sadd('exec_summary_target_routes_by_loss',"54.186.56.213|173.194.33.36")
r.sadd('exec_summary_target_routes_by_loss',"54.186.56.213|173.194.33.35")
r.sadd('exec_summary_target_routes_by_loss',"54.186.56.213|173.194.33.71")
#use 'sscan exec_summary_target_routes_by_loss 0 match *' to get all
#############################################################################


#Executive Summary Target Routes By Latency
#using a SET --- use sscan exec_summary_target_routes_by_latency 0 match *    to get all
#this will be populated with routes that have been deemed as having the worst "latency" performance
#a score will be calculated(sub_score_latency) looking at deviation from historical & current latency value
r.sadd('exec_summary_target_routes_by_latency',"54.186.56.213|173.194.33.38")
r.sadd('exec_summary_target_routes_by_latency',"54.186.56.213|173.194.33.37")
r.sadd('exec_summary_target_routes_by_latency',"54.186.56.213|173.194.33.36")
r.sadd('exec_summary_target_routes_by_latency',"54.186.56.213|173.194.33.35")
r.sadd('exec_summary_target_routes_by_latency',"54.186.56.213|173.194.33.71")
#use sscan exec_summary_target_routes_by_latency 0 match *    to get all
################################################################################





#Executive Summary Routes
#################################################################################
# each route will contain: from_city, to_city, loss_trend,latency_trend, loss, latency, time, n_updated(the number of times this route was updated in the last hour),
#running total_loss(the sum of all loss values for this route, this hour), running_total_latency(same as loss, except for latency), and target_reached(if dest IP reached)
#USED BY UI: from_city, to_city, loss_trend, latency_trend, loss, latency, time   ---> ALL OTHERS USED BY OTHER PROCESSING scripts
#HOW TO USE:  UI will first refer to exec_summary_target_routes_by_score and will pull ALL routes populated there - then it will find data associated for those routes by polling THIS collection.
#               This will essentially provide : 1) all BASIC route information that Mihail's google go code was previously doing 2) loss/latency trends
#NOTE :loss/latency_trend values are:  good OR bad ----> good = downard green triangle,   bad = upward red triangle
r.hmset('exec_summary_routes',{'54.186.56.213|173.194.33.37':{'from_city':'Denver', 'to_city':'Atlanta','loss_trend':'good', 'latency_trend':'bad', 'loss':'0.0','latency':'440','time':'98987897986','n_updated':'14','running_total_loss':'44.0','running_total_latency':'23.0','target_reached':'True'}})
out2 = r.hmget('routes','54.186.56.213|173.194.33.37'); # EXAMPLE OF HOW TO SEARCH FOR A SPECIFIC KEY IN HASHMAP
##############################################################################
############################################################################3





###################################################################################
###################################################################################
#for both Latency and Loss - they follow similar strucutres.
# exec_summary_latency_chart = hashmap name
# field = 'sourceIP|targetIP'
# value = {'day1':{'moving_average_past_10': '#', 
#                   'hour1':{'time':"##", 'hourly_average':'##'}, ...... ,'hour24':{'time':"##", 'hourly_average':'##'} 
#           .
#           .
#           .
#         {'day5':etc...}   }}
#moving_average_past_10 ---> data coming from the HDFS job for historical analysis over the past 10 days
#hourly_average will be calculated by python scripts
#NOTE:  PURPOSE FOR exec_summary_latency_chart collection --> USE TO POPULATE LATENCY CHART ON EXEC DASHBOARD PAGE
#NOTE: PURPOSE FOR exec_summary_loss_chart collection --> USE TO POPULATE LOSS CHART ON EXEC DASHBOARD PAGE
######################################################################################
#####################################################################################



#Executive Summary Latency Chart
###############################################################################
# for each route, you will have 5 days.  For each day, you will have: 
#	1) the moving average for the past 10 days that will have been populated daily by the HDFS job
#	2) 24 hours - For ALL 24 hours you will have
#		a) Hourly Average
#		b) Timestamp -- this UNIX timestamp will be used for determining both hour AND day(needed for the chart)
#UI will have to parse UNIX timestamp and convert for hour and day readings...
# ^^^ refer to : http://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
r.hmset('exec_summary_latency_chart',{'54.186.56.213|173.194.33.37':
					{'day1':{'moving_average_past_10': '123', 
						'hour1':{'time':'98987897986', 'hourly_average':'22.3'},
						'hour2':{'time':'123412341234','hourly_average':'43'},
						'hour3':{'time':'98987908989', 'hourly_average':'44'},
						'hour4':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour5':{'time':'123412341234','hourly_average':'43'},
                                                'hour6':{'time':'98987908989', 'hourly_average':'44'},
						'hour7':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour8':{'time':'123412341234','hourly_average':'43'},
                                                'hour9':{'time':'98987908989', 'hourly_average':'44'},
						'hour10':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour11':{'time':'123412341234','hourly_average':'43'},
                                                'hour12':{'time':'98987908989', 'hourly_average':'44'},
						'hour13':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour14':{'time':'123412341234','hourly_average':'43'},
                                                'hour15':{'time':'98987908989', 'hourly_average':'44'},
						'hour16':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour17':{'time':'123412341234','hourly_average':'43'},
                                                'hour18':{'time':'98987908989', 'hourly_average':'44'},
						'hour19':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour20':{'time':'123412341234','hourly_average':'43'},
                                                'hour21':{'time':'98987908989', 'hourly_average':'44'},
						'hour22':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour23':{'time':'123412341234','hourly_average':'43'},
                                                'hour24':{'time':'98987908989', 'hourly_average':'44'}},
					'day2':{'moving_average_past_10': '123', 
						'hour1':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour2':{'time':'123412341234','hourly_average':'43'},
                                                'hour3':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour4':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour5':{'time':'123412341234','hourly_average':'43'},
                                                'hour6':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour7':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour8':{'time':'123412341234','hourly_average':'43'},
                                                'hour9':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour10':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour11':{'time':'123412341234','hourly_average':'43'},
                                                'hour12':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour13':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour14':{'time':'123412341234','hourly_average':'43'},
                                                'hour15':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour16':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour17':{'time':'123412341234','hourly_average':'43'},
                                                'hour18':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour19':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour20':{'time':'123412341234','hourly_average':'43'},
                                                'hour21':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour22':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour23':{'time':'123412341234','hourly_average':'43'},
                                                'hour24':{'time':'98987908989', 'hourly_average':'44'}},
					'day3':{'moving_average_past_10': '123',
						 'hour1':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour2':{'time':'123412341234','hourly_average':'43'},
                                                'hour3':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour4':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour5':{'time':'123412341234','hourly_average':'43'},
                                                'hour6':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour7':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour8':{'time':'123412341234','hourly_average':'43'},
                                                'hour9':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour10':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour11':{'time':'123412341234','hourly_average':'43'},
                                                'hour12':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour13':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour14':{'time':'123412341234','hourly_average':'43'},
                                                'hour15':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour16':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour17':{'time':'123412341234','hourly_average':'43'},
                                                'hour18':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour19':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour20':{'time':'123412341234','hourly_average':'43'},
                                                'hour21':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour22':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour23':{'time':'123412341234','hourly_average':'43'},
                                                'hour24':{'time':'98987908989', 'hourly_average':'44'}},
					'day4':{'moving_average_past_10': '123', 
						'hour1':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour2':{'time':'123412341234','hourly_average':'43'},
                                                'hour3':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour4':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour5':{'time':'123412341234','hourly_average':'43'},
                                                'hour6':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour7':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour8':{'time':'123412341234','hourly_average':'43'},
                                                'hour9':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour10':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour11':{'time':'123412341234','hourly_average':'43'},
                                                'hour12':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour13':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour14':{'time':'123412341234','hourly_average':'43'},
                                                'hour15':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour16':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour17':{'time':'123412341234','hourly_average':'43'},
                                                'hour18':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour19':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour20':{'time':'123412341234','hourly_average':'43'},
                                                'hour21':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour22':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour23':{'time':'123412341234','hourly_average':'43'},
                                                'hour24':{'time':'98987908989', 'hourly_average':'44'}},
					'day5':{'moving_average_past_10': '123', 
						'hour1':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour2':{'time':'123412341234','hourly_average':'43'},
                                                'hour3':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour4':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour5':{'time':'123412341234','hourly_average':'43'},
                                                'hour6':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour7':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour8':{'time':'123412341234','hourly_average':'43'},
                                                'hour9':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour10':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour11':{'time':'123412341234','hourly_average':'43'},
                                                'hour12':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour13':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour14':{'time':'123412341234','hourly_average':'43'},
                                                'hour15':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour16':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour17':{'time':'123412341234','hourly_average':'43'},
                                                'hour18':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour19':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour20':{'time':'123412341234','hourly_average':'43'},
                                                'hour21':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour22':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour23':{'time':'123412341234','hourly_average':'43'},
                                                'hour24':{'time':'98987908989', 'hourly_average':'44'}}}})

out2 = r.hmget('exec_summary_latency_chart','54.186.56.213|173.194.33.37') # EXAMPLE OF HOW TO SEARCH FOR A SPECIFIC KEY IN HASHMAP
###################################################################################################################
###################################################################################################################




#Executive Summary Loss Chart
###############################################################################
# for each route, you will have 5 days.  For each day, you will have:
#       1) the moving average for the past 10 days that will have been populated daily by the HDFS job
#       2) 24 hours - For ALL 24 hours you will have
#               a) Hourly Average
#               b) Timestamp -- this timestamp will be used for determining both hour AND day(needed for the chart)
#
r.hmset('exec_summary_loss_chart',{'54.186.56.213|173.194.33.37':
                                        {'day1':{'moving_average_past_10': '123',
                                                'hour1':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour2':{'time':'123412341234','hourly_average':'43'},
                                                'hour3':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour4':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour5':{'time':'123412341234','hourly_average':'43'},
                                                'hour6':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour7':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour8':{'time':'123412341234','hourly_average':'43'},
                                                'hour9':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour10':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour11':{'time':'123412341234','hourly_average':'43'},
                                                'hour12':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour13':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour14':{'time':'123412341234','hourly_average':'43'},
                                                'hour15':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour16':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour17':{'time':'123412341234','hourly_average':'43'},
                                                'hour18':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour19':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour20':{'time':'123412341234','hourly_average':'43'},
                                                'hour21':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour22':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour23':{'time':'123412341234','hourly_average':'43'},
                                                'hour24':{'time':'98987908989', 'hourly_average':'44'}},
                                        'day2':{'moving_average_past_10': '123',
                                                'hour1':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour2':{'time':'123412341234','hourly_average':'43'},
                                                'hour3':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour4':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour5':{'time':'123412341234','hourly_average':'43'},
                                                'hour6':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour7':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour8':{'time':'123412341234','hourly_average':'43'},
                                                'hour9':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour10':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour11':{'time':'123412341234','hourly_average':'43'},
                                                'hour12':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour13':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour14':{'time':'123412341234','hourly_average':'43'},
                                                'hour15':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour16':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour17':{'time':'123412341234','hourly_average':'43'},
                                                'hour18':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour19':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour20':{'time':'123412341234','hourly_average':'43'},
                                                'hour21':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour22':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour23':{'time':'123412341234','hourly_average':'43'},
                                                'hour24':{'time':'98987908989', 'hourly_average':'44'}},
                                        'day3':{'moving_average_past_10': '123',
                                                 'hour1':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour2':{'time':'123412341234','hourly_average':'43'},
                                                'hour3':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour4':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour5':{'time':'123412341234','hourly_average':'43'},
                                                'hour6':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour7':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour8':{'time':'123412341234','hourly_average':'43'},
                                                'hour9':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour10':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour11':{'time':'123412341234','hourly_average':'43'},
                                                'hour12':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour13':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour14':{'time':'123412341234','hourly_average':'43'},
                                                'hour15':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour16':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour17':{'time':'123412341234','hourly_average':'43'},
                                                'hour18':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour19':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour20':{'time':'123412341234','hourly_average':'43'},
                                                'hour21':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour22':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour23':{'time':'123412341234','hourly_average':'43'},
                                                'hour24':{'time':'98987908989', 'hourly_average':'44'}},
                                        'day4':{'moving_average_past_10': '123',
                                                'hour1':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour2':{'time':'123412341234','hourly_average':'43'},
                                                'hour3':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour4':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour5':{'time':'123412341234','hourly_average':'43'},
                                                'hour6':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour7':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour8':{'time':'123412341234','hourly_average':'43'},
                                                'hour9':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour10':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour11':{'time':'123412341234','hourly_average':'43'},
                                                'hour12':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour13':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour14':{'time':'123412341234','hourly_average':'43'},
                                                'hour15':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour16':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour17':{'time':'123412341234','hourly_average':'43'},
                                                'hour18':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour19':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour20':{'time':'123412341234','hourly_average':'43'},
                                                'hour21':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour22':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour23':{'time':'123412341234','hourly_average':'43'},
                                                'hour24':{'time':'98987908989', 'hourly_average':'44'}},
                                        'day5':{'moving_average_past_10': '123',
                                                'hour1':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour2':{'time':'123412341234','hourly_average':'43'},
                                                'hour3':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour4':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour5':{'time':'123412341234','hourly_average':'43'},
                                                'hour6':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour7':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour8':{'time':'123412341234','hourly_average':'43'},
                                                'hour9':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour10':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour11':{'time':'123412341234','hourly_average':'43'},
                                                'hour12':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour13':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour14':{'time':'123412341234','hourly_average':'43'},
                                                'hour15':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour16':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour17':{'time':'123412341234','hourly_average':'43'},
                                                'hour18':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour19':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour20':{'time':'123412341234','hourly_average':'43'},
                                                'hour21':{'time':'98987908989', 'hourly_average':'44'},
                                                'hour22':{'time':'98987897986', 'hourly_average':'22.3'},
                                                'hour23':{'time':'123412341234','hourly_average':'43'},
                                                'hour24':{'time':'98987908989', 'hourly_average':'44'}}}})

out3 = r.hmget('exec_summary_loss_chart','54.186.56.213|173.194.33.37') # EXAMPLE OF HOW TO SEARCH FOR A SPECIFIC KEY IN HASHMAP
###################################################################################################################
###################################################################################################################
