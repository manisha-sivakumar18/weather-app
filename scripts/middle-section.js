// Middle section
// import { getHourState, get2dig, getWeather } from "./top-section.js";
class midCity extends BaseCityConstructor {
	constructor(city) {
		super(city);
	}
	filter(dataArray) {
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
					// console.log(value);
					// console.log(value1);
					return parseInt(value.humidity) - parseInt(value1.humidity);
				});
				return midData;
			},
		};
	}
	updateCardTime(d) {
		d.dateAndTime = new Date();
		const option = {};
		option.timeZone = d.timeZone;
		d.dateAndTime = new Date(d.dateAndTime.toLocaleString("en", option));
		// console.log(d.dateAndTime);
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

		let hour = d.dateAndTime.getHours();
		let min = d.dateAndTime.getMinutes();
		let hour12;
		let am;
		[hour12, am] = this.getHourState(hour);
		let time = `${this.get2dig(hour12)}:${this.get2dig(min)} ${am}`;

		let date = `${d.dateAndTime.getDate()}-
					${month[d.dateAndTime.getMonth()]}-
					${d.dateAndTime.getFullYear()}`;
		return [time, date];
	}
	getCard(d) {
		//console.log(d);
		const card = document.createElement("div");
		card.className = "card";
		const cardContent = document.createElement("div");
		cardContent.className = "card-content";
		const city = document.createElement("span");
		city.innerHTML = d.cityName;
		const time = document.createElement("span");
		const date = document.createElement("span");
		let t, dt;
		const that = this;
		// console.log(this);
		(function update() {
			[t, dt] = that.updateCardTime(d);
			time.innerHTML = t;
			date.innerHTML = dt;
			let s = setTimeout(() => {
				update();
			}, 1000);
		})();
		// console.log(s);
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
		const weathericon = this.getWeather(parseInt(d.temperature));
		icon.src = `assets/Weather-Icons/${weathericon}.svg`;
		icon.alt = "Humid";
		weather.appendChild(icon);
		weather.append(`${d.temperature}`);

		card.appendChild(cardContent);
		card.append(weather);
		card.style.backgroundImage = `assets/Icons-for-Cities/${d.cityName.toLowerCase()}.svg`;
		const path = `../assets/Icons-for-Cities/${d.cityName.toLowerCase()}.svg`;
		card.style.background = `var(--bg-dark-grey-tile) url(./assets/Icons-for-Cities/${d.cityName.toLowerCase()}.svg) no-repeat`;
		card.style.backgroundPosition = "bottom right";
		card.style.backgroundSize = "55%";
		return card;
	}
	removeCard() {
		//console.log("removeCard");
		let cont = document.getElementById("card-container");
		cont.removeChild(cont.lastElementChild);
		this.hideOrShowButton();
	}
	hideOrShowButton() {
		const cont = document.getElementById("card-container");
		if (this.isOverflown(cont)) {
			document.getElementById("left").style.visibility = "visible";
			document.getElementById("right").style.visibility = "visible";
		} else {
			document.getElementById("left").style.visibility = "hidden";
			document.getElementById("right").style.visibility = "hidden";
		}
	}
	addCard(midData, prev, curr) {
		//console.log("addCard");
		const cont = document.getElementById("card-container");
		midData.forEach((item, index) => {
			if (index >= prev && index < curr) {
				const card = this.getCard(item[1]);
				//console.log(card);
				cont.appendChild(card);
			}
		});
		this.hideOrShowButton();
	}
	val(prev) {
		const that = this;
		return (curr) => {
			if (curr < prev) {
				return function rem(midData) {
					//console.log("remove");
					for (let i = 0; i < prev - curr; i++) {
						that.removeCard();
					}
				};
			} else
				return function add(midData) {
					// //console.log(midData);
					that.addCard(midData, prev, curr);
				};
		};
	}
	getChoice() {
		//console.log("getChoice");
		let getSelectedValue = document.querySelector(
			'input[name="weather-sort"]:checked'
		);
		// const range = document.getElementById("range");
		// v = val(range);
		let cont = document.getElementById("card-container");
		// let card = addCard();
		// cont.appendChild(card);
		// document.getElementById("range").onchange(test());
		//console.log(getSelectedValue.value);
		const asArray = Object.entries(data);
		let f = this.filter(asArray);
		let sortedData;
		if (getSelectedValue.value == "sunny") sortedData = f.sunny();
		else if (getSelectedValue.value == "cold") sortedData = f.cold();
		else sortedData = f.rainy();
		return sortedData;
	}
	clear() {
		//console.log("clear");
		document.getElementById("card-container").innerHTML = "";
		const r = document.getElementById("range").value;
		let midData = this.getChoice();
		v = this.val(r);
		this.addCard(midData, 0, r);
	}
	getSorted(getSelectedValue) {
		//console.log("getsorted");
		const asArray = Object.entries(data);
		let f = filter(asArray);
		if (getSelectedValue.value == "sunny") sortedData = f.sunny();
		else if (getSelectedValue.value == "cold") sortedData = f.cold();
		else sortedData = f.rainy();
		return sortedData;
	}
	getRange() {
		//console.log("getRange");
		const r = document.getElementById("range").value;
		let midData = this.getChoice();
		// document.getElementById("icons").onchange = () => {
		// 	midData = getChoice();
		// };
		// const midData = getChoice();
		//console.log(r, midData.length);
		if (midData.length > r) v(r)(midData);
		v = this.val(r);
	}
	isOverflown(element) {
		return element.scrollWidth > element.clientWidth;
	}
	left() {
		let cont = document.getElementById("card-container");
		let card = document.getElementsByClassName("card");
		// cont.style.scrollBehavior = "smooth";
		cont.scrollLeft -= 2 * (card[0].clientWidth + 32);
	}
	right() {
		let cont = document.getElementById("card-container");
		let card = document.getElementsByClassName("card");
		// cont.style.scrollBehavior = "smooth";
		cont.scrollLeft += 2 * (card[0].clientWidth + 32);
	}
}

var v;

(() => {
	// let cont = document.getElementById("card-container");
	// const obj = new midCity();
	// v = obj.val(4);
	// obj.clear();
	// document.getElementById("left").onclick = () => {
	// 	obj.left();
	// };
	// document.getElementById("right").onclick = () => {
	// 	//console.log("right");
	// 	obj.right();
	// };
	// document.getElementById("icons").onchange = () => {
	// 	//console.log("icon change");
	// 	obj.clear();
	// };
	// document.getElementById("range").onchange = () => {
	// 	//console.log("Range change");
	// 	obj.getRange();
	// };
	// window.onresize = () => {
	// 	hideOrShowButton();
	// };
})();
