# Team 1  

## Application Description  
Our application will allow people to search for pets and place adoption applications. The website will have a search menu with filters, such as Cat/Dog, breed, color, etc. This will allow users to narrow down their search to find their desired pet. Users will be able to favorite animals they are interested in adoptin and can view them from their profile. The website will have a log in function, that will allow a user to store all of their information that would be needed for an application. This way, users can place an adoption application without filling out a form with their information. The aplication is stored in a database. They can see which applications they have submitted. Users can also post animals for adoption.  
 
## Contributors:   
Vince Frazzini, Lucy Profeta, Matthew Simpson, Yash Singh, Andrew Wang, Lindy Zhang  

## Tech Stack:  

|Program| Intent|
| --- | --- |
| EJS | Templating |
| Node.js | Server Environment |
| Express | Server Framework |
| PostgreSQL | Database Management |
| Mocha/Chai | Testing | 

## Prerequisites to Run: 
Have Docker installed and running in the background

## Running the Application Locally:  
docker compose up
(for website to run locally, "app.listen(3000);" needs to be at the bottom of index.js instead of "module.exports = app.listen(3000);")

## Running Tests: 
docker compose down -v
docker compose up
(for tests to pass, "module.exports = app.listen(3000);" needs to be at the bottom of index.js instead of "app.listen(3000);")

## Link to Deployed Application:  
