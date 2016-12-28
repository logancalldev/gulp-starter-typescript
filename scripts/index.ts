import { sayHello } from "./greet";

function showHello(divName: string, name: string): void {
	const elt = document.getElementById(divName);
	elt.innerText = sayHello(name);
}

showHello("greeting", 'Logan');
