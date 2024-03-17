import {audio_ctx, image_listener} from "./image_listener.js";
import {image_processing, RGBA} from "./image_processing.js";

let img_uploaded, img_upload_file,
    options_checkbox, options, time_pixel, volume,
    listen_button, stop_button,
    time, total_time;

let stop_timeout;

const change_range_value = input => input.parentElement.querySelector('span').textContent = (+input.value).toFixed(2);

const format_seconds = seconds => new Date(seconds*1000).toISOString().substring(11, 22).split('00:').slice(-1)[0];

const change_total_time = () => {
    total_time.value = img_uploaded.naturalWidth * img_uploaded.naturalHeight * time_pixel.value;
    total_time.textContent = format_seconds(total_time.value);
};

const show_more_options = () => options.style.display = options_checkbox.checked ? '' : 'none';

function display_time() {
    if (audio_ctx && audio_ctx.state != 'closed') {
        time.textContent = format_seconds(audio_ctx.currentTime);
        requestAnimationFrame(display_time);
    }
}

function listen_img() {
    const compressed_RGBA_array = image_processing(img_uploaded);
    stop_listening();
    listen_button.disabled = true;
    stop_button.disabled = false;
    image_listener(
        compressed_RGBA_array,
        +time_pixel.value,
        new RGBA(...Array.from(document.querySelectorAll('.light-frequency')).map(input => +input.value)),
        +document.querySelector('#min-sound-frequency').value,
        volume.value/100,
        +document.querySelector('#type').value,
    );
    stop_timeout = setTimeout(stop_listening, total_time.value*1000);
    display_time();
}

function load_img() {
    if (img_upload_file.value) img_uploaded.src = URL.createObjectURL(img_upload_file.files[0]);
}

function stop_listening() {
    if (audio_ctx && audio_ctx.state != 'closed') audio_ctx.close();
    if (stop_timeout) clearTimeout(stop_timeout);
    listen_button.disabled = false;
    stop_button.disabled = true;
}

window.onload = () => {
    img_uploaded = document.querySelector('#img-uploaded');
    img_upload_file = document.querySelector('#img-upload-file');
    
    options_checkbox = document.querySelector('#options-checkbox');
    options = document.querySelector('#options');
    time_pixel = document.querySelector('#time-pixel');
    volume = document.querySelector('#volume');

    listen_button = document.querySelector('#listen-button');
    stop_button = document.querySelector('#stop-button');

    time = document.querySelector('#time');
    total_time = document.querySelector('#total-time');

    img_uploaded.onload = () => {
        img_uploaded.style.display = '';
        listen_button.disabled = false;
        stop_listening();
        change_total_time();
    };
    
    img_upload_file.onchange = load_img;
    load_img();

    options_checkbox.onchange = show_more_options;
    show_more_options();

    time_pixel.onchange = change_total_time;
    [time_pixel, volume].forEach(input => {
        input.oninput = () => change_range_value(input);
        change_range_value(input);
    });
    
    listen_button.onclick = listen_img;
    stop_button.onclick = stop_listening;
}