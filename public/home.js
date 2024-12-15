const API_KEY = '6fl4zm3w';

// Supabase URL and Key
const supabaseURL = "https://epyxrggyyuntjuaslbqr.supabase.co";
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweXhyZ2d5eXVudGp1YXNsYnFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjkwODM2NiwiZXhwIjoyMDQ4NDg0MzY2fQ.2hufE9x9Cy8pi4Ll_C7JHsGxxbuxbPO4xwwfB2ni_hg';

// Function to generate random person_id
function generatePersonId() {
    return Math.floor(Math.random() * 1000000) + 1; // Generates number between 1 and 1000000
}

// Newsletter signup function
async function handleNewsletterSignup(event) {
    event.preventDefault();
    
    try {
        const formData = {
            person_id: generatePersonId(),
            first_name: document.querySelector('input[placeholder="First Name"]').value,
            last_name: document.querySelector('input[placeholder="Last Name"]').value,
            email: document.querySelector('input[placeholder="Email"]').value
        };

        console.log('Attempting to submit newsletter signup:', formData);

        const response = await fetch(`${supabaseURL}/rest/v1/join-newsletter`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`Failed to submit: ${errorText}`);
        }

        // Clear form and show success message
        event.target.reset();
        alert('You will receive our next newsletter! You can find last month\'s on our Newsletter page.');

    } catch (error) {
        console.error('Error submitting newsletter signup:', error);
        alert('There was an error signing up for the newsletter. Please try again.');
    }
}

async function fetchPets() {
    try {
        const response = await fetch('https://api.rescuegroups.org/v5/public/animals?sort=-animals.createdDate&limit=5&include=pictures,species&filter%5Bstatuses.name%5D=Available&fields%5Bpictures%5D=large,medium,small,thumbnail&fields%5Banimals%5D=id,name,species,breedPrimary,ageGroup,sex,descriptionText,createdDate', {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/vnd.api+json'
            }
        });
        const data = await response.json();
        displayPets(data.data, data.included);
    } catch (error) {
        console.error('Error fetching pets:', error);
        document.getElementById('pet-container').innerHTML = 
            '<p style="text-align: center; color: red;">Error loading pets. Please try again later.</p>';
    }
}

function displayPets(pets, included) {
    const container = document.getElementById('pet-container');
    container.innerHTML = ''; 
    
    if (!pets || pets.length === 0) {
        container.innerHTML = '<p style="text-align: center;">No pets available at the moment.</p>';
        return;
    }

    pets.forEach(pet => {
        const {
            name,
            breedPrimary,
            sex,
            descriptionText,
            createdDate
        } = pet.attributes;

        let species = 'Furry Friend';
        const speciesId = pet.relationships?.species?.data?.[0]?.id;
        if(speciesId==="3"){
            species = "Cat";
        }else if(speciesId==="8"){
            species = "Dog";
        }
        
        let ageGroup = '';
        const group = pet.attributes?.ageGroup;
        if(group){
            ageGroup = group;
        }else{
            ageGroup = "";
        }
        
        const pictureId = pet.relationships?.pictures?.data[0]?.id;
        const imageObject = included.find(item => item.id === pictureId);
        const imgUrl = imageObject?.attributes?.large?.url || '';  
        const imageSrc = imgUrl || 'noimage.png';

        const petCard = document.createElement('div');
        petCard.className = 'pet-card';

        petCard.innerHTML = `
            <img src="${imageSrc}" alt="${name}" class="pet-img">
            <h3 class="pet-name">${name}</h3>
            <div class="pet-details">
                <p>${species} • ${sex}</p>
                <p>${breedPrimary}</p>
                <p>${ageGroup}</p>
                ${descriptionText ? `<p class="pet-description">${descriptionText}</p>` : ''}
            </div>
        `;
        
        container.appendChild(petCard);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchPets();
    
    // Add event listener for newsletter form
    const newsletterForm = document.querySelector('.form-section form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }
});
