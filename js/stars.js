// Stars page: the star cards are made from this array.
// temp is in Kelvin, distance is in light years (ly).

const stars = [
  { name: "Rigel",      color: "blue",   temp: 12000, distance: 860, constellation: "Orion",
    text: "A blue supergiant in Orion. It shines about 100,000 times brighter than our Sun." },
  { name: "Spica",      color: "blue",   temp: 22000, distance: 250, constellation: "Virgo",
    text: "Looks like one star, but it is two hot stars that circle each other every four days." },
  { name: "Sirius",     color: "white",  temp: 9900,  distance: 8.6, constellation: "Canis Major",
    text: "The brightest star in the night sky. Look for it low in the south in winter." },
  { name: "Vega",       color: "white",  temp: 9600,  distance: 25,  constellation: "Lyra",
    text: "One of the three stars of the Summer Triangle. In about 12,000 years it will be our North Star." },
  { name: "Polaris",    color: "yellow", temp: 6000,  distance: 430, constellation: "Ursa Minor",
    text: "The North Star. It almost never moves, so travelers used it to find north." },
  { name: "Capella",    color: "yellow", temp: 5000,  distance: 43,  constellation: "Auriga",
    text: "Two yellow giants so close together that our eyes see them as one bright star." },
  { name: "Arcturus",   color: "orange", temp: 4300,  distance: 37,  constellation: "Boötes",
    text: "The brightest star in the northern sky. Follow the curve of the Big Dipper's handle to find it." },
  { name: "Aldebaran",  color: "orange", temp: 3900,  distance: 65,  constellation: "Taurus",
    text: "The orange eye of the bull in Taurus. It is about 44 times wider than our Sun." },
  { name: "Betelgeuse", color: "red",    temp: 3600,  distance: 550, constellation: "Orion",
    text: "A red giant on Orion's shoulder. It is so big it could swallow the orbit of Mars." },
  { name: "Antares",    color: "red",    temp: 3500,  distance: 550, constellation: "Scorpius",
    text: "The red heart of Scorpius. Its name means \"rival of Mars\" because of its color." }
];

const list = document.getElementById("star-list");
const searchInput = document.getElementById("search");
const searchError = document.getElementById("search-error");
const sortSelect = document.getElementById("sort");
const resultLine = document.getElementById("result-line");
const filterButtons = document.querySelectorAll(".filter-btn");
const resetButton = document.getElementById("reset");

let currentColor = "all";


// The light we see tonight left the star "distance" years ago.
function lightYear(distance) {
  return new Date().getFullYear() - Math.round(distance);
}

function formatNumber(number) {
  return number.toLocaleString("en-US");   // 12000 -> "12,000"
}

// makes one card with DOM methods
function createCard(star) {
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-lg-3";

  const card = document.createElement("article");
  card.className = "star-card";

  const ball = document.createElement("div");
  ball.className = "star-ball " + star.color;

  const temp = document.createElement("span");
  temp.className = "temp";
  temp.textContent = formatNumber(star.temp) + " K";

  const title = document.createElement("h3");
  title.textContent = star.name;

  const place = document.createElement("p");
  place.className = "place";
  place.textContent = star.constellation + " · " + star.distance + " ly";

  const text = document.createElement("p");
  text.textContent = star.text;

  const light = document.createElement("p");
  light.className = "light-year";
  light.textContent = "The light you see tonight left this star in " + lightYear(star.distance) + ".";

  card.append(ball, temp, title, place, text, light);
  col.append(card);
  return col;
}

function sortStars(array, sortBy) {
  if (sortBy === "hot") {
    array.sort((a, b) => b.temp - a.temp);
  } else if (sortBy === "near") {
    array.sort((a, b) => a.distance - b.distance);
  } else {
    array.sort((a, b) => a.name.localeCompare(b.name));
  }
}

// search + filter + sort, then draw the cards again
function showStars() {
  const query = searchInput.value.trim().toLowerCase();

  // wrong input: only letters, spaces and "-" can be in a star name
  if (/^[a-zö\s-]*$/.test(query)) {
    searchError.textContent = "";
    searchInput.classList.remove("is-invalid");
  } else {
    searchError.textContent = "Star names have only letters. Try, for example, Vega.";
    searchInput.classList.add("is-invalid");
  }

  // 1. keep the stars that match the name and the color
  const result = [];
  for (const star of stars) {
    const nameMatches = star.name.toLowerCase().includes(query);
    const colorMatches = currentColor === "all" || star.color === currentColor;
    if (nameMatches && colorMatches) {
      result.push(star);
    }
  }

  // 2. sort them
  sortStars(result, sortSelect.value);

  // 3. draw the cards and add up the temperatures
  list.innerHTML = "";
  let totalTemp = 0;
  for (const star of result) {
    list.append(createCard(star));
    totalTemp += star.temp;
  }

  // 4. count, average and the "nothing found" message
  if (result.length === 0) {
    resultLine.textContent = "Showing 0 of " + stars.length + " stars";
    $("#empty").stop(true, true).fadeIn(300);
  } else {
    const average = Math.round(totalTemp / result.length);
    resultLine.textContent = "Showing " + result.length + " of " + stars.length +
      " stars · average temperature " + formatNumber(average) + " K";
    $("#empty").stop(true, true).hide();
  }
}

function setColor(color) {
  currentColor = color;
  filterButtons.forEach(function (button) {
    const isActive = button.dataset.color === color;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive);
  });
  showStars();
}


// events
searchInput.addEventListener("input", showStars);
sortSelect.addEventListener("change", showStars);

// Escape clears the search
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    searchInput.value = "";
    showStars();
  }
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setColor(button.dataset.color);
  });
});

resetButton.addEventListener("click", function () {
  searchInput.value = "";
  setColor("all");
  searchInput.focus();
});

showStars();
