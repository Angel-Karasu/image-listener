import {audio_ctx, frequency_methods, image_listener} from "./image_listener.js";
import {image_processing, RGBA} from "./image_processing.js";

let img_uploaded, img, img_width, img_height, img_upload_file,
    options_checkbox, options,
    time_pixel, frequency_method, volume,
    listen_button, stop_button,
    time, total_time;

let compressed_RGBA_array, stop_timeout;

const format_seconds = seconds => new Date(seconds*1000).toISOString().substring(11, 22).split('00:').slice(-1)[0];

const change_total_time = () => {
    total_time.value = img.naturalWidth * img.naturalHeight * time_pixel.value;
    total_time.textContent = format_seconds(total_time.value);
};

function display_time() {
    if (audio_ctx && audio_ctx.state != 'closed') {
        time.textContent = format_seconds(audio_ctx.currentTime);
        requestAnimationFrame(display_time);
    }
}

function listen_img() {
    stop_listening();
    listen_button.disabled = true;
    stop_button.disabled = false;
    image_listener(
        frequency_method.value,
        compressed_RGBA_array,
        +time_pixel.value,
        new RGBA(...Array.from(document.querySelectorAll('.rgb-frequency')).map(input => +input.value)),
        +document.querySelector('#min-sound-frequency').value,
        volume.value/100,
        +document.querySelector('#type').value,
    );
    stop_timeout = setTimeout(stop_listening, total_time.value*1000);
    display_time();
}

function stop_listening() {
    if (audio_ctx && audio_ctx.state != 'closed') audio_ctx.close();
    if (stop_timeout) clearTimeout(stop_timeout);
    listen_button.disabled = false;
    stop_button.disabled = true;
}

window.onload = () => {
    img_uploaded = document.querySelector('#img-uploaded');
    img = img_uploaded.querySelector('img');
    img_width = img_uploaded.querySelector('#width');
    img_height = img_uploaded.querySelector('#height');
    img_upload_file = document.querySelector('#img-upload-file');
    
    options_checkbox = document.querySelector('#options-checkbox');
    options = document.querySelector('#options');

    time_pixel = document.querySelector('#time-pixel');
    frequency_method = document.querySelector('#frequency-method');
    volume = document.querySelector('#volume');

    listen_button = document.querySelector('#listen-button');
    stop_button = document.querySelector('#stop-button');

    time = document.querySelector('#time');
    total_time = document.querySelector('#total-time');

    img.onload = () => {
        img_uploaded.style.display = '';
        img_width.textContent = img.naturalWidth;
        img_height.textContent = img.naturalHeight;
        listen_button.disabled = true;
        compressed_RGBA_array = image_processing(img);
        change_total_time();
        stop_listening();
    };
    
    img_upload_file.onchange = () => {if (img_upload_file.value) img.src = URL.createObjectURL(img_upload_file.files[0])};
    img_upload_file.onchange();

    options_checkbox.onchange = () => options.style.display = options_checkbox.checked ? '' : 'none';
    options_checkbox.onchange();

    time_pixel.onchange = change_total_time;
    [time_pixel, volume].forEach(input => {
        input.oninput = () => input.parentElement.querySelector('span').textContent = (+input.value).toFixed(2);
        input.oninput();
    });

    Object.keys(frequency_methods).forEach((key) => {
        let option = document.createElement('option');
        option.value = key;
        option.innerHTML = `RGB to ${key} frequency`;

        frequency_method.appendChild(option);
    });
    frequency_method.onchange = () => {
        Array.from(document.querySelectorAll('.rgb-frequency')).forEach(rgb_frequency => {
            rgb_frequency.parentElement.querySelector('span').textContent = frequency_method.value;

            rgb_frequency.min = frequency_methods[frequency_method.value].min_rgb_frequency;
            rgb_frequency.value = frequency_methods[frequency_method.value].base_rgb_frequencies[rgb_frequency.id];
            rgb_frequency.placeholder = frequency_methods[frequency_method.value].base_rgb_frequencies[rgb_frequency.id];
            rgb_frequency.max = frequency_methods[frequency_method.value].max_rgb_frequency;
        });
    };
    frequency_method.onchange();
    
    listen_button.onclick = listen_img;
    stop_button.onclick = stop_listening;
}