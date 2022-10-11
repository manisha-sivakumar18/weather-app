(() => {
	const cities = Object.keys(data);
	var list = document.getElementById("citylist");

	cities.forEach(function (item) {
		var option = document.createElement("option");
		option.value = item;
		option.innerText = item;
		list.appendChild(option);
	});
	document.getElementById("city").onchange = () => {
		getOpt();
	};
})();

const getHourState = (am) => {
	return (hour) => {
		if (hour >= 12) {
			am = "PM";
			hour = hour % 12 || 12;
		}
		return [hour, am];
	};
};

const getElements = () => {
	const myobj = {};
	myobj["icon"] = document.getElementById("city-img-icon");
	myobj["date"] = document.getElementById("date");
	myobj["time"] = document.getElementById("time");
	myobj["hourState"] = document.getElementById("hourState");
	myobj["tempC"] = document.getElementById("temp-in-c");
	myobj["tempF"] = document.getElementById("temp-in-f");
	myobj["humidity"] = document.getElementById("humidity");
	myobj["precipitation"] = document.getElementById("precipitation");
	myobj["forecast"] = document.getElementById("forecast");
	return myobj;
};

const getCityDetails = (city) => {
	const cityDet = data[city];
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
	cityDet.dateAndTime = new Date(cityDet.dateAndTime);
	console.log(cityDet);
	let hour = cityDet.dateAndTime.getHours();
	let min = cityDet.dateAndTime.getMinutes();
	let sec = `${cityDet.dateAndTime.getSeconds()}`;
	[cityDet.hour, cityDet.hourState] = getHourState("AM")(hour);
	console.log(`${cityDet.hour}--${cityDet.hourState}`);
	cityDet.date = `${cityDet.dateAndTime.getDate()}-
					${month[cityDet.dateAndTime.getMonth()]}-
					${cityDet.dateAndTime.getFullYear()}`;
	cityDet.min = min;
	cityDet.sec = sec;
	cityDet.time = `${cityDet.hour}:${cityDet.min}:`;
	cityDet.tempC = `${cityDet.temperature}`;
	cityDet.tempF = `${(parseInt(cityDet.temperature) * 1.8 + 32).toFixed(1)}°F`;
	cityDet.humidity = `${parseInt(cityDet.humidity)}`;
	cityDet.precipitation = `${parseInt(cityDet.precipitation)}`;
	console.log(cityDet.hour);
	return cityDet;
};

const addForecast = (currTime, temp, type) => {
	let div = document.createElement("div");
	div.className = `${type} flex-column`;
	let p1 = document.createElement("p");
	p1.innerHTML = currTime;
	let p2 = document.createElement("p");
	p2.innerHTML = "|";
	let p3 = document.createElement("p");
	if (type == "time-forecast") {
		let img = document.createElement("img");
		if (temp == "NIL") {
			img.src = `./assets/General-Images/warning.svg`;
			img.alt = "warning";
		} else {
			let icon = getWeather(temp);
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
};

const getWeather = (temp) => {
	let weather;
	console.log(typeof temp);
	if (temp < 18) weather = "rainyIcon";
	else if (temp <= 22) weather = "windyIcon";
	else if (temp <= 29) weather = "cloudyIcon";
	else weather = "sunnyIcon";
	return weather;
};

const populateDet = () => {};
function getOpt() {
	const opt = document.getElementById("city").value;
	console.log(opt);

	if (opt in data) {
		const cityDet = getCityDetails(opt);
		const myobj = getElements();

		myobj.icon.src = `./assets/Icons-for-cities/${opt}.svg`;
		myobj.icon.alt = `${opt} Icon`;
		myobj.date.textContent = cityDet.date;
		myobj.time.textContent = cityDet.time;
		var span = document.createElement("span");
		span.innerText = cityDet.sec;
		myobj.time.appendChild(span);
		myobj.hourState.src = `./assets/General-Images/${cityDet.hourState.toLowerCase()}State.svg`;
		myobj.hourState.alt = `${hourState} State Icon`;
		myobj.tempC.textContent = cityDet.tempC;
		myobj.tempF.textContent = cityDet.tempF;
		myobj.humidity.textContent = cityDet.humidity;
		myobj.precipitation.textContent = cityDet.precipitation;
		myobj.forecast.textContent = "";
		let div = addForecast("NOW", parseInt(cityDet.tempC), "time-forecast");
		myobj.forecast.appendChild(div);

		let nextFiveHrs = cityDet.nextFiveHrs;
		console.log(nextFiveHrs);
		let nexthour = cityDet.hour;
		nextFiveHrs.forEach((temp) => {
			nexthour++;
			let am = cityDet.hourState;
			[nexthour, am] = getHourState(am)(nexthour);

			let div1 = addForecast("&nbsp;", "&nbsp;", "time-forecast-middle");
			myobj.forecast.appendChild(div1);

			let div = addForecast(
				`${nexthour}${am}`,
				parseInt(temp),
				"time-forecast"
			);
			myobj.forecast.appendChild(div);
		});
	} else {
		const myobj = getElements();
		myobj.icon.src = `assets/General-Images/warning.svg`;
		myobj.date.textContent = "NIL";
		myobj.time.textContent = "NIL";
		myobj.hourState.src = `assets/General-Images/warning.svg`;
		myobj.tempC.textContent = "NIL";
		myobj.tempF.textContent = "NIL";
		myobj.humidity.textContent = "NIL";
		myobj.precipitation.textContent = "NIL";
		myobj.forecast.textContent = "";
		let div = addForecast("NIL", "NIL", "time-forecast");
		myobj.forecast.appendChild(div);
		for (i = 0; i < 5; i++) {
			let div1 = addForecast("&nbsp;", "&nbsp;", "time-forecast-middle");
			myobj.forecast.appendChild(div1);
			let div = addForecast("NIL", "NIL", "time-forecast");
			myobj.forecast.appendChild(div);
		}
	}
}
