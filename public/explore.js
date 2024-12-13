// API Key configuration
const API_KEY = '6fl4zm3w';

//creates the body for filters
function buildFilters(form) {
    const selectedFilters = new FormData(form);

    const filters = [];
    let filterCount = 1;

    const petType = selectedFilters.getAll('petType');
    if(petType) {
        filters.push({
            fieldName: 'species.id', 
            operation: 'equal', 
            criteria: petType
        })
    }
    const selectedAges = selectedFilters.getAll('petAge');
    if (selectedAges.length > 0){
        filters.push({
            fieldName: 'animals.ageGroup', 
            operation: 'equal', 
            criteria: selectedAges
        })
    }

    const selectedColors = selectedFilters.getAll('petColor');
    if (selectedColors.length > 0){
        filters.push({
            fieldName: 'colors.id', 
            operation: 'equal', 
            criteria: selectedColors
        })
    }
    
    return {
        data: {
            filters
        }
    };
}
    

async function fetchPets(structuredFilters=null) {
    try {
        const headerOptions = {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/vnd.api+json'
            },
        };
        
        // need to establish different fetch URLs and body values for filters to avoid errors
        if(structuredFilters) {
            url = 'https://api.rescuegroups.org/v5/public/animals/search'
            headerOptions.body=JSON.stringify(structuredFilters);
            headerOptions.method="POST";
        } else {
            url = 'https://api.rescuegroups.org/v5/public/animals?sort=animals.updatedDate&limit=20&include=pictures&fields[animals]=id,name,species,breedPrimary,ageGroup,sex,descriptionText'
            headerOptions.method="GET";
        }
        
        // added &include=pictures to the API request bc thats where the images are
        const response = await fetch(url, headerOptions);
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
const filtersForm = document.getElementById('petFilters')
filtersForm.addEventListener('submit', async(event) => {
    event.preventDefault();
    const formSubmission = event.target;
    const structuredFilters = buildFilters(formSubmission);
    fetchPets(structuredFilters);
});

document.addEventListener('DOMContentLoaded', () => {
    const structuredFilters = buildFilters(filtersForm);
    fetchPets(structuredFilters);
});
