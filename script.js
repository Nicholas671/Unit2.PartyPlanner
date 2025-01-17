const COHORT = "2412-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

//state//

const state = {
    events: [],
};


//create a get events async function//

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}

//ask the API to add events//

async function addEvent(eventDate) {
    try {
        // const dateWithTime = event.date + "T00:00:00Z";
        const date = new Date(eventDate);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventDate),
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

//render the events, now with buttons!//

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
        <p>${event.time}</p>
        <p>${event.description}</p>
        <p>${event.location}</p>
        <button class="delete-button">Delete</button>
        `;


        return card;
    });

    eventsList.replaceChildren(...eventsCard);
}

//sync and render//

async function render() {
    await getEvents();
    renderEvents();
}

//initial render//

render();
console.log(state)

//add event with gusto//

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const date = form.date.value;
    const time = form.time.value;
    const datetimeString = new Date(`${date}T${time}`);

    const newEvent = {
        name: form.partyName.value,
        date: datetimeString,
        description: form.description.value,
        location: form.location.value,
    };

    await addEvent(newEvent);
    render();
});

//delete event with extreme prejudice//
//this was extremely difficult to get working and a lot of googling, reading, and repeating was used.


const list = document.getElementById("events-list");
list.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-button")) {
        const eventElement = event.target.parentNode;
        const eventId = eventElement.id.split('-')[1];

        try {
            const response = await fetch(`${API_URL}/${eventId}`, {
                method: 'DELETE',
            });

            console.log("Response Status:", response.status); // Check this in your browser's console

            if (response.ok) {

                // Checks for 200-299 status codes (success)//

                if (response.status === 204) { // No content, successful delete
                    console.log("Resource deleted successfully (No Content)");
                } else {

                    // The server is sending a body, maybe JSON//

                    const json = await response.json();
                    console.log("Json received:", json);
                    if (json.error) {
                        throw new Error(json.error.message);
                    }
                }

                // Remove from the DOM//

                eventElement.remove();
                state.events = state.events.filter(event => event.id !== parseInt(eventId));
            } else {
                // Handle errors based on status code
                const errorText = await response.text()
                console.error("Request failed with status:", response.status, " - ", errorText);
                throw new Error(`Request failed with status: ${response.status}. Message: ${errorText}`)
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }

        console.log(state);
    }

});