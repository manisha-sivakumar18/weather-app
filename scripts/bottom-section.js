class bottomCity extends BaseCityConstructor {
	constructor(city) {
		super(city);
	}
	updateCardTime(d) {
		d.dateAndTime = new Date();
		const option = {};
		option.timeZone = d.timeZone;
		d.dateAndTime = new Date(d.dateAndTime.toLocaleString("en", option));
		let hour = d.dateAndTime.getHours();
		let min = d.dateAndTime.getMinutes();
		let hour12;
		let am;
		[hour12, am] = this.getHourState(hour);
		let time = `${this.get2dig(hour12)}:${this.get2dig(min)} ${am}`;
		return time;
	}
	getTile(key, i) {
		// console.log(i);
		const tile = document.createElement("div");
		tile.className = "tile";
		const left = document.createElement("div");
		left.className = "left-tile";

		let span = document.createElement("span");
		span.innerHTML = key;
		left.appendChild(span);

		let time = document.createElement("span");
		let t, dt;
		const that = this;
		(function update() {
			t = that.updateCardTime(i);
			time.innerHTML = t;
			let s = setTimeout(() => {
				update();
			}, 1000);
		})();
		left.appendChild(time);
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
	}
	getContinentAsc(mydata) {
		let continent = mydata.reduce((acc, curr) => {
			if (!(curr[1].timeZone.split("/")[0] in acc))
				acc[curr[1].timeZone.split("/")[0]] = [];
			// if (!acc[curr[1].timeZone.split("/")[0]])
			// 	acc[curr[1].timeZone.split("/")[0]] = {};
			acc[curr[1].timeZone.split("/")[0]].push(curr[1]);
			//console.log(typeof acc);
			return {
				...acc,
			};
		}, {});
		continent = Object.entries(continent);
		continent = continent.sort();
		return continent;
	}
	getContinentDesc(mydata) {
		let continent = this.getContinentAsc(mydata);
		continent.reverse();
		return continent;
	}
	sortTemp(toSort) {
		const continent = toSort;
		return {
			sortTempAsc: () => {
				continent.forEach(([key, value]) => {
					value.sort((a, b) => {
						return parseInt(a.temperature) - parseInt(b.temperature);
					});
					//console.log(value);
				});
				return continent;
			},
			sortTempDesc: () => {
				continent.forEach(([key, value]) => {
					value.sort((a, b) => {
						return parseInt(a.temperature) - parseInt(b.temperature);
					});
					value.reverse();
					//console.log(value);
				});

				return continent;
			},
		};
	}
	sortTempAsc() {
		this.continent.forEach(([key, value]) => {
			value.sort((a, b) => {
				return parseInt(a.temperature) - parseInt(b.temperature);
			});
			//console.log(value);
		});
		return this.continent;
	}
	sortTempDesc() {
		//console.log(this.continent);
		this.continent.forEach(([key, value]) => {
			value.sort((a, b) => {
				return parseInt(a.temperature) - parseInt(b.temperature);
			});
			value.reverse();
			//console.log(value);
		});

		return this.continent;
	}
	// const sortedContinent = sortTemp(continent);
	sortTempe() {
		let temp = document.getElementById("sort-temp");
		const tilecont = document.getElementById("tile-container");
		let sorted;
		if (temp.value === "Desc") {
			sorted = sortedContinent.sortTempDesc();
		} else {
			sorted = sortedContinent.sortTempAsc();
		}
		//console.log("hi");
		//console.log(Object.values(sorted));
		tilecont.textContent = "";
		let count = 12;
		sorted.forEach(([key, value]) => {
			//console.log(value);
			value.forEach((i) => {
				if (count > 0) {
					const tile = this.getTile(key, i);
					tilecont.appendChild(tile);
					count--;
				}
			});
		});
	}
	getTemp() {
		console.log("change");
		let temp = document.getElementById("sort-temp");
		console.log(temp.value);
		if (temp.value === "Asc") {
			temp.firstElementChild.src = "assets/General-Images/arrowDown.svg";
			temp.value = "Desc";
		} else {
			temp.firstElementChild.src = "assets/General-Images/arrowUp.svg";
			temp.value = "Asc";
		}
		console.log(temp.value);
		this.sortTempe();
	}
	getContinent() {
		const arrow = document.getElementById("sort-continent");
		console.log(arrow.value);
		if (arrow.value === "Asc") {
			arrow.firstElementChild.src = "assets/General-Images/arrowDown.svg";
			arrow.value = "Desc";
		} else {
			arrow.firstElementChild.src = "assets/General-Images/arrowUp.svg";
			arrow.value = "Asc";
		}
		console.log(arrow.value);
		this.sortContinent();
	}
	sortContinent() {
		const mydata = Object.entries(data);

		const arrow = document.getElementById("sort-continent");
		const obj = {};
		let d = this.sortTempDesc.bind(obj);
		if (arrow.value === "Desc") {
			const continent = this.getContinentDesc(mydata);
			sortedContinent = this.sortTemp(continent);
			// const obj = {};
			// obj.continent = conti;
			// // let d = sortTempDesc.bind(obj);
			// const sortedContinent = d();
			// // //console.log(sortedContinent);
			// let count = 12;
			// tilecont.textContent = "";
			// sortedContinent.forEach(([key, value]) => {
			// 	//console.log(value);
			// 	value.forEach((i) => {
			// 		if (count > 0) {
			// 			const tile = getTile(key, i);
			// 			tilecont.appendChild(tile);
			// 			count--;
			// 		}
			// 	});
			// });
		} else {
			const continent = this.getContinentAsc(mydata);
			//console.log(continent);
			sortedContinent = this.sortTemp(continent);
			// const sortedContinent = sortTempAsc(continent);
			// obj.continent = continent;
			// // let d = sortTempDesc.bind(obj);
			// const sortedContinent = d();
			// // //console.log(sortedContinent);
			// //console.log(sortedContinent);
			// tilecont.textContent = "";
			// count = 12;
			// sortedContinent.forEach(([key, value]) => {
			// 	//console.log(value);
			// 	value.forEach((i) => {
			// 		if (count > 0) {
			// 			const tile = getTile(key, i);
			// 			tilecont.appendChild(tile);
			// 			count--;
			// 		}
			// 	});
			// });
		}
		this.sortTempe();
	}
}

let sortedContinent;

(() => {
	// const obj = new bottomCity();
	// obj.sortContinent();
	// document.getElementById("sort-continent").onclick = () => {
	// 	obj.getContinent();
	// };
	// document.getElementById("sort-temp").onclick = () => {
	// 	obj.getTemp();
	// };
})();
