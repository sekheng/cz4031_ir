# Getting Started with Create React App

## Available Scripts

In the project directory, you can run:

### `npm install`

If project failed to start or to build the program from scratch, run it in the terminal at the project directory.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# Start the backend

## Required Installation

Ensure that Docker Desktop is installed locally.

Install all the necessary packages to run the main.py for frontend and backend.

### `cd backend`

### `docker compose -d up`

To start the backend flask server and the SOLR.

# Start the other frontend

### `python frontend/main.py`

Open [http://localhost:5001](http://localhost:5001) to view it in your browser

# CORS Policy

If the console outputs CORS error, ensure that the CORS Unblock plugin for your browser is installed to fix this error.
https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino
