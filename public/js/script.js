document.addEventListener('DOMContentLoaded', loadEntries);

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function loadEntries() {
    fetch('api.php')
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) {
                const tableBody = document.getElementById('entriesTableBody');
                tableBody.innerHTML = ''; 

                responseData.data.forEach(entry => {
                    const documentId = entry._id.$oid; 

                    tableBody.innerHTML += `
                        <tr>
                            <td>${entry.name || ''}</td>
                            <td>${entry.email || ''}</td>
                            <td>${entry.age || ''}</td>
                            <td>${entry.songTitle || ''}</td>
                            <td>${entry.artistName || ''}</td>
                            <td>
                                <button class="edit" onclick="editEntry('${documentId}', '${entry.name}', '${entry.email}', '${entry.age}', '${entry.songTitle}', '${entry.artistName}')">Edit</button>
                                <button class="delete" onclick="deleteEntry('${documentId}')">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            }
        });
}

function saveEntry() {
    const documentId = document.getElementById('entryId').value;
    const emailValue = document.getElementById('email').value;

    if (!validateEmail(emailValue)) {
        alert("Please enter a valid email address.");
        return;
    }

    const entryData = {
        name: document.getElementById('name').value,
        email: emailValue,
        age: document.getElementById('age').value,
        songTitle: document.getElementById('songTitle').value,
        artistName: document.getElementById('artistName').value
    };

    if (!entryData.name || !entryData.songTitle) {
        alert("Name and Song are required.");
        return;
    }

    const requestMethod = documentId ? 'PUT' : 'POST';
    if (documentId) entryData._id = documentId;

    fetch('api.php', {
        method: requestMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.success) {
            clearForm();
            loadEntries(); 
        } else {
            alert("Error: " + responseData.error);
        }
    });
}

function editEntry(id, name, email, age, title, artist) {
    document.getElementById('entryId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('age').value = age !== 'undefined' ? age : '';
    document.getElementById('songTitle').value = title;
    document.getElementById('artistName').value = artist;
    
    document.getElementById('saveButton').innerText = "Update Entry";
}

function deleteEntry(id) {
    if (confirm("Delete this entry?")) {
        fetch('api.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: id })
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) loadEntries();
        });
    }
}

function clearForm() {
    document.getElementById('entryId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('age').value = '';
    document.getElementById('songTitle').value = '';
    document.getElementById('artistName').value = '';
    document.getElementById('saveButton').innerText = "Save Entry";
}