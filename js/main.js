// ========================================
// BRAHMINS PICKLES & POWDERS - LIQUID GLASS JS
// ========================================

// Initialize theme immediately to prevent flash
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

class LiquidGlassWebsite {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('brahmin_cart')) || [];
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupThemeToggle();
        this.setupScrollReveal();
        this.setupSmoothScrolling();
        this.setupLiquidEffects();
        this.setupNavigation();
        this.initializeAnimations();
        this.setupCartFunctionality();
        this.setupAdvancedCart();
        this.setupCategoryManagement();
        this.setupMobileCategories();
        this.updateCartDisplay();
        this.updateAllQuantityDisplays();
        this.setupSimpleScrolling();
        this.setupStickyNavigation();
    }

    // Enhanced Sticky Navigation with Mobile Menu Auto-Hide
    setupStickyNavigation() {
        const nav = document.querySelector('nav');
        const mobileNavMenu = document.getElementById('mobileNavMenu');
        if (!nav) return;

        let lastScrollY = window.scrollY;
        let isScrollingDown = false;
        let scrollTimeout;
        let scrollStartY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add scroll effect class
            if (currentScrollY > 20) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }

            // Track scroll direction
            isScrollingDown = currentScrollY > lastScrollY;
            
            // Auto-hide mobile menu on scroll (only if menu is open)
            if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
                // Clear previous timeout
                clearTimeout(scrollTimeout);
                
                // Add scroll detection class for smooth animation
                mobileNavMenu.classList.add('scroll-hiding');
                
                // Calculate scroll distance from start
                const scrollDistance = Math.abs(currentScrollY - scrollStartY);
                
                // Set timeout to hide menu after scroll stops
                scrollTimeout = setTimeout(() => {
                    // Hide if user scrolled more than 30px or is scrolling fast
                    if (scrollDistance > 30 || Math.abs(currentScrollY - lastScrollY) > 15) {
                        this.closeMobileMenuWithAnimation();
                        scrollStartY = currentScrollY; // Reset scroll start point
                    }
                    mobileNavMenu.classList.remove('scroll-hiding');
                }, 200); // Reduced timeout for more responsive feel
            } else {
                // Reset scroll start point when menu is closed
                scrollStartY = currentScrollY;
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // Simplified Scrolling Enhancement
    setupSimpleScrolling() {
        // Enable momentum scrolling on iOS
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Simple scroll optimization
        let scrollTimer;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                // Scroll ended - do nothing heavy here
            }, 150);
        }, { passive: true });
    }

    // Simplified Loading Screen
    setupLoadingScreen() {
        // Simple loading screen without heavy transitions
        const loadingScreen = document.getElementById('loadingScreen');
        
        // Add click handlers to navigation links
        const navLinks = document.querySelectorAll('.nav-links a, .logo-container, .mobile-nav-links a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Only show loading for links that navigate to other pages
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    this.showLoadingScreen();
                    
                    // Hide loading after short time
                    setTimeout(() => {
                        this.hideLoadingScreen();
                    }, 1000);
                }
            });
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
        }
    }

    // Product Popup Functionality
    setupProductPopup() {
        const popup = document.getElementById('productPopup');
        const closeBtn = document.getElementById('closePopup');
        const productCards = document.querySelectorAll('.clickable-product');
        
        if (!popup) return;

        // Open popup when clicking on product cards
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const productName = card.getAttribute('data-product-name');
                const productType = card.getAttribute('data-product-type');
                
                this.openProductPopup(productName, productType);
            });
        });

        // Close popup
        closeBtn?.addEventListener('click', () => this.closeProductPopup());
        popup.addEventListener('click', (e) => {
            if (e.target === popup) this.closeProductPopup();
        });

        // Setup quantity controls in popup
        this.setupPopupQuantityControls();
    }

    openProductPopup(productName, productType) {
        const popup = document.getElementById('productPopup');
        const productNameEl = document.getElementById('popupProductName');
        
        if (productNameEl) productNameEl.textContent = productName;
        popup.classList.add('active');
        
        // Prevent body scrolling on mobile
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.width = '100%';
        
        // Show/hide appropriate variants based on product type
        const pickleVariants = popup.querySelectorAll('.variant-option:not(.powder-variant)');
        const powderVariants = popup.querySelectorAll('.variant-option.powder-variant');
        
        if (productType === 'powder') {
            pickleVariants.forEach(v => v.style.display = 'none');
            powderVariants.forEach(v => v.style.display = 'flex');
        } else {
            pickleVariants.forEach(v => v.style.display = 'flex');
            powderVariants.forEach(v => v.style.display = 'none');
        }
        
        // Reset quantities
        const quantityInputs = popup.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => input.value = '0');
        
        // Store current product info
        popup.setAttribute('data-current-product', productName);
        popup.setAttribute('data-current-type', productType);
        
        this.updateAddToCartButton();
    }

    closeProductPopup() {
        const popup = document.getElementById('productPopup');
        popup.classList.remove('active');
        
        // Restore body scrolling
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    setupPopupQuantityControls() {
        const popup = document.getElementById('productPopup');
        if (!popup) return;

        const variantOptions = popup.querySelectorAll('.variant-option');
        
        variantOptions.forEach(option => {
            const minusBtn = option.querySelector('.minus');
            const plusBtn = option.querySelector('.plus');
            const quantityInput = option.querySelector('.quantity-input');
            
            if (!quantityInput) return;
            
            // Input change event
            quantityInput.addEventListener('input', (e) => {
                const newQty = Math.max(0, Math.min(999, parseInt(e.target.value) || 0));
                e.target.value = newQty;
                this.updateAddToCartButton();
            });
            
            minusBtn?.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value) || 0;
                if (quantity > 0) {
                    quantity--;
                    quantityInput.value = quantity;
                    this.updateAddToCartButton();
                }
            });
            
            plusBtn?.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value) || 0;
                quantity++;
                quantityInput.value = quantity;
                this.updateAddToCartButton();
            });
        });

        // Add to cart button
        const addToCartBtn = document.getElementById('addToCartBtn');
        addToCartBtn?.addEventListener('click', () => this.addToCartFromPopup());
    }

    updateAddToCartButton() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        const popup = document.getElementById('productPopup');
        
        if (!addToCartBtn || !popup) return;
        
        const quantityInputs = popup.querySelectorAll('.quantity-input');
        let hasItems = false;
        
        quantityInputs.forEach(input => {
            if (parseInt(input.value || 0) > 0) hasItems = true;
        });
        
        addToCartBtn.disabled = !hasItems;
        addToCartBtn.textContent = hasItems ? 'Add to Cart' : 'Select Quantity';
    }

    addToCartFromPopup() {
        const popup = document.getElementById('productPopup');
        const productName = popup.getAttribute('data-current-product');
        const productType = popup.getAttribute('data-current-type');
        
        const variantOptions = popup.querySelectorAll('.variant-option');
        
        variantOptions.forEach(option => {
            const quantityInput = option.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput ? quantityInput.value : 0);
            if (quantity > 0) {
                const weight = option.getAttribute('data-weight');
                const price = parseInt(option.getAttribute('data-price'));
                
                this.addToCart({
                    name: productName,
                    type: productType,
                    weight: weight + 'gm',
                    price: price,
                    quantity: quantity,
                    id: `${productName}_${weight}gm`
                });
            }
        });
        
        this.closeProductPopup();
        this.showAddToCartNotification();
    }

    // Cart Functionality
    setupCartFunctionality() {
        // Setup cart page if we're on it
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
            this.setupCartPageControls();
        }
    }

    addToCart(item) {
        const existingIndex = this.cart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingIndex >= 0) {
            this.cart[existingIndex].quantity += item.quantity;
        } else {
            this.cart.push(item);
        }
        
        this.saveCart();
        this.updateCartDisplay();
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }

    updateCartItemQuantity(itemId, newQuantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
                if (window.location.pathname.includes('cart.html')) {
                    this.renderCartPage();
                }
            }
        }
    }

    saveCart() {
        localStorage.setItem('brahmin_cart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        const cartCountElements = document.querySelectorAll('#cartCount, #mobileCartCount, #stickyCartCount, .cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(el => {
            if (el) el.textContent = totalItems;
        });
        
        // Update product page quantity displays
        this.updateAllQuantityDisplays();
    }

    renderCartPage() {
        const cartContainer = document.getElementById('cartContainer');
        const emptyMessage = document.getElementById('emptyCartMessage');
        const cartSummary = document.getElementById('cartSummary');
        
        if (!cartContainer) return;
        
        if (this.cart.length === 0) {
            cartContainer.innerHTML = '';
            emptyMessage?.style.setProperty('display', 'block');
            cartSummary?.style.setProperty('display', 'none');
            return;
        }
        
        emptyMessage?.style.setProperty('display', 'none');
        cartSummary?.style.setProperty('display', 'block');
        
        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-info">
                    <h3 title="${item.name}">${item.name}</h3>
                    <div class="cart-item-details">
                        <span class="cart-item-size">${item.weight}</span>
                        <span class="cart-item-price">₹${item.price} each</span>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus" onclick="website.updateCartItemQuantity('${item.id}', ${item.quantity - 1})" title="Decrease quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn plus" onclick="website.updateCartItemQuantity('${item.id}', ${item.quantity + 1})" title="Increase quantity">+</button>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-total">₹${item.price * item.quantity}</div>
                    <button class="cart-item-remove" onclick="website.removeFromCart('${item.id}')" title="Remove item">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
        
        this.updateCartSummary();
    }

    updateCartSummary() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const totalItemsEl = document.getElementById('totalItems');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        
        if (totalItemsEl) totalItemsEl.textContent = totalItems;
        if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
        if (totalEl) totalEl.textContent = `₹${subtotal}`;
    }

    setupCartPageControls() {
        const clearCartBtn = document.getElementById('clearCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        clearCartBtn?.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                this.cart = [];
                this.saveCart();
                this.updateCartDisplay();
                this.renderCartPage();
            }
        });
        
        checkoutBtn?.addEventListener('click', () => this.showOrderModal());
    }

    showOrderModal() {
        const orderModal = document.getElementById('orderModal');
        const closeBtn = document.getElementById('closeOrderModal');
        const customerForm = document.getElementById('customerDetailsForm');
        const deliverySelect = document.getElementById('deliveryTiming');
        const customTimeGroup = document.getElementById('customTimeGroup');
        
        if (orderModal) {
            orderModal.classList.add('active');
            
            // Clear any existing event listeners by cloning elements
            if (customerForm) {
                const newForm = customerForm.cloneNode(true);
                customerForm.parentNode.replaceChild(newForm, customerForm);
                
                // Add form submission handler
                newForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleWhatsAppOrder();
                });
            }
            
            // Handle delivery timing selection
            if (deliverySelect) {
                deliverySelect.addEventListener('change', () => {
                    if (deliverySelect.value === 'Custom') {
                        customTimeGroup.style.display = 'block';
                    } else {
                        customTimeGroup.style.display = 'none';
                    }
                });
            }
            
            // Handle close button
            if (closeBtn) {
                const newCloseBtn = closeBtn.cloneNode(true);
                closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
                
                newCloseBtn.addEventListener('click', () => {
                    orderModal.classList.remove('active');
                });
            }
        }
    }



    handleWhatsAppOrder() {
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const address = document.getElementById('customerAddress').value.trim();
        const deliverySelect = document.getElementById('deliveryTiming');
        const customTime = document.getElementById('customTime').value.trim();
        
        // Validation
        if (!name || !phone || !address) {
            alert('Please fill in all required fields (Name, Phone, Address)');
            return;
        }
        
        // Get delivery timing
        let timing = deliverySelect.value;
        if (timing === 'Custom' && customTime) {
            timing = customTime;
        } else if (timing === 'Custom') {
            alert('Please specify your preferred delivery time');
            return;
        }
        
        // Generate order summary
        const orderSummary = this.generateOrderSummary();
        
        // Create WhatsApp message
        const whatsappMessage = this.createWhatsAppMessage(name, phone, address, orderSummary, timing);
        
        // Open WhatsApp
        const whatsappNumber = '919182002644'; // WhatsApp number with country code
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappURL, '_blank');
        
        // Clear cart and close modal
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        this.renderCartPage();
        
        // Close modal
        document.getElementById('orderModal').classList.remove('active');
        
        // Show confirmation
        this.showWhatsAppConfirmation();
    }

    generateOrderSummary() {
        let summary = '';
        let total = 0;
        
        this.cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            summary += `${index + 1}. ${item.name} x ${item.quantity} = ₹${itemTotal}\n`;
        });
        
        summary += `\nTotal Amount: ₹${total}`;
        return summary;
    }

    createWhatsAppMessage(name, phone, address, orderSummary, timing) {
        const message = `🛒 *NEW ORDER - BRAHMINS PICKLES & POWDERS*

📝 *ORDER DETAILS:*
1️⃣ *Name:* ${name}
2️⃣ *Phone Number:* ${phone}
3️⃣ *Address:* ${address}
4️⃣ *Order:*
${orderSummary}
5️⃣ *Timing:* ${timing}

📋 *ORDER RECEIPT*
━━━━━━━━━━━━━━━━━━━━━
*Brahmins Pickles & Powders*
"Authentic Indian Delicacies"
━━━━━━━━━━━━━━━━━━━━━

⏰ *Please confirm this order within 15 minutes*

Thank you for choosing us! 🙏`;

        return message;
    }

    showWhatsAppConfirmation() {
        // Create a confirmation notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--accent-color);
            color: var(--text-primary);
            padding: 2rem;
            border-radius: 15px;
            z-index: 99999;
            box-shadow: var(--glass-shadow);
            backdrop-filter: var(--backdrop-blur);
            text-align: center;
            max-width: 400px;
            width: 90%;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
            <h3 style="margin-bottom: 1rem;">Order Sent to WhatsApp!</h3>
            <p style="margin-bottom: 1.5rem; opacity: 0.9;">
                Your order has been sent via WhatsApp. Please wait for confirmation within 15 minutes.
            </p>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                color: inherit;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
            ">OK</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    showAddToCartNotification() {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-color);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 99999;
            box-shadow: var(--glass-shadow);
            backdrop-filter: var(--backdrop-blur);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = '✅ Added to cart!';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Advanced Cart System
    setupAdvancedCart() {
        // Setup quantity controls for chapathis and powders
        const quantityControls = document.querySelectorAll('.quantity-controls');
        quantityControls.forEach(control => {
            const productCard = control.closest('.product-card');
            const minusBtn = control.querySelector('.quantity-btn.minus');
            const plusBtn = control.querySelector('.quantity-btn.plus');
            const input = control.querySelector('.quantity-input');
            
            if (!productCard || !input) return;
            
            const productName = productCard.getAttribute('data-product-name');
            const productType = productCard.getAttribute('data-product-type');
            const productPrice = parseInt(productCard.getAttribute('data-product-price'));
            
            // Update input with current cart quantity
            this.updateQuantityDisplay(control);
            
            // Input change event
            input.addEventListener('input', (e) => {
                let newQty = Math.max(0, Math.min(999, parseInt(e.target.value) || 0));
                
                // Check chapathi minimum quantity requirement
                if (productType === 'chapathi' && newQty > 0 && newQty < 5) {
                    newQty = 5;
                    e.target.value = newQty;
                    this.showMinimumOrderNotification();
                } else {
                    e.target.value = newQty;
                }
                
                this.updateCartQuantity(productName, productType, newQty, productPrice);
                this.updateQuantityDisplay(control);
            });
            
            // Plus button event
            plusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.increaseQuantity({
                    name: productName,
                    type: productType,
                    price: productPrice,
                    id: `${productName}_single`,
                    weight: productType === 'powder' ? '1kg' : '1pc'
                }, control);
            });
            
            // Minus button event
            minusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.decreaseQuantity(`${productName}_single`, control);
            });
        });

        // Setup pickle variant buttons - show inline variants instead of popup
        const pickleButtons = document.querySelectorAll('.pickle-variant');
        pickleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = btn.closest('.product-card');
                const inlineVariants = productCard.querySelector('.inline-variants');
                
                // Toggle variants display
                if (inlineVariants.style.display === 'none' || !inlineVariants.style.display) {
                    inlineVariants.style.display = 'block';
                    btn.querySelector('.plus-icon').textContent = '×';
                    // Reinitialize controls for this specific product
                    this.setupControlsForVariants(productCard);
                } else {
                    inlineVariants.style.display = 'none';
                    btn.querySelector('.plus-icon').textContent = '+';
                }
            });
        });
        
        // Setup powder variant buttons - show inline variants instead of popup
        const powderButtons = document.querySelectorAll('.powder-variant');
        powderButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = btn.closest('.product-card');
                const inlineVariants = productCard.querySelector('.inline-variants');
                
                // Toggle variants display
                if (inlineVariants.style.display === 'none' || !inlineVariants.style.display) {
                    inlineVariants.style.display = 'block';
                    btn.querySelector('.plus-icon').textContent = '×';
                    // Reinitialize controls for this specific product
                    this.setupControlsForVariants(productCard);
                } else {
                    inlineVariants.style.display = 'none';
                    btn.querySelector('.plus-icon').textContent = '+';
                }
            });
        });
        
        // Setup inline variant quantity controls
        this.setupInlineVariantControls();
        
        // Setup cart icon click to go to cart.html
        const cartLinks = document.querySelectorAll('.cart-link');
        cartLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Always go to cart.html page
                // The href is already set to cart.html, so no need to prevent default
            });
        });
    }

    setupInlineVariantControls() {
        // Remove any existing event listeners first
        const variantOptions = document.querySelectorAll('.variant-option');
        
        variantOptions.forEach(option => {
            const productCard = option.closest('.product-card');
            const productName = productCard.getAttribute('data-product-name');
            const productType = productCard.getAttribute('data-product-type');
            const weight = option.getAttribute('data-weight');
            const price = parseInt(option.getAttribute('data-price'));
            
            const minusBtn = option.querySelector('.quantity-btn.minus');
            const plusBtn = option.querySelector('.quantity-btn.plus');
            const quantityInput = option.querySelector('.quantity-input');
            
            if (!quantityInput || !minusBtn || !plusBtn) return;
            
            const itemId = `${productName}_${weight}`;
            
            // Remove existing event listeners by cloning elements
            const newMinusBtn = minusBtn.cloneNode(true);
            const newPlusBtn = plusBtn.cloneNode(true);
            const newQuantityInput = quantityInput.cloneNode(true);
            
            minusBtn.parentNode.replaceChild(newMinusBtn, minusBtn);
            plusBtn.parentNode.replaceChild(newPlusBtn, plusBtn);
            quantityInput.parentNode.replaceChild(newQuantityInput, quantityInput);
            
            // Input change event
            newQuantityInput.addEventListener('input', (e) => {
                e.stopPropagation();
                const newQty = Math.max(0, Math.min(999, parseInt(e.target.value) || 0));
                e.target.value = newQty;
                this.updateVariantCartQuantity(itemId, productName, productType, weight, price, newQty);
            });
            
            // Minus button - exact one decrement
            newMinusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                let currentQuantity = parseInt(newQuantityInput.value) || 0;
                if (currentQuantity > 0) {
                    currentQuantity = currentQuantity - 1;
                    newQuantityInput.value = currentQuantity;
                    this.updateVariantCartQuantity(itemId, productName, productType, weight, price, currentQuantity);
                }
            });
            
            // Plus button - exact one increment
            newPlusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                let currentQuantity = parseInt(newQuantityInput.value) || 0;
                currentQuantity = currentQuantity + 1;
                newQuantityInput.value = currentQuantity;
                this.updateVariantCartQuantity(itemId, productName, productType, weight, price, currentQuantity);
            });
            
            // Initialize display
            this.updateVariantQuantityDisplayForElement(newQuantityInput, itemId);
        });
    }

    updateVariantQuantityDisplayForElement(quantityInput, itemId) {
        if (!quantityInput) return;
        
        const cartItem = this.cart.find(item => item.id === itemId);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        quantityInput.value = quantity;
    }

    setupControlsForVariants(productCard) {
        // Setup controls for variants within a specific product card
        const variantOptions = productCard.querySelectorAll('.variant-option');
        
        variantOptions.forEach(option => {
            const productName = productCard.getAttribute('data-product-name');
            const productType = productCard.getAttribute('data-product-type');
            const weight = option.getAttribute('data-weight');
            const price = parseInt(option.getAttribute('data-price'));
            
            const minusBtn = option.querySelector('.quantity-btn.minus');
            const plusBtn = option.querySelector('.quantity-btn.plus');
            const quantityInput = option.querySelector('.quantity-input');
            
            if (!quantityInput || !minusBtn || !plusBtn) return;
            
            const itemId = `${productName}_${weight}`;
            
            // Remove existing event listeners by cloning elements
            const newMinusBtn = minusBtn.cloneNode(true);
            const newPlusBtn = plusBtn.cloneNode(true);
            const newQuantityInput = quantityInput.cloneNode(true);
            
            minusBtn.parentNode.replaceChild(newMinusBtn, minusBtn);
            plusBtn.parentNode.replaceChild(newPlusBtn, plusBtn);
            quantityInput.parentNode.replaceChild(newQuantityInput, quantityInput);
            
            // Input change event
            newQuantityInput.addEventListener('input', (e) => {
                e.stopPropagation();
                const newQty = Math.max(0, Math.min(999, parseInt(e.target.value) || 0));
                e.target.value = newQty;
                this.updateVariantCartQuantity(itemId, productName, productType, weight, price, newQty);
                this.updateAddToCartButtonVisibility(productCard);
            });
            
            // Minus button - exact one decrement
            newMinusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                let currentQuantity = parseInt(newQuantityInput.value) || 0;
                if (currentQuantity > 0) {
                    currentQuantity = currentQuantity - 1;
                    newQuantityInput.value = currentQuantity;
                    this.updateVariantCartQuantity(itemId, productName, productType, weight, price, currentQuantity);
                    this.updateAddToCartButtonVisibility(productCard);
                }
            });
            
            // Plus button - exact one increment
            newPlusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                let currentQuantity = parseInt(newQuantityInput.value) || 0;
                currentQuantity = currentQuantity + 1;
                newQuantityInput.value = currentQuantity;
                this.updateVariantCartQuantity(itemId, productName, productType, weight, price, currentQuantity);
                this.updateAddToCartButtonVisibility(productCard);
            });
            
            // Initialize display
            this.updateVariantQuantityDisplayForElement(newQuantityInput, itemId);
        });
        
        // Setup Add to Cart button
        this.setupVariantAddToCartButton(productCard);
        this.updateAddToCartButtonVisibility(productCard);
    }

    setupVariantAddToCartButton(productCard) {
        const addToCartBtn = productCard.querySelector('.variant-cart-btn');
        if (!addToCartBtn) return;
        
        // Remove existing event listener by cloning
        const newAddToCartBtn = addToCartBtn.cloneNode(true);
        addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);
        
        newAddToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.addVariantsToCart(productCard);
        });
    }

    updateAddToCartButtonVisibility(productCard) {
        const addToCartContainer = productCard.querySelector('.variant-add-to-cart');
        const quantityInputs = productCard.querySelectorAll('.variant-option .quantity-input');
        
        if (!addToCartContainer) return;
        
        let totalQuantity = 0;
        quantityInputs.forEach(input => {
            totalQuantity += parseInt(input.value) || 0;
        });
        
        if (totalQuantity > 0) {
            addToCartContainer.style.display = 'block';
            const btn = addToCartContainer.querySelector('.variant-cart-btn');
            if (btn) {
                btn.innerHTML = `<span>🛒</span><span>Add ${totalQuantity} to Cart</span>`;
            }
        } else {
            addToCartContainer.style.display = 'none';
        }
    }

    addVariantsToCart(productCard) {
        const productName = productCard.getAttribute('data-product-name');
        const productType = productCard.getAttribute('data-product-type');
        const variantOptions = productCard.querySelectorAll('.variant-option');
        
        let itemsAdded = 0;
        
        variantOptions.forEach(option => {
            const quantity = parseInt(option.querySelector('.quantity-input').value) || 0;
            if (quantity > 0) {
                const weight = option.getAttribute('data-weight');
                const price = parseInt(option.getAttribute('data-price'));
                
                const item = {
                    id: `${productName}_${weight}`,
                    name: productName,
                    type: productType,
                    weight: weight,
                    price: price,
                    quantity: quantity
                };
                
                // Add to cart
                const existingIndex = this.cart.findIndex(cartItem => cartItem.id === item.id);
                if (existingIndex >= 0) {
                    this.cart[existingIndex] = item;
                } else {
                    this.cart.push(item);
                }
                
                itemsAdded += quantity;
            }
        });
        
        if (itemsAdded > 0) {
            this.saveCart();
            this.updateCartDisplay();
            this.showQuickAddNotification(`${productName} (${itemsAdded} items)`);
            
            // Reset variant quantities to 0
            variantOptions.forEach(option => {
                option.querySelector('.quantity-input').value = '0';
            });
            
            this.updateAddToCartButtonVisibility(productCard);
        }
    }

    updateVariantCartQuantity(itemId, productName, productType, weight, price, quantity) {
        // This function is now mainly for tracking quantities
        // Actual cart updates happen when Add to Cart button is clicked
        // We can keep this simple and not update the main cart immediately
    }

    updateVariantQuantityDisplay(option, itemId) {
        const quantityInput = option.querySelector('.quantity-input');
        if (!quantityInput) return;
        
        const cartItem = this.cart.find(item => item.id === itemId);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        quantityInput.value = quantity;
    }

    increaseQuantity(item, control) {
        const existingIndex = this.cart.findIndex(cartItem => cartItem.id === item.id);
        let newQuantity = existingIndex >= 0 ? this.cart[existingIndex].quantity + 1 : 1;
        
        // Check chapathi minimum quantity requirement
        if (item.type === 'chapathi' && newQuantity < 5) {
            // For chapathis, set minimum to 5
            newQuantity = 5;
            
            // Show notification about minimum order
            this.showMinimumOrderNotification();
        }
        
        if (existingIndex >= 0) {
            this.cart[existingIndex].quantity = newQuantity;
        } else {
            this.cart.push({...item, quantity: newQuantity});
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.updateQuantityDisplay(control);
        this.showQuantityAnimation(control, 'increase');
    }

    decreaseQuantity(itemId, control) {
        const existingIndex = this.cart.findIndex(cartItem => cartItem.id === itemId);
        
        if (existingIndex >= 0) {
            const productCard = control.closest('.product-card');
            const productType = productCard.getAttribute('data-product-type');
            
            // Check chapathi minimum quantity requirement
            if (productType === 'chapathi' && this.cart[existingIndex].quantity <= 5) {
                // For chapathis, minimum is 5, so remove from cart entirely
                this.cart.splice(existingIndex, 1);
                this.showMinimumOrderNotification();
            } else if (this.cart[existingIndex].quantity > 1) {
                this.cart[existingIndex].quantity -= 1;
            } else {
                this.cart.splice(existingIndex, 1);
            }
            
            this.saveCart();
            this.updateCartDisplay();
            this.updateQuantityDisplay(control);
            this.showQuantityAnimation(control, 'decrease');
        }
    }

    updateQuantityDisplay(control) {
        const productCard = control.closest('.product-card');
        const productName = productCard.getAttribute('data-product-name');
        const itemId = `${productName}_single`;
        const input = control.querySelector('.quantity-input');
        const minusBtn = control.querySelector('.quantity-btn.minus');
        
        if (!input) return;
        
        const cartItem = this.cart.find(item => item.id === itemId);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        input.value = quantity;
        input.setAttribute('data-quantity', quantity);
        control.setAttribute('data-quantity', quantity);
        
        // Update minus button opacity
        if (quantity === 0) {
            minusBtn.style.opacity = '0.5';
            minusBtn.style.pointerEvents = 'none';
        } else {
            minusBtn.style.opacity = '1';
            minusBtn.style.pointerEvents = 'auto';
        }
    }

    showQuantityAnimation(control, action) {
        const input = control.querySelector('.quantity-input');
        if (input) {
            input.classList.add('updating');
            
            setTimeout(() => {
                input.classList.remove('updating');
            }, 300);
        }
        
        // Show quick notification
        if (action === 'increase') {
            this.showAddToCartNotification();
        }
    }

    updateAllQuantityDisplays() {
        // Update all quantity displays when page loads
        const quantityControls = document.querySelectorAll('.quantity-controls');
        quantityControls.forEach(control => {
            this.updateQuantityDisplay(control);
        });
    }

    quickAddToCart(item) {
        const existingIndex = this.cart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingIndex >= 0) {
            this.cart[existingIndex].quantity += item.quantity;
        } else {
            this.cart.push(item);
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showQuickAddNotification(item.name);
    }

    showQuickAddAnimation(button) {
        button.classList.add('added');
        const originalIcon = button.querySelector('.plus-icon');
        originalIcon.textContent = '✓';
        
        setTimeout(() => {
            button.classList.remove('added');
            originalIcon.textContent = '+';
        }, 1000);
    }

    showQuickAddNotification(itemName) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.quick-add-notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.className = 'quick-add-notification';
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>✅</span>
                <span>Added "${itemName}" to cart!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showMinimumOrderNotification() {
        // Remove any existing notification
        const existingNotification = document.querySelector('.minimum-order-notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.className = 'minimum-order-notification';
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>⚠️</span>
                <span>Minimum order for chapathis is 5 pieces</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }



    updateCartDisplay() {
        const cartCountElements = document.querySelectorAll('#cartCount, .cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(el => {
            if (el) {
                el.textContent = totalItems;
                el.classList.add('updated');
                setTimeout(() => el.classList.remove('updated'), 300);
            }
        });
    }

    // Theme Toggle Functionality (Standalone)
    setupThemeToggle() {
        // Load theme on page load FIRST
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            // Show the theme toggle (it was hidden in original)
            themeToggle.style.display = 'flex';

            // Theme toggle functionality
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
                this.updateMobileThemeDisplay(newTheme);
                
                // Add animation
                themeToggle.style.transform = 'scale(0.95) rotate(180deg)';
                setTimeout(() => {
                    themeToggle.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            });
        }

        // Initialize theme display for both desktop and mobile
        this.updateThemeIcon(savedTheme);
        this.updateMobileThemeDisplay(savedTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.getElementById('themeIcon');
        
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Toggle theme method for mobile menu
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        this.updateMobileThemeDisplay(newTheme);
    }

    // Update mobile theme display (consolidated function)
    updateMobileThemeDisplay(theme) {
        const mobileThemeIcon = document.getElementById('mobileThemeIcon');
        const mobileThemeText = document.querySelector('#mobileThemeToggle .theme-text');
        
        if (mobileThemeIcon && mobileThemeText) {
            if (theme === 'light') {
                mobileThemeIcon.textContent = '🌙';
                mobileThemeText.textContent = 'Dark Mode';
            } else {
                mobileThemeIcon.textContent = '☀️';
                mobileThemeText.textContent = 'Light Mode';
            }
        }
    }

    // Initialize mobile theme display (legacy support)
    initializeMobileTheme(theme) {
        this.updateMobileThemeDisplay(theme);
    }

    // Ultra-Smooth Scroll Reveal Animation
    setupScrollReveal() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame for smoother animations
                    requestAnimationFrame(() => {
                        entry.target.classList.add('revealed');
                        
                        // Add staggered animation for grid items with smoother timing
                        if (entry.target.parentElement?.classList.contains('products-grid') ||
                            entry.target.parentElement?.classList.contains('features-grid')) {
                            const siblings = Array.from(entry.target.parentElement.children);
                            const index = siblings.indexOf(entry.target);
                            entry.target.style.animationDelay = `${index * 0.08}s`;
                            entry.target.style.transitionDelay = `${index * 0.08}s`;
                        }
                    });
                }
            });
        }, observerOptions);

        // Observe all scroll-reveal elements
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // Ultra-Smooth Scrolling for Anchor Links
    setupSmoothScrolling() {
        // Enhanced smooth scrolling with easing
        this.smoothScrollTo = (target, duration = 1200) => {
            const targetElement = typeof target === 'string' ? document.getElementById(target) : target;
            if (!targetElement) return;

            const headerHeight = document.querySelector('nav').offsetHeight;
            const startPosition = window.pageYOffset;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            const distance = targetPosition - startPosition;
            let startTime = null;

            // Easing function for buttery smooth animation
            const easeInOutCubic = (t) => {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            };

            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const easeProgress = easeInOutCubic(progress);
                
                window.scrollTo(0, startPosition + distance * easeProgress);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };
            
            requestAnimationFrame(animation);
        };

        // Handle anchor link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.smoothScrollTo(targetId);
            }
        });

        // Throttled scroll event for performance
        let scrollTimeout;
        let isScrolling = false;
        
        const optimizedScrollHandler = () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    // Update CSS custom property for scroll-based animations
                    document.documentElement.style.setProperty('--scroll-y', `${scrolled}px`);
                    isScrolling = false;
                });
                isScrolling = true;
            }
        };

        // Use passive event listener for better performance
        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    }

    // Liquid Glass Effects
    setupLiquidEffects() {
        // Parallax effect for background elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Update CSS custom property for scroll-based animations
            document.documentElement.style.setProperty('--scroll-y', `${scrolled}px`);
            
            // Liquid background movement
            const liquidElements = document.querySelectorAll('body::before, body::after');
            liquidElements.forEach(el => {
                if (el) {
                    el.style.transform = `translateY(${rate}px)`;
                }
            });
        });

        // Hover effects for cards
        document.querySelectorAll('.glass-card, .product-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e, card);
            });
        });

        // Floating animation for logo
        const logo = document.querySelector('.logo');
        if (logo) {
            setInterval(() => {
                logo.style.transform += ' translateY(-2px)';
                setTimeout(() => {
                    logo.style.transform = logo.style.transform.replace(' translateY(-2px)', '');
                }, 1000);
            }, 3000);
        }
    }

    // Create liquid click effect
    createLiquidClickEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const liquidSplash = document.createElement('div');
        liquidSplash.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, 
                rgba(var(--primary-color-rgb), 0.6) 0%, 
                rgba(var(--accent-color-rgb), 0.4) 40%, 
                transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: liquidClickSplash 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.appendChild(liquidSplash);
        
        setTimeout(() => {
            liquidSplash.remove();
        }, 800);
    }

    // Create liquid hover effect
    createLiquidHoverEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const liquidHover = document.createElement('div');
        liquidHover.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, 
                rgba(255, 255, 255, 0.3) 0%, 
                rgba(var(--primary-color-rgb), 0.2) 50%, 
                transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: liquidHoverRipple 1s ease-out forwards;
            z-index: 5;
        `;
        
        element.style.position = 'relative';
        element.appendChild(liquidHover);
        
        setTimeout(() => {
            liquidHover.remove();
        }, 1000);
    }

    // Enhanced Navigation with Liquid Effects
    setupNavigation() {
        const nav = document.querySelector('nav');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class for navigation styling
            if (currentScrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            // Hide/show navigation on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });

        // Mobile Menu Toggle with new structure
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNavMenu = document.getElementById('mobileNavMenu');
        const searchToggle = document.getElementById('searchToggle');
        const mobileSearchBar = document.getElementById('mobileSearchBar');

        // Mobile navigation menu toggle
        if (mobileMenuToggle && mobileNavMenu) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.openMobileMenu();
                this.createLiquidClickEffect(e, mobileMenuToggle);
            });

            // Close mobile menu when clicking on a link
            mobileNavMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    // Add smooth page transition effect for external links
                    if (href && !href.startsWith('#')) {
                        this.showLoadingScreen();
                        document.body.classList.add('page-transition');
                    }
                    
                    // Close menu after a short delay
                    setTimeout(() => {
                        this.closeMobileMenu();
                    }, 300);
                    
                    // Add liquid click effect to nav links
                    this.createLiquidClickEffect(e, link);
                });
            });
        }

        // Close mobile menu button
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
            });
        }

        // Close menu when clicking overlay
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Mobile theme toggle
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        const mobileThemeIcon = document.getElementById('mobileThemeIcon');
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
                this.createLiquidClickEffect(e, mobileThemeToggle);
            });
        }

        // Enhanced touch/swipe functionality for mobile menu
        if (mobileNavMenu) {
            this.setupMobileMenuTouchGestures(mobileNavMenu);
        }

        // Mobile search toggle
        if (searchToggle && mobileSearchBar) {
            searchToggle.addEventListener('click', (e) => {
                e.preventDefault();
                mobileSearchBar.classList.toggle('active');
                
                // Close navigation menu if open
                if (mobileNavMenu) {
                    mobileNavMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
                
                // Focus on search input when opened
                if (mobileSearchBar.classList.contains('active')) {
                    const searchInput = mobileSearchBar.querySelector('.mobile-search-input');
                    setTimeout(() => searchInput.focus(), 300);
                }
                
                this.createLiquidClickEffect(e, searchToggle);
            });
        }

        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('nav');
            const mobileNavMenu = document.getElementById('mobileNavMenu');
            
            if (!nav.contains(e.target) && !mobileNavMenu.contains(e.target)) {
                this.closeMobileMenu();
                if (mobileSearchBar) mobileSearchBar.classList.remove('active');
            }
        });

        // Close menus on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
                if (mobileSearchBar) mobileSearchBar.classList.remove('active');
            }
        });

        // Mobile search functionality
        const mobileSearchBtn = document.querySelector('.mobile-search-btn');
        const mobileSearchInput = document.querySelector('.mobile-search-input');
        
        if (mobileSearchBtn && mobileSearchInput) {
            const handleSearch = () => {
                const searchTerm = mobileSearchInput.value.trim();
                if (searchTerm) {
                    // You can implement search functionality here
                    console.log('Searching for:', searchTerm);
                    
                    // For now, redirect to products page
                    this.showLoadingScreen();
                    setTimeout(() => {
                        window.location.href = 'products.html';
                    }, 500);
                }
            };
            
            mobileSearchBtn.addEventListener('click', handleSearch);
            mobileSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
        }

        // Enhanced Navigation Links with Liquid Effects (Desktop)
        const navLinksItems = document.querySelectorAll('.desktop-nav a');
        
        navLinksItems.forEach(link => {
            // Add liquid click effect to all nav links
            link.addEventListener('click', (e) => {
                // Show loading screen for page transitions
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    this.showLoadingScreen();
                }
                
                // Remove active class from all links
                navLinksItems.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Create liquid click effect
                this.createLiquidClickEffect(e, link);
                
                // Auto-remove active class after animation
                setTimeout(() => {
                    if (!link.href.includes('#')) {
                        link.classList.remove('active');
                    }
                }, 1000);
            });
            
            // Add liquid hover enhancement
            link.addEventListener('mouseenter', (e) => {
                this.createLiquidHoverEffect(e, link);
            });
        });

        // Enhanced Theme Toggle with Liquid Effects
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                this.createLiquidClickEffect(e, themeToggle);
            });
        }

        // Active navigation link highlighting based on scroll position
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinksItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Initialize Loading Animations
    initializeAnimations() {
        // Add loading animation to elements
        document.querySelectorAll('.liquid-loading').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
            el.classList.add('animate');
        });

        // Staggered animation for grid items
        document.querySelectorAll('.products-grid .product-card, .features-grid .feature').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
            el.classList.add('liquid-loading');
        });

        // Brand name special animation
        const brandName = document.querySelector('.brand-name');
        if (brandName) {
            brandName.addEventListener('mouseenter', () => {
                brandName.style.animation = 'none';
                brandName.offsetHeight; // Trigger reflow
                brandName.style.animation = 'brandShimmer 1s ease-in-out';
            });
        }
    }

    // Utility Functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance optimization for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // ========================================
    // CATEGORY MANAGEMENT SYSTEM
    // ========================================
    
    setupCategoryManagement() {
        // Initialize category state
        this.currentCategory = 'all';
        this.categories = {
            'chapathi': {
                name: 'Fresh Chapathis',
                icon: '🫓',
                description: 'Soft, fresh chapathis made daily with premium ingredients'
            },
            'pickle': {
                name: 'Premium Pickles', 
                icon: '🥒',
                description: 'Authentic traditional pickles with bold flavors and spices'
            },
            'powder': {
                name: 'Aromatic Spice Powders',
                icon: '🌶️', 
                description: 'Fresh ground spices and powder blends for authentic taste'
            }
        };
        
        // Add event listeners to category blocks
        const categoryBlocks = document.querySelectorAll('.category-block');
        categoryBlocks.forEach(block => {
            const category = block.getAttribute('data-category');
            if (category) {
                block.addEventListener('click', () => {
                    console.log(`Category block clicked: ${category}`);
                    this.showCategory(category);
                });
            }
        });
        
        // Add event listener to back button
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('Back button clicked');
                this.showAllCategories();
            });
        }
        
        // Debug: Log available category sections
        console.log('Available category sections:');
        console.log('Chapathi:', document.getElementById('chapathiCategory'));
        console.log('Pickle:', document.getElementById('pickleCategory'));
        console.log('Powder:', document.getElementById('powderCategory'));
        
        // Make methods globally accessible for fallback
        window.showCategory = (category) => this.showCategory(category);
        window.showAllCategories = () => this.showAllCategories();
    }

    showCategory(categoryType) {
        console.log(`=== showCategory called with: ${categoryType} ===`);
        
        // Hide category selection
        const categorySection = document.getElementById('categorySection');
        console.log('Category section found:', !!categorySection);
        if (categorySection) {
            categorySection.style.display = 'none';
            console.log('Category section hidden');
        }
        
        // Show back navigation
        const backNavigation = document.getElementById('backNavigation');
        console.log('Back navigation found:', !!backNavigation);
        if (backNavigation) {
            backNavigation.style.display = 'block';
            console.log('Back navigation shown');
        }
        
        // Hide all category sections first
        const allCategories = document.querySelectorAll('.product-category');
        console.log(`Found ${allCategories.length} product category sections`);
        allCategories.forEach(category => {
            category.style.display = 'none';
        });
        
        // Show selected category section based on categoryType
        let selectedCategory = null;
        if (categoryType === 'chapathi') {
            selectedCategory = document.getElementById('chapathiCategory');
            console.log('Looking for chapathiCategory:', !!selectedCategory);
        } else if (categoryType === 'pickle') {
            selectedCategory = document.getElementById('pickleCategory');
            console.log('Looking for pickleCategory:', !!selectedCategory);
        } else if (categoryType === 'powder') {
            selectedCategory = document.getElementById('powderCategory');
            console.log('Looking for powderCategory:', !!selectedCategory);
        }
        
        if (selectedCategory) {
            selectedCategory.style.display = 'block';
            console.log(`Successfully showed ${categoryType} category section`);
            
            // Scroll to the category section
            setTimeout(() => {
                selectedCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
                console.log('Scrolled to category section');
            }, 100);
            
            // Trigger scroll reveal for products in this category
            setTimeout(() => {
                const products = selectedCategory.querySelectorAll('.product-card');
                console.log(`Found ${products.length} products in ${categoryType} category`);
                products.forEach((product, index) => {
                    // Reset any previous reveal classes
                    product.classList.remove('scroll-reveal-visible');
                    
                    // Add reveal with staggered timing
                    setTimeout(() => {
                        product.classList.add('scroll-reveal-visible');
                    }, index * 100);
                });
            }, 300);
        } else {
            console.error(`Category section not found for: ${categoryType}`);
            console.log('Available sections in DOM:');
            console.log('- chapathiCategory:', document.getElementById('chapathiCategory'));
            console.log('- pickleCategory:', document.getElementById('pickleCategory'));
            console.log('- powderCategory:', document.getElementById('powderCategory'));
        }
        
        // Update page title
        this.updatePageTitle(categoryType);
        
        // Update current category
        this.currentCategory = categoryType;
        console.log(`=== showCategory completed for: ${categoryType} ===`);
    }

    showAllCategories() {
        console.log('Showing all categories');
        
        // Hide all product categories
        const allCategories = document.querySelectorAll('.product-category');
        allCategories.forEach(category => {
            category.style.display = 'none';
        });
        
        // Hide back navigation
        const backNavigation = document.getElementById('backNavigation');
        if (backNavigation) {
            backNavigation.style.display = 'none';
        }
        
        // Show category selection
        const categorySection = document.getElementById('categorySection');
        if (categorySection) {
            categorySection.style.display = 'block';
            
            // Scroll to category selection
            setTimeout(() => {
                categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
        
        // Reset page title
        this.updatePageTitle('all');
        
        // Update current category
        this.currentCategory = 'all';
        
        // Trigger scroll reveal for category blocks
        setTimeout(() => {
            const blocks = document.querySelectorAll('.category-block');
            blocks.forEach((block, index) => {
                // Reset any previous reveal classes
                block.classList.remove('scroll-reveal-visible');
                
                // Add reveal with staggered timing
                setTimeout(() => {
                    block.classList.add('scroll-reveal-visible');
                }, index * 200);
            });
        }, 100);
    }

    updatePageTitle(categoryType) {
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');
        
        if (categoryType === 'all') {
            if (pageTitle) pageTitle.textContent = 'Our Product Categories';
            if (pageSubtitle) pageSubtitle.textContent = 'Choose Your Favorite Category';
        } else {
            const category = this.categories[categoryType];
            if (category) {
                if (pageTitle) pageTitle.textContent = `${category.icon} ${category.name}`;
                if (pageSubtitle) pageSubtitle.textContent = category.description;
            }
        }
    }
    
    // Mobile Menu Helper Functions
    openMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNavMenu = document.getElementById('mobileNavMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileSearchBar = document.getElementById('mobileSearchBar');
        
        if (mobileMenuToggle) mobileMenuToggle.classList.add('active');
        if (mobileNavMenu) mobileNavMenu.classList.add('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
        
        // Close search if open
        if (mobileSearchBar) mobileSearchBar.classList.remove('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNavMenu = document.getElementById('mobileNavMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        if (mobileNavMenu) mobileNavMenu.classList.remove('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Close mobile menu with smooth scroll animation
    closeMobileMenuWithAnimation() {
        const mobileNavMenu = document.getElementById('mobileNavMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        
        if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
            // Add haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50); // Brief vibration
            }
            
            // Add smooth disappearing animation
            mobileNavMenu.classList.add('scroll-disappearing');
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.add('scroll-disappearing');
            }
            
            // Remove active state after animation delay
            setTimeout(() => {
                this.closeMobileMenu();
                mobileNavMenu.classList.remove('scroll-disappearing');
                if (mobileMenuOverlay) {
                    mobileMenuOverlay.classList.remove('scroll-disappearing');
                }
            }, 400);
        }
    }

    // Setup touch gestures for mobile menu
    setupMobileMenuTouchGestures(mobileNavMenu) {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        let currentX = 0;

        // Touch start
        mobileNavMenu.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = false;
        }, { passive: true });

        // Touch move
        mobileNavMenu.addEventListener('touchmove', (e) => {
            if (!mobileNavMenu.classList.contains('active')) return;
            
            currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;

            // Only handle horizontal swipes (left swipe to close)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                isDragging = true;
                
                // Only allow left swipes (negative deltaX)
                if (deltaX < 0) {
                    const progress = Math.min(Math.abs(deltaX) / 200, 1);
                    const translateX = Math.max(deltaX, -200);
                    
                    // Apply real-time transform
                    mobileNavMenu.style.transform = `translateX(${translateX}px)`;
                    mobileNavMenu.style.opacity = 1 - (progress * 0.6);
                }
            }
        }, { passive: true });

        // Touch end
        mobileNavMenu.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const deltaX = currentX - startX;
            const velocity = Math.abs(deltaX) / 200;

            // Reset transform
            mobileNavMenu.style.transform = '';
            mobileNavMenu.style.opacity = '';

            // If swipe is significant enough, close the menu
            if (deltaX < -80 || velocity > 0.5) {
                this.closeMobileMenuWithAnimation();
            }

            isDragging = false;
        }, { passive: true });
    }

    // Simple Mobile Categories Bar
    setupMobileCategories() {
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        const indicatorProgress = document.getElementById('indicatorProgress');
        const stickyHeader = document.getElementById('mobileStickyHeader');
        const stickyTabs = document.querySelectorAll('.category-tab');
        const backToTopBtn = document.getElementById('backToTopBtn');
        
        if (!indicators.length) return;

        let currentIndex = 0;

        // Initialize with first category
        this.switchToCategory(currentIndex);

        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.switchToCategory(index);
            });
        });

        // Sticky header tabs
        stickyTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                this.switchToCategory(index);
            });
        });

        // Back to top button
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                const categorySection = document.getElementById('categorySection');
                if (categorySection) {
                    categorySection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            });
        }

        // Store references for other methods
        this.categoryData = {
            currentIndex,
            indicators,
            indicatorProgress,
            stickyTabs
        };

        // Setup sticky header
        this.setupAdvancedStickyHeader();
    }

    switchToCategory(index) {
        const { indicators, indicatorProgress, stickyTabs } = this.categoryData || {};
        
        if (!indicators || index < 0 || index >= indicators.length) return;

        // Update current index
        if (this.categoryData) {
            this.categoryData.currentIndex = index;
        }

        // Update active states
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        if (stickyTabs) {
            stickyTabs.forEach((tab, i) => {
                tab.classList.toggle('active', i === index);
            });
        }

        // Update progress indicator
        if (indicatorProgress) {
            const progressTranslate = index * 100;
            indicatorProgress.style.transform = `translateX(${progressTranslate}%)`;
        }

        // Show category products
        const categoryMap = ['chapathi', 'pickle', 'powder'];
        const category = categoryMap[index];
        if (category) {
            this.showCategoryProducts(category);
        }
    }

    goToSlide(index) {
        this.switchToCategory(index);
    }

    updateCarousel(index) {
        this.switchToCategory(index);
    }

    setupAdvancedStickyHeader() {
        const stickyHeader = document.getElementById('mobileStickyHeader');
        const categorySection = document.getElementById('categorySection');
        
        if (!stickyHeader || !categorySection) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateStickyHeader = () => {
            const currentScrollY = window.scrollY;
            const categoryBottom = categorySection.offsetTop + categorySection.offsetHeight;
            const isProductsVisible = currentScrollY > categoryBottom;
            const isMobile = window.innerWidth <= 768;

            if (isProductsVisible && isMobile) {
                stickyHeader.classList.add('visible');
            } else {
                stickyHeader.classList.remove('visible');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const requestStickyUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateStickyHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestStickyUpdate, { passive: true });
        window.addEventListener('resize', requestStickyUpdate, { passive: true });
    }

    showCategoryProducts(category) {
        // Update hero title and subtitle
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');
        
        const categoryTitles = {
            'chapathi': { title: '🫓 Fresh Chapathis', subtitle: 'Made fresh daily with premium ingredients' },
            'pickle': { title: '🥒 Traditional Pickles', subtitle: 'Authentic recipes passed down generations' },
            'powder': { title: '🌶️ Spice Powders', subtitle: 'Pure, aromatic spice blends' }
        };
        
        if (pageTitle && pageSubtitle && categoryTitles[category]) {
            pageTitle.textContent = categoryTitles[category].title;
            pageSubtitle.textContent = categoryTitles[category].subtitle;
        }

        // Hide all category sections
        const allCategories = document.querySelectorAll('.product-category');
        allCategories.forEach(cat => {
            cat.style.display = 'none';
        });

        // Show selected category with advanced animation
        const targetCategory = document.getElementById(`${category}Category`);
        if (targetCategory) {
            targetCategory.style.display = 'block';
            
            // Advanced entrance animation
            targetCategory.style.opacity = '0';
            targetCategory.style.transform = 'translateY(50px) scale(0.95)';
            targetCategory.style.filter = 'blur(5px)';
            
            setTimeout(() => {
                targetCategory.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                targetCategory.style.opacity = '1';
                targetCategory.style.transform = 'translateY(0) scale(1)';
                targetCategory.style.filter = 'blur(0px)';
            }, 100);

            // Smooth scroll to products with offset for sticky header
            setTimeout(() => {
                const offset = window.innerWidth <= 768 ? 100 : 0;
                const elementPosition = targetCategory.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 400);
        }
    }
}

// Enhanced Scroll Reveal Animation with Liquid Effects
class LiquidScrollReveal {
    constructor() {
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        });
        
        this.init();
    }

    init() {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('revealed');
                
                // Add liquid glass animation classes
                if (element.classList.contains('glass-card')) {
                    element.style.animation = 'liquidGlassReveal 0.8s ease-out forwards';
                } else if (element.classList.contains('product-card')) {
                    element.style.animation = 'liquidCardReveal 0.6s ease-out forwards';
                }
                
                // Unobserve after animation
                this.observer.unobserve(element);
            }
        });
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes liquidGlassReveal {
        from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
            filter: blur(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
        }
    }

    @keyframes liquidCardReveal {
        from {
            opacity: 0;
            transform: translateY(30px) rotateX(20deg);
            filter: blur(5px);
        }
        to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
            filter: blur(0);
        }
    }

    .nav-links a.active {
        background: var(--glass-hover);
        transform: translateY(-2px);
        box-shadow: var(--glass-shadow);
    }

    nav.scrolled {
        backdrop-filter: var(--backdrop-blur-strong);
        box-shadow: var(--glass-shadow-strong);
    }

    .scroll-reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .scroll-reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }

    .liquid-loading {
        animation: liquidFadeIn 1s ease-out forwards;
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.website = new LiquidGlassWebsite();
    new LiquidScrollReveal();
    
    // Add loading completed class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});

// Performance monitoring
window.addEventListener('load', () => {
    // Log performance metrics
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`🚀 Liquid Glass Website loaded in ${pageLoadTime}ms`);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LiquidGlassWebsite, LiquidScrollReveal };
}