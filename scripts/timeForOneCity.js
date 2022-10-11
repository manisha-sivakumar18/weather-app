const WeatherForTimeZones = require("./timeZone");
const WeatherIns = new WeatherForTimeZones();

process.on("message", (city) => {
	const response = timeForOneCity(city);
	process.send(response);
	process.exit();
});

const timeForOneCity = (cityName) => {
	return WeatherIns.getTimeForOneCity(cityName);
};

module.exports = timeForOneCity;
