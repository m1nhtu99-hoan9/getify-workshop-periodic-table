/** @private */
const elements: Readonly<PeriodicTableElement[]> = require("./periodic-table.json");
/** @private */
const symbolElementMap = elements.reduce(
	(m, elem) => {
		m.set(elem.symbol.toLowerCase(), elem); 
		return m;
	}, 
	new Map<string, Readonly<PeriodicTableElement>>()
);
const allSymbols: readonly string[] = Array.from(symbolElementMap.keys());

/** Determine if `inputWord` can be spelled
	* with periodic table symbols; return array with
	* them if so (empty array otherwise) */
function check(inputWord: string): Readonly<SpellingResult> {
	if (!inputWord?.length) 
		return { symbols: [], match: 'none' };

	const out: string[] = [];
	const symCandidates = collectSymbolCandidates(inputWord);

	const recurse = function (word: string, results: string[]): string[] {
		if (!word?.length) return results;

		for (const sym of symCandidates) {
			const wordhead = word.slice(0, sym.length).toLowerCase();
			if (wordhead !== sym)
				continue;

			results.push(sym);

			const wordtail = word.slice(sym.length).toLowerCase();
			return Boolean(wordtail?.length) ? recurse(wordtail, results) : results;
		}

		return results;
	}

	recurse(inputWord, out);

	const resultCharLength = out.reduce((l,x) => l + x.length, 0);

	let match: SpellingMatch = 'partial';
	if (resultCharLength === 0) match = 'none';
	else if (resultCharLength === inputWord.length) match = 'full';

	return { symbols: out, match }
}

function lookup(elementSymbol: string) {
	return symbolElementMap.get(elementSymbol?.toLowerCase());
}

/** @private */
function collectSymbolCandidates(inputWord: string): readonly string[] {
	if (!inputWord?.length) return [];

	const oneLetterSymbols = new Set<string>();
	const twoLetterSymbols = new Set<string>();

	for (const chr of inputWord.toLocaleLowerCase()) {
		if (symbolElementMap.has(chr) && !oneLetterSymbols.has(chr)) {
			oneLetterSymbols.add(chr);
		}
	}

	for (let i = 0; i < inputWord.length - 1; i++) {
		const sym = inputWord.slice(i, i + 2)?.toLocaleLowerCase();
		if (Boolean(sym) && symbolElementMap.has(sym) && !twoLetterSymbols.has(sym)) {
			twoLetterSymbols.add(sym);
		}
	}

	const syms = [...twoLetterSymbols, ...oneLetterSymbols];
	return syms;
}

export default {
	check,
	lookup,
	allSymbols
};

// TEST WORDS
//
// [
//   "accept","access","accessibilities","accrete","accrual","accuracy","accuse","aces","ache",
//   "acids","acne","acorn","action","agitation","agnostic","ago","alimony","alpacas","america",
//   "american","amish","amputate","amputation","aspirin","attention","auction","autistic","bacon",
//   "ballistic","banana","band","bane","bank","baptism","barf","base","bay","bears","because",
//   "beers","berserk","body","bone","bonfire","boo","boy","brain","brains","bro","brunch","bunch",
//   "burn","busy","butane","cacti","cafe","camp","can","candy","candycane","canine","cannibal",
//   "cap","car","cheers","china","chocolate","clock","coffees","cone","cook","counts","cover","cow",
//   "coy","coyote","cufflinks","cuisine","cup","cute","cuteness","cyborg","cyclic","cyclone",
//   "cynics","dyes","dynamic","dynamite","dynamo","dynasties","dysfunctional","erosion","erotic",
//   "erupt","essence","faces","false","fat","fear","feline","fence","fetish","fibs","final","fire",
//   "flash","flog","flow","fog","forever","fraction","frog","frolic","fry","fun","function",
//   "functional","functions","fusion","gala","gasp","gear","gene","generation","genesis","genius",
//   "hack","hacker","hackers","halos","harp","has","hats","heat","heinous","helicopter","heretic",
//   "honk","hook","hose","hundreds","hymn","hymnal","hyperbolic","icky","icon","inclines","inspire",
//   "insulin","iron","irresponsibilities","kick","kind","knife","knits","know","krypton","lab",
//   "lady","lifespan","lips","lubrication","lucky","mock","mockery","more","motion","mouse","neon",
//   "nits","notification","nun","osmosis","ostentatious","pancreas","papyrus","patcher","patchier",
//   "phone","physics","pirate","play","player","poacher","poison","police","polish","posh","pounds",
//   "preparer","pretender","psychic","puffer","raccoon","rage","recluse","rescues","researh",
//   "resin","responsibilities","retina","reunite","reverse","rhubarb","rub","ruby","ruin","run",
//   "rune","rush","sack","sag","salvation","sarcasm","sassy","satin","scallion","scandal","scares",
//   "scotch","septic","sickness","siphon","skunk","sniper","snowy","soccer","sociopath","spam",
//   "span","spin","sure","tavern","taxes","teach","team","tetanus","tether","that","thin","think",
//   "tick","ticklish","under","unicorns","union","unreal","use","utah","vaccine","vampire","verse",
//   "violin","virus","viscosities","voice","vote","war","wash","wasp","watch","water","what","when",
//   "who","wife","wise","witch","with","won","wonder","wonky","yams","yards","yarn","yikes","you",
//   "youth","yucky"
// ]