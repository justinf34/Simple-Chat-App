# Simple-Chat-App

A simple single-room chat application made using React, Node, Express, Socket.io.

## To run
Install the modules used by the server code by running the commad below in the root directory of the repo.
```
npm install
```
The server should be running on port 8888 in your host machine. To access the application go to `http://localhost:8888`. Make sure that you have cookies on in your browser as this app uses cookies to remember your username.

If you want to edit and make changes to the client-side code, `cd` into the `client` folder and download the modules used by the front end using the command below.
```
npm install
```
After installing the packages, run `npm start` which should start a development server runnin on `http://localhost:3000`. Before you do this, make sure that the server-side code is running.

## Commands
- Users can change their using by typing the `/name <new username> into the textbox.
- Users can change the color of their username using the `/color RRGGBB` command.

## Testing
As of now, this app was only tested in Google Chrome and Mozilla Firefox.
