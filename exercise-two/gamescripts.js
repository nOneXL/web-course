document.getElementById("name").innerHTML = "Good luck " + localStorage.getItem("name");
var num = localStorage.getItem("num");

function time(){


var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
setInterval(setTime, 1000);

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    }
    else {
        return valString;
    }
}
}


const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    controls: document.querySelector('.controls'),
    restart: document.querySelector('.btn.btn-outline-primary.restart_game'),
    win: document.querySelector('.win'),
    navbar: document.querySelector('.navbar.navbar-default')   
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}


const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < num/2; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')

   
    const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍', '😄','💗',
                    '🗼','😀','🗿','🗽','🥳','😡','🥵','🤖','💩','☠️','🧠','🧑‍💻']

    const images = [
        "icons8-binoculars-96",
        "icons8-box-80",
        "icons8-briefcase-64",
        "icons8-clock-64",
        "icons8-contacts-64",
        "icons8-dribbble-80",
        "icons8-facebook-80",
        "icons8-female-user-80",
        "icons8-google-plus-64",
        "icons8-hand-cursor-96",
        "icons8-home-80",
        "icons8-idea-96",
        "icons8-info-64",
        "icons8-instagram-96",
        "icons8-key-64",
        "icons8-linkedin-96",
        "icons8-menu-100",
        "icons8-music-96",
        "icons8-news-64",
        "icons8-no-80",
        "icons8-ok-64",
        "icons8-pinterest-64",
        "icons8-puzzle-64",
        "icons8-reddit-80",
        "icons8-settings-80",
        "icons8-twitter-64",
        "icons8-unavailable-64",
        "icons8-user-male-80"
    ]

    const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
    state.gameStarted = true
    // selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `time: ${state.totalTime} sec`
    }, 1000)
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            location.reload();
        }
    })
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')

            first_card = flippedCards[0].getElementsByClassName('card-back')[0]
            second_card = flippedCards[1].getElementsByClassName('card-back')[0]
            first_card.className = 'card-back matched'
            second_card.className = 'card-back matched'
            // .className('card-back matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <div class="win-text">
                    ${localStorage.getItem("name")} you won!<br />
                    It took you: <br/>
                     -- ${state.totalFlips} moves --<br />
                     -- ${state.totalTime} seconds --
                </div>
            `

            clearInterval(state.loop)
        }, 1000)
        selectors.moves.remove()
        selectors.timer.remove()
        selectors.navbar.remove()
        selectors.board.remove()
        selectors.controls.remove()
        selectors.restart.hidden = false;
        selectors.restart.disabled = false;
        startConfetti();
    }
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

generateGame()
attachEventListeners()