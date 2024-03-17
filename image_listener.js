export {audio_ctx, image_listener};

let audio_ctx, gain, oscillator;

function image_listener(compressed_RGBA_array, time_pixel, rgb_frequencies, min_sound_frequency, volume, type) {
    audio_ctx = new(window.AudioContext || window.webkitAudioContext)();
    gain = audio_ctx.createGain();
    oscillator = audio_ctx.createOscillator();

    if (time_pixel <= 0) time_pixel = 0.2;
    [['red', 700], ['green', 600], ['blue', 450]].forEach(([color, frequency]) => {
        if (rgb_frequencies[color] < 400 || 800 < rgb_frequencies[color]) rgb_frequencies[color] = frequency;
    });
    if (min_sound_frequency < 20 || 20000 < min_sound_frequency) min_sound_frequency = 20;
    if (volume <= 0) volume = 0.5;
    if (!['sawtooth', 'sine', 'square', 'triangle'].includes(type)) type = 'sine';

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
}