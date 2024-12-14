const API_KEY = '6fl4zm3w';

async function fetchPets() {
    try {
        const response = await fetch('https://api.rescuegroups.org/v5/public/animals?sort=-animals.createdDate&limit=5&include=pictures,species&filter%5Bstatuses.name%5D=Available&fields%5Bpictures%5D=large,medium,small,thumbnail&fields%5Banimals%5D=id,name,species,breedPrimary,ageGroup,sex,descriptionText,createdDate', {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/vnd.api+json'
            }
        });
        const data = await response.json();
        displayPets(data.data, data.included); //passing in included into displayPets
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

        //getting the species
        let species = 'Furry Friend';
        const speciesId = pet.relationships?.species?.data?.[0]?.id;
        if(speciesId==="3"){
            species = "Cat";
        }else if(speciesId==="8"){
            species = "Dog";
        }
        
        //getting the age group
        let ageGroup = '';
        const group = pet.attributes?.ageGroup;
        if(group){
            ageGroup = group;
        }else{
            ageGroup = "";
        }
        
        //getting image ID
        const pictureId = pet.relationships?.pictures?.data[0]?.id;
        //getting matching image
        const imageObject = included.find(item => item.id === pictureId);
        //get the URL
        const imgUrl = imageObject?.attributes?.large?.url || '';  
        // default image 
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
});
