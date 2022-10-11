class BaseCityConstructor {
	constructor(city) {
		this.city = city;
	}
	// BaseCityConstructor.prototype.constructor = function (city) {
	// 	this.city = city;
	// };
	/**
	 * @description To get the hour state i.e AM/PM
	 * @param {string} am hour state i.e AM/PM
	 * @param {number} hour current hour
	 * @return {Array} Array of converted hour and hourstate
	 */
	getHourState(hour) {
		let am = "AM";
		if (hour >= 12) {
			am = "PM";
			hour = hour % 12 || 12;
		}
		return [hour, am];
	}
	/**
	 * @description Conversts single digit numbers to double digit by adding '0'
	 * @param {number} num The number to be converted
	 * @return {string} Converted double digit number
	 */
	get2dig(num) {
		if (num < 10) return "0" + num;
		return "" + num;
	}
	/**
	 * @description Get which icon to be displayed for current temperature
	 * @param {number} temp temperature
	 * @return {string} icon to be displayed
	 */
	getWeather(temp) {
		let weather;
		if (temp < 18) weather = "rainyIcon";
		else if (temp <= 22) weather = "windyIcon";
		else if (temp <= 29) weather = "cloudyIcon";
		else weather = "sunnyIcon";
		return weather;
	}
}

class topCity extends BaseCityConstructor {
	constructor(city) {
		super(city);
	}
	/**
	 * @description Generates live time of the selected city
	 * @param {string} tz Timezone of current city
	 * @param {Array} nextFiveHrs Array with weather forecast of next five hours
	 * @param {number} tempC Current temperature of the city
	 * @return {Function} updateTime updates the time details in top section
	 */
	liveTime(tz, nextFiveHrs, tempC) {
		clearTimeout(timeout);
		const that = this;
		//Get the elements that have to be updated
		let date = document.getElementById("date");
		let time = document.getElementById("time");
		let hourState = document.getElementById("hourState");
		const month = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		/**
		 * @description Updates the date and time in the top section. Called every 1000ms to update time details every second
		 */
		return function updateTime() {
			let dateAndTime = new Date();
			//Get the local time of selected city
			dateAndTime = new Date(
				dateAndTime.toLocaleString("en", { timeZone: tz })
			);
			let hour = dateAndTime.getHours();
			let min = dateAndTime.getMinutes();
			let sec = dateAndTime.getSeconds();
			let hour12;
			let am;
			[hour12, am] = that.getHourState(hour);

			//Update the time
			date.innerHTML = `${dateAndTime.getDate()}-
					${month[dateAndTime.getMonth()]}-
					${dateAndTime.getFullYear()}`;
			time.innerHTML = `${that.get2dig(hour12)}:${that.get2dig(min)}:`;
			var span = document.createElement("span");
			span.innerText = that.get2dig(sec);
			time.appendChild(span);
			hourState.src = `./assets/General-Images/${am.toLowerCase()}State.svg`;
			that.updateForecast(nextFiveHrs, tempC, hour);

			//To update time every second, function is called recurrsively
			timeout = setTimeout(updateTime, 1000);
		};
	}
	/**
	 * @description Get all the elements that have to be updated
	 * @return {Object} Object storing all the required elements
	 */
	getElements() {
		console.log(this);
		const valueObj = {};
		valueObj["icon"] = document.getElementById("city-img-icon");
		valueObj["date"] = document.getElementById("date");
		valueObj["time"] = document.getElementById("time");
		valueObj["hourState"] = document.getElementById("hourState");
		valueObj["tempC"] = document.getElementById("temp-in-c");
		valueObj["tempF"] = document.getElementById("temp-in-f");
		valueObj["humidity"] = document.getElementById("humidity");
		valueObj["precipitation"] = document.getElementById("precipitation");
		valueObj["forecast"] = document.getElementById("forecast");
		return valueObj;
	}
	addCityDetails() {
		this.city.cityIcon = {};
		this.city.cityIcon.src = `./assets/Icons-for-cities/${this.city.cityName.toLowerCase()}.svg`;
		this.city.cityIcon.alt = `${this.city.cityName} Icon`;
		this.city.month = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		this.city.tempC = `${this.city.temperature}`;
		this.city.tempF = `${(parseInt(this.city.temperature) * 1.8 + 32).toFixed(
			1
		)}°F`;
		this.city.humidity = `${parseInt(this.city.humidity)}`;
		this.city.precipitation = `${parseInt(this.city.precipitation)}`;
	}
	populateDet() {
		console.log(this);
		const valueObj = this.getElements();
		const that = this;
		return {
			value: function () {
				console.log(that.city);
				console.log(that.city.cityName);
				valueObj.icon.src = that.city.cityIcon.src;
				valueObj.icon.alt = that.city.cityIcon.alt;
				valueObj.tempC.textContent = that.city.tempC;
				valueObj.tempF.textContent = that.city.tempF;
				valueObj.humidity.textContent = that.city.humidity;
				valueObj.precipitation.textContent = that.city.precipitation;
				that.liveTime(
					that.city.timeZone,
					that.city.nextFiveHrs,
					parseInt(that.city.tempC)
				)();
			},
			error: function () {
				document.getElementById("city").style.backgroundColor =
					"var(--bg-input-box-error)";
				document.getElementById("city").style.border =
					"1px solid var(--bright-red-border)";
				valueObj.icon.src = `assets/General-Images/warning.svg`;
				valueObj.date.textContent = "NIL";
				valueObj.time.textContent = "NIL";
				valueObj.hourState.src = `assets/General-Images/warning.svg`;
				valueObj.tempC.textContent = "NIL";
				valueObj.tempF.textContent = "NIL";
				valueObj.humidity.textContent = "NIL";
				valueObj.precipitation.textContent = "NIL";
				valueObj.forecast.textContent = "";
				let div = that.addForecast("NIL", "NIL", "time-forecast");
				valueObj.forecast.appendChild(div);
				for (let i = 0; i < 5; i++) {
					let div1 = that.addForecast(
						"&nbsp;",
						"&nbsp;",
						"time-forecast-middle"
					);
					valueObj.forecast.appendChild(div1);
					let div = that.addForecast("NIL", "NIL", "time-forecast");
					valueObj.forecast.appendChild(div);
				}
				clearTimeout(timeout);
			},
		};
	}
	/**
	 * @description To create forecast element
	 * @param {number} time Forecast time
	 * @param {*} temp Forecast temperature
	 * @param {string} type type of element i.e. value element of middle empty element
	 * @return {*} The created forecast element
	 */
	addForecast(time, temp, type) {
		let div = document.createElement("div");
		div.className = `${type} flex-column`;
		let p1 = document.createElement("p");
		p1.innerHTML = time;
		let p2 = document.createElement("p");
		p2.innerHTML = "|";
		let p3 = document.createElement("p");
		if (type == "time-forecast") {
			let img = document.createElement("img");
			if (temp == "NIL") {
				img.src = `./assets/General-Images/warning.svg`;
				img.alt = "warning";
			} else {
				let icon = this.getWeather(temp);
				img.src = `./assets/Weather-Icons/${icon}.svg`;
				img.alt = icon;
			}
			p3.appendChild(img);
		} else p3.innerHTML = "&nbsp;";
		let p4 = document.createElement("p");
		p4.innerHTML = temp;
		div.appendChild(p1);
		div.appendChild(p2);
		div.appendChild(p3);
		div.appendChild(p4);
		return div;
	}
	/**
	 * @description Update the forecast of next five hours in the top section
	 * @param {*} nextFiveHrs temperature of next five hours
	 * @param {*} tempC current temperature
	 * @param {*} hour current hour
	 */
	updateForecast(nextFiveHrs, tempC, hour) {
		let forecast = document.getElementById("forecast");
		forecast.textContent = "";
		let div = this.addForecast("NOW", parseInt(tempC), "time-forecast");
		forecast.appendChild(div);
		let nexthour = parseInt(hour);
		let am;
		nextFiveHrs.forEach((temp) => {
			nexthour++;
			[nexthour, am] = this.getHourState(nexthour);

			let div1 = this.addForecast("&nbsp;", "&nbsp;", "time-forecast-middle");
			forecast.appendChild(div1);

			let div = this.addForecast(
				`${nexthour}${am}`,
				parseInt(temp),
				"time-forecast"
			);
			forecast.appendChild(div);
		});
	}
	updateTopSection() {
		const populate = this.populateDet();
		if (this.city == "Nil") {
			populate.error();
		} else {
			this.addCityDetails();
			populate.value();
		}
	}
}
// topCity.__proto__ = BaseCityConstructor;
var timeout;

// const obj = new topCity("hi");
// console.dir(obj);

function getOpt() {
	const opt = document.getElementById("city").value.toLowerCase();

	if (opt in data) {
		const obj = new topCity(data[opt]);
		console.dir(obj);
		obj.updateTopSection();
		//populate.value(cityDet);
	} else {
		const obj = new topCity("Nil");
		console.log(obj);
		obj.updateTopSection();
		//populate.error();
	}
}
