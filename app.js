require("dotenv").config();
const express = require("express");
const https = require("https");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

// vars sent to api as params
app.post("/", function (req, res) {
	const query = req.body.cityName;
	const apiKey = process.env.API;
	const unit = "imperial";
	const url =
		process.env.URL_KEY + "q=" + query + "&units=" + unit + "&appid=" + apiKey;
	//
	https.get(url, function (response) {
		console.log(response.statusCode);
		// parses api data into json format to enable easy access and pulling
		response.on("data", function (data) {
			const weatherData = JSON.parse(data);
			const tmp = weatherData.main.temp;
			const weatherDescription = weatherData.weather[0].description;
			const icon = weatherData.weather[0].icon;
			const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

			console.log(weatherData);
			// attatches stylesheet to returned page (forecast page)
			res.send(
				"<link rel='stylesheet' type='text/css' href='/styles.css'><div class='cityWeather'><h1>The temperature in " +
					query +
					" is currently " +
					tmp +
					"℉</h1><p>Forecast includes: " +
					weatherDescription +
					" for the day.</p><img src=" +
					imgURL +
					"></div></link>"
			);
		});
	});
});

app.listen(3000, function () {
	console.log("Server is running on port 3000");
});
