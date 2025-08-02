document.addEventListener('DOMContentLoaded', () => {
    // --- GSAP Animations ---
    const tl = gsap.timeline();

    // Initial state (elements are invisible and shifted)
    gsap.set("#main-card", { opacity: 0, y: 50, scale: 0.95 });
    gsap.set(["#title", "#subtitle", "#url-form"], { opacity: 0, y: 20 });
    gsap.set("#result-card", { opacity: 0, height: 0, marginTop: 0, padding: 0 });

    // Page load animation
    tl.to("#main-card", { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" })
      .to(["#title", "#subtitle", "#url-form"], { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" }, "-=0.5");

    // --- Form Logic ---
    const form = document.getElementById('url-form');
    const resultCard = document.getElementById('result-card');
    const longUrlInput = document.getElementById('long-url-input');
    const shortUrlLink = document.getElementById('short-url-link');
    const copyBtn = document.getElementById('copy-btn');
    const copyFeedback = document.getElementById('copy-feedback');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const longUrl = longUrlInput.value;

        // --- Mock Backend Call ---
        // In a real app, you would make a fetch() request to your backend API here.
        // For this frontend demo, we'll just simulate a response.
        const shortCode = Math.random().toString(36).substring(2, 8);
        const shortenedUrl = `https://shortly.io/${shortCode}`;
        // --- End Mock Backend Call ---

        // Display the result
        displayResult(shortenedUrl);
    });

    function displayResult(url) {
        shortUrlLink.href = url;
        shortUrlLink.textContent = url;

        // Animate the result card appearing
        resultCard.classList.remove('hidden');
        gsap.to("#result-card", { 
            opacity: 1, 
            height: 'auto', 
            marginTop: '2rem', // 32px
            padding: '1rem', // 16px
            duration: 0.5, 
            ease: "power3.out" 
        });
    }

    // --- Copy to Clipboard Logic ---
    copyBtn.addEventListener('click', () => {
        const urlToCopy = shortUrlLink.href;
        
        // A reliable way to copy to clipboard that works in most environments
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
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);

        // Clear feedback message after a few seconds
        setTimeout(() => {
            copyFeedback.textContent = '';
        }, 2000);
    });
});
