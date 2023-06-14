import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;


// this perticular loader function is for loading the chat it starts from an empty string and went to 3 dots and again reset
function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300)
}


// this typeText function is for the typig part to show that the bot is thinking about something while typing.
function typeText(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;

        } else {
            clearInterval(interval);
        }
    }, 20)
}


//this function generateUniqueId, in js or other programming languages, we create the unique id by using the current time and date.for randomness we use the random numbers and even hexadecimal numbers/strings.
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}


// this function chatStripe is for the whole messaging part of the app
// like value is the auto generated message by the AI 
// uniqueId is for various texts we are creating various random ids
// isAi for the img purpose we are using for the imp of ai-bot and client
// this are the parameters 
function chatStripe(isAi, value, uniqueId) {
    return (
        `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
               src="${isAi ? bot : user}"
               alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id="${uniqueId}">${value}</div>
        </div>
      </div>
    `
    )
}


// when we are submitting a form or query we will call this handleSubmit function.
const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    //for user's chatstripe
    //(for user the isAi is parameter is false)
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    // now to clear the text area input 
    form.reset();


    // bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId);

    // messageDiv.innerHTML = "..."
    loader(messageDiv)



    // So we already made the client end(frontend part) and the server end(backend part)
    // so we have to connect this both part. and have to fetch the data from the server side
    const response = await fetch('https://codex-ghre.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })


    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json(); // this is giving us the actual data from backend
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        // console.log({parsedData})

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err);
    }
}


form.addEventListener('submit', handleSubmit);

// for submiting it through enter key
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
})


// so this is for our frontend/client side part

// This code is creating a chatbot, it imports two SVG images for the user and bot profile pictures,,it then creates a form element and a chat container element .
// It then defines the function for loading,typing text,generating unique IDs, and creating chat stripes. The handle submit function is created to handle the form submission.It takes the users' input from the form,adds it to the chat container as a chatstripe and then fetches data from server to get the bot's response.Then the response is added to the chat container as another stripe.. then typed out using typeText().
// Finally an event listener is added to the both submit and keyup events on the form element..
