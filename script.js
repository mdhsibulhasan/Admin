// Telegram bot configuration
const telegramBotToken = '8121244129:AAFFp9eSL3VSLhAvVlGrz293SKyfYq9f2b8';
const telegramChatId = '7160411468';

// Function to send a message to Telegram
function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const params = {
        chat_id: telegramChatId,
        text: message,
        parse_mode: "HTML"
    };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => console.log('Telegram message sent:', data))
    .catch(error => console.error('Error sending Telegram message:', error));
}

// Utility function to show messages with color
function showMessage(elementId, message, color) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.color = color;
    }
}

// Retrieve users from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Admin credentials
const adminUsername = 'admin';
const adminPassword = '1001';

// Ensure admin user exists in localStorage
if (!users.some(user => user.username === adminUsername)) {
    users.push({
        name: 'Admin',
        username: adminUsername,
        password: adminPassword,
        dob: '',
        favoriteColor: ''
    });
    localStorage.setItem('users', JSON.stringify(users));
}

// Register new user
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const dob = document.getElementById('dob').value;
        const favoriteColor = document.getElementById('favoriteColor').value;

        // Check if username already exists
        if (users.some(user => user.username === username)) {
            showMessage('registerMessage', 'Username already exists!', 'red');
            return;
        }

        users.push({ name, username, password, dob, favoriteColor });
        localStorage.setItem('users', JSON.stringify(users));
        showMessage('registerMessage', 'Registration successful!', 'green');
        sendTelegramMessage(`👤 <b>New User Registered</b>\nName: <i>${name}</i>\nUsername: <i>${username}</i>\nDate of Birth: <i>${dob}</i>\nFavorite Color: <i>${favoriteColor}</i> 🌈`);
        registerForm.reset();
    });
}

// Handle login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const loginUsername = document.getElementById('loginUsername').value.trim();
        const loginPassword = document.getElementById('loginPassword').value.trim();

        if (loginUsername === adminUsername && loginPassword === adminPassword) {
            sendTelegramMessage(`🚨 <b>Admin Login Alert</b> 🚨\nAdmin Username: <i>${loginUsername}</i> has logged in.`);
            window.location.href = 'admin.html';
            return;
        }

        const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'home.html';
            sendTelegramMessage(`✅ <b>User Login</b>\nUsername: <i>${loginUsername}</i> has logged in.`);
        } else {
            showMessage('loginMessage', 'Invalid credentials!', 'red');
        }
    });
}

// Display user information on home page
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser && window.location.pathname.endsWith('home.html')) {
    document.getElementById('usernameDisplay').textContent = currentUser.username;
    document.getElementById('nameInfo').textContent = currentUser.name;
    document.getElementById('dobInfo').textContent = currentUser.dob;
    document.getElementById('colorInfo').textContent = currentUser.favoriteColor;
    document.getElementById('colorBox').style.backgroundColor = currentUser.favoriteColor;
}

// Handle logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        sendTelegramMessage(`👋 <b>User Logout</b>\nUsername: <i>${currentUser.username}</i> has logged out.`);
        window.location.href = 'login.html';
    });
}