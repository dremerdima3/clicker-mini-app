const tg = window.Telegram.WebApp;

// Инициализация
tg.expand(); // Развернуть приложение на весь экран
tg.MainButton.show();
tg.MainButton.setText("Закрыть");
tg.MainButton.onClick(() => tg.close());

// Получение данных пользователя
const user = tg.initDataUnsafe.user;
if (user) {
    console.log("Привет, " + user.first_name + "!");
}

// Логика кликера
let counter = 0;
let energy = 300;
const counterElement = document.getElementById('counter');
const clickButton = document.getElementById('clickButton');

clickButton.addEventListener('click', () => {
    counter++;
    counterElement.textContent = counter;
});