let currentCollectionName = 'users';
let allDocuments = [];

const apiPath = 'api.php';

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const view = e.target.getAttribute('data-view');
        hideAllViews();
        document.getElementById(`${view}-view`).style.display = 'block';
        
        if(view === 'collections') loadCollections();
    });
});

function hideAllViews() {
    document.querySelectorAll('.view-section').forEach(section => {
        section.style.display = 'none';
    });
}

function showMessage(msg, isError = false) {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = msg;
    msgDiv.className = `message ${isError ? 'error' : 'success'}`;
    msgDiv.classList.remove('hidden');
    setTimeout(() => msgDiv.classList.add('hidden'), 3000);
}

async function loadCollections() {
    try {
        const response = await fetch(`${apiPath}?action=collections`);
        const result = await response.json();
        
        const tbody = document.getElementById('collections-body');
        tbody.innerHTML = '';

        if (result.success) {
            result.data.forEach(coll => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${coll}</td>
                    <td><button class="action-btn" onclick="loadDocuments('${coll}')">View Documents</button></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        showMessage('Failed to load collections', true);
    }
}

async function loadDocuments(collection) {
    currentCollectionName = collection;
    document.getElementById('current-collection').textContent = collection;
    
    hideAllViews();
    document.getElementById('documents-view').style.display = 'block';

    try {
        const response = await fetch(`${apiPath}?action=documents&collection=${collection}`);
        const result = await response.json();
        
        const tbody = document.getElementById('documents-body');
        tbody.innerHTML = '';

        if (result.success) {
            allDocuments = result.data; 
            
            if (allDocuments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="2">No documents found.</td></tr>';
                return;
            }

            allDocuments.forEach((doc, index) => {
                const displayDoc = { ...doc };
                delete displayDoc._id;
                const idString = doc._id.$oid; 

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><pre>${JSON.stringify(displayDoc, null, 2)}</pre></td>
                    <td style="vertical-align: top;">
                        <button class="action-btn edit-btn" onclick="openEditForm(${index})">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteDocument('${idString}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        showMessage('Failed to load documents', true);
    }
}

function showCollections() {
    hideAllViews();
    document.getElementById('collections-view').style.display = 'block';
    loadCollections();
}

function showDocuments() {
    hideAllViews();
    document.getElementById('documents-view').style.display = 'block';
}

document.getElementById('insert-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (data.ubicacion) {
        try {
            data.ubicacion = JSON.parse(data.ubicacion);
        } catch(e) {
            showMessage("Invalid JSON in Ubicacion field", true);
            return;
        }
    }

    try {
        const response = await fetch(apiPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if (result.success) {
            showMessage('User inserted successfully!');
            e.target.reset();
            document.getElementById('collection').value = 'users';
        } else {
            showMessage(result.error, true);
        }
    } catch (error) {
        showMessage('Error inserting document', true);
    }
});

function openEditForm(index) {
    const doc = allDocuments[index];
    hideAllViews();
    document.getElementById('update-view').style.display = 'block';
    
    document.getElementById('update-id').value = doc._id.$oid;
    document.getElementById('update-nombre').value = doc.nombre || '';
    document.getElementById('update-edad').value = doc.edad || '';
    document.getElementById('update-departamento').value = doc.departamento || '';
    document.getElementById('update-role').value = doc.role || 'user';
    document.getElementById('update-email').value = doc.email || '';
    document.getElementById('update-fotoURL').value = doc.fotoURL || '';
    
    document.getElementById('update-ubicacion').value = doc.ubicacion ? JSON.stringify(doc.ubicacion) : '';
    document.getElementById('update-password').value = '';
}

document.getElementById('update-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    data._id = data['update-id'];
    delete data['update-id'];
    data.collection = currentCollectionName;

    if (data.ubicacion) {
        try {
            data.ubicacion = JSON.parse(data.ubicacion);
        } catch(e) {
            showMessage("Invalid JSON in Ubicacion field", true);
            return;
        }
    }

    try {
        const response = await fetch(apiPath, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if (result.success) {
            showMessage('User updated successfully!');
            loadDocuments(currentCollectionName); 
        } else {
            showMessage(result.error, true);
        }
    } catch (error) {
        showMessage('Error updating document', true);
    }
});

async function deleteDocument(id) {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
        const response = await fetch(apiPath, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: id, collection: currentCollectionName })
        });
        const result = await response.json();
        
        if (result.success) {
            showMessage('Document deleted successfully!');
            loadDocuments(currentCollectionName);
        } else {
            showMessage(result.error, true);
        }
    } catch (error) {
        showMessage('Error deleting document', true);
    }
}

window.onload = loadCollections;