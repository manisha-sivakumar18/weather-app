var express = require("express");
var http = require("http");
var fs = require("fs");
var url = require("url");
var bodyParser = require("body-parser");
var timeZones = require("./timeZone.js");
const { fork } = require("child_process");

let app = express();
const host = "localhost";
const port = 8000;

let weatherResult = [];
let startTime = new Date();
let dayCheck = 14400000;
var path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/index.html", express.static(path.join(__dirname)));

app.get("/", (req, res) => {
	var city = req.query.city;
	const childProcess = fork("./timeForOneCity.js");
	if (city && req.method === "GET") {
		childProcess.send(city);
		childProcess.on("message", (message) => {
			res.json(message);
		});
	} else {
		res.status(404).json({ Error: "Not a valid endpoint" });
	}
});

app.post("/hourly-forecast", (req, res) => {
	console.dir(req.body);
	const childProcess = fork("./nextNhoursWeather.js");
	let r = {};
	r.cityDTN = req.body.city_Date_Time_Name;
	r.hours = req.body.hours;
	r.weatherResult = weatherResult;

	if (r.cityDTN && r.hours) {
		childProcess.send(r);
		childProcess.on("message", (message) => {
			res.json(message);
		});
	} else {
		res.status(404).json({ Error: "Not a valid endpoint" });
	}
});

app.get("/all-timezone-cities", (req, res) => {
	let currentTime = new Date();
	const childProcess = fork("./allTimeZones.js");
	if (currentTime - startTime > dayCheck) {
		startTime = new Date();
		childProcess.send("");
		childProcess.on("message", (message) => {
			console.log(weatherResult);
			weatherResult = message;
			res.json(weatherResult);
		});
	} else {
		if (weatherResult.length == 0) {
			childProcess.send("");
			childProcess.on("message", (message) => {
				weatherResult = message;
				res.json(weatherResult);
			});
		} else res.json(weatherResult);
	}
});

app.listen(port, () => {
	console.log(`Server is running on http://${host}:${port}`);
});
