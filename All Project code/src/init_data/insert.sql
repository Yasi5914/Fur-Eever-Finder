-- used this for testing:
-- username: login_testing
-- password: testing

INSERT INTO PetInfo(name, animalType, breed, size, age, sex, description, adoptionFee, petPhoto) VALUES
('Daisy', 1, 'Golden Retriever', 1, 1, 1, 'Daisy loves to play fetch and lay in the sunshine. She is scared of thunder and needs lots of pets when there is a storm.', 100, 'https://github.com/Yasi5914/Final_project_3308_team_1/blob/petpic/All%20Project%20code/src/resources/img/dog.jpeg?raw=true'),
('Max', 2, 'Maine Coon', 2, 11, 2, 'He is friendly and loves pets. Max does not like kids.', 75, 'https://github.com/Yasi5914/Final_project_3308_team_1/blob/petpic/All%20Project%20code/src/resources/img/cat.jpeg?raw=true'),
('Carrots', 3, 'Bunny', 1, 4, 2, 'Carrots loves carrots! Be careful because he will bite your fingers.', 40, 'https://github.com/Yasi5914/Final_project_3308_team_1/blob/petpic/All%20Project%20code/src/resources/img/other.jpeg?raw=true');

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
