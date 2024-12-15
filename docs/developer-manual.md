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


## API Usage Details

### RescueGroups API Implementation
Our application uses the RescueGroups API:

- Base URL: `https://api.rescuegroups.org/v5/public`
- Content-Type: `application/json`
- Authentication: API Key in Authorization header

1. Home Page (`public/home.js`)
   - Fetches newest arrivals using sort parameter `-animals.createdDate`
   - Limited to 5 pets for the featured section
   - Example endpoint usage:
     ```javascript
     GET /animals
     {
         headers: {
             'Authorization': API_KEY,
             'Content-Type': 'application/json'
         },
         url: 'animals?sort=-animals.createdDate&limit=5&include=pictures,species'
     }
     ```

2. Adopt Now Page (`public/adopt-now.js`)
   - Implementation details for shelter search:
     ```javascript
     GET /orgs
     {
         headers: {
             'Authorization': API_KEY,
             'Content-Type': 'application/json'
         },
         url: `orgs/?filterRadius[postalcode]=${searchZipCode}&filterRadius[miles]=${radius}`
     }
     ```

3. Explore Page (`public/explore.js`)
   - Uses POST for complex filtering:
     ```javascript
     POST /animals/search
     {
         headers: {
             'Authorization': API_KEY,
             'Content-Type': 'application/json'
         },
         body: {
             data: {
                 filters: [
                     {
                         fieldName: 'species.id',
                         operation: 'equal',
                         criteria: [8, 3]  // dogs and cats
                     },
                     {
                         fieldName: 'statuses.id',
                         operation: 'equal',
                         criteria: [1, 2]  // available status
                     }
                 ],
                 filterRadius: {
                     miles: 500,
                     postalcode: "20743"
                 }   
             }
         }
     }
     ```

4. Pet Specific Page (`public/petSpecific.js`)
   - Fetches individual pet details:
     ```javascript
     GET /animals/${petId}
     {
         headers: {
             'Authorization': API_KEY,
             'Content-Type': 'application/json'
         },
         url: `animals/${petId}?include=pictures,species`
     }
     ```

### Supabase Database Implementation

1. Newsletter Functionality (`public/home.js` and `public/newsletter.js`)
   - Handles newsletter sign-ups from multiple pages:
     * Home Page: Basic newsletter signup form
     * Newsletter Page: Extended signup form with success stories carousel
   - Implementation details:
     * Uses shared Supabase connection configuration
     * Generates unique person_id for each subscriber
     * Validates form inputs before submission
     * Stores subscriber data in `join-newsletter` table
     * Provides user feedback through alerts
   - Example endpoint usage:
     ```javascript
     POST /rest/v1/join-newsletter
     {
         person_id: (generated),
         first_name: "User input",
         last_name: "User input",
         email: "user@example.com"
     }
     ```

2. Adoption Applications (`public/adopt-now.js`)
   - Processes adoption inquiry forms
   - Implementation details:
     * Validates all required fields
     * Generates unique application IDs
     * Links pet data with applicant information
     * Stores in `adoption-inquiry` table
   - Example endpoint usage:
     ```javascript
     POST /rest/v1/adoption-inquiry
     {
         person_id: (generated),
         pet_id: "selected_pet_id",
         first_name: "User input",
         last_name: "User input",
         address: "User input",
         city: "User input",
         state: "User input",
         zip: "User input",
         email: "user@example.com",
         cell: "1234567890"
     }
     ```

## API Test Calls
Example test functions to verify API endpoints:

1. Test Fetching Available Pets:
```javascript
async function testFetchPets() {
    try {
        const response = await fetch('https://api.rescuegroups.org/v5/public/animals?sort=-animals.createdDate&limit=5&include=pictures,species', {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json'
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

2. Test Shelter Search:
```javascript
async function testFetchOrgs() {
    try {
        const testZip = "20742";
        const testRadius = "50";
        
        const response = await fetch(
            `https://api.rescuegroups.org/v5/public/orgs/?filterRadius[postalcode]=${testZip}&filterRadius[miles]=${testRadius}`, 
            {
                headers: {
                    'Authorization': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        const data = await response.json();
        console.log('Fetch Orgs Test Response:', data);
        return data.data ? 'Test Passed' : 'Test Failed';
    } catch (error) {
        console.error('Fetch Orgs Test Failed:', error);
        return 'Test Failed';
    }
}
```

3. Test Adoption Inquiry Submission:
```javascript
async function testAdoptionInquiry() {
    try {
        const testData = {
            person_id: Math.floor(Math.random() * 1000000),
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

        const response = await fetch(`${supabaseURL}/rest/v1/adoption-inquiry`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
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

4. Test Newsletter Signup:
```javascript
async function testNewsletterSignup() {
    try {
        const testData = {
            person_id: Math.floor(Math.random() * 1000000),
            first_name: "Test",
            last_name: "Subscriber",
            email: "test@newsletter.com"
        };

        const response = await fetch(`${supabaseURL}/rest/v1/join-newsletter`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
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
    console.log('Testing Fetch Orgs:', await testFetchOrgs());
    console.log('Testing Adoption Inquiry:', await testAdoptionInquiry());
    console.log('Testing Newsletter Signup:', await testNewsletterSignup());
}
```

Note: Replace [YOUR_SUPABASE_URL], [YOUR_SUPABASE_KEY], and [YOUR_API_KEY] with your actual credentials when testing. These tests will log results to the console and return 'Test Passed' or 'Test Failed' based on the API response.


## Roadmap for Future Development

1. User Profiles

Implement user profile functionality so that adopters can save their favorite animals, create preferences, or keep track of their application process. Users can have a login so that their personal information and preferences are always there. 

2. Expansion of the Filtering Options

Expand the range of available filters such as specific breeds, adoption fee, energy levels, weight, etc. Also, the current "color" filter is not very expansive and does not include all pets of that selected color. 

3. Incorporate Additional Leaflet Map

The current leaflet map on the adopt now page allows users to enter their zip code and set a distance. Based on the zipcode entered, it may provide locations that are outside of the distance range due to shelter settings. There should be an additional option for users to only see shelters within their distance range that they can easily travel to. 


