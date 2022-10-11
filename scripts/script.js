let timeout;

const getHourState = (am) => {
	return (hour) => {
		if (hour >= 12) {
			am = "PM";
			hour = hour % 12 || 12;
		}
		return [hour, am];
	};
};

const updateForecast = (nextFiveHrs, tempC, hour) => {
	let forecast = document.getElementById("forecast");
	forecast.textContent = "";
	let div = addForecast("NOW", parseInt(tempC), "time-forecast");
	forecast.appendChild(div);
	let nexthour = parseInt(hour);
	nextFiveHrs.forEach((temp) => {
		nexthour++;
		[nexthour, am] = getHourState(nexthour);

		let div1 = addForecast("&nbsp;", "&nbsp;", "time-forecast-middle");
		forecast.appendChild(div1);

		let div = addForecast(`${nexthour}${am}`, parseInt(temp), "time-forecast");
		forecast.appendChild(div);
	});
};

const get2dig = (num) => {
	if (num < 10) return "0" + num;
	return num;
};

const liveTime = (tz, nextFiveHrs, tempC) => {
	clearTimeout(timeout);
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

	return function updateTime() {
		let dateAndTime = new Date();
		let option = {};
		option.timeZone = tz;
		dateAndTime = new Date(dateAndTime.toLocaleString("en", option));
		date.innerHTML = `${dateAndTime.getDate()}-
					${month[dateAndTime.getMonth()]}-
					${dateAndTime.getFullYear()}`;
		let hour = dateAndTime.getHours();
		let min = dateAndTime.getMinutes();
		let sec = dateAndTime.getSeconds();
		let am = "AM";
		let hour12;
		[hour12, am] = getHourState(am)(hour);
		time.innerHTML = `${get2dig(hour12)}:${get2dig(min)}:`;
		var span = document.createElement("span");
		span.innerText = get2dig(sec);
		time.appendChild(span);
		hourState.src = `./assets/General-Images/${am.toLowerCase()}State.svg`;
		updateForecast(nextFiveHrs, tempC, hour);
		timeout = setTimeout(updateTime, 500);
	};
};

const getElements = () => {
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
	cityDet.cityIcon = {};
	cityDet.cityIcon.src = `./assets/Icons-for-cities/${cityDet.cityName.toLowerCase()}.svg`;
	cityDet.cityIcon.alt = `${cityDet.cityName} Icon`;
	cityDet.tempC = `${cityDet.temperature}`;
	cityDet.tempF = `${(parseInt(cityDet.temperature) * 1.8 + 32).toFixed(1)}°F`;
	cityDet.humidity = `${parseInt(cityDet.humidity)}`;
	cityDet.precipitation = `${parseInt(cityDet.precipitation)}`;
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
	if (temp < 18) weather = "rainyIcon";
	else if (temp <= 22) weather = "windyIcon";
	else if (temp <= 29) weather = "cloudyIcon";
	else weather = "sunnyIcon";
	return weather;
};

const populateDet = (valueObj) => {
	return {
		value: function (cityDet) {
			valueObj.icon.src = cityDet.cityIcon.src;
			valueObj.icon.alt = cityDet.cityIcon.alt;
			valueObj.tempC.textContent = cityDet.tempC;
			valueObj.tempF.textContent = cityDet.tempF;
			valueObj.humidity.textContent = cityDet.humidity;
			valueObj.precipitation.textContent = cityDet.precipitation;
			liveTime(
				cityDet.timeZone,
				cityDet.nextFiveHrs,
				parseInt(cityDet.tempC)
			)();
		},
		error: function () {
			valueObj.icon.src = `assets/General-Images/warning.svg`;
			valueObj.date.textContent = "NIL";
			valueObj.time.textContent = "NIL";
			valueObj.hourState.src = `assets/General-Images/warning.svg`;
			valueObj.tempC.textContent = "NIL";
			valueObj.tempF.textContent = "NIL";
			valueObj.humidity.textContent = "NIL";
			valueObj.precipitation.textContent = "NIL";
			valueObj.forecast.textContent = "";
			let div = addForecast("NIL", "NIL", "time-forecast");
			valueObj.forecast.appendChild(div);
			for (i = 0; i < 5; i++) {
				let div1 = addForecast("&nbsp;", "&nbsp;", "time-forecast-middle");
				valueObj.forecast.appendChild(div1);
				let div = addForecast("NIL", "NIL", "time-forecast");
				valueObj.forecast.appendChild(div);
			}
			clearTimeout(timeout);
		},
	};
};

function getOpt() {
	const opt = document.getElementById("city").value.toLowerCase();
	const valueObj = getElements();
	const populate = populateDet(valueObj);
	if (opt in data) {
		const cityDet = getCityDetails(opt);
		populate.value(cityDet);
	} else {
		populate.error();
	}
}

(() => {
	const cities = Object.keys(data);
	var list = document.getElementById("citylist");

	cities.forEach(function (item) {
		var option = document.createElement("option");
		option.value = data[item].cityName;
		option.innerText = data[item].cityName;
		list.appendChild(option);
	});
	liveTime("Asia/Kolkata", [1, 2, 3, 4, 5], 1)();
	document.getElementById("city").onchange = () => {
		getOpt();
	};
})();

// Middle section

const filter = (dataArray) => {
	return {
		sunny: () => {
			const midData = dataArray.filter(
				([key, value]) =>
					parseInt(value.temperature) > 29 &&
					parseInt(value.humidity) < 50 &&
					parseInt(value.precipitation) >= 50
			);
			midData.sort(([key, value], [key1, value1]) => {
				return value.temperature - value1.temperature;
			});
			return midData;
		},
		cold: () => {
			const midData = dataArray.filter(
				([key, value]) =>
					parseInt(value.temperature) >= 20 &&
					parseInt(value.temperature) <= 28 &&
					parseInt(value.humidity) > 50 &&
					parseInt(value.precipitation) < 50
			);
			midData.sort(([key, value], [key1, value1]) => {
				return value.precipitation - value1.precipitation;
			});
			return midData;
		},
		rainy: () => {
			const midData = dataArray.filter(
				([key, value]) =>
					parseInt(value.temperature) < 20 && parseInt(value.humidity) >= 50
			);
			midData.sort(([key, value], [key1, value1]) => {
				return value.humidity - value1.humidity;
			});
			return midData;
		},
	};
};

const getCard = (d) => {
	console.log(d);
	d.dateAndTime = new Date();
	const option = {};
	option.timeZone = d.timeZone;
	d.dateAndTime = new Date(d.dateAndTime.toLocaleString("en", option));
	console.log(d.dateAndTime);
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
	const card = document.createElement("div");
	card.className = "card";
	const cardContent = document.createElement("div");
	cardContent.className = "card-content";
	const city = document.createElement("span");
	city.innerHTML = d.cityName;

	const time = document.createElement("span");
	let hour = d.dateAndTime.getHours();
	let min = d.dateAndTime.getMinutes();
	let am = "AM";
	let hour12;
	[hour12, am] = getHourState(am)(hour);
	time.innerHTML = `${get2dig(hour12)}:${get2dig(min)} ${am}`;
	const date = document.createElement("span");
	date.innerHTML = `${d.dateAndTime.getDate()}-
					${month[d.dateAndTime.getMonth()]}-
					${d.dateAndTime.getFullYear()}`;

	const humidity = document.createElement("span");
	let icon = document.createElement("img");
	icon.src = "assets/Weather-Icons/humidityIcon.svg";
	icon.alt = "Humid";
	humidity.appendChild(icon);
	humidity.append(`${d.humidity}`);

	const precipitation = document.createElement("span");
	icon = document.createElement("img");
	icon.src = "assets/Weather-Icons/precipitationIcon.svg";
	icon.alt = "Precipitation";

	precipitation.appendChild(icon);
	precipitation.append(`${d.precipitation}`);

	cardContent.appendChild(city);
	cardContent.appendChild(time);
	cardContent.appendChild(date);
	cardContent.appendChild(humidity);
	cardContent.appendChild(precipitation);

	const weather = document.createElement("span");
	weather.className = "card-weather";
	icon = document.createElement("img");
	const weathericon = getWeather(parseInt(d.temperature));
	icon.src = `assets/Weather-Icons/${weathericon}.svg`;
	icon.alt = "Humid";
	weather.appendChild(icon);
	weather.append(`${d.temperature}`);

	card.appendChild(cardContent);
	card.append(weather);
	card.style.backgroundImage = `assets/Icons-for-Cities/${d.cityName.toLowerCase()}.svg`;
	const path = `../assets/Icons-for-Cities/${d.cityName.toLowerCase()}.svg`;
	card.style.background = `var(--bg-dark-grey-tile) url(../assets/Icons-for-Cities/${d.cityName.toLowerCase()}.svg) no-repeat`;
	card.style.backgroundPosition = "bottom right";
	card.style.backgroundSize = "55%";
	return card;
};

const removeCard = () => {
	console.log("removeCard");
	let cont = document.getElementById("card-container");
	cont.removeChild(cont.lastElementChild);
	hideOrShowButton();
};
const hideOrShowButton = () => {
	const cont = document.getElementById("card-container");
	if (isOverflown(cont)) {
		document.getElementById("left").style.visibility = "visible";
		document.getElementById("right").style.visibility = "visible";
	} else {
		document.getElementById("left").style.visibility = "hidden";
		document.getElementById("right").style.visibility = "hidden";
	}
};
const addCard = (midData, prev, curr) => {
	console.log("addCard");
	const cont = document.getElementById("card-container");
	midData.forEach((item, index) => {
		if (index >= prev && index < curr) {
			const card = getCard(item[1]);
			console.log(card);
			cont.appendChild(card);
		}
	});
	hideOrShowButton();
};

const val = (prev) => {
	return (curr) => {
		if (curr < prev) {
			return function rem(midData) {
				console.log("remove");
				for (let i = 0; i < prev - curr; i++) {
					removeCard();
				}
			};
		} else
			return function add(midData) {
				// console.log(midData);
				addCard(midData, prev, curr);
			};
	};
};
var v = val(4);
const getChoice = () => {
	console.log("getChoice");
	let getSelectedValue = document.querySelector(
		'input[name="weather-sort"]:checked'
	);
	// const range = document.getElementById("range");
	// v = val(range);
	let cont = document.getElementById("card-container");
	// let card = addCard();
	// cont.appendChild(card);
	// document.getElementById("range").onchange(test());
	console.log(getSelectedValue.value);
	const asArray = Object.entries(data);
	let f = filter(asArray);
	let sortedData;
	if (getSelectedValue.value == "sunny") sortedData = f.sunny();
	else if (getSelectedValue.value == "cold") sortedData = f.cold();
	else sortedData = f.rainy();
	return sortedData;
};

const clear = () => {
	console.log("clear");
	document.getElementById("card-container").innerHTML = "";
	const r = document.getElementById("range").value;
	let midData = getChoice();
	v = val(r);
	addCard(midData, 0, r);
};

const getSorted = (getSelectedValue) => {
	console.log("getsorted");
	const asArray = Object.entries(data);
	let f = filter(asArray);
	if (getSelectedValue.value == "sunny") sortedData = f.sunny();
	else if (getSelectedValue.value == "cold") sortedData = f.cold();
	else sortedData = f.rainy();
	return sortedData;
};

const getRange = () => {
	console.log("getRange");
	const r = document.getElementById("range").value;
	let midData = getChoice();
	// document.getElementById("icons").onchange = () => {
	// 	midData = getChoice();
	// };
	// const midData = getChoice();
	console.log(r, midData.length);
	if (midData.length > r) v(r)(midData);
	v = val(r);
};

function isOverflown(element) {
	return element.scrollWidth > element.clientWidth;
}
const left = () => {
	let cont = document.getElementById("card-container");
	let card = document.getElementsByClassName("card");
	// cont.style.scrollBehavior = "smooth";
	cont.scrollLeft -= 2 * (card[0].clientWidth + 32);
};
const right = () => {
	let cont = document.getElementById("card-container");
	let card = document.getElementsByClassName("card");
	// cont.style.scrollBehavior = "smooth";
	cont.scrollLeft += 2 * (card[0].clientWidth + 32);
};
(() => {
	let cont = document.getElementById("card-container");
	clear();
	document.getElementById("left").onclick = () => {
		left();
	};
	document.getElementById("right").onclick = () => {
		console.log("right");
		right();
	};

	document.getElementById("icons").onchange = () => {
		console.log("icon change");
		clear();
	};
	document.getElementById("range").onchange = () => {
		console.log("Range change");
		getRange();
	};
	window.onresize = () => {
		hideOrShowButton();
	};
})();

const getTile = (key, i) => {
	console.log(i);
	const tile = document.createElement("div");
	tile.className = "tile";
	const left = document.createElement("div");
	left.className = "left-tile";

	let span = document.createElement("span");
	let time = new Date();
	let option = {};
	option.timeZone = i.timeZone;

	time = new Date(time.toLocaleString("en", option));
	console.log(time + "i");
	let hour = time.getHours();
	let min = time.getMinutes();
	let am = "AM";
	let hour12;
	[hour12, am] = getHourState(am)(hour);
	span.innerHTML = key;
	left.appendChild(span);

	span = document.createElement("span");
	span.innerHTML = `${i.cityName}, ${get2dig(hour12)}:${get2dig(min)} ${am}`;
	left.appendChild(span);
	tile.appendChild(left);

	const right = document.createElement("div");
	right.className = "right-tile";

	span = document.createElement("span");
	span.innerHTML = i.temperature;
	right.appendChild(span);

	span = document.createElement("span");
	const img = document.createElement("img");
	img.src = "assets/Weather-Icons/humidityIcon.svg";
	span.appendChild(img);
	span.append(i.humidity);
	right.appendChild(span);
	tile.appendChild(right);
	return tile;
};

const getContinentAsc = (mydata) => {
	let continent = mydata.reduce((acc, curr) => {
		if (!(curr[1].timeZone.split("/")[0] in acc))
			acc[curr[1].timeZone.split("/")[0]] = [];
		// if (!acc[curr[1].timeZone.split("/")[0]])
		// 	acc[curr[1].timeZone.split("/")[0]] = {};
		acc[curr[1].timeZone.split("/")[0]].push(curr[1]);
		console.log(typeof acc);
		return {
			...acc,
		};
	}, {});
	continent = Object.entries(continent);
	continent = continent.sort();
	return continent;
};
const getContinentDesc = (mydata) => {
	let continent = getContinentAsc(mydata);
	continent.reverse();
	return continent;
};
const sortTemp = (toSort) => {
	const continent = toSort;
	return {
		sortTempAsc: () => {
			continent.forEach(([key, value]) => {
				value.sort((a, b) => {
					return parseInt(a.temperature) - parseInt(b.temperature);
				});
				console.log(value);
			});
			return continent;
		},
		sortTempDesc: () => {
			continent.forEach(([key, value]) => {
				value.sort((a, b) => {
					return parseInt(a.temperature) - parseInt(b.temperature);
				});
				value.reverse();
				console.log(value);
			});

			return continent;
		},
	};
};
function sortTempAsc() {
	this.continent.forEach(([key, value]) => {
		value.sort((a, b) => {
			return parseInt(a.temperature) - parseInt(b.temperature);
		});
		console.log(value);
	});
	return this.continent;
}
function sortTempDesc() {
	console.log(this.continent);
	this.continent.forEach(([key, value]) => {
		value.sort((a, b) => {
			return parseInt(a.temperature) - parseInt(b.temperature);
		});
		value.reverse();
		console.log(value);
	});

	return this.continent;
}

let sortedContinent;
// const sortedContinent = sortTemp(continent);

const getTemp = () => {
	let temp = document.getElementById("sort-temp");
	const tilecont = document.getElementById("tile-container");
	let sorted;
	if (temp.value == "Asc") {
		temp.firstElementChild.src = "assets/General-Images/arrowDown.svg";
		temp.value = "Desc";
		sorted = sortedContinent.sortTempDesc();
	} else {
		temp.firstElementChild.src = "assets/General-Images/arrowUp.svg";
		temp.value = "Asc";
		sorted = sortedContinent.sortTempAsc();
	}
	console.log("hi");
	console.log(Object.values(sorted));
	tilecont.textContent = "";
	let count = 12;
	sorted.forEach(([key, value]) => {
		console.log(value);
		value.forEach((i) => {
			if (count > 0) {
				const tile = getTile(key, i);
				tilecont.appendChild(tile);
				count--;
			}
		});
	});
};

const sortContinent = () => {
	const mydata = Object.entries(data);

	const arrow = document.getElementById("sort-continent");
	const obj = {};
	let d = sortTempDesc.bind(obj);
	if (arrow.value == "Asc") {
		arrow.firstElementChild.src = "assets/General-Images/arrowDown.svg";
		arrow.value = "Desc";
		const continent = getContinentDesc(mydata);
		sortedContinent = sortTemp(continent);
		// const obj = {};
		// obj.continent = conti;
		// // let d = sortTempDesc.bind(obj);
		// const sortedContinent = d();
		// // console.log(sortedContinent);
		// let count = 12;
		// tilecont.textContent = "";
		// sortedContinent.forEach(([key, value]) => {
		// 	console.log(value);
		// 	value.forEach((i) => {
		// 		if (count > 0) {
		// 			const tile = getTile(key, i);
		// 			tilecont.appendChild(tile);
		// 			count--;
		// 		}
		// 	});
		// });
	} else {
		arrow.firstElementChild.src = "assets/General-Images/arrowUp.svg";
		arrow.value = "Asc";
		const continent = getContinentAsc(mydata);
		console.log(continent);
		sortedContinent = sortTemp(continent);
		// const sortedContinent = sortTempAsc(continent);
		// obj.continent = continent;
		// // let d = sortTempDesc.bind(obj);
		// const sortedContinent = d();
		// // console.log(sortedContinent);
		// console.log(sortedContinent);
		// tilecont.textContent = "";
		// count = 12;
		// sortedContinent.forEach(([key, value]) => {
		// 	console.log(value);
		// 	value.forEach((i) => {
		// 		if (count > 0) {
		// 			const tile = getTile(key, i);
		// 			tilecont.appendChild(tile);
		// 			count--;
		// 		}
		// 	});
		// });
	}
	getTemp();
};
(() => {
	sortContinent();
	document.getElementById("sort-continent").onclick = () => {
		sortContinent();
	};
	document.getElementById("sort-temp").onclick = () => {
		getTemp();
	};
})();
