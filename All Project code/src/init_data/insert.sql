-- used this for testing:
-- username: login_testing
-- password: testing

INSERT INTO PetInfo(name, animalType, breed, size, age, sex, description, adoptionFee, petPhoto) VALUES
('Daisy', 1, 'Golden Retriever', 1, 1, 1, 'Daisy loves to play fetch and lay in the sunshine. She is scared of thunder and needs lots of pets when there is a storm.', 100, 'https://www.windyknollgoldens.com/wp-content/uploads/2017/06/Sweet-gentle-and-adorbale-AKC-GOlden-Retriever-puppies-are-ideal-for-the-family.jpg'),
('Max', 2, 'Maine Coon', 2, 11, 2, 'He is friendly and loves pets. Max does not like kids.', 75, 'https://th.bing.com/th/id/OIP.oRaH-njWnwwTsLG546BangHaFj?rs=1&pid=ImgDetMain'),
('Carrots', 3, 'Bunny', 1, 4, 2, 'Carrots loves carrots! Be careful because he will bite your fingers.', 40, 'https://th.bing.com/th/id/R.fb0b44a264f4cd932aacfa4a424bbcd7?rik=Tp4%2f64G95aCYmQ&pid=ImgRaw&r=0');

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
