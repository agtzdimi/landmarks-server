"""
Python Script loadLandMarks.py is used to initialize a newly created travel blog server
Thes script initialize the users "admin" & "guest" for the front-end application/json and creates the class schema to store the landmarks.
The class name is defined in the .env file on Project's root
The script can be used to massively load Objects for the Landmarks collection
It expects to read a local file passed with an argument. The format of the file should be a valid JSON format

Example run:

python3.6 loadLandMarks.py --dataFile ./data/DubaiLandmarks.json --classSchema ./data/landmarksClassSchema.json
"""
import json
import requests
import argparse
from dotenv import load_dotenv
load_dotenv()
import os

parser = argparse.ArgumentParser()
parser.add_argument("--dataFile", required=True,
   help="Data file having the landmark JSON")
parser.add_argument("--classSchema", required=True,
   help="JSON file having the class schema to be defined")
args = vars(parser.parse_args())

dataFile = args['dataFile']
classFile = args['classSchema']

headers = {
      "X-Parse-Application-Id": os.getenv("APP_ID"),
      "X-Parse-Master-Key": os.getenv("MASTER_KEY"),
      "Content-Type": "application/json"
   }
PARSE_IP   = 'localhost'
PARSE_PORT = os.getenv("SERVER_PORT")

endpoint = 'users'
url = '{}/{}'.format(os.getenv("PUBLIC_SERVER_URL"), endpoint)

startingMessage = """
Starting Configuration...
All Status Codes should be with code 200 or 201

Creating Guest User...

"""
print(startingMessage)
response = requests.post(url = url, data = json.dumps({"username":"guest","password":"guest"}), headers=headers)
print(response.status_code)
print("Creating Admin User...")
print("")
response = requests.post(url = url, data = json.dumps({"username":"admin","password":"admin","ACL":{"*":{"read":"true","write":"true"}}}), headers=headers)
print(response.status_code)

endpoint = 'schemas/'+ os.getenv("LANDMARK_CLASS_NAME")
url = '{}/{}'.format(os.getenv("PUBLIC_SERVER_URL"), endpoint)
with open(classFile, "r", encoding="utf-8") as read_file:
   classObj = json.load(read_file)

classObj['className'] = os.getenv("LANDMARK_CLASS_NAME")

print("Creating Class Schema...")
print("")
response = requests.post(url = url, data = json.dumps(classObj), headers=headers)
print(response.status_code)

with open(dataFile, "r", encoding="utf-8") as read_file:
   landMarks = json.load(read_file)

endpoint = 'classes/'+ os.getenv("LANDMARK_CLASS_NAME")
url = '{}/{}'.format(os.getenv("PUBLIC_SERVER_URL"), endpoint)
print("Populating Class with data file...")
print("")
for landmark in landMarks:
   response = requests.post(url = url, data = json.dumps(landmark), headers=headers)
   print(response.status_code)
   print("")