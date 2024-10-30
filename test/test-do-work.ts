import {sleepMs} from "spidgorny-react-helpers/lib/date";

(async () => {
	for (let i = 0; i < 5+Math.random()*5; i++) {
		console.log(`Hello, World! (${i + 1})`);
		await sleepMs(1000);
	}
	console.log("Goodbye, World!");
	process.exit(1);	// fail to restart
})();