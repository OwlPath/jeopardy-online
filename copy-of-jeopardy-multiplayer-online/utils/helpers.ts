import { Category, Clue } from '../types';

export const generateRoomCode = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1 to avoid confusion
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Data Generator for the Board Editor
export const getInitialBoard = (): Category[] => {
  const defaults = [
    {
      title: "CYBER SPACE",
      questions: [
        { q: "This planet is known as the Red Planet.", a: "Mars" },
        { q: "The closest star to Earth.", a: "The Sun" },
        { q: "Name of the galaxy we reside in.", a: "Milky Way" },
        { q: "First human to travel into space.", a: "Yuri Gagarin" },
        { q: "This black hole lies at the center of our galaxy.", a: "Sagittarius A*" }
      ]
    },
    {
      title: "RETRO TECH",
      questions: [
        { q: "The company that released the Walkman in 1979.", a: "Sony" },
        { q: "Standard floppy disk storage capacity.", a: "1.44 MB" },
        { q: "Predecessor to the internet.", a: "ARPANET" },
        { q: "The first popular web browser.", a: "Mosaic" },
        { q: "Year the first iPhone was released.", a: "2007" }
      ]
    },
    {
      title: "NETRUNNER LORE",
      questions: [
        { q: "A glitch in the system.", a: "Bug" },
        { q: "Protocol for secure communication.", a: "HTTPS" },
        { q: "Binary representation of decimal 2.", a: "10" },
        { q: "Language used to style web pages.", a: "CSS" },
        { q: "The brain of the computer.", a: "CPU" }
      ]
    }
  ];

  return defaults.map((cat, catIndex) => ({
    id: `cat-${catIndex}-${Date.now()}`,
    title: cat.title,
    clues: cat.questions.map((q, clueIndex) => ({
      id: `clue-${catIndex}-${clueIndex}`,
      value: (clueIndex + 1) * 100,
      question: q.q,
      answer: q.a
    }))
  }));
};
