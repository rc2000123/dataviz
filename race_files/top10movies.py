

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
    movie["genres"] = row["genres"].split("-")[0]

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
top_movie_queue = []

final_list = []


while len(top_movie_queue) < max_number_movies:
    top_movie_queue.append(movie_list[movie_index])
    movie_index+=1
top_movie_queue = sorted(top_movie_queue, key=lambda d: d['revenue']) 
#listprint(top_movie_queue)


for dt in rrule.rrule(rrule.MONTHLY, dtstart=start_date, until=end_date):
    #print(dt)
    while (movie_list[movie_index]['date']  < dt):
        cur_movie = movie_list[movie_index]
        #print(movie_list[movie_index])
        if(cur_movie['revenue'] >  top_movie_queue[0]['revenue']):
            #print("inserting new movie")
            top_movie_queue.pop(0)
            i = 0
            while cur_movie['revenue'] >  top_movie_queue[i]['revenue']:
                i+=1
                if i == max_number_movies-1:
                    break
            top_movie_queue.insert(i,cur_movie)

            #listprint(top_movie_queue)
        #input()
            
        
        movie_index+=1
        if(movie_index == len(movie_list)):
            break
    #listprint(top_movie_queue)
    for movie in top_movie_queue:
        finalmovie = {}
        finalmovie['date'] = dt.strftime("%Y-%m-%d")
        finalmovie['name'] = movie['title']
        finalmovie['category'] = movie['genres']
        finalmovie['value'] = movie['revenue']
        final_list.append(finalmovie)

csvprint(final_list)
