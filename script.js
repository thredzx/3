document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const buyButtons = document.querySelectorAll('.buy-btn');
    let cartCount = 0;

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartCount++;
            cartCountElement.textContent = cartCount;
            
            // Simple feedback
            const originalText = button.textContent;
            button.textContent = 'Added!';
            button.style.backgroundColor = '#4caf50';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 1000);
        });
    });

    // Search functionality (mock)
    const searchBtn = document.querySelector('.search-container button');
    const searchInput = document.querySelector('.search-container input');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            alert(`Searching for: ${query}`);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
});
