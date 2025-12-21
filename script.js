
const state = {
  allShows: [],
  allEpisodes: [],
  searchTerm: "",
  showSearchTerm: "",
  episodeByShowId: new Map(),
};

// fetch the data

const fetchAllShows = async () => {
  const response = await fetch("https://api.tvmaze.com/shows");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
};

const fetchEpisodesForShow = async (showId) => {
  const url = `https://api.tvmaze.com/shows/${showId}/episodes`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
};

window.addEventListener("load", async () => {
  const statusElm = document.getElementById("status");
  statusElm.textContent = "Loading...";

  try {
    const shows = await fetchAllShows();
        state.allShows = shows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    statusElm.textContent = "";
    setup();
  } catch {
    statusElm.textContent =
      "Sorry, failed to load data. Please refresh the page.";
  }
});

//rendering

function setup() {
  setupSearch();
  setupShowSearch()
  setupEpisodeSelector();
  setupHomeButton();
  makePageForShows(state.allShows);
}

/* Page Creation */

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous episodes
  const episodeCards = episodeList.map(episodeCard);
  rootElem.append(...episodeCards);
  updateEpisodeCount(episodeList.length);
}

function episodeCard({ name, image, season, number, summary, id }) {
  const template = document.getElementById("episode-card-template");
  const card = template.content.cloneNode(true);
  const root = card.firstElementChild; //add an id for each episode for selector function
  root.id = String(id);
  const episodeCode = formatEpisodeCode(season, number);

  card.querySelector(".episode-title").textContent = `${name}-${episodeCode}`;

  const img = card.querySelector(".episode-img");
  img.src = image?.medium || "";
  img.alt = name || "";

  card.querySelector(".episode-summary").innerHTML = summary;
  return card;
}

/* Search bar */

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", handleSearch);
}

function matchesSearch(name, summary, searchTerm) {
  const term = searchTerm.toLowerCase();
  return (
    (name && name.toLowerCase().includes(term)) ||
    (summary && summary.toLowerCase().includes(term)) ///check after filter
  );
}

function handleSearch(event) {
  state.searchTerm = event.target.value;
  const filteredEpisodes = state.allEpisodes.filter((episode) =>
    matchesSearch(episode.name, episode.summary, state.searchTerm)
  );
  makePageForEpisodes(filteredEpisodes);
}

function updateEpisodeCount(count) {
  const countElem = document.getElementById("episode-count");
  countElem.textContent = `Displaying ${count} / ${state.allEpisodes.length} episodes`;
}

/* Episode Select Dropdown */

function setupEpisodeSelector() {
  const select = document.getElementById("episode-select");
  select.addEventListener("change", handleEpisodeSelect);
  populateEpisodeSelector();
}
function populateEpisodeSelector() {
  const select = document.getElementById("episode-select");
  select.innerHTML = '<option value="">Jump to an episode...</option>';
  state.allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    const episodeCode = formatEpisodeCode(episode.season, episode.number);
    option.value = String(episode.id); //use the episode id as the option value
    option.textContent = `${episodeCode} - ${episode.name}`;
    select.append(option);
  });
}
function handleEpisodeSelect(event) {
  const selectedId = event.target.value;

  if (!selectedId) {
    return;
  }
  const selectedElement = document.getElementById(selectedId);
  if (!selectedElement) return;
  selectedElement.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Helper Functions */

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(
    2,
    "0"
  )}`;
}

/* Shows Select Dropdown */

// create show card

function showCard({
  image,
  name,
  summary,
  genres,
  runtime,
  rating,
  status,
  id,
}) {
  const template = document.getElementById("show-card-template");
  const showCard = template.content.cloneNode(true);
  const img = showCard.querySelector(".show-img");
  if (image?.medium) {
    img.src = image.medium;
    img.alt = name ?? "";
  } else {
    img.src = "https://via.placeholder.com/210x295?text=No+Image";
    img.alt = "No image available";
  }
  const link = showCard.querySelector(".show-link");
  link.textContent = name;
  link.dataset.showId = id;
  showCard.querySelector(".show-summary").innerHTML = summary;

  showCard.querySelector(".show-rating").textContent = rating?.average ?? "N/A";
  showCard.querySelector(".show-genres").textContent =
    genres?.join(" | ") || "N/A";
  showCard.querySelector(".show-status").textContent = status ?? "N/A";
  showCard.querySelector(".show-runtime").textContent = runtime ?? "N/A";

  return showCard;
}

function makePageForShows(showList) {
  const rootElem = document.getElementById("shows-root");
  rootElem.innerHTML = ""; // Clear previous shows
  const showCards = showList.map(showCard);
  rootElem.append(...showCards);
}


document
  .getElementById("shows-root")
  .addEventListener("click", handleShowClick);
function handleShowClick(event) {
  const link = event.target.closest(".show-link");
  if (!link) return;
  event.preventDefault();
  const showId = Number(link.dataset.showId);
  loadShowEpisodes(showId);
}
async function loadShowEpisodes(showId) {
  const statusElm = document.getElementById("status");
  statusElm.textContent = "Loading episodes...";
  try {
    let episodes;
    if (state.episodeByShowId.has(showId)) {
      episodes = state.episodeByShowId.get(showId);
    } else {
      episodes = await fetchEpisodesForShow(showId);
      state.episodeByShowId.set(showId, episodes);
    }
    state.allEpisodes = episodes;

    // clean the search
    state.searchTerm = "";
    document.getElementById("search-input").value = "";
    makePageForEpisodes(state.allEpisodes);
    populateEpisodeSelector();
    // document.getElementById("episode-select").value = "";
    statusElm.textContent = "";
    showEpisodeView();
  } catch {
    statusElm.textContent =
      "Sorry - failed to load episodes. Please refresh the page.";
  }
}
function showEpisodeView() {
  document.getElementById("show-view").hidden = true;
  document.getElementById("episode-view").hidden = false;
}

//home Page

function showShowsView() {
  document.getElementById("show-view").hidden = false;
  document.getElementById("episode-view").hidden = true;
}

function setupHomeButton() {
  document.getElementById("home").textContent = "Home";
  document.getElementById("home").addEventListener("click", (e) => {
    e.preventDefault();
    showShowsView();
  });
}

function matchesShowSearch(show, searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return true;
  const name = show.name.toLowerCase();
  const genres = show.genres.join(" ").toLowerCase();
  const summary = show.summary.toLowerCase();
  return name.includes(term) || genres.includes (term) ||summary.includes(term)
}

function setupShowSearch(){
  const input =document.getElementById("show-search");
  input.addEventListener("input", handleShowSearch)
}

function handleShowSearch(event){
  state.showSearchTerm=event.target.value;
  const filteredShows =state.allShows.filter((show)=>
    matchesShowSearch(show,state.showSearchTerm)
  );
  makePageForShows(filteredShows);
  updateShowCount(filteredShows.length);
}

function updateShowCount(count){
  const countElm = document.getElementById("show-count");
  countElm.textContent=`found ${count}  shows`
}