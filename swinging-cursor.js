const cursor = document.getElementById('cursor');
const buttons = document.querySelectorAll('button');
let mouseX = -100;
let mouseY = -100;
let cursorX = -100;
let cursorY = -100;
const delay = 0.2;
const windIntensity = 100;
const noiseMultiplier = 0.0005;

const noiseGenerator = new SimplexNoise();

document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function windEffect(x, y, t) {
  const noiseX = noiseGenerator.noise3D(x * noiseMultiplier, y * noiseMultiplier, t * noiseMultiplier);
  const noiseY = noiseGenerator.noise3D(y * noiseMultiplier, x * noiseMultiplier, t * noiseMultiplier);
  return { x: windIntensity * noiseX, y: windIntensity * noiseY };
}

function isCursorOverElement(element, x, y) {
  const rect = element.getBoundingClientRect();
  return (
    x >= rect.left &&
    x <= rect.right &&
    y >= rect.top &&
    y <= rect.bottom
  );
}

function updateCursor() {
    const currentTime = Date.now();
    const wind = windEffect(cursorX, cursorY, currentTime);
  
    cursorX = lerp(cursorX, mouseX + wind.x, delay);
    cursorY = lerp(cursorY, mouseY + wind.y, delay);
  
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
  
    buttons.forEach((button) => {
      if (isCursorOverElement(button, cursorX, cursorY)) {
        button.classList.add('hover');
      } else {
        button.classList.remove('hover');
      }
    });
  
    const windIndicator = document.getElementById('wind-indicator');
    const windAngle = Math.atan2(wind.y, wind.x) * (180 / Math.PI);
    windIndicator.style.transform = `rotate(${windAngle - 90}deg)`;
  
    const seesaw = document.getElementById('seesaw');
    const center = window.innerWidth / 2;
    const tilt = (cursorX - center) / center * 15;
    seesaw.style.transform = `rotate(${tilt}deg)`;

    const buttonContainer = document.getElementById('button-container');
    buttonContainer.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`;
  
  
    requestAnimationFrame(updateCursor);
  }


buttons[0].addEventListener('click', () => {
  if (buttons[0].classList.contains('hover')) {
    document.body.style.backgroundColor = 'red';
  }
});

buttons[1].addEventListener('click', () => {
  if (buttons[1].classList.contains('hover')) {
    document.body.style.backgroundColor = 'yellow';
  }
});

buttons[2].addEventListener('click', () => {
  if (buttons[2].classList.contains('hover')) {
    document.body.style.backgroundColor = 'blue';
  }
});

updateCursor();
