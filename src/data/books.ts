import oliverTwistCover from "../assets/books/oliver-twist.jpg";
import melaninSunCover from "../assets/books/melanin-sun.jpg";
import threeMistakesCover from "../assets/books/three-mistakes.jpg";
import callCenterCover from "../assets/books/call-center.jpg";
import siddharthaCover from "../assets/books/siddhartha.jpg";
import alchemistCover from "../assets/books/alchemist.jpg";
import whiteNightsCover from "../assets/books/white-nights.jpg";
import metamorphosisCover from "../assets/books/metamorphosis.jpg";
import animalFarmCover from "../assets/books/animal-farm.jpg";
import subtleArtCover from "../assets/books/subtle-art.jpg";
import psychologyOfMoneyCover from "../assets/books/psychology-of-money.jpg";
import trialCover from "../assets/books/trial.jpg";

export interface BookItem {
  id: string;
  name: string;
  subtext: string;
  author: string;
  year: string;
  coverImage: string;
  isCurrentlyReading?: boolean;
  spineColor: string;
  foilColor: string;
}

export type Book = BookItem;

export const booksList: BookItem[] = [
  {
    id: "trial",
    name: "The Trial",
    subtext: "Der Process",
    author: "Franz Kafka",
    year: "1925",
    coverImage: trialCover,
    isCurrentlyReading: true,
    spineColor: "#1a1e28",
    foilColor: "#a5b4fc",
  },
  {
    id: "white-nights",
    name: "White Nights",
    subtext: "A Sentimental Story from the Diary of a Dreamer",
    author: "Fyodor Dostoevsky",
    year: "1848",
    coverImage: whiteNightsCover,
    spineColor: "#0f172a",
    foilColor: "#7dd3fc",
  },
  {
    id: "metamorphosis",
    name: "The Metamorphosis",
    subtext: "Die Verwandlung",
    author: "Franz Kafka",
    year: "1915",
    coverImage: metamorphosisCover,
    spineColor: "#211a14",
    foilColor: "#fbbf24",
  },
  {
    id: "animal-farm",
    name: "Animal Farm",
    subtext: "A Fairy Story",
    author: "George Orwell",
    year: "1945",
    coverImage: animalFarmCover,
    spineColor: "#231113",
    foilColor: "#fb7185",
  },
  {
    id: "oliver-twist",
    name: "Oliver Twist",
    subtext: "The Parish Boy's Progress",
    author: "Charles Dickens",
    year: "1838",
    coverImage: oliverTwistCover,
    spineColor: "#1d1916",
    foilColor: "#fde047",
  },
  {
    id: "siddhartha",
    name: "Siddhartha",
    subtext: "An Indian Tale",
    author: "Hermann Hesse",
    year: "1922",
    coverImage: siddharthaCover,
    spineColor: "#1c1429",
    foilColor: "#c084fc",
  },
  {
    id: "alchemist",
    name: "The Alchemist",
    subtext: "A Fable About Following Your Dream",
    author: "Paulo Coelho",
    year: "1988",
    coverImage: alchemistCover,
    spineColor: "#24180d",
    foilColor: "#f59e0b",
  },
  {
    id: "psychology-of-money",
    name: "The Psychology of Money",
    subtext: "Timeless Lessons on Wealth, Greed, and Happiness",
    author: "Morgan Housel",
    year: "2020",
    coverImage: psychologyOfMoneyCover,
    spineColor: "#0b201a",
    foilColor: "#34d399",
  },
  {
    id: "subtle-art",
    name: "The Subtle Art of Not Giving a F*ck",
    subtext: "A Counterintuitive Approach to Living a Good Life",
    author: "Mark Manson",
    year: "2016",
    coverImage: subtleArtCover,
    spineColor: "#26170e",
    foilColor: "#fb923c",
  },
  {
    id: "three-mistakes",
    name: "The 3 Mistakes of My Life",
    subtext: "A Story About Business, Cricket, and Religion",
    author: "Chetan Bhagat",
    year: "2008",
    coverImage: threeMistakesCover,
    spineColor: "#141724",
    foilColor: "#22d3ee",
  },
  {
    id: "call-center",
    name: "One Night @ the Call Center",
    subtext: "A Modern Urban Tale",
    author: "Chetan Bhagat",
    year: "2005",
    coverImage: callCenterCover,
    spineColor: "#1b1229",
    foilColor: "#a78bfa",
  },
  {
    id: "melanin-sun",
    name: "From the Notebooks of Melanin Sun",
    subtext: "Love, Truth, and the Bonds of Family",
    author: "Jacqueline Woodson",
    year: "1995",
    coverImage: melaninSunCover,
    spineColor: "#241219",
    foilColor: "#f472b6",
  },
];
