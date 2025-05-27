// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDarkMode ? 'enabled' : 'disabled');
});

// Set initial theme based on localStorage
if (localStorage.getItem('dark-mode') === 'enabled') {
  document.body.classList.add('dark-mode');
} else {
  document.body.classList.remove('dark-mode');
}
