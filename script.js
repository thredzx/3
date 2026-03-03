// Default product data
const defaultProducts = [
    { id: 1, name: "Smartphone X", price: 599, image: "https://picsum.photos/seed/phone/400/300" },
    { id: 2, name: "Designer Jacket", price: 120, image: "https://picsum.photos/seed/jacket/400/300" },
    { id: 3, name: "Wireless Earbuds", price: 80, image: "https://picsum.photos/seed/earbuds/400/300" },
    { id: 4, name: "Coffee Maker", price: 45, image: "https://picsum.photos/seed/coffee/400/300" },
    { id: 5, name: "Running Shoes", price: 95, image: "https://picsum.photos/seed/shoes/400/300" },
    { id: 6, name: "Smart Watch", price: 199, image: "https://picsum.photos/seed/watch/400/300" }
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
            <img src="${product.image}" alt="${product.name}" class="product-image" referrerPolicy="no-referrer">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="buy-btn" onclick="addToCart(${product.id})">Buy Now</button>
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
    
    // Find the button that was clicked (optional feedback)
    const buttons = document.querySelectorAll('.buy-btn');
    // In a real app, we'd target the specific button better, but for this demo:
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
    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('submit-btn').textContent = 'Update Product';
    document.getElementById('cancel-btn').style.display = 'inline-block';
    
    // Store index for update
    document.getElementById('product-form').dataset.editIndex = index;
}

// Handle Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('prod-id').value;
            const name = document.getElementById('prod-name').value;
            const price = document.getElementById('prod-price').value;
            const image = document.getElementById('prod-image').value;
            const editIndex = productForm.dataset.editIndex;

            if (editIndex !== undefined && editIndex !== "") {
                // Update existing
                products[editIndex] = { id: parseInt(id), name, price: parseFloat(price), image };
                delete productForm.dataset.editIndex;
            } else {
                // Add new
                products.push({ id: Date.now(), name, price: parseFloat(price), image });
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
