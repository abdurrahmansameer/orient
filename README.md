# ORIENT 1.0
## A simple chrome extention that helps you ORIENT yourself towards acheiving your tasks faster
#### Video Demo:  https://www.youtube.com/watch?v=68wU7kAV4X0

#### Problem Statement
It was during the pandemic that I had my very first online learning experience. As online learning is becoming quite important I wanted to solve a few problems that I had. I struggled with managing my tasks and managing my deadlines, but most of all I kept getting distracted.
So I built ORIENT

#### Features
Orient has a simple Todo List, where you can add a task and assign a type.
To remember the amount of tasks you have, you will be notified at 12 noon with the amount of tasks you have.
Orient can also block websites to help you focus.
Everytime you spend more than 10 minutes on any social media platform, Orient will remind you to get back to work.
Orient with the use of [Chart.js](https://www.chartjs.org/) can show you the amount of task you've completed for a week along with focus time.

#### Installation
'Download Zip' from Github.
Visit 'chrome://extensions/' and turn on 'Developer mode'.
Click 'Load unpacked'.
Select the folder you downloaded from GitHub.
Now you are all set!

#### Storage
Orient uses [chrome.storage](https://developer.chrome.com/docs/extensions/reference/storage/) to store all the data in arrays and dictionaries
I used chrome storage because it is easier to store and access data but this cannot be used for relational databases

#### Files

###### manifest.json
Responsible for running the chrome extension
Manifest version: 3
Permissions used: 'tabs', 'notifications', 'storage'
tabs: to access the current tabs URL for blocking websites
notifications: to notify the user
storage: to store data
Service worker: background.js

###### HTML
index.html: The main extention popup
block.html: The block page
blocklist.html: The blocklist page
stats.html: The stats page
todo.html: The todo list page

###### CSS
index.css: Style sheet for the main popup
styles.css: boilerplate style sheet for all the other pages

###### JAVASCRIPT
background.js: This file is responsible for running background functions like blocking websites and initiating notifications
block.js: This file stores and displays the time set by the user and initiates blocking websites
blocklist.js: This file simply stores the hostname of all the urls put in by the user
chart.min.js: This was installed from [Chart.js](https://www.chartjs.org/) and is responsible for the chart in Stats
stats.js: Takes in information and processes it to be fed into Chart.js to display the chart
todo.js: This file is resposible for storing all the tasks with their type and removing/marking them as complete

###### IMAGES
logo.png: The extension icon
trans-logo.png: The icon for notifications
#### Future Improvements
Add in a function to calculate overall efficiency
Develop a better UI
Add a video bookmarking function
Add in more type of chores / allow the user to create custom types
Capability to represent more than a week of data in stats
Manage data in a database instead of chrome storage
