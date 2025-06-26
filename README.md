Web Learning Dvorak

This project is a web-based game that assists users with learning Dvorak.

Game Summary
There will be 100 random words, numbers and punctuation displayed to begin game.
The game will start as soon as user begins typing.
The game can be restarted when browser is refreshed.
The game will end when user completes last word.
End of game will display amount of seconds it takes user to play.

Requirements
Initially, assume user has Dvorak. Later, build display of Dvorak keys and provide map of QWERTY to Dvorak.
Initially, do not provide analysis of game total length (comparing runs).
Each character will need to be evaluated. If it's good mark as green, incorrect is marked as red.

What tech?
Lightweight FE
 1. HTML and vanilla JS
 2. JS fetch - 100 words
 3. Input validation
Personal use, max of 5 users
API
 1. MIT request for 10000 words (this can happen in FE)

Design
HTML file
 a. Summary
 b. Form
 c. CSS to color char
JS file
 a. Make initial api request
 b. How to add punctuation and numbers?
 c. validation of form

Where to host?
Raspberry Pi 3 Model 3+
Installing Nginx (most popular, lightweight web server--considered lighttpd)
`sudo apt-get install nginx`
Configuring the Web Server
`/etc/nginx/sites-available/`

Client connection to Pi via local network IP

TODO: DNS




