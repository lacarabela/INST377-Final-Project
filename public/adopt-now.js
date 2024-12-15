// API Key configuration
const API_KEY = '6fl4zm3w';

// Supabase URL and Key
const supabaseURL = "https://epyxrggyyuntjuaslbqr.supabase.co";
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweXhyZ2d5eXVudGp1YXNsYnFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjkwODM2NiwiZXhwIjoyMDQ4NDg0MzY2fQ.2hufE9x9Cy8pi4Ll_C7JHsGxxbuxbPO4xwwfB2ni_hg';

// Map global declaration
let map;

// Function to generate random person_id
function generatePersonId() {
    return Math.floor(Math.random() * 1000000) + 1; // Generates number between 1 and 1000000
}

async function createAdopter(event) {
    event.preventDefault(); // Prevent form from submitting normally
    
    try {
        // Get all form values and add person_id
        const formData = {
            person_id: generatePersonId(), // Add random person_id
            pet_id: document.getElementById('pet_id').value,
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            email: document.getElementById('email').value,
            cell: document.getElementById('cell').value,
        };

        console.log('Attempting to submit form data:', formData); // Debug log

        // Send to Supabase
        const response = await fetch(`${supabaseURL}/rest/v1/adoption-inquiry`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(formData)
        });

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText); // Debug log
            throw new Error(`Failed to submit: ${errorText}`);
        }

        // Success! Clear form and show success message
        document.getElementById('adoptionForm').reset();
        alert('Thank you for your adoption inquiry! We will contact you soon.');

    } catch (error) {
        console.error('Detailed error:', error); // Debug log
        alert('There was an error submitting your inquiry. Please check the console for details.');
    }
}

// Add event listener to form when document loads
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adoptionForm');
    if (form) {
        form.addEventListener('submit', createAdopter);
        console.log('Form listener added'); // Debug log
    } else {
        console.error('Form not found!'); // Debug log
    }
});

async function fetchOrgs(e) {
    if(e) {
        e.preventDefault();
    }

    const searchZipCode = document.getElementById('searchZip').value
    const radius = document.getElementById('miles').value

    try {
        const response = await fetch(`https://api.rescuegroups.org/v5/public/orgs/?filterRadius[postalcode]=${searchZipCode}&filterRadius[miles]=${radius}`, {
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Authorization': API_KEY
            }
        });
        const data = await response.json();
        const organizations = data.data;
        organizations.forEach(org => {
            const lat = org.attributes.lat;
            const lon = org.attributes.lon;

            const orgName = org.attributes.name;
            let details = `<b style='font-size:15pt;'> ${orgName} </b>`;

            const orgStreet = org.attributes.street;
            const orgCityState = org.attributes.citystate;
            
            if(orgStreet&&orgCityState){
                const orgLocation = `<br><strong>Location:</strong> ${orgStreet}, ${orgCityState}`;
                details += orgLocation;
            }else if(orgCityState){
                const orgLocation = `<br><strong>Location:</strong> ${orgCityState}`
                details += orgLocation;
            }
            
            if(org.attributes.type){
                const orgType = org.attributes.type;
                details += `<br><strong>Type:</strong> ${orgType}`;
            }
            if(org.attributes.email){
                const orgEmail = org.attributes.email;
                details += `<br><strong>Email:</strong> ${orgEmail}`;
            }
            if(org.attributes.serveAreas){
                const orgServeAreas = org.attributes.serveAreas
                details += `<br><strong>Serve Areas:</strong> ${orgServeAreas}`
            }
             
            L.marker([lat, lon]).addTo(map).bindPopup(details);
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
    }
}

function createMap() {
    map = L.map('map').setView([37.5, -95], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 50,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

window.onload = createMap;