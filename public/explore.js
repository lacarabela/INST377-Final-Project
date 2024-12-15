// API Key configuration
let currentFilters = null;
const API_KEY = '6fl4zm3w';

let currentPage = 1;
let pageTracker = 1;
let allPets = []; //stores the data for all pets returned by the fetch 
let includedData = []; // stores all included data for images and species info

//creates the body for filters
function buildFilters(form) {
    const selectedFilters = new FormData(form);
 
 
    const filters = [];
    let filterCount = 1;
 
 
    const petType = selectedFilters.get('petType');
    if(petType) {
        if(petType==='both'){
            filters.push({
                fieldName: 'species.id',
                operation: 'equal',
                criteria: [8, 3] //the species id for both dogs and cats
            });
        } else {
            filters.push({
                fieldName: 'species.id',
                operation: 'equal',
                criteria: [parseInt(petType)]
            });
        }
        
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
    
    // Get values from inputs
    const zipCode = document.getElementById('zipcode').value || '20742'; // Default to UMD if empty
    const distance = document.getElementById('distance').value;

    // ensures to only get available animals
    filters.push({
        fieldName: 'statuses.id',
        operation: 'equal',
        criteria: [1, 2] //the species id for both dogs and cats
    })

    return {
        data: {
            filters,
            filterRadius: {
                miles: parseInt(distance),
                postalcode: zipCode
            }
            
        }
    };
 }

async function fetchPets(page=1, structuredFilters=currentFilters) {
    try {
        const headerOptions = {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/vnd.api+json'
            },
        };

        if(structuredFilters) {
            url = `https://api.rescuegroups.org/v5/public/animals/search?sort=-animals.updatedDate&limit=28&page=${page}`
            headerOptions.body=JSON.stringify(structuredFilters);
            headerOptions.method="POST";
        } else {
            url = `https://api.rescuegroups.org/v5/public/animals/search?sort=-animals.updatedDate&limit=28&page=${page}`
            headerOptions.body=JSON.stringify({
                data: {
                    filters: [
                        {
                            fieldName: 'species.id',
                            operation: 'equal',
                            criteria: [8, 3] //the species id for both dogs and cats
                        },
                        {
                            fieldName: 'statuses.id',
                            operation: 'equal',
                            criteria: [1, 2] //the species id for both dogs and cats
                        }
                    ],
                    filterRadius: {
                        miles: 500,
                        postalcode: "20743"
                    }   
                }
            })
            headerOptions.method="POST";
        }

        // added &include=pictures to the API request bc thats where the images are
        const response = await fetch(url, headerOptions);
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            document.getElementById('pet-container').innerHTML = 
                '<p style="text-align: center;">No pets available in this area.</p>';
            return;
        }

        // Store all pets and included data in our cache
        allPets = data.data;
        includedData = data.included || [];
        currentPage = page;
        totalPages = data.meta.pages;
        
        displayCurrentPage();
    } catch (error) {
        console.error('Error fetching pets:', error);
        document.getElementById('pet-container').innerHTML = 
            '<p style="text-align: center; color: red;">Error loading pets. Please try again later.</p>';
    }
}

function displayCurrentPage() {
    const petData = allPets;
    
    // Clear the container
    const container = document.getElementById('pet-container');
    container.innerHTML = '';
    
    if (petData.length === 0) {
        container.innerHTML = '<p style="text-align: center;">No more pets available.</p>';
        document.getElementById('next-page').disabled = true;
        return;
    }
    
    // Display the current page of pets
    displayPets(petData, includedData);
    
    // Update button states
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
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
            ageGroup,
            sex,
            descriptionText
        } = pet.attributes;
        
        //getting the pet id
        const id = pet.id;

        //getting the species
        let species = 'Furry Friend';
        const speciesId = pet.relationships?.species?.data?.[0]?.id;
        if(speciesId==="3"){
            species = "Cat";
        }else if(speciesId==="8"){
            species = "Dog";
        }

        //getting the picture id
        const pictureId = pet.relationships?.pictures?.data?.[0]?.id;

        // find the image using the id 
        const imageObject = included.find(item => item.type === "pictures" && item.id === pictureId);

        // get image
        const imgUrl = imageObject?.attributes?.large?.url || 'noimage.png';  
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';

        petCard.innerHTML = `
            <a href="petSpecific.html?id=${id}">
                <img src="${imgUrl}" alt = "${name}" class = "pet-img">
                <div class="pet-info">
                    <h3 class="pet-name">${name} • Pet ID: ${id}</h3>
                    <div class="pet-details">
                        <p>${species} • ${sex}</p>
                        <p>${breedPrimary}</p>
                        <p>${ageGroup}</p>
                        ${descriptionText ? `<p class="pet-description">${descriptionText}</p>` : ''}
                    </div>
                </div>
            </a>
        `;
        container.appendChild(petCard);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch of all pets
    const filtersForm = document.getElementById('petFilters')
    
    
    filtersForm.addEventListener('submit', async(event) => {
        event.preventDefault();
        const formSubmission = event.target;

        currentFilters = buildFilters(formSubmission);
        currentPage = 1;
        fetchPets(currentPage, currentFilters);
    });
    
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchPets(currentPage, currentFilters);
            document.getElementById('pet-container').scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchPets(currentPage, currentFilters
                );
            document.getElementById('pet-container').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Initial fetch of all pets (no filters)
    fetchPets();
});
