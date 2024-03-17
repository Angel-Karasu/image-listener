import {audio_ctx, image_listener} from "./image_listener.js";
import {image_processing, RGBA} from "./image_processing.js";

let img_uploaded, img_upload_file, img_upload_url,
    listen_button, stop_button,
    time_pixel, volume;

const change_range_value = input => input.parentElement.querySelector('span').textContent = Math.round(input.value*100)/100;

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
}

function load_img(img_upload) {
    if (img_upload.value) {
        if (img_upload.files) {
            img_uploaded.src = URL.createObjectURL(img_upload.files[0]);
            img_upload_url.value = '';
        } else {
            fetch(img_upload.value).then(resp => resp.blob()).then(blob => new Promise(res => {
                const reader = new FileReader();
                reader.onloadend = () => res(reader.result);
                reader.readAsDataURL(blob);
            })).then(img => {
                img_uploaded.src = img;
                img_upload_file.value = '';
            });
        };
    }
}

function stop_listening() {
    if (!stop_button.disabled) audio_ctx.close();
    listen_button.disabled = false;
    stop_button.disabled = true;
}

window.onload = () => {
    img_uploaded = document.querySelector('#img-uploaded');
    img_upload_file = document.querySelector('#img-upload-file');
    img_upload_url = document.querySelector('#img-upload-url');

    listen_button = document.querySelector('#listen-button');
    stop_button = document.querySelector('#stop-button');

    time_pixel = document.querySelector('#time-pixel');
    volume = document.querySelector('#volume');

    img_uploaded.onload = () => {
        listen_button.disabled = false;
        stop_listening();
    };
    
    [img_upload_file, img_upload_url].forEach(img_upload => {
        img_upload.onchange = () => load_img(img_upload);
        load_img(img_upload);
    });
    
    listen_button.onclick = listen_img;
    stop_button.onclick = stop_listening;

    [time_pixel, volume].forEach(input => {
        input.oninput = () => change_range_value(input);
        change_range_value(input);
    });
}