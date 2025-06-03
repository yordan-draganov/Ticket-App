const pool = require('../config/database');

const seedEvents = [
  {
    title: "Summer Music Festival",
    date: "June 21, 2025",
    location: "Central Park, NYC",
    description: "A full-day event with live performances by top artists.",
    long_description: "Join us for an incredible day of music and fun at Central Park! The Summer Music Festival brings together the best artists from around the world for a day you won't forget. Enjoy food vendors, art installations, and of course, amazing musical performances across three stages. Early arrival is recommended as space is limited.",
    price: 49.99,
    category: "Music",
    image: "/api/placeholder/800/400",
    organizer: "NYC Events Co.",
    start_time: "11:00 AM",
    end_time: "10:00 PM",
    available_tickets: 5,
    total_tickets: 5
  },
  {
    title: "Tech Innovators Conference",
    date: "July 10, 2025",
    location: "San Francisco, CA",
    description: "Meet industry leaders and explore the future of tech.",
    long_description: "The Tech Innovators Conference is where the brightest minds in technology come together to share ideas and shape the future. This year's conference features keynote speakers from leading tech companies, hands-on workshops, networking opportunities, and exhibits showcasing cutting-edge innovations. Perfect for professionals, entrepreneurs, and tech enthusiasts.",
    price: 199.00,
    category: "Technology",
    image: "/api/placeholder/800/400",
    organizer: "Tech Forward",
    start_time: "9:00 AM",
    end_time: "6:00 PM",
    available_tickets: 200,
    total_tickets: 200
  },
  {
    title: "Food & Wine Expo",
    date: "August 5, 2025",
    location: "Chicago, IL",
    description: "Taste gourmet dishes and world-class wines.",
    long_description: "Indulge your senses at the Food & Wine Expo, Chicago's premier culinary event. Sample exquisite dishes prepared by renowned chefs, discover rare and delicious wines from around the world, and learn cooking techniques from expert demonstrations. The expo features over 100 vendors, cooking competitions, and exclusive tasting sessions.",
    price: 29.00,
    category: "Food",
    image: "/api/placeholder/800/400",
    organizer: "Taste of America",
    start_time: "12:00 PM",
    end_time: "8:00 PM",
    available_tickets: 300,
    total_tickets: 300
  },
  {
    title: "Annual Comic Convention",
    date: "September 15, 2025",
    location: "Los Angeles, CA",
    description: "Celebrate comics, movies, and pop culture with fellow fans.",
    long_description: "The Annual Comic Convention brings together fans, creators, and stars for a celebration of all things pop culture! Meet your favorite comic artists, attend celebrity panels, show off your best cosplay, and shop for exclusive merchandise. This year's convention will feature special guests from blockbuster superhero movies, anime voice actors, and legendary comic creators.",
    price: 45.00,
    category: "Entertainment",
    image: "/api/placeholder/800/400",
    organizer: "Fandom Events",
    start_time: "10:00 AM",
    end_time: "7:00 PM",
    available_tickets: 1000,
    total_tickets: 1000
  },
  {
    title: "Marathon City Run",
    date: "October 10, 2025",
    location: "Boston, MA",
    description: "Join thousands of runners in this exciting city marathon.",
    long_description: "Challenge yourself at the Marathon City Run, a 26.2-mile journey through the historic streets of Boston. This USATF-certified course takes runners past iconic landmarks and through beautiful neighborhoods, with cheering spectators lining the route. Registration includes a race kit, finisher medal, and access to the post-race celebration with live music and refreshments.",
    price: 75.00,
    category: "Sports",
    image: "/api/placeholder/800/400",
    organizer: "Boston Athletics Association",
    start_time: "7:00 AM",
    end_time: "2:00 PM",
    available_tickets: 10000,
    total_tickets: 10000
  }
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    await client.query('TRUNCATE TABLE events RESTART IDENTITY CASCADE');
    console.log('Cleared existing events');
    
    for (const event of seedEvents) {
      const query = `
        INSERT INTO events (
          title, date, location, description, long_description,
          price, category, image, organizer, start_time, end_time,
          available_tickets, total_tickets
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `;
      
      const values = [
        event.title, event.date, event.location, event.description,
        event.long_description, event.price, event.category, event.image,
        event.organizer, event.start_time, event.end_time,
        event.available_tickets, event.total_tickets
      ];
      
      await client.query(query, values);
      console.log(`Inserted event: ${event.title}`);
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };