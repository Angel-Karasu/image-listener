const canvas_ctx = document.createElement('canvas').getContext('2d');

const min_frequency = 20;
const max_volume = 0.25;

const time_to_reach_max_vol = 0.5;
const max_vol_time = 0.5;
const time_to_reach_vol_0 = 0.25;

const oscillator_type = 'sine';

const pixel_interval_time = 0.5;

const RGB_frequencies = {
    'red': 700,
    'green': 600,
    'blue': 450,
}

class RGBA {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

function play_rgba(start_time, rgba) {
    const audio_ctx = new AudioContext();
    const gain = audio_ctx.createGain();
    const oscillator = audio_ctx.createOscillator();

    const end_time = start_time + time_to_reach_max_vol + max_vol_time + time_to_reach_vol_0;
    
    gain.gain.linearRampToValueAtTime(max_volume * rgba.alpha/255, start_time + time_to_reach_max_vol);
    gain.gain.linearRampToValueAtTime(0, end_time);
    
    oscillator.type = oscillator_type;
    oscillator.frequency.value = min_frequency + ['red', 'green', 'blue'].map(color => rgba[color]*RGB_frequencies[color]).reduce((acc, val) => acc += val, 0)/255;
        
    gain.connect(audio_ctx.destination);
    oscillator.connect(gain);

    oscillator.start(start_time);
    oscillator.stop(end_time);
}

export default function image_listener(img) {
    canvas_ctx.drawImage(img, 0, 0);
    const img_data = canvas_ctx.getImageData(0, 0, img.width, img.height).data;
    
    [...Array(img_data.length/4)].forEach((_, i) => play_rgba(i*pixel_interval_time, new RGBA(...img_data.slice(i*4, (i+1)*4))));
}