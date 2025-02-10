// РАБОЧИЙ КОД С ПРОВЕРКОЙ ЗАКАЗА ЧТОБЫ НЕ ОФОРМЛЯТЬ ПУСТОЙ


let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(itemName, itemPrice) {
    const newItem = {
        name: itemName
    };
    cart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    showAlert(`"${itemName}" добавлен в корзину!`, true);
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Корзина пуста :( Добавь сюда что-нибудь!</p>';
    } else {
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <p><strong>${item.name}</strong></p>
                <button class="nav-button-delete" onclick="removeFromCart(${index})">Удалить заказ</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
}



function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}


// Открытие формы заказа
function openOrderForm() {
    const modal = document.getElementById('order-modal');
    modal.style.display = 'flex';

    const orderContent = document.getElementById('order-content');
    orderContent.textContent = cart.map(item => item.name).join(', ');

    // Получаем кнопку "Завершить оформление" с помощью querySelector
    const submitButton = document.querySelector('button[type="submit"]');

    // Проверяем, если корзина пуста
    if (cart.length === 0) {
        submitButton.disabled = true; // Делаем кнопку неактивной
    } else {
        submitButton.disabled = false; // Активируем кнопку
    }
}

// Закрытие формы заказа
function closeOrderForm() {
    const modal = document.getElementById('order-modal');
    modal.style.display = 'none';
}

// Завершение оформления заказа
function submitOrder(event) {
    event.preventDefault();

    const name = document.getElementById('order-name').value;
    const address = document.querySelector('input[name="delivery"]:checked')?.value || 'Не указан';
    const comments = document.getElementById('order-comments').value;
    const orderDetails = cart.map(item => `${item.name}`).join('\n');

    const message = `
        Новый заказ:
        Имя: ${name}
        Адрес: ${address}
        Заказ: ${orderDetails}
        Пожелания: ${comments}
    `;

    sendOrderToTelegram(message);

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();

    closeOrderForm();
}

function sendOrderToTelegram(orderDetails) {
    const BOT_TOKEN = '7562795045:AAHfoDuXEohrFFFdQPtZp1N5u3vmHmzf4F0'; // Замените на токен вашего бота
    const CHAT_ID = '457106688'; // Замените на ваш чат ID
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: orderDetails }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Order sent to Telegram successfully!');
            displayModal('WOW!', 'Твой заказ отправлен! Жди своего абрикосика ❤️');
        } else {
            return response.json().then(err => {
                console.error('Failed to send order:', err.description);
                displayModal('Ошибка', `Не удалось отправить заказ: ${err.description}`);
            });
        }
    })
    .catch(error => {
        console.error('Error sending order:', error);
        displayModal('Ошибка', 'Произошла ошибка при отправке заказа. Попробуйте позже.');
    });
}

function openImageModal(title, description) {
    const modal = document.getElementById('image-modal');
    document.getElementById('image-modal-title').textContent = title;
    document.getElementById('image-modal-description').textContent = description;
    modal.style.display = 'flex';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}

function displayModal(title, message) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = message;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function showAlert(message, redirectToCart = false) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-modal');

    const alertContent = document.createElement('div');
    alertContent.classList.add('alert-content');

    const messageText = document.createElement('p');
    messageText.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть';
    closeButton.onclick = () => alertBox.remove();

    alertContent.appendChild(messageText);
    alertContent.appendChild(closeButton);

    if (redirectToCart) {
        const cartButton = document.createElement('button');
        cartButton.textContent = 'Перейти в корзину';
        cartButton.onclick = () => {
            alertBox.remove();
            window.location.href = 'cart.html';
        };
        alertContent.appendChild(cartButton);
    }

    alertBox.appendChild(alertContent);
    document.body.appendChild(alertBox);
}

if (window.location.pathname.includes('cart.html')) {
    displayCartItems();
}

// код для слайдера

const slider = document.querySelector('.slider');
const sliderImages = document.querySelectorAll('.slider_img');
const sliderLine = document.querySelector('.slider_line');

let sliderCount = 0;
let sliderWidth = slider.offsetWidth;

function nextSlide() {
    sliderCount++; 
    if (sliderCount >= sliderImages.length) {
        sliderCount = 0;
    }
    rollSlider();
}

function rollSlider() {
    sliderLine.style.transform = `translateX(${-sliderCount * sliderWidth}px)`;
}

function prevSlide() {
    sliderCount--; 
    if (sliderCount < 0) {
        sliderCount = sliderImages.length - 1;
    }
    rollSlider();
}

setInterval(() => {
    nextSlide()
}, 3000)









