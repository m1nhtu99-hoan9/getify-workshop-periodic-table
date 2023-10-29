type PeriodicTableElement = {
  name: string,
  number: number,
  symbol: string
}

type SpellingMatch = 'full' | 'partial' | 'none';

type SpellingResult = {
  symbols: readonly string[],
  match: SpellingMatch
}
