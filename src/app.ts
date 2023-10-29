import Speller from "./speller.js";
import { fromEvent,  partition, mergeWith } from "rxjs";
import { filter as rxfilter, map as rxmap, sampleTime } from "rxjs/operators";
import { Ok, Err, Result } from "@sniptt/monads";

const enterWordEl = document.getElementById("enter-word") as HTMLInputElement;

const wordInputKeydown$ = fromEvent(enterWordEl, "keydown", { capture: true });
const wordInputKeydownEnter$ = wordInputKeydown$
	.pipe(
		rxfilter((evnt: KeyboardEvent) => evnt.key === "Enter")
	);
const wordInputKeydownSampling$ = wordInputKeydown$
	.pipe(
		sampleTime(1500)  // 1.5sec type-ahead
	);

const wordInputValue$ = wordInputKeydownEnter$.pipe(
	mergeWith(wordInputKeydownSampling$),	
	rxfilter(envt => envt.target instanceof HTMLInputElement),
	rxmap(envt => (envt.target as HTMLInputElement).value?.toLowerCase().trim()),
);
const [validWordInputValue$, invalidWordInputValue$] = partition(wordInputValue$, val => /^[a-z]{3,}$/.test(val));
const invalidWordInputMessage$ = invalidWordInputValue$.pipe(
	rxmap(() => "Word need to be at least 3-character long and contain only alphabetic letters.")
);

const wordSpelling$ = validWordInputValue$.pipe<Result<SpellingResult,string>>(
	rxmap(w => {
		const res = Speller.check(w);
		return res.match !== 'none' ? Ok(res) : Err("couldn't spell it");
	})
);

export {
	wordSpelling$,
	invalidWordInputMessage$,
}
