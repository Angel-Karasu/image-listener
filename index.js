var img_upload_file;
var img_upload_url;

const _show_img = url => document.querySelector('#img-uploaded').src = url;

function load_img_file() {
    const img_file = img_upload_file.files[0];
    if (img_file) {
        _show_img(URL.createObjectURL(img_file));
        document.querySelector('#img-upload-url').value = '';
    }
}

function load_img_url() {
    const img_url = img_upload_url.value;
    if (img_url) {
        _show_img(img_url);
        document.querySelector('#img-upload-file').value = '';
    }
}

window.onload = () => {
    img_upload_file = document.querySelector('#img-upload-file');
    img_upload_url = document.querySelector('#img-upload-url');
    
    ['change', 'drop'].forEach(event => img_upload_file.addEventListener(event, () => load_img_file()));
    img_upload_url.addEventListener('change', () => load_img_url());
    
    load_img_file();
    load_img_url();
}