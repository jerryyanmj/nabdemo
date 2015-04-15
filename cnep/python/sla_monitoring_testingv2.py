import redis
import random
import math
import json

dummmySourceIPs = [ 
   "52.186.56.210", 
   "52.186.56.211", 
   "52.186.56.212", 
   "52.186.56.213", 
   "52.186.56.214", 
   "52.186.56.215", 
   "52.186.56.216", 
   "52.186.56.217" 
]

dummyTargetIPs  = [ 
   "173.194.33.30", 
   "173.194.33.31", 
   "173.194.33.32", 
   "173.194.33.33", 
   "173.194.33.34", 
   "173.194.33.35", 
   "173.194.33.36", 
   "173.194.33.37" 
]

#populated by whatever is in text file
sampleSourceCities = []
sampleTargetCities = []

#will be randomly selected using values in above lists
city_keys = []

#last 1 hour, last 12 hours, last 24 hours, last 5 days
num_time_drilldowns = 4 

r=redis.StrictRedis(host='localhost', port=6379, db=0);

#load cities into sample source/target from text file
def getCities():

	lines = [line.strip() for line in open('sla_cities.txt')]
	source = True
	target = False

	for city in lines:
		if city == 'SOURCE':
			source = True
			target = False
		elif city == 'TARGET':
			target = True
			source = False
		elif source == True:
			sampleSourceCities.extend([city])
		elif target == True:
			sampleTargetCities.extend([city])

#simply adds all source cities into collection
def set_sources_collection(): 

	r.delete('sla_sources')
	for pos in range(0, len(sampleSourceCities)):
		r.hmset('sla_sources', {dummmySourceIPs[pos] : sampleSourceCities[pos]})
	
#simply adds all target cities into collection
def set_targets_collection(): 

	r.delete('sla_targets')
	for pos in range(0, len(sampleTargetCities)):
		r.hmset('sla_targets', {dummyTargetIPs[pos]: sampleTargetCities[pos]})

#creates keys, and then creates values for each key and populates the 'sla_violations_chart' collection
def make_source_target_pairs(): 

	r.delete('sla_ui_info')

	#ensure we have enough sourcecity targetcity combinations
	for pos in range(len(sampleSourceCities)):  

		source_city = random.choice(sampleSourceCities)
		target_city = random.choice(sampleTargetCities)
		source_index = sampleSourceCities.index(source_city)
		target_index = sampleTargetCities.index(target_city)
		key = dummmySourceIPs[source_index] + "|" + dummyTargetIPs[target_index]

		all_data = []
		for elem in range(0,num_time_drilldowns):
			lossCrit = random.randint(0,20)
			lossWarn = random.randint(0,20)
			lossHealthy = random.randint(0,20)
			latencyCrit = random.randint(0,20)
			latencyWarn = random.randint(0,20)
			latencyHealthy = random.randint(0,20)
			availCrit = random.randint(0,20)
			availWarn = random.randint(0,20)
			availHealthy = random.randint(0,20)
			slaCount = lossCrit + latencyCrit + availCrit
			all_data.extend([{'lossCriticalCount': lossCrit  , 'lossWarningCount' : lossWarn, 'lossHealthyCount' : lossHealthy , 'latencyCriticalCount' : latencyCrit, 'latencyWarningCount' : latencyWarn , 'latencyHealthyCount' : latencyHealthy, 'availabilityCriticalCount' : availCrit, 'availabilityWarningCount' : availWarn , 'availabilityHealthyCount' : availHealthy, 'slaCount' : slaCount }])

		value = {}
		value['last_1_hour'] = all_data[0]
		value['last_12_hours'] = all_data[1]
		value['last_24_hours'] = all_data[2]
		value['last_5_days'] = all_data[3]
		r.hmset('sla_ui_info',{ key : json.dumps(value)})	

###################################################################
# EXECUTE FUNCTIONS
getCities()
set_sources_collection()
set_targets_collection()
make_source_target_pairs()
###################################################################
