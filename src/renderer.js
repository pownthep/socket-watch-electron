const PlayerController = require('media-player-controller');
const { dialog } = require('electron').remote;
const io = require('socket.io-client');
const socket = io('http://localhost:3000');

let urlInput = document.getElementById('url-input');
let time = document.getElementById('time');

var player = new PlayerController({
    app: 'vlc'
});

urlInput.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        load(event.target.value);
    }
    socket.emit('url input', event.target.value);
});

socket.on('url input', function(msg) {
    urlInput.value = msg;
    load(urlInput.value);
});

socket.on('vlc cmd', function(msg) {
    switch (msg) {
        case 'cyclePause':
            player.cyclePause();
            break;
        case 'cycleAudio':
            player.cycleAudio();
            break;
        case 'cycleSubs':
            player.cycleSubs();
            break;
        case 'cycleFullscreen':
            player.cycleFullscreen();
            break;
        default:
            break;
    }
});

function selectMedia() {
    dialog.showOpenDialog({
        title: 'Please select a media file',
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            console.log(result);
            load(result.filePaths[0]);
        }
    }).catch(err => {
        console.log(err)
    });
}

function load(mediaPath) {
    player.load(mediaPath);
}

function play() {
    player.play();
    socket.emit('vlc cmd', 'play');
}

function pause() {
    player.pause();
    socket.emit('vlc cmd', 'pause');
}

function cycleAudio() {
    player.cycleAudio();
    socket.emit('vlc cmd', 'cycleAudio');
}

function cycleSubs() {
    player.cycleSubs();
    socket.emit('vlc cmd', 'cycleSubs');
}

function cycleFullscreen() {
    player.cycleFullscreen();
    socket.emit('vlc cmd', 'cycleFullscreen');
}

/* Path to file or link. Can be changed anytime without creating new player objects */
player.opts.media = 'https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4';

player.launch(err => {
    if (err) {
        console.error(err.message);
    }
});


function timer(data) {
    if (data.name === 'time-pos') time.innerText = data.value;
}
player.on('playback', function(data) {
    if (data.name === 'time-pos') time.innerText = data.value;
});