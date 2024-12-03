// API Key configuration
const API_KEY = '6fl4zm3w';

async function fetchPets() {
    try {
        const response = await fetch('https://api.rescuegroups.org/v5/public/animals?sort=animals.updatedDate&limit=20&fields[animals]=id,name,species,breedPrimary,ageGroup,sex,descriptionText', {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/vnd.api+json'
            }
        });
        const data = await response.json();
        displayPets(data.data);
    } catch (error) {
        console.error('Error fetching pets:', error);
        document.getElementById('pet-container').innerHTML = 
            '<p style="text-align: center; color: red;">Error loading pets. Please try again later.</p>';
    }
}

function displayPets(pets) {
    const container = document.getElementById('pet-container');
    container.innerHTML = ''; 
    
    if (!pets || pets.length === 0) {
        container.innerHTML = '<p style="text-align: center;">No pets available at the moment.</p>';
        return;
    }
    
    pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        
        const {
            name,
            species,
            breedPrimary,
            ageGroup,
            sex,
            descriptionText
        } = pet.attributes;
        
        petCard.innerHTML = `
            <div class="pet-info">
                <h3 class="pet-name">${name}</h3>
                <div class="pet-details">
                    <p>${species} • ${sex}</p>
                    <p>${breedPrimary}</p>
                    <p>${ageGroup}</p>
                    ${descriptionText ? `<p class="pet-description">${descriptionText}</p>` : ''}
                </div>
            </div>
        `;
        
        container.appendChild(petCard);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchPets();
});
