// script.js
document.addEventListener("DOMContentLoaded", function () {
  const countryContainer = document.getElementById("country-container");
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("mb-3");

  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("id", "search-input");
  searchInput.setAttribute("placeholder", "Search by country name");
  searchInput.classList.add("form-control");

  searchContainer.appendChild(searchInput);
  countryContainer.appendChild(searchContainer);

  const restCountriesApiUrl = "https://restcountries.com/v3.1/all";
  let countries; // Declare countries variable

  // Fetch data from Rest Countries API
  fetch(restCountriesApiUrl)
    .then((response) => response.json())
    .then((data) => {
      countries = data; // Save the full list of countries
      displayCountries(countries);

      // Attach event listener for search input
      searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCountries = countries.filter((country) =>
          country.name.common.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries);
      });
    })
    .catch((error) => console.error("Error fetching countries:", error));


  function displayCountries(countries) {
    // Divide countries into rows (3 cards per row)
    countryContainer.innerHTML = ""; // Clear existing content

    for (let i = 0; i < countries.length; i += 3) {
      const row = document.createElement("div");
      row.classList.add("row", "mb-3");

      // Display up to 3 cards in each row
      for (let j = i; j < i + 3 && j < countries.length; j++) {
        const card = createCard(countries[j]);
        row.appendChild(card);
      }

      countryContainer.appendChild(row);
    }
  }

  function createCard(country) {
    // Create Bootstrap card elements
    const card = document.createElement("div");
    card.classList.add("col-md-4", "mb-3");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card", "h-100", "card-body"); // added 'card-body' class

    // Add necessary data to the card (capital, region, name, flag, country code, latlng)
    cardBody.innerHTML = `
    
  <h5 class="card-title">${country.name.common}</h5>
    <img src="${country.flags.png}" class="card-img-top img-fluid" alt="${
      country.name.common
    } Flag">
    
    <p class="card-text">Capital: ${country.capital}</p>
    <p class="card-text">Region: ${country.region}</p>
    <p class="card-text">Country Code: ${country.cca2}</p>
    <p class="card-text">Latlng: ${country.latlng.join(", ")}</p>
  `;

    // Create weather button inside createCard function
    const weatherButton = document.createElement("button");
    weatherButton.classList.add("btn", "btn-primary");
    weatherButton.textContent = "Click for Weather";

    weatherButton.addEventListener("click", function () {
      const openWeatherMapApiKey = "3f313bd01d572b680fa9bfa7dd574e19";
      const openWeatherMapApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]},${country.cca2}&appid=${openWeatherMapApiKey}`;

      // Fetch data from OpenWeatherMap API
      fetch(openWeatherMapApiUrl)
        .then((response) => response.json())
        .then((weatherData) => displayWeather(weatherData, cardBody)) // pass cardBody as an argument
        .catch((error) => console.error("Error fetching weather data:", error));
    });

    cardBody.appendChild(weatherButton);
    card.appendChild(cardBody);
    return card;
  }

  function displayWeather(weatherData, cardBody) {
    console.log("Weather Data:", weatherData);

    const weatherInfoContainer = document.createElement("div");
    weatherInfoContainer.classList.add("weather-info");

    // Display weather information as desired
    const temperature = document.createElement("p");
    temperature.textContent = `Temperature: ${weatherData.main.temp} °C`;

    const description = document.createElement("p");
    description.textContent = `Description: ${weatherData.weather[0].description}`;

    const humidity = document.createElement("p");
    humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;

    // Add weather information to the container
    weatherInfoContainer.appendChild(temperature);
    weatherInfoContainer.appendChild(description);
    weatherInfoContainer.appendChild(humidity);

    //close button
    const close = document.createElement("button");
    close.classList.add("btn", "btn-secondary");
    close.textContent = "close";
    close.addEventListener("click", function () {
      weatherInfoContainer.remove();
    });
    weatherInfoContainer.appendChild(close);

    // Clear previous weather info if any
    const existingWeatherInfo = cardBody.querySelector(".weather-info"); // Use cardBody to find the correct container
    if (existingWeatherInfo) {
      existingWeatherInfo.remove();
    }

    // Append the weather info container to the card body
    cardBody.appendChild(weatherInfoContainer);
  }
});
