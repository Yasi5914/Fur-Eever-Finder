# Project Test Plan - Team 1
A test plan is used so we can show our tests and how we intend to perform them to people outside of the project.  
We will be writing API's to call on the user data we have stored in our databases. The purpose of testing the API's is to make sure that the information being given and received performs as it is expected to across all pages and on all of our test cases.  

The API calls that we will make and test are:  

Login and Register Pages  
Retrieving/Updating account information (Account Settings page)  
Creating/Deleting/Updating information about a posted pet (Post Pets page)  
Retrieving/Updating the pets on the explore page both in just Boulder/near campus and all across the United States (Petfinder) (Explore page)  
Creating/Deleting posts made by a user (My Posts page)  
Editing posts made by a user (My Posts page)
Retrieving/Updating favorited pets (Favorites page)  
Deleting posts made by regular users if needed (admin capability) (Admin Access page)  

# UAT Examples:  
## 1.   
Login: The login page should prompt the user to input their username and password. Assuming that they have registered an account previously, if the information is correct, they will be redirected to the home/explore page. If the information entered isn't correct, but they have an account registered, the website will re-render the login page and prompt them to try again. However, if they have not registered an account with the website yet, the user will be redirected to the registration page.  
### Data:  
Username: string  
Password: string  

### User Activity:  
Inputting their username and password information, then submitting through the login button. If the user knows that they have not registered with Fur-Ever Friend Finder, they have the option to go directly to the Registration page as well.  

### Test Environment:  
Development  

### Expected Results:  
Status: 200,  
Welcome message,  
Redirect to explore page  

### Acceptance Testers:  
Fur-Ever Friend Finder group members  

## 2. 
Retrieving/Updating the pets on the explore page both in just Boulder/near campus and all across the United States (Petfinder): This feature allows users to choose the area that they would like to search for pets in and explore the pets within that area. Our website has two options for the areas. Either in Boulder/On campus or across a wider area that is not campus-focused. If the user chooses to explore pets in the Boulder area/ On campus, they will only be shown pets that within the Boulder area. If they want to be shown pets from any place, then they will be able to see all pets on our website and explore a larger number of pets. We will allow users to choose which area they want to explore through our dropdown filter.  
### Data:  
Data: Filter choice (Boulder or Anywhere)

### User Activity:  
Choosing their filter choice for the area they are exploring will either limit or widen their scope of animals displayed. After clicking on an option in the filter dropdown, the page should repopulate with the pets that are appropriate for either option.   

### Test Environment:  
Development  

### Expected Results:  
Status: 200,  
Title of page is updated from Boulder to Anywhere or vice versa,  
Page reloads with the correct pets for either option 

### Acceptance Testers:  
Fur-Ever Friend Finder group members  

## 3.  
Creating/Deleting posts made by a user (My Posts page): This feature allows users to see their past posts of pets they are putting up for adoption and manage them. If they have already found somebody to adopt their pet, they can delete the post through the My Posts page and remove it from the explore page. If they would like to put a pet up for adoption, they can create a new post by clicking on the Create a Post button. Once the user has input all the data for the new post, this additional post will show up on the page.
### Data:  
Data: Previous posts made by the user

### User Activity:  
If the user decides to delete a post, clicking on the Delete button next to the post will remove the post from their My Posts page as well as the explore page.  
If the user decides to add a new post, clicking on the Create a Post button will redirect them to a new page with fields about the pet for them to populate with information. 

### Test Environment:  
Development  

### Expected Results:  
Status: 200,  
If a post is deleted: After clicking the delete button, the page should reload without the post that was just deleted and display a "Post Successfully Deleted" message to the user.  

If a post is created: After being redirected to the My Posts page after creating the new Post, the page should display the posts made by the user along with the recently created one with a message to the user of "Post Created Successfully".  

### Acceptance Testers:  
Fur-Ever Friend Finder group members  
