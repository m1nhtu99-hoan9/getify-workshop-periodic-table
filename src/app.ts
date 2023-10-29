import Speller from "./speller.js";
import { fromEvent,  partition } from "rxjs";
import { filter as rxfilter, map as rxmap } from "rxjs/operators";
import { Ok, Err, Result } from "@sniptt/monads";

const enterWordEl = document.getElementById("enter-word") as HTMLInputElement;

const wordInputKeydown$ = fromEvent(enterWordEl, "keydown", { capture: true })
	.pipe(
		rxfilter((evnt: KeyboardEvent) => evnt.key === "Enter")
	);

const wordInputValue$ = wordInputKeydown$.pipe(
	rxfilter(envt => envt.target instanceof HTMLInputElement),
	rxmap(envt => (envt.target as HTMLInputElement).value?.toLowerCase().trim()),
);
const [validWordInputValue$, invalidWordInputValue$] = partition(wordInputValue$, val => /^[a-z]{3,}$/.test(val));
const invalidWordInputMessage$ = invalidWordInputValue$.pipe(
	rxmap(_ => "Word need to be at least 3-character long and contain only alphabetic letters.")
);

const wordSpelling$ = validWordInputValue$.pipe<Result<readonly string[],string>>(
	rxmap(w => {
		const syms = Speller.check(w);
		console.log(`Speller.check('${w}')`, syms);
		return Boolean(syms.length) ? Ok(syms) : Err("couldn't spell it");
	})
);

export {
	wordSpelling$,
	invalidWordInputMessage$,
}
