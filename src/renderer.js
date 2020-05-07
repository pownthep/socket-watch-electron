const PlayerController = require('media-player-controller');
const { dialog } = require('electron').remote;

let urlInput = document.getElementById('url-input');

var player = new PlayerController({
    app: 'vlc'
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

urlInput.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        load(event.target.value);
    }
});

function load(mediaPath) {
    player.load(mediaPath);
}

function cyclePause() {
    player.cyclePause();
}

function cycleAudio() {
    player.cycleAudio();
}

function cycleSubs() {
    player.cycleSubs();
}

function cycleFullscreen() {
    player.cycleFullscreen();
}

/* Path to file or link. Can be changed anytime without creating new player objects */
player.opts.media = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

player.launch(err => {
    if (err) {
        console.error(err.message);
    }
});

player.on('playback', console.log);