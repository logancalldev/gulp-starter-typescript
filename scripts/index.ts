import { sayHello } from "./greet";

function showHello(divName: string, name: string): void {
	const elt = document.getElementById(divName);
	elt.innerText = sayHello(name);
	console.log('haa')
}

showHello("greeting", "Logan");