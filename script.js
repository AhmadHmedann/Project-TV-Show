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

  episodeList.forEach((episode) => {
    const cardElem = episodeCard(episode);
    rootElem.append(cardElem);
  });

  updateEpisodeCount(episodeList.length);
}

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

function episodeCard({ name, image, season, number, summary }) {
  const template = document.getElementById("episode-Card");
  const card = template.content.cloneNode(true);

  const episodeCode = formatEpisodeCode(season, number);

  card.querySelector(".episode-title").textContent = `${name}-${episodeCode}`;

  const img = card.querySelector(".episode-img");
  img.src = image.medium;
  img.alt = name;

  card.querySelector(".episode-summary").innerHTML = summary;
  return card;
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", handleSearch);
}

function matchesSearch(episode, searchTerm) {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return (
    episode.name.toLowerCase().includes(lowerSearchTerm) ||
    episode.summary.toLowerCase().includes(lowerSearchTerm)
  );
}

function handleSearch(event) {
  const searchTerm = event.target.value;
  const filteredEpisodes = allEpisodes.filter((episode) =>
    matchesSearch(episode, searchTerm)
  );
  makePageForEpisodes(filteredEpisodes);
}

function updateEpisodeCount(count) {
  const countElem = document.getElementById("episode-count");
  countElem.textContent = `Displaying ${count} / ${allEpisodes.length} episodes`;
}

window.onload = setup;
