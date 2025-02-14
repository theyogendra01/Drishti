document.getElementById('continue-as-guest').addEventListener('click', function() {
    window.location.href = 'chat.html';
});

document.querySelector('.form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Create a form data object
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Send the form data to the backend
    fetch('your-backend-url', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'chat.html';
        } else {
            alert('Wrong credentials');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});