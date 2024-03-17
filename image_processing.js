export {image_processing, RGBA};

const canvas_ctx = document.createElement('canvas').getContext('2d');

class RGBA {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;

        this.equals = rgba => ['red', 'green', 'blue', 'alpha'].reduce((equal, color) => equal && this[color] == rgba[color], true);
    }
}

class Compressed_RGBA {
    constructor(rgba, number=1) {
        this.rgba = rgba;
        this.number = number;
    }
}

const compress_RGBA_array = rgba_array => rgba_array.reduce(
    (compressed_rgba_array, rgba) => {
        const last_compressed_rgba = compressed_rgba_array.slice(-1)[0];

        if (rgba.equals(last_compressed_rgba.rgba)) last_compressed_rgba.number++;
        else compressed_rgba_array.push({'rgba': rgba, 'number': 1});

        return compressed_rgba_array;
    }, [new Compressed_RGBA(rgba_array[0], 0)]
);

const img_data_to_RGBA_array = img_data => img_data.length % 4 ? null : [...Array(img_data.length/4)].map(
    (_, i) => new RGBA(...img_data.slice(i*4, (i+1)*4))
);

function image_processing(img) {
    canvas_ctx.drawImage(img, 0, 0);

    console.log(canvas_ctx.getImageData(0, 0, img.width, img.height));

    return compress_RGBA_array(img_data_to_RGBA_array(canvas_ctx.getImageData(0, 0, img.width, img.height).data));
}