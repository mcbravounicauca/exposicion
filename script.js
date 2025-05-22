const mary = document.getElementById('mary');
const dialogBox = document.getElementById('dialog-box');
const faceImage = document.getElementById('face');
const dialogText = document.getElementById('dialog-text');
let isBusy = false;
const history = [];

const frames = ['images/idle.webp', 'images/walk1.webp', 'images/walk2.webp'];
let walkFrame = 0;
let step = 0;
let textInterval = null;

const steps = [
	{ type: 'dialog', face: 'images/face.webp', text: 'Hola, soy Mary Catalina, etnoeducadora en formación. En esta casita quiero contarte cómo descubrí un conflicto ético en mi práctica en la Corporación Maestra Vida: la invisibilización de la cultura afrocolombiana, disfrazada de inclusión.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'La danza afro aparecía en fechas especiales, pero sin historia ni contexto. ¿Es eso inclusión... o folclorización?' },
	{ type: 'walkTo', character: 'mary', to: { left: 616, top: 124 } },
	{ type: 'dialog', face: 'images/face.webp', text: 'El conflicto no está en bailar, sino en cómo lo afro se presenta: sin participación afro, sin espiritualidad, sin pensamiento. Se convierte en espectáculo. Se excluye mientras parece incluir.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'La etnoeducación me enseñó que lo simbólico no basta. Necesitamos justicia curricular.' },
	{ type: 'walkTo', character: 'mary', to: { left: 224, top: 216 } },
	{ type: 'dialog', face: 'images/face.webp', text: 'No todas las voces tienen el mismo volumen en el aula. Lo afro se silencia porque no es mayoría. Pero la etnoeducación no es de mayorías: es de memorias, dignidades y resistencias.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'Callar también educa. Por eso decidí hablar.' },
	{ type: 'walkTo', character: 'mary', to: { left: 612, top: 324 } },
	{ type: 'dialog', face: 'images/face.webp', text: 'A los grupos Mariposas y Libélulas les interesaba la danza afrocolombiana. Vi en eso una oportunidad para integrar la Cátedra Afro de forma real.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'Usé la danza como puente para conocer la historia, la música, la espiritualidad y la identidad afro. Así nació mi PPE: Un ritmo que transforma.' },
	{ type: 'walkTo', character: 'mary', to: { left: 228, top: 428 } },
	{ type: 'dialog', face: 'images/face.webp', text: 'Por eso he decidido crear esta exposición en modo videojuego' },
	{ type: 'dialog', face: 'images/face.webp', text: 'Así, las TIC se convierten en aliadas de la etnoeducación. Porque contar también es resistir.' },
	{ type: 'walkTo', character: 'mary', to: { left: 620, top: 520 } },
	{ type: 'dialog', face: 'images/face.webp', text: 'Mi práctica me enseñó que la interculturalidad no se presume, se construye. Que todas las culturas deben estar en el currículo, no solo en las fechas conmemorativas.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'Etnoeducar es escuchar, transformar y dignificar. Y tú, ¿qué harías si una voz importante no está siendo escuchada en tu aula?' }
];

let walkInterval = null;

function skipWalk(to) {
	if (walkInterval) {
		clearInterval(walkInterval);
		walkInterval = null;
	}
	mary.style.left = `${to.left}px`;
	mary.style.top = `${to.top}px`;
	mary.src = frames[0];
}
function animateMary(to, callback) {
	let x = parseInt(mary.style.left);
	let y = parseInt(mary.style.top);

	if (walkInterval) clearInterval(walkInterval); // just in case

	walkInterval = setInterval(() => {
		let moved = false;

		walkFrame = (walkFrame + 1) % frames.length;
		mary.src = frames[walkFrame];

		if (Math.abs(x - to.left) > 5) {
			x += (x < to.left) ? 5 : -5;
			moved = true;
		}
		if (Math.abs(y - to.top) > 5) {
			y += (y < to.top) ? 5 : -5;
			moved = true;
		}

		mary.style.left = `${x}px`;
		mary.style.top = `${y}px`;

		if (!moved) {
			clearInterval(walkInterval);
			walkInterval = null;
			mary.src = frames[0];
			callback?.();
		}
	}, 60);
}

let currentDialog = null;

function skipDialog() {
	if (currentDialog) {
		clearInterval(textInterval);
		textInterval = null;
		dialogText.textContent = currentDialog.text;
		const onDone = currentDialog.onDone;
		currentDialog = null;
		onDone?.();
	}
}
function showDialog(face, text, onDone) {
	dialogBox.classList.remove('hidden');
	faceImage.src = face;
	dialogText.textContent = '';
	let i = 0;
	currentDialog = { face, text, onDone };

	textInterval = setInterval(() => {
		if (i < text.length) {
			dialogText.textContent += text[i++];
		} else {
			clearInterval(textInterval);
			textInterval = null;
			currentDialog = null;
			onDone?.();
		}
	}, 50);
}

function previousStep() {
	if (history.length === 0) return;

	step = history.pop();
	const previous = steps[step];

	if (previous.type === 'walkTo') {
		// Move instantly
		mary.style.left = `${previous.to.left}px`;
		mary.style.top = `${previous.to.top}px`;
		mary.src = frames[0];
	} else if (previous.type === 'dialog') {
		dialogBox.classList.remove('hidden');
		faceImage.src = previous.face;
		dialogText.textContent = previous.text;
	}
}
function nextStep() {
	if (textInterval) return;
	const current = steps[step];
	if (!current) return;

	dialogBox.classList.add('hidden');

	if (current.type === 'walkTo') {
		isBusy = true;
		animateMary(current.to, () => {
			isBusy = false;
			history.push(step);
			step++;
		});
	} else if (current.type === 'dialog') {
		isBusy = true;
		showDialog(current.face, current.text, () => {
			isBusy = false;
			history.push(step);
			step++;
		});
	}
}

document.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowRight') {
		if (textInterval) {
			skipDialog(); // fast-forward text
		} else if (walkInterval) {
			skipWalk(steps[step].to); // fast-forward walk
			isBusy = false;
			history.push(step);
			step++;
		} else if (!isBusy) {
			nextStep(); // advance normally
		}
	} else if (e.key === 'ArrowLeft') {
		if (!isBusy && !textInterval && !walkInterval) {
			previousStep();
		}
	}
});
