const ctx = document.createElement('canvas').getContext('2d');

class RGBA {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

function imageData_to_RGBA_array(img_data){
    return img_data.length % 4 == 0 ? [...Array(img_data.length/4)].map((_, i) => new RGBA(...img_data.slice(i*4, (i+1)*4))) : null;
}

export default function image_processing(img) {
    ctx.drawImage(img, 0, 0);
    
    return imageData_to_RGBA_array(ctx.getImageData(0, 0, img.width, img.height).data);
}