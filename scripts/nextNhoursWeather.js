const WeatherForTimeZones = require("./timeZone");
const WeatherIns = new WeatherForTimeZones();

process.on("message", (r) => {
	const response = nextNhoursWeather(r.cityDTN, r.hours, r.weatherResult);

	process.send(response);
	process.exit();
});

const nextNhoursWeather = (cityTDN, hours, lastForecast) => {
	return WeatherIns.nextNhoursWeather(cityTDN, hours, lastForecast);
};
module.exports = nextNhoursWeather;
