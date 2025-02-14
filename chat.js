let selectedImage = null;

document.getElementById('send-button').addEventListener('click', function () {
    sendMessage();
});

document.getElementById('chat-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('image-upload').addEventListener('change', function (event) {
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const file = event.target.files[0];

    if (file) {
        selectedImage = file;
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'image-preview';

            const fileName = document.createElement('span');
            fileName.className = 'file-name';
            fileName.textContent = file.name;

            const wrapper = document.createElement('div');
            wrapper.className = 'image-preview-wrapper';
            wrapper.appendChild(img);
            wrapper.appendChild(fileName);

            const removeButton = document.createElement('button');
            removeButton.className = 'remove-image';
            removeButton.textContent = '✕';
            removeButton.addEventListener('click', function () {
                selectedImage = null;
                imagePreviewContainer.innerHTML = '';
            });

            imagePreviewContainer.innerHTML = ''; // Clear previous images
            imagePreviewContainer.appendChild(wrapper);
            imagePreviewContainer.appendChild(removeButton);
        };
        reader.readAsDataURL(file);
    }
});

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    if (chatInput.value.trim() !== '' || selectedImage) {
        const userMessage = document.createElement('div');
        userMessage.className = 'message right';

        if (selectedImage) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(selectedImage);
            img.className = 'image-preview';

            const fileName = document.createElement('span');
            fileName.className = 'file-name';
            fileName.textContent = selectedImage.name;

            const wrapper = document.createElement('div');
            wrapper.className = 'image-preview-wrapper';
            wrapper.appendChild(img);
            wrapper.appendChild(fileName);

            userMessage.appendChild(wrapper);
        }

        if (chatInput.value.trim() !== '') {
            const textMessage = document.createElement('div');
            textMessage.textContent = chatInput.value;
            userMessage.appendChild(textMessage);
        }

        chatBox.appendChild(userMessage);

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message left';
        loadingMessage.textContent = 'Loading...';
        chatBox.appendChild(loadingMessage);

        chatBox.scrollTop = chatBox.scrollHeight;

        const formData = new FormData();
        formData.append('message', chatInput.value);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        // Send the message to the backend
        fetch('your-backend-url', {
            method: 'POST',
            body: formData
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
        selectedImage = null;
        document.getElementById('image-preview-container').innerHTML = '';
    }
}