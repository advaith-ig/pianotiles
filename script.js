let score = 0;
const columns = [
    document.getElementById('col1'),
    document.getElementById('col2'),
    document.getElementById('col3'),
    document.getElementById('col4')
];
const keys = ['a', 's', 'd', 'f'];
let activeTiles = [];
let intervalvary = 900;
let tileGenerationTimeout;
let isGameOver = false;

const noteSequence = []; //order change
let currentNoteIndex = 0;

function generateTile() {
    if (isGameOver) return;

    const randomColumn = Math.floor(Math.random() * 4);
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.column = randomColumn;
    tile.style.top = '0px';
    columns[randomColumn].appendChild(tile);
    activeTiles.push({ element: tile, interval: moveTile(tile) });
    intervalvary = Math.max(320, intervalvary - 10);
    tileGenerationTimeout = setTimeout(generateTile, intervalvary);
}

let sec = 50;
function moveTile(tile) {
    let position = 0;
    if (sec > 20) sec = sec - 0.75;
    const interval = setInterval(() => {
        position += 7;
        tile.style.top = position + 'px';

        if (position > 600) {
            clearInterval(interval);
            tile.remove();
            activeTiles = activeTiles.filter(t => t.element !== tile);
            endGame();
        }
    }, sec);
    return interval;
}

function checkKeyPress(event) {
    if (isGameOver) return; 

    const columnIndex = keys.indexOf(event.key.toLowerCase());
    if (columnIndex !== -1) {
        const audioIndex = noteSequence[currentNoteIndex % 50];
        const audioElement = document.getElementById(`audio${audioIndex}`);

        if (audioElement) {
            audioElement.currentTime = 0; // Reset audio to start
            audioElement.play();
            console.log(`Playing audio index: ${audioIndex}`);
        } else {
            console.error(`Audio element not found for index: ${audioIndex}`);
        }

        const tilesInColumn = Array.from(columns[columnIndex].getElementsByClassName('tile'));
        if (tilesInColumn.length >= 0) {
            const tile = tilesInColumn[0];
            const oldestTile = activeTiles[0];

            if (oldestTile && oldestTile.element === tile) {
                clearInterval(oldestTile.interval);

                const keyElement = document.getElementById(keys[columnIndex].toUpperCase());
                if (keyElement) {
                    keyElement.style.backgroundColor = 'white'; //  C O L O R

                    setTimeout(() => {
                        keyElement.style.backgroundColor = '';
                    }, 100);
                }

                tile.style.transition = 'opacity 0.05s, border-color 0.05s';

                setTimeout(() => {
                    tile.remove();
                }, 50);

                activeTiles.shift();

                score++;
                document.getElementById('score').innerText = score;

                currentNoteIndex = (currentNoteIndex + 1) % noteSequence.length;
            } else {
                endGame();
            }
        }
    }
}

function endGame() {
    isGameOver = true;
    activeTiles.forEach(({ interval }) => clearInterval(interval));
    activeTiles = [];

    clearTimeout(tileGenerationTimeout);

    document.getElementById('final-score').innerText = score;

    document.getElementById('game-over-popup').classList.remove('hidden');
}

document.getElementById('try-again-button').addEventListener('click', () => {
    
    score = 0;
    document.getElementById('score').innerText = score;

    document.getElementById('game-over-popup').classList.add('hidden');
    position = 0;
    sec = 50;
    intervalvary = 900;
    activeTiles = [];
    isGameOver = false;
    currentNoteIndex = 0; 
//  RESTART
    setTimeout(generateTile, intervalvary);
    location.reload();
});

// generate
setTimeout(generateTile, intervalvary);

window.addEventListener('keydown', checkKeyPress);
