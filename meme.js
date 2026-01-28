document.addEventListener('DOMContentLoaded', () => {
    
    const memeForm = document.getElementById('meme-form');
    const imageLinkInput = document.getElementById('image-link');
    const topTextInput = document.getElementById('First Top text'); 
    const bottomTextInput = document.getElementById('Below text');
    
    // Ensure the output section exists
    let memeOutput = document.getElementById('meme-output');
    
    memeForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const imageUrl = imageLinkInput.value.trim();
        const topText = topTextInput.value.trim();
        const bottomText = bottomTextInput.value.trim();
        
        if (!imageUrl) {
            alert('Please enter an image link.');
            return;
        }
        
        // Create and append the new meme
        const newMeme = createLayeredMeme(imageUrl, topText, bottomText);
        memeOutput.appendChild(newMeme);
        
        // Clear the form for the next meme
        memeForm.reset();
        
        // Scroll to the new meme smoothly
        setTimeout(() => {
            newMeme.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    });
    
    function createLayeredMeme(url, top, bottom) {
        // Main container setup
        const container = document.createElement('div');
        container.classList.add('meme-container');
        
        // Add fade-in animation
        container.style.opacity = '0';
        container.style.transform = 'scale(0.9)';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Generated meme';
        
        // Error handling for broken image links
        img.onerror = function() {
            alert("Failed to load image. Please check the URL.");
            container.remove();
        };
        
        // Fade in when image loads
        img.onload = function() {
            setTimeout(() => {
                container.style.transition = 'all 0.3s ease';
                container.style.opacity = '1';
                container.style.transform = 'scale(1)';
            }, 50);
        };
      
        const topDiv = document.createElement('div');
        topDiv.classList.add('meme-text', 'top-text'); 
        topDiv.textContent = top;
        
        const bottomDiv = document.createElement('div');
        bottomDiv.classList.add('meme-text', 'bottom-text'); 
        bottomDiv.textContent = bottom;
        
        // Add elements to container
        container.appendChild(img);
        if (top) container.appendChild(topDiv);
        if (bottom) container.appendChild(bottomDiv);
        
        // Remove meme on click with animation
        container.addEventListener('click', function() {
            container.style.transform = 'scale(0.8)';
            container.style.opacity = '0';
            setTimeout(() => {
                container.remove();
            }, 300);
        });
        
        return container;
    }
});