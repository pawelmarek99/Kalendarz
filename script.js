const monthYearEl = document.getElementById("monthYear");
const datesEl = document.getElementById("dates");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const modal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");
const saveEventButton = document.getElementById("saveEvent");
const eventInput = document.getElementById("eventInput");
const eventListEl = document.getElementById("eventList");

// Zdefiniowanie zmiennych globalnych
let currentYear = new Date().getFullYear(); // Rok bieżący
let currentMonth = new Date().getMonth();   // Miesiąc bieżący (0-11)
let selectedDate = null;
let events = JSON.parse(localStorage.getItem("events")) || {}; // Wczytaj wydarzenia z localStorage

// Miesiące w języku polskim
const months = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

// Renderowanie kalendarza
function renderCalendar() {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  monthYearEl.textContent = `${months[currentMonth]} ${currentYear}`;
  datesEl.innerHTML = "";

  // Dni z poprzedniego miesiąca
  for (let i = firstDayOfMonth; i > 0; i--) {
    const day = document.createElement("div");
    day.classList.add("inactive");
    day.textContent = lastDayOfPrevMonth - i + 1;
    datesEl.appendChild(day);
  }

  // Dni bieżącego miesiąca
  for (let i = 1; i <= lastDateOfMonth; i++) {
    const day = document.createElement("div");
    day.textContent = i;
    const dateKey = `${currentYear}-${currentMonth}-${i}`;

    if (events[dateKey]) {
      day.classList.add("has-event");
      const eventDot = document.createElement("span");
      eventDot.textContent = "•";
      eventDot.style.color = "red";
      eventDot.style.marginLeft = "5px";
      day.appendChild(eventDot);
    }

    if (i === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()) {
      day.classList.add("today");
    }

    day.addEventListener("click", () => openEventModal(dateKey));
    datesEl.appendChild(day);
  }

  // Dni z kolejnego miesiąca
  const remainingDays = 7 - (datesEl.childElementCount % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      const day = document.createElement("div");
      day.classList.add("inactive");
      day.textContent = i;
      datesEl.appendChild(day);
    }
  }
}

// Otwieranie okna modal
function openEventModal(date) {
  selectedDate = date;
  eventInput.value = events[date] || "";
  modal.style.display = "flex";
}

// Zamknięcie okna modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  selectedDate = null;
});

// Zapisywanie wydarzenia
saveEventButton.addEventListener("click", () => {
  if (eventInput.value) {
    events[selectedDate] = eventInput.value;
    localStorage.setItem("events", JSON.stringify(events));
  } else {
    delete events[selectedDate];
    localStorage.setItem("events", JSON.stringify(events));
  }
  modal.style.display = "none";
  renderCalendar();
  renderEventList();
});

// Renderowanie listy wydarzeń
function renderEventList() {
  eventListEl.innerHTML = "";
  for (const [date, event] of Object.entries(events)) {
    const li = document.createElement("li");
    li.textContent = `${date}: ${event}`;
    eventListEl.appendChild(li);
  }
}

// Obsługa przycisków nawigacji (poprzedni/następny miesiąc)
prevButton.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
  renderEventList();
});

nextButton.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
  renderEventList();
});

// Inicjalizacja
renderCalendar();
renderEventList();
