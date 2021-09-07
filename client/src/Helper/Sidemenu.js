function sidemenu() {
    let menuBtn = document.getElementById('menuBtn');
    let outerlay = document.getElementById('outerlay');
    let sidemenu = document.getElementById('sidemenu');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            outerlay.classList.add('open');
            sidemenu.classList.add('open');
        });
    }

    if (outerlay) {
        outerlay.addEventListener('click', () => {
            outerlay.classList.remove('open');
            sidemenu.classList.remove('open');
        });
    }

    if (sidemenu) {
        sidemenu.addEventListener('touchmove', () => {
            outerlay.classList.remove('open');
            sidemenu.classList.remove('open');
        });
    }
}

export default sidemenu;