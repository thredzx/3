import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// --- SUPABASE CONFIGURATION ---
// Replace these with your actual Supabase project details
const SUPABASE_URL = 'https://qrxdkovubjbpbonykjfa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyeGRrb3Z1YmpicGJvbnlramZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDExOTYsImV4cCI6MjA4ODExNzE5Nn0.JSVZdNQVtsCd2EGqRiqg5kTMFMoBwDXT1uwfYhnNMes';

// Initialize Supabase client
const supabase = (SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_URL') 
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// --- PRODUCT MANAGEMENT ---
let products = [];
let currentCategory = 'All Products';

async function fetchProducts() {
    if (!supabase) {
        console.warn('Supabase not configured. Using local data.');
        products = JSON.parse(localStorage.getItem('edu_products')) || [
            { id: 1, name: "Smartphone X", price: 599, category: "ELECTRONICS", image: "https://picsum.photos/seed/phone/400/300" },
            { id: 2, name: "Designer Jacket", price: 120, category: "FASHION", image: "https://picsum.photos/seed/jacket/400/300" },
            { id: 3, name: "Wireless Earbuds", price: 80, category: "ELECTRONICS", image: "https://picsum.photos/seed/earbuds/400/300" },
            { id: 4, name: "Coffee Maker", price: 45, category: "HOME", image: "https://picsum.photos/seed/coffee/400/300" },
            { id: 5, name: "Running Shoes", price: 95, category: "FASHION", image: "https://picsum.photos/seed/shoes/400/300" },
            { id: 6, name: "Smart Watch", price: 199, category: "ELECTRONICS", image: "https://picsum.photos/seed/watch/400/300" },
            { id: 7, name: "Gaming Mouse", price: 60, category: "ELECTRONICS", image: "https://picsum.photos/seed/mouse/400/300" },
            { id: 8, name: "Backpack", price: 50, category: "FASHION", image: "https://picsum.photos/seed/backpack/400/300" }
        ];
        return;
    }

    let query = supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

    if (currentCategory !== 'All Products') {
        query = query.eq('category', currentCategory.toUpperCase());
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
    } else {
        products = data;
    }
}

// Function to render products on the main page
function renderProducts() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

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
window.addToCart = function(id) {
    cartCount++;
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = cartCount;
    alert('Added to cart!');
};

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

window.deleteProduct = async function(index) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const product = products[index];
    
    if (supabase) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', product.id);

        if (error) {
            alert('Error deleting product: ' + error.message);
            return;
        }
    } else {
        products.splice(index, 1);
        localStorage.setItem('edu_products', JSON.stringify(products));
    }

    await fetchProducts();
    renderAdminTable();
};

window.editProduct = function(index) {
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
    
    document.getElementById('product-form').dataset.editIndex = index;
};

// Authentication Logic
const ADMIN_PASSWORD = "jash@123";

window.logout = function() {
    sessionStorage.removeItem('edu_admin_auth');
    window.location.href = 'index.html';
};

function checkAuth() {
    const isAuth = sessionStorage.getItem('edu_admin_auth');
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('admin.html') && isAuth !== 'true') {
        window.location.href = 'login.html';
    }
}

// Handle Form Submission
document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await fetchProducts();
    renderProducts();
    renderAdminTable();

    // Sidebar Category Filtering
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            currentCategory = link.textContent;
            await fetchProducts();
            renderProducts();
        });
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-container button');

    const handleSearch = async () => {
        const searchTerm = searchInput.value.trim();
        if (!supabase) {
            // Local search
            if (searchTerm === "") {
                await fetchProducts();
            } else {
                products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
            }
            renderProducts();
            return;
        }

        let query = supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (searchTerm !== "") {
            query = query.ilike('name', `%${searchTerm}%`);
        }
        
        if (currentCategory !== 'All Products') {
            query = query.eq('category', currentCategory.toUpperCase());
        }

        const { data, error } = await query;
        if (!error) {
            products = data;
            renderProducts();
        }
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

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
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('prod-id').value;
            const name = document.getElementById('prod-name').value;
            const price = parseFloat(document.getElementById('prod-price').value);
            const image = document.getElementById('prod-image').value;
            const category = document.getElementById('prod-category') ? document.getElementById('prod-category').value : 'GENERAL';
            const editIndex = productForm.dataset.editIndex;

            const productData = { name, price, image, category };

            if (supabase) {
                if (editIndex !== undefined && editIndex !== "") {
                    // Update
                    const { error } = await supabase
                        .from('products')
                        .update(productData)
                        .eq('id', parseInt(id));
                    if (error) alert('Error updating: ' + error.message);
                } else {
                    // Create
                    const { error } = await supabase
                        .from('products')
                        .insert([productData]);
                    if (error) alert('Error creating: ' + error.message);
                }
            } else {
                // Fallback to localStorage
                if (editIndex !== undefined && editIndex !== "") {
                    products[editIndex] = { id: parseInt(id), ...productData };
                } else {
                    products.push({ id: Date.now(), ...productData });
                }
                localStorage.setItem('edu_products', JSON.stringify(products));
            }

            await fetchProducts();
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
        if (productForm) {
            productForm.reset();
            delete productForm.dataset.editIndex;
        }
        document.getElementById('form-title').textContent = 'Add New Product';
        document.getElementById('submit-btn').textContent = 'Add Product';
        if (cancelBtn) cancelBtn.style.display = 'none';
    }
});
