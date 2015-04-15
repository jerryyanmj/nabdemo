import redis;
import random
import time

r=redis.StrictRedis(host='localhost', port=6379, db=0);
##############################################################################################
###############################################################################################
#first five routes from mtr sample output
#Each of these three arrays must be of the same size -- the positions align along all three arrays to create a combo( sample_routes[1], sample_fromCities[1], sample_toCities[1])
sample_routes = ["54.186.56.213|173.194.33.38", "54.186.56.213|173.194.33.37","54.186.56.213|173.194.33.36","54.186.56.213|173.194.33.35","54.186.56.213|173.194.33.71", "53.186.56.213|172.194.33.71", "52.186.56.213|171.194.33.73", "52.186.56.213|171.194.33.72", "52.186.56.215|171.194.33.76", "52.186.56.210|171.194.33.70", "52.186.56.219|171.194.33.79"]
sample_fromCities = ["Atlanta", "New York", "Nashville", "San Jose","New Jersey", "Boston", "L.A.", "Jersey", "New York", "San Francisco", "Palo Alto"]
sample_toCities = ["San Francisco", "Mountain View", "Campbell", "Santa Clara", "Santa Barbara", "Washington", "Denver", "Cleavland", "San Francisco", "New York", "Boston"]

#will be randomly sampled
sample_trend = ["good", "bad"]
###################################################################################################
###################################################################################################










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
        picked = []
        for i in range(len(sample_routes)):
            route_sel = random.choice(sample_routes)
            while route_sel in picked:
                route_sel = random.choice(sample_routes)
            picked.extend([route_sel])
            r.sadd('exec_summary_target_routes_by_score',route_sel) #randomize the order so that we randomize the "ranking" of these routes on UI


def exec_summary_target_routes_latency():
        #populate target_routes_by_latency using routes in sample_routes
        for i in range(len(sample_routes)):
                r.sadd('exec_summary_target_routes_by_latency',sample_routes[i])

def exec_summary_target_routes_loss():
        #populate target_routes_by_loss using routes in sample_routes
        for i in range(len(sample_routes)):
                r.sadd('exec_summary_target_routes_by_loss',sample_routes[i])
##########################################################################################
##########################################################################################






#########################################################################################
#########################################################################################
# exec_summary_routes collection --> will contain basic information for routes
# UI only needs loss, latency, time, loss_trend, latency_trend, from_city, to_city, and potentially target_reached
def exec_summary_routes():
        times_ran = 0
        for i in range(len(sample_routes)):
                random_start_time = int(time.time()) #returns CURRENT Unix timestamp
                #select random variables for metrics
                loss = str(random.uniform(0,100)) #returns random floating point value between 0-100
                latency = str(random.uniform(0,30))#returns random floating point value between 0-30
                loss_trend = random.choice(sample_trend)
                latency_trend = random.choice(sample_trend)

                #predetermined combinations from arrays at top of script
                from_city = sample_fromCities[i]
                to_city = sample_toCities[i]
                selected_route = sample_routes[i]

                r.hmset('exec_summary_routes',{selected_route:{'loss':loss,'latency':latency,'time':random_start_time,'loss_trend':loss_trend,'latency_trend':latency_trend,'from_city':from_city,'to_city':to_city,'n_updated':'14','running_total_loss':'44.0','running_total_latency':'23.0','target_reached':'True'}})
############################################################################################################
###########################################################################################################3





def exec_summary_latency_chart(): # will provide data for last 5 days for all routes in 'sample_routes' array

        current_time = int(time.time()) # get the current time
        midnight = current_time - (current_time %(24*60*60)) # shift time BACK to midnight (0th hour) of this day

        start_time = midnight - (5 * 24 * 60 * 60) #subtract 5 days from current time(this will allow us to get 5 days worth of "data") 
        hour_start_time = start_time

        t_inc = 0
        day_times =[]
        while t_inc < 5:
                day_times.extend([str(start_time + (24*3600))]) # each day will increment by 24*3600 which is 24(number of hours in a day) * 3600(number seconds in an hour)
                t_inc += 1

        t_inc = 0
        hour_times =[]
        while t_inc < 120:
                hour_times.extend([str(hour_start_time)]) #generating each hour for 5 days (24 * 5 = 120)  from start_time
                hour_start_time += 3600
                t_inc += 1


        hourly_average =[]
        moving_average_past_10 = []
        for i in range(len(sample_routes)):
                hourly_average = [str(random.uniform(20,100)) for x in range(120)] # 120(one for each hour) random floating point values between 20 and 100 for houlry average
                moving_average_past_10 = [str(random.uniform(40,100)) for y in range(5)] # 5(one for each day) random floating point values between 40 and 100 for moving average values(for past 10 days)

        
                r.hmset('exec_summary_latency_chart',{sample_routes[i]:
                                                {'day1':{'moving_average_past_10': moving_average_past_10[0], 
                                                        'hour1':{'time': hour_times[0], 'hourly_average': hourly_average[0]},
                                                        'hour2':{'time': hour_times[1], 'hourly_average': hourly_average[1]},
                                                        'hour3':{'time': hour_times[2], 'hourly_average': hourly_average[2]},
                                                        'hour4':{'time': hour_times[3], 'hourly_average': hourly_average[3]},
                                                        'hour5':{'time': hour_times[4], 'hourly_average': hourly_average[4]},
                                                        'hour6':{'time': hour_times[5], 'hourly_average': hourly_average[5]},
                                                        'hour7':{'time': hour_times[6], 'hourly_average': hourly_average[6]},
                                                        'hour8':{'time': hour_times[7], 'hourly_average': hourly_average[7]},
                                                        'hour9':{'time': hour_times[8], 'hourly_average': hourly_average[8]},
                                                        'hour10':{'time': hour_times[9], 'hourly_average': hourly_average[9]},
                                                        'hour11':{'time': hour_times[10], 'hourly_average': hourly_average[10]},
                                                        'hour12':{'time': hour_times[11], 'hourly_average': hourly_average[11]},
                                                        'hour13':{'time': hour_times[12], 'hourly_average': hourly_average[12]},
                                                        'hour14':{'time': hour_times[13], 'hourly_average': hourly_average[13]},
                                                        'hour15':{'time': hour_times[14], 'hourly_average': hourly_average[14]},
                                                        'hour16':{'time': hour_times[15], 'hourly_average': hourly_average[15]},
                                                        'hour17':{'time': hour_times[16], 'hourly_average': hourly_average[16]},
                                                        'hour18':{'time': hour_times[17], 'hourly_average': hourly_average[17]},
                                                        'hour19':{'time': hour_times[18], 'hourly_average': hourly_average[18]},
                                                        'hour20':{'time': hour_times[19], 'hourly_average': hourly_average[19]},
                                                        'hour21':{'time': hour_times[20], 'hourly_average': hourly_average[20]},
                                                        'hour22':{'time': hour_times[21], 'hourly_average': hourly_average[21]},
                                                        'hour23':{'time': hour_times[22], 'hourly_average': hourly_average[22]},
                                                        'hour24':{'time': hour_times[23], 'hourly_average': hourly_average[23]}},
                                                'day2':{'moving_average_past_10': moving_average_past_10[1], 
                                                         'hour1':{'time': hour_times[24], 'hourly_average': hourly_average[24]},
                                                        'hour2':{'time': hour_times[25], 'hourly_average': hourly_average[25]},
                                                        'hour3':{'time': hour_times[26], 'hourly_average': hourly_average[26]},
                                                        'hour4':{'time': hour_times[27], 'hourly_average': hourly_average[27]},
                                                        'hour5':{'time': hour_times[28], 'hourly_average': hourly_average[28]},
                                                        'hour6':{'time': hour_times[29], 'hourly_average': hourly_average[29]},
                                                        'hour7':{'time': hour_times[30], 'hourly_average': hourly_average[30]},
                                                        'hour8':{'time': hour_times[31], 'hourly_average': hourly_average[31]},
                                                        'hour9':{'time': hour_times[32], 'hourly_average': hourly_average[32]},
                                                        'hour10':{'time': hour_times[33], 'hourly_average': hourly_average[33]},
                                                        'hour11':{'time': hour_times[34], 'hourly_average': hourly_average[34]},
                                                        'hour12':{'time': hour_times[35], 'hourly_average': hourly_average[35]},
                                                        'hour13':{'time': hour_times[36], 'hourly_average': hourly_average[36]},
                                                        'hour14':{'time': hour_times[37], 'hourly_average': hourly_average[37]},
                                                        'hour15':{'time': hour_times[38], 'hourly_average': hourly_average[38]},
                                                        'hour16':{'time': hour_times[39], 'hourly_average': hourly_average[39]},
                                                        'hour17':{'time': hour_times[40], 'hourly_average': hourly_average[40]},
                                                        'hour18':{'time': hour_times[41], 'hourly_average': hourly_average[41]},
                                                        'hour19':{'time': hour_times[42], 'hourly_average': hourly_average[42]},
                                                        'hour20':{'time': hour_times[43], 'hourly_average': hourly_average[43]},
                                                        'hour21':{'time': hour_times[44], 'hourly_average': hourly_average[44]},
                                                        'hour22':{'time': hour_times[45], 'hourly_average': hourly_average[45]},
                                                        'hour23':{'time': hour_times[46], 'hourly_average': hourly_average[46]},
                                                        'hour24':{'time': hour_times[47], 'hourly_average': hourly_average[47]}},
                                                'day3':{'moving_average_past_10': moving_average_past_10[2],
                                                         'hour1':{'time': hour_times[48], 'hourly_average': hourly_average[48]},
                                                        'hour2':{'time': hour_times[49], 'hourly_average': hourly_average[49]},
                                                        'hour3':{'time': hour_times[50], 'hourly_average': hourly_average[50]},
                                                        'hour4':{'time': hour_times[51], 'hourly_average': hourly_average[51]},
                                                        'hour5':{'time': hour_times[52], 'hourly_average': hourly_average[52]},
                                                        'hour6':{'time': hour_times[53], 'hourly_average': hourly_average[53]},
                                                        'hour7':{'time': hour_times[54], 'hourly_average': hourly_average[54]},
                                                        'hour8':{'time': hour_times[55], 'hourly_average': hourly_average[55]},
                                                        'hour9':{'time': hour_times[56], 'hourly_average': hourly_average[56]},
                                                        'hour10':{'time': hour_times[57], 'hourly_average': hourly_average[57]},
                                                        'hour11':{'time': hour_times[58], 'hourly_average': hourly_average[58]},
                                                        'hour12':{'time': hour_times[59], 'hourly_average': hourly_average[59]},
                                                        'hour13':{'time': hour_times[60], 'hourly_average': hourly_average[60]},
                                                        'hour14':{'time': hour_times[61], 'hourly_average': hourly_average[61]},
                                                        'hour15':{'time': hour_times[62], 'hourly_average': hourly_average[62]},
                                                        'hour16':{'time': hour_times[63], 'hourly_average': hourly_average[63]},
                                                        'hour17':{'time': hour_times[64], 'hourly_average': hourly_average[64]},
                                                        'hour18':{'time': hour_times[65], 'hourly_average': hourly_average[65]},
                                                        'hour19':{'time': hour_times[66], 'hourly_average': hourly_average[66]},
                                                        'hour20':{'time': hour_times[67], 'hourly_average': hourly_average[67]},
                                                        'hour21':{'time': hour_times[68], 'hourly_average': hourly_average[68]},
                                                        'hour22':{'time': hour_times[69], 'hourly_average': hourly_average[69]},
                                                        'hour23':{'time': hour_times[70], 'hourly_average': hourly_average[70]},
                                                        'hour24':{'time': hour_times[71], 'hourly_average': hourly_average[71]}},
                                                'day4':{'moving_average_past_10': moving_average_past_10[3], 
                                                         'hour1':{'time': hour_times[72], 'hourly_average': hourly_average[72]},
                                                        'hour2':{'time': hour_times[73], 'hourly_average': hourly_average[73]},
                                                        'hour3':{'time': hour_times[74], 'hourly_average': hourly_average[74]},
                                                        'hour4':{'time': hour_times[75], 'hourly_average': hourly_average[75]},
                                                        'hour5':{'time': hour_times[76], 'hourly_average': hourly_average[76]},
                                                        'hour6':{'time': hour_times[77], 'hourly_average': hourly_average[77]},
                                                        'hour7':{'time': hour_times[78], 'hourly_average': hourly_average[78]},
                                                        'hour8':{'time': hour_times[79], 'hourly_average': hourly_average[79]},
                                                        'hour9':{'time': hour_times[80], 'hourly_average': hourly_average[80]},
                                                        'hour10':{'time': hour_times[81], 'hourly_average': hourly_average[81]},
                                                        'hour11':{'time': hour_times[82], 'hourly_average': hourly_average[82]},
                                                        'hour12':{'time': hour_times[83], 'hourly_average': hourly_average[83]},
                                                        'hour13':{'time': hour_times[84], 'hourly_average': hourly_average[84]},
                                                        'hour14':{'time': hour_times[85], 'hourly_average': hourly_average[85]},
                                                        'hour15':{'time': hour_times[86], 'hourly_average': hourly_average[86]},
                                                        'hour16':{'time': hour_times[87], 'hourly_average': hourly_average[87]},
                                                        'hour17':{'time': hour_times[88], 'hourly_average': hourly_average[88]},
                                                        'hour18':{'time': hour_times[89], 'hourly_average': hourly_average[89]},
                                                        'hour19':{'time': hour_times[90], 'hourly_average': hourly_average[90]},
                                                        'hour20':{'time': hour_times[91], 'hourly_average': hourly_average[91]},
                                                        'hour21':{'time': hour_times[92], 'hourly_average': hourly_average[92]},
                                                        'hour22':{'time': hour_times[93], 'hourly_average': hourly_average[93]},
                                                        'hour23':{'time': hour_times[94], 'hourly_average': hourly_average[94]},
                                                        'hour24':{'time': hour_times[95], 'hourly_average': hourly_average[95]}},
                                                'day5':{'moving_average_past_10': moving_average_past_10[4], 
                                                         'hour1':{'time': hour_times[96], 'hourly_average': hourly_average[96]},
                                                        'hour2':{'time': hour_times[97], 'hourly_average': hourly_average[97]},
                                                        'hour3':{'time': hour_times[98], 'hourly_average': hourly_average[98]},
                                                        'hour4':{'time': hour_times[99], 'hourly_average': hourly_average[99]},
                                                        'hour5':{'time': hour_times[100], 'hourly_average': hourly_average[100]},
                                                        'hour6':{'time': hour_times[101], 'hourly_average': hourly_average[101]},
                                                        'hour7':{'time': hour_times[102], 'hourly_average': hourly_average[102]},
                                                        'hour8':{'time': hour_times[103], 'hourly_average': hourly_average[103]},
                                                        'hour9':{'time': hour_times[104], 'hourly_average': hourly_average[104]},
                                                        'hour10':{'time': hour_times[105], 'hourly_average': hourly_average[105]},
                                                        'hour11':{'time': hour_times[106], 'hourly_average': hourly_average[106]},
                                                        'hour12':{'time': hour_times[107], 'hourly_average': hourly_average[107]},
                                                        'hour13':{'time': hour_times[108], 'hourly_average': hourly_average[108]},
                                                        'hour14':{'time': hour_times[109], 'hourly_average': hourly_average[109]},
                                                        'hour15':{'time': hour_times[110], 'hourly_average': hourly_average[110]},
                                                        'hour16':{'time': hour_times[111], 'hourly_average': hourly_average[111]},
                                                        'hour17':{'time': hour_times[112], 'hourly_average': hourly_average[112]},
                                                        'hour18':{'time': hour_times[113], 'hourly_average': hourly_average[113]},
                                                        'hour19':{'time': hour_times[114], 'hourly_average': hourly_average[114]},
                                                        'hour20':{'time': hour_times[115], 'hourly_average': hourly_average[115]},
                                                        'hour21':{'time': hour_times[116], 'hourly_average': hourly_average[116]},
                                                        'hour22':{'time': hour_times[117], 'hourly_average': hourly_average[117]},
                                                        'hour23':{'time': hour_times[118], 'hourly_average': hourly_average[118]},
                                                        'hour24':{'time': hour_times[119], 'hourly_average': hourly_average[119]}}}})





def exec_summary_loss_chart(): # will provide data for last 5 days for all routes in 'sample_routes' array

        current_time = int(time.time()) # get the current time
        midnight = current_time - (current_time %(24*60*60)) # shift time BACK to midnight (0th hour) of this day

        start_time = midnight - (5 * 24 * 60 * 60) #subtract 5 days from current time(this will allow us to get 5 days worth of "data") 
        hour_start_time = start_time
        t_inc = 0
        day_times =[]
        while t_inc < 5:
                day_times.extend([str(start_time + (24*3600))]) # each day will increment by 24*3600 which is 24(number of hours in a day) * 3600(number seconds in an hour)
                t_inc += 1

        t_inc = 0
        hour_times =[]
        while t_inc < 120:
                hour_times.extend([str(hour_start_time)]) #generating each hour for the next 5 days (24 * 5 = 120)
                hour_start_time += 3600
                t_inc += 1

        hourly_average =[]
        moving_average_past_10 = []
        for i in range(len(sample_routes)):
                hourly_average = [str(random.uniform(20,100)) for x in range(120)] # 120(one for each hour) random floating point values between 20 and 100 for houlry average
                moving_average_past_10 = [str(random.uniform(40,100)) for y in range(5)] # 5(one for each day) random floating point values between 40 and 100 for moving average values(for past 10 days)


                
                r.hmset('exec_summary_loss_chart',{sample_routes[i]:
                                                {'day1':{'moving_average_past_10': moving_average_past_10[0], 
                                                        'hour1':{'time': hour_times[0], 'hourly_average': hourly_average[0]},
                                                        'hour2':{'time': hour_times[1], 'hourly_average': hourly_average[1]},
                                                        'hour3':{'time': hour_times[2], 'hourly_average': hourly_average[2]},
                                                        'hour4':{'time': hour_times[3], 'hourly_average': hourly_average[3]},
                                                        'hour5':{'time': hour_times[4], 'hourly_average': hourly_average[4]},
                                                        'hour6':{'time': hour_times[5], 'hourly_average': hourly_average[5]},
                                                        'hour7':{'time': hour_times[6], 'hourly_average': hourly_average[6]},
                                                        'hour8':{'time': hour_times[7], 'hourly_average': hourly_average[7]},
                                                        'hour9':{'time': hour_times[8], 'hourly_average': hourly_average[8]},
                                                        'hour10':{'time': hour_times[9], 'hourly_average': hourly_average[9]},
                                                        'hour11':{'time': hour_times[10], 'hourly_average': hourly_average[10]},
                                                        'hour12':{'time': hour_times[11], 'hourly_average': hourly_average[11]},
                                                        'hour13':{'time': hour_times[12], 'hourly_average': hourly_average[12]},
                                                        'hour14':{'time': hour_times[13], 'hourly_average': hourly_average[13]},
                                                        'hour15':{'time': hour_times[14], 'hourly_average': hourly_average[14]},
                                                        'hour16':{'time': hour_times[15], 'hourly_average': hourly_average[15]},
                                                        'hour17':{'time': hour_times[16], 'hourly_average': hourly_average[16]},
                                                        'hour18':{'time': hour_times[17], 'hourly_average': hourly_average[17]},
                                                        'hour19':{'time': hour_times[18], 'hourly_average': hourly_average[18]},
                                                        'hour20':{'time': hour_times[19], 'hourly_average': hourly_average[19]},
                                                        'hour21':{'time': hour_times[20], 'hourly_average': hourly_average[20]},
                                                        'hour22':{'time': hour_times[21], 'hourly_average': hourly_average[21]},
                                                        'hour23':{'time': hour_times[22], 'hourly_average': hourly_average[22]},
                                                        'hour24':{'time': hour_times[23], 'hourly_average': hourly_average[23]}},
                                                'day2':{'moving_average_past_10': moving_average_past_10[1], 
                                                         'hour1':{'time': hour_times[24], 'hourly_average': hourly_average[24]},
                                                        'hour2':{'time': hour_times[25], 'hourly_average': hourly_average[25]},
                                                        'hour3':{'time': hour_times[26], 'hourly_average': hourly_average[26]},
                                                        'hour4':{'time': hour_times[27], 'hourly_average': hourly_average[27]},
                                                        'hour5':{'time': hour_times[28], 'hourly_average': hourly_average[28]},
                                                        'hour6':{'time': hour_times[29], 'hourly_average': hourly_average[29]},
                                                        'hour7':{'time': hour_times[30], 'hourly_average': hourly_average[30]},
                                                        'hour8':{'time': hour_times[31], 'hourly_average': hourly_average[31]},
                                                        'hour9':{'time': hour_times[32], 'hourly_average': hourly_average[32]},
                                                        'hour10':{'time': hour_times[33], 'hourly_average': hourly_average[33]},
                                                        'hour11':{'time': hour_times[34], 'hourly_average': hourly_average[34]},
                                                        'hour12':{'time': hour_times[35], 'hourly_average': hourly_average[35]},
                                                        'hour13':{'time': hour_times[36], 'hourly_average': hourly_average[36]},
                                                        'hour14':{'time': hour_times[37], 'hourly_average': hourly_average[37]},
                                                        'hour15':{'time': hour_times[38], 'hourly_average': hourly_average[38]},
                                                        'hour16':{'time': hour_times[39], 'hourly_average': hourly_average[39]},
                                                        'hour17':{'time': hour_times[40], 'hourly_average': hourly_average[40]},
                                                        'hour18':{'time': hour_times[41], 'hourly_average': hourly_average[41]},
                                                        'hour19':{'time': hour_times[42], 'hourly_average': hourly_average[42]},
                                                        'hour20':{'time': hour_times[43], 'hourly_average': hourly_average[43]},
                                                        'hour21':{'time': hour_times[44], 'hourly_average': hourly_average[44]},
                                                        'hour22':{'time': hour_times[45], 'hourly_average': hourly_average[45]},
                                                        'hour23':{'time': hour_times[46], 'hourly_average': hourly_average[46]},
                                                        'hour24':{'time': hour_times[47], 'hourly_average': hourly_average[47]}},
                                                'day3':{'moving_average_past_10': moving_average_past_10[2],
                                                         'hour1':{'time': hour_times[48], 'hourly_average': hourly_average[48]},
                                                        'hour2':{'time': hour_times[49], 'hourly_average': hourly_average[49]},
                                                        'hour3':{'time': hour_times[50], 'hourly_average': hourly_average[50]},
                                                        'hour4':{'time': hour_times[51], 'hourly_average': hourly_average[51]},
                                                        'hour5':{'time': hour_times[52], 'hourly_average': hourly_average[52]},
                                                        'hour6':{'time': hour_times[53], 'hourly_average': hourly_average[53]},
                                                        'hour7':{'time': hour_times[54], 'hourly_average': hourly_average[54]},
                                                        'hour8':{'time': hour_times[55], 'hourly_average': hourly_average[55]},
                                                        'hour9':{'time': hour_times[56], 'hourly_average': hourly_average[56]},
                                                        'hour10':{'time': hour_times[57], 'hourly_average': hourly_average[57]},
                                                        'hour11':{'time': hour_times[58], 'hourly_average': hourly_average[58]},
                                                        'hour12':{'time': hour_times[59], 'hourly_average': hourly_average[59]},
                                                        'hour13':{'time': hour_times[60], 'hourly_average': hourly_average[60]},
                                                        'hour14':{'time': hour_times[61], 'hourly_average': hourly_average[61]},
                                                        'hour15':{'time': hour_times[62], 'hourly_average': hourly_average[62]},
                                                        'hour16':{'time': hour_times[63], 'hourly_average': hourly_average[63]},
                                                        'hour17':{'time': hour_times[64], 'hourly_average': hourly_average[64]},
                                                        'hour18':{'time': hour_times[65], 'hourly_average': hourly_average[65]},
                                                        'hour19':{'time': hour_times[66], 'hourly_average': hourly_average[66]},
                                                        'hour20':{'time': hour_times[67], 'hourly_average': hourly_average[67]},
                                                        'hour21':{'time': hour_times[68], 'hourly_average': hourly_average[68]},
                                                        'hour22':{'time': hour_times[69], 'hourly_average': hourly_average[69]},
                                                        'hour23':{'time': hour_times[70], 'hourly_average': hourly_average[70]},
                                                        'hour24':{'time': hour_times[71], 'hourly_average': hourly_average[71]}},
                                                'day4':{'moving_average_past_10': moving_average_past_10[3], 
                                                         'hour1':{'time': hour_times[72], 'hourly_average': hourly_average[72]},
                                                        'hour2':{'time': hour_times[73], 'hourly_average': hourly_average[73]},
                                                        'hour3':{'time': hour_times[74], 'hourly_average': hourly_average[74]},
                                                        'hour4':{'time': hour_times[75], 'hourly_average': hourly_average[75]},
                                                        'hour5':{'time': hour_times[76], 'hourly_average': hourly_average[76]},
                                                        'hour6':{'time': hour_times[77], 'hourly_average': hourly_average[77]},
                                                        'hour7':{'time': hour_times[78], 'hourly_average': hourly_average[78]},
                                                        'hour8':{'time': hour_times[79], 'hourly_average': hourly_average[79]},
                                                        'hour9':{'time': hour_times[80], 'hourly_average': hourly_average[80]},
                                                        'hour10':{'time': hour_times[81], 'hourly_average': hourly_average[81]},
                                                        'hour11':{'time': hour_times[82], 'hourly_average': hourly_average[82]},
                                                        'hour12':{'time': hour_times[83], 'hourly_average': hourly_average[83]},
                                                        'hour13':{'time': hour_times[84], 'hourly_average': hourly_average[84]},
                                                        'hour14':{'time': hour_times[85], 'hourly_average': hourly_average[85]},
                                                        'hour15':{'time': hour_times[86], 'hourly_average': hourly_average[86]},
                                                        'hour16':{'time': hour_times[87], 'hourly_average': hourly_average[87]},
                                                        'hour17':{'time': hour_times[88], 'hourly_average': hourly_average[88]},
                                                        'hour18':{'time': hour_times[89], 'hourly_average': hourly_average[89]},
                                                        'hour19':{'time': hour_times[90], 'hourly_average': hourly_average[90]},
                                                        'hour20':{'time': hour_times[91], 'hourly_average': hourly_average[91]},
                                                        'hour21':{'time': hour_times[92], 'hourly_average': hourly_average[92]},
                                                        'hour22':{'time': hour_times[93], 'hourly_average': hourly_average[93]},
                                                        'hour23':{'time': hour_times[94], 'hourly_average': hourly_average[94]},
                                                        'hour24':{'time': hour_times[95], 'hourly_average': hourly_average[95]}},
                                                'day5':{'moving_average_past_10': moving_average_past_10[4], 
                                                         'hour1':{'time': hour_times[96], 'hourly_average': hourly_average[96]},
                                                        'hour2':{'time': hour_times[97], 'hourly_average': hourly_average[97]},
                                                        'hour3':{'time': hour_times[98], 'hourly_average': hourly_average[98]},
                                                        'hour4':{'time': hour_times[99], 'hourly_average': hourly_average[99]},
                                                        'hour5':{'time': hour_times[100], 'hourly_average': hourly_average[100]},
                                                        'hour6':{'time': hour_times[101], 'hourly_average': hourly_average[101]},
                                                        'hour7':{'time': hour_times[102], 'hourly_average': hourly_average[102]},
                                                        'hour8':{'time': hour_times[103], 'hourly_average': hourly_average[103]},
                                                        'hour9':{'time': hour_times[104], 'hourly_average': hourly_average[104]},
                                                        'hour10':{'time': hour_times[105], 'hourly_average': hourly_average[105]},
                                                        'hour11':{'time': hour_times[106], 'hourly_average': hourly_average[106]},
                                                        'hour12':{'time': hour_times[107], 'hourly_average': hourly_average[107]},
                                                        'hour13':{'time': hour_times[108], 'hourly_average': hourly_average[108]},
                                                        'hour14':{'time': hour_times[109], 'hourly_average': hourly_average[109]},
                                                        'hour15':{'time': hour_times[110], 'hourly_average': hourly_average[110]},
                                                        'hour16':{'time': hour_times[111], 'hourly_average': hourly_average[111]},
                                                        'hour17':{'time': hour_times[112], 'hourly_average': hourly_average[112]},
                                                        'hour18':{'time': hour_times[113], 'hourly_average': hourly_average[113]},
                                                        'hour19':{'time': hour_times[114], 'hourly_average': hourly_average[114]},
                                                        'hour20':{'time': hour_times[115], 'hourly_average': hourly_average[115]},
                                                        'hour21':{'time': hour_times[116], 'hourly_average': hourly_average[116]},
                                                        'hour22':{'time': hour_times[117], 'hourly_average': hourly_average[117]},
                                                        'hour23':{'time': hour_times[118], 'hourly_average': hourly_average[118]},
                                                        'hour24':{'time': hour_times[119], 'hourly_average': hourly_average[119]}}}})

##############################################################################################################################3
###############################################################################################################################


##############################
#Execute functions
exec_summary_target_routes()
exec_summary_target_routes_latency()
exec_summary_target_routes_loss()
exec_summary_routes()
exec_summary_latency_chart()
exec_summary_loss_chart()