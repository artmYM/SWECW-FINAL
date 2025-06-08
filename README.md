# SWE CW WIP

# log in creds  
## When logging in, email and password should be set up using phpMyAdmin when running on XAMPP.


# Dependencies
## When cloning the repo, you will be in the SWECW file. Use the command "cd prototype" to be in the prototype file.
## Make sure XAMPP is turned on. Check that MYSQL is on in XAMPP. Check the port number and change the "server.js" file to match the port number at the top. Also, change your database name in the server.js file to the name of the database you have created. 
## The SQL script for creating the database tables is under prototype/src/server/create_database.sql - run this on XXAMP phpmyadmin after creating the database to create tables in the DB. Copy the query in SQL in the top nav bar.
## If you are getting errors, it may be that you have not got the correct dependencies.
## These are all the commands to use to install dependencies: "npm install", "npm install mysql2", "npm install concurrently", "npm install cors"

## Use "npm start" in the terminal to load up the web-app. The web-app and server will load up together. The terminal should say "Connected to MYSQL database" after starting.
## You DO NOT need to run the server.js script as we have used concurrency to load them up at the same time as "npm start".
## If you are getting errors when running "npm start", it is either because you have not changed the server.js file to your system's XAMPP's MYSQL port number, and your name and password aren't the same as your MYSQL server that you have just made using phpmyadmin.
## It may also be because of your dependencies, please check that you have installed all the dependencies, including the ones above and React and node.js
