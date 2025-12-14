//You can edit ALL of the code here
let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  setupSearch();
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous episodes

  for (const episode of episodeList) {
    const card = episodeCard(episode);
    rootElem.append(card);
  }

  updateEpisodeCount(episodeList.length);
}
//declare a function to create one card ,given episode obj

function episodeCard(info) {
  const template = document.getElementById("episode-Card");
  const card = template.content.cloneNode(true);
  const episodeCode =
    "S" +
    String(info.season).padStart(2, "0") +
    "E" +
    String(info.number).padStart(2, "0");
  card.querySelector(".episode-title").textContent =
    `${info.name}-${episodeCode}`;
  const img = card.querySelector(".episode-img");
  img.src = info.image.medium;
  img.alt = info.name;
  card.querySelector(".episode-summary").innerHTML = info.summary;
  return card;
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", handleSearch);
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();

  const filteredEpisodes = allEpisodes.filter((episode) => {
    const nameMatch = episode.name.toLowerCase().includes(searchTerm);
    const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
    return nameMatch || summaryMatch;
  });

  makePageForEpisodes(filteredEpisodes);
}

function updateEpisodeCount(count) {
  const countElem = document.getElementById("episode-count");
  countElem.textContent = `Displaying ${count} / ${allEpisodes.length} episodes`;
}

window.onload = setup;
