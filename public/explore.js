// API Key configuration
const API_KEY = '6fl4zm3w';

let currentPage = 1;
let allPets = []; // Cache to store all fetched pets
let includedData = []; // Cache to store all included data (images)

async function fetchAllPets() {
    try {
        // Get values from inputs
        const zipCode = document.getElementById('zipcode').value || '20742'; // Default to UMD if empty
        const distance = document.getElementById('distance').value;

        const response = await fetch('https://api.rescuegroups.org/v5/public/animals/search/available', {
            method: 'POST',
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/vnd.api+json'
            },
            body: JSON.stringify({
                data: {
                    filterRadius: {
                        miles: parseInt(distance),
                        postalcode: zipCode
                    },
                    sort: ["-id"],
                    fields: {
                        animals: ["id", "name", "species", "breedPrimary", "ageGroup", "sex", "descriptionText"]
                    },
                    include: ["pictures"]
                }
            })
        });
        
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            document.getElementById('pet-container').innerHTML = 
                '<p style="text-align: center;">No pets available in this area.</p>';
            return;
        }

        // Store all pets and included data in our cache
        allPets = data.data;
        includedData = data.included || [];
        
        // Display first page
        currentPage = 1; // Reset to first page when new data is loaded
        displayCurrentPage();
    } catch (error) {
        console.error('Error fetching pets:', error);
        document.getElementById('pet-container').innerHTML = 
            '<p style="text-align: center; color: red;">Error loading pets. Please try again later.</p>';
    }
}

function displayCurrentPage() {
    const startIndex = (currentPage - 1) * 20;
    const endIndex = startIndex + 20;
    const petsToDisplay = allPets.slice(startIndex, endIndex);
    
    // Clear the container
    const container = document.getElementById('pet-container');
    container.innerHTML = '';
    
    if (petsToDisplay.length === 0) {
        container.innerHTML = '<p style="text-align: center;">No more pets available.</p>';
        document.getElementById('next-page').disabled = true;
        return;
    }
    
    // Display the current page of pets
    displayPets(petsToDisplay, includedData);
    
    // Update button states
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = endIndex >= allPets.length;
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

document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch of all pets
    fetchAllPets();
    
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayCurrentPage();
            document.getElementById('pet-container').scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        const maxPage = Math.ceil(allPets.length / 20);
        if (currentPage < maxPage) {
            currentPage++;
            displayCurrentPage();
            document.getElementById('pet-container').scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    document.getElementById('apply-filters').addEventListener('click', () => {
        const zipCode = document.getElementById('zipcode').value;
        if (zipCode && zipCode.length === 5) {
            currentPage = 1; // Reset to first page
            fetchAllPets(); // Fetch new pets based on new location
        } else {
            alert('Please enter a valid 5-digit ZIP code');
        }
    });
});
