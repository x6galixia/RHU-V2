function toggleNav() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar.style.width === '400px') {
        sidebar.style.width = '0';
    } else {
        sidebar.style.width = '400px'
    }
}