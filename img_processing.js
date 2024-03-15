const ctx = document.createElement('canvas').getContext('2d');

class RGBA {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

const imageData_to_RGBA_list = img_data => [...Array(img_data.length/4)].map((_, i) => new RGBA(...img_data.slice(i*4, (i+1)*4)));

export default function image_processing(img) {
    ctx.drawImage(img, 0, 0);

    const img_data = ctx.getImageData(0, 0, img.width, img.height).data;
    console.log(img_data);

    imageData_to_RGBA_list(img_data);
}