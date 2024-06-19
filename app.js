const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// Theme toggler elements
const themeToggler = document.getElementById("theme-toggler");
const body = document.body;

// List of colors for heading
const headingColors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33A6", "#33FFA6"];

async function searchWikipedia(query) {
  const encodedQuery = encodeURIComponent(query);
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodedQuery}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error("Failed to fetch search results from Wikipedia API.");
  }

  const json = await response.json();
  return json;
}

function displayResults(results) {
  // Remove the loading spinner
  searchResults.innerHTML = "";

  results.forEach((result) => {
    const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
    const titleLink = `<a href="${url}" target="_blank" rel="noopener">${result.title}</a>`;
    const urlLink = `<a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>`;

    const resultItem = document.createElement("div");
    resultItem.className = "result-item animated-card";

    const headingColor = headingColors[Math.floor(Math.random() * headingColors.length)];

    resultItem.innerHTML = `
      <h3 class="result-title" style="color: ${headingColor};">${titleLink}</h3>
      ${urlLink}
      <p class="result-snippet">${result.snippet}</p>
      <div class="center-button">
        <button class="animated-button">Read More</button>
      </div>
    `;

    searchResults.appendChild(resultItem);
  });
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = "<p>Please enter a valid search term.</p>";
    return;
  }

  searchResults.innerHTML = "<div class='spinner'>Loading...</div>";

  try {
    const results = await searchWikipedia(query);

    if (results.query.searchinfo.totalhits === 0) {
      searchResults.innerHTML = "<p>No results found.</p>";
    } else {
      displayResults(results.query.search);
    }
  } catch (error) {
    console.error(error);
    searchResults.innerHTML = "<p>An error occurred while searching. Please try again later.</p>";
  }
});

// Event listener for the theme toggler
themeToggler.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  if (body.classList.contains("dark-theme")) {
    themeToggler.textContent = "Light";
    themeToggler.style.background = "#fff";
    themeToggler.style.color = "#333";
  } else {
    themeToggler.textContent = "Dark";
    themeToggler.style.border = "2px solid #ccc";
    themeToggler.style.color = "#333";
  }
});

// Event listeners for the suggestion cards
const suggestionCards = document.querySelectorAll(".suggestion-card");
suggestionCards.forEach((card) => {
  card.addEventListener("click", () => {
    searchInput.value = card.textContent;
    searchForm.dispatchEvent(new Event("submit"));
  });
});
