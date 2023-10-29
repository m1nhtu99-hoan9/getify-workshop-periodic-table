import { Subscription } from "rxjs";
import { wordSpelling$, invalidWordInputMessage$ } from "./app";
import Speller from "./speller";

/** @private */
const wordSpellingEl = document.getElementById("word-spelling")!;
/** @private */
const wordSpellingMatchEl = document.getElementById("word-spelling-match")!;
/** @private */
let invalidInputWordSub: Subscription; 
/** @private */
let wordSpellingSub: Subscription;

if (/complete|interactive|loaded/.test(document.readyState)) {
	init();
}
else {
	document.addEventListener("DOMContentLoaded", init);
}
document.addEventListener("unload", () => {
  invalidInputWordSub?.unsubscribe();
  wordSpellingSub?.unsubscribe();
});

function init() {
  renderSymbols(Speller.allSymbols);

  invalidInputWordSub = invalidWordInputMessage$.subscribe(msg => {
    wordSpellingMatchEl.innerHTML = "";
    wordSpellingEl.innerHTML = `<strong>${msg}</strong>`
  });

  wordSpellingSub = wordSpelling$.subscribe(res => {
    res.match({
      ok: (val) => renderSpellingResult(val),
      err: (val) => wordSpellingEl.innerHTML = `<span><strong>-- ${val} --</strong></span>`
    })
  });
}

/** @private */
function renderSpellingResult(spellingResult: SpellingResult) {
  console.assert(Boolean(spellingResult));
  const { symbols, match } = spellingResult; 

  wordSpellingMatchEl.innerHTML = "";
  if (match === 'full') {
    wordSpellingMatchEl.innerHTML = `<span class="text-lime-800">full match</span>`;
  }
  else if (match === 'partial') {
    wordSpellingMatchEl.innerHTML = `<span class="text-amber-600">partial match</span>`;
  }

  renderSymbols(symbols);
}

/** @private */
function renderSymbols(symbols: readonly string[]) {
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