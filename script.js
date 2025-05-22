const catalina = document.getElementById('catalina');
const teacher = document.getElementById('teacher');
const dialogBox = document.getElementById('dialog-box');
const faceImage = document.getElementById('face');
const dialogText = document.getElementById('dialog-text');
let isBusy = false;

const frames = ['images/idle.webp', 'images/walk1.webp', 'images/walk2.webp'];
let walkFrame = 0;
let step = 0;
let textInterval = null;

const steps = [
	{ type: 'wait' },

	{ type: 'teacherEntrance', from: 512, to: 272 },

	{ type: 'dialog', face: 'images/teacherFace.webp', text: 'Hola Catalina, tengo algunas tareas para tí' },

	{ type: 'dialog', face: 'images/face.webp', text: 'Pa las que sea profe' },

	{ type: 'dialog', face: 'images/teacherFace.webp', text: 'Debes hacer un mentegrama mostrando los problemas de la escuela' },

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

function showDialog(face, text, onDone) {
	dialogBox.classList.remove('hidden');
	faceImage.src = face;
	dialogText.textContent = '';
	let i = 0;

	textInterval = setInterval(() => {
		if (i < text.length) {
			dialogText.textContent += text[i++];
		} else {
			clearInterval(textInterval);
			textInterval = null;
			onDone?.(); // call onDone when dialog finishes typing
		}
	}, 50);
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
		isBusy = true;
		animateTeacherIn(current.from, current.to, () => {
			isBusy = false;
			step++;
		});
	} else if (current.type === 'walkTo') {
		isBusy = true;
		animateCatalina(current.to, () => {
			isBusy = false;
			step++;
		});
	} else if (current.type === 'dialog') {
		isBusy = true;
		showDialog(current.face, current.text, () => {
			isBusy = false;
			step++;
		});
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
	if (isBusy) return;

	if (e.key === 'ArrowRight') {
		nextStep();
	} else if (e.key === 'ArrowLeft') {
		// Optional: implement going back
	}
});
