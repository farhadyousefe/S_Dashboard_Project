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
  } catch (err) {
    console.log("Faild to fetch background image", err);
  }
};

renderBackgroundImg();
renderCurrencyData();
