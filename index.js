import image_processing from "./img_processing.js";

let img_upload_file;
let img_upload_url;

const show_img = url => {
    document.querySelector('#img-uploaded').src = url;
    document.querySelector('#img-uploaded').onload = () =>
        image_processing(document.querySelector('#img-uploaded'));
};

function load_img_file() {
    const img_file = img_upload_file.files[0];
    if (img_file) {
        show_img(URL.createObjectURL(img_file));
        document.querySelector('#img-upload-url').value = '';
    }
}

function load_img_url() {
    const img_url = img_upload_url.value;
    if (img_url) {
        show_img(img_url);
        document.querySelector('#img-upload-file').value = '';
    }
}

window.onload = () => {
    img_upload_file = document.querySelector('#img-upload-file');
    img_upload_url = document.querySelector('#img-upload-url');
    
    ['change', 'drop'].forEach(event => img_upload_file.addEventListener(event, load_img_file));
    img_upload_url.addEventListener('change', load_img_url);
    
    load_img_file();
    load_img_url();
}