// Admin panel JavaScript extensions
// To be included in the script.js file or as a separate file

// Mock data for admin panel
// Initially, we'll clone the products array from script.js but changes will reflect on both
let adminProductsData = [...products]; // Clone the products array from script.js

// Add stock property to products if they don't have one already
adminProductsData.forEach(product => {
    // Randomly set stock (for demonstration purposes) if not already set
    if (typeof product.stock === 'undefined') {
        product.stock = Math.floor(Math.random() * 20);
    }
});

// Function to load products into admin product table
function loadAdminProducts(productsData, containerId = 'products-list') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    productsData.forEach(product => {
        const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
        const stockLabel = product.stock > 10 ? 'Stokta' : product.stock > 0 ? `Az Stokta (${product.stock})` : 'Stokta Yok';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumb"></td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${formatPrice(product.price)}</td>
            <td><span class="product-stock ${stockStatus}">${stockLabel}</span></td>
            <td>
                <div class="product-actions">
                    <a href="admin-edit-product.html?id=${product.id}" class="btn-edit"><i class="fas fa-edit"></i></a>
                    <button class="btn-delete" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        container.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            openDeleteConfirmation(productId);
        });
    });
}

// Function to open delete confirmation modal
function openDeleteConfirmation(productId) {
    const deleteConfirmation = document.getElementById('delete-confirmation');
    if (!deleteConfirmation) return;
    
    deleteConfirmation.style.display = 'flex';
    
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    
    // Set product ID to delete
    confirmDeleteButton.setAttribute('data-id', productId);
    
    // Cancel delete event
    cancelDeleteButton.addEventListener('click', function() {
        deleteConfirmation.style.display = 'none';
    });
    
    // Confirm delete event - Yeniden ekleniyor
    // Bu olay dinleyicileri zaten eklenmiş olabileceğinden, önce kaldıralım
    confirmDeleteButton.removeEventListener('click', confirmDeleteHandler);
    confirmDeleteButton.addEventListener('click', confirmDeleteHandler);
}

// Onaylama butonuna bağlamak için işleyici fonksiyon
function confirmDeleteHandler() {
    const productId = parseInt(this.getAttribute('data-id'));
    deleteProduct(productId);
    document.getElementById('delete-confirmation').style.display = 'none';
}

// Function to delete product - ÖNEMLİ GÜNCELLENDİ
function deleteProduct(productId) {
    // Find product index in the admin products array
    const adminProductIndex = adminProductsData.findIndex(product => product.id === productId);
    
    // Find product index in the global products array
    const globalProductIndex = products.findIndex(product => product.id === productId);
    
    if (adminProductIndex !== -1) {
        // Remove product from admin array
        adminProductsData.splice(adminProductIndex, 1);
        
        // Remove product from global array if found
        if (globalProductIndex !== -1) {
            products.splice(globalProductIndex, 1);
        }
        
        // Update UI
        loadAdminProducts(adminProductsData);
        
        // Show success message
        showToast('Ürün başarıyla silindi!', 'success');
        
        // Store updated products to localStorage for persistence
        localStorage.setItem('dsshop-products', JSON.stringify(products));
    }
}

// Function to filter admin products
function filterAdminProducts() {
    const categoryFilter = document.getElementById('category-filter');
    const stockFilter = document.getElementById('stock-filter');
    const searchInput = document.querySelector('.search-products input');
    
    if (!categoryFilter || !stockFilter || !searchInput) return;
    
    const categoryValue = categoryFilter.value.toLowerCase();
    const stockValue = stockFilter.value;
    const searchValue = searchInput.value.toLowerCase();
    
    // Filter products
    let filteredProducts = [...adminProductsData];
    
    // Filter by category
    if (categoryValue) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === categoryValue
        );
    }
    
    // Filter by stock status
    if (stockValue) {
        filteredProducts = filteredProducts.filter(product => {
            if (stockValue === 'in-stock') return product.stock > 10;
            if (stockValue === 'low-stock') return product.stock > 0 && product.stock <= 10;
            if (stockValue === 'out-of-stock') return product.stock === 0;
            return true;
        });
    }
    
    // Filter by search
    if (searchValue) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchValue)
        );
    }
    
    // Update UI with filtered products
    loadAdminProducts(filteredProducts);
}

// Function to load product data for editing - ÖNEMLİ GÜNCELLENDİ
function loadProductForEditing(productId) {
    const product = findProductById(productId);
    
    if (!product) {
        showToast('Ürün bulunamadı!', 'error');
        setTimeout(() => {
            window.location.href = 'admin-products.html';
        }, 2000);
        return;
    }
    
    // Fill form fields with product data
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    
    // Set stock status
    const inStockRadio = document.getElementById('in-stock');
    const outOfStockRadio = document.getElementById('out-of-stock');
    const stockQuantity = document.getElementById('stock-quantity');
    
    if (product.stock > 0) {
        inStockRadio.checked = true;
        stockQuantity.value = product.stock;
        stockQuantity.disabled = false;
    } else {
        outOfStockRadio.checked = true;
        stockQuantity.value = 0;
        stockQuantity.disabled = true;
    }
    
    // Set product image
    const imagePreview = document.getElementById('image-preview');
    const imageUpload = document.getElementById('image-upload');
    const previewImg = document.getElementById('preview-img');
    
    if (product.image) {
        previewImg.src = product.image;
        imagePreview.style.display = 'block';
        imageUpload.style.display = 'none';
    }
    
    // Add event listener to the form for saving changes
    const editForm = document.getElementById('edit-product-form');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const updatedProduct = {
                id: productId,
                name: document.getElementById('product-name').value,
                category: document.getElementById('product-category').value,
                price: parseFloat(document.getElementById('product-price').value),
                description: document.getElementById('product-description').value,
                image: previewImg.src || product.image,
                stock: parseInt(document.getElementById('stock-quantity').value)
            };
            
            // Update product
            updateProduct(updatedProduct);
            
            // Show success message
            showToast('Ürün başarıyla güncellendi!', 'success');
            
            // Redirect after a delay
            setTimeout(() => {
                window.location.href = 'admin-products.html';
            }, 2000);
        });
    }
    
    // Add stock status radio button change listeners
    const stockRadios = document.querySelectorAll('input[name="stock-status"]');
    stockRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'out-of-stock') {
                stockQuantity.value = 0;
                stockQuantity.disabled = true;
            } else {
                stockQuantity.disabled = false;
                if (parseInt(stockQuantity.value) === 0) {
                    stockQuantity.value = 1;
                }
            }
        });
    });
}

// Function to update product - YENİ EKLEME
function updateProduct(updatedProduct) {
    // Find product index in both arrays
    const globalProductIndex = products.findIndex(p => p.id === updatedProduct.id);
    const adminProductIndex = adminProductsData.findIndex(p => p.id === updatedProduct.id);
    
    // Update in global products array
    if (globalProductIndex !== -1) {
        products[globalProductIndex] = { ...products[globalProductIndex], ...updatedProduct };
    }
    
    // Update in admin products array
    if (adminProductIndex !== -1) {
        adminProductsData[adminProductIndex] = { ...adminProductsData[adminProductIndex], ...updatedProduct };
    }
    
    // Store updated products to localStorage for persistence
    localStorage.setItem('dsshop-products', JSON.stringify(products));
}

// Function to add a new product - YENİ EKLEME
function addNewProduct(newProduct) {
    // Generate a new ID (highest current ID + 1)
    const highestId = products.reduce((max, product) => Math.max(max, product.id), 0);
    newProduct.id = highestId + 1;
    
    // Add to global products array
    products.push(newProduct);
    
    // Add to admin products array
    adminProductsData.push(newProduct);
    
    // Store updated products to localStorage for persistence
    localStorage.setItem('dsshop-products', JSON.stringify(products));
    
    return newProduct.id;
}

// Initialize add product form
function initAddProductForm() {
    const addForm = document.getElementById('add-product-form');
    if (!addForm) return;
    
    // Image upload functionality
    const imageUpload = document.getElementById('image-upload');
    const productImage = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImage = document.getElementById('remove-image');

    imageUpload.addEventListener('click', function() {
        productImage.click();
    });

    productImage.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.style.display = 'block';
                imageUpload.style.display = 'none';
            }
            
            reader.readAsDataURL(this.files[0]);
        }
    });

    removeImage.addEventListener('click', function() {
        productImage.value = '';
        previewImg.src = '';
        imagePreview.style.display = 'none';
        imageUpload.style.display = 'block';
    });
    
    // Add stock status radio button change listeners
    const stockRadios = document.querySelectorAll('input[name="stock-status"]');
    const stockQuantity = document.getElementById('stock-quantity');
    
    stockRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'out-of-stock') {
                stockQuantity.value = 0;
                stockQuantity.disabled = true;
            } else {
                stockQuantity.disabled = false;
                if (parseInt(stockQuantity.value) === 0) {
                    stockQuantity.value = 1;
                }
            }
        });
    });

    // Form submission handler
    addForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form fields
        const productName = document.getElementById('product-name').value;
        const productCategory = document.getElementById('product-category').value;
        const productPrice = parseFloat(document.getElementById('product-price').value);
        const productDescription = document.getElementById('product-description').value;
        const stockStatus = document.querySelector('input[name="stock-status"]:checked').value;
        const stockQuantity = parseInt(document.getElementById('stock-quantity').value);
        
        if (!productName || !productCategory || isNaN(productPrice) || !productDescription) {
            showToast('Lütfen tüm gerekli alanları doldurun!', 'error');
            return;
        }
        
        // Check if image is uploaded
        if (!previewImg.src) {
            showToast('Lütfen bir ürün görseli ekleyin!', 'error');
            return;
        }
        
        // Create new product object
        const newProduct = {
            name: productName,
            category: productCategory,
            price: productPrice,
            description: productDescription,
            image: previewImg.src || '/api/placeholder/250/200',
            stock: stockStatus === 'in-stock' ? stockQuantity : 0
        };
        
        // Add the new product
        const productId = addNewProduct(newProduct);
        
        showToast(`Ürün başarıyla eklendi! Ürün ID: ${productId}`, 'success');
        
        // Redirect after a delay
        setTimeout(function() {
            window.location.href = 'admin-products.html';
        }, 2000);
    });
}

// Load products from localStorage if available
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('dsshop-products');
    if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        // Update global products array with stored products
        products.length = 0; // Clear existing products
        parsedProducts.forEach(product => products.push(product));
        // Update admin products array
        adminProductsData = [...products];
        
        console.log('Ürünler lokalden yüklendi:', products.length);
    }
}

// Initialize admin panel
function initAdminPanel() {
    // First, load any products from storage
    loadProductsFromStorage();
    
    // Check if we're on the admin products page
    const productsList = document.getElementById('products-list');
    if (productsList) {
        loadAdminProducts(adminProductsData);
        
        // Add event listeners for filtering
        const categoryFilter = document.getElementById('category-filter');
        const stockFilter = document.getElementById('stock-filter');
        const searchInput = document.querySelector('.search-products input');
        const searchButton = document.querySelector('.search-products button');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterAdminProducts);
        }
        
        if (stockFilter) {
            stockFilter.addEventListener('change', filterAdminProducts);
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', filterAdminProducts);
        }
        
        if (searchButton) {
            searchButton.addEventListener('click', function(e) {
                e.preventDefault();
                filterAdminProducts();
            });
        }
    }
    
    // Check if we're on the edit product page
    const editProductForm = document.getElementById('edit-product-form');
    if (editProductForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (productId) {
            // Load product data for editing
            loadProductForEditing(productId);
        }
    }
    
    // Check if we're on the add product page
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        initAddProductForm();
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on an admin page
    const adminSidebar = document.querySelector('.admin-sidebar');
    if (adminSidebar) {
        initAdminPanel();
    }
});