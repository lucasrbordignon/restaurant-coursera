document.addEventListener('DOMContentLoaded', function() {
  const collapsableNav = document.querySelector('#collapsable-nav');
  const toggleCollapse = document.querySelector('#toggle-collapse');

  document.addEventListener('click', function(event) {
    const screenWidth = window.innerWidth;
    const clickOutSide =
      screenWidth < 992 &&
      !collapsableNav.contains(event.target) &&
      !toggleCollapse.contains(event.target);

    const isMenuOpen = !toggleCollapse.classList.contains('collapsed');

    if (clickOutSide && isMenuOpen) {
      toggleCollapse.click()
    }
  });
});