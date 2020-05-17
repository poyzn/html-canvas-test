class BackgroundItem {
    constructor(img, x = 0) {
        this.x = x
        this.img = img;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.x, 0);
    }
}

class Background {
    constructor(level = 1) {
        this.src = this.resolveBgImage(level);
        this.speed = 5;
        this.img = this.createImage()
        this.items = [new BackgroundItem(this.img)];
    }
    createImage() {
        const img = new Image();
        img.src = this.src;
        return img;
    }
    draw(ctx) {
        if (this.items.length < 2) {
            this.items = [...this.items, new BackgroundItem(this.img, this.items[0].x + this.img.width)];            
        }
        this.items.map(item => {
            item.draw(ctx)
            item.x -= this.speed;
        })
        this.items.map(item => {
            if (item.x <= 0 - this.img.width) { this.items.shift() }
        })
    }
    resolveBgImage(level) {
        if (level == 1) return 'assets/images/background.png';

        return 'assets/images/background.jpg';
    }
}

const c = document.getElementById('stage');
c.width = 800;
c.height = 600;
const ctx = c.getContext('2d');
const background = new Background(1);

function run() {
    ctx.clearRect(0, 0, c.width, c.height);
    background.draw(ctx)
    window.requestAnimationFrame(run);
}

document.addEventListener('DOMContentLoaded', function() {
    run()
})