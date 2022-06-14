

import csv 



import bisect 


def listprint(l):
    for i in l:
        print(i)

def csvprint(listdict):
    print('date,name,category,value')
    for i in listdict:
        print(i['date']+","+i['name']+","+i['category']+","+ str(i['value']))
input_file = csv.DictReader(open("datasetex0-2.csv"))
print("Genre,Budget,Profit")
genre_dict = {}
for row in input_file:

    genre_list= row["genres"].split("-")
    #print(genre_list)
    for genre in genre_list:
        if genre not in genre_dict:
            genre_dict[genre] = {"totalrevenue":0,"totalbudget":0}
        

        genre_dict[genre]["totalrevenue"] += int(row["revenue"])
        genre_dict[genre]["totalbudget"] += int(row["budget"])

#print(genre_dict)
for item in genre_dict.keys():
    #print(item)
    cur_dict = genre_dict[item]
    print(str(item)+ "," + str(cur_dict["totalbudget"]) +  "," + str(cur_dict["totalrevenue"] - cur_dict["totalbudget"]))