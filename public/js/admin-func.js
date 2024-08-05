document.addEventListener("DOMContentLoaded", function () {
    function generateId() {
        const timestamp = new Date().getTime().toString();
        return `${timestamp}`;
    }
    document.getElementById("user_id").value = generateId();
});
