import type { Country, GameMode, Question } from '../types';
import { shuffle } from './shuffle';

function getValidCountries(countries: Country[]): Country[] {
  return countries.filter(
    (c) => c.capital && c.capital.length > 0 && c.flags?.url_png
  );
}

function getWrongOptions(
  countries: Country[],
  correct: Country,
  mode: GameMode,
  count = 3
): string[] {
  const pool = countries.filter((c) => c.codes.alpha_2 !== correct.codes.alpha_3);
  const shuffled = shuffle(pool).slice(0, count * 3);

  if (mode === 'country-to-capital') {
    return shuffled
      .filter((c) => c.capital?.[0])
      .map((c) => c.capital[0])
      .slice(0, count);
  }

  return shuffled.map((c) => c.names.common).slice(0, count);
}

export function generateQuestion(
  countries: Country[],
  mode: GameMode
): Question | null {
  const valid = getValidCountries(countries);
  if (valid.length < 4) return null;

  const country = valid[Math.floor(Math.random() * valid.length)];
  let correctAnswer: string;

  if (mode === 'country-to-capital') {
    correctAnswer = country.capital[0];
  } else {
    correctAnswer = country.names.common;
  }

  const wrongs = getWrongOptions(valid, country, mode);
  if (wrongs.length < 3) return null;

  const options = shuffle([correctAnswer, ...wrongs]);

  return { mode, country, options, correctAnswer };
}
