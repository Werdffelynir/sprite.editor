
export class CanvasSelector {
    constructor(baseCanvas) {
        this.baseCanvas = baseCanvas;
        this.baseCtx = baseCanvas.getContext('2d', { willReadFrequently: true });

        // Overlay для рамки
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.width = baseCanvas.width;
        this.overlayCanvas.height = baseCanvas.height;
        this.overlayCanvas.style.position = 'absolute';
        this.overlayCanvas.style.left = baseCanvas.offsetLeft + 'px';
        this.overlayCanvas.style.top = baseCanvas.offsetTop + 'px';
        this.overlayCanvas.style.pointerEvents = 'none';
        this.overlayCanvas.style.zIndex = 10;
        baseCanvas.parentNode.appendChild(this.overlayCanvas);
        this.overlayCtx = this.overlayCanvas.getContext('2d', { willReadFrequently: true });

        // Стани
        this.selecting = false;
        this.selectRectVisibly = false;
        this.start = null;
        this.end = null;
        this.dashOffset = 0;

        // Події
        this._bindEvents();

        // Анімація
        this._animateFrame = null;
        this._animate();
        this.mousemoves = new Set();
    }

    _bindEvents() {
        this.baseCanvas.addEventListener('mousedown', (e) => {
            const pos = this._getMousePos(e);
            this.start = pos;
            this.end = pos;
            this.selecting = true;
            // this.selectingRect = true;
        });

        this.baseCanvas.addEventListener('mousemove', (e) => {
            if (!this.selecting) return;
            // if (this.selectingVisiblt)
            this.end = this._getMousePos(e);
            this.mousemoves.forEach((callback) => {callback(this.start, this.end)});
        });

        window.addEventListener('mouseup', () => {
            if (this.selecting) {
                this.selecting = false;
                //this.selectingVisiblt = true;
            }
        });
    }

    _getMousePos(e) {
        const rect = this.baseCanvas.getBoundingClientRect();
        return {
            x: Math.floor((e.clientX - rect.left)),
            y: Math.floor((e.clientY - rect.top))
        };
    }

    _animate() {
        this._animateFrame = requestAnimationFrame(() => this._animate());

        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        if (!this.start || !this.end) return;
        // if (!this.start || !this.end || this.selecting === false) return;

        const x = Math.min(this.start.x, this.end.x);
        const y = Math.min(this.start.y, this.end.y);
        const w = Math.abs(this.start.x - this.end.x);
        const h = Math.abs(this.start.y - this.end.y);

        this.overlayCtx.setLineDash([6, 4]);
        this.overlayCtx.lineDashOffset = -this.dashOffset;
        this.overlayCtx.strokeStyle = 'white';
        this.overlayCtx.lineWidth = 1;
        this.overlayCtx.strokeRect(x, y, w, h);
        this.dashOffset += 1;
    }

    getSelectionBox() {
        if (!this.start || !this.end) return null;
        const x = Math.min(this.start.x, this.end.x);
        const y = Math.min(this.start.y, this.end.y);
        const width = Math.abs(this.start.x - this.end.x);
        const height = Math.abs(this.start.y - this.end.y);
        return { x, y, width, height };
    }

    copySelectionToNewCanvas() {
        const box = this.getSelectionBox();
        if (!box || box.width === 0 || box.height === 0) return null;

        const newCanvas = document.createElement('canvas');
        newCanvas.width = box.width;
        newCanvas.height = box.height;
        const newCtx = newCanvas.getContext('2d');

        newCtx.drawImage(
            this.baseCanvas,
            box.x, box.y, box.width, box.height,
            0, 0, box.width, box.height
        );

        return newCanvas;
    }

    destroy() {
        cancelAnimationFrame(this._animateFrame);
        this.overlayCanvas.remove();
    }
}
