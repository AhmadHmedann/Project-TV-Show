//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  for (const episode of episodeList) {
    const card = episodeCard(episode);
    rootElem.append(card);
  }
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

window.onload = setup;
