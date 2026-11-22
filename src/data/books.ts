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
import monkFerrariCover from "../assets/books/monk-ferrari.jpg";
import leaguesCover from "../assets/books/twenty-thousand-leagues.jpg";
import bobokCover from "../assets/books/bobok.jpg";

export interface BookItem {
  id: string;
  name: string;
  subtext: string;
  author: string;
  year: string;
  quote: string;
  review: string;
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
    quote: "Someone must have traduced Joseph K., for without having done anything wrong he was arrested one fine morning.",
    review: "Kafka's dissection of opaque bureaucratic systems mirrors the terrifying complexity of undocumented legacy enterprise architectures. It taught me that clarity, observability, and transparent interfaces are moral obligations in software engineering.",
    coverImage: trialCover,
    isCurrentlyReading: true,
    spineColor: "#182230",
    foilColor: "#fb923c",
  },
  {
    id: "white-nights",
    name: "White Nights",
    subtext: "A Sentimental Story from the Diary of a Dreamer",
    author: "Fyodor Dostoevsky",
    year: "1848",
    quote: "A whole moment of happiness! Why, isn't that enough for a whole life?",
    review: "A masterclass in romantic idealism versus grounded reality. It reminds me to cultivate genuine human depth and empathy amidst fast-paced technical sprints and digital abstraction.",
    coverImage: whiteNightsCover,
    spineColor: "#13203c",
    foilColor: "#38bdf8",
  },
  {
    id: "metamorphosis",
    name: "The Metamorphosis",
    subtext: "Die Verwandlung",
    author: "Franz Kafka",
    year: "1915",
    quote: "One morning, as Gregor Samsa was waking up from anxious dreams, he discovered that in bed he had been changed into a monstrous verminous bug.",
    review: "A piercing exploration of systemic utility: what happens when a contributor can no longer produce? It anchors my leadership philosophy around empathetic engineering cultures and sustainable human pacing.",
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
    quote: "All animals are equal, but some animals are more equal than others.",
    review: "A timeless study of corruption, goal-drift, and subtle shifting of specifications. Essential reading for anyone managing requirements, organizational architecture, and engineering governance.",
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
    quote: "Please, sir, I want some more.",
    review: "Dickens exposes institutional neglect with visceral honesty. It forged my belief that user-facing software must fight for the most vulnerable end-users, ensuring uncompromising accessibility.",
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
    quote: "Wisdom cannot be imparted. Wisdom that a wise man attempts to impart always sounds like foolishness to someone else.",
    review: "Hesse's revelation that true wisdom cannot simply be taught, but must be experienced firsthand. This underpins my builder mindset: you only truly master complex distributed systems by shipping, breaking, and rebuilding them yourself.",
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
    quote: "When you want something, all the universe conspires in helping you to achieve it.",
    review: "The pursuit of one's Personal Legend through signs and discipline. A constant reminder to pursue ambitious technical moonshots and embrace the necessary friction of difficult problems.",
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
    quote: "Doing well with money has a little to do with how smart you are and a lot to do with how you behave.",
    review: "Morgan Housel explains that financial and architectural success isn't about raw intellect, but behavioral discipline, margin of safety, and compounding small advantages over time.",
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
    quote: "Who you are is defined by what you’re willing to struggle for.",
    review: "Radical prioritization and choosing which problems are worth solving. In system architecture, saying 'no' to 99% of vanity complexity is how you ship resilient, maintainable software.",
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
    quote: "Real life isn’t about following a script. It’s about creating your own destiny despite the errors.",
    review: "A grounded story of ambition, business miscalculations, and resilience. It taught me that calculated risk-taking always carries failure modes—what matters is how fast you iterate and recover.",
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
    quote: "Sometimes in the quietest hours of the night, a single conversation can alter the entire trajectory of a life.",
    review: "An insightful snapshot of early 2000s tech support pressures and personal crossroads. Reminds me that every high-tech system is ultimately operated by human beings with dreams and anxieties.",
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
    quote: "Love is love, and truth is truth. You can’t change it, no matter how hard you try.",
    review: "A delicate, courageous exploration of identity and unconditional love. It reinforces the importance of psychological safety, open-mindedness, and listening deeply before judging.",
    coverImage: melaninSunCover,
    spineColor: "#241219",
    foilColor: "#f472b6",
  },
  {
    id: "monk-ferrari",
    name: "The Monk Who Sold His Ferrari",
    subtext: "A Fable About Fulfilling Your Dreams",
    author: "Robin Sharma",
    year: "1997",
    quote: "The mind is a wonderful servant, but a terrible master.",
    review: "A transformative fable on mental mastery, purpose, and deliberate pacing. In modern high-velocity software engineering, it acts as a timeless reminder that relentless burnout is the enemy of craft—clarity of thought and disciplined energy management build enduring systems.",
    coverImage: monkFerrariCover,
    spineColor: "#c2410c",
    foilColor: "#fbbf24",
  },
  {
    id: "twenty-thousand-leagues",
    name: "Twenty Thousand Leagues Under the Sea",
    subtext: "Vingt mille lieues sous les mers",
    author: "Jules Verne",
    year: "1870",
    quote: "The sea is only the embodiment of a supernatural and wonderful existence. It is the Living Infinite.",
    review: "Verne's masterpiece of visionary technological imagination. Captain Nemo's Nautilus embodies the ultimate frontier of autonomous systems architecture—pushing technical boundaries into the uncharted depths while balancing engineering mastery with ethical stewardship.",
    coverImage: leaguesCover,
    spineColor: "#0b202e",
    foilColor: "#38bdf8",
  },
  {
    id: "bobok",
    name: "Bobok",
    subtext: "From Somebody's Diary · 1873",
    author: "Fyodor Dostoevsky",
    year: "1873",
    quote: "Bobok, bobok! Even here there is no peace, even here there is vanity.",
    review: "Dostoevsky's sharpest, most unsettling satirical grotesque on human pretension and intellectual vanity. It reminds me that stripped of titles, vanity metrics, and superficial complexity, software engineering is fundamentally about truth, simplicity, and unvarnished reality.",
    coverImage: bobokCover,
    spineColor: "#101827",
    foilColor: "#38bdf8",
  },
];
