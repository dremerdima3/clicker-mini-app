const tg = window.Telegram.WebApp;

// Инициализация
tg.expand();
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
let maxEnergy = 300;
let clickMultiplier = 1;
let energyCostMultiplier = 1;
let restoreInterval = 1500;
let upgradeClickPrice = 50;
let upgradeEnergyPrice = 50;
let upgradeRestorePrice = 50;
let restoreIntervalId = setInterval(restoreEnergy, restoreInterval); // Сохраняем ID интервала

const counterElement = document.getElementById('counter');
const clickButton = document.getElementById('clickButton');
const energyElement = document.getElementById('energy');
const energyValueElement = document.getElementById('energy-value');
const maxEnergyElement = document.getElementById('max-energy');

// Элементы магазина
const shopButton = document.getElementById('shopButton');
const shopModal = document.getElementById('shopModal');
const closeModal = document.querySelector('.close');
const upgradeClickButton = document.getElementById('upgradeClick');
const upgradeEnergyButton = document.getElementById('upgradeEnergy');
const upgradeRestoreButton = document.getElementById('upgradeRestore');
const upgradeClickPriceElement = document.getElementById('upgradeClickPrice');
const upgradeEnergyPriceElement = document.getElementById('upgradeEnergyPrice');
const upgradeRestorePriceElement = document.getElementById('upgradeRestorePrice');

// Функция для обновления шкалы энергии
function updateEnergy() {
    const energyPercent = (energy / maxEnergy) * 100;
    energyElement.style.width = `${energyPercent}%`;
    energyValueElement.textContent = energy;
    maxEnergyElement.textContent = maxEnergy;
}

// Функция для восстановления энергии
function restoreEnergy() {
    if (energy < maxEnergy) {
        energy++;
        updateEnergy();
    }
}

// Восстановление энергии с заданным интервалом
setInterval(restoreEnergy, restoreInterval);

// Обработчик клика
clickButton.addEventListener('click', () => {
    const energyCost = 1 * energyCostMultiplier;
    if (energy >= energyCost) {
        counter += 1 * clickMultiplier;
        counterElement.textContent = counter;
        energy -= energyCost;
        updateEnergy();

        if (energy === 0) {
            clickButton.disabled = true;
        }

        saveProgress(); // Сохраняем прогресс
    }
});

// Разблокировка кнопки, если энергия восстановилась
energyElement.addEventListener('transitionend', () => {
    if (energy > 0) {
        clickButton.disabled = false;
    }
});

// Открытие модального окна магазина
shopButton.addEventListener('click', () => {
    shopModal.style.display = 'flex';
});

// Закрытие модального окна
closeModal.addEventListener('click', () => {
    shopModal.style.display = 'none';
});

// Функция для сохранения данных
function saveProgress() {
    const progress = {
        counter: counter,
        clickMultiplier: clickMultiplier,
        energyCostMultiplier: energyCostMultiplier, // Сохраняем множитель затрат энергии
        maxEnergy: maxEnergy,
        restoreInterval: restoreInterval, // Сохраняем интервал восстановления
        upgradeClickPrice: upgradeClickPrice,
        upgradeEnergyPrice: upgradeEnergyPrice,
        upgradeRestorePrice: upgradeRestorePrice,
        energy: energy // Сохраняем текущее значение энергии
    };
    localStorage.setItem('clickerProgress', JSON.stringify(progress));
}


// Функция для загрузки данных
function loadProgress() {
    const savedProgress = localStorage.getItem('clickerProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        counter = progress.counter || 0;
        clickMultiplier = progress.clickMultiplier || 1;
        energyCostMultiplier = progress.energyCostMultiplier || 1; // Загружаем множитель затрат энергии
        maxEnergy = progress.maxEnergy || 300;
        restoreInterval = progress.restoreInterval || 1500; // Загружаем интервал восстановления
        upgradeClickPrice = progress.upgradeClickPrice || 50;
        upgradeEnergyPrice = progress.upgradeEnergyPrice || 50;
        upgradeRestorePrice = progress.upgradeRestorePrice || 50;
        energy = progress.energy || maxEnergy; // Загружаем сохраненное значение энергии


        // Обновляем интерфейс
        counterElement.textContent = counter;
        updateEnergy();
        updateUpgradePrices();

        // Перезапускаем интервал восстановления с новым значением
        clearInterval(restoreIntervalId); // Очищаем старый интервал
        restoreIntervalId = setInterval(restoreEnergy, restoreInterval); // Запускаем новый интервал
    }
}

// Функция для обновления цен в магазине
function updateUpgradePrices() {
    upgradeClickPriceElement.textContent = upgradeClickPrice;
    upgradeEnergyPriceElement.textContent = upgradeEnergyPrice;
    upgradeRestorePriceElement.textContent = upgradeRestorePrice;
}

// Загружаем прогресс при загрузке страницы
loadProgress();

// Покупка улучшения клика
upgradeClickButton.addEventListener('click', () => {
    if (counter >= upgradeClickPrice) {
        counter -= upgradeClickPrice;
        counterElement.textContent = counter;
        clickMultiplier *= 2;
        energyCostMultiplier *= 2; // Увеличиваем множитель затрат энергии
        upgradeClickPrice += 50;
        upgradeClickPriceElement.textContent = upgradeClickPrice;

        saveProgress(); // Сохраняем прогресс
    }
});

// Покупка увеличения энергии
upgradeEnergyButton.addEventListener('click', () => {
    if (counter >= upgradeEnergyPrice) {
        counter -= upgradeEnergyPrice;
        counterElement.textContent = counter;
        maxEnergy += 60;
        upgradeEnergyPrice += 50;
        upgradeEnergyPriceElement.textContent = upgradeEnergyPrice;

        saveProgress(); // Сохраняем прогресс
    }
});

// Покупка ускорения восстановления
upgradeRestoreButton.addEventListener('click', () => {
    if (counter >= upgradeRestorePrice) {
        counter -= upgradeRestorePrice;
        counterElement.textContent = counter;
        restoreInterval *= 0.9; // Уменьшаем интервал восстановления
        clearInterval(restoreIntervalId); // Очищаем старый интервал
        restoreIntervalId = setInterval(restoreEnergy, restoreInterval); // Запускаем новый интервал
        upgradeRestorePrice += 50;
        upgradeRestorePriceElement.textContent = upgradeRestorePrice;

        saveProgress(); // Сохраняем прогресс
    }
});
