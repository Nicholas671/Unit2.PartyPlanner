const COHORT = "2412-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

//state
const state = {
    events: [],
};

//create a get events async function
async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}

//ask the API to add events
async function addEvent(event) {
    try {
        const dateWithTime = event.date + "T00:00:00Z";

        const eventWithTime = { ...event, date: dateWithTime }
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventWithTime),
        });
        const json = await response.json();
        if (json.error) {
            throw new Error(json.error.message);
        }

        state.events.push(json.data);
    } catch (error) {
        console.error(error);
    }
}
async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Failed to delete event with ID: ${id}`)
        }

        state.events = state.events.filter((event) => event.id !== id);
        render();
    } catch (error) {
        console.error("Error deleting event:", error);
    }
}
//render the events
function renderEvents() {
    const eventsList = document.getElementById('events-list');

    if (!state.events.length) {
        eventsList.innerHTML = '<li>No events</li>';
        return;
    }
    const eventsCard = state.events.map(event => {
        const card = document.createElement('li');
        card.id = `event-${event.id}`;
        card.innerHTML = `
        <h2>${event.name}</h2>
        <p>${event.date}</p>
        <p>${event.description}</p>
        <p>${event.location}</p>
        <button class="delete-button" data-id="${event.id}">Delete</button>
        `;


        return card;
    });

    eventsList.replaceChildren(...eventsCard);


}

//sync and render
async function render() {
    await getEvents();
    renderEvents();
}

//initial render
render();
console.log(state)


const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newEvent = {
        name: form.partyName.value,
        date: form.date.value,
        description: form.description.value,
        location: form.location.value,
    };

    await addEvent(newEvent);
    render();
});
const list = document.getElementById("events-list");
list.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
        event.target.parentNode.remove();
    }
});