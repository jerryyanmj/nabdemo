from __future__ import division
import pymongo
import datetime
import random
from datetime import datetime
import time
from pymongo import MongoClient
import redis


client = MongoClient('mongodb://localhost:27017')

r = redis.Redis()

currentTime = datetime.utcnow()
currentTimestamp =  int(time.mktime(currentTime.timetuple()) - time.mktime((1970, 1, 1, 0, 0, 0, 0, 0, 0)))

batch_id = str(currentTime.year) + '-' + str(currentTime.month) + '-' + str(currentTime.day) + '-' + str(currentTime.hour) + '-' + str(currentTime.minute)

deviceTypes  = [ "Browser", "iOS Phone", "iOS Tablet", "Android Phone", "Android Tablet", "Android STB", "Roku" ]
streamTypes  = [ "HLS", "SS" ]
chunkTypes   = [ "Live", "VOD" ]

db = client.default['video_failed_streams']
# db.drop()

total_streaming = random.randrange(305)+3280

for device in deviceTypes:
	for stream in streamTypes:
		for chunk in chunkTypes:

			val_none    = random.randrange(105)+1280
			val_0_1     = random.randrange(105)+125
			val_1_plus  = random.randrange(105)+215
			all_buckets = val_none + val_0_1 + val_1_plus
			post = { "start_datetime_ts"  : currentTimestamp,
         			 "batch_id"           : batch_id,
         			 "device_type"        : device,
         			 "stream_type"        : stream,
         			 "chunk_type"         : chunk,
         			 "none"               : val_none,
         			 "0_1"                : val_0_1,
         			 "1_plus"             : val_1_plus,
         			 "all_buckets"        : all_buckets,
         			 "none_bucket"        : val_none / all_buckets * 100,
         			 "0_1_bucket"         : val_0_1 / all_buckets * 100,
         			 "1_plus_bucket"      : val_1_plus / all_buckets * 100,
         			 "total_failed_events": random.randrange(20)+100,
    				 "total_streaming"	  : total_streaming,
    				 "average_failed_events" : random.randrange(25)+140,
         			 "score"              :  random.randrange(25)+75 }
			db.insert(post)


# print " inserted " + str(db.count()) + " in video_failed_streams"
# print db.find_one()

db = client.default['video_buffering_events']
# db.drop()

for device in deviceTypes:
	for stream in streamTypes:
		for chunk in chunkTypes:

			val_none     = random.randrange(20)+125
			val_0_005    = random.randrange(15)+25
			val_005_01   = random.randrange(15)+25
			val_01_02    = random.randrange(15)+25
			val_02_04    = random.randrange(15)+25
			val_04_plus  = random.randrange(15)+25

			all_buckets = val_none + val_0_005 + val_005_01 + val_01_02 + val_02_04 + val_04_plus
			post = { "start_datetime_ts" : currentTimestamp,
         			 "batch_id"          : batch_id,
         			 "device_type"       : device,
         			 "stream_type"       : stream,
         			 "chunk_type"        : chunk,
         			 "none"              : val_none,
         			 "0_005"             : val_0_005,
					 "005_01"            : val_005_01,
					 "01_02"             : val_01_02,
					 "02_04"             : val_02_04,
					 "04_plus"           : val_04_plus,
         			 "all_buckets"       : all_buckets,
         			 "none_bucket"       : val_none / all_buckets * 100,
         			 "0_005_bucket"      : val_0_005 / all_buckets * 100,
					 "005_01_bucket"     : val_005_01 / all_buckets * 100,
					 "01_02_bucket"      : val_01_02 / all_buckets * 100,
					 "02_04_bucket"      : val_02_04 / all_buckets * 100,
					 "04_plus_bucket"    : val_04_plus / all_buckets * 100,
                     "total_buffering_events": random.randrange(300)+1200,
                     "total_streaming": total_streaming,
                     "average_buffering_events": random.randrange(300)+1050,
         			 "score" : random.randrange(8) + 81 }
			db.insert(post)


# print " inserted " + str(db.count()) + " in video_buffering_events"

db = client.default['video_buffering_duration']
# db.drop()

total_watched_seconds = random.randrange(5000)+15500;

for device in deviceTypes:
	for stream in streamTypes:
		for chunk in chunkTypes:

			val_none    = random.randrange(20)+200
			val_0_05    = random.randrange(4)+20
			val_05_1    = random.randrange(4)+20
			val_1_15    = random.randrange(4)+20
			val_15_3    = random.randrange(4)+20
			val_3_plus  = random.randrange(4)+20

			all_buckets = val_none + val_0_05 + val_05_1 + val_1_15 + val_15_3 + val_3_plus
			post = { "start_datetime_ts"    : currentTimestamp,
         			 "batch_id"             : batch_id,
         			 "device_type"          : device,
         			 "stream_type"          : stream,
         			 "chunk_type"           : chunk,
         			 "none"                 : val_none,
         			 "0_05"                 : val_0_05,
					 "05_1"                 : val_05_1,
					 "1_15"                 : val_1_15,
					 "15_3"                 : val_15_3,
					 "3_plus"               : val_3_plus,
         			 "all_buckets"          : all_buckets,
         			 "none_bucket"          : val_none / all_buckets * 100,
         			 "0_05_bucket"          : val_0_05 / all_buckets * 100,
					 "05_1_bucket"          : val_05_1 / all_buckets * 100,
					 "1_15_bucket"          : val_1_15 / all_buckets * 100,
					 "15_3_bucket"          : val_15_3 / all_buckets * 100,
					 "3_plus_bucket"        : val_3_plus / all_buckets * 100,
                     "total_buffering_seconds": random.randrange(240)+1300,
                     "total_watched_seconds": total_watched_seconds,
                     "average_buffering_seconds": random.randrange(500)+1500,
         			 "score"                : random.randrange(7) + 70 }
			db.insert(post)


# print " inserted " + str(db.count()) + " in video_buffering_duration"

db = client.default['video_startup']
# db.drop()


for device in deviceTypes:
	for stream in streamTypes:
		for chunk in chunkTypes:

			val_0_25      = random.randrange(80)+640
			val_25_5      = random.randrange(80)+440
			val_5_75      = random.randrange(80)+340
			val_75_10     = random.randrange(80)+240
			val_10_125    = random.randrange(80)+140
			val_125_plus  = random.randrange(80)+40

			all_buckets = val_0_25 + val_25_5 + val_5_75 + val_75_10 + val_10_125 + val_125_plus
			post = { "start_datetime_ts" : currentTimestamp,
                    "batch_id"          : batch_id,
                    "device_type"       : device,
                    "stream_type"       : stream,
                    "chunk_type"        : chunk,
                    "0_25"              : val_0_25,
                    "25_5"              : val_25_5,
                    "5_75"              : val_5_75,
                    "75_10"             : val_75_10,
                    "10_125"            : val_10_125,
                    "125_plus"          : val_125_plus,
                    "all_buckets"       : all_buckets,
                    "0_25_bucket"       : val_0_25 / all_buckets * 100,
                    "25_5_bucket"       : val_25_5 / all_buckets * 100,
                    "5_75_bucket"       : val_5_75 / all_buckets * 100,
                    "75_10_bucket"      : val_75_10 / all_buckets * 100,
                    "10_125_bucket"     : val_10_125 / all_buckets * 100,
                    "125_plus_bucket"   : val_125_plus / all_buckets * 100,
                    "total_startup_seconds": random.randrange(125)+1250,
                    "total_watched_seconds": total_watched_seconds,
                    "average_startup_seconds": random.randrange(115)+1150,
         			 "score"             : random.randrange(8) + 77 }
			db.insert(post)


# print " inserted " + str(db.count()) + " in video_startup"


db = client.default['video_bitrate_downshifts']
# db.drop()

for device in deviceTypes:
	for stream in streamTypes:
		for chunk in chunkTypes:

			val_none     = random.randrange(10)+80
			val_0_01     = random.randrange(25)+25
			val_01_05    = random.randrange(25)+25
			val_05_1     = random.randrange(25)+25
			val_1_2      = random.randrange(25)+25
			val_2_plus   = random.randrange(25)+25

			all_buckets = val_none + val_0_01 + val_01_05 + val_05_1 + val_1_2 + val_2_plus
			post = { "start_datetime_ts" : currentTimestamp,
                    "batch_id"          : batch_id,
                    "device_type"       : device,
                    "stream_type"       : stream,
                    "chunk_type"        : chunk,
                    "none"              : val_none,
                    "0_01"              : val_0_01,
                    "01_05"             : val_01_05,
                    "05_1"              : val_05_1,
                    "1_2"               : val_1_2,
                    "2_plus"            : val_2_plus,
                    "all_buckets"       : all_buckets,
                    "none_bucket"       : val_none / all_buckets * 100,
                    "0_01_bucket"       : val_0_01 / all_buckets * 100,
                    "01_05_bucket"      : val_01_05 / all_buckets * 100,
                    "05_1_bucket"       : val_05_1 / all_buckets * 100,
                    "1_2_bucket"        : val_1_2 / all_buckets * 100,
                    "2_plus_bucket"     : val_2_plus / all_buckets * 100,
                    "total_downshift_event": random.randrange(25)+556,
                    "total_streaming": total_streaming,
                    "average_downshift_event": random.randrange(25)+500,
         			"score"             : random.randrange(7) + 93 }
			db.insert(post)


# print " inserted " + str(db.count()) + " in video_bitrate_downshifts"


db = client.default['video_average_bitrate']
# db.drop()


for device in deviceTypes:
	for stream in streamTypes:
		for chunk in chunkTypes:

			val_0_06     = random.randrange(3)+5
			val_06_09    = random.randrange(3)+5
			val_09_14    = random.randrange(3)+10
			val_14_24    = random.randrange(3)+15
			val_24_34    = random.randrange(3)+30

			all_buckets = val_0_06 + val_06_09 + val_09_14 + val_14_24 + val_24_34
			post = { "start_datetime_ts" : currentTimestamp,
                    "batch_id"          : batch_id,
                    "device_type"       : device,
                    "stream_type"       : stream,
                    "chunk_type"        : chunk,
                    "0_06"              : val_0_06,
                    "06_09"             : val_06_09,
                    "09_14"             : val_09_14,
                    "14_24"             : val_14_24,
                    "24_34"             : val_24_34,
                    "all_buckets"       : all_buckets,
                    "0_06_bucket"       : val_0_06 / all_buckets * 100,
                    "06_09_bucket"      : val_06_09 / all_buckets * 100,
                    "09_14_bucket"      : val_09_14 / all_buckets * 100,
                    "14_24_bucket"      : val_14_24 / all_buckets * 100,
                    "24_34_bucket"      : val_24_34 / all_buckets * 100,
                    "total_bitrate"     : random.randrange(25)+256,
                    "average_bitrate"   : random.randrange(50)+280,
         			 "score"            : random.randrange(10) + 60 }
			db.insert(post)


# print " inserted " + str(db.count()) + " in video_average_bitrate"

r.publish('test_channel',  batch_id)



client.close()
