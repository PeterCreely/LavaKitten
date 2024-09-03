const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to resize the canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redraw the canvas content after resizing
    updatePlayerPosition();
    draw(); // Call your draw function to redraw the content
}

// Event listener for window resize
window.addEventListener('resize', resizeCanvas);

function updatePlayerPosition() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height); // Draw the player
    console.log('updatePlayerPosition called:', player.x, player.y);
}

let moveInterval;

const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');

const startMovingLeft = () => {
    moveInterval = setInterval(() => {
        player.x -= 10;
        drawPlayer();
    }, 100); // Adjust the interval time as needed
};

const startMovingRight = () => {
    moveInterval = setInterval(() => {
        player.x += 10;
        drawPlayer();
    }, 100); // Adjust the interval time as needed
};

const startMovingUp = () => {
    moveInterval = setInterval(() => {
        player.y -= 10;
        drawPlayer();
    }, 100); // Adjust the interval time as needed
};

const startMovingDown = () => {
    moveInterval = setInterval(() => {
        player.y += 10;
        drawPlayer();
    }, 100); // Adjust the interval time as needed
};

const stopMoving = () => {
    clearInterval(moveInterval);
};

leftButton.addEventListener('mousedown', startMovingLeft);
leftButton.addEventListener('touchstart', startMovingLeft);

rightButton.addEventListener('mousedown', startMovingRight);
rightButton.addEventListener('touchstart', startMovingRight);

upButton.addEventListener('mousedown', startMovingUp);
upButton.addEventListener('touchstart', startMovingUp);

downButton.addEventListener('mousedown', startMovingDown);
downButton.addEventListener('touchstart', startMovingDown);

leftButton.addEventListener('mouseup', stopMoving);
leftButton.addEventListener('touchend', stopMoving);

rightButton.addEventListener('mouseup', stopMoving);
rightButton.addEventListener('touchend', stopMoving);

upButton.addEventListener('mouseup', stopMoving);
upButton.addEventListener('touchend', stopMoving);

downButton.addEventListener('mouseup', stopMoving);
downButton.addEventListener('touchend', stopMoving);



let player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    speed: 5,
    isInvincible: false,
    image: new Image()
};
player.image.src = 'player.png'; // Path to your player image file
player.image.onload = () => {
    console.log('Player image loaded');
    updatePlayerPosition(); // Initial call to position the player
};

let enemies = [
    { x: 100, y: 300, width: 50, height: 50, speedX: 3, speedY: 3, image: new Image() },
    { x: 100, y: 200, width: 50, height: 50, speedX: -3, speedY: 2, image: new Image() },
    { x: 100, y: 400, width: 50, height: 50, speedX: 2, speedY: -3, image: new Image() }
];
enemies[0].image.src = 'enemy1.png'; // Path to your first enemy image file
enemies[1].image.src = 'enemy2.png'; // Path to your second enemy image file
enemies[2].image.src = 'enemy3.png'; // Path to your third enemy image file
enemies.forEach((enemy, index) => {
    enemy.image.onload = () => console.log(`Enemy ${index + 1} image loaded`);
});

let powerUps = [
    { x: 200, y: 300, width: 50, height: 50, type: 'speed', image: new Image() },
    { x: 200, y: 100, width: 50, height: 50, type: 'invincibility', image: new Image() }
];
powerUps[0].image.src = 'speed.png';
powerUps[1].image.src = 'invincibility.png';
powerUps.forEach((powerUp, index) => {
    powerUp.image.onload = () => console.log(`Power-up ${index + 1} image loaded`);
});

let keys = {};
let score = 0;
let level = 1;

// Load sound effects
const moveSound = new Audio('move.mp3');
const powerUpSound = new Audio('powerup.mp3');
const collisionSound = new Audio('collision.mp3');

moveSound.addEventListener('canplaythrough', () => console.log('Move sound loaded'));
powerUpSound.addEventListener('canplaythrough', () => console.log('Power-up sound loaded'));
collisionSound.addEventListener('canplaythrough', () => console.log('Collision sound loaded'));

function update() {
    console.log('Update function called');

    // Player movement
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
        moveSound.play();
    }
    if (keys['ArrowDown'] && player.y + player.height < canvas.height) {
        player.y += player.speed;
        moveSound.play();
    }
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
        moveSound.play();
    }
    if (keys['ArrowRight'] && player.x + player.width < canvas.width) {
        player.x += player.speed;
        moveSound.play();
    }

    // Enemies movement
    enemies.forEach(enemy => {
        console.log(`Enemy position before update: (${enemy.x}, ${enemy.y})`);
        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;
        console.log(`Enemy position after update: (${enemy.x}, ${enemy.y})`);

        // Bounce enemies off walls
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) enemy.speedX *= -1;
        if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) enemy.speedY *= -1;

        // Check for collision
        if (!player.isInvincible && isColliding(player, enemy)) {
            collisionSound.play();
            alert('Game Over! Your score: ' + score);
            resetGame();
        }
    });

    // Check for power-up collection
    powerUps.forEach((powerUp, index) => {
        if (isColliding(player, powerUp)) {
            powerUpSound.play();
            applyPowerUp(powerUp);
            powerUps.splice(index, 1); // Remove collected power-up
        }
    });

    score++;

    // Increase level every 1000 points
    if (score % 1000 === 0) {
        level++;
        console.log(`Level up! New level: ${level}`);
        addEnemy();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

    // Draw enemies
    enemies.forEach(enemy => {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw power-ups
    powerUps.forEach(powerUp => {
        ctx.drawImage(powerUp.image, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });

    // Draw score and level
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 20, 50);
    ctx.fillText('Level: ' + level, 20, 70);
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect2.height > rect2.y;
}

function resetGame() {
    player.x = 50;
    player.y = 50;
    player.speed = 4;
    player.isInvincible = false;
    enemies = [
        { x: 300, y: 300, width: 50, height: 50, speedX: 3, speedY: 3, image: new Image() },
        { x: 500, y: 200, width: 50, height: 50, speedX: -3, speedY: 2, image: new Image() },
        { x: 200, y: 400, width: 50, height: 50, speedX: 2, speedY: -3, image: new Image() }
    ];
    enemies[0].image.src = 'enemy1.png';
    enemies[1].image.src = 'enemy2.png';
    enemies[2].image.src = 'enemy3.png';
    powerUps = [
        { x: 400, y: 300, width: 20, height: 20, type: 'speed', image: new Image() },
        { x: 600, y: 100, width: 20, height: 20, type: 'invincibility', image: new Image() }
    ];
    powerUps[0].image.src = 'speed.png';
    powerUps[1].image.src = 'invincibility.png';
    score = 0;
    level = 1;
}

function addEnemy() {
    if (enemies.length >= 10) {
        console.log('Maximum number of enemies reached');
        return;
    }

    let newEnemy = {
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height - 50),
        width: 50,
        height: 50,
        speedX: (Math.random() - 0.5) * 6,
        speedY: (Math.random() - 0.5) * 6,
        image: new Image()
    };
    newEnemy.image.src = 'enemy1.png'; // Path to your new enemy image file
    newEnemy.image.onload = () => console.log('New enemy image loaded');
    enemies.push(newEnemy);
    console.log(`New enemy added. Total enemies: ${enemies.length}`);
}

function applyPowerUp(powerUp) {
    if (powerUp.type === 'speed') {
        player.speed = 10;
        setTimeout(() => player.speed = 5, 5000); // Speed boost lasts 5 seconds
    } else if (powerUp.type === 'invincibility') {
        player.isInvincible = true;
        setTimeout(() => player.isInvincible = false, 5000); // Invincibility lasts 5 seconds
    }
}

function startGame() {
    console.log('startGame called');
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    gameLoop();
}

function gameLoop() {
    resizeCanvas();
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
startGame();