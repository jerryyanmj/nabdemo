import redis
import random
import math

#populated by whatever is in text file
sampleSourceCities = []
sampleTargetCities = []

#will be randomly selected using values in above lists
city_keys = []

#determines shade of color on UI (red, yellow, or plain)
health = ["critical", "warning", "healthy"]

num_time_drilldowns = 4 #last 1 hour, last 12 hours, last 24 hours, last 5 days

r=redis.StrictRedis(host='localhost', port=6379, db=0);

def getCities():#load cities into sample source/target from text file
	lines = [line.strip() for line in open('sla_cities.txt')]
	source = True
	target = False
	#print lines
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

	#print sampleTargetCities
	#print sampleSourceCities



def set_sources_collection(): #simply adds all source cities into collection
	for city in sampleSourceCities:
		r.sadd('sla_source_cities', city)

def set_targets_collection(): #simply adds all target cities into collection
	for city in sampleTargetCities:
		r.sadd('sla_target_cities', city)

def make_source_target_pairs(): #creates keys, and then creates values for each key and populates the 'sla_violations_chart' collection
	for pos in range(len(sampleSourceCities)):  #ensure we have enough sourcecity targetcity combinations
		source_city = random.choice(sampleSourceCities)
		target_city = random.choice(sampleTargetCities)
		key = source_city +"|" + target_city # for example,key = "San Jose, CA|Atlanta, GA"
		
		
		health_events = [] #this will provide health status for each of the metrics(sla, latency, loss, availability)
		sla_events = []
		latency_events = []
		loss_events = []
		availability_events = []
		loss_health_events = []
		latency_health_events = []
		sla_health_events = []
		availability_health_events = []


		value = -1 # used to keep track of previous run's sla_event count
		for elem in range(0, num_time_drilldowns): #as time increases, we should make sure that SLA numbers are >= to previous time positions  count
			sla = -1
			if elem == 0:
				sla = random.randint(0,7)
				sla_events.extend([str(sla)])
				value = sla
			else:
				max_val = 7 + elem
				sla = random.randint(0,max_val)
				while sla < value:
					sla = random.randint(0,max_val)
				sla_events.extend([str(sla)])
				value = sla
		#now all SLA_events will have been stored for this route

		#now determine latency values
		value = -1
		for elem in range(0,num_time_drilldowns):
			if elem == 0:
				latency = random.uniform(0,60)#returns random floating point value between 0-30
				latency_events.extend([str(latency)])
				value = latency
			else:
				max_val = 60 + elem*10
				latency = random.uniform(0,max_val)
				while latency < value:
					latency = random.uniform(0,max_val)
				latency_events.extend([str(latency)])
				value = latency
		#latency values are now filled for each time period


		#determine loss/availaibility values
		value = -1
		for elem in range(0,num_time_drilldowns):
			loss = random.uniform(0,10)#returns random floating point value between 0-30
			loss_events.extend([str(loss)])

			availability = random.uniform(93,100)
			availability_events.extend([str(availability)])
	#loss and availability values are now filled for each time period		


		#set health values
		for elem in range(0,num_time_drilldowns):
			lat = float(latency_events[elem])
			if lat >= 100:
				latency_health_events.extend(["critical"])
			elif lat >= 50 and lat < 100 :
				latency_health_events.extend(["warning"])
			else:
				latency_health_events.extend(["healthy"])

			loss = float(loss_events[elem])
			if loss >= 5:
				loss_health_events.extend(["critical"])
			elif loss >= 0 and loss < 5 :
				loss_health_events.extend(["warning"])
			else:
				loss_health_events.extend(["healthy"])

			avail = float(availability_events[elem])
			if avail <= 95:
				availability_health_events.extend(["critical"])
			elif avail < 100 and avail > 95:
				availability_health_events.extend(["warning"])
			else:
				availability_health_events.extend(["healthy"])


			sla = int(sla_events[elem])
			if sla >= 5:
				sla_health_events.extend(["critical"])
			elif sla > 0 and sla < 5:
				sla_health_events.extend(["warning"])
			else:
				sla_health_events.extend(["healthy"])
	#all health events should now be populated

		all_data = []
		for elem in range(0,num_time_drilldowns):
			all_data.extend(["{ loss: " + loss_events[elem] + ", latency: " + latency_events[elem] + ", availability: " + availability_events[elem] + ", sla_violations: " + sla_events[elem] + ", loss_health: " + loss_health_events[elem] + ", latency_health: " + latency_health_events[elem] + ", availability_health: " + availability_health_events[elem] + ", sla_health: " + sla_health_events[elem] + "}"])

		r.hmset('sla_monitoring_chart',{ key : 
										{
											'last_1_hour': all_data[0],
											'last_12_hours': all_data[1],
											'last_24_hours': all_data[2],
											'last_5_days': all_data[3]
										}
			} )	




###################################################################
# EXECUTE FUNCTIONS
getCities()
set_sources_collection()
set_targets_collection()
make_source_target_pairs()
###################################################################