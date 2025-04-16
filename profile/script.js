document.querySelectorAll('.item-title').forEach(button => {
    button.addEventListener('click', () => {
        const detail = button.nextElementSibling;
        const isOpen = detail.style.display === 'block';

        detail.style.display = isOpen ? 'none' : 'block';
        button.textContent = button.textContent.replace(isOpen ? '▾' : '▸', isOpen ? '▸' : '▾');
    });
});
