# Developer Manual 

## Prerequisites 
Make sure these are installed on your system

- node.js
- npm 


## Installation 
1. Request an API Key

You will need to create an account and request an API key.

Rescue Groups API: https://rescuegroups.org/services/request-an-api-key/

2. Clone the Repository 

```git clone https://github.com/<your_github_username>/<repo_name>.git```

3. Install NPM Packages 

Running the following command will install all dependencies

```npm install```

This will install the following required dependencies 

    "@geoapify/geocoder-autocomplete": "^2.1.0",
    "@supabase/supabase-js": "^2.46.2",
    "express": "^4.21.1",
    "nodemon": "^3.1.7",
    "punycode": "^2.3.1"


## How to Run the Application on a Server

1. Open the project in your preferred code editor

2. Create a variable for your API key

```API Key: your_api_key_here```

3. Start the server using node.js (replace server with the main file name)

```node server.js```

4. Open a browser and navigate to http://localhost:5500

*Replace 5500 with the port your application uses 

## Running Tests 

A user can utilize functions such as:

Page Navigation : Navigate to any available website page from the header present at the top of each page under the page name. 

Newsletter Sign Up: Fill out a form to sign up for the newsletter from the Home Page or Newsletter Page.

Map Nearby Shelters on Adopt Now page: Fill out your zip code and view pinpoints on a Leaflet map of shelters or adoption centers located within your selected radius. Click on pinpoints to view shelter name and details. 

View Individual Pet Details: Click on a pet while browsing or from the home page to view more information and adoption details. 

Filter Pets on Explore page: Make selections for Pet Type, Location / Proximity, Age, and Color to view pets fitting those specifications. 

Adoption Application Interest Form: Fill out adoption interest form on Adopt Now page. 

Click Through Success Stories Carousel: Click through different success stories in the carousel on the Newsletter page. 


## API for Application

### External APIs Used
1. Rescue Groups API
   - Base URL: https://api.rescuegroups.org/v5/public/
   - Endpoints used:
     - GET /animals - Fetches available pets with filters
     - GET /orgs - Fetches organization/shelter information

2. Supabase Database API
   - Base URL: [YOUR_SUPABASE_URL]
   - Database Tables:
     
     a) adoption-inquiry
     - Stores submitted adoption application information
     - Required Fields:
       * person_id (int): Randomly generated unique identifier
       * pet_id (text): ID of the pet being inquired about
       * first_name (text): Applicant's first name
       * last_name (text): Applicant's last name
       * address (text): Street address
       * city (text): City name
       * state (text): State abbreviation
       * zip (text): ZIP code
       * email (text): Contact email
       * cell (text): Contact phone number

     b) join-newsletter
     - Stores newsletter subscriber information
     - Required Fields:
       * person_id (int): Randomly generated unique identifier
       * first_name (text): Subscriber's first name
       * last_name (text): Subscriber's last name
       * email (text): Subscriber's email address

   - Endpoints:
     - POST /adoption-inquiry
       - Purpose: Submit adoption application
       - Updates: Adds new row to adoption-inquiry table
       - Returns: Success/error message

     - POST /join-newsletter
       - Purpose: Newsletter sign-up
       - Updates: Adds new row to join-newsletter table
       - Returns: Success/error message

### API Test Calls
Here are example test functions you can use to verify the API endpoints:

1. Test Fetching Available Pets:
```javascript
async function testFetchPets() {
    try {
        const response = await fetch('https://api.rescuegroups.org/v5/public/animals?sort=-animals.createdDate&limit=5', {
            headers: {
                'Authorization': '[YOUR_API_KEY]',
                'Content-Type': 'application/vnd.api+json'
            }
        });
        const data = await response.json();
        console.log('Fetch Pets Test Response:', data);
        return data.data ? 'Test Passed' : 'Test Failed';
    } catch (error) {
        console.error('Fetch Pets Test Failed:', error);
        return 'Test Failed';
    }
}
```

2. Test Adoption Inquiry Submission:
```javascript
async function testAdoptionInquiry() {
    try {
        const testData = {
            person_id: 123456,
            pet_id: "TEST123",
            first_name: "Test",
            last_name: "User",
            address: "123 Test St",
            city: "Test City",
            state: "MD",
            zip: "20742",
            email: "test@test.com",
            cell: "1234567890"
        };

        const response = await fetch('[YOUR_SUPABASE_URL]/rest/v1/adoption-inquiry', {
            method: 'POST',
            headers: {
                'apikey': '[YOUR_SUPABASE_KEY]',
                'Authorization': 'Bearer [YOUR_SUPABASE_KEY]',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        console.log('Adoption Inquiry Test Response:', response.status);
        return response.ok ? 'Test Passed' : 'Test Failed';
    } catch (error) {
        console.error('Adoption Inquiry Test Failed:', error);
        return 'Test Failed';
    }
}
```

3. Test Newsletter Signup:
```javascript
async function testNewsletterSignup() {
    try {
        const testData = {
            person_id: 123456,
            first_name: "Test",
            last_name: "Subscriber",
            email: "test@newsletter.com"
        };

        const response = await fetch('[YOUR_SUPABASE_URL]/rest/v1/join-newsletter', {
            method: 'POST',
            headers: {
                'apikey': '[YOUR_SUPABASE_KEY]',
                'Authorization': 'Bearer [YOUR_SUPABASE_KEY]',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        console.log('Newsletter Signup Test Response:', response.status);
        return response.ok ? 'Test Passed' : 'Test Failed';
    } catch (error) {
        console.error('Newsletter Signup Test Failed:', error);
        return 'Test Failed';
    }
}
```

To run all tests in the browser console:
```javascript
async function runAllTests() {
    console.log('Testing Fetch Pets:', await testFetchPets());
    console.log('Testing Adoption Inquiry:', await testAdoptionInquiry());
    console.log('Testing Newsletter Signup:', await testNewsletterSignup());
}

// Execute tests
runAllTests();
```

Note: Replace [YOUR_SUPABASE_URL], [YOUR_SUPABASE_KEY], and [YOUR_API_KEY] with your actual credentials when testing. These tests will log results to the console and return 'Test Passed' or 'Test Failed' based on the API response.


## Roadmap for Future Development

1. User Profiles

Implement user profile functionality so that adopters can save their favorite animals, create preferences, or keep track of their application process. Users can have a login so that their personal information and preferences are always there. 

2. Expansion of the Filtering Options

Expand the range of available filters such as specific breeds, adoption fee, energy levels, weight, etc. Also, the current "color" filter is not very expansive and does not include all pets of that selected color. 

3. Incorporate Additional Leaflet Map

The current leaflet map on the adopt now page allows users to enter their zip code and set a distance. Based on the zipcode entered, it may provide locations that are outside of the distance range due to shelter settings. There should be an additional option for users to only see shelters within their distance range that they can easily travel to. 


