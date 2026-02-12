let habits = JSON.parse(localStorage.getItem("habits")) || [];

const habitScreen = document.getElementById("habitScreen");
const progressScreen = document.getElementById("progressScreen");
const progressBtn = document.getElementById("progressBtn");

document.getElementById("addHabit").addEventListener("click", () => {
  const name = prompt("Name der Gewohnheit:");
  if (!name) return;

  habits.push({
    name: name,
    history: {}
  });

  save();
  renderHabits();
});

progressBtn.addEventListener("click", () => {
  habitScreen.classList.toggle("hidden");
  progressScreen.classList.toggle("hidden");
  renderProgress();
});

function save() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function renderHabits() {
  habitScreen.innerHTML = "";

  habits.forEach((habit, index) => {

    const card = document.createElement("div");
    card.className = "habit-card";

    const title = document.createElement("div");
    title.textContent = habit.name;

    const circle = document.createElement("div");
    circle.className = "check-circle";

    if (habit.history[today()]) {
      circle.classList.add("checked");
    }

    circle.addEventListener("click", () => {
      if (habit.history[today()]) {
        delete habit.history[today()];
      } else {
        habit.history[today()] = true;
      }
      save();
      renderHabits();
    });

    card.appendChild(title);
    card.appendChild(circle);
    habitScreen.appendChild(card);
  });
}

function calculatePercentage(habit, days) {
  let count = 0;

  for (let i = 0; i < days; i++) {
    let date = new Date();
    date.setDate(date.getDate() - i);
    let key = date.toISOString().split("T")[0];

    if (habit.history[key]) count++;
  }

  return Math.round((count / days) * 100);
}

function renderProgress() {
  progressScreen.innerHTML = "";

  habits.forEach(habit => {

    const card = document.createElement("div");
    card.className = "habit-card";

    const title = document.createElement("div");
    title.innerHTML = `
      <strong>${habit.name}</strong><br>
      Woche: ${calculatePercentage(habit, 7)}%<br>
      Monat: ${calculatePercentage(habit, 30)}%<br>
      Jahr: ${calculatePercentage(habit, 365)}%
    `;

    card.appendChild(title);
    progressScreen.appendChild(card);
  });
}

renderHabits();

/* SERVICE WORKER REGISTRIEREN */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}
