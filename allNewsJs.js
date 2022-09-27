
document.getElementById("dataToday").innerText = new Date().toLocaleString(
  "en-US",
  {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timezone: "UTC",
  }
);

// https://rapidapi.com/weatherbit/api/weather
        // lat=${55.751244}&lon=${37.618423} Moscow

function getWeather(lat, lon) {
  fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=1&key=${weatherApiKey}`,
    {
      method: "GET",
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

weatherByIp(getWeather)

function getNews(newsApiKey, currentPage, category) {
    const newsUrl = `https://newsdata.io/api/1/news?apikey=${newsApiKey}&country=us&language=en&page=${currentPage}&category=${category}`
    console.log(newsUrl)
      let allNews = fetch(newsUrl)
      allNews
      .then(response => response.json())
      .then(response => {
          console.log(response)
          newsArr = []
          document.getElementById("mainNews").replaceChildren()
          for (let i = 0; i < response.results.length; i++) {
            newsArr[i] = document.createElement('div')
            newsArr[i].className = "newsItem"
            let newsData = document.createElement('p')
            newsData.className = "newsData"
            newsData.innerText = new Date(response.results[i].pubDate).toLocaleString("en-US", {dateStyle: "medium"})
            let newsBlock = document.createElement('div')
            newsBlock.className = "newsBlock"
            let newsTitle = document.createElement('h2')
            newsTitle.className = "newsTitle"
            newsTitle.innerText = response.results[i].title
            let newsDescription = document.createElement('p')
            newsDescription.className = "newsDescription"
            newsDescription.innerText = response.results[i].description
            let newsblock2 = document.createElement('div')
            newsblock2.className = "newsblock2"
            newsArr[i].append(newsData)
            if (response.results[i].image_url !== null) {
              let newsImage = document.createElement('img')
              newsImage.className = "newsImage"
              newsImage.src = response.results[i].image_url
                newsImage.onload = () => {
                  if (newsImage.width >= 200) {
                  newsblock2.append(newsImage)
                  }
                }
              }
              newsblock2.append(newsTitle)
              newsBlock.append(newsblock2)
            newsArr[i].append(newsBlock)
            newsBlock.append(newsDescription)
            document.getElementById("mainNews").append(newsArr[i])
          }
          
          let lastPage = Math.ceil(response.totalResults / 10 )
          if (currentPage == 0) {
            document.getElementById("previous").style.display = "none"
          } else {
            document.getElementById("previous").style.display = "block"
          }
          if (currentPage + 1 == lastPage) {
            document.getElementById("next").style.display = "none"
          } else {
            document.getElementById("next").style.display = "block"
          }
          document.getElementById("lastPage").innerText = lastPage
          document.getElementById("currentPage").innerText = currentPage + 1
      })
}

let currentPage = 0
let category = "top"
let newsArr = []

getNews(newsApiKey, currentPage, category)

document.getElementById("topmenu").addEventListener("click", (el) => {
  if (el.target.innerText !== "Country") {
    category = el.target.innerText
    currentPage = 0
    getNews(newsApiKey, currentPage, category)
  }
  console.log(category)
})

document.getElementById("pagination").addEventListener("click", (el) => {
  if (el.target.innerText == "Next") {
    currentPage++
    getNews(newsApiKey, currentPage, category)
  }
  if (el.target.innerText == "Previous") {
    currentPage--
    getNews(newsApiKey, currentPage, category)
  }
})


