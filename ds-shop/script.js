// Sample product data
const products = [
    { 
        id: 1, 
        name: "Akıllı Telefon XYZ Model", 
        price: 3999.99, 
        image: "/api/placeholder/250/200",
        category: "elektronik",
        description: "Yüksek performanslı, son teknoloji akıllı telefon. 6.7 inç ekran, 128GB depolama, 48MP kamera."
    },
    { 
        id: 2, 
        name: "Kablosuz Kulaklık", 
        price: 1299.99, 
        image: "/api/placeholder/250/200",
        category: "elektronik",
        description: "Aktif gürültü engelleme özellikli, uzun pil ömrüne sahip kablosuz kulaklık."
    },
    { 
        id: 3, 
        name: "Akıllı Saat", 
        price: 799.99, 
        image: "/api/placeholder/250/200",
        category: "elektronik",
        description: "Fitness takibi, kalp ritmi ölçümü, bildirim özellikli şık tasarımlı akıllı saat."
    },
    { 
        id: 4, 
        name: "Bluetooth Hoparlör", 
        price: 549.99, 
        image: "/api/placeholder/250/200",
        category: "elektronik",
        description: "Taşınabilir, su geçirmez, yüksek ses kalitesine sahip bluetooth hoparlör."
    },
    { 
        id: 5, 
        name: "Ultra HD Smart TV", 
        price: 6999.99, 
        image: "/api/placeholder/250/200",
        category: "elektronik",
        description: "55 inç 4K Ultra HD ekran, akıllı TV özellikleri, geniş uygulama desteği."
    },
    { 
        id: 6, 
        name: "Robot Süpürge", 
        price: 2499.99, 
        image: "/api/placeholder/250/200",
        category: "ev-yasam",
        description: "Akıllı haritalama, otomatik şarj istasyonu, uzaktan kontrol özellikleri."
    },
    { 
        id: 7, 
        name: "Kahve Makinesi", 
        price: 1899.99, 
        image: "/api/placeholder/250/200",
        category: "ev-yasam",
        description: "Otomatik programlama, öğütücü, çeşitli kahve hazırlama seçenekleri."
    },
    { 
        id: 8, 
        name: "Akıllı Bileklik", 
        price: 399.99, 
        image: "/api/placeholder/250/200",
        category: "elektronik",
        description: "Adım sayar, uyku takibi, bildirim özellikleri, su geçirmez tasarım."
    },
    { 
        id: 9, 
        name: "Spor Ayakkabı", 
        price: 699.99, 
        image: "/api/placeholder/250/200",
        category: "giyim",
        description: "Hafif, konforlu, spor aktiviteleri için uygun, dayanıklı ayakkabı."
    },
    { 
        id: 10, 
        name: "Deri Cüzdan", 
        price: 299.99, 
        image: "/api/placeholder/250/200",
        category: "giyim",
        description: "Gerçek deri, çok bölmeli, şık tasarımlı cüzdan."
    },
    { 
        id: 11, 
        name: "Yüz Temizleme Seti", 
        price: 199.99, 
        image: "/api/placeholder/250/200",
        category: "kozmetik",
        description: "Derin temizlik, gözenek sıkılaştırma, cilt bakım seti."
    },
    { 
        id: 12, 
        name: "Bestseller Roman", 
        price: 49.99, 
        image: "/api/placeholder/250/200",
        category: "kitap",
        description: "Ödüllü yazar tarafından yazılmış, çok satan roman."
    }
];

// Global state variables
let cart = [];
let wishlist = [];
let isLoggedIn = false;
let userType = 'personal'; // 'personal' veya 'corporate' olabilir
let currentUserEmail = ''; // Giriş yapan kullanıcının e-posta adresi

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Global event listener'ları başlat
    initGlobalEventListeners();
    
    // Kullanıcı giriş durumunu kontrol et
    checkLoginStatus();
    
    // Sepet ve istek listesini yükle
    loadCartFromStorage();
    loadWishlistFromStorage();
    updateWishlistIcons();
    
    // Erişim kontrollerini yap
    checkAccountAccess();
    checkAdminAccess();
    checkCheckoutAccess();
    
    // Sayfa özel işlemlerini kontrol et
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Kategori sayfasında mıyız?
    if (path.includes('category.html')) {
        const category = urlParams.get('category');
        const search = urlParams.get('search');
        const viewAll = urlParams.get('view') === 'all';
        
        // Kategori, arama veya tüm ürünleri görüntüleme durumunu kontrol et
        if (category) {
            // Kategoriye göre ürünleri yükle
            loadCategoryProducts(category);
            
            // Kategori filtreleri için olay dinleyicileri ekle
            document.getElementById('price-filter').addEventListener('input', function() {
                document.getElementById('price-value').textContent = this.value + ' ₺';
                filterCategoryProducts(category);
            });
            
            document.getElementById('sort-options').addEventListener('change', function() {
                filterCategoryProducts(category);
            });
            
            document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    filterCategoryProducts(category);
                });
            });
        } else if (search) {
            // Arama sonuçlarını yükle
            loadSearchResults(search);
            
            // Arama filtreleri için olay dinleyicileri ekle
            document.getElementById('price-filter').addEventListener('input', function() {
                document.getElementById('price-value').textContent = this.value + ' ₺';
                filterSearchResults(search);
            });
            
            document.getElementById('sort-options').addEventListener('change', function() {
                filterSearchResults(search);
            });
            
            document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    filterSearchResults(search);
                });
            });
        } else if (viewAll) {
            // Tüm ürünleri yükle
            loadAllProducts();
            
            // Tüm ürünler filtreleri için olay dinleyicileri ekle
            document.getElementById('price-filter').addEventListener('input', function() {
                document.getElementById('price-value').textContent = this.value + ' ₺';
                filterAllProducts();
            });
            
            document.getElementById('sort-options').addEventListener('change', function() {
                filterAllProducts();
            });
            
            document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    filterAllProducts();
                });
            });
        }
    }
    
    // Ana sayfadaki arama işlevselliği
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.getElementById('search-btn');
    
    if (searchInput && searchButton) {
        // Enter tuşuna basıldığında arama yap
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                window.location.href = `category.html?search=${encodeURIComponent(this.value.trim())}`;
            }
        });
        
        // Arama butonuna tıklandığında arama yap
        searchButton.addEventListener('click', function() {
            const searchInputField = document.querySelector('.search-bar input');
            if (searchInputField && searchInputField.value.trim()) {
                window.location.href = `category.html?search=${encodeURIComponent(searchInputField.value.trim())}`;
            }
        });
    }
});

// Aşağıdaki fonksiyonlar script.js dosyasında zaten varsa eklenmesine gerek yok
// Bu fonksiyonları script.js dosyasına eklememiz gerekiyor (eğer yoksa)

// Kategori sayfası için ürün yükleme fonksiyonu
function loadCategoryProducts(category) {
    const categoryProductsContainer = document.getElementById('category-products');
    if (!categoryProductsContainer) return;
    
    // Kategori başlığını güncelle
    document.getElementById('category-title').textContent = getCategoryName(category);
    document.title = `${getCategoryName(category)} - DS Shop`;
    
    // Kategori ürünlerini filtrele
    let filteredProducts = products.filter(product => product.category === category);
    
    // Ürün sayısını göster
    document.getElementById('product-count').textContent = `${filteredProducts.length} Ürün`;
    
    // Ürünleri yükle
    loadProductsToContainer(filteredProducts, 'category-products');
}

// Tüm ürünleri yükleme fonksiyonu
function loadAllProducts() {
    const categoryProductsContainer = document.getElementById('category-products');
    if (!categoryProductsContainer) return;
    
    document.getElementById('category-title').textContent = 'Tüm Ürünler';
    document.title = 'Tüm Ürünler - DS Shop';
    
    // Ürün sayısını göster
    document.getElementById('product-count').textContent = `${products.length} Ürün`;
    
    // Tüm ürünleri yükle
    loadProductsToContainer(products, 'category-products');
}

// Arama sonuçlarını yükleme fonksiyonu
function loadSearchResults(query) {
    const categoryProductsContainer = document.getElementById('category-products');
    if (!categoryProductsContainer) return;
    
    document.getElementById('category-title').textContent = `"${query}" için Arama Sonuçları`;
    document.title = `"${query}" için Arama Sonuçları - DS Shop`;
    
    // Arama yapma ve sonuçları alma
    const searchResults = searchProducts(query);
    
    // Ürün sayısını göster
    document.getElementById('product-count').textContent = `${searchResults.length} Ürün`;
    
    // Arama sonuçlarını yükle
    loadProductsToContainer(searchResults, 'category-products');
}

// Kategori ürünlerini filtreleme fonksiyonu
function filterCategoryProducts(category) {
    const maxPrice = parseInt(document.getElementById('price-filter').value);
    const sortOption = document.getElementById('sort-options').value;
    const checkedBrands = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.id);
    
    // Ürünleri filtrele
    let filteredProducts = products.filter(product => {
        const categoryMatch = product.category === category;
        const priceMatch = product.price <= maxPrice;
        
        // Eğer hiç marka seçilmediyse veya ürünün markası seçilen markalardan biriyse
        const brandMatch = checkedBrands.length === 0 || checkedBrands.includes(getBrandId(product));
        
        return categoryMatch && priceMatch && brandMatch;
    });
    
    // Sıralama
    filteredProducts = sortProducts(filteredProducts, sortOption);
    
    // Ürün sayısını güncelle
    document.getElementById('product-count').textContent = `${filteredProducts.length} Ürün`;
    
    // Ürünleri yükle
    loadProductsToContainer(filteredProducts, 'category-products');
}

// Arama sonuçlarını filtreleme fonksiyonu
function filterSearchResults(query) {
    const maxPrice = parseInt(document.getElementById('price-filter').value);
    const sortOption = document.getElementById('sort-options').value;
    const checkedBrands = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.id);
    
    // Önce arama yap
    let searchResults = searchProducts(query);
    
    // Sonra filtrele
    let filteredProducts = searchResults.filter(product => {
        const priceMatch = product.price <= maxPrice;
        
        // Eğer hiç marka seçilmediyse veya ürünün markası seçilen markalardan biriyse
        const brandMatch = checkedBrands.length === 0 || checkedBrands.includes(getBrandId(product));
        
        return priceMatch && brandMatch;
    });
    
    // Sıralama
    filteredProducts = sortProducts(filteredProducts, sortOption);
    
    // Ürün sayısını güncelle
    document.getElementById('product-count').textContent = `${filteredProducts.length} Ürün`;
    
    // Ürünleri yükle
    loadProductsToContainer(filteredProducts, 'category-products');
}

// Tüm ürünleri filtreleme fonksiyonu
function filterAllProducts() {
    const maxPrice = parseInt(document.getElementById('price-filter').value);
    const sortOption = document.getElementById('sort-options').value;
    const checkedBrands = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.id);
    
    // Ürünleri filtrele
    let filteredProducts = products.filter(product => {
        const priceMatch = product.price <= maxPrice;
        
        // Eğer hiç marka seçilmediyse veya ürünün markası seçilen markalardan biriyse
        const brandMatch = checkedBrands.length === 0 || checkedBrands.includes(getBrandId(product));
        
        return priceMatch && brandMatch;
    });
    
    // Sıralama
    filteredProducts = sortProducts(filteredProducts, sortOption);
    
    // Ürün sayısını güncelle
    document.getElementById('product-count').textContent = `${filteredProducts.length} Ürün`;
    
    // Ürünleri yükle
    loadProductsToContainer(filteredProducts, 'category-products');
}

// Ürünleri sıralama fonksiyonu
function sortProducts(productsList, sortOption) {
    const sortedProducts = [...productsList]; // Orijinal diziyi değiştirmemek için kopyasını al
    
    switch(sortOption) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default: // 'recommended' veya diğer değerler
            // Varsayılan sıralama, ürün ID'lerine göre olabilir
            sortedProducts.sort((a, b) => a.id - b.id);
    }
    
    return sortedProducts;
}

// Ürün için marka ID'sini oluşturma fonksiyonu (bu örnek için)
function getBrandId(product) {
    // Bu örnek için marka bilgisi olmadığından dolayı,
    // brandN şeklinde seçicileri kullanmak için bu yardımcı fonksiyon eklendi
    // Gerçek uygulamada ürünün marka bilgisine göre bu değer döndürülmelidir
    return `brand${(product.id % 4) + 1}`;
}

// Arama fonksiyonu - Eğer script.js'de tanımlı değilse ekleyin
// Bu fonksiyon, arama terimini içeren ürünleri bulur
function searchProducts(query) {
   if (!query) return [];
   
   query = query.toLowerCase();
   
   return products.filter(product => {
       const nameMatch = product.name.toLowerCase().includes(query);
       const descMatch = product.description.toLowerCase().includes(query);
       const categoryMatch = getCategoryName(product.category).toLowerCase().includes(query);
       
       return nameMatch || descMatch || categoryMatch;
   });
}

function initGlobalEventListeners() {
    // Cart and wishlist toggle
    document.getElementById('toggle-cart').addEventListener('click', function(e) {
        e.preventDefault();
        toggleModal('cart-modal');
    });
    
    if (document.getElementById('cart-close')) {
        document.getElementById('cart-close').addEventListener('click', function() {
            closeModal('cart-modal');
        });
    }
    
    // İstek listesi toggle fonksiyonu güncellendi
    document.getElementById('toggle-wishlist').addEventListener('click', toggleWishlistModal);
    
    if (document.getElementById('wishlist-close')) {
        document.getElementById('wishlist-close').addEventListener('click', function() {
            closeModal('wishlist-modal');
        });
    }
    
    // Checkout butonuna olay dinleyicisi ekleme
    if (document.getElementById('cart-checkout')) {
        document.getElementById('cart-checkout').addEventListener('click', function(e) {
            e.preventDefault();
            checkoutControl();
        });
    }
    
    // Checkout sayfasında sepet ve istek listesi sorunlarını düzeltmek için özel işleyiciler
    if (window.location.pathname.includes('checkout.html')) {
        // Checkout sayfasında cart-modal işleyicileri
        const cartToggleCheckout = document.getElementById('toggle-cart');
        if (cartToggleCheckout) {
            cartToggleCheckout.addEventListener('click', function(e) {
                e.preventDefault();
                const cartModal = document.getElementById('cart-modal');
                if (cartModal) {
                    cartModal.classList.add('show');
                    const overlay = document.getElementById('overlay');
                    if (overlay) overlay.style.display = 'block';
                }
            });
        }
        
        // Checkout sayfasında wishlist-modal işleyicileri
        const wishlistToggleCheckout = document.getElementById('toggle-wishlist');
        if (wishlistToggleCheckout) {
            wishlistToggleCheckout.addEventListener('click', toggleWishlistModal);
        }
    }
    
    // Login modal
    document.getElementById('login-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (isLoggedIn) {
            // Kullanıcı tipine göre yönlendirme yapalım
            if (userType === 'corporate') {
                window.location.href = 'admin-panel.html';
            } else {
                window.location.href = 'account.html';
            }
        } else {
            toggleModal('login-modal');
        }
    });
    
    if (document.getElementById('close-login')) {
        document.getElementById('close-login').addEventListener('click', function() {
            closeModal('login-modal');
        });
    }
    
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Register modal
    if (document.getElementById('show-register')) {
        document.getElementById('show-register').addEventListener('click', function(e) {
            e.preventDefault();
            toggleModal('login-modal', 'register-modal');
        });
    }
    
    if (document.getElementById('close-register')) {
        document.getElementById('close-register').addEventListener('click', function() {
            closeModal('register-modal');
        });
    }
    
    if (document.getElementById('register-form')) {
        document.getElementById('register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
    if (document.getElementById('show-login')) {
        document.getElementById('show-login').addEventListener('click', function(e) {
            e.preventDefault();
            toggleModal('register-modal', 'login-modal');
        });
    }
    
    // Forgot password modal
    if (document.getElementById('forgot-password')) {
        document.getElementById('forgot-password').addEventListener('click', function(e) {
            e.preventDefault();
            toggleModal('login-modal', 'forgot-modal');
        });
    }
    
    if (document.getElementById('close-forgot')) {
        document.getElementById('close-forgot').addEventListener('click', function() {
            closeModal('forgot-modal');
        });
    }
    
    if (document.getElementById('forgot-form')) {
        document.getElementById('forgot-form').addEventListener('submit', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
    
    if (document.getElementById('back-to-login')) {
        document.getElementById('back-to-login').addEventListener('click', function(e) {
            e.preventDefault();
            toggleModal('forgot-modal', 'login-modal');
        });
    }
    
    // Overlay
    if (document.getElementById('overlay')) {
        document.getElementById('overlay').addEventListener('click', function() {
            closeAllModals();
        });
    }
    
    // Search
    if (document.getElementById('search-btn')) {
        document.getElementById('search-btn').addEventListener('click', function() {
            const searchInput = document.querySelector('.search-bar input');
            if (searchInput.value.trim()) {
                // Redirect to search results page
                window.location.href = `category.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
        
        // Enter key in search box
        document.querySelector('.search-bar input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                window.location.href = `category.html?search=${encodeURIComponent(this.value.trim())}`;
            }
        });
    }
    
    // Çıkış Yap butonu
    const logoutLinks = document.querySelectorAll('.logout-link');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
}

// Cart functions
function addToCart(productId, quantity) {
    // Kurumsal hesap kontrolü
    if (isLoggedIn && userType === 'corporate') {
        showToast('Kurumsal hesaplar sepet özelliğini kullanamaz!', 'error');
        return;
    }

    const product = findProductById(productId);
    if (!product) return;

    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity
        });
    }
    
    // Save cart to local storage
    saveCartToStorage();
    
    // Update cart UI
    updateCartUI();
    
    // Show success message
    showToast(`${product.name} sepete eklendi!`, 'success');
}

function removeFromCart(productId) {
    const product = findProductById(productId);
    if (!product) return;
    
    // Remove item from cart
    cart = cart.filter(item => item.id !== productId);
    
    // Save cart to local storage
    saveCartToStorage();
    
    // Update cart UI
    updateCartUI();
    
    // Show success message
    showToast(`${product.name} sepetten kaldırıldı!`, 'success');
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item && newQuantity > 0) {
        item.quantity = newQuantity;
        saveCartToStorage();
        updateCartUI();
    }
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Sepetinizde ürün bulunmamaktadır.</p>';
        
        if (document.getElementById('cart-total')) {
            document.getElementById('cart-total').textContent = formatPrice(0);
        }
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const product = findProductById(item.id);
        if (!product) return;
        
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${product.name}</div>
                <div class="cart-item-price">${formatPrice(product.price)}</div>
                <div class="cart-item-quantity">
                    <button class="decrease-qty" data-id="${product.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="cart-qty" data-id="${product.id}">
                    <button class="increase-qty" data-id="${product.id}">+</button>
                </div>
                <button class="cart-item-remove" data-id="${product.id}">Kaldır</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    if (document.getElementById('cart-total')) {
        document.getElementById('cart-total').textContent = formatPrice(total);
    }
    
    // Add event listeners to cart items
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const input = document.querySelector(`.cart-qty[data-id="${productId}"]`);
            const currentQty = parseInt(input.value);
            if (currentQty > 1) {
                updateCartQuantity(productId, currentQty - 1);
            }
        });
    });
    
    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const input = document.querySelector(`.cart-qty[data-id="${productId}"]`);
            const currentQty = parseInt(input.value);
            updateCartQuantity(productId, currentQty + 1);
        });
    });
    
    document.querySelectorAll('.cart-qty').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const newQty = parseInt(this.value);
            if (newQty > 0) {
                updateCartQuantity(productId, newQty);
            } else {
                this.value = 1;
                updateCartQuantity(productId, 1);
            }
        });
    });
}
// İstek listesi fonksiyonları için güncelleme
function addToWishlist(productId) {
    // Kullanıcı giriş yapmış mı kontrol et
    if (!isLoggedIn) {
        showToast('İstek listesine ürün eklemek için giriş yapmalısınız!', 'error');
        // Opsiyonel: Giriş modalını göster
        toggleModal('login-modal');
        return;
    }
    
    // Kurumsal hesap kontrolü
    if (userType === 'corporate') {
        showToast('Kurumsal hesaplar istek listesi özelliğini kullanamaz!', 'error');
        return;
    }
    
    const product = findProductById(productId);
    if (!product) return;
    
    // Check if product is already in wishlist
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        
        // Save wishlist to local storage
        saveWishlistToStorage();
        
        // Update wishlist UI
        updateWishlistUI();
        
        // Update wishlist icons - yeni
        updateWishlistIcons();
        
        // Show success message
        showToast(`${product.name} istek listesine eklendi!`, 'success');
    } else {
        showToast(`${product.name} zaten istek listenizde!`, 'error');
    }
}

// İstek listesi toggle fonksiyonu için güncelleme
function toggleWishlistModal(e) {
    if (e) e.preventDefault();
    
    // Kullanıcı giriş yapmış mı kontrol et
    if (!isLoggedIn) {
        showToast('İstek listesine erişmek için giriş yapmalısınız!', 'error');
        // Opsiyonel: Giriş modalını göster
        toggleModal('login-modal');
        return;
    }
    
    // Kurumsal hesap kontrolü
    if (userType === 'corporate') {
        showToast('Kurumsal hesaplar istek listesi özelliğini kullanamaz!', 'error');
        return;
    }
    
    // İstek listesi modalını aç/kapat
    toggleModal('wishlist-modal');
}

// Ürün listesini localStorage'dan yükleme fonksiyonu
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('dsshop-products');
    if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        
        // Ürünleri global products dizisine aktar
        if (parsedProducts.length > 0) {
            // Mevcut ürünleri temizle
            products.length = 0;
            
            // Yeni ürünleri ekle
            parsedProducts.forEach(product => products.push(product));
            
            console.log('Ürünler lokalden yüklendi:', products.length);
        }
    }
}

// DOM yüklendiğinde çağrılacak ek fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    // Önce localStorage'dan ürünleri yükle
    loadProductsFromStorage();
    
    // Mevcut DOMContentLoaded olaylarının sonrası olarak düşünün
    const featuredProductsGrid = document.getElementById('featured-products-grid');
    const newProductsGrid = document.getElementById('new-products-grid');
    const categoryProductsContainer = document.getElementById('category-products');
    
    // Anasayfadaki ürünleri güncelle
    if (featuredProductsGrid) {
        // İlk 4 ürünü göster
        loadProductsToContainer(products.slice(0, 4), 'featured-products-grid');
    }
    
    if (newProductsGrid) {
        // Sonraki 4 ürünü göster
        loadProductsToContainer(products.slice(4, 8), 'new-products-grid');
    }
    
    // Kategori sayfasındaki ürünleri güncelle
    if (categoryProductsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            loadCategoryProducts(category);
        }
    }
});

// Sepet checkout kontrolü
function checkoutControl() {
    // Kullanıcı giriş yapmış mı kontrol et
    if (!isLoggedIn) {
        showToast('Ödeme yapmak için giriş yapmanız gerekmektedir!', 'error');
        // Giriş yapıldıktan sonra checkout'a yönlendirmek için session'a bilgi ekle
        sessionStorage.setItem('redirect-to-checkout', 'true');
        // Giriş modalını göster
        toggleModal('login-modal');
        return false;
    }
    
    // Kurumsal hesap kontrolü
    if (userType === 'corporate') {
        showToast('Kurumsal hesaplar ödeme işlemi yapamaz!', 'error');
        return false;
    }
    
    // Sepet boş mu kontrol et
    if (cart.length === 0) {
        showToast('Sepetiniz boş!', 'error');
        return false;
    }
    
    // Her şey uygunsa ödeme sayfasına yönlendir
    window.location.href = 'checkout.html';
    return true;
}

function removeFromWishlist(productId) {
    const product = findProductById(productId);
    if (!product) return;
    
    // Remove item from wishlist
    wishlist = wishlist.filter(id => id !== productId);
    
    // Save wishlist to local storage
    saveWishlistToStorage();
    
    // Update wishlist UI
    updateWishlistUI();
    
    // Update wishlist icons - yeni
    updateWishlistIcons();
    
    // Show success message
    showToast(`${product.name} istek listesinden kaldırıldı!`, 'success');
}

function updateWishlistUI() {
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    if (!wishlistItemsContainer) return;
    
    wishlistItemsContainer.innerHTML = '';
    
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<p>İstek listenizde ürün bulunmamaktadır.</p>';
        return;
    }
    
    wishlist.forEach(productId => {
        const product = findProductById(productId);
        if (!product) return;
        
        const wishlistItemElement = document.createElement('div');
        wishlistItemElement.className = 'wishlist-item';
        wishlistItemElement.innerHTML = `
            <div class="wishlist-item-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="wishlist-item-info">
                <div class="wishlist-item-title">${product.name}</div>
                <div class="wishlist-item-price">${formatPrice(product.price)}</div>
                <div>
                    <button class="wishlist-item-add-cart" data-id="${product.id}">Sepete Ekle</button>
                    <button class="wishlist-item-remove" data-id="${product.id}">Kaldır</button>
                </div>
            </div>
        `;
        
        wishlistItemsContainer.appendChild(wishlistItemElement);
    });
    
    // Add event listeners to wishlist items
    document.querySelectorAll('.wishlist-item-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId, 1);
        });
    });
    
    document.querySelectorAll('.wishlist-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromWishlist(productId);
        });
    });
}

// İstek listesi ikonlarını güncelleyen yeni fonksiyon
function updateWishlistIcons() {
    // Ürün kartlarındaki istek listesi butonlarını güncelle
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        const productId = parseInt(button.getAttribute('data-id'));
        
        // İkon değiştirme
        if (wishlist.includes(productId)) {
            // Dolu kalp ikonu
            button.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            // Boş kalp ikonu
            button.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
    
    // Ürün detay sayfasındaki istek listesi butonunu güncelle
    const detailWishlistBtn = document.getElementById('add-to-wishlist-detail');
    if (detailWishlistBtn) {
        const productId = parseInt(detailWishlistBtn.getAttribute('data-id'));
        
        if (wishlist.includes(productId)) {
            detailWishlistBtn.innerHTML = '<i class="fas fa-heart"></i> İstek Listesinden Çıkar';
            detailWishlistBtn.classList.add('in-wishlist');
            
            // Event listener'ı güncelle
            detailWishlistBtn.onclick = function() {
                removeFromWishlist(productId);
                updateWishlistIcons();
            };
        } else {
            detailWishlistBtn.innerHTML = '<i class="far fa-heart"></i> İstek Listesine Ekle';
            detailWishlistBtn.classList.remove('in-wishlist');
            
            // Event listener'ı güncelle
            detailWishlistBtn.onclick = function() {
                addToWishlist(productId);
                updateWishlistIcons();
            };
        }
    }
}

// Load products to container
function loadProductsToContainer(productsList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    productsList.forEach(product => {
        // İstek listesinde olup olmadığını kontrol et
        const isInWishlist = wishlist.includes(product.id);
        const heartIcon = isInWishlist ? 'fas' : 'far'; // Dolu veya boş kalp
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Sepete Ekle</button>
                    <button class="add-to-wishlist" data-id="${product.id}"><i class="${heartIcon} fa-heart"></i></button>
                </div>
            </div>
        `;
        
        container.appendChild(productCard);
        
        // Make the product card clickable
        productCard.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart') && 
                !e.target.classList.contains('add-to-wishlist') && 
                !e.target.closest('.add-to-wishlist')) {
                window.location.href = `product-detail.html?id=${product.id}`;
            }
        });
    });
    
    // Add event listeners to product actions
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId, 1);
        });
    });
    
    container.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.getAttribute('data-id'));
            
            if (wishlist.includes(productId)) {
                removeFromWishlist(productId);
            } else {
                addToWishlist(productId);
            }
        });
    });
}

// Authentication functions
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Gerçek bir uygulamada, kimlik bilgileri sunucuyla doğrulanacak
    // Bu örnekte, yerel depolamada saklanan kullanıcı bilgilerini kontrol edeceğiz
    
    const users = JSON.parse(localStorage.getItem('dsshop-users')) || [];
    const user = users.find(u => u.email === email);
    
    if (user && user.password === password) {
        // Başarılı giriş
        
        // Anonim sepeti temizle
        localStorage.removeItem('dsshop-anonymous-cart');
        
        // Oturumu ayarla
        setLoginStatus(true, user.userType, email);
        closeModal('login-modal');
        showToast('Başarıyla giriş yaptınız!', 'success');
        
        // Giriş yaptıktan sonra kullanıcı adını header'a ekle
        updateUserHeader(user.name);
        
        // Kullanıcıya özel sepet ve istek listesini yükle
        loadCartFromStorage();
        loadWishlistFromStorage();
        
        // Eğer checkout'a yönlendirme varsa
        if (sessionStorage.getItem('redirect-to-checkout') === 'true') {
            sessionStorage.removeItem('redirect-to-checkout');
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            }
        }
    } else {
        showToast('E-posta veya şifre hatalı!', 'error');
    }
}

// script.js dosyasındaki handleRegister fonksiyonunu güncellemek için
function handleRegister() {
    const name = document.getElementById('register-name').value;
    const surname = document.getElementById('register-surname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    const userType = document.querySelector('input[name="register-user-type"]:checked').value;
    
    // Validate password match
    if (password !== passwordConfirm) {
        showToast('Şifreler eşleşmiyor!', 'error');
        return;
    }
    
    // Check if email is already registered
    const users = JSON.parse(localStorage.getItem('dsshop-users')) || [];
    if (users.some(user => user.email === email)) {
        showToast('Bu e-posta adresi zaten kayıtlı!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        name,
        surname,
        email,
        password,
        userType,
        cart: [], // Kullanıcıya özel boş sepet
        wishlist: [], // Kullanıcıya özel boş istek listesi
        orders: [], // Kullanıcıya özel boş sipariş geçmişi
        // Ek kullanıcı bilgileri
        registrationDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString()
    };
    
    // Add user to storage
    users.push(newUser);
    localStorage.setItem('dsshop-users', JSON.stringify(users));
    
    // Log in the new user
    setLoginStatus(true, userType, email);
    closeModal('register-modal');
    showToast('Hesabınız başarıyla oluşturuldu!', 'success');
    
    // Giriş yaptıktan sonra kullanıcı adını header'a ekle
    updateUserHeader(name);
    
    // Yeni kullanıcı olduğu için sepet ve istek listesi boş olacak
    cart = [];
    wishlist = [];
    updateCartUI();
    updateWishlistUI();
    updateWishlistIcons();
}
function handleForgotPassword() {
    const email = document.getElementById('forgot-email').value;
    
    // In a real application, this would send a password reset email
    // For now, we'll just simulate a successful request
    
    closeModal('forgot-modal');
    showToast('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!', 'success');
}

// Çıkış yapma işlemi için yeni fonksiyon
function handleLogout() {
    // Kullanıcı verilerini kaydet ve çıkış yap
    saveCartToStorage();
    saveWishlistToStorage();
    
    // Oturum durumunu güncelle
    setLoginStatus(false);
    
    // Kullanıcı tipini sıfırla
    userType = 'personal';
    localStorage.removeItem('dsshop-usertype');
    
    // Kullanıcı bilgilerini sıfırla
    currentUserEmail = '';
    localStorage.removeItem('dsshop-email');
    
    // Kullanıcı adını headerdan kaldır
    updateUserHeader('');
    
    // Sepet ve istek listesini temizle
    cart = [];
    wishlist = [];
    updateCartUI();
    updateWishlistUI();
    updateWishlistIcons();
    
    // Ana sayfaya yönlendir
   // Ana sayfaya yönlendir
   window.location.href = 'index.html';
    
   // Çıkış mesajı göster
   showToast('Başarıyla çıkış yaptınız!', 'success');
}

function checkLoginStatus() {
   // Check if user is logged in (from localStorage)
   const loginStatus = localStorage.getItem('dsshop-login');
   const storedUserType = localStorage.getItem('dsshop-usertype');
   const userName = localStorage.getItem('dsshop-username');
   const storedEmail = localStorage.getItem('dsshop-email');
   
   if (loginStatus === 'true' && storedEmail) {
       currentUserEmail = storedEmail;
       setLoginStatus(true, storedUserType || 'personal', storedEmail);
       
       // Giriş yapmış kullanıcının adını header'a ekle
       if (userName) {
           updateUserHeader(userName);
       }
   }
}

function setLoginStatus(status, type = 'personal', email = '') {
    isLoggedIn = status;
    userType = type;
    
    localStorage.setItem('dsshop-login', status.toString());
    localStorage.setItem('dsshop-usertype', type);
    
    if (status) {
        // Giriş yapılıyorsa, kullanıcı e-postasını kaydet
        currentUserEmail = email;
        localStorage.setItem('dsshop-email', email);
    } else {
        // Çıkış yapılıyorsa, kullanıcı e-postasını temizle
        currentUserEmail = '';
        localStorage.removeItem('dsshop-email');
    }
    
    // Update login button text
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.textContent = isLoggedIn ? 'Hesabım' : 'Giriş Yap';
    }
    
    // Kullanıcı paneli bağlantısını güncelle
    const userActionsContainer = document.querySelector('.user-actions');
    if (userActionsContainer && isLoggedIn) {
        // Çıkış yapma bağlantısı ekle
        if (!document.querySelector('.logout-link')) {
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.className = 'logout-link';
            logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Çıkış Yap';
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
            userActionsContainer.appendChild(logoutLink);
        }
        
        // Kurumsal hesaplar için sepet ve istek listesi butonlarını gizle/göster
        const wishlistToggle = document.getElementById('toggle-wishlist');
        const cartToggle = document.getElementById('toggle-cart');
        
        if (wishlistToggle && cartToggle) {
            if (type === 'corporate') {
                // Kurumsal hesap için gizle
                wishlistToggle.style.display = 'none';
                cartToggle.style.display = 'none';
            } else {
                // Bireysel hesap için göster
                wishlistToggle.style.display = '';
                cartToggle.style.display = '';
            }
        }
    } else if (userActionsContainer) {
        // Çıkış yapma bağlantısını kaldır
        const logoutLink = document.querySelector('.logout-link');
        if (logoutLink) {
            logoutLink.remove();
        }
        
        // Sepet ve istek listesi butonlarını göster
        const wishlistToggle = document.getElementById('toggle-wishlist');
        const cartToggle = document.getElementById('toggle-cart');
        
        if (wishlistToggle && cartToggle) {
            wishlistToggle.style.display = '';
            cartToggle.style.display = '';
        }
    }
}

// Kullanıcı adını header'a ekleyen yeni fonksiyon
function updateUserHeader(userName) {
   if (userName) {
       localStorage.setItem('dsshop-username', userName);
       
       const loginBtn = document.getElementById('login-btn');
       if (loginBtn) {
           loginBtn.innerHTML = `<i class="fas fa-user"></i> ${userName}`;
       }
   } else {
       localStorage.removeItem('dsshop-username');
       
       const loginBtn = document.getElementById('login-btn');
       if (loginBtn) {
           loginBtn.innerHTML = 'Giriş Yap';
       }
   }
}

// Modal functions
function toggleModal(modalName, newModalName = null) {
   const modal = document.getElementById(modalName);
   const overlay = document.getElementById('overlay');
   
   if (!modal || !overlay) return;
   
   // If a new modal is specified, close the current one and open the new one
   if (newModalName) {
       closeModal(modalName);
       openModal(newModalName);
       return;
   }
   
   // Otherwise toggle the current modal
   if (modalName === 'cart-modal' || modalName === 'wishlist-modal') {
       if (modal.classList.contains('show')) {
           closeModal(modalName);
       } else {
           openModal(modalName);
       }
   } else {
       if (modal.style.display === 'flex') {
           closeModal(modalName);
       } else {
           openModal(modalName);
       }
   }
}

function openModal(modalName) {
   const modal = document.getElementById(modalName);
   const overlay = document.getElementById('overlay');
   
   if (!modal || !overlay) return;
   
   if (modalName === 'cart-modal' || modalName === 'wishlist-modal') {
       modal.classList.add('show');
   } else {
       modal.style.display = 'flex';
   }
   
   overlay.style.display = 'block';
   
   // Update content if needed
   if (modalName === 'cart-modal') {
       updateCartUI();
   } else if (modalName === 'wishlist-modal') {
       updateWishlistUI();
   }
}

function closeModal(modalName) {
   const modal = document.getElementById(modalName);
   const overlay = document.getElementById('overlay');
   
   if (!modal) return;
   
   if (modalName === 'cart-modal' || modalName === 'wishlist-modal') {
       modal.classList.remove('show');
   } else {
       modal.style.display = 'none';
   }
   
   // Only hide overlay if all modals are closed
   if (overlay && !isAnyModalOpen()) {
       overlay.style.display = 'none';
   }
}
function closeAllModals() {
   // Close cart and wishlist sidebars
   const cartModal = document.getElementById('cart-modal');
   const wishlistModal = document.getElementById('wishlist-modal');
   
   if (cartModal) cartModal.classList.remove('show');
   if (wishlistModal) wishlistModal.classList.remove('show');
   
   // Close login, register, and forgot password modals
   const loginModal = document.getElementById('login-modal');
   const registerModal = document.getElementById('register-modal');
   const forgotModal = document.getElementById('forgot-modal');
   
   if (loginModal) loginModal.style.display = 'none';
   if (registerModal) registerModal.style.display = 'none';
   if (forgotModal) forgotModal.style.display = 'none';
   
   // Hide overlay
   const overlay = document.getElementById('overlay');
   if (overlay) overlay.style.display = 'none';
}

function isAnyModalOpen() {
   // Check cart and wishlist sidebars
   const cartModal = document.getElementById('cart-modal');
   const wishlistModal = document.getElementById('wishlist-modal');
   
   if (cartModal && cartModal.classList.contains('show')) return true;
   if (wishlistModal && wishlistModal.classList.contains('show')) return true;
   
   // Check login, register, and forgot password modals
   const loginModal = document.getElementById('login-modal');
   const registerModal = document.getElementById('register-modal');
   const forgotModal = document.getElementById('forgot-modal');
   
   if (loginModal && loginModal.style.display === 'flex') return true;
   if (registerModal && registerModal.style.display === 'flex') return true;
   if (forgotModal && forgotModal.style.display === 'flex') return true;
   
   return false;
}

// Toast notification
function showToast(message, type = 'success') {
   const toast = document.getElementById('toast');
   const toastMessage = document.getElementById('toast-message');
   
   if (!toast || !toastMessage) return;
   
   toastMessage.textContent = message;
   toast.className = `toast ${type}`;
   toast.classList.add('show');
   
   setTimeout(() => {
       toast.classList.remove('show');
   }, 3000);
}

// Storage functions
// Her kullanıcı için ayrı sepet ve istek listesi saklama fonksiyonları
// Storage functions
// Her kullanıcı için ayrı sepet ve istek listesi saklama fonksiyonları
function saveCartToStorage() {
    if (!isLoggedIn || !currentUserEmail) {
        // Eğer giriş yapılmadıysa, sepeti anonim olarak kaydet
        localStorage.setItem('dsshop-anonymous-cart', JSON.stringify(cart));
        return;
    }
    
    // Kullanıcılar verisini al
    const users = JSON.parse(localStorage.getItem('dsshop-users')) || [];
    const userIndex = users.findIndex(user => user.email === currentUserEmail);
    
    if (userIndex !== -1) {
        // Kullanıcı bulundu, sepeti güncelle
        users[userIndex].cart = cart;
        localStorage.setItem('dsshop-users', JSON.stringify(users));
    }
}

function loadCartFromStorage() {
    if (!isLoggedIn || !currentUserEmail) {
        // Giriş yapılmadıysa anonim sepeti yükle
        const anonCart = localStorage.getItem('dsshop-anonymous-cart');
        if (anonCart) {
            cart = JSON.parse(anonCart);
        } else {
            cart = [];
        }
        updateCartUI();
        return;
    }
    
    // Kullanıcılar verisini al
    const users = JSON.parse(localStorage.getItem('dsshop-users')) || [];
    const user = users.find(user => user.email === currentUserEmail);
    
    if (user && user.cart) {
        // Kullanıcı sepetini yükle
        cart = user.cart;
    } else {
        // Sepet bulunamadı, boş sepet oluştur
        cart = [];
    }
    
    updateCartUI();
}

function saveWishlistToStorage() {
   if (!isLoggedIn || !currentUserEmail) {
       // Eğer giriş yapılmadıysa, istek listesini yerel olarak kaydetme
       wishlist = [];
       return;
   }
   
   // Kullanıcılar verisini al
   const users = JSON.parse(localStorage.getItem('dsshop-users')) || [];
   const userIndex = users.findIndex(user => user.email === currentUserEmail);
   
   if (userIndex !== -1) {
       // Kullanıcı bulundu, istek listesini güncelle
       users[userIndex].wishlist = wishlist;
       localStorage.setItem('dsshop-users', JSON.stringify(users));
   }
}

function loadWishlistFromStorage() {
   if (!isLoggedIn || !currentUserEmail) {
       // Giriş yapılmadıysa boş istek listesi
       wishlist = [];
       updateWishlistUI();
       updateWishlistIcons();
       return;
   }
   
   // Kullanıcılar verisini al
   const users = JSON.parse(localStorage.getItem('dsshop-users')) || [];
   const user = users.find(user => user.email === currentUserEmail);
   
   if (user && user.wishlist) {
       // Kullanıcı istek listesini yükle
       wishlist = user.wishlist;
   } else {
       // İstek listesi bulunamadı, boş liste oluştur
       wishlist = [];
   }
   
   updateWishlistUI();
   updateWishlistIcons();
}

// Helper functions
function findProductById(id) {
   return products.find(product => product.id === id);
}z

function formatPrice(price) {
   return price.toFixed(2).replace('.', ',') + ' ₺';
}

function getCategoryName(category) {
   const categoryNames = {
       'elektronik': 'Elektronik',
       'giyim': 'Giyim',
       'ev-yasam': 'Ev & Yaşam',
       'kozmetik': 'Kozmetik',
       'kitap': 'Kitap, Müzik, Film'
   };
   
   return categoryNames[category] || 'Kategori';
}

// Arama fonksiyonu
function searchProducts(query) {
   if (!query) return [];
   
   query = query.toLowerCase();
   
   return products.filter(product => {
       const nameMatch = product.name.toLowerCase().includes(query);
       const descMatch = product.description.toLowerCase().includes(query);
       const categoryMatch = getCategoryName(product.category).toLowerCase().includes(query);
       
       return nameMatch || descMatch || categoryMatch;
   });
}

// Admin panel kontrolü
function checkAdminAccess() {
   const adminPages = ['admin-panel.html', 'admin-products.html', 'admin-add-product.html', 'admin-edit-product.html'];
   const currentPage = window.location.pathname;
   
   // Eğer admin sayfalarından birindeysek ve giriş yapılmamışsa veya kurumsal hesap değilse
   const isAdminPage = adminPages.some(page => currentPage.includes(page));
   
   if (isAdminPage && (!isLoggedIn || userType !== 'corporate')) {
       showToast('Bu sayfaya erişim için kurumsal hesap gerekiyor!', 'error');
       setTimeout(() => {
           window.location.href = 'index.html';
       }, 2000);
       return false;
   }
   return true;
}

// Hesap sayfasına erişim kontrolü
function checkAccountAccess() {
   if (isLoggedIn && userType === 'corporate' && window.location.pathname.includes('account.html')) {
       showToast('Kurumsal hesaplar için hesap sayfası yerine yönetici paneli kullanılabilir!', 'error');
       setTimeout(() => {
           window.location.href = 'admin-panel.html';
       }, 2000);
       return false;
   }
   return true;
}

// Checkout sayfasına giriş kontrolü
function checkCheckoutAccess() {
   if (!isLoggedIn && window.location.pathname.includes('checkout.html')) {
       showToast('Ödeme yapmak için giriş yapmanız gerekmektedir!', 'error');
       setTimeout(() => {
           window.location.href = 'index.html';
       }, 2000);
       return false;
   }
   return true;
}

// Kullanıcı sepet ve istek listesini sıfırlama fonksiyonu
function resetUserCartAndWishlist() {
   cart = [];
   wishlist = [];
   updateCartUI();
   updateWishlistUI();
   updateWishlistIcons();
   
}