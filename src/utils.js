import { words } from './data';

export function generateDisplayWords(wordCount = 50) {
  let displayWords = "";
  
  while (displayWords.split(" ").length < wordCount) {
    const wordNumOrPunc = Math.random();
    
    if (wordNumOrPunc < 0.08) {
      const num = getRandomNumber();
      displayWords += num.toString() + " ";
    } else if (wordNumOrPunc >= 0.08 && wordNumOrPunc < 0.16) {
      const punc = getRandomPunctuation();
      displayWords += punc;
    } else if (wordNumOrPunc >= 0.16) {
      const index = Math.floor(Math.random() * words.length);
      displayWords += words[index] + " ";
    }
  }
  
  return displayWords.trim();
}

function getRandomNumber() {
  return Math.floor(Math.random() * 100);
}

function getRandomPunctuation() {
  const punctuation = "~`!@#$%^&*(){}[]/?=+|'-_,.;:";
  const randomIndex = Math.floor(Math.random() * punctuation.length);
  return punctuation.charAt(randomIndex);
}

export function calculateWPM(startTime, endTime, wordCount) {
  const elapsedTimeInMins = (endTime - startTime) / 60000;
  return Math.round(wordCount / elapsedTimeInMins);
}
