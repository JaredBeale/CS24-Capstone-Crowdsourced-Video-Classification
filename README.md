# Crowdsourced Video Classification
This is a web application designed to be deployed to Heroku. It allows users to view videos from a library of clips and classify them by given labels. Here is a link to the live deployed code: https://crowd-video-classification.herokuapp.com/

## How to run files in a dev server and develop live
1. Clone the repo.
2. In terminal, make sure to set the ENV varible found in the heroku website to connect to the database. Command: ```export DATABASE_URL=<value from Heroku>``` or in windows ```set DATABASE_URL=<value from Heroku>``` (You only need to do this once).
3. Run `npm install` in the root folder.
4. Go to the client folder: `cd client`.
5. Run `npm install`, then `npm run build`.
6. Go back to the root folder `cd ..`.
7. Run `npm start` to run the node server, which also delivers the front end.
8. Navigate to `localhost:9000` in the web browser to use the application.

## How to run the tests
1. Set up PostgreSQL to work in your shell, with a database named `testdb` owned by user postgres with blank password. This may be a complicated process and will differ based on your operating system and your shell. The back end tests require this, but the front end tests do not.
2. From the root folder of the project, `npm run test` to run backend tests. Note that the front end tests will also run, but will fail.
3. Go to the client folder `cd client`.
4. `npm run test` to run frontend tests. Note that this will open an application, you must press `a` to run all tests in the suite, then `q` to exit the application.
