// Master list of all items across the entire website
const menuItems = {
    // Coffees
    'latteQty': { name: 'Caffè Latte', price: 185 },
    'macchiatoQty': { name: 'Caramel Macchiato', price: 210 },
    'mochaQty': { name: 'White Chocolate Mocha', price: 195 },
    'frappeQty': { name: 'Java Chip Frappuccino®', price: 225 },
    
    // Teas
    'matchaQty': { name: 'Matcha Tea Latte', price: 175 },
    'hibiscusQty': { name: 'Iced Hibiscus Tea', price: 165 },
    'chaiQty': { name: 'Chai Tea Latte', price: 180 },
    'pinkQty': { name: 'Pink Drink', price: 195 },

    // Pastries
    'qty-croissant': { name: 'Chocolate Croissant', price: 120 },
    'qty-muffin': { name: 'Blueberry Muffin', price: 105 },
    'qty-doughnut': { name: 'Glazed Doughnut', price: 85 }
};

function formatMoney(amount) {
    return amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Function to update the cart on the right side
function updateCart() {
    let total = 0;
    const cartItemsContainer = document.getElementById('cart-items');
    const totalMain = document.getElementById("totalMain");
    
    if (!cartItemsContainer) return 0; // Guard clause if cart isn't on page

    cartItemsContainer.innerHTML = ''; 
    let hasItems = false;

    // Look for all number inputs on the page
    const currentInputs = document.querySelectorAll('input[type="number"]');

    currentInputs.forEach(input => {
        const qty = Number(input.value) || 0;
        const itemId = input.id;
        
        // Safety check: ensure item exists in our master list
        if (itemId !== 'customerAge' && qty > 0 && menuItems[itemId]) {
            hasItems = true;
            const itemData = menuItems[itemId];
            const itemTotal = qty * itemData.price;
            total += itemTotal;

            // Add the item to the cart HTML
            cartItemsContainer.innerHTML += `
                <div class="cart-item" style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #ddd; padding-bottom: 5px;">
                    <span>${qty}x ${itemData.name}</span>
                    <span style="color: #007042; font-weight: bold;">₱${formatMoney(itemTotal)}</span>
                </div>
            `;
        }
    });

    if (!hasItems) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    }

    if (totalMain) {
        totalMain.innerText = formatMoney(total); 
    }

    return total; 
}

// Listen for input changes
document.addEventListener('input', (e) => {
    if (e.target.type === 'number' && e.target.id !== 'customerAge') {
        updateCart();
    }
});

// Run once on load to catch any default values
document.addEventListener('DOMContentLoaded', updateCart);

// --- POPUP, DISCOUNT, AND PAYMENT LOGIC ---

function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    
    toast.innerText = message;
    toast.style.backgroundColor = isError ? "#d13239" : "#007042";
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function showDiscountWindow() {
    let currentTotal = updateCart();
    
    if (currentTotal === 0) {
        showToast("Please add at least one item to your order.", true);
        return;
    }

    const modal = document.getElementById("discountModal");
    if (modal) modal.style.display = "flex";
}

function closeDiscountWindow() {
    const modal = document.getElementById("discountModal");
    if (modal) modal.style.display = "none";
}

function proceedToPayment() {
    let ageInput = document.getElementById("customerAge").value;

    if (ageInput !== "") {
        let checkedAge = Number(ageInput);
        if (checkedAge <= 0 || checkedAge > 120) { 
            showToast("Please enter a valid age.", true);
            return; 
        }
    }

    let age = Number(ageInput) || 0;
    let total = updateCart();
    let discount = (age >= 60) ? (total * 0.12) : 0;
    let finalTotal = total - discount;

    // Update receipt values
    document.getElementById("originalTotal").innerText = formatMoney(total);
    document.getElementById("discountAmount").innerText = formatMoney(discount);
    document.getElementById("finalTotal").innerText = formatMoney(finalTotal);

    closeDiscountWindow();
    const payModal = document.getElementById("paymentModal");
    if (payModal) payModal.style.display = "flex";
}

function closePaymentWindow() {
    const payModal = document.getElementById("paymentModal");
    if (payModal) payModal.style.display = "none";
}

function processPayment() {
    showToast("Payment Successful! Enjoy your order.");
    
    // Reset all inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => input.value = 0);
    
    updateCart(); 
    closePaymentWindow();
}