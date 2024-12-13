// API Key configuration
const API_KEY = '6fl4zm3w';

// Map global declaration
let map;

async function createAdopter() {
    console.log('Creating Adopter');
    await fetch(`${host}/adopter`, {
      method: 'POST',
      body: JSON.stringify({
        person_id: `${document.getElementById('person_id').value}`,
        first_name: `${document.getElementById('firstName').value}`,
        last_name: `${document.getElementById('lastName').value}`,
        address: `${document.getElementById('address').value}`,
        city: `${document.getElementById('city').value}`,
        state: `${document.getElementById('state').value}`,
        zip: `${document.getElementById('zip').value}`,
        email: `${document.getElementById('email').value}`,
        cell: `${document.getElementById('cell').value}`,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
}

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

window.onload = createMap();