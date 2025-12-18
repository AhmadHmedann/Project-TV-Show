//                                           level-100 refactoring
//change the template id  to "episode-card-template"
// in rendering process(makePageForEpisodes) use map instead of forEach  ( to create a new array [card1,.....cardN] without touch the Dom )

//                                            level-200 refactoring
// use state object for global variable (allEpisode && searchTerm)


let isShowingSelected = false;
const state = {
  allEpisodes: getAllEpisodes(),
  searchTerm: "",
};

function setup() {
  makePageForEpisodes(state.allEpisodes);
  setupSearch();
  setupEpisodeSelector();
  setupShowAllButton();
}

/* Page Creation */

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous episodes
  const episodeCards = episodeList.map(episodeCard);
  rootElem.append(...episodeCards);
  updateEpisodeCount(episodeList.length);
}

function episodeCard({ name, image, season, number, summary }) {
  const template = document.getElementById("episode-card-template");
  const card = template.content.cloneNode(true);

  const episodeCode = formatEpisodeCode(season, number);

  card.querySelector(".episode-title").textContent = `${name}-${episodeCode}`;

  const img = card.querySelector(".episode-img");
  img.src = image.medium;
  img.alt = name;

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
    matchesSearch(episode, state.searchTerm)
  );
  makePageForEpisodes(filteredEpisodes);
  // isShowingSelected = false;
  // document.getElementById("show-all-btn").style.display = "none";
  // document.getElementById("episode-select").value = "";
}

function updateEpisodeCount(count) {
  const countElem = document.getElementById("episode-count");
  countElem.textContent = `Displaying ${count} / ${state.allEpisodes.length} episodes`;
}

/* Episode Select Dropdown */

function setupEpisodeSelector() {
  const select = document.getElementById("episode-select");

  state.allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    const episodeCode = formatEpisodeCode(episode.season, episode.number);
    option.value = episode.id;
    option.textContent = `${episodeCode} - ${episode.name}`;
    select.append(option);
  });

  select.addEventListener("change", handleEpisodeSelect);
}

function handleEpisodeSelect(event) {
  const selectedId = event.target.value;

  if (!selectedId) {
    // Reset
    showAllEpisodes();
    return;
  }

  const selectedEpisode = state.allEpisodes.find(
    (ep) => ep.id === parseInt(selectedId)
  );

  if (selectedEpisode) {
    makePageForEpisodes([selectedEpisode]); // Destructure single item
    isShowingSelected = true;
    document.getElementById("show-all-btn").style.display = "block";
  }
}

/* Show All Episodes Button */

function showAllEpisodes() {
  makePageForEpisodes(state.allEpisodes);
  isShowingSelected = false;
  document.getElementById("show-all-btn").style.display = "none";
  document.getElementById("episode-select").value = "";
  document.getElementById("search-input").value = "";
}

function setupShowAllButton() {
  const showAllBtn = document.getElementById("show-all-btn");
  showAllBtn.addEventListener("click", showAllEpisodes);
}

/* Helper Functions */

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(
    2,
    "0"
  )}`;
}

window.onload = setup;
