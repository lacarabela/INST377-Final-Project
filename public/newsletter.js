const supabaseURL = "https://epyxrggyyuntjuaslbqr.supabase.co";
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweXhyZ2d5eXVudGp1YXNsYnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MDgzNjYsImV4cCI6MjA0ODQ4NDM2Nn0.FEjCK8niumZaWUg9mT2QUqFTJrBdgo8SqVOAHMJ5uOY';

let currentSlide = 0;
let stories = [];
let autoAdvanceTimer;

async function fetchSuccessStories() {
    try {
        const response = await fetch(`${supabaseURL}/rest/v1/success_stories?select=*`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        let allStories = await response.json();
        
        // Shuffle and limit to 5 valid stories
        stories = allStories
            .sort(() => Math.random() - 0.5)  // Shuffle
            .filter(story =>                   // Filter valid stories
                story && 
                story.name && 
                story.pictureID && 
                story.descriptionText
            )
            .slice(0, 5);                     // Take only first 5
        
        console.log('Selected 5 random stories:', stories.length);

        if (stories.length > 0) {
            displaySuccessStories(stories);
            setupSlider();
        }
    } catch (error) {
        console.error('Error fetching success stories:', error);
        document.getElementById('story-container').innerHTML = 
            '<p style="text-align: center; color: red;">Error loading success stories. Please try again later.</p>';
    }
}

function displaySuccessStories(stories) {
    const container = document.getElementById('story-container');
    container.innerHTML = ''; 
    
    if (!stories || stories.length === 0) {
        container.innerHTML = '<p style="text-align: center;">No success stories available at the moment.</p>';
        return;
    }

    stories.forEach((story, index) => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        
        const {
            name,
            breedPrimary,
            ageGroup,
            descriptionText,
            pictureID
        } = story;

        storyCard.innerHTML = `
            <img src="newsletter_pictures/${pictureID}.jpg" alt="${name}" class="story-img">
            <h3 class="story-title">${name}'s Story</h3>
            <div class="story-details">
                <p>${breedPrimary}</p>
                <p>${ageGroup}</p>
                ${descriptionText ? `<p class="story-description">${descriptionText}</p>` : ''}
            </div>
        `;
        
        container.appendChild(storyCard);
    });

    currentSlide = 0;
    updateSlidePosition();
}

function updateSlidePosition() {
    const container = document.getElementById('story-container');
    const offset = -currentSlide * 100;
    container.style.transform = `translateX(${offset}%)`;
}

function setupSlider() {
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    function resetAutoAdvanceTimer() {
        if (autoAdvanceTimer) {
            clearInterval(autoAdvanceTimer);
        }
        autoAdvanceTimer = setInterval(() => {
            currentSlide = (currentSlide + 1) % stories.length;
            updateSlidePosition();
        }, 15000);
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + stories.length) % stories.length;
        updateSlidePosition();
        resetAutoAdvanceTimer();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % stories.length;
        updateSlidePosition();
        resetAutoAdvanceTimer();
    });

    currentSlide = 0;
    updateSlidePosition();
    resetAutoAdvanceTimer();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchSuccessStories();
}); 