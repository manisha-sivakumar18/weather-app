const WeatherForTimeZones = require("./timeZone");
const WeatherIns = new WeatherForTimeZones();
// export functions
process.on("message", (message) => {
	const response = allTimeZones();
	console.log(response);
	process.send(response);
	process.exit();
});

const allTimeZones = () => {
	return [
		WeatherIns.getWeather("Nome", "America/Nome", -19, 10), //@params cityName,TimeZone,minTemperature,maxTemperature
		WeatherIns.getWeather("NewYork", "America/New_york", 1, 25),
		WeatherIns.getWeather("Jamaica", "America/Jamaica", 22, 31),
		WeatherIns.getWeather("LosAngeles", "America/Los_Angeles", 19, 26),
		WeatherIns.getWeather("Winnipeg", "America/Winnipeg", 2, 35),
		WeatherIns.getWeather("Juba", "Africa/Juba", 10, 45),
		WeatherIns.getWeather("Maseru", "Africa/Maseru", 15, 50),
		WeatherIns.getWeather("London", "Europe/London", -16, 38),
		WeatherIns.getWeather("Vienna", "Europe/Vienna", -2, 35),
		WeatherIns.getWeather("Moscow", "Europe/Moscow", 8, 20),
		WeatherIns.getWeather("Dublin", "Europe/Dublin", 2, 50),
		WeatherIns.getWeather("Karachi", "Asia/Karachi", 19, 32),
		WeatherIns.getWeather("Kolkata", "Asia/Kolkata", 20, 37),
		WeatherIns.getWeather("Yangon", "Asia/Yangon", 20, 39),
		WeatherIns.getWeather("BangKok", "Asia/BangKok", 26, 36),
		WeatherIns.getWeather("Seoul", "Asia/Seoul", 1, 23),
		WeatherIns.getWeather("Anadyr", "Asia/Anadyr", -23, 1),
		WeatherIns.getWeather("BrokenHill", "Australia/Broken_Hill", 7, 20),
		WeatherIns.getWeather("Perth", "Australia/Perth", 5, 24),
		WeatherIns.getWeather("Auckland", "Pacific/Auckland", 10, 20),
		WeatherIns.getWeather("Vostok", "Antarctica/Vostok", -54, -70),
		WeatherIns.getWeather("Troll", "Antarctica/Troll", -50, -72),
	];
};
module.exports = {
	allTimeZones,
};
