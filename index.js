/**
 * Challenge: get a random image from Unsplash and set it as the background
 *
 * Part 1:
 *
 * URL: https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature
 * (You can change the "query" at the end to whatever theme you want)
 *
 * Change the body's backgroundImage to:
 * `url(<insert the URL of the iamge from the API here>)`
 *
 * (You may need to dig around the response body a bit to find this URL)
 *
 * (Note I've already added some CSS to resize the image within the window.
 * Instructions for this were found on CSS Tricks:
 * https://css-tricks.com/perfect-full-page-background-image/#awesome-easy-progressive-css3-way)
 */

const renderBackgroundImg = async () => {
  try {
    const res = await fetch(
      "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!res.ok) {
      throw new Error(`HTTP Error! status:${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    console.log(data.urls.full);
    document.body.style.backgroundImage = `url(${data.urls.regular})`;
    document.getElementById("author").textContent = `By: ${data.user.name}`;
    return data;
  } catch (err) {
    console.log("Faild to fetch background image", err);
    const defaultUrl =
      "https://images.unsplash.com/photo-1501785888041-af3ef2https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzgzMjA3ODN8&ixlib=rb-4.1.0&q=8585b470?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzgyNDUzMDV8&ixlib=rb-4.1.0&q=85";
    document.body.style.backgroundImage = `url(${defaultUrl})`;
    // Report the error to some kind of service for diagnosis
  }
};

const renderCurrencyData = async () => {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/dogecoin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP Error! status:${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    document.getElementById("crypto-top").innerHTML = `
          <img src=${data.image.small} />
          <span>${data.name}</span>
          `;
    const dogecoinValue = `
    <p>🎯: $ ${data.market_data.current_price.usd}</p>
    <p>☝️: $ ${data.market_data.high_24h.usd}</p>
    <p>👇: $ ${data.market_data.low_24h.usd}</p>
    `;
    document.getElementById("crypto").innerHTML += dogecoinValue;
  } catch (err) {
    console.log("Faild to fetch background image", err);
  }
};

renderBackgroundImg();
renderCurrencyData();

function doTime() {
  const date = new Date();
  let time = date.toLocaleTimeString("en-US", { timeStyle: "short" });
  document.getElementById("time").textContent = `${time}`;
  console.log(time);
}

setInterval(doTime, 1000);

// let time = date.toLocaleString([], {
//   hour: "2-digit",
//   minute: "2-digit",
//   hour12: true,
// });

const weatherScrimba = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`,
    );
    if (!res.ok) {
      throw new Error("Weather data is not available");
    }

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

navigator.geolocation.getCurrentPosition(
  (position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    weatherScrimba(lat, lon);
  },
  (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied geolocation request.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location unavailable.");
        break;
      case error.TIMEOUT:
        console.error("Request timed out.");
        break;
      default:
        console.error("Unknown error.");
    }
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  },
);
