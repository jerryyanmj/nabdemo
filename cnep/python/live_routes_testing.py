import redis
import json
import time
import random
from math import sin, cos, sqrt, atan2, radians

# OVERVIEW OF STRUCTURE FOR live_routes_map collection and live_target_routes_for_map collections
###################################################################################3
#  1) live_target_routes_for_map :  will be a set --> UI will blindly select all routes, in format "sourceIP|targetIP"
#  2) UI will then select from live_routes_map collection for all data associated with each route. 
#	'live_routes_map' collection structure...it will be a hashmap
#		a)	"54.186.56.213|173.194.33.71" : {sourceIP: 54.186.56.213, targetIP: 173.194.33.71, 
#			locationInfo : { sourceCity: Atlanta    , sourceLat: 33.748995, sourceLon: -84.387982, targetCity: Houston, targetLat: 29.760193, targetLon:-95.369390, distance:701.055317939},
#			historical: { loss:2.85552313942, latency: 7.69938650318}, 
#			current: { loss:0.81422731632, latency: 14.0717638886, loss_deviation_score:     -1, latency_deviation_score: 1}
#			hops : {hop1:{IP:"123", RTT: 123, loss: 45}, hop2:{IP:"123", RTT: 123, loss: 45}}}"

#		Key notes:  1) current loss/latency deviation, values will be ranging anywhere from Negative to Positive.  -X denotes improvement by 'X' number of standard deviations, while 
# 					X denotes violation by 'X' number of standard deviations
#					2) historical metrics will likely be 'moving average' values, meaning they will be populated by the daily aggregations from HDFS



r=redis.StrictRedis(host='localhost', port=6379, db=0);
##############################################################################
#ALTERNATE THESE VALUES IF YOU WISH TO ADD SAMPLE DATA. NOTE THAT FOR CURRENT SETUP WE ONLY  HAVE ONE SOURCE CITY (randomly picked from two choices)... KEEP NUMBER OF SOURCE IPs = TO SOURCE CITIES
sample_routes = [
   "52.186.56.210|173.194.33.30", 
   "52.186.56.211|173.194.33.31",
   "52.186.56.212|173.194.33.32",
   "52.186.56.213|173.194.33.33",
   "52.186.56.214|173.194.33.34"
]

#NUM_SOURCE_CITIES = 3 ---> currently only using one source city: if changing this, note that you will have to slightly alter: pick_source_city(), calc_haverine_distance & populate_live_routes (CHANGE WHERE MARKED), 
sampleSourceCities = [ "Atlanta", "New York", "Portland" ]
sampleSourceLats   = [ "33.748995","40.714353", "45.523452" ]
sampleSourceLons   = [ "-84.387982", "-74.005973", "-122.676207" ]

#IF YOU ADD CITIES, MAKE SURE TO ADD LON AND LAT FIELDS TOO --REST OF SCRIPT WILL NOT HAVE TO BE CHANGED TO ACCOMODATE THESE SCRIPTS!
sampleTargetCities = [ "San Jose", "Santa Barbara", "Mountain View", "Portland", "Seattle", "Houston", "San Francisco", "Las Vegas","Denver", "Los Angelas" ]
sampleLats         = [ "37.3333","34.4258", "37.3894","45.523452","47.606209", "29.760193", "32.780140", "37.774929", "36.255123", "39.737567", "34.052234" ]
sampleLons         = [ "-121.9000","-119.698190","-122.083851","-122.676207","-122.332071", "-95.369390", "-96.800451","-122.419416", "-115.238349", "-104.984718", "118.243685" ]
#latitude and longitudes courtesy of: http://www.latlong.net/
####################################################################################

########################################
#USED TO POPULATE JSON STRUCTURE
sourceIPs =[]
targetIPs =[]
sourceCities = []
sourceLat = []
sourceLon = []
targetCities = []
targetLats = []
targetLons = []

# stores all distances between cities -- calculated using Havesine formula
dist_miles = [] 

#historical vals
historical_loss = []
historical_latency = []

#current vals
current_loss = []
current_latency = []
loss_deviation_score = []
latency_deviation_score = []
##########################################

def pick_source_city():
	x = 0
	#assume only one source city - pick one randomly
	#assume only one because in sample routes(CURRENTLY), we only have one source IP
	# pick a random source city
	picked = random.choice(sampleSourceCities) 
	sourceCities.extend([picked])

	# find position of source City
	pos = sampleSourceCities.index(picked) 
	
	#add source lat associated with source city chosen
	sourceLat.extend([str(sampleSourceLats[pos])]) 
	
	#add source lon associated with source city chosen
	sourceLon.extend([str(sampleSourceLons[pos])]) 

def pick_target_cities():

	x = 0

	while x < (len(sample_routes)):
		
		picked = random.choice(sampleTargetCities)

		#verify that randommly picked city is NOT already in targetCities array
		while picked in targetCities: 
			picked = random.choice(sampleTargetCities)

		# add selected new city to targetCities array
		targetCities.extend([picked]) 

		# find out which position 'picked' was in sampleCities
		pos = sampleTargetCities.index(picked) 

		#use pos to find correlating lat and lon values
		targetLats.extend([str(sampleLats[pos])]) 

		targetLons.extend([str(sampleLons[pos])])
		x += 1

def getIPs():

	for route in range(len(sample_routes)):

		ip_arr = sample_routes[route].split('|')

		sourceIPs.extend([str(ip_arr[0])])
		targetIPs.extend([str(ip_arr[1])])

def calc_haversine_distance():

	#using Haversine formula to calc distance
	#moving javascript logic to CEP processing to calc distance btwn cities
	#in terms of miles NOT km
	#CALL AFTER SOURCE AND TARGET IPS/CITIES HAVE BEEN CHOSEN
	R = 6371.0 #in km
	for route in range(len(sample_routes)):

		# NOTE THAT YOU WILL NEED TO CHANGE THIS IF YOU ADD MORE SOURCES!!
		lat1 = radians(float(sourceLat[0])) 

		# NOTE THAT YOU WILL NEED TO CHANGE THIS IF YOU ADD MORE SOURCES!!
		lon1 = radians(float(sourceLon[0])) 
		lat2 = radians(float(targetLats[route]))
		lon2 = radians(float(targetLons[route]))

		dlon = lon2 - lon1
		dlat = lat2 - lat1
		a = (sin(dlat/2))**2 + cos(lat1) * cos(lat2) * (sin(dlon/2))**2
		c = 2 * atan2(sqrt(a), sqrt(1-a))

		#in KM
		distance = R * c
 
		#convert to miles
		dist_miles.extend([str(distance*0.621371)]) 

#create historical loss and historical latency metrics
def make_historical_vals(): 

	#returns random floating point value between 0-100 for each route
	historical_loss.extend([random.uniform(0,100) for h_l in range(0,len(sample_routes))])

	#returns random floating point value between 0-30 for each route
	historical_latency.extend([random.uniform(0,30) for h_l in range(0,len(sample_routes))])

#create loss, latency, and deviation_scores
def make_current_vals():

	#make it somewhat realistic -- assume sttdev is ~5 for each metric
	#use assumed stddev and the generated current metrics to determine deviation scores

	#returns random floating point value between 0-100 for each route
	current_loss.extend( [ float( "{0:.0f}".format( random.uniform( 0, 100 ) ) ) for h_l in range( 0, len( sample_routes ) ) ] )

	#returns random floating point value between 0-30 for each route
	current_latency.extend( [ float( "{0:.0f}".format( random.uniform( 0, 30 ) ) ) for h_l in range( 0, len( sample_routes ) ) ] )

	stddev = 5

    #create deviation scores
	for pos in range(len(sample_routes)):
		if current_loss[pos] > historical_loss[pos] and current_loss[pos] <= historical_loss[pos] + 2*stddev :
			loss_deviation_score.extend([str(1)])
		elif current_loss[pos] > historical_loss[pos] + 2*stddev and current_loss[pos] <= historical_loss[pos] + 3*stddev :
			loss_deviation_score.extend([str(2)])
		elif current_loss[pos] > historical_loss[pos] + 3*stddev:
			loss_deviation_score.extend([str(3)])
		elif current_loss[pos] == historical_loss[pos]:
			loss_deviation_score.extend([str(0)])
		elif current_loss[pos] >= historical_loss[pos] - 2*stddev and current_loss[pos] < historical_loss[pos]:
			loss_deviation_score.extend([str(-1)])
		elif current_loss[pos] >= historical_loss[pos] - 3*stddev and current_loss[pos] < historical_loss[pos] + 2*stddev:
			loss_deviation_score.extend([str(-2)])
		elif current_loss[pos] < historical_loss[pos] - 3*stddev:
			loss_deviation_score.extend([str(-3)])

		if current_latency[pos] > historical_latency[pos] and current_latency[pos] <= historical_latency[pos] + 2*stddev :
			latency_deviation_score.extend([str(1)])
		elif current_latency[pos] > historical_latency[pos] + 2*stddev and current_latency[pos] <= historical_latency[pos] + 3*stddev :
			latency_deviation_score.extend([str(2)])
		elif current_latency[pos] > historical_latency[pos] + 3*stddev:
			latency_deviation_score.extend([str(3)])
		elif current_latency[pos] == historical_latency[pos]:
			latency_deviation_score.extend([str(0)])
		elif current_latency[pos] >= historical_latency[pos] - 2*stddev and current_latency[pos] < historical_latency[pos]:
			latency_deviation_score.extend([str(-1)])
		elif current_latency[pos] >= historical_latency[pos] - 3*stddev and current_latency[pos] < historical_latency[pos] + 2*stddev:
			latency_deviation_score.extend([str(-2)])
		elif current_latency[pos] < historical_latency[pos] - 3*stddev:
			latency_deviation_score.extend([str(-3)])

def populate_live_target_routes_for_map_collection(): 

	for eachRoute in range(len(sample_routes)):
		r.sadd('live_target_routes_for_map', sample_routes[eachRoute])

def populate_live_routes_collection():

	#the live_routes_collection will have all the routes that the UI needs to populate this page
	#along with all of the data needed for these routes
	#DATA NEEDED:  key --> route name(sourceIP|targetIP)   ,   
	#				value--> {sourceIP, targetIP, locationInfo : {sourceCity, sourceLat, sourceLon, targetCity, targetLat, targetLon, distance_miles}, 
	#							historical:{loss:'', latency''}, current:{loss:'',latency:'', loss_deviation_score:'', latency_deviation_score'}}
	# for current loss/latency deviation, values will be ranging from -3 to 3.  -X denotes improvement by 'X' number of standard deviations, while 
	# X denotes violation by 'X' number of standard deviations

	#NOTE:  line 163 --> locationInfo ---> if you ADD more cities to sourceCities, make sure to have 
	key= ""
	value = {}

	#NOTE YOU WILL HAVE TO CHANGE SOURCECITIES and SOURCELAT and SOURCELON indexes TO ACCOMODATE NEW/ADDED SOURCE CITIES!!(if you change script)
	for eachRoute in range(len(sample_routes)):
		key = sample_routes[eachRoute]
		value['sourceIP'] = sourceIPs[eachRoute]
		value['targetIP'] = targetIPs[eachRoute]
		value['locationInfo'] = {}
		value['locationInfo']['fromCity'] = sourceCities[0]
		value['locationInfo']['sourceLat'] = sourceLat[0]
		value['locationInfo']['sourceLon'] = sourceLon[0]
		value['locationInfo']['toCity'] = targetCities[eachRoute]
		value['locationInfo']['targetLat'] = targetLats[eachRoute]
		value['locationInfo']['targetLon'] =  targetLons[eachRoute]
		value['locationInfo']['distance'] =  dist_miles[eachRoute]
		value['historical'] = {}
		value['historical']['loss'] =historical_loss[eachRoute]
		value['historical']['latency'] = historical_latency[eachRoute]
		value['current'] = {}
		value['current']['loss'] = current_loss[eachRoute]
		value['current']['latency'] = current_latency[eachRoute]
		value['current']['loss_deviation_score'] = loss_deviation_score[eachRoute]
		value['current']['latency_deviation_score'] = latency_deviation_score[eachRoute]
		value['hops'] = {}

		fakeHopsName = ""
		for fakeHops in range(1, 20):

			fakeHopsName = 'hop' + str( fakeHops )

			value[ 'hops' ][ fakeHopsName ]           = {}
			value[ 'hops' ][ fakeHopsName ][ 'RTT' ]  = random.randint( 1, 50 )
			value[ 'hops' ][ fakeHopsName ][ 'IP' ]   = "." . join( map( str, ( random.randint( 1, 254 ) for _ in range( 4 ) ) ) )
			value[ 'hops' ][ fakeHopsName ][ 'loss' ] = random.randint( 1, 100 )

		r.hmset( "live_routes_info", { key : json. dumps( value ) } )

########################################################################################
#########################################################################################
#EXECUTE FUNCTIONS
pick_source_city()
pick_target_cities()
getIPs()
calc_haversine_distance()
make_historical_vals()
make_current_vals()

#populate_live_target_routes_for_map_collection() #on redis-cli, query for all by:    sscan live_target_routes_for_map 0 match *
#on redis-cli, query for
populate_live_routes_collection()
  