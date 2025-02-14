document.getElementById('send-button').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('chat-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('image-upload').addEventListener('change', function(event) {
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'image-preview';
            imagePreviewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    if (chatInput.value.trim() !== '') {
        const userMessage = document.createElement('div');
        userMessage.className = 'message right';
        userMessage.textContent = chatInput.value;
        chatBox.appendChild(userMessage);

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message left';
        loadingMessage.textContent = 'Loading...';
        chatBox.appendChild(loadingMessage);

        chatBox.scrollTop = chatBox.scrollHeight;

        // Send the message to the backend
        fetch('your-backend-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: chatInput.value })
        })
        .then(response => response.json())
        .then(data => {
            chatBox.removeChild(loadingMessage);

            const botMessage = document.createElement('div');
            botMessage.className = 'message left';
            botMessage.textContent = data.response;
            chatBox.appendChild(botMessage);

            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => {
            chatBox.removeChild(loadingMessage);

            const errorMessage = document.createElement('div');
            errorMessage.className = 'message left';
            errorMessage.textContent = 'Error: Could not get response from the server.';
            chatBox.appendChild(errorMessage);

            chatBox.scrollTop = chatBox.scrollHeight;
        });

        chatInput.value = '';
    }
}