

import csv 
from datetime import datetime
from time import strptime
from typing import final
from dateutil import rrule
from time import mktime


import bisect 


def listprint(l):
    for i in l:
        print(i)

def csvprint(listdict):
    print('date,name,category,value')
    for i in listdict:
        print(i['date']+","+i['name']+","+i['category']+","+ str(i['value']))
input_file = csv.DictReader(open("datasetex0-2.csv"))

movie_list = []
for row in input_file:
    #print(row)
    #print(row['release_date'])
    movie = {}
    movie["title"] = row["title"]
    #print(row["genres"].split("-"))
    movie["genres"] = row["genres"].split("-")

    movie["date"] = datetime.fromtimestamp(mktime(strptime(row['release_date'],"%Y/%m/%d") ))
    movie["revenue"] = int(row["revenue"])
    movie_list.append(movie)
    #row['release_date'] = strptime(row['release_date'],"%Y/%m/%d")


movie_list = sorted(movie_list, key=lambda d: d['date'])

#print(newlist[0])

# import necessary packages
 
# dates

max_number_movies = 15
start_date = datetime(1990, 1, 1)
end_date = datetime(2022, 6, 1)

movie_index = 0
genre_queue = {}

final_list = []


for dt in rrule.rrule(rrule.MONTHLY, dtstart=start_date, until=end_date):
    if movie_index == len(movie_list)-1:
        break
    while (movie_list[movie_index]['date']  < dt):
        if movie_index == len(movie_list)-1:
            break
        cur_movie = movie_list[movie_index]
        for genre in cur_movie["genres"]:
            if genre not in genre_queue:
                genre_queue[genre] = 0
            genre_queue[genre] += cur_movie["revenue"]

        movie_index+=1
    
    for genre in genre_queue.keys():
        print(dt.strftime("%Y-%m-%d") + ","+str(genre)+","+str(genre)+","+str(genre_queue[genre]))
