document.addEventListener('DOMContentLoaded', () => {
    
    const memeForm = document.getElementById('meme-form');
    const imageLinkInput = document.getElementById('image-link');
    const topTextInput = document.getElementById('top-text'); 
    const bottomTextInput = document.getElementById('bottom-text');
    
    // Template selection logic
    const templates = document.querySelectorAll('.template-thumb');
    templates.forEach(template => {
        template.addEventListener('click', () => {
            imageLinkInput.value = template.dataset.url;
            imageLinkInput.focus();
            
            // Visual feedback
            templates.forEach(t => t.style.borderColor = 'transparent');
            template.style.borderColor = 'aqua';
        });
    });

    // Ensure the output section exists
    let memeOutput = document.getElementById('meme-output');
    
    // Load saved memes on start
    loadSavedMemes();

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
        
        // Save to Local Storage
        saveMeme(imageUrl, topText, bottomText);
        
        // Clear the form for the next meme
        memeForm.reset();
        templates.forEach(t => t.style.borderColor = 'transparent');
        
        // Scroll to the new meme smoothly
        setTimeout(() => {
            newMeme.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    });

    function saveMeme(url, top, bottom) {
        const savedMemes = JSON.parse(localStorage.getItem('memes')) || [];
        savedMemes.push({ url, top, bottom });
        localStorage.setItem('memes', JSON.stringify(savedMemes));
    }

    function loadSavedMemes() {
        const savedMemes = JSON.parse(localStorage.getItem('memes')) || [];
        savedMemes.forEach(meme => {
            const newMeme = createLayeredMeme(meme.url, meme.top, meme.bottom);
            memeOutput.appendChild(newMeme);
        });
    }

    function removeMemeFromStorage(url, top, bottom) {
        let savedMemes = JSON.parse(localStorage.getItem('memes')) || [];
        savedMemes = savedMemes.filter(meme => 
            !(meme.url === url && meme.top === top && meme.bottom === bottom)
        );
        localStorage.setItem('memes', JSON.stringify(savedMemes));
    }

    function downloadMeme(url, top, bottom) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // CORS must be enabled for images to be drawn on canvas and downloaded
        img.crossOrigin = "anonymous"; 
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image
            ctx.drawImage(img, 0, 0);
            
            // Configure text style
            const fontSize = Math.floor(canvas.width / 10);
            ctx.font = `${fontSize}px Anton`;
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = fontSize / 15;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            
            // Draw top text
            if (top) {
                ctx.fillText(top.toUpperCase(), canvas.width / 2, 20);
                ctx.strokeText(top.toUpperCase(), canvas.width / 2, 20);
            }
            
            // Draw bottom text
            if (bottom) {
                ctx.textBaseline = "bottom";
                ctx.fillText(bottom.toUpperCase(), canvas.width / 2, canvas.height - 20);
                ctx.strokeText(bottom.toUpperCase(), canvas.width / 2, canvas.height - 20);
            }
            
            // Trigger download
            const link = document.createElement('a');
            link.download = 'my-meme.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        
        img.onerror = function() {
            alert("Sorry! This image cannot be downloaded due to security restrictions (CORS). Try a different image URL.");
        };
        
        img.src = url;
    }
    
    function createLayeredMeme(url, top, bottom) {
        // Main container setup
        const container = document.createElement('div');
        container.classList.add('meme-container');
        
        // Add fade-in animation
        container.style.opacity = '0';
        container.style.transform = 'scale(0.9)';
        
        const img = document.createElement('img');
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

        img.src = url;
      
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
        
        // Add download button
        const downloadBtn = document.createElement('button');
        downloadBtn.classList.add('download-btn');
        downloadBtn.textContent = 'Save 💾';
        downloadBtn.title = 'Download this meme';
        container.appendChild(downloadBtn);

        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't delete the meme!
            downloadMeme(url, top, bottom);
        });

        // Remove meme on click with animation
        container.addEventListener('click', function() {
            container.style.transform = 'scale(0.8)';
            container.style.opacity = '0';
            
            // Remove from storage
            removeMemeFromStorage(url, top, bottom);
            
            setTimeout(() => {
                container.remove();
            }, 300);
        });
        
        return container;
    }
});