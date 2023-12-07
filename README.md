# Team 1  

## Application Description  
Fur-Ever Friend Finder simplifies the search for furry companions, offering a seamless experience both locally and nationwide. The user-friendly explore pages are equipped with dynamic filters, including species, breed, color, and more, empowering users to refine their search and discover their ideal pets effortlessly. Users can also favorite potential pets, curating a dedicated favorites page for easy access.
Not only can users explore, but they can also actively contribute by posting animals available for adoption. The platform's secure login function facilitates efficient communication between users, storing essential information for seamless connections. This functionality extends to the ability to begin an application after being redirected to external adoption platforms for pets beyond their local vicinity.
With a user-centric approach, the application ensures individuals can manage their adoption journey efficiently. Users can review and update their posted content, fostering a sense of community engagement. Additionally, the platform provides a space to modify account information, granting users the flexibility to tailor their experience to their preferences.    
 
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
