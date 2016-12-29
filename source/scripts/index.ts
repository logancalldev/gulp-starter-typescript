/// <reference path="typings/index.d.ts" />
import * as $ from "jquery";
(<any> window).jQuery = $;
import "bootstrap-sass";

$(document).ready(() => {
	console.log("index.ts is compiling");
});
