import './main.css';
import html from './main.html';
import Tileset from "lib/src/components/Graphic/Tileset";
import u from "lib/src/static";
import positionMouse from "lib/src/static/positionMouse";

class MainComponent {

    /** @type {HTMLElement} */
    #root;
    /** @type {HTMLElement} */
    #html;
    /** @type {CanvasRenderingContext2D} */
    context;

    elements = {control: null, tile_w: null, tile_h: null, size_w: null, size_h: null, resize_w: null, resize_h: null, file: null, ico_file: null, withnumber: null, onsplit: null, color: null, onalpha: null, tile: null, canvas: null, tiles: null};

    constructor(state) {
        this.#root = state.elements.root;
        this.#html = document.createRange().createContextualFragment(html).firstElementChild;
        this.elements = u.searchAttr('data-id', this.#html);
        this.context = this.elements.canvas.getContext("2d");
    }

    render() {
        this.#root.append(this.#html);
        this.uploadFile();
        this.splitSprite();
        this.alphaSprite();
    }

    sprite2base64(tiles) {
        tiles.addEventListener('click', (event) => {
            const tile = event.srcElement;
            if (tile instanceof HTMLCanvasElement) {
                this.elements.base64.textContent = tile.toDataURL();
            }
        })
    }


    toString() {
        return 'MainComponent';
    }

    uploadFile() {
        this.elements['ico_file'].addEventListener('click', () =>  this.elements['file'].click());
        this.elements['file'].onchange = (evt) => {
            const files = evt.target.files;
            if (FileReader && files && files.length) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const img = new Image();
                    img.onload = () => {
                        this.context.canvas.width = img.width;
                        this.context.canvas.height = img.height;
                        this.elements.tile_w.value = img.width;
                        this.elements.tile_h.value = img.height;
                        this.context.drawImage(img, 0, 0);
                    };
                    img.src = fileReader.result;
                };
                fileReader.readAsDataURL(files[0]);
            }
        };
    }

    splitSprite() {
        this.elements.onsplit.addEventListener('click', () =>  {
            const tile = new Tileset(
                this.elements.canvas,
                parseInt(this.elements.size_w.value),
                parseInt(this.elements.size_h.value)
            )
            const sprites = tile.debug_sprite_list(this.elements.withnumber.checked);
            this.elements.tiles.textContent = '';
            sprites.forEach((sprite) => {
                this.elements.tiles.append(
                    tile.resize(sprite,
                        parseInt(this.elements.resize_w.value),
                        parseInt(this.elements.resize_h.value))
                );
            });
            this.sprite2base64(this.elements.tiles);
        });
    }

    alphaSprite() {
        const canvas = this.elements.canvas;
        let px = null;

        canvas.addEventListener('click', (event) => {
            const pos = positionMouse(event);
            px = this.context.getImageData(pos.x, pos.y, 1, 1);
            this.elements.x.textContent = parseInt(pos.x);
            this.elements.y.textContent = parseInt(pos.y);
            const color = `rgba(${px.data[0]}, ${px.data[1]}, ${px.data[2]}, ${px.data[3]})`;
            u.stylizer(this.elements.color, { backgroundColor: color });
            this.elements.color_rgb.textContent = color;
        });

        this.elements['onalpha'].addEventListener('click', () =>  {
            const idata = this.context.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < idata.data.length; i += 4) {
                if (
                    idata.data[i + 0] === px.data[0]
                    &&
                    idata.data[i + 1] === px.data[1]
                    &&
                    idata.data[i + 2] === px.data[2]
                ) {
                    idata.data[i + 3] = 0;
                }
            }
            this.context.putImageData(idata, 0, 0);
        });
    }
}

export default MainComponent;