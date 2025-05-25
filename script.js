const DEFAULT_USERS = [
    { username: "admin", password: "admin", role: "admin" },
    { username: "staff", password: "staff", role: "staff" }
  ];
  
  const DEFAULT_PRODUCTS = [
    { id: 1, name: "Cheese Burger", price: 60, stock: 100 },
    { id: 2, name: "French Fries", price: 30, stock: 200 },
    { id: 3, name: "Soda", price: 30, stock: 80 }
  ];
  
  const DEFAULT_SALES = [
    { date: "2024-01-10", products: [{ name: "Cheese Burger", qty: 1 }], amount: 60, user: "staff" },
    { date: "2024-02-15", products: [{ name: "Regular Burger", qty: 2 }], amount: 100, user: "staff" },
    { date: "2024-03-20", products: [{ name: "French Fries", qty: 3 }], amount: 90, user: "staff" },
    { date: "2024-04-05", products: [{ name: "Chicken Burger", qty: 4 }], amount: 280, user: "staff" },
    { date: "2024-05-12", products: [{ name: "Soda", qty: 5 }], amount: 150, user: "staff" },
    { date: "2024-06-18", products: [{ name: "Sundae", qty: 6 }], amount: 300, user: "staff" },
    { date: "2024-07-22", products: [{ name: "French Fries", qty: 7 }], amount: 210, user: "staff" },
    { date: "2024-08-30", products: [{ name: "Regular Burger", qty: 8 }], amount: 400, user: "staff" },
    { date: "2024-09-14", products: [{ name: "Regular Burger", qty: 9 }], amount: 450, user: "staff" },
    { date: "2024-10-03", products: [{ name: "French Fries", qty: 10 }], amount: 300, user: "staff" },
    { date: "2024-11-11", products: [{ name: "Sundae", qty: 11 }], amount: 550, user: "staff" },
    { date: "2024-12-25", products: [{ name: "Soda", qty: 12 }], amount: 360, user: "staff" }
  ];
  
  // --- LocalStorage kineme ng default anes ---
  if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
  if (!localStorage.getItem("products")) localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
  if (!localStorage.getItem("sales")) localStorage.setItem("sales", JSON.stringify(DEFAULT_SALES));
  
  // --- Utility shits ---
  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return document.querySelectorAll(sel); }
  function getUsers() { return JSON.parse(localStorage.getItem("users")); }
  function setUsers(users) { localStorage.setItem("users", JSON.stringify(users)); }
  function getProducts() { return JSON.parse(localStorage.getItem("products")); }
  function setProducts(products) { localStorage.setItem("products", JSON.stringify(products)); }
  function getSales() { return JSON.parse(localStorage.getItem("sales")); }
  function setSales(sales) { localStorage.setItem("sales", JSON.stringify(sales)); }
  function getCurrentUser() { return JSON.parse(localStorage.getItem("currentUser")); }
  function setCurrentUser(user) { localStorage.setItem("currentUser", JSON.stringify(user)); }
  function logout() { localStorage.removeItem("currentUser"); location.hash = "#login"; }
  
  // --- LIPAT ---
  const routes = {
    login: renderLogin,
    admin_dashboard: renderAdminDashboard,
    admin_controlling: renderAdminControlling,
    admin_user_management: renderAdminUserManagement,
    admin_product_management: renderAdminProductManagement,
    admin_list_of_supply: renderAdminListOfSupply,
    admin_inventory: renderAdminInventory,
    admin_transaction_history: renderAdminTransactionHistory,
    admin_sales_report: renderAdminSalesReport,
    admin_user_settings: renderAdminUserSettings,
    staff_pos: renderStaffPOS,
    staff_product_management: renderStaffProductManagement
  };
  
  function route() {
    const user = getCurrentUser();
    let hash = location.hash.replace("#", "");
    if (!user && hash !== "login") {
      location.hash = "#login";
      return;
    }
    if (user && hash === "login") {
      location.hash = user.role === "admin" ? "#admin_dashboard" : "#staff_pos";
      return;
    }
    if (!hash) {
      location.hash = user ? (user.role === "admin" ? "#admin_dashboard" : "#staff_pos") : "#login";
      return;
    }
    if (routes[hash]) {
      routes[hash]();
    } else {
      $("#app").innerHTML = "<div class='main'><h2>Page not found</h2></div>";
    }
  }
  
  // --- Narvs ---
function renderSidebar(role, active) {
  if (window.innerWidth <= 900) return ""; // Hide sidebar sa mobile
  if (role === "admin") {
    return `
        <div class="sidebar">
          <div class="logo"><img src="White-logo.png" alt="Logo" width="60"> CraveStop POS<br><span style="font-size:0.8em;font-weight:normal;">Admin</span></div>
          <div class="menu">
            <a href="#admin_dashboard" class="${active === 'admin_dashboard' ? 'active' : ''}">Monitoring</a>
            <a href="#admin_controlling" class="${active === 'admin_controlling' ? 'active' : ''}">Controlling</a>
            <a href="#admin_user_management" class="${active === 'admin_user_management' ? 'active' : ''}">User Management</a>
            <a href="#admin_product_management" class="${active === 'admin_product_management' ? 'active' : ''}">Product Management</a>
            <a href="#admin_list_of_supply" class="${active === 'admin_list_of_supply' ? 'active' : ''}">List of Supply</a>
            <a href="#admin_inventory" class="${active === 'admin_inventory' ? 'active' : ''}">Inventory</a>
            <a href="#admin_transaction_history" class="${active === 'admin_transaction_history' ? 'active' : ''}">Transaction History</a>
            <a href="#admin_sales_report" class="${active === 'admin_sales_report' ? 'active' : ''}">Sales Report</a>
            <a href="#admin_user_settings" class="${active === 'admin_user_settings' ? 'active' : ''}">User Settings</a>
          </div>
          <button class="logout" onclick="logout()">Log out</button>
        </div>
      `;
  } else {
    return `
        <div class="sidebar">
          <div class="logo"><img src="White-logo.png" alt="Logo" width="60"> CraveStop POS<br><span style="font-size:0.8em;font-weight:normal;">Staff</span></div>
          <div class="menu">
            <a href="#staff_pos" class="${active === 'staff_pos' ? 'active' : ''}">POS</a>
            <a href="#staff_product_management" class="${active === 'staff_product_management' ? 'active' : ''}">Product Management</a>
          </div>
          <button class="logout" onclick="logout()">Log out</button>
        </div>
      `;
  }
}

// Enhanced Mobile Header Function
function renderMobileHeader(role, active) {
  if (window.innerWidth > 900) return "";
  
  let menuSections = "";
  if (role === "admin") {
    menuSections = `
      <div class="menu-section">
        <div class="menu-section-title">Dashboard</div>
        <a href="#admin_dashboard" class="menu-item ${active === 'admin_dashboard' ? 'active' : ''}">Monitoring</a>
        <a href="#admin_controlling" class="menu-item ${active === 'admin_controlling' ? 'active' : ''}">Controlling</a>
      </div>
      <div class="menu-section">
        <div class="menu-section-title">Management</div>
        <a href="#admin_user_management" class="menu-item ${active === 'admin_user_management' ? 'active' : ''}">User Management</a>
        <a href="#admin_product_management" class="menu-item ${active === 'admin_product_management' ? 'active' : ''}">Product Management</a>
        <a href="#admin_list_of_supply" class="menu-item ${active === 'admin_list_of_supply' ? 'active' : ''}">List of Supply</a>
        <a href="#admin_inventory" class="menu-item ${active === 'admin_inventory' ? 'active' : ''}">Inventory</a>
      </div>
      <div class="menu-section">
        <div class="menu-section-title">Reports</div>
        <a href="#admin_transaction_history" class="menu-item ${active === 'admin_transaction_history' ? 'active' : ''}">Transaction History</a>
        <a href="#admin_sales_report" class="menu-item ${active === 'admin_sales_report' ? 'active' : ''}">Sales Report</a>
      </div>
      <div class="menu-section">
        <div class="menu-section-title">Settings</div>
        <a href="#admin_user_settings" class="menu-item ${active === 'admin_user_settings' ? 'active' : ''}">User Settings</a>
      </div>
    `;
  } else {
    menuSections = `
      <div class="menu-section">
        <div class="menu-section-title">Operations</div>
        <a href="#staff_pos" class="menu-item ${active === 'staff_pos' ? 'active' : ''}">POS</a>
        <a href="#staff_product_management" class="menu-item ${active === 'staff_product_management' ? 'active' : ''}">Product Management</a>
      </div>
    `;
  }

  return `
    <div class="mobile-header">
      <div class="logo-section">
        <img src="White-logo.png" alt="Logo" width="52">
        <span>CraveStop POS</span>
      </div>
      <button class="menu-toggle" id="menuToggle">
        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
    
    <div class="mobile-menu-overlay" id="menuOverlay"></div>
    
    <div class="mobile-menu" id="mobileMenu">
      <div class="menu-header">
        <h3>CraveStop POS</h3>
        <div class="role-badge">${role === 'admin' ? 'Admin Panel' : 'Staff Panel'}</div>
      </div>
      
      <div class="menu-content">
        ${menuSections}
      </div>

      <div class="logout-section">
        <button class="logout-btn" onclick="logout()">Log Out</button>
      </div>
    </div>
  `;
}

// Enhanced Mobile Menu Setup Function
function setupMobileMenu() {
  if (window.innerWidth > 900) return;
  
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuItems = document.querySelectorAll('.menu-item');

  if (!menuToggle || !mobileMenu || !menuOverlay) return;

  function toggleMenu() {
    const isActive = mobileMenu.classList.contains('active');
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    menuToggle.classList.add('active');
    mobileMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  menuToggle.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', closeMenu);

  // Close menu when clicking on menu items
  menuItems.forEach(item => {
    item.addEventListener('click', closeMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}
  
  // --- Login Page ---
  function renderLogin() {
    $("#app").innerHTML = `
      <div class="login-center-wrap">
        <div class="login-card">
          <div class="login-avatar-outer">
            <img src="logo.png" alt="Logo" style="width:100px;object-fit:contain;border-radius:50%;"/>
        </div>
          <h1>Welcome</h1>
          <p>Enter your username and password to access your account.</p>
        <form id="loginForm">
            <div class="floating-group">
              <input type="text" id="loginUser" class="floating-input" required placeholder=" " autocomplete="username">
              <label class="floating-label" for="loginUser">Username</label>
          </div>
            <div class="floating-group">
              <input type="password" id="loginPass" class="floating-input" required placeholder=" " autocomplete="current-password">
              <label class="floating-label" for="loginPass">Password</label>
          </div>
            <button class="login-btn" type="submit">Log in</button>
        <div id="loginError" style="color:#e74c3c;margin-top:12px;"></div>
          </form>
        </div>
      </div>
    `;
    $("#loginForm").onsubmit = function(e) {
      e.preventDefault();
      const username = $("#loginUser").value.trim();
      const password = $("#loginPass").value.trim();
      const user = getUsers().find(u => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        location.hash = user.role === "admin" ? "#admin_dashboard" : "#staff_pos";
      } else {
        $("#loginError").textContent = "Invalid username or password.";
      }
    };
  }
  
  // --- Admin Page ---
function renderAdminDashboard() {
  const user = getCurrentUser();
  const products = getProducts();
  const sales = getSales();
  const today = new Date().toISOString().slice(0, 10);
  const todaySales = sales.filter(s => s.date === today).reduce((a, b) => a + b.amount, 0);
  const activeUsers = getUsers().length;
  const lowStock = products.filter(p => p.stock < 10).length;
  const monthlySales = Array(12).fill(0);
  sales.forEach(s => {
    const m = new Date(s.date).getMonth();
    monthlySales[m] += s.amount;
  });
  $("#app").innerHTML = `
      ${renderSidebar(user.role, "admin_dashboard")}
      ${renderMobileHeader(user.role, "admin_dashboard")}
      <div class="main">
        <h1 style="text-align:center;">System Monitoring</h1>
        <div class="cards">
          <div class="card">
            <div>Today's Sales</div>
            <div class="value info">₱${todaySales.toLocaleString()}</div>
          </div>
          <div class="card">
            <div>Active Users</div>
            <div class="value success">${activeUsers}</div>
          </div>
          <div class="card">
            <div>Low Stock Items</div>
            <div class="value danger">${lowStock}</div>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="salesChart" width="600" height="300"></canvas>
        </div>
      </div>
    `;
  drawChart("salesChart", monthlySales);
  setupMobileMenu();
}
  
  function renderAdminControlling() {
    const user = getCurrentUser();
    let lastBackup = localStorage.getItem('lastBackup') || 'Never';
    let systemOnline = localStorage.getItem('systemOnline');
    if (systemOnline === null) systemOnline = 'true';
    function formatDateTime(date) {
      const d = new Date(date);
      const options = { month: 'numeric', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit' };
      return d.toLocaleString(undefined, options);
    }
    $("#app").innerHTML = `
      ${renderSidebar(user.role, "admin_controlling")}
      ${renderMobileHeader(user.role, "admin_controlling")}
      <div class="main" style="background:#ededed;min-height:100vh;">
        <h1 style="text-align:center;font-weight:700;margin-bottom:18px;">Control System</h1>
        <div class="admin-control-wrap">
          <div class="admin-control-card">
            <h2>Database Backup</h2>
            <button class="admin-control-btn" id="backupBtn">Create Backup</button>
            <div class="admin-control-desc">Last backup: <span id="lastBackupTime">${lastBackup === 'Never' ? 'Never' : formatDateTime(lastBackup)}</span></div>
          </div>
          <div class="admin-control-card">
            <h2>System Status</h2>
            <label class="switch">
              <input type="checkbox" id="systemStatusToggle" ${systemOnline === 'true' ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
            <div class="admin-control-status" id="systemStatusText">POS System is ${systemOnline === 'true' ? 'Online' : 'Offline'}</div>
          </div>
        </div>
      </div>
    `;
    $("#backupBtn").onclick = function() {
      const now = new Date();
      localStorage.setItem('lastBackup', now.toISOString());
      $("#lastBackupTime").textContent = formatDateTime(now);
      alert('Database backup created successfully!');
    };
    $("#systemStatusToggle").onchange = function() {
      const online = this.checked;
      localStorage.setItem('systemOnline', online ? 'true' : 'false');
      $("#systemStatusText").textContent = `POS System is ${online ? 'Online' : 'Offline'}`;
    };
    setupMobileMenu();
  }
  
 function renderAdminUserManagement() {
  const user = getCurrentUser();
  let users = getUsers();

  $("#app").innerHTML = `
    ${renderSidebar(user.role, "admin_user_management")}
    ${renderMobileHeader(user.role, "admin_user_management")}
    <div class="main">
      <h1 style="text-align:center;">User Management</h1>
      <button class="btn-add" onclick="showAddUser()">Add User</button>
      <table class="table">
        <tr><th>Username</th><th>Role</th><th>Action</th></tr>
        ${users.map(u => `
          <tr>
            <td>${u.username}</td>
            <td>${u.role}</td>
            <td> 
              <button class="btn" onclick="editUser('${u.username}')">Edit</button>
              <button class="btn danger" onclick="deleteUser('${u.username}')">Delete</button>
            </td>
          </tr>
        `).join("")}
      </table>
      <div id="addUserModal" style="
      display:none;
      position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;">
        <form id="addUserForm" style="background:#fff;padding:24px;border-radius:12px;box-shadow:0 2px 8px #0002;width:320px;position:relative;">
        
        
          <h3 id="userFormTitle">Add User</h3>
          <div class="form-group">
            <label>Username</label>
            <input type="text" id="newUsername" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="newPassword" required>
          </div>
          <div class="form-group">
            <label>Role</label>
            <select id="newRole">
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <input type="hidden" id="isEditMode" value="false">
          <button class="btn" type="submit">Save</button>
          <button class="btn secondary" type="button" onclick="hideAddUser()">Cancel</button>
        </form>
      </div>
    </div>
  `;

  // New edit function
  window.editUser = function (username) {
    const userToEdit = users.find(u => u.username === username);
    if (!userToEdit) return;

    // update ang form para sa edit deyy
    $("#userFormTitle").textContent = "Edit User";
    $("#newUsername").value = userToEdit.username;
    $("#newPassword").value = userToEdit.password;
    $("#newRole").value = userToEdit.role;
    $("#isEditMode").value = "true";
    $("#addUserModal").style.display = "flex";
  };

  // Existing functions (unchanged but included for completeness)
  window.showAddUser = function () {
    $("#userFormTitle").textContent = "Add User";
    $("#newUsername").value = "";
    $("#newPassword").value = "";
    $("#newRole").value = "admin";
    $("#isEditMode").value = "false";
    $("#addUserModal").style.display = "flex";
  };

  window.hideAddUser = function () {
    $("#addUserModal").style.display = "none";
  };

  window.deleteUser = function (username) {
    if (confirm("Delete user?")) {
      users = users.filter(u => u.username !== username);
      setUsers(users);
      renderAdminUserManagement();
    }
  };

  // Modified form submission
  $("#addUserForm").onsubmit = function (e) {
    e.preventDefault();
    const username = $("#newUsername").value.trim();
    const password = $("#newPassword").value.trim();
    const role = $("#newRole").value;
    const isEditMode = $("#isEditMode").value === "true";

    if (isEditMode) {
      // Update existing user
      users = users.map(u =>
        u.username === username ? { ...u, password, role } : u
      );
    } else {
      // Add new user
      if (users.find(u => u.username === username)) {
        alert("Username already exists.");
        return;
      }
      users.push({ username, password, role });
    }

    setUsers(users);
    hideAddUser();
    renderAdminUserManagement();
  };

  setupMobileMenu();
}
  
  function renderAdminProductManagement(activeMenu) {
    const user = getCurrentUser();
    let products = getProducts();
    let searchTerm = '';
    if (!activeMenu) activeMenu = user.role === 'admin' ? 'admin_product_management' : 'staff_product_management';

    function renderProductTable(filteredProducts) {
      return `
        <table class="table">
          <tr><th>Name</th><th>Price</th><th>Stock</th><th class="action">Action</th></tr>
        ${filteredProducts.map(p => `
            <tr>
              <td>${p.name}</td>
              <td>₱${p.price}</td>
              <td>${p.stock}</td>
              <td>
                <button class="btn" onclick="editProduct(${p.id})">Edit</button>
                <button class="btn danger pdct" onclick="deleteProduct(${p.id})">Delete</button>
              </td>
            </tr>
          `).join("")}
        </table>
    `;
    }

    function updateProductList() {
      const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      document.getElementById('productTableContainer').innerHTML = renderProductTable(filtered);
    }

    $("#app").innerHTML = `
    ${renderSidebar(user.role, "admin_product_management")}
    ${renderMobileHeader(user.role, "admin_product_management")}
    <div class="main">
      <h1 style="text-align:center;">Product Management</h1>
      <div style="max-width:400px;margin:0 auto 18px auto;">
        <input type="text" id="productSearch" placeholder="Search product name..." style="width:100%;padding:10px 14px;font-size:1em;border-radius:24px;border:2px solid #1abc60;outline:none;">
      </div>
      <button class="btn" onclick="showAddProduct()">Add Product</button>
      <div id="productTableContainer">
        ${renderProductTable(products)}
      </div>
      <div id="addProductModal" style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;">
        <form id="addProductForm" style="background:#fff;padding:24px;border-radius:12px;box-shadow:0 2px 8px #0002;width:320px;position:relative;">
        
          <h3 id="productFormTitle">Add Product</h3>
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="productName" required>
          </div>
          <div class="form-group">
            <label>Price</label>
            <input type="number" id="productPrice" required>
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input type="number" id="productStock" required>
          </div>
          <input type="hidden" id="productId">
          <button class="btn" type="submit">Save</button>
          <button class="btn secondary" type="button" onclick="hideAddProduct()">Cancel</button>
        </form>
      </div>
    </div>
    `;

    // Search bar logic
    document.getElementById('productSearch').addEventListener('input', function(e) {
      searchTerm = e.target.value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
      document.getElementById('productTableContainer').innerHTML = renderProductTable(filtered);
    });

    // Add product modal functions
    window.showAddProduct = function() {
      $("#addProductModal").style.display = "flex";
      $("#productFormTitle").textContent = "Add Product";
      $("#productName").value = "";
      $("#productPrice").value = "";
      $("#productStock").value = "";
      $("#productId").value = "";
    };

    window.hideAddProduct = function() {
      $("#addProductModal").style.display = "none";
    };

    //edit product ganun
    window.editProduct = function(id) {
      const p = products.find(p => p.id === id);
      if (!p) return;
      $("#addProductModal").style.display = "flex";
      $("#productFormTitle").textContent = "Edit Product";
      $("#productName").value = p.name;
      $("#productPrice").value = p.price;
      $("#productStock").value = p.stock;
      $("#productId").value = p.id;
    };

    window.deleteProduct = function(id) {
      if (confirm("Delete product?")) {
        products = products.filter(p => p.id !== id);
        setProducts(products);
        renderAdminProductManagement(activeMenu);
      }
    };

    // Form submission
    $("#addProductForm").onsubmit = function(e) {
      e.preventDefault();
      const name = $("#productName").value.trim();
      const price = parseFloat($("#productPrice").value);
      const stock = parseInt($("#productStock").value);
      const id = $("#productId").value;
      
      if (id) {
        // Edit existing product
        products = products.map(p => p.id == id ? { ...p, name, price, stock } : p);
      } else {
        // Add new product
        const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, price, stock });
      }
      
      setProducts(products);
      hideAddProduct();
      renderAdminProductManagement(activeMenu);
    };

    setupMobileMenu();
  }
  
  const DEFAULT_SUPPLIES = [
    { name: 'Burger Buns', unit: 'pcs', price: 200, stock: 280, lastRestock: '05/20/25', expiry: '06/06/25' },
    { name: 'Lettuce', unit: 'heads', price: 200, stock: 50, lastRestock: '05/20/25', expiry: '06/06/25' },
    { name: 'Cheese Slices', unit: 'slices', price: 150, stock: 300, lastRestock: '05/20/25', expiry: '06/06/25' },
    { name: 'French Fries', unit: 'packs', price: 120, stock: 200, lastRestock: '05/20/25', expiry: '06/06/25' },
    { name: 'Soda', unit: 'can', price: 40, stock: 200, lastRestock: '05/20/25', expiry: '06/06/25' }
  ];
  if (!localStorage.getItem('supplies')) localStorage.setItem('supplies', JSON.stringify(DEFAULT_SUPPLIES));
  function getSupplies() { return JSON.parse(localStorage.getItem('supplies')); }
  function setSupplies(supplies) { localStorage.setItem('supplies', JSON.stringify(supplies)); }

  //function para sa list of supply
  function renderAdminListOfSupply() {
    const user = getCurrentUser();
    let supplies = getSupplies();
    let searchTerm = '';
    const LOW_STOCK_THRESHOLD = 20;
  
    function renderSummaryCards(filteredSupplies) {
      const total = filteredSupplies.length;
      const lowStock = filteredSupplies.filter(s => s.stock < LOW_STOCK_THRESHOLD).length;
      return `
          <div style="display:flex;gap:0%;justify-content:center;margin-bottom:18px; ">
          <div style="background:#fff;box-shadow:0 2px 8px #0001;border-radius:12px;padding:18px 32px;min-width:100px;text-align:center; margin:20px;">
            <div style="font-weight:bold;font-size:1.em;">Total Supplies</div>
            <div style="color:#1abc60;font-size:2em;font-weight:bold;">${total}</div>
          </div>
          <div style="background:#fff;box-shadow:0 2px 8px #0001;border-radius:12px;padding:18px 32px;min-width:100px;text-align:center;margin:20px;">
            <div style="font-weight:bold;font-size:1.2em;">Low Stock</div>
            <div style="color:red;font-size:2em;font-weight:bold;">${lowStock}</div>
          </div>
        </div>
      `;
    }
  
    function renderSupplyList(filteredSupplies) {
      if (filteredSupplies.length === 0) {
        return `<div style='text-align:center;color:#888;margin-top:32px;'>No supplies found.</div>`;
      }
      return filteredSupplies.map(s => `
        <div style="background:#ededed;border-radius:8px;padding:18px 18px 10px 18px;margin-bottom:12px;">
          <div style="font-size:1.2em;font-weight:600;margin-bottom:4px;">${s.name}</div>
          <div style="font-size:0.98em;color:#444;">unit: ${s.unit} | unit price: ₱${s.price} | stock:${s.stock} ${s.unit.endsWith('s') ? '' : 's'} | last restock: ${s.lastRestock} | expiry date: ${s.expiry}</div>
        </div>
      `).join('');
    }
  
    function updateSupplyList() {
      const filtered = supplies.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
      document.getElementById('supplySummaryCards').innerHTML = renderSummaryCards(filtered);
      document.getElementById('supplyListContainer').innerHTML = renderSupplyList(filtered);
    }
  
    $("#app").innerHTML = `
      ${renderSidebar(user.role, "admin_list_of_supply")}
      ${renderMobileHeader(user.role, "admin_list_of_supply")}
      <div class="main">
        <h1 style="text-align:center;">Supply List</h1>
        <div style="max-width:500px;margin:0 auto 18px auto;display:flex;align-items:center;gap:0;">
          <input type="text" id="supplySearch" placeholder="Search supply..." style="flex:1;padding:12px 18px;font-size:1em;border-radius:24px;border:2px solid #1abc60;background:#fafafa;outline:none;">
        </div>
        <div id="supplySummaryCards">
          ${renderSummaryCards(supplies)}
        </div>
        <div id="supplyListContainer" style="margin-top:8px;">
          ${renderSupplyList(supplies)}
        </div>
      </div>
    `;
  
    // Search bar logic
    document.getElementById('supplySearch').addEventListener('input', function(e) {
      searchTerm = e.target.value;
      updateSupplyList();
    });
  
    setupMobileMenu();
  }
  
 //function para sa inventory
function renderAdminInventory() {
  const user = getCurrentUser();
  let supplies = getSupplies();
  let searchTerm = '';
  let selectedCategory = 'All';
  const LOW_STOCK_THRESHOLD = 10;

  //categoriesssss
  const categories = ['All', ...Array.from(new Set(supplies.map(s => s.category || 'Uncategorized'))).filter(c => c !== undefined)];

  function renderSummaryCards(filteredSupplies) {
    const total = filteredSupplies.length;
    const lowStock = filteredSupplies.filter(s => s.stock < LOW_STOCK_THRESHOLD).length;
    return `
      <div style="display:flex;gap:0%;justify-content:center;margin-bottom:18px;">
        <div style="background:#fff;box-shadow:0 2px 8px #0001;border-radius:12px;padding:18px 32px;min-width:100px;text-align:center;margin:20px;">
          <div style="font-weight:bold;font-size:1.em;">Total Supplies</div>
          <div style="color:#1abc60;font-size:2em;font-weight:bold;">${total}</div>
        </div>
        <div style="background:#fff;box-shadow:0 2px 8px #0001;border-radius:12px;padding:18px 32px;min-width:100px;text-align:center;margin:20px;">
          <div style="font-weight:bold;font-size:1.2em;">Low Stock</div>
          <div style="color:red;font-size:2em;font-weight:bold;">${lowStock}</div>
        </div>
      </div>
      `
  }

  function getStatus(s) {
    return s.stock < LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In stock';
  }

  function renderSupplyList(filteredSupplies) {
    if (filteredSupplies.length === 0) {
      return `<div style='text-align:center;color:#888;margin-top:32px;'>No supplies found.</div>`;
    }
    return filteredSupplies.map(s => {
      const realIdx = supplies.findIndex(x => x.name === s.name && x.category === s.category && x.stock === s.stock && x.expiry === s.expiry);
      return `
        <div style="background:#ededed;border-radius:8px;padding:18px 18px 10px 18px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:1.2em;font-weight:600;margin-bottom:4px;">${s.name}</div>
        <div style="font-size:0.98em;color:#444;">Category: ${s.category || 'Uncategorized'} | Quantity: ${s.stock} | Expiry Date: ${s.expiry || ''}</div>
        <div style="font-size:0.98em;color:#444;">${s.lastRestock ? 'Last Restock: ' + s.lastRestock + ' | ' : ''}Status: <span style='color:${getStatus(s) === 'Low Stock' ? 'red' : '#1abc60'};font-weight:bold;'>${getStatus(s)}</span></div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn" onclick="editSupply(${realIdx})">Edit</button>
        <button class="btn danger" onclick="deleteSupply(${realIdx})">Delete</button>
      </div>
    </div>
        `;
    }).join('');
  }

  function updateSupplyList() {
    let filtered = supplies.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedCategory !== 'All') filtered = filtered.filter(s => (s.category || 'Uncategorized') === selectedCategory);
    document.getElementById('inventorySummaryCards').innerHTML = renderSummaryCards(filtered);
    document.getElementById('inventoryListContainer').innerHTML = renderSupplyList(filtered);
  }

  $("#app").innerHTML = `
      ${renderSidebar(user.role, "admin_inventory")}
      ${renderMobileHeader(user.role, "admin_inventory")}
      <div class="main">
      <h1 style="text-align:center;">Inventory</h1>
      <div style="max-width:600px;margin:0 auto 18px auto;display:flex;align-items:center;gap:12px;">
        <select id="categoryFilter" style="padding:10px 14px;font-size:1em;border-radius:8px;border:2px solid #1abc60;outline:none;">
          ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <button class="btn" id="addSupplyBtn" style="margin-left:8px;">Add Supply</button>
      </div>
      <div id="inventorySummaryCards">
        ${renderSummaryCards(supplies)}
      </div>
      <div id="inventoryListContainer" style="margin-top:8px;">
        ${renderSupplyList(supplies)}
      </div>
      <div id="supplyModal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0005;z-index:1000;align-items:center;justify-content:center;overflow-y:auto;">
        <form id="supplyForm" style="background:#fff;padding:32px 24px;border-radius:12px;box-shadow:0 2px 8px #0002;max-width:350px;width:90vw;">
          <h3 id="supplyFormTitle">Add Supply</h3>
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="supplyName" required>
          </div>
          <div class="form-group">
            <label>Category</label>
            <input type="text" id="supplyCategory" required placeholder="e.g. Bakery, Vegetables">
          </div>
          <div class="form-group">
            <label>Quantity</label>
            <input type="number" id="supplyStock" required>
          </div>
          <div class="form-group">
            <label>Expiry Date</label>
            <input type="date" id="supplyExpiry">
          </div>
          <div class="form-group">
            <label>Last Restock</label>
            <input type="date" id="supplyRestock">
          </div>
          <div class="form-group">
            <label>Unit</label>
            <input type="text" id="supplyUnit" required placeholder="e.g. pcs, packs">
          </div>
          <div class="form-group">
            <label>Unit Price</label>
            <input type="number" id="supplyPrice" required>
          </div>
          <input type="hidden" id="supplyIndex">
          <button class="btn" type="submit">Save</button>
          <button class="btn secondary" type="button" id="cancelSupplyBtn">Cancel</button>
        </form>
      </div>
    </div>
    `;

  // search bar lologic
  document.getElementById('categoryFilter').addEventListener('change', function (e) {
    selectedCategory = e.target.value;
    updateSupplyList();
  });

  //add supply modal shits
  document.getElementById('addSupplyBtn').onclick = function () {
    showSupplyModal();
  };
  document.getElementById('cancelSupplyBtn').onclick = function () {
    hideSupplyModal();
  };

  window.editSupply = function (idx) {
    showSupplyModal(idx);
  };

  window.deleteSupply = function (idx) {
    if (confirm('Delete this supply?')) {
      supplies.splice(idx, 1);
      setSupplies(supplies);
      renderAdminInventory();
    }
  };

  function showSupplyModal(idx) {
    const modal = document.getElementById('supplyModal');
    modal.style.display = 'flex';
    if (typeof idx === 'number') {
      document.getElementById('supplyFormTitle').textContent = 'Edit Supply';
      const s = supplies[idx];
      document.getElementById('supplyName').value = s.name;
      document.getElementById('supplyCategory').value = s.category || '';
      document.getElementById('supplyStock').value = s.stock;
      document.getElementById('supplyExpiry').value = s.expiry || '';
      document.getElementById('supplyRestock').value = s.lastRestock || '';
      document.getElementById('supplyUnit').value = s.unit || '';
      document.getElementById('supplyPrice').value = s.price || '';
      document.getElementById('supplyIndex').value = idx;
    } else {
      document.getElementById('supplyFormTitle').textContent = 'Add Supply';
      document.getElementById('supplyName').value = '';
      document.getElementById('supplyCategory').value = '';
      document.getElementById('supplyStock').value = '';
      document.getElementById('supplyExpiry').value = '';
      document.getElementById('supplyRestock').value = '';
      document.getElementById('supplyUnit').value = '';
      document.getElementById('supplyPrice').value = '';
      document.getElementById('supplyIndex').value = '';
    }
  }

  function hideSupplyModal() {
    document.getElementById('supplyModal').style.display = 'none';
  }

  document.getElementById('supplyForm').onsubmit = function (e) {
    e.preventDefault();
    const idx = document.getElementById('supplyIndex').value;
    const newSupply = {
      name: document.getElementById('supplyName').value.trim(),
      category: document.getElementById('supplyCategory').value.trim(),
      stock: parseInt(document.getElementById('supplyStock').value),
      expiry: document.getElementById('supplyExpiry').value,
      lastRestock: document.getElementById('supplyRestock').value,
      unit: document.getElementById('supplyUnit').value.trim(),
      price: parseFloat(document.getElementById('supplyPrice').value)
    };
    if (idx !== '') {
      supplies[idx] = newSupply;
    } else {
      supplies.push(newSupply);
    }

    setSupplies(supplies);
    hideSupplyModal();
    renderAdminInventory();
  };

  setupMobileMenu();
}
  
  //function para sa transaction history
  function renderAdminTransactionHistory() {
    const user = getCurrentUser();
    let sales = getSales();
    let sortOrder = 'desc'; // 'desc' for newest first, 'asc' for oldest first

    function renderTable(sortedSales) {
      return `
        <table class="table">
        <tr><th>Date</th><th>Product</th><th>Amount</th><th>Payment</th><th>User</th></tr>
        ${sortedSales.map(s => `
            <tr>
              <td>${s.date}</td>
              <td>${s.products ? s.products.map(p => `${p.name} (x${p.qty})`).join(", ") : "N/A"}</td>
              <td>₱${s.amount}</td>
            <td>${s.payment || 'Cash'}</td>
              <td>${s.user}</td>
            </tr>
          `).join("")}
        </table>
      `;
    }

    function updateTable() {
      let sorted = [...sales];
      sorted.sort((a, b) => sortOrder === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));
      document.getElementById('transactionTableContainer').innerHTML = renderTable(sorted);
    }

    $("#app").innerHTML = `
       ${renderSidebar(user.role, "admin_transaction_history")}
    ${renderMobileHeader(user.role, "admin_transaction_history")}
    <div class="main">
      <h1 style="text-align:center;">Transaction History</h1>
      <div style="max-width:300px;margin:0 auto 18px auto;">
        <label for="sortOrder" style="font-weight:bold;">Sort by: </label>
        <select id="sortOrder" style="padding:8px 12px;border-radius:6px;font-size:1em;">
          <option value="desc">Newest to Oldest</option>
          <option value="asc">Oldest to Newest</option>
        </select>
      </div>
      <div id="transactionTableContainer">
        ${renderTable(sales.sort((a, b) => new Date(b.date) - new Date(a.date)))}
      </div>
      </div>
    `;

    document.getElementById('sortOrder').addEventListener('change', function(e) {
      sortOrder = e.target.value;
      updateTable();
    });

    setupMobileMenu();
  }
  
  function renderAdminSalesReport() {
    const user = getCurrentUser();
    const sales = getSales();
    const total = sales.reduce((a, b) => a + b.amount, 0);

    // Calculate top sales (by product quantity)
    const productSales = {};
    sales.forEach(sale => {
      if (sale.products) {
        sale.products.forEach(p => {
          if (!productSales[p.name]) productSales[p.name] = 0;
          productSales[p.name] += p.qty;
        });
      }
    });
    const topSales = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    function renderTable() {
      return `
      <table class="table" id="salesReportTable">
        <tr><th>Date</th><th>Product</th><th>Amount</th><th>Payment</th><th>User</th></tr>
          ${sales.map(s => `
            <tr>
              <td>${s.date}</td>
            <td>${s.products ? s.products.map(p => `${p.name} (x${p.qty})`).join(", ") : "N/A"}</td>
              <td>₱${s.amount}</td>
            <td>${s.payment || 'Cash'}</td>
              <td>${s.user}</td>
            </tr>
          `).join("")}
        </table>
      `;
    }

    function renderTopSales() {
      if (topSales.length === 0) return '<div style="color:#888;text-align:center;">No sales data.</div>';
      return `
      <table class="table" style="max-width:400px;margin:0 auto 0 auto;">
        <tr><th>Product</th><th>Total Sold</th></tr>
        ${topSales.map(([name, qty]) => `
          <tr><td>${name}</td><td>${qty}</td></tr>
        `).join('')}
      </table>
      `;
    }

    function printReport() {
      const printContents = `
      <div style='text-align:center;font-size:1.5em;font-weight:bold;margin-bottom:18px;'>Sales Report</div>
      <div style='display:flex;justify-content:center;margin-bottom:24px;gap:32px;'>
        <div style="background:#fff;box-shadow:0 2px 8px #0001;border-radius:12px;padding:18px 32px;min-width:200px;text-align:center;">
          <div>Total Sales</div>
          <div style="color:#1abc60;font-size:2em;font-weight:bold;">₱${total.toLocaleString()}</div>
      </div>
        <div style="background:#fff;box-shadow:0 2px 8px #0001;border-radius:12px;padding:18px 32px;min-width:200px;text-align:center;">
          <div style='font-size:1.2em;font-weight:bold;margin-bottom:8px;'>Top Sales</div>
          ${renderTopSales()}
        </div>
      </div>
      ${renderTable()}
      `;
      const win = window.open('', '', 'width=900,height=700');
      win.document.write(`
        <html><head><title>Sales Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
        th { background: #f8f8f8; }
        .center { text-align: center; }
      </style>
      </head><body>${printContents}</body></html>
      `);
      win.document.close();
      win.focus();
      win.print();
      setTimeout(() => win.close(), 1000);
    }

    $("#app").innerHTML = `
    ${renderSidebar(user.role, "admin_sales_report")}
    ${renderMobileHeader(user.role, "admin_sales_report")}
    <div class="main">
      <h1 style="text-align:center;">Sales Report</h1>
      <div style="display:flex;justify-content:center;gap:32px;flex-wrap:wrap;margin-bottom:24px;align-items:stretch;">
        <div class="card" style="max-width:300px;min-width:200px;text-align:center;display:flex;flex-direction:column;justify-content:center;">
          <div>Total Sales</div>
          <div class="value info" style="font-size:2em;">₱${total.toLocaleString()}</div>
        </div>
        <div class="card" style="max-width:400px;min-width:200px;text-align:center;display:flex;flex-direction:column;justify-content:center;">
          <div style='font-size:1.2em;font-weight:bold;margin-bottom:8px;'>Top Sales</div>
          <div id="topSalesContainer">${renderTopSales()}</div>
        </div>
      </div>
      <button class="btn" onclick="printReport()" style="margin-bottom:18px;display:block;margin-left:auto;margin-right:auto;">Print Report</button>
      <div id="salesReportTableContainer">
        ${renderTable()}
      </div>
    </div>
    `;

    window.printReport = printReport;
    setupMobileMenu();
  }
  
  function renderAdminUserSettings() {
    const user = getCurrentUser();
    let users = getUsers();
    const idx = users.findIndex(u => u.username === user.username);

    // use stored avatar if present, then balik sa default na avatar if walang stored avatar
    const avatar = users[idx].avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1abc60&color=fff&size=96`;
    $("#app").innerHTML = `
      ${renderSidebar(user.role, "admin_user_settings")}
      ${renderMobileHeader(user.role, "admin_user_settings")}
      <style>
      .floating-group { position: relative; margin-bottom: 20px; }
      .floating-input {
        width: 100%;
        padding: 14px 12px 14px 12px;
        font-size: 1em;
        border: 1.5px solid #ccc;
        border-radius: 8px;
        background: #fff;
        outline: none;
        transition: border 0.2s;
      }
      .floating-input:focus {
        border-color: #1abc60;
      }
      .floating-label {
        position: absolute;
        left: 12px;
        top: 14px;
        color: #888;
        font-size: 1em;
        pointer-events: none;
        background: #fff;
        padding: 0 4px;
        transition: 0.2s;
      }
      .floating-input:focus + .floating-label,
      .floating-input:not(:placeholder-shown) + .floating-label {
        top: -10px;
        left: 8px;
        font-size: 0.85em;
        color: #1abc60;
        background: #fff;
      }
      .avatar-upload {
        display: flex; flex-direction: column; align-items: center; margin-bottom: 18px;
      }
      .avatar-upload label {
        cursor: pointer;
        margin-top: 8px;
        display: inline-block;
        background: var(--primary);
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 8px 18px;
        font-size: 1em;
        font-family: inherit;
        transition: background 0.2s;
        box-shadow: 0 1px 4px #0001;
      }
      .avatar-upload input[type=file] {
        display: none;
      }
    </style>
      <div class="main">
      <h1 style="text-align:center;">User Settings</h1>
      <div style="max-width:400px;margin:0 auto;">
        <div style="background:#fff;box-shadow:0 2px 8px #0001;border-radius:12px;padding:32px 24px;text-align:center;margin-bottom:32px;">
          <form id="userSettingsForm" style="margin-top:0;text-align:left;">
            <div class="avatar-upload">
              <img id="avatarImg" src='${avatar}' alt='avatar' style='border-radius:50%;margin-bottom:4px;width:96px;height:96px;object-fit:cover;'>
              <label for="avatarInput" tabindex="0">Change Picture</label>
              <input type="file" id="avatarInput" accept="image/*">
            </div>
            <div class="floating-group">
              <input type="text" id="profileUsername" class="floating-input" value="${user.username}" required placeholder=" " autocomplete="off">
              <label class="floating-label" for="profileUsername">Username</label>
            </div>
            <div class="floating-group">
              <input type="text" id="profileRole" class="floating-input" value="${user.role.charAt(0).toUpperCase() + user.role.slice(1)}" readonly placeholder=" ">
              <label class="floating-label" for="profileRole">Role</label>
            </div>
            <div class="floating-group">
              <input type="password" id="currentPassword" class="floating-input" placeholder=" " autocomplete="off">
              <label class="floating-label" for="currentPassword">Current Password</label>
            </div>
            <div class="floating-group">
              <input type="password" id="newPassword" class="floating-input" placeholder=" " autocomplete="off">
              <label class="floating-label" for="newPassword">New Password</label>
            </div>
            <div class="floating-group">
              <input type="password" id="confirmPassword" class="floating-input" placeholder=" " autocomplete="off">
              <label class="floating-label" for="confirmPassword">Confirm New Password</label>
            </div>
            <button class="btn" type="submit" style="width:100%;margin-top:8px;">Save Changes</button>
            <div id="settingsMsg" style="margin-top:12px;font-size:1em;"></div>
          </form>
        </div>
      </div>
      </div>
    `;

    //avatar
    document.getElementById('avatarInput').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        document.getElementById('avatarImg').src = evt.target.result;
        users = getUsers();
        const idx = users.findIndex(u => u.username === user.username);
        users[idx].avatar = evt.target.result;
        setUsers(users);
        setCurrentUser(users[idx]);
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('userSettingsForm').onsubmit = function(e) {
      e.preventDefault();
      const newUsername = document.getElementById('profileUsername').value.trim();
      const current = document.getElementById('currentPassword').value;
      const newPass = document.getElementById('newPassword').value;
      const confirm = document.getElementById('confirmPassword').value;
      users = getUsers();
      const idx = users.findIndex(u => u.username === user.username);
      //validation
      if(!newUsername) {
        document.getElementById('settingsMsg').textContent = 'Username cannot be empty';
        document.getElementById('settingsMsg').style.color = 'red';
        return;
      } 
      if(users.some((u, i) => u.username === newUsername && i !== idx)) {
        document.getElementById('settingsMsg').textContent = 'Username already exists.';
        document.getElementById('settingsMsg').style.color = 'red';
        return;
      }

      //change password
      if(current || newPass || confirm) {
        if(!current || !newPass || !confirm) {
          document.getElementById('settingsMsg').textContent = 'Fill all password fields to change password.';
          document.getElementById('settingsMsg').style.color = 'red';
          return;
        }
        if (users[idx].password !== current) {
          document.getElementById('settingsMsg').textContent = 'Current password is incorrect.';
          document.getElementById('settingsMsg').style.color = 'red';
          return;
        }
        if (newPass.length < 4) {
          document.getElementById('settingsMsg').textContent = 'Password must be at least 4 characters long.';
          document.getElementById('settingsMsg').style.color = 'red';
          return;
        }
        if (newPass !== confirm) {
          document.getElementById('settingsMsg').textContent = 'New passwords do not match.';
          document.getElementById('settingsMsg').style.color = 'red';
          return;
        }
        users[idx].password = newPass;
      }
      users[idx].username = newUsername;
      setUsers(users);
      setCurrentUser(users[idx]);
      document.getElementById('settingsMsg').textContent = 'Changes saved successfully.';
      document.getElementById('settingsMsg').style.color = '#1abc60';
      setTimeout(renderAdminUserSettings, 1200);
    };

    setupMobileMenu();
  }
  
  // --- Staff Page ---
  function renderStaffPOS() {
    const user = getCurrentUser();
    let products = getProducts();
    let cart = [];
    let paymentMethod = 'Cash';
    $("#app").innerHTML = `
      ${renderSidebar(user.role, "staff_pos")}
      ${renderMobileHeader(user.role, "staff_pos")}
      <div class="main">
        <h1>Point of Sale</h1>
        <div style="display:flex;flex-wrap:wrap;gap:24px;">
          <div style="flex:2;min-width:220px;">
            <h3>Products</h3>
            <table class="table">
              <tr><th>Name</th><th>Price</th><th>Stock</th><th></th></tr>
              ${products.map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td>₱${p.price}</td>
                  <td>${p.stock}</td>
                  <td>
                    <button class="btn" onclick="addToCart(${p.id})" ${p.stock<1?'disabled':''}>Add</button>
                  </td>
                </tr>
              `).join("")}
            </table>
          </div>
          <div style="flex:1;min-width:220px;">
            <h3>Cart</h3>
            <table class="table" id="cartTable">
              <tr><th>Name</th><th>Qty</th><th>Price</th><th></th></tr>
            </table>
            <div id="cartTotal" style="margin:12px 0;font-weight:bold;">Total: ₱0</div>
            <div style="margin-bottom:12px;">
              <label style="font-weight:bold;">Payment Method:</label><br>
              <select id="paymentMethod" style="width:100%;padding:8px 12px;border-radius:6px;border:1.5px solid #1abc60;font-size:1em;">
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <button class="btn" id="checkoutBtn" disabled>Checkout</button>
          </div>
        </div>
        <div id="receiptModal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0007;z-index:1000;align-items:center;justify-content:center;">
          <div style="background:#fff;padding:32px 24px;border-radius:16px;max-width:350px;width:95vw;box-shadow:0 2px 16px #0003;position:relative;">
            <h2 style="text-align:center;margin-bottom:12px;">Receipt</h2>
            <div id="receiptContent"></div>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:18px;">
              <button class="btn" id="printReceiptBtn">Print Receipt</button>
              <button class="btn secondary" id="closeReceiptBtn">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
    function updateCart() {
      const cartTable = $("#cartTable");
      cartTable.innerHTML = `<tr><th>Name</th><th>Qty</th><th>Price</th><th></th></tr>` +
        cart.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>₱${item.price*item.qty}</td>
            <td><button class="btn danger" onclick="removeFromCart(${item.id})">Remove</button></td>
          </tr>
        `).join("");
      const total = cart.reduce((a,b) => a+b.price*b.qty, 0);
      $("#cartTotal").textContent = "Total: ₱" + total;
      $("#checkoutBtn").disabled = cart.length === 0;
    }
    window.addToCart = function(id) {
      const p = products.find(p => p.id === id);
      if (!p || p.stock < 1) return;
      const item = cart.find(i => i.id === id);
      if (item) {
        if (item.qty < p.stock) item.qty++;
      } else {
        cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
      }
      updateCart();
    };
    window.removeFromCart = function(id) {
      cart = cart.filter(i => i.id !== id);
      updateCart();
    };
    $("#paymentMethod").addEventListener('change', function(e) {
      paymentMethod = e.target.value;
    });
    $("#checkoutBtn").onclick = function() {
      if (!cart.length) return;
      // Update stock
      products = products.map(p => {
        const item = cart.find(i => i.id === p.id);
        if (item) return { ...p, stock: p.stock - item.qty };
        return p;
      });
      setProducts(products);
      // Add sale
      const total = cart.reduce((a,b) => a+b.price*b.qty, 0);
      const sales = getSales();
      const saleObj = {
        id: Date.now(), // Unique transaction ID
        date: new Date().toISOString().slice(0,10),
        timestamp: new Date().toISOString(), // Full timestamp
        amount: total,
        user: user.username,
        products: cart.map(item => ({ name: item.name, qty: item.qty })),
        payment: paymentMethod
      };
      sales.push(saleObj);
      setSales(sales);
      // Show receipt modal
      showReceipt(saleObj);
      cart = [];
      updateCart();
    };
    function showReceipt(sale) {
      const modal = $("#receiptModal");
      const content = $("#receiptContent");
      content.innerHTML = `
        <div style='text-align:center;font-weight:bold;font-size:1.1em;margin-bottom:8px;'>CraveStop POS</div>
        <div style='font-size:0.98em;margin-bottom:8px;'>Date: ${sale.date}<br>Staff: ${sale.user}</div>
        <table style='width:100%;margin-bottom:8px;font-size:0.98em;'>
          <tr><th style='text-align:left;'>Item</th><th style='text-align:right;'>Qty</th><th style='text-align:right;'>Subtotal</th></tr>
          ${sale.products.map(p => `<tr><td>${p.name}</td><td style='text-align:right;'>${p.qty}</td><td style='text-align:right;'>₱${products.find(prod => prod.name === p.name)?.price * p.qty || ''}</td></tr>`).join('')}
        </table>
        <div style='margin-bottom:8px;'>Payment Method: <b>${sale.payment}</b></div>
        <div style='font-size:1.1em;font-weight:bold;'>Total: ₱${sale.amount}</div>
      `;
      modal.style.display = 'flex';
      $("#closeReceiptBtn").onclick = function() { modal.style.display = 'none'; };
      $("#printReceiptBtn").onclick = function() {
        const printContents = `
          <div style='text-align:center;font-weight:bold;font-size:1.1em;margin-bottom:8px;'>CraveStop POS</div>
          <div style='font-size:0.98em;margin-bottom:8px;'>Date: ${sale.date}<br>Staff: ${sale.user}</div>
          <table style='width:100%;margin-bottom:8px;font-size:0.98em;'>
            <tr><th style='text-align:left;'>Item</th><th style='text-align:right;'>Qty</th><th style='text-align:right;'>Subtotal</th></tr>
            ${sale.products.map(p => `<tr><td>${p.name}</td><td style='text-align:right;'>${p.qty}</td><td style='text-align:right;'>₱${products.find(prod => prod.name === p.name)?.price * p.qty || ''}</td></tr>`).join('')}
          </table>
          <div style='margin-bottom:8px;'>Payment Method: <b>${sale.payment}</b></div>
          <div style='font-size:1.1em;font-weight:bold;'>Total: ₱${sale.amount}</div>
        `;
        const win = window.open('', '', 'width=400,height=600');
        win.document.write(`<html><head><title>Receipt</title><style>body{font-family:Arial,sans-serif;margin:24px;}table{width:100%;border-collapse:collapse;}th,td{padding:4px 8px;}th{text-align:left;}</style></head><body>${printContents}</body></html>`);
        win.document.close();
        win.focus();
        win.print();
        setTimeout(() => win.close(), 1000);
      };
    }
    updateCart();
    setupMobileMenu();
  }
  
  function renderStaffProductManagement() {
    const user = getCurrentUser();
    $("#app").innerHTML = `
      ${renderSidebar(user.role, "staff_product_management")}
      ${renderMobileHeader(user.role, "staff_product_management")}
      <div class="main">
        <h1 style="text-align:center;">Product Management</h1>
        <div style="max-width:400px;margin:0 auto 18px auto;">
          <input type="text" id="productSearch" placeholder="Search product name..." style="width:100%;padding:10px 14px;font-size:1em;border-radius:24px;border:2px solid #1abc60;outline:none;">
        </div>
        <button class="btn" onclick="showAddProduct()">Add Product</button>
        <div id="productTableContainer">
          ${renderProductTable(getProducts())}
        </div>
        <div id="addProductModal" style="
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          z-index: 1000;
          justify-content: center;
          align-items: center;">
          <form id="addProductForm" style="background:#fff;padding:24px;border-radius:12px;box-shadow:0 2px 8px #0002;width:320px;position:relative;">
            <h3 id="productFormTitle">Add Product</h3>
            <div class="form-group">
              <label>Name</label>
              <input type="text" id="productName" required>
            </div>
            <div class="form-group">
              <label>Price</label>
              <input type="number" id="productPrice" required>
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input type="number" id="productStock" required>
            </div>
            <input type="hidden" id="productId">
            <button class="btn" type="submit">Save</button>
            <button class="btn secondary" type="button" onclick="hideAddProduct()">Cancel</button>
          </form>
        </div>
      </div>
    `;

    // Search bar logic
    document.getElementById('productSearch').addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = getProducts().filter(p => p.name.toLowerCase().includes(searchTerm));
      document.getElementById('productTableContainer').innerHTML = renderProductTable(filtered);
    });

    // Add product modal functions
    window.showAddProduct = function() {
      $("#addProductModal").style.display = "flex";
      $("#productFormTitle").textContent = "Add Product";
      $("#productName").value = "";
      $("#productPrice").value = "";
      $("#productStock").value = "";
      $("#productId").value = "";
    };

    window.hideAddProduct = function() {
      $("#addProductModal").style.display = "none";
    };

    window.editProduct = function(id) {
      const p = getProducts().find(p => p.id === id);
      if (!p) return;
      $("#addProductModal").style.display = "flex";
      $("#productFormTitle").textContent = "Edit Product";
      $("#productName").value = p.name;
      $("#productPrice").value = p.price;
      $("#productStock").value = p.stock;
      $("#productId").value = p.id;
    };

    window.deleteProduct = function(id) {
      if (confirm("Delete product?")) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        setProducts(products);
        renderStaffProductManagement();
      }
    };

    // Form submission
    $("#addProductForm").onsubmit = function(e) {
      e.preventDefault();
      const name = $("#productName").value.trim();
      const price = parseFloat($("#productPrice").value);
      const stock = parseInt($("#productStock").value);
      const id = $("#productId").value;
      
      let products = getProducts();
      if (id) {
        // Edit existing product
        products = products.map(p => p.id == id ? { ...p, name, price, stock } : p);
      } else {
        // Add new product
        const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, price, stock });
      }
      
      setProducts(products);
      hideAddProduct();
      renderStaffProductManagement();
    };

    setupMobileMenu();
  }
  
  function renderProductTable(products) {
    return `
      <table class="table">
        <tr><th>Name</th><th>Price</th><th>Stock</th><th class="action">Action</th></tr>
        ${products.map(p => `
          <tr>
            <td>${p.name}</td>
            <td>₱${p.price}</td>
            <td>${p.stock}</td>
            <td>
              <button class="btn" onclick="editProduct(${p.id})">Edit</button>
              <button class="btn danger pdct" onclick="deleteProduct(${p.id})">Delete</button>
            </td>
          </tr>
        `).join("")}
      </table>
    `;
  }
  
  // --- Chart shit ---
  function drawChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
  
    const container = canvas.parentElement;
    const width = container.offsetWidth > 350 ? container.offsetWidth : 350;
    canvas.width = width;
    canvas.height = 400;
  
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
  
    // shit chart area
    const left = 40, right = width - 20, top = 30, bottom = 345;
    const chartWidth = right - left;
    const chartHeight = bottom - top;
  
    // Axes and shits
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.lineTo(right, bottom);
    ctx.stroke();
  
    // Labels and shits
    ctx.fillStyle = "#222";
    ctx.font = "12px Arial";
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    for (let i=0;i<12;i++) {
      const x = left + (chartWidth/11)*i;
      ctx.fillText(months[i], x-10, bottom+20);
    }
  
    // Y axis (pataas)
    const max = Math.max(...data, 1000);
    for (let i=0;i<=5;i++) {
      const y = bottom - (chartHeight/5)*i;
      ctx.fillText(Math.round(max*i/5), 2, y+5);
      ctx.beginPath();
      ctx.moveTo(left, y); ctx.lineTo(right, y);
      ctx.strokeStyle = "#eee";
      ctx.stroke();
    }
  
    // Chart line
    ctx.beginPath();
    ctx.moveTo(left, bottom - (data[0]/max)*chartHeight);
    for (let i=1;i<12;i++) {
      const x = left + (chartWidth/11)*i;
      const y = bottom - (data[i]/max)*chartHeight;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#1abc60";
    ctx.lineWidth = 2;
    ctx.stroke();
  
    // Fill under line
    ctx.lineTo(left + chartWidth, bottom);
    ctx.lineTo(left, bottom);
    ctx.closePath();
    ctx.fillStyle = "rgba(39, 174, 96, 0.15)";
    ctx.fill();
  
    // Legendary shit
    ctx.fillStyle = "#1abc60";
    ctx.font = "bold 13px Arial";
    ctx.fillText("Monthly Sales", left + chartWidth/2 - 40, top -15);
  }
  
  window.addEventListener("resize", () => {
    const user = getCurrentUser();
    if (!user) return;
    if (user.role === "admin" && location.hash === "#admin_dashboard") {
      renderAdminDashboard();
    }
  });
  
  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", route);
  window.addEventListener("resize", route);