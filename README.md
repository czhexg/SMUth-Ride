# SMUthRide
Original github repository - https://github.com/bernicesmu/SMUthRide/ </br>
AY22/23 Sem 1 WAD2 Project
- Group members: Adrianus, Bernice, Keith, Ken Ming, Regine, Zhe Xiang
- It is recommended to use a Macbook / macOS and Chrome browser to view our platform

Visiting the website (https://bernicesmu.github.io/SMUthRide/)
- User is brought to the home page of the webpage on first load. This is also the landing page. 
- User is not logged in yet. Click on the login tab in the navbar to navigate to the Registration / Login page
- Alternatively, you can hover over the button "Start your Journey" to access the Registration / Login page

Login and Registration
- Register for an account with any username and password, as long as the username is unique. Should there be an error in the input of the registration fields, appropriate error messages will be shown. 
- Email needs to include "smu.edu.sg" as all users on SMUth Ride should have registered SMU email accounts.
- Should you want to use an existing user in the database, please use the following credentials: 
    - Username: bernice 
    - Password: 12345678
    - Username : suzy
    - Password : 12345678
- The login page has validation for username and password and will warn the user if incorrect inputs were supplied

Home Page
- Landing page for the app 
- From the home page, you can access SMUth Ride's functions from the navbar, namely "Rides", "Offers", "Chat" and "Profile"
- When logged in clicking "Start your Journey" will lead you to the Rides Listing page

Rides Listing
- Clicking into the "Rides" tab, will bring the users to a listing of all the rides available 
- User should decide if he is looking for a ride offered by other users, or if he wants to offer a ride himself  
- Looking for a ride offered by others 
    - Use the search bar to search for rides within a specific neighbourhood 
    - User can also filter the ride listings by date so that they are able to get the rides that they want at a specific day 
    - Search bar filtering and date filtering work together. i.e. users can first search locations they want to go to before further filtering down this search result by date of ride
    - Hover over any of the card's neighbourhood and a pop-up detailing the full address will appear 
    - Click into any of the rides to know more details about it
    - User is brought to the ride details page, where user can see the following items of the ride: 
        - Google Maps visualisation of the location 
        - Driver's details (clicking into this will redirect user to the driver profile) 
        - Address
        - Price
        - Capacity available
        - Date / time 
    - If user is interested in the ride, user should click into the "Chat for more" button, where he will be redirected to the chat page, and an automatic message detailing the rides details will be sent to the driver
    - If ride has already expired, or has reached its maximum capacity, the chat for more button will be disabled 
    - If user is seeing his own ride
        - The "Chat for more" button will change to a "My offers" button, which will redirect users to the Offers page when clicked 
        - If there are confirmed riders for that particular ride, the riders' name, username, gender will be displayed. A corresponding trash can icon also allows the user (i.e. the driver) to remove any riders from the ride. 
- Offer a ride himself 
    - Click into the plus sign near the bottom right corner of the page 
    - User is brought to the create ride page, where user is required to key in the necessary information to offer a ride 
    - Specific instructions on each of the field is documented in chronological order as below: 
        - User can click on the "Switch directions!" button to decide if he want to pick up or drop off from SMU 
        - After keying in the SMU location and the pick up / drop off location, user should click on "Find route!" which will trigger the Google Map to visualise the path taken by car 
        - After Google Maps have calculated and visualised the route, an "i" icon will appear, which when hovered / click will display more information about the ride to the user 
        - User would key in the cost that he is roughly expecting, though this can be further negotiated in the chat 
        - User can also key in the maximum seat capacity based on his car size and comfort level  
        - User can set a date / time based on his trip schedule, though he is unable to set a date / time that is already in the past 
    - For any invalid input, error messages will appear in the respective fields 

Offers page 
- The rides which are related to the user will be shown in this page 
- The rides are preliminarily filtered based on upcoming or past rides, in the respective "Upcoming" and "Past" tabs 
- The rides are then filtered based on whether the user is a driver or a rider
- Rides where user is a driver 
    - The rides are shown in a table
    - When user hover over the user-input location (i.e. the location that is not SMU), they are able to see the full address of the location 
    - When user hover over the "Filled seats" column, user is able to see the usernames of those who are riding on that ride 
    - Upon clicking the row, the user is redirected to the rides details page where he can view the specific details of his ride 
- Rides where user is a rider 
    - The rides are shown in individual cards, similarly to how it is shown in the rides listing page
    - The card operates similarly to the cards in the rides listing page as well 
    - Additionally each card shows a pill classifying each ride as either to SMU or from SMU
- Riders and drivers can also see past/expired transactions by clicking on the "Past" tabs 

Chat
- User can come into the chat from the "Chat" tab in the navbar, or from the "Chat for more" button in the ride details page 
- User can chat with anyone who he has interacted with previously
- For users that you have not interacted previously, you need to click on their ride listings before a new chat will be initalised between you and the other user
- User can also click into the user particulars at the top of the chat to be redirected to the user's profile page 
- For any chat, user can make offer with the other party via the "Make offer" button on the top right corner of the chat view 

Make offer 
- When user choose to make offer, he would first have to select the driver. This is because both parties may be SMUth Drivers, and both parties are allowed to make offer for any valid rides. 
- Subsequently, rides that were created by the selected driver will be populated as options in the Rides dropdown field. User should choose the ride which he is interested in making an offer for. 
- Not all rides will be shown in the drop down list. For rides that are full, expired or already in your offers, these rides will not be populated.
- User can then select a price which he would want to pay / receive for that particular ride. The price which the driver has originally set is the default value of the price. 
- User is unable to confirm the offer until user fills in all the fields with valid input 

Profile
- The profile page will allow the user to showcase any quirky character traits which they may have! 
- After clicking the "Edit profile" button, users are able to edit their profile to show their personality via the following fields:
    - Profile picture  
    - Full name 
    - Degree 
    - Year 
    - Age 
    - Gender 
    - MBTI 
    - About me (bio)
    - CCAs 
    - Social media accounts (LinkedIn, Facebook, Instagram)
- User is also able to logout after clicking the "Logout" button
- Users are able to search other user's profile page if they get the GET parameters accordingly 

End of user journey: 
- Users can log out from 2 places, the first of which is the log out button on the navbar. The second of which is in the profile page itself.
