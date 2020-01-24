# Crowdsourced Video Classification
This is a web application designed to be deployed to Heroku. It allows users to view videos from a library of clips and classify them by given labels.

## How to run files
1. Clone the repo.
2. In terminal, go to file path and run ```npm install``` in the root folder.
3. Then ```npm run heroku-postbuild``` which will make a build file of all the client files for the server.
4. Then make sure to set the ENV varible found in the heroku website to connect to the database. Command: ```export DATABASE_URL=<value from Heroku>``` or in windows ```set DATABASE_URL=<value from Heroku>``` (You only need to do this once).
5. Then run ```npm start``` and go to http://localhost:9000 to open the website.
