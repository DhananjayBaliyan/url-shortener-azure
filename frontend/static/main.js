document.addEventListener('DOMContentLoaded', () => {
    // --- CORRECTED Redirect Logic ---
    const handleRedirect = async () => {
        const path = window.location.pathname;
        if (path && path !== '/' && !path.startsWith('/api')) {
            const shortCode = path.substring(1);
            try {
                const response = await fetch(`/api/${shortCode}`);
                const data = await response.json();

                if (data.long_url) {
                    // If we get a long URL, redirect the browser
                    window.location.href = data.long_url;
                } else {
                    console.error('Short code not found:', shortCode);
                }
            } catch (error) {
                console.error('Error during redirect:', error);
            }
        }
    };

    handleRedirect();


    // --- GSAP Animations and Form Logic (remains the same) ---
    const tl = gsap.timeline();
    gsap.set("#main-card", { opacity: 0, y: 50, scale: 0.95 });
    gsap.set(["#title", "#subtitle", "#url-form"], { opacity: 0, y: 20 });
    gsap.set("#result-card", { opacity: 0, height: 0, marginTop: 0, padding: 0 });
    tl.to("#main-card", { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" })
      .to(["#title", "#subtitle", "#url-form"], { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" }, "-=0.5");

    const form = document.getElementById('url-form');
    const resultCard = document.getElementById('result-card');
    const longUrlInput = document.getElementById('long-url-input');
    const shortUrlLink = document.getElementById('short-url-link');
    const copyBtn = document.getElementById('copy-btn');
    const copyFeedback = document.getElementById('copy-feedback');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const longUrl = longUrlInput.value;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Shortening...';
        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ long_url: longUrl }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Network response was not ok');
            }
            const data = await response.json();
            const shortCode = data.short_code;
            const shortenedUrl = `${window.location.protocol}//${window.location.host}/${shortCode}`;
            displayResult(shortenedUrl);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert(`Could not shorten the URL. Please try again. Error: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Shorten!';
        }
    });

    function displayResult(url) {
        shortUrlLink.href = url;
        shortUrlLink.textContent = url;
        resultCard.classList.remove('hidden');
        gsap.to("#result-card", { 
            opacity: 1, 
            height: 'auto', 
            marginTop: '2rem',
            padding: '1rem',
            duration: 0.5, 
            ease: "power3.out" 
        });
    }

    copyBtn.addEventListener('click', () => {
        const urlToCopy = shortUrlLink.href;
        const textArea = document.createElement("textarea");
        textArea.value = urlToCopy;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            copyFeedback.textContent = 'Copied!';
        } catch (err) {
            copyFeedback.textContent = 'Failed to copy';
        }
        document.body.removeChild(textArea);
        setTimeout(() => {
            copyFeedback.textContent = '';
        }, 2000);
    });
});
