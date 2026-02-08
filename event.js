// --- 1. DATA ---
let events = [
    { id: 1, title: "Neon Nights 2026", date: "2026-02-15", loc: "New York, USA", type: "Party", price: 500, img: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500" },
    { id: 2, title: "AI Summit London", date: "2026-03-10", loc: "London, UK", type: "Corporate", price: 2000, img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500" },
    { id: 3, title: "Sakura Festival", date: "2026-04-05", loc: "Tokyo, Japan", type: "Wedding", price: 0, img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500" },
    { id: 4, title: "Rift '26 Hackathon", date: "2026-02-19", loc: "Pune, India", type: "Workshop", price: 150, img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500" },
    { id: 5, title: "Tomorrowland", date: "2026-07-20", loc: "Belgium", type: "Party", price: 5000, img: "https://images.unsplash.com/photo-1459749411177-287ce3288b71?w=500" }
];

// --- 2. RENDER FUNCTIONS ---
function renderEvents(dataSet = events) {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '';
    
    if(dataSet.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:50px; color:#666;">
                <i class="fa-solid fa-ghost" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>No events found matching your filters.</p>
                <button class="btn-glass" onclick="resetSearch()" style="margin: 10px auto;">View All Events</button>
            </div>`;
        document.getElementById('resultCount').innerText = `0 results found`;
        return;
    }

    dataSet.forEach(e => {
        const dateStr = new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        grid.innerHTML += `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${e.img}" class="card-img">
                    <div class="card-badge">${e.type}</div>
                </div>
                <div class="card-body">
                    <div style="color:var(--primary); font-size:0.9rem; font-weight:600; margin-bottom:5px;">${dateStr}</div>
                    <h3 style="font-size:1.2rem; margin-bottom:5px;">${e.title}</h3>
                    <div style="color:#888; font-size:0.9rem; margin-bottom:15px;"><i class="fa-solid fa-location-dot"></i> ${e.loc}</div>
                    <div class="card-footer">
                        <span style="font-weight:700; font-size:1.1rem;">${e.price == 0 ? 'Free' : '₹'+e.price}</span>
                        <button class="btn-glass" style="padding:8px 16px; font-size:0.8rem; border-radius:8px;" onclick="openBooking(${e.id})">Book</button>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById('resultCount').innerText = `Showing ${dataSet.length} events`;
}

// --- 3. SEARCH & FILTER ---
function filterEvents() {
    const query = document.getElementById('sQuery').value.toLowerCase();
    const date = document.getElementById('sDate').value;
    const type = document.getElementById('sType').value;
    const loc = document.getElementById('sLoc').value;

    const filtered = events.filter(e => {
        const matchName = query === "" || e.title.toLowerCase().includes(query);
        const matchLoc = loc === "" || e.loc.includes(loc);
        const matchType = type === "" || e.type === type;
        const matchDate = date === "" || e.date === date; 
        return matchName && matchLoc && matchType && matchDate;
    });

    renderEvents(filtered);
    scrollToGrid();
}

function resetSearch() {
    document.getElementById('sQuery').value = "";
    document.getElementById('sDate').value = "";
    document.getElementById('sType').value = "";
    document.getElementById('sLoc').value = "";
    renderEvents(events);
}

// --- 4. BOOKING SYSTEM ---
let currentBookingEvent = null;
let ticketQty = 1;

function openBooking(id) {
    currentBookingEvent = events.find(e => e.id === id);
    ticketQty = 1;
    document.getElementById('bkTitle').innerText = currentBookingEvent.title;
    document.getElementById('bkDate').innerText = currentBookingEvent.date;
    document.getElementById('bkLoc').innerText = currentBookingEvent.loc;
    document.getElementById('bkSinglePrice').innerText = currentBookingEvent.price === 0 ? "Free" : `₹${currentBookingEvent.price}`;
    updateTotal();
    const overlay = document.getElementById('bookingOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('active'), 10);
}

function closeBooking() {
    const overlay = document.getElementById('bookingOverlay');
    overlay.classList.remove('active');
    setTimeout(() => overlay.style.display = 'none', 300);
}

function updateTicket(change) {
    const newQty = ticketQty + change;
    if(newQty >= 1 && newQty <= 10) {
        ticketQty = newQty;
        document.getElementById('bkQty').innerText = ticketQty;
        updateTotal();
    }
}

function updateTotal() {
    const total = currentBookingEvent.price * ticketQty;
    document.getElementById('bkTotal').innerText = total === 0 ? "Free" : `₹${total.toLocaleString()}`;
}

function processPayment() {
    const btn = document.querySelector('.pay-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    setTimeout(() => {
        alert(`Success! ${ticketQty} tickets booked for ${currentBookingEvent.title}.`);
        closeBooking();
        btn.innerHTML = originalText;
    }, 1500);
}

// --- 5. STUDIO LOGIC ---
let currentStep = 1;
const totalSteps = 10;
let draft = { type: 'General', baseCost: 0, guests: 100, foodCost: 0, addonCost: 0 };

function openStudio() { 
    document.getElementById('studioOverlay').classList.add('active'); 
    currentStep = 1; updateStudioUI(); renderSidebar();
}
function closeStudio() { document.getElementById('studioOverlay').classList.remove('active'); }
function scrollToGrid() { document.getElementById('discover').scrollIntoView({behavior:'smooth'}); }

function renderSidebar() {
    const list = document.getElementById('progressList');
    const labels = ["Type", "Info", "Date", "Guests", "Catering", "Services", "Venue", "Price", "Visuals", "Review"];
    list.innerHTML = '';
    labels.forEach((label, idx) => {
        list.innerHTML += `<div class="progress-step" id="pStep${idx+1}"><div class="step-num">${idx+1}</div><span>${label}</span></div>`;
    });
}

function navStep(dir) {
    if(dir === 1 && currentStep === totalSteps) { publishEvent(); return; }
    const next = currentStep + dir;
    if(next > 0 && next <= totalSteps) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.getElementById(`step${next}`).classList.add('active');
        currentStep = next;
        updateStudioUI();
    }
}

function updateStudioUI() {
    for(let i=1; i<=totalSteps; i++) {
        const el = document.getElementById(`pStep${i}`);
        el.classList.remove('active', 'completed');
        if(i === currentStep) el.classList.add('active');
        if(i < currentStep) el.classList.add('completed');
    }
    document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').innerText = currentStep === totalSteps ? 'Publish Event' : 'Next Step';
    
    if(currentStep === totalSteps) {
        document.getElementById('revTitle').innerText = document.getElementById('inpTitle').value || "Untitled";
        document.getElementById('revDate').innerText = document.getElementById('inpDate').value || "TBD";
        document.getElementById('revCost').innerText = document.getElementById('liveCost').innerText;
    }
}

function updateCost() {
    const total = draft.baseCost + (draft.guests * draft.foodCost) + draft.addonCost;
    document.getElementById('liveCost').innerText = "₹" + total.toLocaleString();
}

function selectType(el, type, cost) {
    el.parentElement.querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    draft.baseCost = cost; updateCost();
}
function updateGuests(val) {
    draft.guests = parseInt(val); document.getElementById('guestCountVal').innerText = val; updateCost();
}
function selectFood(el, cost) {
     el.parentElement.querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
     el.classList.add('selected');
     draft.foodCost = cost; updateCost();
}
function toggleAddon(el, cost) {
    el.classList.toggle('selected');
    if(el.classList.contains('selected')) draft.addonCost += cost; else draft.addonCost -= cost;
    updateCost();
}

function publishEvent() {
    const newEvent = {
        id: Date.now(),
        title: document.getElementById('inpTitle').value,
        date: document.getElementById('inpDate').value || new Date().toISOString().split('T')[0],
        loc: document.getElementById('inpLoc').value || "TBD",
        type: document.querySelector('.select-card.selected i').nextSibling.textContent.trim(), // Rough extraction
        price: document.getElementById('inpPrice').value || 0,
        img: document.getElementById('inpImg').value
    };
    events.unshift(newEvent);
    renderEvents();
    closeStudio();
    alert("Event Published Successfully!");
}

// Init
renderEvents();