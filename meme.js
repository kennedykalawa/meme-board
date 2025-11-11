document.addEventListener('DOMContentLoaded', () => {
    
    const memeForm = document.querySelector('form');
    const imageLinkInput = document.getElementById('image-link');
    
    
    const topTextInput = document.getElementById('First Top text'); 
    const bottomTextInput = document.getElementById('Below text');
    
   
    let memeOutput = document.getElementById('meme-output');
    
    
    if (!memeOutput) {
        memeOutput = document.createElement('section');
        memeOutput.id = 'meme-output';
        document.body.appendChild(memeOutput);
    }


    
    memeForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const imageUrl = imageLinkInput.value.trim();
        const topText = topTextInput.value.trim();
        const bottomText = bottomTextInput.value.trim();

        if (!imageUrl) {
            alert('Please enter an image link.');
            return;
        }

        
        const newMeme = createLayeredMeme(imageUrl, topText, bottomText);
        
        
        memeOutput.appendChild(newMeme);

        
        memeForm.reset();
    });

  
    function createLayeredMeme(url, top, bottom) {
        // Main container: Must have 'position: relative' in CSS
        const container = document.createElement('div');
        container.classList.add('meme-container');

        
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Generated meme';
        
      
        const topDiv = document.createElement('div');
        topDiv.classList.add('meme-text', 'top-text'); 
        topDiv.textContent = top;

        
        const bottomDiv = document.createElement('div');
        bottomDiv.classList.add('meme-text', 'bottom-text'); 
        bottomDiv.textContent = bottom;

       
        container.appendChild(img);
        container.appendChild(topDiv);
        container.appendChild(bottomDiv);

        
        container.addEventListener('click', function() {
             container.remove();
        });

        return container;
    }
});