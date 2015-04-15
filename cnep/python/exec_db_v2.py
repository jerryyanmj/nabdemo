import redis
import random
import time
import json

r=redis.StrictRedis(host='localhost', port=6379, db=0);

##############################################################################################
###############################################################################################
#first five routes from mtr sample output
#Each of these three arrays must be of the same size -- the positions align along all three arrays to create a combo( sample_routes[1], sample_fromCities[1], sample_toCities[1])
sample_routes = [ 
   "52.186.56.210|173.194.33.30", 
   "52.186.56.211|173.194.33.31",
   "52.186.56.212|173.194.33.32",
   "52.186.56.213|173.194.33.33",
   "52.186.56.214|173.194.33.34", 
   "52.186.56.215|173.194.33.35", 
   "52.186.56.216|173.194.33.36", 
   "52.186.56.217|173.194.33.37" 
]

sample_fromCities = [
   "Atlanta", 
   "New York", 
   "Nashville", 
   "San Jose", 
   "New Jersey", 
   "Boston", 
   "L.A.", 
   "Jersey", 
   "New York", 
   "San Francisco", 
   "Palo Alto"
]

sample_fromSA = [ "GA", "NY", "TN", "CA", "NJ", "MA", "CA", "NJ", "NY", "CA", "CA" ]
sample_toCities = [ "San Francisco", "Mountain View", "Campbell", "Santa Clara", "Santa Barbara", "Washington", "Denver", "Cleavland", "San Francisco", "New York", "Boston" ]
sample_toSA = [ "CA", "CA", "CA", "CA", "CA", "DC", "CO", "OH", "CA", "NY", "MA" ]

#will be randomly sampled
sample_trend = ["good", "bad"]
###################################################################################################
###################################################################################################

################################################################################
#will create target_not_reached collection
def target_not_reached():
    r.delete('target_not_reached')
    for pos in range(0, len(sample_routes)):
        r.hmset('target_not_reached', {sample_routes[pos]: random.randint(0,100)})

######################################################################################
######################################################################################
#Currently all the target routes for the exec dashboard (whether they are for latency, loss, or overall score) are populated with
#the same routes for the sake of simplicity
#exec_summary_target_routes_by_score --> type: set, values: "sourceIP|targetIP", purpose: UI polls this collection for names of routes it will need to populate top chart
#                               keep in mind that this will no longer be ALL routes - only worst offender routes(taking b. latency and loss into account)
#exec_summary_target_routes_by_latency --> type: set, values: "sourceIP|targetIP", purpose: UI polls this collection for names of routes it will need to populate "route rankings"
# tables (worst offender for latency, worst offenders for loss)--> to be added at later time!
#exec_summary_target_routes_byloss --> SAME as exec_summary_target_routes_by_latency except applies to LOSS only
def exec_summary_target_routes():

        #populate target_routes_by_score using routes in sample_routes
        r.delete('routes_by_score')
        picked = []

        #for i in range(len(sample_routes)/2):
        for i in range(len(sample_routes)):
            route_sel = random.choice(sample_routes)
            while route_sel in picked:
                route_sel = random.choice(sample_routes)
            picked.extend([route_sel])

            #randomize the order so that we randomize the "ranking" of these routes on UI
            r.sadd('routes_by_score',route_sel) 

def exec_summary_target_routes_latency():

        #populate target_routes_by_latency using routes in sample_routes
        r.delete('routes_by_latency')
        for i in range(len(sample_routes)-1):
                r.sadd('routes_by_latency',sample_routes[i])

def exec_summary_target_routes_loss():

        #populate target_routes_by_loss using routes in sample_routes
        r.delete('routes_by_loss')
        for i in range(len(sample_routes)-1):
                r.sadd('routes_by_loss',sample_routes[i])

##########################################################################################
##########################################################################################

#########################################################################################
#########################################################################################
# exec_summary_routes collection --> will contain basic information for routes
# UI only needs loss, latency, time, loss_trend, latency_trend, from_city, to_city, and potentially target_reached
def exec_summary_routes():

        r.delete('exec_route_info')
        times_ran = 0

        for i in range(len(sample_routes)):

                #returns CURRENT Unix timestamp
                random_start_time = int(time.time()) 

                #select random variables for metrics
                #returns random floating point value between 0-100
                loss = str(random.uniform(0,100)) 

                #returns random floating point value between 0-30
                latency = str(random.uniform(0,30))
                loss_trend = random.choice(sample_trend)
                latency_trend = random.choice(sample_trend)

                #predetermined combinations from arrays at top of script
                from_city      = sample_fromCities[ i ]
                to_city        = sample_toCities[ i ]
                from_state     = sample_fromSA[ i ]
                to_state       = sample_toSA[ i ]
                selected_route = sample_routes[ i ]

                r.hmset('exec_route_info',{selected_route:{'loss':loss,'latency':latency,'time':random_start_time,'loss_trend':loss_trend,'latency_trend':latency_trend,'source_city':from_city,'target_city':to_city,'source_SA':from_state, 'target_SA':to_state, 'n_updated':'14','running_total_loss':'44.0','running_total_latency':'23.0','target_reached':'True'}})

############################################################################################################
###########################################################################################################3

# will provide data for last 5 days for all routes in 'sample_routes' array
def exec_summary_metric_charts(): 

        r.delete('exec_historical_metric_charts')
        # get the current time
        current_time = int(time.time()) 
        # shift time BACK to midnight (0th hour) of this day
        midnight = current_time - (current_time %(24*60*60)) 

        #subtract 5 days from current time(this will allow us to get 5 days worth of "data")
        start_time = midnight - (5 * 24 * 60 * 60)  
        hour_start_time = start_time

        t_inc = 0
        day_times =[]
        while t_inc < 5:

                # each day will increment by 24*3600 which is 24(number of hours in a day) * 3600(number seconds in an hour)
                day_times.extend([str(start_time + (24*3600))]) 
                t_inc += 1

        t_inc = 0
        hour_times =[]
        while t_inc < 120:

                #generating each hour for 5 days (24 * 5 = 120)  from start_time
                hour_times.extend([str(hour_start_time)]) 
                hour_start_time += 3600
                t_inc += 1

        hourly_average =[]
        moving_average_past_10 = []
        for i in range(len(sample_routes)):

                # 120(one for each hour) random floating point values between 20 and 100 for houlry average
                hourly_average = [str(random.uniform(20,100)) for x in range(120)] 

                # 5(one for each day) random floating point values between 40 and 100 for moving average values(for past 10 days)
                moving_average_past_10 = [str(random.uniform(40,100)) for y in range(5)] 

                hours = {}
                for hr in range(1,121):
                    hours['hour'+str(hr)] = {'time': hour_times[hr-1], 'latency_moving_average': moving_average_past_10[1], 'loss_moving_average': moving_average_past_10[1], 'latency_hourly_average':hourly_average[hr-1], 'loss_hourly_average':hourly_average[hr-1]}
        
                r.hmset('exec_historical_metric_charts',{sample_routes[i]: json.dumps(hours)})

##############################
#Execute functions
exec_summary_target_routes()
exec_summary_target_routes_latency()
exec_summary_target_routes_loss()
exec_summary_routes()
exec_summary_metric_charts()
target_not_reached()
