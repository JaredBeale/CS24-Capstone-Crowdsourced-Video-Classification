# CS24-Crowdsourced-Video-Classification
Web application to crowdsource the effort to associate emotion labels with video clips.

Xandr, an AT&T company, wants to build a machine learning algorithm to identify emotion in video content. The first step is the collection of a large set of labeled data. This application is designed to facilitate gathering such information by allowing users to view and label video clips.

## Install
This module requires use of a PostgreSQL database. Create a local one or use an external one.
```
export DATABASE_URL=<your PostgreSQL database URL>
npm install
cd client
npm install
npm run build
cd ..
```

## Usage
```
npm start
```
Note: This will start a Node server, navigate to http://localhost:9000 to use the application.

## Contributing
This repository is no longer accepting contributors.

## License
UNLICENSED
