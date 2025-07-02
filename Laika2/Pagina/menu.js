document.querySelector('.usa-language__link').addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
    
    // Alternar la visibilidad del menú
    const submenu = document.querySelector('.usa-language__submenu');
    submenu.style.display = expanded ? 'none' : 'block';
});

document.getElementById('menu-toggle').addEventListener('change', function() {
    if (this.checked) {
      console.log("Menú abierto");
    } else {
      console.log("Menú cerrado");
    }
  });

