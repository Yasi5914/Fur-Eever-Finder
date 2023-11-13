-- use this for testing:
-- username: login_testing
-- password: testing

INSERT INTO PetInfo(name, animalType, breed, size, age, sex, description, adoptionFee, photoURL) VALUES
('Daisy', 1, 'Golden Retriever', 3, 2, 1, 'Daisy loves sunshine and long walks', 250, 'http://dummyimage.com/162x100.png/dddddd/000000'),
('Baxter', 2, 'Korat', 2, 3, 2, 'He is friendly and loves pets. He only eats Tuna', 2500, 'http://dummyimage.com/162x100.png/dddddd/000000'),
('Carrots', 3, 'Rabbit', 1, 1, 2, 'Carrots loves carrots! He will bite your fingers', 25, 'http://dummyimage.com/162x100.png/dddddd/000000');

-- INSERT INTO Users(username, name, hashPW, adminID) VALUES
-- ('lucy', 'Lucy', '$2b$10$iSW9GnHr.8YQyc5unfskdeF2EI/pj/GJhqVP45pkrHfzcJhxG3qPa', true),
-- ('lindy', 'Lindy', '$2b$10$iSW9GnHr.8YQyc5unfskdeF2EI/pj/GJhqVP45pkrHfzcJhxG3qPa', true),
-- ('yash', 'Yash', '$2b$10$iSW9GnHr.8YQyc5unfskdeF2EI/pj/GJhqVP45pkrHfzcJhxG3qPa', true),
-- ('matt', 'Matt', '$2b$10$iSW9GnHr.8YQyc5unfskdeF2EI/pj/GJhqVP45pkrHfzcJhxG3qPa', true),
-- ('andrew', 'Andrew', '$2b$10$iSW9GnHr.8YQyc5unfskdeF2EI/pj/GJhqVP45pkrHfzcJhxG3qPa', true),
-- ('vince', 'Vince', '$2b$10$iSW9GnHr.8YQyc5unfskdeF2EI/pj/GJhqVP45pkrHfzcJhxG3qPa', true);

-- INSERT INTO Users(username, name, address, hashPW, photoURL) VALUES
-- ('Puppies123', 'Mary Smith', '710 Smith Road', 'puppies4life', 'http://dummyimage.com/162x100.png/dddddd/000000'),
-- ('BunnyLuvr', 'Carter Watts', '12 Bluebell Lane', 'bunnys4life', 'http://dummyimage.com/162x100.png/dddddd/000000'),
-- ('TooManyCats', 'Abby Greer', '2345 Goldfish Ave', 'kittens4like', 'http://dummyimage.com/162x100.png/dddddd/000000');

-- INSERT INTO Applications(status, username, petID) VALUES
-- (1,'TooManyCats', 2);

-- INSERT INTO UserFavorites(username, petID) VALUES
-- ('puppies123', 1),
-- ('puppies123', 2),
-- ('TooManyCats', 3);
