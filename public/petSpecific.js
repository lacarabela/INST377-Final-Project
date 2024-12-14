// API Key configuration
const API_KEY = '6fl4zm3w';

function determinePet() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    return id;
}

document.addEventListener('DOMContentLoaded', async() => {
    //get the specific pet ID
    const petId = determinePet();
    try{
        const response = await fetch(`https://api.rescuegroups.org/v5/public/animals/${petId}?include,pictures,species`, {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/vnd.api+json'
            }
        });
        const petData = await response.json();
        displayPet(petData.data, petData.included);
    } catch (error) {
        console.error('Error fetching pets:', error);
        document.getElementById('pet-container').innerHTML = 
            '<p style="text-align: center; color: red;">Error loading this pet. Please try again later.</p>';
    }
});

function displayPet(petData, included) {
    const pet = petData[0];
    const id = pet.id;
    const name = pet.attributes.name;
    const breedPrimary = pet.attributes.breedPrimary;
    const ageGroup = pet.attributes.ageGroup;
    const sex = pet.attributes.sex;
    const descriptionText = pet.attributes.descriptionText;
  
    let species = 'Furry Friend';
    const speciesId = pet.relationships?.species?.data?.[0]?.id;
    if(speciesId==="3"){
        species = "Cat";
    }else if(speciesId==="8"){
        species = "Dog";
    }

    const pictureId = pet.relationships?.pictures?.data?.[0]?.id;
    const imageObject = included.find(item => item.type === "pictures" && item.id === pictureId);
    const imgUrl = imageObject?.attributes?.large?.url || 'noimage.png';  

    const container = document.getElementById('pet-container');
    container.innerHTML = `
            <div class="pet-info">
                <img src="${imgUrl}" alt = "${name}" class = "pet-img">
                <h1 class="pet-name">${name} • Pet ID: ${id}</h1>
                <p>${species} • ${sex}</p>
                <p>${breedPrimary}</p>
                <p>${ageGroup}</p>
                ${descriptionText ? `<p class="pet-description">${descriptionText}</p>` : ''}
            </div>
        `;
};
   
//window.onload=determinePet();