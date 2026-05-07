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

const background = async () => {
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
    document.body.style.backgroundImage = `url(${data.links.download})`;
    return data;
  } catch (err) {
    console.log("Faild to fetch background image", err);
  }
};

background();