import { Subscription } from "rxjs";
import { wordSpelling$, invalidWordInputMessage$ } from "./app";
import Speller from "./speller.js";

/** @private */
const wordSpellingEl = document.getElementById("word-spelling")!;
/** @private */
let inputWordSub: Subscription; 
/** @private */
let wordSpellingSub: Subscription;

if (/complete|interactive|loaded/.test(document.readyState)) {
	load();
}
else {
	document.addEventListener("DOMContentLoaded", load);
}
document.addEventListener("unload", () => {
  inputWordSub?.unsubscribe();
  wordSpellingSub?.unsubscribe();
});

function load() {
  inputWordSub = invalidWordInputMessage$.subscribe(msg => {
    wordSpellingEl.innerHTML = `<strong>${msg}</strong>`
  });

  wordSpellingSub = wordSpelling$.subscribe(res => {
    res.match({
      ok: (val) => renderSymbolCards(val),
      err: (val) => wordSpellingEl.innerHTML = `<strong>-- ${val} --</strong>`
    })
  });
}

/** @private */
function renderSymbolCards(symbols: readonly string[]) {
  wordSpellingEl.innerHTML = "";

  for (const symbol of symbols) {
    const elementEntry = Speller.lookup(symbol)!;
    const elementDiv = document.createElement("div");
    elementDiv.className = "element";
    elementDiv.innerHTML = `
      <div class="number">${elementEntry.number}</div>
      <div class="symbol">${elementEntry.symbol}</div>
      <div class="name">${elementEntry.name}</div>
    `;
    wordSpellingEl.appendChild(elementDiv);
  }
}