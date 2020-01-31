# Crowdsourced Video Classification
This is a web application designed to be deployed to Heroku. It allows users to view videos from a library of clips and classify them by given labels.

## How to run files in a dev server and develop live
1. Clone the repo.
2. In terminal, make sure to set the ENV varible found in the heroku website to connect to the database. Command: ```export DATABASE_URL=<value from Heroku>``` or in windows ```set DATABASE_URL=<value from Heroku>``` (You only need to do this once).
3. In terminal, go to file path and run ```npm install``` in the root folder.
4. In the same terminal, run ```npm start``` to get the server running.
5. Then open another terminal window and go to the client folder by doing ```cd client``` and then run ```npm install``` 
6. Then run ```npm start``` and go to http://localhost:3000 to open the website.
