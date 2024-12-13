document.querySelector('select').addEventListener('change', async () => {
       const cityname =document.querySelector('#wea')
       console.log(cityname.value)
    Toastify ({
 text: `You select ${cityname.value} The Weather Prediction is given below`,
  duration: 3000,
  newWindow: true,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  style: {
    background: " linear-gradient(to right,#6a9ff1, #8cc6ff)",
  },
  onClick: function(){} // Callback after click
}).showToast();
    const apiKey = "d24f9f5340d5182b0967c1a1f33599d5";
    const city = document.getElementById('wea').value;
    const cityNameElement = document.getElementById('city-name');
    const weatherTypeElement = document.getElementById('weather-type');
    const tempElement = document.getElementById('temp');
    const minTempElement = document.getElementById('min-temp');
    const maxTempElement = document.getElementById('max-temp');

    if (!city) {
        alert("Please select a district.");
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);

        if (!response.ok) {
            throw new Error("City not found or API error.");
        }

        const data = await response.json();

        cityNameElement.textContent = data.name;
        weatherTypeElement.textContent = data.weather[0].description;
        tempElement.textContent = data.main.temp;
        minTempElement.textContent = data.main.temp_min;
        maxTempElement.textContent = data.main.temp_max;
    } catch (error) {
        alert(`Error: ${error.message}`);
        cityNameElement.textContent = "------";
        weatherTypeElement.textContent = "------";
        tempElement.textContent = "";
        minTempElement.textContent = "";
        maxTempElement.textContent = "";
    }
});


