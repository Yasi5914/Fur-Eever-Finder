DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE Users(
    username VARCHAR(25) PRIMARY KEY,
    name VARCHAR(45),
    address VARCHAR(255),
    hashPW CHAR(60) NOT NULL,
    adminID INT,
    photoURL VARCHAR(255)
);
DROP TABLE IF EXISTS PetInfo CASCADE;
CREATE TABLE PetInfo(
    petID INT PRIMARY KEY,
    name VARCHAR(45),
    animalType INT NOT NULL,
    breed VARCHAR(45),
    size INT NOT NULL,
    age INT NOT NULL,
    sex INT NOT NULL,
    description VARCHAR(500),
    adoptionFee INT,
    photoURL VARCHAR(255),
    username VARCHAR(25),
    FOREIGN KEY(username) REFERENCES Users(username)
);

DROP TABLE IF EXISTS Applications CASCADE;
CREATE TABLE Applications(
    applicationID INT PRIMARY KEY,
    date DATE,
    status INT NOT NULL,
    username VARCHAR(25),
    petID INT,
    FOREIGN KEY(username) REFERENCES Users(username),
    FOREIGN KEY(petID) REFERENCES PetInfo(petID)
);

DROP TABLE IF EXISTS UserFavorites CASCADE;
CREATE TABLE UserFavorites(
    username VARCHAR(25),
    petID INT,
    FOREIGN KEY(username) REFERENCES Users(username),
    FOREIGN KEY(petID) REFERENCES PetInfo(petID)
)

DROP TABLE IF EXISTS UserPosts CASCADE;
CREATE TABLE UserPosts(
    username VARCHAR(25),
    petID INT,
    FOREIGN KEY(username) REFERENCES Users(username),
    FOREIGN KEY(petID) REFERENCES PetInfo(petID)
)
