import {audio_ctx, image_listener} from "./image_listener.js";
import {image_processing} from "./image_processing.js";

let img_uploaded, img_upload_file, img_upload_url,
    listen_button, stop_button;

function listen_img() {
    const compressed_RGBA_array = image_processing(img_uploaded);
    stop_listening();
    stop_button.disabled = false;
    image_listener(compressed_RGBA_array);
}

function load_img(img_upload) {
    if (img_upload.value) {
        if (img_upload.files) {
            img_uploaded.src = URL.createObjectURL(img_upload.files[0]);
            img_upload_url.value = '';
        } else {
            fetch(img_upload.value).then(resp => resp.blob()).then(blob => new Promise((res, err) => {
                const reader = new FileReader();
                reader.onloadend = () => res(reader.result);
                reader.onerror = err;
                reader.readAsDataURL(blob);
            })).then(img => img_uploaded.src = img);
        };
    }
}

function stop_listening() {
    if (!stop_button.disabled) audio_ctx.close();
    stop_button.disabled = true;
}

window.onload = () => {
    img_uploaded = document.querySelector('#img-uploaded');
    img_upload_file = document.querySelector('#img-upload-file');
    img_upload_url = document.querySelector('#img-upload-url');

    listen_button = document.querySelector('#listen-button');
    stop_button = document.querySelector('#stop-button');
    
    [img_upload_file, img_upload_url].forEach(img_upload => {
        img_upload.onchange = () => load_img(img_upload);
        load_img(img_upload);
    });
    
    listen_button.onclick = listen_img;
    stop_button.onclick = stop_listening;

    img_uploaded.onload = () => {
        listen_button.disabled = false;
        stop_listening();
    };
}