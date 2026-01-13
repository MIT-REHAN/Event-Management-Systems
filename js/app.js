// Initial Sample Events with more variety
const initialEvents = [
    {
        id: 1,
        name: "Pune Tech Meetup 2026",
        organizer: "Dev Community",
        date: "2026-02-15",
        times: ["10:00 AM", "2:00 PM"],
        venue: "Auto Cluster Exhibition Center",
        price: 0,
        seats: 200,
        phone: "9876543210",
        email: "tech@puneevents.com"
    },
    {
        id: 2,
        name: "Neon Vibes Music Fest",
        organizer: "Pulse Events",
        date: "2026-03-10",
        times: ["7:00 PM", "10:00 PM"],
        venue: "Phoenix Marketcity",
        price: 999,
        seats: 500,
        phone: "9123456789",
        email: "vibe@neonfest.com"
    },
    {
        id: 3,
        name: "Art & Soul Exhibition",
        organizer: "Creative Minds",
        date: "2026-02-20",
        times: ["11:00 AM", "4:00 PM"],
        venue: "Bal Gandharva Rang Mandir",
        price: 150,
        seats: 100,
        phone: "8888888888",
        email: "art@creativeminds.com"
    },
    {
        id: 4,
        name: "Foodie Street Walk",
        organizer: "Pune Eats",
        date: "2026-01-25",
        times: ["5:00 PM", "8:00 PM"],
        venue: "FC Road",
        price: 299,
        seats: 30,
        phone: "7776665554",
        email: "yummy@puneeats.com"
    },
    {
        id: 5,
        name: "Startup Pitch Night",
        organizer: "Incubate Pune",
        date: "2026-04-05",
        times: ["6:00 PM"],
        venue: "WeWork Futura",
        price: 0,
        seats: 80,
        phone: "9990001112",
        email: "pitch@startup.com"
    },
    {
        id: 6,
        name: "Standup Comedy Special",
        organizer: "Laugh Club",
        date: "2026-02-14",
        times: ["8:00 PM"],
        venue: "Classic Rock Coffee Co.",
        price: 499,
        seats: 150,
        phone: "5551234567",
        email: "lol@laughclub.com"
    }
];

// State
let events = JSON.parse(localStorage.getItem('events')) || initialEvents;

// DOM Elements
const eventsContainer = document.getElementById('events-container');
const createEventForm = document.getElementById('create-event-form');
const searchBar = document.getElementById('search-bar');
const modal = document.getElementById('booking-modal');
const closeModalBtn = document.querySelector('.close-btn');
const bookingForm = document.getElementById('booking-form');
const bookingTimeSelect = document.getElementById('booking-time');
const bookingTicketsInput = document.getElementById('booking-tickets');
const bookingTotalPriceSpan = document.getElementById('booking-total-price');

// --- Initialization ---

function init() {
    renderEvents(events);
    checkReminders();

    // Save initial load if empty
    if (!localStorage.getItem('events')) {
        saveEvents();
    }
}

// --- Event Handlers ---

createEventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newEvent = {
        id: Date.now(),
        name: document.getElementById('event-name').value,
        organizer: document.getElementById('organizer-name').value,
        date: document.getElementById('event-date').value,
        times: document.getElementById('event-time').value.split(',').map(t => t.trim()),
        venue: document.getElementById('event-venue').value,
        price: Number(document.getElementById('ticket-price').value),
        seats: Number(document.getElementById('total-seats').value),
        phone: document.getElementById('contact-phone').value,
        email: document.getElementById('contact-email').value
    };

    events.unshift(newEvent); // Add to beginning
    saveEvents();
    renderEvents(events);
    createEventForm.reset();
    alert('✨ Event Launched Successfully! ✨');

    // Scroll to events
    document.getElementById('events-section').scrollIntoView({ behavior: 'smooth' });
});

searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = events.filter(ev =>
        ev.name.toLowerCase().includes(term) ||
        ev.venue.toLowerCase().includes(term) ||
        ev.organizer.toLowerCase().includes(term)
    );
    renderEvents(filtered);
});

// Modal Logic
closeModalBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

bookingTicketsInput.addEventListener('input', updatePrice);

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const eventId = document.getElementById('booking-event-id').value;
    const event = events.find(e => e.id == eventId);
    const slots = bookingTicketsInput.value;
    const time = bookingTimeSelect.value;
    const total = event.price * slots;

    alert(`🎉 Booking Confirmed! 🎉\n\nEvent: ${event.name}\nTime: ${time}\nTickets: ${slots}\nTotal: $${total}\n\nCheck your email for the tickets!`);
    modal.style.display = "none";
    bookingForm.reset();
});

// --- Helper Functions ---

function renderEvents(eventsList) {
    eventsContainer.innerHTML = '';

    if (eventsList.length === 0) {
        eventsContainer.innerHTML = '<p style="text-align:center; width:100%; opacity:0.6;">No events found matching your vibe.</p>';
        return;
    }

    eventsList.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        // Format price display
        const priceDisplay = event.price === 0 ? 'FREE' : `$${event.price}`;

        card.innerHTML = `
            <div class="card-body">
                <span class="tag-organizer">${event.organizer}</span>
                <h3>${event.name}</h3>
                <div class="event-details-list">
                    <p>📅 ${event.date}</p>
                    <p>📍 ${event.venue}</p>
                    <p>🎟️ ${event.seats} seats left</p>
                </div>
                <div class="card-footer">
                    <span class="price-tag">${priceDisplay}</span>
                    <button class="btn-book" onclick="openBookingModal(${event.id})">Get Tickets</button>
                </div>
            </div>
        `;
        eventsContainer.appendChild(card);
    });
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Exposed to global scope for HTML onclick
window.openBookingModal = function (id) {
    const event = events.find(e => e.id === id);
    if (!event) return;

    document.getElementById('booking-event-id').value = event.id;
    document.getElementById('modal-event-name').innerText = event.name;
    document.getElementById('modal-event-details').innerText = `${event.date} @ ${event.venue}`;

    // Populate times
    bookingTimeSelect.innerHTML = '';
    event.times.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.innerText = time;
        bookingTimeSelect.appendChild(option);
    });

    // Reset price
    bookingTicketsInput.value = 1;
    updatePrice();

    modal.style.display = 'flex';
};

function updatePrice() {
    const id = document.getElementById('booking-event-id').value;
    const event = events.find(e => e.id == id);
    if (event) {
        const qty = bookingTicketsInput.value;
        bookingTotalPriceSpan.innerText = event.price * qty;
    }
}

function checkReminders() {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = events.filter(e => e.date === today);

    if (upcoming.length > 0) {
        const names = upcoming.map(e => e.name).join(', ');
        setTimeout(() => {
            alert(`👋 Hey! You have upcoming events today: \n\n${names}`);
        }, 800);
    }
}

// Run init
init();
