// Default product data
const defaultProducts = [
    { id: 1, name: "Smartphone X", price: 599, category: "ELECTRONICS", image: "https://picsum.photos/seed/phone/400/300" },
    { id: 2, name: "Designer Jacket", price: 120, category: "FASHION", image: "https://picsum.photos/seed/jacket/400/300" },
    { id: 3, name: "Wireless Earbuds", price: 80, category: "ELECTRONICS", image: "https://picsum.photos/seed/earbuds/400/300" },
    { id: 4, name: "Coffee Maker", price: 45, category: "HOME", image: "https://picsum.photos/seed/coffee/400/300" },
    { id: 5, name: "Running Shoes", price: 95, category: "FASHION", image: "https://picsum.photos/seed/shoes/400/300" },
    { id: 6, name: "Smart Watch", price: 199, category: "ELECTRONICS", image: "https://picsum.photos/seed/watch/400/300" },
    { id: 7, name: "Gaming Mouse", price: 60, category: "ELECTRONICS", image: "https://picsum.photos/seed/mouse/400/300" },
    { id: 8, name: "Backpack", price: 50, category: "FASHION", image: "https://picsum.photos/seed/backpack/400/300" }
];

// Initialize products from localStorage or use defaults
let products = JSON.parse(localStorage.getItem('edu_products')) || defaultProducts;

function saveProducts() {
    localStorage.setItem('edu_products', JSON.stringify(products));
}

// Function to render products on the main page
function renderProducts() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return; // Not on the main page

    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" referrerPolicy="no-referrer">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category || 'GENERAL'}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-footer">
                    <p class="product-price">$${product.price}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">+</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Cart Logic
let cartCount = 0;
function addToCart(id) {
    cartCount++;
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = cartCount;
    
    // Simple feedback
    alert('Added to cart!');
}

// Admin Page Logic
function renderAdminTable() {
    const tableBody = document.getElementById('admin-product-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" width="50" style="border-radius:4px"></td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>
                <button class="edit-btn" onclick="editProduct(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        products.splice(index, 1);
        saveProducts();
        renderAdminTable();
    }
}

function editProduct(index) {
    const product = products[index];
    document.getElementById('prod-id').value = product.id;
    document.getElementById('prod-name').value = product.name;
    document.getElementById('prod-price').value = product.price;
    document.getElementById('prod-image').value = product.image;
    if (document.getElementById('prod-category')) {
        document.getElementById('prod-category').value = product.category || '';
    }
    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('submit-btn').textContent = 'Update Product';
    document.getElementById('cancel-btn').style.display = 'inline-block';
    
    // Store index for update
    document.getElementById('product-form').dataset.editIndex = index;
}

// Authentication Logic
const ADMIN_PASSWORD = "jash@123";

function checkAuth() {
    const isAuth = sessionStorage.getItem('edu_admin_auth');
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('admin.html') && isAuth !== 'true') {
        window.location.href = 'login.html';
    }
}

function logout() {
    sessionStorage.removeItem('edu_admin_auth');
    window.location.href = 'index.html';
}

// Handle Form Submission
document.addEventListener('DOMContentLoaded', () => {
    // Check auth on admin page
    checkAuth();

    // Login Form Handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const passwordInput = document.getElementById('password').value;
            const errorMsg = document.getElementById('login-error');

            if (passwordInput === ADMIN_PASSWORD) {
                sessionStorage.setItem('edu_admin_auth', 'true');
                window.location.href = 'admin.html';
            } else {
                errorMsg.style.display = 'block';
                document.getElementById('password').value = '';
            }
        });
    }

    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('prod-id').value;
            const name = document.getElementById('prod-name').value;
            const price = document.getElementById('prod-price').value;
            const image = document.getElementById('prod-image').value;
            const category = document.getElementById('prod-category') ? document.getElementById('prod-category').value : 'GENERAL';
            const editIndex = productForm.dataset.editIndex;

            if (editIndex !== undefined && editIndex !== "") {
                // Update existing
                products[editIndex] = { id: parseInt(id), name, price: parseFloat(price), image, category };
                delete productForm.dataset.editIndex;
            } else {
                // Add new
                products.push({ id: Date.now(), name, price: parseFloat(price), image, category });
            }

            saveProducts();
            renderAdminTable();
            productForm.reset();
            resetForm();
        });
    }

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }

    function resetForm() {
        if (productForm) productForm.reset();
        document.getElementById('form-title').textContent = 'Add New Product';
        document.getElementById('submit-btn').textContent = 'Add Product';
        if (cancelBtn) cancelBtn.style.display = 'none';
        if (productForm) delete productForm.dataset.editIndex;
    }

    // Initial Renders
    renderProducts();
    renderAdminTable();
});
