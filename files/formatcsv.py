import csv 

csvlist = []
with open('test.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for row in spamreader:
        datestr = row[3]
        namestr = row[1]
        categorystr = row[2]
        valuestr = row[4]
        datestr = datestr.replace("/", "-")
        
        obj = {"date":datestr,"name":namestr,"category":categorystr,"value":valuestr}
        csvlist.append(obj)
