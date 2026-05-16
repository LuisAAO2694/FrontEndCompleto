const API_URL = 'http://localhost:3000/api';

export function getToken() {
    return sessionStorage.getItem('token');
}

export function getUser() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function getRole() {
    const user = getUser();
    return user ? user.role : null;
}

async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            const err = new Error(data.message || 'Error en la solicitud');
            err.status = response.status;
            err.data = data;
            throw err;
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        if (error.status === 401) {
            logout();
        }
        throw error;
    }
}

// ============================================
// AUTH
// ============================================

export async function login(email, password) {
    const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    return data;
}

export async function register(userData) {
    const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
    return data;
}

export function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('rol');
    window.location.href = 'index.html';
}

export function isAuthenticated() {
    return !!getToken();
}

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await request(`/products${params ? '?' + params : ''}`);
}

export async function getProductById(id) {
    return await request(`/products/${id}`);
}

export async function getCategories() {
    return await request('/products/categories');
}

export async function getLaboratories() {
    return await request('/products/laboratories');
}

export async function createProduct(productData) {
    return await request('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    });
}

export async function updateProduct(id, productData) {
    return await request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    });
}

export async function deleteProduct(id) {
    return await request(`/products/${id}`, {
        method: 'DELETE'
    });
}

// ============================================
// LOANS
// ============================================

export async function getLoans(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await request(`/loans${params ? '?' + params : ''}`);
}

export async function getMyLoans(tipo = 'all', page = 1, limit = 10) {
    return await request(`/loans/mis-prestamos?tipo=${tipo}&page=${page}&limit=${limit}`);
}

export async function getLoanById(id) {
    return await request(`/loans/${id}`);
}

export async function createLoan(loanData) {
    return await request('/loans', {
        method: 'POST',
        body: JSON.stringify(loanData)
    });
}

export async function approveLoan(id, observaciones = null) {
    return await request(`/loans/${id}/aprobar`, {
        method: 'PATCH',
        body: JSON.stringify({ observaciones })
    });
}

export async function rejectLoan(id, razon) {
    return await request(`/loans/${id}/rechazar`, {
        method: 'PATCH',
        body: JSON.stringify({ razon })
    });
}

export async function deliverLoan(id, observaciones = null) {
    return await request(`/loans/${id}/entregar`, {
        method: 'PATCH',
        body: JSON.stringify({ observaciones })
    });
}

export async function cancelLoan(id) {
    return await request(`/loans/${id}/cancelar`, {
        method: 'PATCH'
    });
}

export async function registerDevolutions(id, devoluciones) {
    return await request(`/loans/${id}/devoluciones`, {
        method: 'POST',
        body: JSON.stringify({ devoluciones })
    });
}

export async function getNotReturnedLoans(page = 1, limit = 10) {
    return await request(`/loans/no-devueltos?page=${page}&limit=${limit}`);
}

// ============================================
// MESSAGES
// ============================================

export async function getMessages(page = 1, limit = 10) {
    return await request(`/messages?page=${page}&limit=${limit}`);
}

export async function getMyMessages(page = 1, limit = 10) {
    return await request(`/messages/mios?page=${page}&limit=${limit}`);
}

export async function sendMessage(messageData) {
    return await request('/messages', {
        method: 'POST',
        body: JSON.stringify(messageData)
    });
}

export async function respondMessage(id, content) {
    return await request(`/messages/${id}/responder`, {
        method: 'PATCH',
        body: JSON.stringify({ content })
    });
}

export async function markMessageAsRead(id) {
    return await request(`/messages/${id}/leido`, {
        method: 'PATCH'
    });
}

// ============================================
// USERS
// ============================================

export async function getProfile() {
    return await request('/users/perfil');
}

export async function getUsers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await request(`/users${params ? '?' + params : ''}`);
}

// ============================================
// UTILITY
// ============================================

export function showError(message) {
    const alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', alertHtml);
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) alert.remove();
    }, 5000);
}

export function showSuccess(message) {
    const alertHtml = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', alertHtml);
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) alert.remove();
    }, 5000);
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function getStatusLabel(status) {
    const labels = {
        'PENDIENTE_APROBACION': 'Pendiente',
        'APROBADO': 'Aprobado',
        'ACTIVO': 'Activo',
        'RECHAZADO': 'Rechazado',
        'CANCELADO': 'Cancelado',
        'FINALIZADO': 'Finalizado',
        'PARCIALMENTE_DEVUELTO': 'Parcial'
    };
    return labels[status] || status;
}

export function getStatusClass(status) {
    const classes = {
        'PENDIENTE_APROBACION': 'warning',
        'APROBADO': 'info',
        'ACTIVO': 'success',
        'RECHAZADO': 'danger',
        'CANCELADO': 'secondary',
        'FINALIZADO': 'success',
        'PARCIALMENTE_DEVUELTO': 'warning'
    };
    return classes[status] || 'secondary';
}

export function getEquipmentStatusLabel(status) {
    const labels = {
        'PENDIENTE': 'Pendiente',
        'PRESTADO': 'Prestado',
        'DEVUELTO': 'Devuelto',
        'DEVUELTO_DAÑADO': 'Dañado',
        'NO_DEVUELTO': 'No Devuelto'
    };
    return labels[status] || status;
}

export function getEquipmentStatusClass(status) {
    const classes = {
        'PENDIENTE': 'warning',
        'PRESTADO': 'danger',
        'DEVUELTO': 'success',
        'DEVUELTO_DAÑADO': 'warning',
        'NO_DEVUELTO': 'danger'
    };
    return classes[status] || 'secondary';
}

export function checkRole(requiredRole) {
    const user = getUser();
    if (!user || user.role !== requiredRole) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}