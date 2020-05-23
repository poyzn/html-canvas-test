class Box {
    constructor(ctx, props) {
        this.ctx    = ctx;
        this.posX   = ctx.canvas.clientWidth;
        this.posY   = 420;
        this.speed  = props.globalSpeed;
    }
    draw() {        
        this.posX -= this.speed;
        this.ctx.fillRect(this.posX, this.posY, 80, 80);
    }
    isCollision(charactor) {
        const distance = Math.sqrt(Math.pow(Math.abs(this.posX - character.posX), 2) + Math.pow(Math.abs(this.posY - character.posY), 2))
        return (distance < 110) ? true : false
    }
}

class BoxGenerator {
    constructor(ctx, props) {
        this.props  = props
        this.ctx    = ctx;
        this.num    = 2;
        this.boxes  = [];
    }
    run() {
        const boxes = this.boxes.filter(el => { if (el.posX > -100) return el });
        if (boxes.length < this.num) {
            if (Math.random() > 0.99) {
                boxes.push(new Box(this.ctx, this.props));
            }
        }
        boxes.map(el => el.draw(this.ctx));
        this.boxes = boxes;
    }
    checkCollisions(character) {
        this.boxes.map(box => {
            if (box.isCollision(character)) {
                console.log('collision')
            }
        })
    }
}

class Character {
    constructor(ctx, props) {
        this.props          = props
        this.ctx            = ctx
        this.jumped         = false;
        this.imageSrc       = 'assets/images/character.png';
        this.initialY       = 320
        this.posX           = 150
        this.posY           = this.initialY
        this.jumpLength     = 200;
        this.jumpHeight     = 150;
        this.jumpSpeed      = 8;
        this.imageFrames    = 4;
        this.frameHeight    = 0;
        this.frameWidth     = 0;
        this.frame          = 0;
        this.spriteShift    = 0;
        this.frameFreq      = props.characterFreq;
        this.img            = this.loadImage();
    }
    draw() {
        this.jumping();
        this.frameHeight = this.frameHeight || this.img.height;
        this.frameWidth = this.frameWidth || (this.img.width / this.imageFrames);
        const frame = this.findFrame();
        this.ctx.drawImage(this.img,
            frame, 0, this.frameWidth, this.frameHeight,
            this.posX, this.posY, this.frameWidth, this.frameHeight);
        }   
    findFrame() {
        this.frame += 1;
        if (!this.jumped && this.frame % this.frameFreq == 0) {
            this.spriteShift++;
            if (this.spriteShift >= this.imageFrames) this.spriteShift = 0;
        }
        return (this.spriteShift % this.imageFrames) * this.frameWidth;
    }
    jump() {
        if (this.jumped === true) return;
        
        this.spriteShift = 0;
        this.jumpX = 0 - this.delta();
        this.jumped = true;
    }
    jumping() {        
        if (this.jumpX > this.delta()) this.jumped = false;
        if (this.jumped == false) return; 

        this.posY = Math.pow(this.jumpX, 2)/this.jumpLength  + this.initialY - this.jumpHeight;
        this.jumpX += this.jumpSpeed
    }
    delta() {
        return Math.sqrt(this.jumpHeight * this.jumpLength)
    }
    loadImage() {
        const image = new Image()
        image.src = this.imageSrc;
        return image;
    }
}

class BackgroundItem {
    constructor(ctx, img, x = 0) {
        this.ctx    = ctx
        this.x      = x
        this.img    = img;
    }
    draw() {
        this.ctx.drawImage(this.img, this.x, 0);
    }
}

class Background {
    constructor(ctx, props, level = 1) {
        this.props  = props
        this.ctx    = ctx
        this.src    = this.resolveBgImage(level);
        this.speed  = props.globalSpeed;
        this.img    = this.createImage()
        this.items  = [new BackgroundItem(this.ctx, this.img)];
    }
    createImage() {
        const img = new Image();
        img.src = this.src;
        return img;
    }
    draw() {
        if (this.items.length < 2) {
            this.items = [...this.items, new BackgroundItem(this.ctx, this.img, this.items[0].x + this.img.width)];            
        }
        this.items.map(item => {
            item.draw()
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

// Initialize stage
const c = document.getElementById('stage');
c.width = 800;
c.height = 600;
const ctx = c.getContext('2d');

// Initialize objects
const stageProps = {
    globalSpeed: 15,
    characterFreq: 3
}
const background = new Background(ctx, stageProps);
const character = new Character(ctx, stageProps)
const boxGenerator = new BoxGenerator(ctx, stageProps)

// Run loop
function run() {
    window.addEventListener('keypress', e => {
        e.preventDefault()
        character.jump()
    });

    ctx.clearRect(0, 0, c.width, c.height);
    background.draw(stageProps)
    character.draw(stageProps)
    boxGenerator.run(stageProps)
    boxGenerator.checkCollisions(character)
    window.requestAnimationFrame(run);
}

document.addEventListener('DOMContentLoaded', e => run());