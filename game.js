/**
 * Works in Chrome 65, FireFox 95 and Safari 11
 */

var workingBrowsers = 'Works in Chrome 65, FireFox 95 and Safari 11'

try {
    document.getElementById('game-canvas').getContext('2d')
} catch(e) {
    alert('The game needs a canvas, but your browser doesn\'t support it. ' + workingBrowsers)
}

if (!Array.prototype.map) {
    alert('The game is written using modern JavaScript features e.g. Array.prototype.map, but your browser doesn\'t support it. ' + workingBrowsers)
}

try {
    (() => '')()
} catch(e) {
    alert('The game is written using modern JavaScript features e.g. the arrow function, but your browser doesn\'t support it. ' + workingBrowsers)
}

(() => {

let gold = 0
let clickAttack = 1
let clickBoostCost = 10
let enemyCount = 1
let enemy = {}

let hintShownClickUpgrade = false
let hintShownHeroBuy = false
let hintShownHeroUpgrade = false

const resetEnemy = () => {
    hp = Math.floor((Math.random()) * enemyCount * enemyCount * 1.3)
    enemy = {
        hp,
        resthp: hp,
        x: 30,
        y: 50,
        width: 240,
        height: 40
    }
}

resetEnemy()

const heros = (() =>
    ['😴', '🤕', '🤔', '😁', '😬', '😙', '🤪', '😎', '🤩', '🤠', '😇', '😼'].map((emoji, i) => {
        const x = i < 4
                  ? 20
                  : i < 8
                    ? 110
                    : 200

        const y = i < 4
                  ? (50 * i + 155)
                  : i < 8
                    ? (50 * i - 45)
                    : (50 * i - 245)

        return {
            emoji,
            lvl: 0,
            x,
            y,
            width: 80,
            height: 45,
            attack: 1 + i * 9 * i * i,
            baseAttack: 1 + i * 9 * i * i,
            cost: 75 * (i + 1) * (i + 1) * (i + 1) * (i + 1) * (i + 1)
        }
    })
)()

const hurtEnemy = damage => {
    if (enemy.resthp) {
        enemy.resthp -= damage
    }    
}


const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')

const gameTick = () => {
    ctx.font = '20px sans-serif'
    if (enemy.resthp <= 0) {
        gold += enemy.hp
        enemyCount += 1
        enemy = {}
        setTimeout(resetEnemy, 150)
    }

    ctx.clearRect(0, 0, 300, 300)

    // stats
    ctx.fillStyle="#000"
    ctx.textAlign="left"
    ctx.fillText(`💰${gold}`, 10, 30)
    ctx.textAlign="right"
    ctx.font = '18px sans-serif'
    ctx.fillText(`👆`, 300, 27)
    ctx.font = '10px sans-serif'
    ctx.fillText(`⚔️${clickAttack}`, 278, 18)
    ctx.fillText(`💰${clickBoostCost}`, 278, 30)

    if (hintShownClickUpgrade === false && gold >= 10) {
        ctx.font = '8px sans-serif'
        ctx.fillText('Click to upgrade⤴︎', 293, 40)
    }

    ctx.textAlign="center"
    ctx.font = '18px sans-serif'
    ctx.fillText(`LEVEL ${enemyCount}`, 150, 45)
    ctx.font = '20px sans-serif'

    // enemy
    if (enemy.hp) {
        ctx.fillStyle="#800"
        ctx.fillRect(30, 50, 240, 40)
        ctx.fillStyle="#080"
        ctx.fillRect(30, 50, (240 * (enemy.resthp / enemy.hp)), 40)
        ctx.fillStyle="#fff"
        ctx.textAlign="center"
        ctx.fillText(`${(enemy.resthp / enemy.hp) > 0.5 ? '😈' : '👿'} ${enemy.resthp}/${enemy.hp}`, 150, 80)
    }

    // heros
    // background
    ctx.fillStyle="#333"
    ctx.fillRect(0, 110, 300, 255)
    // headline
    ctx.textAlign="center"
    ctx.fillStyle="#fff"
    ctx.fillText('Buy and upgrade your heros:', 150, 140)
    // switches and heros
    heros.forEach((hero, i) => {
        ctx.fillStyle = hero.lvl > 0
                        ? "#ffe"
                        : hero.cost <= gold
                          ? "#bfc"
                          : "#999"
        ctx.fillRect(hero.x, hero.y, hero.width, hero.height)
        ctx.fillStyle="#000"
        ctx.textAlign="right"
        ctx.font = '36px sans-serif'
        ctx.fillText(hero.emoji, hero.x + hero.width + 5, hero.y + 28)
        ctx.textAlign="left"
        ctx.font = '10px sans-serif'
        ctx.fillText(`🏅${hero.lvl}`, hero.x + 2, hero.y + 15)
        ctx.fillText(`⚔️${hero.attack}`, hero.x + 2, hero.y + 27)
        ctx.fillText(`💰${hero.cost}`, hero.x + 2, hero.y + 39)
    })

    if (hintShownHeroBuy === false && gold >= heros[0].cost) {
        ctx.textAlign="right"
        ctx.font = '10px sans-serif'
        ctx.fillText('Buy me!', heros[0].x + heros[0].width - 5, heros[0].y + heros[0].height - 5)
    }
    
    if (hintShownHeroUpgrade === false && hintShownHeroBuy === true && gold >= heros[0].cost) {
        ctx.textAlign="right"
        ctx.font = '9px sans-serif'
        ctx.fillText('Upgrade!', heros[0].x + heros[0].width - 5, heros[0].y + heros[0].height - 5)
    }


    // next tick
    requestAnimationFrame(gameTick)
}

gameTick()

canvas.addEventListener('click', event => {
    var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    heros.forEach(hero => {
        if (y > hero.y && y < hero.y + hero.height && x > hero.x && x < hero.x + hero.width) {
            if (gold >= hero.cost) {
                gold -= hero.cost
                hero.lvl += 1
                hero.cost += Math.floor(hero.cost * (hero.lvl / 5))
                hero.attack += Math.floor(hero.baseAttack * (hero.lvl / 2))
                if (hintShownHeroBuy === false) {
                    hintShownHeroBuy = true
                }
                if (hero.lvl > 1 && hintShownHeroUpgrade === false) {
                    hintShownHeroUpgrade = true
                }
            }
        }
    });

    if (y > enemy.y && y < enemy.y + enemy.height && x > enemy.x && x < enemy.x + enemy.width) {
        hurtEnemy(clickAttack)
    }

    if (y > 5 && y < 48 && x > 250 && x < 295) {
        if (gold >= clickBoostCost) {
            gold -= clickBoostCost
            clickBoostCost = Math.ceil(clickBoostCost * 2.6)
            clickAttack = Math.ceil(clickAttack * 1.3)
            if (hintShownClickUpgrade === false) {
                hintShownClickUpgrade = true
            }
        }
    }
}, false);

setInterval(() => {
    heros.forEach(hero => {
        if (hero.lvl > 0) {
            hurtEnemy(hero.attack)
        }
    })
}, 250)

})()