l = []

d = {}

# d['angry'] = 0
# d['disgust'] = 0
# d['fear'] = 0
# d['happy'] = 0
# d['neutral'] = 0
# d['sad'] = 0
# d['surprise'] = 0

for x in l:
    if x not in d.keys:
        d[x]=1
    else:
        d[x]+=1
    
res = max(d, key=d.get)
# emotion_list = sorted(d, key=d.get, reverse=True)

if res=='happy':
    c = 5
elif res=='neutral':
    c = 4
elif res=='surprise':
    c = 3
elif res=='angry' or res=='disgust':
    c = 2
else:
    c = 1
    
for x in d.keys:
    print(x , d[x]/len(l)*100)