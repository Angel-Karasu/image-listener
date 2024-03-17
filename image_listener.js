export {audio_ctx, image_listener}

import {RGBA} from "./image_processing.js";

let audio_ctx, gain, oscillator;

const RGB_frequencies = new RGBA(700, 600, 450);

const min_frequency = 20;
const max_volume = 1;

const oscillator_type = 'sine';

const pixel_interval_time = 0.1;

function compressed_RGBA_array_to_audio(compressed_RGBA_array) {
    audio_ctx = new AudioContext();
    gain = audio_ctx.createGain();
    oscillator = audio_ctx.createOscillator();
    
    oscillator.type = oscillator_type;

    compressed_RGBA_array.reduce((start_time, compressed_rgba) => {
        gain.gain.setValueAtTime(max_volume * compressed_rgba.rgba.alpha/255, start_time);

        oscillator.frequency.setValueAtTime(
            min_frequency + ['red', 'green', 'blue'].map(
                color => RGB_frequencies[color]*compressed_rgba.rgba[color]/255
            ).reduce((acc, val) => acc += val, 0)/3,
        start_time);

        return start_time + compressed_rgba.number * pixel_interval_time;
    }, 0);
        
    gain.connect(audio_ctx.destination);
    oscillator.connect(gain);
}

function image_listener(compressed_RGBA_array) {
    compressed_RGBA_array_to_audio(compressed_RGBA_array);

    oscillator.start(0);
}