DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE Users(
    username VARCHAR(25) PRIMARY KEY NOT NULL,
    name VARCHAR(45),
    address VARCHAR(255),
    hashPW CHAR(60) NOT NULL,
    adminID BOOLEAN,
    photoURL VARCHAR(255)
);
DROP TABLE IF EXISTS PetInfo CASCADE;
CREATE TABLE PetInfo(
    petID SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(45),
    animalType INT NOT NULL,
    breed VARCHAR(45),
    size INT NOT NULL,
    age INT NOT NULL,
    sex INT NOT NULL,
    description VARCHAR(500),
    adoptionFee INT,
    photoURL VARCHAR(255)
);

DROP TABLE IF EXISTS User_to_Pet CASCADE;
CREATE TABLE User_to_Pet(
    username VARCHAR(25),
    petID INT,
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (petID) REFERENCES PetInfo(petID)
);

-- the user in this table is the one trying to adopt
DROP TABLE IF EXISTS Applications CASCADE;
CREATE TABLE Applications(
    applicationID SERIAL PRIMARY KEY NOT NULL,
    status INT NOT NULL,
    username VARCHAR(25) NOT NULL,
    petID INT NOT NULL,
    FOREIGN KEY(username) REFERENCES Users(username),
    FOREIGN KEY(petID) REFERENCES PetInfo(petID)
);

DROP TABLE IF EXISTS UserFavorites CASCADE;
CREATE TABLE UserFavorites(
    username VARCHAR(25) NOT NULL,
    petID INT NOT NULL,
    FOREIGN KEY(username) REFERENCES Users(username),
    FOREIGN KEY(petID) REFERENCES PetInfo(petID)
);