const carButtons = document.querySelectorAll('.car-button');
carButtons.forEach(button => {
    button.addEventListener('click', function() {
        alert(`Вартість оренди ${carName}: ${carPrices[carName] || 'не встановлена'}`);
    });
});