const NAV_ESTUDIANTE = [
  { section: 'Principal' },
  { label: 'Dashboard',          icon: 'bi-house-fill',        href: 'dashboard-estudiante.html' },
  { section: 'Equipos' },
  { label: 'Catálogo de Equipos',icon: 'bi-cpu-fill',          href: 'catalogo.html' },
  { section: 'Mis Préstamos' },
  { label: 'Préstamos Activos',  icon: 'bi-box-seam-fill',     href: 'prestamos-activos.html' },
  { label: 'Historial',          icon: 'bi-clock-history',     href: 'historial-prestamos.html' },
  { section: 'Comunicación' },
  { label: 'Mis Mensajes',       icon: 'bi-chat-dots-fill',    href: 'mensajes-estudiante.html' },
  { section: 'Cuenta' },
  { label: 'Mi Perfil',          icon: 'bi-person-fill',       href: 'perfil.html' },
];

const NAV_ENCARGADO = [
  { section: 'Principal' },
  { label: 'Dashboard',             icon: 'bi-house-fill',         href: 'dashboard-encargado.html' },
  { section: 'Equipos' },
  { label: 'Gestión de Equipos',    icon: 'bi-cpu-fill',           href: 'gestion-equipos.html' },
  { section: 'Préstamos' },
  { label: 'Solicitudes Pendientes',icon: 'bi-hourglass-split',    href: 'solicitudes.html' },
  { label: 'Préstamos Activos',     icon: 'bi-box-seam-fill',      href: 'prestamos-encargado.html' },
  { label: 'Reporte No Devueltos',  icon: 'bi-exclamation-triangle-fill', href: 'reporte-no-devueltos.html' },
  { section: 'Comunicación' },
  { label: 'Mensajes',              icon: 'bi-chat-dots-fill',     href: 'mensajes-encargado.html' },
  { section: 'Cuenta' },
  { label: 'Mi Perfil',             icon: 'bi-person-fill',        href: 'perfil.html' },
];

function getUserData() {
  const userStr = sessionStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return { name: sessionStorage.getItem('nombre') || 'Usuario', role: sessionStorage.getItem('rol') || 'estudiante' };
}

function buildNav(role, activePage) {
  const user = getUserData();
  const userName = user.name;
  role = role || user.role;

  const items   = role === 'encargado' ? NAV_ENCARGADO : NAV_ESTUDIANTE;
  const rolLabel= role === 'encargado' ? 'Encargado' : 'Estudiante';
  const initials= (userName||'US').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  let nav = `
  <nav id="sidebar" class="d-flex flex-column flex-shrink-0 p-0 text-white sidebar-nav">
    <!-- Brand -->
    <a href="${role==='encargado'?'dashboard-encargado.html':'dashboard-estudiante.html'}"
       class="d-flex align-items-center gap-2 px-3 py-3 text-white text-decoration-none border-bottom border-white border-opacity-10 sidebar-brand">
      <span class="fs-4">🧪</span>
      <div>
        <div class="fw-bold lh-1" style="font-size:13px;">Préstamos Lab.</div>
        <div style="font-size:10px;opacity:.5;font-family:monospace;">ITESO · ESI3124N</div>
      </div>
    </a>
    <!-- Nav items -->
    <ul class="nav nav-pills flex-column mb-auto px-2 pt-2 flex-grow-1 overflow-auto">`;

  items.forEach(item => {
    if (item.section) {
      nav += `<li class="nav-item mt-2">
        <span class="text-uppercase px-2" style="font-size:9px;letter-spacing:1.5px;opacity:.4;font-weight:700;">${item.section}</span>
      </li>`;
    } else {
      const active = item.href === activePage ? 'active' : '';
      nav += `<li class="nav-item">
        <a href="${item.href}" class="nav-link text-white ${active} d-flex align-items-center gap-2 py-2 px-2 rounded sidebar-link">
          <i class="bi ${item.icon}" style="font-size:15px;width:18px;text-align:center;"></i>
          <span style="font-size:13px;">${item.label}</span>
        </a>
      </li>`;
    }
  });

  nav += `</ul>
    <!-- User footer -->
    <div class="border-top border-white border-opacity-10 px-3 py-2 d-flex align-items-center gap-2">
      <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-dark flex-shrink-0"
           style="width:34px;height:34px;background:#00c2a8;font-size:12px;">${initials}</div>
      <div class="flex-grow-1 overflow-hidden">
        <div class="fw-semibold text-truncate" style="font-size:12.5px;">${userName||'Usuario'}</div>
        <div style="font-size:10px;opacity:.45;font-family:monospace;">${rolLabel}</div>
      </div>
      <button class="btn btn-link text-white p-0 opacity-50" onclick="logout()" title="Cerrar sesión" style="font-size:18px;">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </nav>`;

  document.getElementById('sidebar-container').innerHTML = nav;
}

function logout() {
  if (confirm('¿Cerrar sesión?')) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('nombre');
    window.location.href = 'index.html';
  }
}
