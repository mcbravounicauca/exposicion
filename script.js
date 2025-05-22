const catalina = document.getElementById('catalina');
const teacher = document.getElementById('teacher');
const dialogBox = document.getElementById('dialog-box');
const faceImage = document.getElementById('face');
const dialogText = document.getElementById('dialog-text');

const frames = ['images/idle.webp', 'images/walk1.webp', 'images/walk2.webp'];
let walkFrame = 0;
let step = 0;
let textInterval = null;

const steps = [
	{ type: 'wait' },

	{ type: 'teacherEntrance', from: 512, to: 272 },

	{ type: 'dialog', face: 'images/teacherFace.webp', text: 'Hola Catalina, tengo algunas tareas para tí' },

	{ type: 'dialog', face: 'images/face.webp', text: 'Pa las que sea profe' },

	{ type: 'dialog', face: 'images/teacherFace.webp', text: 'Debes hacer un mentegrama mostrando los problema de la escuela' },

	{ type: 'dialog', face: 'images/face.webp', text: 'Me pondré en ello' },

	{ type: 'walkTo', character: 'catalina', to: { left: 240, top: 64 } },

	{ type: 'dialog', face: 'images/face.webp', text: 'He descubierto que el problema es grave' }
];

function animateCatalina(to, callback) {
	let x = parseInt(catalina.style.left);
	let y = parseInt(catalina.style.top);

	const interval = setInterval(() => {
		let moved = false;

		walkFrame = (walkFrame + 1) % frames.length;
		catalina.src = frames[walkFrame];

		if (Math.abs(x - to.left) > 2) {
			x += (x < to.left) ? 2 : -2;
			moved = true;
		}

		if (Math.abs(y - to.top) > 2) {
			y += (y < to.top) ? 2 : -2;
			moved = true;
		}

		catalina.style.left = `${x}px`;
		catalina.style.top = `${y}px`;

		if (!moved) {
			clearInterval(interval);
			catalina.src = frames[0];
			callback && callback();
		}
	}, 60);
}

function animateTeacherIn(from, to, callback) {
	teacher.classList.remove('hidden');
	teacher.style.left = `${from}px`;
	teacher.style.top = `240px`;

	let x = from;
	const interval = setInterval(() => {
		if (x <= to) {
			teacher.style.left = `${to}px`;
			clearInterval(interval);
			callback && callback();
			return;
		}
		x -= 2;
		teacher.style.left = `${x}px`;
	}, 30);
}

function showDialog(face, text, callback) {
	faceImage.src = face;
	dialogBox.classList.remove('hidden');
	dialogText.textContent = '';

	let index = 0;
	textInterval = setInterval(() => {
		dialogText.textContent = text.slice(0, index + 1);
		index++;
		if (index >= text.length) {
			clearInterval(textInterval);
			textInterval = null;
			if (callback) callback();
		}
	}, 40);
}

function nextStep() {
	if (textInterval) return;

	const current = steps[step];
	if (!current) return;

	// Always hide the dialog box at the beginning of a step
	dialogBox.classList.add('hidden');

	if (current.type === 'wait') {
		step++;
	} else if (current.type === 'teacherEntrance') {
		animateTeacherIn(current.from, current.to, () => {
			step++;
		});
	} else if (current.type === 'walkTo') {
		animateCatalina(current.to, () => {
			step++;
		});
	} else if (current.type === 'dialog') {
		showDialog(current.face, current.text);
		step++;
	}
}

function prevStep() {
	if (step > 0) {
		step--;
		dialogBox.classList.add('hidden');
		clearInterval(textInterval);
		textInterval = null;
	}
}

document.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowRight' || e.key === 'Enter') {
		nextStep();
	} else if (e.key === 'ArrowLeft') {
		prevStep();
	}
});
