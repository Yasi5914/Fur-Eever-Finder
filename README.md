# Team 1  

## Application Description  
Our application will allow people to search for pets both locally and nationwide. The website will have explore pages with filters, such as Cat/Dog, breed, color, etc. This will allow users to narrow down their search to find their desired pet. Users will be able to favorite animals they are interested in adopting and can view them from their personal favorites page. Users can also post animals for adoption. The website will have a log in function, that will allow a user to store information that would be needed to reach out to other users that have posted a pet for adoption. This way, users can email other users to express their interest in a pet or be redirected to an external website to start an application for a pet that is outside of Boulder. The application will allow users to see the posts they have created and also update their own account information when desired.  
 
## Contributors:   
Vince Frazzini, Lucy Profeta, Matthew Simpson, Yash Singh, Andrew Wang, Lindy Zhang  

## Tech Stack:  

| Program | Reason for Use |
| --- | --- |
| EJS | Templating |
| Node.js | Server Environment |
| Express | Server Framework |
| PostgreSQL | Database Management |
| Mocha/Chai | Testing | 
| Bootstrap | CSS Framework |

## Prerequisites to Run: 
Have Docker installed and running in the background

## Running the Application Locally:  
docker compose up

(for website to run locally, `app.listen(3000);` needs to be at the bottom of index.js instead of `module.exports = app.listen(3000);`)

## Running Tests: 
docker compose down -v

docker compose up

(for tests to run, `module.exports = app.listen(3000);` needs to be at the bottom of index.js instead of `app.listen(3000);`)

OR  

docker compose down -v  

docker-compose run web npm test  

## Link to Deployed Application:  
[http://recitation-14-team-01.eastus.cloudapp.azure.com:3000](http://recitation-14-team-01.eastus.cloudapp.azure.com:3000)
