const PlayerController = require('media-player-controller');
const { dialog } = require('electron').remote;
const io = require('socket.io-client');
const socket = io('https://socket-watch-express.herokuapp.com');
//const socket = io('http://localhost:3000');
const humanizeDuration = require('humanize-duration')

let urlInput = document.getElementById('url-input');
let time = document.getElementById('time');
let slider = document.getElementById('seekbar');
let launched = false;

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
});

socket.on('seek cmd', function(msg) {
    player.seek(msg);
});

socket.on('vlc cmd', function(msg) {
    console.log(msg);
    switch (msg) {
        case 'play':
            player.play();
            break;
        case 'pause':
            player.pause();
            break;
        case 'cycleAudio':
            player.cycleAudio();
            break;
        case 'load':
            player.load(urlInput.value);
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
            if (!launched) {
                player.opts.media = result.filePaths[0];
                launchPlayer();
                launched = true;
                return;
            }
            player.load(result.filePaths[0]);
        }
    }).catch(err => {
        console.log(err)
    });
}

function load(mediaPath) {
    //player.load(mediaPath);
    //socket.emit('vlc cmd', 'load');
}

function play() {
    //player.play();
    socket.emit('vlc cmd', 'play');
}

function pause() {
    //player.pause();
    socket.emit('vlc cmd', 'pause');
}

function cycleAudio() {
    //player.cycleAudio();
    socket.emit('vlc cmd', 'cycleAudio');
}

function cycleSubs() {
    //player.cycleSubs();
    socket.emit('vlc cmd', 'cycleSubs');
}

function cycleFullscreen() {
    //player.cycleFullscreen();
    socket.emit('vlc cmd', 'cycleFullscreen');
}

function seek(seconds) {
    //player.seek(seconds);
    socket.emit('seek cmd', seconds);
}

/* Path to file or link. Can be changed anytime without creating new player objects */

function launchPlayer() {
    player.launch(err => {
        if (err) {
            console.error(err.message);
        }
    });
}


player.on('playback', (data) => {
    if (data.name === 'time-pos') {
        time.innerText = humanizeDuration(data.value * 1000);
        slider.value = data.value;
    }
    if (data.name === 'duration') slider.max = data.value;
});

player.on('app-exit', (code) => {
    launched = false;
});