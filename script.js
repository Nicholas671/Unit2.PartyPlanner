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
console.log(state.events);
console.log(state.events.length);
console.log(getEvents());

//ask the API to add events
async function addEvent(event) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });
        const json = await response.json();
        if (json.error) {
            throw new Error(json.error.message);
        }
    } catch (error) {
        console.error(error);
    }
}
//rennder the events

function renderEvents() {
    const eventsList = document.getElementById('events-list');

    if (!state.events.length) {
        eventsList.innerHTML = '<li>No events</li>';
        return;
    }
    const eventsCard = state.events.map(event => {
        const card = document.createElement('li');
        card.innerHTML = `
        <h2>${event.name}</h2>
        <p>${event.date}</p>
        <p>${event.description}</p>
        <p>${event.location}</p>
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

const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {

    event.preventDefualt();
    const events = {
        name: form.eventName.value,
        date: form.date.value,
        description: form.description.value,
        location: form.location.value,
    };

    await addEvent(events);
    render();
}


)