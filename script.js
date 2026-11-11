/* =========================================
   HUNT: SHOWDOWN CHALLENGE WHEEL
   ========================================= */


/* =========================================
   CHALLENGE LIST
   Add, edit, or remove challenges here.
   ========================================= */

const challenges = [
    {
        name: "The Pirate",
        description: "Bring a Sparks Pistol, a saber, and dynamite."
    },
    {
        name: "Naked",
        description: "Bring nothing but a medkit."
    },
    {
        name: "Budget Hunter",
        description: "Use the cheapest loadout you can make."
    },
    {
        name: "No Healing",
        description: "Bring no healing tools or consumables."
    },
    {
        name: "Shotgun Hunter",
        description: "Bring a shotgun as your primary weapon."
    },
    {
        name: "Sidearm Only",
        description: "Your only firearm must be a pistol."
    },
    {
        name: "No Consumables",
        description: "Enter the match with no consumables."
    },
    {
        name: "The Gunslinger",
        description: "Bring two revolvers and no long guns."
    },
    {
        name: "The Samurai",
        description: "Bring a bow and katana."
    },
    {
        name: "The Viking",
        description: "Bring an axe and a throwing spear."
    },
    {
        name: "Militia Men",
        description: "Bring a single-shot rifle and single action pistol."
    },
    {
        name: "Rain Fire",
        description: "Bring weapons with incendiary and molotov."
    },
    {
        name: "The Skeeter",
        description: "Bring dual nagant silencers with poison ammo."
    },
    {
        name: "Silent but deadly",
        description: "Bring a suppressed weapon with subsonic."
    },
    {
        name: "No bullets",
        description: "Bring only weapons that use no bullets."
    },
    {
        name: "El Cinco",
        description: "Bring a 5 slot weapon."
    }
];


/* =========================================
   ELEMENTS
   ========================================= */

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinButton = document.getElementById("spinButton");
const resultName = document.getElementById("resultName");
const resultDescription = document.getElementById("resultDescription");

const winSound = document.getElementById("winSound");
const muteButton = document.getElementById("muteButton");


/* =========================================
   WHEEL SETTINGS
   ========================================= */

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY) - 10;

const TWO_PI = Math.PI * 2;

const wheelColors = [
    "#292b2e",
    "#55595e",
    "#383b3f",
    "#777c82"
];

let rotation = 0;
let spinning = false;
let soundEnabled = true;


/* =========================================
   DRAW THE WHEEL
   ========================================= */

function drawWheel() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (challenges.length === 0) {
        return;
    }

    const segmentAngle = TWO_PI / challenges.length;

    challenges.forEach((challenge, index) => {

        const startAngle =
            rotation + index * segmentAngle - Math.PI / 2;

        const endAngle = startAngle + segmentAngle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
            centerX,
            centerY,
            radius,
            startAngle,
            endAngle
        );
        ctx.closePath();

        ctx.fillStyle =
            wheelColors[index % wheelColors.length];

        ctx.fill();

        ctx.strokeStyle = "#b8bdc2";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw challenge name
        ctx.save();

        ctx.translate(centerX, centerY);

        ctx.rotate(startAngle + segmentAngle / 2);

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

    

ctx.fillStyle = "#f0f1f2";

// Automatically adjust font size
// based on the number of challenges

let fontSize;

if (challenges.length <= 12) {
    fontSize = 16;
} else if (challenges.length <= 20) {
    fontSize = 13;
} else if (challenges.length <= 30) {
    fontSize = 11;
} else if (challenges.length <= 40) {
    fontSize = 9;
} else {
    fontSize = 8;
}

ctx.font = `bold ${fontSize}px Georgia`;

ctx.shadowColor = "#000000";
ctx.shadowBlur = 4;

        let label = challenge.name;

// Maximum available text width
const maxTextWidth = radius - 65;

// Shorten labels that are too wide
while (
    ctx.measureText(label).width > maxTextWidth &&
    label.length > 3
) {
    label = label.slice(0, -1);
}

// Add dots if the name was shortened
if (label !== challenge.name) {
    while (
        ctx.measureText(label + "...").width > maxTextWidth &&
        label.length > 1
    ) {
        label = label.slice(0, -1);
    }

    label += "...";
}

ctx.fillText(label, radius - 18, 0);

        ctx.restore();

    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, TWO_PI);

    ctx.fillStyle = "#17191b";
    ctx.fill();

    ctx.strokeStyle = "#c3c7cb";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center decoration
    ctx.fillStyle = "#e0e2e4";
    ctx.font = "bold 24px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("H", centerX, centerY);
}


/* =========================================
   SPIN THE WHEEL
   ========================================= */

function spinWheel() {

    if (spinning || challenges.length === 0) {
        return;
    }

    spinning = true;
    spinButton.disabled = true;

    resultName.textContent = "The Hunt Begins...";
    resultDescription.textContent = "Your fate is being decided.";

    // Stop any previous audio
    winSound.pause();
    winSound.currentTime = 0;

    const segmentAngle = TWO_PI / challenges.length;

    // Choose a random winning challenge
    const winningIndex =
        Math.floor(Math.random() * challenges.length);

    // Calculate target rotation
    const currentRotation =
        ((rotation % TWO_PI) + TWO_PI) % TWO_PI;

    const targetRotation =
        ((-winningIndex * segmentAngle
          - segmentAngle / 2) % TWO_PI + TWO_PI) % TWO_PI;

    const extraRotation =
        (targetRotation - currentRotation + TWO_PI) % TWO_PI;

    // Spin between 5 and 7 full rotations
    const fullSpins =
        (5 + Math.floor(Math.random() * 3)) * TWO_PI;

    const startRotation = rotation;

    const totalRotation = fullSpins + extraRotation;

    const duration = 5000;
    const startTime = performance.now();

    function animate(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);

        // Smooth ease-out animation
        const eased = 1 - Math.pow(1 - progress, 4);

        rotation =
            startRotation + totalRotation * eased;

        drawWheel();

        if (progress < 1) {

            requestAnimationFrame(animate);

        } else {

            rotation = startRotation + totalRotation;

            drawWheel();

            spinning = false;
            spinButton.disabled = false;

            // Display winning challenge
            const winner = challenges[winningIndex];

            resultName.textContent = winner.name;
            resultDescription.textContent =
                winner.description;

            // Play winning soundbite
            if (soundEnabled) {
                winSound.currentTime = 0;

                winSound.play().catch(() => {
                    // Browser may block audio playback
                });
            }
        }
    }

    requestAnimationFrame(animate);
}


/* =========================================
   SOUND CONTROLS
   ========================================= */

muteButton.addEventListener("click", () => {

    soundEnabled = !soundEnabled;

    muteButton.textContent =
        soundEnabled ? "Sound: ON" : "Sound: OFF";

    if (!soundEnabled) {
        winSound.pause();
        winSound.currentTime = 0;
    }
});


/* =========================================
   BUTTON EVENTS
   ========================================= */

spinButton.addEventListener("click", spinWheel);


/* =========================================
   INITIALIZE
   ========================================= */

drawWheel();