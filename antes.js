const mary = document.getElementById('mary');
const dialogBox = document.getElementById('dialog-box');
const faceImage = document.getElementById('face');
const dialogText = document.getElementById('dialog-text');
let isBusy = false;

const frames = ['images/idle.webp', 'images/walk1.webp', 'images/walk2.webp'];
let walkFrame = 0;
let step = 0;
let textInterval = null;

const steps = [
	{ type: 'dialog', face: 'images/face.webp', text: 'Hola, soy Mary Catalina, etnoeducadora en formación. En esta casita quiero contarte cómo descubrí un conflicto ético en mi práctica en la Corporación Maestra Vida: la invisibilización de la cultura afrocolombiana, disfrazada de inclusión.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'La danza afro aparecía en fechas especiales, pero sin historia ni contexto. ¿Es eso inclusión... o folclorización?' },
	{ type: 'walkTo', character: 'mary', to: { left: 816, top: 424 } },
	{ type: 'dialog', face: 'images/face.webp', text: 'El conflicto no está en bailar, sino en cómo lo afro se presenta: sin participación afro, sin espiritualidad, sin pensamiento. Se convierte en espectáculo. Se excluye mientras parece incluir.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'La etnoeducación me enseñó que lo simbólico no basta. Necesitamos justicia curricular.' },
	{ type: 'walkTo', character: 'mary', to: { left: 424, top: 516 } },
	{ type: 'dialog', face: 'images/face.webp', text: 'No todas las voces tienen el mismo volumen en el aula. Lo afro se silencia porque no es mayoría. Pero la etnoeducación no es de mayorías: es de memorias, dignidades y resistencias.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'Callar también educa. Por eso decidí hablar.' },

	{ type: 'walkTo', character: 'mary', to: { left: 62, top: 324 } },

	{ type: 'dialog', face: 'images/face.webp', text: 'A los grupos Mariposas y Libélulas les interesaba la danza afrocolombiana. Vi en eso una oportunidad para integrar la Cátedra Afro de forma real.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'Usé la danza como puente para conocer la historia, la música, la espiritualidad y la identidad afro. Así nació mi PPE: Un ritmo que transforma.' },

	{ type: 'walkTo', character: 'mary', to: { left: 228, top: 228 } },

	{ type: 'dialog', face: 'images/face.webp', text: 'También quiero narrar esta experiencia de forma distinta. Por eso uso esta exposición interactiva y crearé un video animado con Powtoon.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'Así, las TIC se convierten en aliadas de la etnoeducación. Porque contar también es resistir.' },

	{ type: 'walkTo', character: 'mary', to: { left: 620, top: 520 } },

	{ type: 'dialog', face: 'images/face.webp', text: 'Mi práctica me enseñó que la interculturalidad no se presume, se construye. Que todas las culturas deben estar en el currículo, no solo en las fechas conmemorativas.' },
	{ type: 'dialog', face: 'images/face.webp', text: 'Etnoeducar es escuchar, transformar y dignificar. Y tú, ¿qué harías si una voz importante no está siendo escuchada en tu aula?' }
];

function animateMary(to, callback) {
	let x = parseInt(mary.style.left);
	let y = parseInt(mary.style.top);

	const interval = setInterval(() => {
		let moved = false;

		walkFrame = (walkFrame + 1) % frames.length;
		mary.src = frames[walkFrame];

		if (Math.abs(x - to.left) > 4) {
			x += (x < to.left) ? 4 : -4;
			moved = true;
		}

		if (Math.abs(y - to.top) > 4) {
			y += (y < to.top) ? 4 : -4;
			moved = true;
		}

		mary.style.left = `${x}px`;
		mary.style.top = `${y}px`;

		if (!moved) {
			clearInterval(interval);
			mary.src = frames[0];
			callback && callback();
		}
	}, 60);
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

	if (current.type === 'walkTo') {
		isBusy = true;
		animateMary(current.to, () => {
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

document.addEventListener('keydown', (e) => {
	if (isBusy) return;

	if (e.key === 'ArrowRight' || e.key === "Enter") {
		nextStep();
	}
});
