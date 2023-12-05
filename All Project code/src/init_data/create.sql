DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE Users(
    username VARCHAR(25) PRIMARY KEY NOT NULL,
    name VARCHAR(45),
    address VARCHAR(255),
    hashPW CHAR(60) NOT NULL,
    adminID BOOLEAN,
    photoURL VARCHAR(255),
    email VARCHAR(55)
);
-- DROP TABLE IF EXISTS PetInfo CASCADE;
CREATE TABLE PetInfo(
    petID SERIAL NOT NULL,
    name VARCHAR(45) NOT NULL,
    animalType INT NOT NULL,
    breed VARCHAR(45),
    size INT NOT NULL,
    age INT NOT NULL,
    sex INT NOT NULL,
    description VARCHAR(500),
    adoptionFee INT,
    petPhoto VARCHAR(255),
    PRIMARY KEY (petID, name, petPhoto),
    CONSTRAINT unique_petinfo_id_name UNIQUE (petID, name, petPhoto)
);

-- DROP TABLE IF EXISTS PetInfo CASCADE;
CREATE TABLE PetInfoAPI(
    petID INT NOT NULL,
    name VARCHAR(45) NOT NULL,
    age VARCHAR(45) NOT NULL,
    sex VARCHAR(45) NOT NULL,
    description VARCHAR(500),
    petPhoto VARCHAR(255),
    PRIMARY KEY (petID, name, petPhoto),
    CONSTRAINT unique_petinfoapi_id_name UNIQUE (petID, name, petPhoto)
);

-- DROP TABLE IF EXISTS User_to_Pet CASCADE;
CREATE TABLE User_to_Pet(
    username VARCHAR(25),
    petID INT,
    name VARCHAR(45),
    petPhoto VARCHAR(255),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (petID, name, petPhoto) REFERENCES PetInfo(petID, name, petPhoto)
);


-- the user in this table is the one trying to adopt
-- DROP TABLE IF EXISTS Applications CASCADE;
CREATE TABLE Applications(
    applicationID SERIAL PRIMARY KEY NOT NULL,
    status INT NOT NULL,
    username VARCHAR(25) NOT NULL,
    petID INT NOT NULL,
    name VARCHAR(45) NOT NULL,
    petPhoto VARCHAR(255),
    FOREIGN KEY(username) REFERENCES Users(username),
    FOREIGN KEY(petID, name, petPhoto) REFERENCES PetInfo(petID, name, petPhoto)
);


-- DROP TABLE IF EXISTS UserFavorites CASCADE;
CREATE TABLE UserFavoritesBoulder(
    username VARCHAR(25) NOT NULL,
    petID INT NOT NULL,
    name VARCHAR(45) NOT NULL,
    petPhoto VARCHAR(255),
    FOREIGN KEY(username) REFERENCES Users(username),
    FOREIGN KEY(petID, name, petPhoto) REFERENCES PetInfo(petID, name, petPhoto)
);

-- DROP TABLE IF EXISTS UserFavorites CASCADE;
CREATE TABLE UserFavoritesAnywhere(
    username VARCHAR(25) NOT NULL,
    petID INT NOT NULL,
    name VARCHAR(45) NOT NULL,
    petPhoto VARCHAR(255),
    FOREIGN KEY(username) REFERENCES Users(username),
    FOREIGN KEY(petID, name, petPhoto) REFERENCES PetInfoAPI(petID, name, petPhoto)
);
