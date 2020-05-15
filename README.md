# CS24-Crowdsourced-Video-Classification

Web application to crowdsource the effort to associate emotion labels with video clips.

This application was developed for the 2019-2020 Oregon State University Computer Science Capstone.
Xandr, an AT&T company, wants to build a machine learning algorithm to identify emotion in video content.
The first step is the collection of a large set of labeled data.
This application is designed to facilitate gathering such information by allowing users to view and label video clips.

## Install
Note that this project uses Node version 10.15.3 and NPM version 6.4.1; it is not guaranteed to work with other versions.
```
git clone https://github.com/JaredBeale/CS24-Capstone-Crowdsourced-Video-Classification.git
cd CS24-Capstone-Crowdsourced-Video-Classification
npm install
cd client
npm install
npm run build
cd ..
```

## Usage

This module requires use of a PostgreSQL database.
Create a local one or use an external one.
This process will vary depending on your operating system and terminal.
Before the application will function correctly, the database must be set up with the proper schema.
This may be done with a command of a form like `psql <database name> -f db/dbSetUp.sql`.
The exact command will vary depending on your postgres set up.
If you are a member of the above-mentioned Capstone class, you may instead contact the repository owner to receive the working database URL.
Once this is complete, execute the following code:

```
export DATABASE_URL=<your PostgreSQL database URL>
npm start
```

Note: This will start a Node server, navigate to http://localhost:9000 to use the application.

## Contributing

This repository is no longer accepting contributors.

## License

[ISC © Jared Beale, Sam Young, and Conner Maddalozzo](./LICENSE)
