
const defaultPlayers = [
  {
    id: 1,
    name: "Rahul Sharma",
    age: 18,
    sport: "Football",
    position: "Striker",
    location: "Bengaluru",
    experience: 4,
    height: 174,
    achievement: "District-level finalist",
    bio: "Fast striker with good finishing and dribbling skills."
  },
  {
    id: 2,
    name: "Arjun Kumar",
    age: 19,
    sport: "Cricket",
    position: "All-rounder",
    location: "Mysuru",
    experience: 5,
    height: 178,
    achievement: "College tournament MVP",
    bio: "Right-hand batter and medium pace bowler."
  },
  {
    id: 3,
    name: "Priya Reddy",
    age: 17,
    sport: "Badminton",
    position: "Singles",
    location: "Bengaluru",
    experience: 3,
    height: 160,
    achievement: "Regional semifinalist",
    bio: "Quick footwork and strong attacking badminton skills."
  },
  {
    id: 4,
    name: "Vikram Patil",
    age: 20,
    sport: "Basketball",
    position: "Point Guard",
    location: "Hubballi",
    experience: 6,
    height: 185,
    achievement: "University team player",
    bio: "Excellent passing, court vision and teamwork."
  },
  {
    id: 5,
    name: "Sneha Gowda",
    age: 16,
    sport: "Athletics",
    position: "100m Sprint",
    location: "Tumakuru",
    experience: 2,
    height: 163,
    achievement: "School sports champion",
    bio: "Young sprinter with strong acceleration and discipline."
  }
];

// Load data from browser storage
let players = JSON.parse(localStorage.getItem("talentPlayers")) || defaultPlayers;
let shortlist = JSON.parse(localStorage.getItem("talentShortlist")) || [];

const playerList = document.getElementById("playerList");
const searchInput = document.getElementById("search");
const sportFilter = document.getElementById("sportFilter");
const registrationForm = document.getElementById("registrationForm");

// Save data to browser
function saveData() {
  localStorage.setItem("talentPlayers", JSON.stringify(players));
  localStorage.setItem("talentShortlist", JSON.stringify(shortlist));
}

// Escape user-provided text before inserting it into HTML
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

// Update statistics
function updateStats() {
  document.getElementById("totalPlayers").textContent = players.length;

  const sports = new Set(players.map(player => player.sport));
  document.getElementById("totalSports").textContent = sports.size;

  document.getElementById("totalShortlisted").textContent = shortlist.length;
}

// Display athlete cards
function displayPlayers(data) {
  playerList.innerHTML = "";

  if (data.length === 0) {
    playerList.innerHTML = `
      <p style="color:#b8f36b; grid-column:1/-1;">
        No athletes found. Try another search.
      </p>
    `;
    updateStats();
    return;
  }

  data.forEach(player => {
    const isSaved = shortlist.includes(player.id);

    const card = document.createElement("div");
    card.className = "player-card";

    card.innerHTML = `
      <h3>🏅 ${escapeHTML(player.name)}</h3>
      <p><strong>Sport:</strong> ${escapeHTML(player.sport)}</p>
      <p><strong>Position:</strong> ${escapeHTML(player.position)}</p>
      <p><strong>Age:</strong> ${escapeHTML(player.age)}</p>
      <p><strong>Location:</strong> ${escapeHTML(player.location)}</p>
      <p><strong>Experience:</strong> ${escapeHTML(player.experience || 0)} years</p>
      <p><strong>Height:</strong> ${escapeHTML(player.height || "Not specified")} ${player.height ? "cm" : ""}</p>
      <p><strong>Achievement:</strong> ${escapeHTML(player.achievement || "Not specified")}</p>
      <p>${escapeHTML(player.bio || "No description provided.")}</p>
      <button class="shortlist-btn" data-id="${player.id}">
        ${isSaved ? "★ Shortlisted" : "☆ Add to Shortlist"}
      </button>
    `;

    playerList.appendChild(card);
  });

  updateStats();
}

// Search and filter athletes
function filterPlayers() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedSport = sportFilter.value;

  const filteredPlayers = players.filter(player => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchText) ||
      player.location.toLowerCase().includes(searchText) ||
      player.position.toLowerCase().includes(searchText);

    const matchesSport =
      selectedSport === "" || player.sport === selectedSport;

    return matchesSearch && matchesSport;
  });

  displayPlayers(filteredPlayers);
}

// Athlete registration
registrationForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(registrationForm);

  const newPlayer = {
    id: Date.now(),
    name: formData.get("name").trim(),
    age: Number(formData.get("age")),
    sport: formData.get("sport"),
    position: formData.get("position").trim(),
    location: formData.get("location").trim(),
    experience: Number(formData.get("experience") || 0),
    height: formData.get("height") ? Number(formData.get("height")) : "",
    achievement: formData.get("achievement").trim(),
    bio: formData.get("bio").trim()
  };

  players.unshift(newPlayer);

  saveData();
  registrationForm.reset();

  document.getElementById("message").textContent =
    "Registration successful! Your athlete profile is now visible.";

  filterPlayers();

  document.getElementById("players").scrollIntoView({
    behavior: "smooth"
  });
});

// Shortlist button functionality
playerList.addEventListener("click", function(event) {
  if (!event.target.classList.contains("shortlist-btn")) return;

  const id = Number(event.target.dataset.id);

  if (shortlist.includes(id)) {
    shortlist = shortlist.filter(playerId => playerId !== id);
  } else {
    shortlist.push(id);
  }

  saveData();
  filterPlayers();
});

// Search listeners
searchInput.addEventListener("input", filterPlayers);
sportFilter.addEventListener("change", filterPlayers);

// Initialize website
filterPlayers();
updateStats();
