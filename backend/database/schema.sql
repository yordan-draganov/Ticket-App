CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    long_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    organizer VARCHAR(255),
    start_time VARCHAR(50),
    end_time VARCHAR(50),
    available_tickets INTEGER NOT NULL,
    total_tickets INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price_per_ticket DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_events_category ON events(category);

INSERT INTO events (title, date, location, description, long_description, price, category, image, organizer, start_time, end_time, available_tickets, total_tickets) VALUES
('Summer Music Festival', 'June 21, 2025', 'Central Park, NYC', 'A full-day event with live performances by top artists.', 'Join us for an incredible day of music and fun at Central Park! The Summer Music Festival brings together the best artists from around the world for a day you won''t forget. Enjoy food vendors, art installations, and of course, amazing musical performances across three stages. Early arrival is recommended as space is limited.', 49.99, 'Music', '/api/placeholder/800/400', 'NYC Events Co.', '11:00 AM', '10:00 PM', 3, 3),

('Tech Innovators Conference', 'July 10, 2025', 'San Francisco, CA', 'Meet industry leaders and explore the future of tech.', 'The Tech Innovators Conference is where the brightest minds in technology come together to share ideas and shape the future. This year''s conference features keynote speakers from leading tech companies, hands-on workshops, networking opportunities, and exhibits showcasing cutting-edge innovations. Perfect for professionals, entrepreneurs, and tech enthusiasts.', 199.00, 'Technology', '/api/placeholder/800/400', 'Tech Forward', '9:00 AM', '6:00 PM', 200, 200),

('Food & Wine Expo', 'August 5, 2025', 'Chicago, IL', 'Taste gourmet dishes and world-class wines.', 'Indulge your senses at the Food & Wine Expo, Chicago''s premier culinary event. Sample exquisite dishes prepared by renowned chefs, discover rare and delicious wines from around the world, and learn cooking techniques from expert demonstrations. The expo features over 100 vendors, cooking competitions, and exclusive tasting sessions.', 29.00, 'Food', '/api/placeholder/800/400', 'Taste of America', '12:00 PM', '8:00 PM', 300, 300),

('Annual Comic Convention', 'September 15, 2025', 'Los Angeles, CA', 'Celebrate comics, movies, and pop culture with fellow fans.', 'The Annual Comic Convention brings together fans, creators, and stars for a celebration of all things pop culture! Meet your favorite comic artists, attend celebrity panels, show off your best cosplay, and shop for exclusive merchandise. This year''s convention will feature special guests from blockbuster superhero movies, anime voice actors, and legendary comic creators.', 45.00, 'Entertainment', '/api/placeholder/800/400', 'Fandom Events', '10:00 AM', '7:00 PM', 1000, 1000),

('Marathon City Run', 'October 10, 2025', 'Boston, MA', 'Join thousands of runners in this exciting city marathon.', 'Challenge yourself at the Marathon City Run, a 26.2-mile journey through the historic streets of Boston. This USATF-certified course takes runners past iconic landmarks and through beautiful neighborhoods, with cheering spectators lining the route. Registration includes a race kit, finisher medal, and access to the post-race celebration with live music and refreshments.', 75.00, 'Sports', '/api/placeholder/800/400', 'Boston Athletics Association', '7:00 AM', '2:00 PM', 10000, 10000);