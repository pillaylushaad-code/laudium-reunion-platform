const quizQuestions = [
  // ========================================
  // SCHOOL MEMORIES — 6
  // ========================================

  {
    id: 1,
    category: "School Memories",
    question: "Who were the two vendors remembered by learners?",
    options: [
      "Uncle Deva and Aunty Chandrie",
      "Aunty Cookie and Uncle Deva",
      "Uncle Deva and Aunty Haffejee",
      "Aunty Chandrie and Aunty Cookie",
    ],
    correctAnswer: "Uncle Deva and Aunty Chandrie",
  },

  {
    id: 2,
    category: "School Memories",
    question: "Which pair were popular snacks from the school vendors?",
    options: [
      "Chocolate peanuts and Country Corn",
      "Toasted sandwiches and pies",
      "Chicken burgers and chips",
      "Pizza slices and doughnuts",
    ],
    correctAnswer: "Chocolate peanuts and Country Corn",
  },

  {
    id: 3,
    category: "School Memories",
    question: "Which sandwich was one of Aunty Cookie's specials?",
    options: [
      "Polony special",
      "Cheese and tomato",
      "Egg and bacon",
      "Tuna melt",
    ],
    correctAnswer: "Polony special",
  },

  {
    id: 4,
    category: "School Memories",
    question: 'Who was associated with "You uncouth barbarian"?',
    options: [
      "Ms. Haffejee",
      "Ms. Mathews",
      "Ms. Chetty",
      "Ms. Singh",
    ],
    correctAnswer: "Ms. Haffejee",
  },

  {
    id: 5,
    category: "School Memories",
    question: "What were the school's two main blocks called?",
    options: [
      "Blue and Green",
      "Red and Blue",
      "Green and Yellow",
      "Blue and Yellow",
    ],
    correctAnswer: "Blue and Green",
  },

  {
    id: 6,
    category: "School Memories",
    question: "Which attraction featured on a matric excursion?",
    options: [
      "Gold Reef City",
      "Sun City",
      "Montecasino",
      "uShaka Marine World",
    ],
    correctAnswer: "Gold Reef City",
  },

  // ========================================
  // CURRICULUM NOSTALGIA — 5
  // ========================================

  {
    id: 7,
    category: "Curriculum Nostalgia",
    question: "In Accounting, what does the accounting equation balance?",
    options: [
      "Assets, equity and liabilities",
      "Income, expenses and profit",
      "Cash, stock and sales",
      "Capital, revenue and drawings",
    ],
    correctAnswer: "Assets, equity and liabilities",
  },

  {
    id: 8,
    category: "Curriculum Nostalgia",
    question: "In Economics, what happens when demand exceeds supply?",
    options: [
      "Prices tend to rise",
      "Prices tend to fall",
      "Production must stop",
      "Demand automatically falls to zero",
    ],
    correctAnswer: "Prices tend to rise",
  },

  {
    id: 9,
    category: "Curriculum Nostalgia",
    question: "In Maths, what does a negative gradient indicate?",
    options: [
      "The line slopes downward",
      "The line is horizontal",
      "The line slopes upward",
      "The line has no intercept",
    ],
    correctAnswer: "The line slopes downward",
  },

  {
    id: 10,
    category: "Curriculum Nostalgia",
    question: "Which LO concept involves evaluating your own strengths and weaknesses?",
    options: [
      "Self-awareness",
      "Stereotyping",
      "Negotiation",
      "Socialisation",
    ],
    correctAnswer: "Self-awareness",
  },

  {
    id: 11,
    category: "Curriculum Nostalgia",
    question: "In Business Studies, what is a SWOT analysis used to examine?",
    options: [
      "Strengths, weaknesses, opportunities and threats",
      "Sales, wages, output and taxes",
      "Supply, wages, ownership and trade",
      "Strategy, work, organisation and training",
    ],
    correctAnswer:
      "Strengths, weaknesses, opportunities and threats",
  },

  // ========================================
  // AFRIKAANS — 3
  // ========================================

  {
    id: 12,
    category: "Afrikaans",
    question: 'Which word is the correct plural of "kind"?',
    options: [
      "Kinders",
      "Kinde",
      "Kindeers",
      "Kindere",
    ],
    correctAnswer: "Kinders",
  },

  {
    id: 13,
    category: "Afrikaans",
    question: 'Which word best completes: "Ek ___ gister skool toe."',
    options: [
      "het gegaan",
      "gaan het",
      "het gaan",
      "gegaan het",
    ],
    correctAnswer: "het gegaan",
  },

  {
    id: 14,
    category: "Afrikaans",
    question: 'What does "Die appel val nie ver van die boom nie" imply?',
    options: [
      "Children often resemble their parents",
      "Fruit trees need good soil",
      "People should stay close to home",
      "Nature is difficult to predict",
    ],
    correctAnswer: "Children often resemble their parents",
  },

  // ========================================
  // HISTORY — 4
  // ========================================

  {
    id: 15,
    category: "History",
    question: "Why did the Cold War remain largely 'cold'?",
    options: [
      "The superpowers avoided direct full-scale war",
      "There were no military conflicts",
      "Nuclear weapons had not been invented",
      "The Soviet Union avoided foreign involvement",
    ],
    correctAnswer:
      "The superpowers avoided direct full-scale war",
  },

  {
    id: 16,
    category: "History",
    question: "What was a major consequence of the Treaty of Versailles?",
    options: [
      "Germany faced severe penalties",
      "Germany gained new territory",
      "The Soviet Union joined NATO",
      "The United Nations was created",
    ],
    correctAnswer: "Germany faced severe penalties",
  },

  {
    id: 17,
    category: "History",
    question: "Why was the 1955 Bandung Conference significant?",
    options: [
      "It promoted cooperation among Asian and African countries",
      "It created the European Union",
      "It ended World War II",
      "It established NATO",
    ],
    correctAnswer:
      "It promoted cooperation among Asian and African countries",
  },

  {
    id: 18,
    category: "History",
    question: "What did the fall of the Berlin Wall symbolise?",
    options: [
      "The weakening of communist rule in Eastern Europe",
      "The beginning of World War II",
      "The division of Germany",
      "The creation of the Soviet Union",
    ],
    correctAnswer:
      "The weakening of communist rule in Eastern Europe",
  },

  // ========================================
  // GENERAL KNOWLEDGE — 4
  // ========================================

  {
    id: 19,
    category: "General Knowledge",
    question: "Which civilisation built Machu Picchu?",
    options: [
      "Inca",
      "Maya",
      "Aztec",
      "Roman",
    ],
    correctAnswer: "Inca",
  },

  {
    id: 20,
    category: "General Knowledge",
    question: "Which country has the most natural lakes?",
    options: [
      "Canada",
      "Russia",
      "Brazil",
      "United States",
    ],
    correctAnswer: "Canada",
  },

  {
    id: 21,
    category: "General Knowledge",
    question: "Which instrument measures atmospheric pressure?",
    options: [
      "Barometer",
      "Hygrometer",
      "Anemometer",
      "Thermometer",
    ],
    correctAnswer: "Barometer",
  },

  {
    id: 22,
    category: "General Knowledge",
    question: "Which element has the chemical symbol Au?",
    options: [
      "Gold",
      "Silver",
      "Copper",
      "Aluminium",
    ],
    correctAnswer: "Gold",
  },

  // ========================================
  // LIFE AS WE GROW OLDER — 3
  // ========================================

  {
    id: 23,
    category: "Life as We Grow Older",
    question: "What is the main danger of lifestyle inflation?",
    options: [
      "Spending rises as income rises",
      "Taxes automatically increase",
      "Savings become illegal",
      "Interest rates disappear",
    ],
    correctAnswer: "Spending rises as income rises",
  },

  {
    id: 24,
    category: "Life as We Grow Older",
    question: "What does an insurance excess represent?",
    options: [
      "The amount you pay towards a claim",
      "Your monthly insurance premium",
      "The value of your insured property",
      "The amount refunded after a claim",
    ],
    correctAnswer: "The amount you pay towards a claim",
  },

  {
    id: 25,
    category: "Life as We Grow Older",
    question: "What does inflation reduce over time?",
    options: [
      "Purchasing power",
      "Interest rates",
      "Employment",
      "Productivity",
    ],
    correctAnswer: "Purchasing power",
  },
];

export default quizQuestions;