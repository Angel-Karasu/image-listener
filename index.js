import image_listener from "./image_listener.js";

let img_uploaded;
let img_upload_file;
let img_upload_url;
let listen_button;

function listen_img() {
    image_listener(img_uploaded);
}

function load_img(img_upload) {
    let img = img_upload.value;
    if (img) {
        if (img_upload.files) {
            img = URL.createObjectURL(img_upload.files[0]);
            img_upload_url.value = '';
        } else img_upload_file.value = '';

        img_uploaded.src = img;
    }
}

window.onload = () => {
    img_uploaded = document.querySelector('#img-uploaded');
    img_upload_file = document.querySelector('#img-upload-file');
    img_upload_url = document.querySelector('#img-upload-url');
    listen_button = document.querySelector('#listen-button');
    
    [img_upload_file, img_upload_url].forEach(img_upload => {
        img_upload.addEventListener('change', e => load_img(e.target));
        load_img(img_upload);
    });
    
    listen_button.addEventListener('click', listen_img);

    img_uploaded.onload = () => listen_button.style.display = '';
}