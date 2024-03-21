export {audio_ctx, frequency_methods, image_listener};

import {RGBA} from "./image_processing.js";

class Frequency_Method {
    constructor(name, min_rgb_frequency, base_rgb_frequencies, max_rgb_frequency, func) {
        this.name = name;

        this.min_rgb_frequency = min_rgb_frequency;
        this.base_rgb_frequencies = base_rgb_frequencies;
        this.max_rgb_frequency = max_rgb_frequency;

        this.func = func;
    }
};

function check_rgb_frequencies(frequency_method, rgb_frequencies) {
    ['red', 'green', 'blue'].forEach(color => {
        if (rgb_frequencies[color] < frequency_method.min_rgb_frequency || frequency_method.max_rgb_frequency < rgb_frequencies[color])
            rgb_frequencies[color] = frequency_method.base_rgb_frequencies[color];
    });
}

let audio_ctx;

const frequency_methods = {
    'light': new Frequency_Method(
        'RGB to light frequency',
        400,
        new RGBA(700, 600, 450),
        800,
        (compressed_RGBA_array, time_pixel, rgb_frequencies, min_sound_frequency, volume, type) => {
            let gain = audio_ctx.createGain();
            let oscillator = audio_ctx.createOscillator();

            const time = compressed_RGBA_array.reduce((start_time, compressed_rgba) => {
                gain.gain.setValueAtTime(volume * compressed_rgba.rgba.alpha/255, start_time);

                oscillator.frequency.setValueAtTime(
                    min_sound_frequency + ['red', 'green', 'blue'].map(
                        color => rgb_frequencies[color]*compressed_rgba.rgba[color]/255
                    ).reduce((acc, val) => acc += val, 0)/3,
                start_time);

                return start_time + compressed_rgba.number * time_pixel;
            }, 0);
            
            oscillator.type = type;
                
            gain.connect(audio_ctx.destination);
            oscillator.connect(gain);

            oscillator.start(0);
            oscillator.stop(time);
        },
    ),
};

function image_listener(frequency_method, compressed_RGBA_array, time_pixel, rgb_frequencies, min_sound_frequency, volume, type) {
    audio_ctx = new(window.AudioContext || window.webkitAudioContext)();

    if (!Object.keys(frequency_methods).includes(frequency_method)) frequency_method = 'light';

    if (time_pixel <= 0) time_pixel = 0.2;
    check_rgb_frequencies(frequency_methods[frequency_method], rgb_frequencies);
    if (min_sound_frequency < 20 || 20000 < min_sound_frequency) min_sound_frequency = 20;
    if (volume <= 0) volume = 0.5;
    if (!['sawtooth', 'sine', 'square', 'triangle'].includes(type)) type = 'sine';

    frequency_methods[frequency_method].func(compressed_RGBA_array, time_pixel, rgb_frequencies, min_sound_frequency, volume, type);
}