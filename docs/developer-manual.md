# Developer Manual 

## Prerequsites 
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

This will install the follwing required dependencies 

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

Page Navigation :

Newsletter Sign Up:

Locate Nearby Shelters on Adopt Now page:

View Individual Pet Details:

Filter Pets by:
Pet Type
Location / Proximity
Age
Color

Adopt Now Map:


Adoption Application Interest Form:


Click Through Success Stories Carousel:


## API for Application


## Roadmap for Future Development

1. User Profiles

Implement user profile functionality so that adopters can save their favorite animals, create preferences, or keep track of their application process. Users can have a login so that their personal information and preferences are always there. 

2. Expansion of the Filtering Options

Expand the range of available filters such as specific breeds, adoption fee, energy levels, weight, etc. Also, the current "color" filter is not very expansive and does not include all pets of that selected color. 

3. Incorporate Additional Leaflet Map

The current leaflet map on the adopt now page allows users to enter their zip code and set a distance. Based on the zipcode entered, it may provide locations that are outside of the distance range due to shelter settings. There should be an additional option for users to only see shelters within their distance range that they can easily travel to. 


