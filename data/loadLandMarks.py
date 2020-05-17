"""
Python Script loadLandMarks.py can be used to massively load Objects for the Landmarks collection
It expects to read a local file in CWD named as "DubaiLandmarks.json". The format of the file should be a valid JSON format
"""
import json
import requests

with open("./DubaiLandmarks.json", "r", encoding="utf-8") as read_file:
   landMarks = json.load(read_file)

endpoint = 'parse/classes/Landmarks'
PARSE_IP   = 'localhost'
PARSE_PORT = '5000'
url = 'http://{}:{}/{}'.format(PARSE_IP, PARSE_PORT, endpoint)
headers = {
      "X-Parse-Application-Id": "NqqPKd9Mzzdk0Es6P7NdzXOXNb4tsqdq6Q8p0cZi",
      "Content-Type": "application/json"
   }

for landmark in landMarks:
   response = requests.post(url = url, data = json.dumps(landmark), headers=headers)