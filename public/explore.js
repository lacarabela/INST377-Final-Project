// API Key configuration
const API_KEY = '6fl4zm3w';

async function fetchPets() {
    try {
        // added &include=pictures to the API request bc thats where the images are
        const response = await fetch('https://api.rescuegroups.org/v5/public/animals?sort=animals.updatedDate&limit=20&include=pictures&fields[animals]=id,name,species,breedPrimary,ageGroup,sex,descriptionText', {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/vnd.api+json'
            }
        });
        const data = await response.json();
        displayPets(data.data, data.included); // passing the pets and the included data(images)
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
            id,
            name,
            species,
            breedPrimary,
            ageGroup,
            sex,
            descriptionText
        } = pet.attributes;
        
        //getting the picture id
        const pictureId = pet.relationships?.pictures?.data[0]?.id;

        // find the image using the id 
        const imageObject = included.find(item => item.id === pictureId);

        // get image
        const imgUrl = imageObject?.attributes?.large?.url || '';  

        // placeholder
        const imageSrc = imgUrl || 'https://via.placeholder.com/150';
        
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';

        petCard.innerHTML = `
            <img src="${imageSrc}" alt = "${name}" class = "pet-img">
            <div class="pet-info">
                <h3 class="pet-name">${name} • Pet ID: ${id}</h3>
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
