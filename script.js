const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const button = document.getElementById("searchButton");
const statusBox = document.getElementById("status");
const results = document.getElementById("results");

const API_URL =
  "https://commons.wikimedia.org/w/api.php?action=query" +
  "&generator=search&gsrnamespace=6&gsrsearch=SEARCH_TERM" +
  "&gsrlimit=24&prop=imageinfo&iiprop=url%7Cextmetadata" +
  "&iiurlwidth=700&format=json&origin=*";

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) return;

  searchImages(query);
});

async function searchImages(query) {
  // Clear the previous screen immediately and show loading BEFORE fetch.
  results.innerHTML = "";
  statusBox.className = "status";
  statusBox.innerHTML = `
    <div class="loading-wrap">
      <span class="spinner" aria-hidden="true"></span>
      <span>Searching for "${escapeHtml(query)}"...</span>
    </div>
  `;

  button.disabled = true;
  button.textContent = "Searching...";

  try {
    const url = API_URL.replace("SEARCH_TERM", encodeURIComponent(query));
    const response = await fetch(url);

    // Treat HTTP failures as errors.
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const pages = data?.query?.pages ? Object.values(data.query.pages) : [];

    // EMPTY STATE
    if (pages.length === 0) {
      statusBox.className = "status empty";
      statusBox.textContent =
        `No results for "${query}". Try another search.`;
      return;
    }

    const validResults = pages.filter(
      (page) => page.imageinfo && page.imageinfo[0]?.thumburl
    );

    if (validResults.length === 0) {
      statusBox.className = "status empty";
      statusBox.textContent =
        `No usable images found for "${query}". Try another search.`;
      return;
    }

    statusBox.className = "status";
    statusBox.textContent =
      `Showing ${validResults.length} results for "${query}"`;

    renderResults(validResults);
  } catch (error) {
    console.error(error);

    // ERROR STATE
    results.innerHTML = "";
    statusBox.className = "status error";
    statusBox.textContent =
      "Something went wrong. Please check your connection and try again.";
  } finally {
    button.disabled = false;
    button.textContent = "Search";
  }
}

function renderResults(items) {
  results.innerHTML = items.map((item, index) => {
    const info = item.imageinfo[0];
    const title = cleanTitle(item.title);
    const author =
      info.extmetadata?.Artist?.value
        ? stripHtml(info.extmetadata.Artist.value)
        : "Wikimedia Commons";

    return `
      <article class="card" style="animation-delay:${Math.min(index * 35, 500)}ms">
        <img
          src="${escapeAttribute(info.thumburl)}"
          alt="${escapeAttribute(title)}"
          loading="lazy"
          onerror="this.closest('.card').remove()"
        >
        <div class="card-info">
          <div class="card-title">${escapeHtml(title)}</div>
          <div class="card-meta">By ${escapeHtml(author)}</div>
        </div>
      </article>
    `;
  }).join("");
}

function cleanTitle(title) {
  return title
    .replace(/^File:/i, "")
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/_/g, " ");
}

function stripHtml(value) {
  const temp = document.createElement("div");
  temp.innerHTML = value;
  return temp.textContent || temp.innerText || "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

// Optional first search so the page isn't empty on first load.
searchImages("nature");
