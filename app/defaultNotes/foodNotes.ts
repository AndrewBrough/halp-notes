import { Note } from '../types';

const now = Date.now();

const foodQualities = ['healthy', 'comfort', 'quick', 'reward', 'favorite'];
const mealDescriptions = {
  breakfast: [
    'Overnight oats with berries and honey',
    'Avocado toast with poached eggs',
    'Greek yogurt parfait with granola',
    'Breakfast burrito with eggs and veggies',
    'Smoothie bowl with fresh fruits',
    'Pancakes with maple syrup',
    'English breakfast with beans and toast',
    'Chia seed pudding with almonds',
    'French toast with cinnamon',
    'Breakfast sandwich with bacon'
  ],
  lunch: [
    'Quinoa bowl with roasted vegetables',
    'Turkey and avocado wrap',
    'Mediterranean salad with feta',
    'Poke bowl with fresh fish',
    'Vegetable soup with crusty bread',
    'Chicken Caesar salad',
    'Bento box with rice and fish',
    'Caprese sandwich with pesto',
    'Buddha bowl with tahini dressing',
    'Tuna salad with crackers'
  ],
  dinner: [
    'Grilled salmon with asparagus',
    'Pasta carbonara with parmesan',
    'Stir-fried tofu with vegetables',
    'Homemade pizza with fresh basil',
    'Curry chicken with rice',
    'Beef stir-fry with broccoli',
    'Vegetarian lasagna',
    'Shrimp scampi with linguine',
    'Roasted chicken with potatoes',
    'Black bean burgers with sweet potato fries'
  ],
  snack: [
    'Apple slices with peanut butter',
    'Trail mix with dried fruits',
    'Hummus with carrot sticks',
    'Greek yogurt with honey',
    'Popcorn with sea salt',
    'Dark chocolate squares',
    'Mixed nuts and seeds',
    'Cheese and crackers',
    'Fruit smoothie',
    'Rice cakes with avocado'
  ]
};

// Helper to get 2-3 random qualities for each note
const getRandomQualities = () => {
  const shuffled = [...foodQualities].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
};

export const foodNotes: Note[] = Object.entries(mealDescriptions).flatMap(([mealType, descriptions]) =>
  descriptions.map((desc, index) => {
    const qualities = getRandomQualities();
    return {
      id: `${mealType}-${index + 1}`,
      title: desc,
      content: `A delicious ${mealType} option that's perfect for any day. ${
        qualities.includes('healthy') ? 'This is a nutritious choice that will keep you energized. ' : ''
      }${
        qualities.includes('quick') ? 'Quick and easy to prepare. ' : ''
      }${
        qualities.includes('comfort') ? 'Perfect comfort food for a cozy day. ' : ''
      }${
        qualities.includes('reward') ? 'A great treat to reward yourself. ' : ''
      }${
        qualities.includes('favorite') ? 'One of my all-time favorites! ' : ''
      }`,
      tags: [mealType, ...qualities],
      createdAt: now - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000, // Random date within last 30 days
      updatedAt: now,
      versions: []
    };
  })
); 