const errorHandle = function (err) {
	console.log(err);
};
const getAllTimeZone = async function () {
	let response = await fetch("http://localhost:8000/all-timezone-cities", {
		method: "GET",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
	}).catch((err) => {
		console.log(err.name + " : " + err.message);
	});
	let result = await response.json();

	return result;
};

const getCityTime = async function (city) {
	let response = await fetch(`http://localhost:8000?city=${city}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
	}).catch((err) => {
		console.log(err.name + " : " + err.message);
	});
	let result = await response.json();
	return result.city_Date_Time_Name;
};

const getHourlyForecast = async function (cityName) {
	let cityTime = await getCityTime(cityName);
	let request = { city_Date_Time_Name: cityTime, hours: 6 };
	console.log(request);
	let response = await fetch("http://localhost:8000/hourly-forecast", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	}).catch((err) => {
		console.log(err.name + " : " + err.message);
	});
	let result = await response.json();
	return result.temperature;
};

const changeToObj = function (allData) {
	allData = allData.reduce((acc, curr) => {
		acc[curr.cityName.toLowerCase()] = curr;
		return {
			...acc,
		};
	}, {});
	return allData;
};

const addNextFiveHrs = async function (cityData) {
	await getCityTime(cityData.cityName).then((cityTime) => {
		cityData.demo = cityTime;
	});
	return cityData;
};

const another = async (allData) => {
	for (let cityData of allData) {
		await getHourlyForecast(cityData.cityName).then((result) => {
			cityData.nextFiveHrs = result;
		});
	}
	console.log(allData[0].nextFiveHrs);
	return allData;
};
var data;
async function startTop() {
	// console.log("start 1");
	const cities = Object.keys(data);
	var list = document.getElementById("citylist");

	cities.forEach(function (item) {
		var option = document.createElement("option");
		option.value = data[item].cityName;
		option.innerText = data[item].cityName;
		list.appendChild(option);
	});

	getOpt();
	document.getElementById("city").onchange = () => {
		getOpt();
	};
	// console.log("end 1");
}

async function startMid() {
	// console.log("start 2");
	let cont = document.getElementById("card-container");
	const obj = new midCity();
	v = obj.val(4);
	obj.clear();
	document.getElementById("left").onclick = () => {
		obj.left();
	};
	document.getElementById("right").onclick = () => {
		obj.right();
	};
	document.getElementById("icons").onchange = () => {
		obj.clear();
	};
	document.getElementById("range").onchange = () => {
		obj.getRange();
	};
	window.onresize = () => {
		obj.hideOrShowButton();
	};
	// console.log("end 2");
}

async function startBottom() {
	// console.log("start 3");
	const obj = new bottomCity();
	obj.sortContinent();
	document.getElementById("sort-continent").onclick = () => {
		obj.getContinent();
	};
	document.getElementById("sort-temp").onclick = () => {
		obj.getTemp();
	};
	// console.log("end 3");
}

async function refreshData() {
	try {
		let allData = await getAllTimeZone();
		allData = await another(allData);
		let allData2 = await changeToObj(allData);
		console.log(allData[0].nextFiveHrs);
		console.log(allData2["nome"].nextFiveHrs);
		data = allData2;
		console.log("over");
		location.reload;
		let main = document.getElementById("main-container");
		main.style.visibility = "visible";
		document.body.style.background = "none";
		startTop();
		startMid();
		startBottom();
	} catch (err) {
		console.log(err.name + " : " + err.message);
	}
}

(() => {
	let main = document.getElementById("main-container");
	main.style.visibility = "hidden";
	document.body.style.backgroundImage =
		'url("./assets/General-Images/preloader.gif")';

	document.body.style.backgroundSize = "100vw 100vh";
	refreshData();
	setInterval(refreshData, 3600000);
})();
