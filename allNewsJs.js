NProgress.configure({ easing: "ease", speed: 800 });

document.getElementById("dataToday").innerText = document.getElementById(
  "dataToday2"
).innerText = new Date().toLocaleString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
  timezone: "UTC",
});

// lat=${55.751244}&lon=${37.618423} Moscow

function getWeather(lat, lon) {
  fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=1&key=${weatherApiKey}`,
    {
      method: "GET",
      mode: "no-cors",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "keep-alive": "timeout=5",
      },
    }
  )
    .then((response) => response.json())
    .then((response) => {
      // console.log(response);

      document.getElementById("weather").style.opacity = "1";
      document.getElementById(
        "iconWeather"
      ).src = `./icons/${response.data[0].weather.icon}.png`;
      document.getElementById("tempCurrent").innerText = `${Math.floor(
        response.data[0].temp
      )}°C`;
      document.getElementById("tempHighLow").innerText = `${Math.floor(
        response.data[0].high_temp
      )}° ${Math.floor(response.data[0].low_temp)}°`;
    })
    .catch((err) => console.error(err));
}

function weatherByIp(func) {
  fetch(
    `http://ip-api.com/json/?fields=status,message,country,region,regionName,city,lat,lon`
  )
    .then((response) => response.json())
    .then((response) => {
      const lat = response.lat;
      const lon = response.lon;
      func(lat, lon);
    })
    .catch((err) => {
      const lat = 55.751244;
      const lon = 37.618423;
      func(lat, lon);
    });
}

weatherByIp(getWeather);

function getNews(
  newsApiKey,
  currentPage,
  category,
  currentCountry,
  language,
  searchQ
) {
  NProgress.start();
  let newsUrl = `https://newsdata.io/api/1/news?apikey=${newsApiKey}&country=${currentCountry}&language=${language}&category=${category}`;

  newsUrl = searchQ === "" ? newsUrl : `${newsUrl}&q=${searchQ}`;
  newsUrl =
    currentPage === 0 ? newsUrl : `${newsUrl}&page=${pages[currentPage - 1]}`;

  // console.log(newsUrl)
  // console.log(currentPage)

  const allNews = fetch(newsUrl);
  allNews
    .then((response) => response.json())
    .then((response) => {
      // console.log(response)
      pages[currentPage] = response.nextPage;
      // console.log(pages)
      newsArr = [];
      document.getElementById("mainNews").replaceChildren();

      if (category == "Top") {
        document.getElementById("categoryName").innerText = "Top News";
      } else {
        if (category == "World") {
          document.getElementById("categoryName").innerText = "World News";
        } else {
          document.getElementById("categoryName").innerText = category;
        }
      }

      for (let i = 0; i < response.results.length; i++) {
        newsArr[i] = document.createElement("div");
        newsArr[i].className = "newsItem";
        let newsData = document.createElement("p");
        newsData.className = "newsData";
        let newsData2 = document.createElement("p");
        newsData2.className = "newsData2";
        newsData.innerText = newsData2.innerText = new Date(
          response.results[i].pubDate.replace(" ", "T")
        ).toLocaleString("en-US", {
          dateStyle: "medium",
        });

        let newsBlock = document.createElement("div");
        newsBlock.className = "newsBlock";
        let newsTitle = document.createElement("h2");
        newsTitle.className = "newsTitle";
        let newsTitleLink = document.createElement("a");
        newsTitleLink.target = "_blank";
        newsTitleLink.href =
          response.results[i].link !== "null" ? response.results[i].link : "#";
        newsTitleLink.innerText = response.results[i].title;
        newsTitle.append(newsTitleLink);
        let newsDescription = document.createElement("p");
        newsDescription.className = "newsDescription";
        newsDescription.innerText = response.results[i].description;

        newsArr[i].append(newsData);
        let newsImage = document.createElement("img");
        newsImage.className = "newsImage";
        if (response.results[i].image_url == null) {
          newsImage.style.display = "none";
        }
        if (response.results[i].image_url !== null) {
          newsBlock.append(newsImage);
          newsImage.src = response.results[i].image_url;
          newsImage.onload = () => {
            if (newsImage.naturalWidth <= 240) {
              newsImage.style.display = "none";
            }
          };
          newsImage.onerror = () => {
            newsImage.style.display = "none";
          };
        }

        newsBlock.append(newsTitle);
        newsBlock.append(newsDescription);
        newsBlock.append(newsData2);
        newsArr[i].append(newsBlock);

        document.getElementById("mainNews").append(newsArr[i]);
      }

      let lastPage = Math.ceil(response.totalResults / 10);
      if (currentPage == 0) {
        document.getElementById("previous").style.display = "none";
      } else {
        document.getElementById("previous").style.display = "block";
      }
      if (currentPage + 1 == lastPage) {
        document.getElementById("next").style.display = "none";
      } else {
        document.getElementById("next").style.display = "block";
      }
      document.getElementById("lastPage").innerText = lastPage;
      document.getElementById("currentPage").innerText = currentPage + 1;
    });
  NProgress.done();
}

const countryList = [
  [
    "Countries",
    "Russia",
    "U.S.",
    "Canada",
    "U.K.",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Portugal",
    "Turkey",
    "Thailand",
    "China",
    "Australia",
  ],
  [
    "ru,us,ca,gb,de",
    "ru",
    "us",
    "ca",
    "gb",
    "de",
    "fr",
    "it",
    "es",
    "pt",
    "tr",
    "th",
    "cn",
    "au",
  ],
];

const categoryList = [
  "Top",
  "World",
  "Politics",
  "Business",
  "Technology",
  "Science",
  "Environment",
  "Entertainment",
  "Health",
  "Food",
  "Sports",
];

let currentPage = 0;
let pages = [];
let currentCountry = "ru,us,ca,gb,de";
let category = "Top";
let newsArr = [];
let language = "en";
let searchQ = "";

function initialization() {
  pages = [];
  currentPage = 0;
  currentCountry = "ru,us,ca,gb,de";
  category = "Top";
  newsArr = [];
  language = "en";
  searchQ = "";
  document.getElementById("searchForm").value = "";
  document.getElementById("submenuCountryBtn").innerHTML =
    "Countries" + `<i class="bi bi-caret-down-fill"></i>`;
  getNews(newsApiKey, currentPage, category, currentCountry, language, searchQ);
}

initialization();

document.getElementById("topmenu").addEventListener("click", (el) => {
  if (categoryList.includes(el.target.innerText)) {
    category = el.target.innerText;
    currentPage = 0;
    searchQ = "";
    document.getElementById("searchForm").value = "";
    getNews(
      newsApiKey,
      currentPage,
      category,
      currentCountry,
      language,
      searchQ
    );
  }
  if (
    countryList[0].includes(el.target.innerText) &&
    el.target.id !== "submenuCountryBtn"
  ) {
    currentCountry =
      countryList[1][countryList[0].indexOf(el.target.innerText)];
    document.getElementById("submenuCountryBtn").innerHTML =
      el.target.innerText + `<i class="bi bi-caret-down-fill"></i>`;
    currentPage = 0;
    searchQ = "";
    document.getElementById("searchForm").value = "";
    language = currentCountry == "ru" ? "ru" : "en";
    getNews(
      newsApiKey,
      currentPage,
      category,
      currentCountry,
      language,
      searchQ
    );
  }
  if (el.target.innerText == "Home") {
    initialization();
  }
});

document.getElementById("pagination").addEventListener("click", (el) => {
  if (el.target.id == "next") {
    currentPage++;
    getNews(
      newsApiKey,
      currentPage,
      category,
      currentCountry,
      language,
      searchQ
    );
  }
  if (el.target.id == "previous") {
    currentPage--;
    getNews(
      newsApiKey,
      currentPage,
      category,
      currentCountry,
      language,
      searchQ
    );
  }
});

document.getElementById("search").addEventListener("click", () => {
  let searchText = document.getElementById("searchForm").value;
  searchQ = searchText.replace(/\s+/g, " ").trim().replaceAll(" ", "%20AND%20");
  // console.log(searchQ);
  pages = [];
  currentPage = 0;
  getNews(newsApiKey, currentPage, category, currentCountry, language, searchQ);
});

document
  .getElementById("ini")
  .addEventListener("click", () => initialization());

document.getElementById("submenu").addEventListener("click", () => {
  if (
    !document.getElementById("submenuCountryContent").classList.contains("show")
  ) {
    document.getElementById("submenuCountryContent").classList.toggle("show");
    document
      .getElementById("submenuCountryContent")
      .classList.add("animeSubMenuStart");
    document.getElementById("submenuCountryContent").addEventListener(
      "animationend",
      () => {
        document
          .getElementById("submenuCountryContent")
          .classList.remove("animeSubMenuStart");
      },
      { once: true }
    );
  } else {
    document
      .getElementById("submenuCountryContent")
      .classList.add("animeSubMenuReverse");
    document.getElementById("submenuCountryContent").addEventListener(
      "animationend",
      () => {
        document
          .getElementById("submenuCountryContent")
          .classList.remove("animeSubMenuReverse");
        document
          .getElementById("submenuCountryContent")
          .classList.toggle("show");
      },
      { once: true }
    );
  }
});
document.addEventListener("click", (el) => {
  if (
    el.target.id !== "submenuCountryBtn" &&
    el.target.className !== "bi bi-caret-down-fill" &&
    document.getElementById("submenuCountryContent").classList.contains("show")
  ) {
    document
      .getElementById("submenuCountryContent")
      .classList.add("animeSubMenuReverse");
    document.getElementById("submenuCountryContent").addEventListener(
      "animationend",
      () => {
        document
          .getElementById("submenuCountryContent")
          .classList.remove("animeSubMenuReverse");
        document
          .getElementById("submenuCountryContent")
          .classList.remove("show");
      },
      { once: true }
    );
  }
});

document.getElementById("homeIcon").addEventListener("click", () => {
  if (!document.getElementById("topmenu").classList.contains("show")) {
    document.getElementById("topmenu").classList.toggle("show");
    document.getElementById("topmenu").classList.add("animeSideMenuStart");
    document.getElementById("topmenu").addEventListener(
      "animationend",
      () => {
        document
          .getElementById("topmenu")
          .classList.remove("animeSideMenuStart");
      },
      { once: true }
    );
  } else {
    document.getElementById("topmenu").classList.add("animeSideMenuReverse");
    document.getElementById("topmenu").addEventListener(
      "animationend",
      () => {
        document
          .getElementById("topmenu")
          .classList.remove("animeSideMenuReverse");
        document.getElementById("topmenu").classList.toggle("show");
      },
      { once: true }
    );
  }
});
document.addEventListener("click", (el) => {
  if (
    el.target.id !== "homeIcon" &&
    el.target.id !== "submenuCountryBtn" &&
    el.target.className !== "bi bi-caret-down-fill" &&
    document.getElementById("topmenu").classList.contains("show")
  ) {
    document.getElementById("topmenu").classList.add("animeSideMenuReverse");
    document.getElementById("topmenu").addEventListener(
      "animationend",
      () => {
        document
          .getElementById("topmenu")
          .classList.remove("animeSideMenuReverse");
        document.getElementById("topmenu").classList.remove("show");
      },
      { once: true }
    );
  }
});

window.addEventListener("resize", (el) => {
  if (el.target.innerWidth > 800) {
    document.getElementById("topmenu").classList.remove("show");
    document.getElementById("submenuCountryContent").classList.remove("show");
  }
});
