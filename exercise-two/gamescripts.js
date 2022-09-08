document.getElementById("name").innerHTML = "Good luck " + localStorage.getItem("name") + " 😀";
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

   
    const emojis = ['🗼','😀','🗿','🗽','🥳','😡','🥵','🤖','💩','☠️','🧠','🧑‍💻',
                    '🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍', '😄','💗']


    const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board">
        <div class="container">
            <div class="row">
        
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
            </div>
            </div>
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
    state.gameStarted = true
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
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        selectors.win.hidden = false
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
            <div class="container middle">
                <div class="row">
                    <div class="win-text">
                        ${localStorage.getItem("name")} you won!<br />
                        It took you: <br/>
                        🥳 ${state.totalFlips} moves 🥳<br />
                        🧠 ${state.totalTime} seconds 🧠<br />
                        You're a Champion! 
                        <button type="button" class="btn btn-outline-primary restart_game">Restart Game</button>
                    </div>
                </div>
            </div>
            `

            clearInterval(state.loop)
        }, 1000)
        selectors.moves.remove()
        selectors.timer.remove()
        selectors.navbar.remove()
        selectors.board.remove()
        document.querySelector('.board').remove()
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