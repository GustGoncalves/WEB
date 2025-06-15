// Player global
let currentAudio = null;
let currentTrackIndex = -1;
let tracks = [];
let isPlaying = false;

// Elementos do DOM
const spotifyPlayer = document.getElementById('spotify-player');
const currentTrackCover = document.getElementById('current-track-cover');
const currentTrackTitle = document.getElementById('current-track-title');
const currentTrackArtist = document.getElementById('current-track-artist');
const playPauseIcon = document.getElementById('play-pause-icon');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const volumeControl = document.getElementById('volume-control');

// Inicializa os players de áudio da página
function initAudioPlayers() {
    // Encontra todos os elementos de áudio na página
    const audioElements = document.querySelectorAll('audio');

    audioElements.forEach((audio, index) => {
        // Adiciona ao array de tracks
        tracks.push({
            audio: audio,
            cover: audio.closest('.card').querySelector('img').src,
            title: audio.closest('.card').querySelector('.card-title').textContent,
            artist: audio.closest('.card').querySelector('.card-text').textContent
        });

        // Adiciona evento de clique para tocar a música
        const card = audio.closest('.card');
        card.addEventListener('click', (e) => {
            // Evita que o evento seja disparado quando clicar no próprio áudio
            if (e.target.tagName !== 'AUDIO' && !e.target.closest('audio')) {
                playTrack(index);
            }
        });

        // Atualiza a barra de progresso
        audio.addEventListener('timeupdate', () => {
            if (currentAudio === audio) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.value = progress;
                currentTimeDisplay.textContent = formatTime(audio.currentTime);
            }
        });

        // Quando a música termina
        audio.addEventListener('ended', () => {
            if (currentAudio === audio) {
                nextTrack();
            }
        });

        // Carrega metadados
        audio.addEventListener('loadedmetadata', () => {
            if (currentAudio === audio) {
                durationDisplay.textContent = formatTime(audio.duration);
            }
        });
    });

    // Configura controles do player
    progressBar.addEventListener('input', () => {
        if (currentAudio) {
            const seekTime = (progressBar.value / 100) * currentAudio.duration;
            currentAudio.currentTime = seekTime;
        }
    });

    volumeControl.addEventListener('input', () => {
        if (currentAudio) {
            currentAudio.volume = volumeControl.value;
        }
    });
}

// Toca uma faixa específica
function playTrack(index) {
    // Para a música atual se estiver tocando
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
    }

    // Define a nova música
    currentTrackIndex = index;
    const track = tracks[index];
    currentAudio = track.audio;

    // Atualiza a UI do player
    currentTrackCover.src = track.cover;
    currentTrackTitle.textContent = track.title;
    currentTrackArtist.textContent = track.artist;
    durationDisplay.textContent = formatTime(currentAudio.duration);

    // Toca a música
    currentAudio.play();
    isPlaying = true;
    playPauseIcon.className = 'bi bi-pause-fill fs-2';

    // Mostra o player se estiver escondido
    spotifyPlayer.classList.remove('d-none');
}

// Pausa/continua a reprodução
function togglePlay() {
    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play();
            isPlaying = true;
            playPauseIcon.className = 'bi bi-pause-fill fs-2';
        } else {
            currentAudio.pause();
            isPlaying = false;
            playPauseIcon.className = 'bi bi-play-fill fs-2';
        }
    }
}

// Próxima faixa
function nextTrack() {
    if (tracks.length > 0) {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        playTrack(nextIndex);
    }
}

// Faixa anterior
function previousTrack() {
    if (tracks.length > 0) {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        playTrack(prevIndex);
    }
}

// Formata o tempo (mm:ss)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Inicializa o player quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initAudioPlayers);