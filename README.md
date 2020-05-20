# travel-blog-server

## Introduction

Travel Blog Server project was initially cloned from: [parse-server](https://github.com/ParsePlatform/parse-server)
The Project is using ExpressJS module to expose an API for [Travel Blog](https://github.com/agtzdimi/travel-blog)

The main purpose of the server is to facilitate the Travel Blog Graphical User Interface (GUI) to retrieve a list of the
registered assets in the MongoDB storage. Furthermore, the server supports the uploading of images which will be saved as
Parse Files in the MongoDB.

## Prerequisites

The Node.JS version used for this Project is `10.16.0`
The npm version is: `6.5.0`
Parse server `v2.7.4`
Parse SDK `1.1.1`
MongoDB Atlas does not support on its free edition the `v3.6`
In essence, a local MongoDB should be installed `v3.6`. The newest versions (v4+) will produce errors in certain system functionalities and should be avoided

## Installation

### Clone Repository

`git clone https://github.com/agtzdimi/travel-blog-server`

### MongoDB

To install mongoDB `v3.6` execute in Ubuntu 18.04 (Bionic Beaver):

- `sudo apt update`
- `sudo apt install mongodb`
- `sudo systemctl start mongodb`
- `sudo systemctl status mongodb`

### Environment file

Create a file named `.env` to store your server's configuration. The following fields are the mandatory configuration for the file:

- DB_URI -> The MongoDB URI
- APP_ID -> The Application ID
- MASTER_KEY -> Your Master Key
- PUBLIC_SERVER_URL -> The parse server URL for example (http://localhost:5000/parse)
- SERVER_URL -> The server URL for example (http://localhost:5000)
- SERVER_PORT
- PARSE_MOUNT -> The parse endpoint for example ('/parse')
- LANDMARK_CLASS_NAME -> The class name where the landmarks will be installed
- PHOTO_WIDTH -> The thumbnail photo_width. Highly suggested to be used with 250px width, as the development is done with that resolution
- PHOTO_HEIGHT -> The thumbnail photo_width. Highly suggested to be used with 250px height, as the development is done with that resolution
- APP_NAME -> The Application Name
- ADMIN_USER -> The user that will be defined for the parse dashboard
- ADMIN_PASSWORD -> The password of parse dashboard user

### Starting parse server

Install modules/libraries: `npm i`

Start the server with: `npm start`

### Python Installation Script

After the installation/configuration of mongoDB and .env the server should have already started and have a functional session.
To smooth the installation of the TravelBlog application a python script has been implemented to create the necessary users/permissions and store the landmarks information
The python script utilizes the Parse REST API to create a class schema (MongoDB collection) needed for storing the data and populate it.

To use the python script the following packages should be installed:

- `sudo pip3.6 install python-dotenv`
- `sudo pip3.6 install argparse`
- `sudo pip3.6 install requests`

The python script needs 2 input files:

- The datafile with the Landmarks basic information:

  - `title`
  - `description`
  - `location` (array of coordinates \[lat,lon\])
  - `short_info`
  - `url`
  - `order` the order number it should appear

- The class schema where all the above fields are defined with their types and also the `photo_thumb` and `photo` fields are defined as Parse Files

Example call:
`python3.6 loadLandMarks.py --dataFile ./data/DubaiLandmarks.json --classSchema ./data/landmarksClassSchema.json`

### Parse Dashboard

The application does also contain the Parse dashboard available in SERVER_URL/dashboard path. The username:password by default is admin:admin
We can login (locally, remote sessions does not work without an SSL) in Dashboard and check that the Python script worked and installed the data

## Acknowledgments

Official Parse Server (Javascript SDK) Documentation: [Link](https://docs.parseplatform.org/js/guide/)

Read the full Parse Server guide here: [Github Link](https://github.com/ParsePlatform/parse-server/wiki/Parse-Server-Guide)

The forked repo can be found in: [parse-server](https://github.com/ParsePlatform/parse-server)

Parse Dashboard Specifications: [Github Link](https://github.com/parse-community/parse-dashboard)

A useful article for sharp and multer to upload images: [Link](https://bezkoder.com/node-js-upload-resize-multiple-images/)
