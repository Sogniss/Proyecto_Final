/* =========================================================
   AB – Sistema de Gestión
   Usuario: admin | Contraseña: 1234
========================================================= */

// Funciones para cambiar entre pantallas (login y sistema)
function mostrarPantalla(id) {
  document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
  document.getElementById(id).classList.add("activa");
}

// Muestra notificaciones tipo toast al usuario
function mostrarNotificacion(titulo, mensaje, tipo = "advertencia") {
  const modal = document.getElementById("modalNotificacion");
  const icono = document.getElementById("notifIcono");
  const caja = modal.querySelector(".notificacion");
  
  // Elegir el icono según el tipo de mensaje
  const iconos = { error: "❌", exito: "✅", advertencia: "⚠️", info: "ℹ️" };
  
  icono.textContent = iconos[tipo] || "ℹ️";
  document.getElementById("notifTitulo").textContent = titulo;
  document.getElementById("notifMensaje").textContent = mensaje;
  caja.className = "notificacion " + tipo;
  modal.classList.add("activo");
  
  // Se cierra automáticamente después de 3.5 segundos
  setTimeout(() => modal.classList.remove("activo"), 3500);
}

// Abre el modal del ticket con título dinámico
function abrirTicket(titulo, html) {
  document.getElementById("ticketTitulo").textContent = titulo;
  document.getElementById("ticketContenido").innerHTML = html;
  document.getElementById("modalTicket").classList.add("activo");
}

// Cierra el modal del ticket
function cerrarTicket() {
  document.getElementById("modalTicket").classList.remove("activo");
}

// Abre el modal del reporte con la tabla completa
function abrirReporte(html) {
  document.getElementById("reporteContenido").innerHTML = html;
  document.getElementById("modalReporte").classList.add("activo");
}

// Cierra el modal del reporte
function cerrarReporte() {
  document.getElementById("modalReporte").classList.remove("activo");
}

// Función para imprimir el reporte (abre ventana de impresión)
function imprimirReporte() {
  const contenido = document.getElementById("reporteContenido").innerHTML;
  
  // Crear una nueva ventana para imprimir
  const ventana = window.open('', '', 'width=900,height=700');
  ventana.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reporte AB</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 20px;
          color: #1f1230;
        }
        .rep-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #3b1b5a;
        }
        .rep-title {
          font-size: 24px;
          color: #3b1b5a;
          margin: 0;
        }
        .rep-sub {
          margin: 5px 0 0 0;
          color: #666;
        }
        .rep-totalbox {
          text-align: right;
          padding: 10px 15px;
          background: #f3ecff;
          border-radius: 8px;
        }
        .rep-total-label {
          font-size: 12px;
          color: #666;
          font-weight: bold;
        }
        .rep-total {
          font-size: 22px;
          color: #3b1b5a;
          font-weight: 900;
          margin-top: 5px;
        }
        .rep-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .rep-table th {
          background: #3b1b5a;
          color: white;
          padding: 10px;
          text-align: left;
          font-size: 13px;
        }
        .rep-table td {
          padding: 8px 10px;
          border-bottom: 1px solid #ddd;
          font-size: 13px;
        }
        .rep-table tr:hover {
          background: #f9f9f9;
        }
        .rep-foot {
          margin-top: 20px;
          padding: 15px;
          background: #f3ecff;
          border-radius: 8px;
          text-align: center;
          color: #666;
        }
        @media print {
          body { padding: 10px; }
          .rep-table { page-break-inside: auto; }
          .rep-table tr { page-break-inside: avoid; page-break-after: auto; }
        }
      </style>
    </head>
    <body>
      ${contenido}
    </body>
    </html>
  `);
  
  ventana.document.close();
  ventana.focus();
  
  // Esperar un poquito y luego abrir el diálogo de impresión
  setTimeout(() => {
    ventana.print();
    ventana.close();
  }, 250);
}

// Retorna la fecha de hoy en formato ISO (YYYY-MM-DD)
function hoyISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Convierte la hora actual a formato 12 horas (AM/PM)
function hora12() {
  const d = new Date();
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12; // Si es 0, convertir a 12
  const min = String(d.getMinutes()).padStart(2, "0");
  const seg = String(d.getSeconds()).padStart(2, "0");
  return `${h}:${min}:${seg} ${ampm}`;
}

// Objeto con funciones de validación
const Validador = {
  // Valida que la placa tenga entre 3 y 10 caracteres
  placa: (txt) => typeof txt === "string" && txt.trim().length >= 3 && txt.trim().length <= 10,
  
  // Valida que el texto no esté vacío
  texto: (txt) => typeof txt === "string" && txt.trim().length > 0,
  
  // Valida que sea un número válido y positivo
  numero: (n) => Number.isFinite(n) && n >= 0
};

// Precios del sistema (pueden ajustarse aquí fácilmente)
const PRECIOS = {
  vehiculo: {
    SEDAN: 3000,
    SUV: 3500,
    "4X4": 4000
  },
  // Los tipos de lavado no tienen costo adicional
  lavado: {
    BASICO: 0,
    COMPLETO: 0,
    PREMIUM: 0
  },
  enceradoExtra: 1000
};

// Calcula el subtotal usando SWITCH (tipo vehículo) + IF (extras)
function calcularSubtotal(tipoVehiculo, tipoLavado, extraEncerado) {
  let baseVehiculo = 0;
  let baseLavado = 0;

  // SWITCH para determinar precio base según tipo de vehículo
  switch (tipoVehiculo) {
    case "SEDAN": 
      baseVehiculo = PRECIOS.vehiculo.SEDAN; 
      break;
    case "SUV":   
      baseVehiculo = PRECIOS.vehiculo.SUV; 
      break;
    case "4X4":   
      baseVehiculo = PRECIOS.vehiculo["4X4"]; 
      break;
    default:      
      baseVehiculo = 0;
  }

  // SWITCH para tipo de lavado (actualmente sin costo adicional)
  switch (tipoLavado) {
    case "BASICO":   
      baseLavado = PRECIOS.lavado.BASICO; 
      break;
    case "COMPLETO": 
      baseLavado = PRECIOS.lavado.COMPLETO; 
      break;
    case "PREMIUM":  
      baseLavado = PRECIOS.lavado.PREMIUM; 
      break;
    default:         
      baseLavado = 0;
  }

  let subtotal = baseVehiculo + baseLavado;
  
  // IF para agregar el costo del encerado si se seleccionó
  if (extraEncerado) {
    subtotal += PRECIOS.enceradoExtra;
  }

  return subtotal;
}

// Calcula el IVA del 13% sobre el subtotal
function calcularIVA(subtotal) {
  return subtotal * 0.13;
}

// Generar HTML del ticket de factura
function generarTicketFactura(servicio) {
  return `
    <div style="text-align:center; margin-bottom:15px;">
      <div style="font-size:48px; margin-bottom:8px;">🧼</div>
      <h2 style="margin:0; color:#3b1b5a; font-size:22px;">AB</h2>
      <p style="margin:6px 0; opacity:.85; font-weight:700;">Comprobante de Servicio</p>
      <hr style="opacity:.2; margin:12px 0;">
    </div>

    <div style="font-size:14px; line-height:1.8;">
      <p><b>Fecha:</b> ${servicio.fecha}</p>
      <p><b>Hora:</b> ${hora12()}</p>
      <p><b>Placa:</b> ${servicio.placa}</p>
      <p><b>Modelo:</b> ${servicio.modelo}</p>
      <p><b>Cliente:</b> ${servicio.cliente}</p>
      <p><b>Tipo Vehículo:</b> ${servicio.tipoVehiculo}</p>
      <p><b>Tipo Lavado:</b> ${servicio.tipoLavado}</p>
      <p><b>Extra Encerado:</b> ${servicio.extraEncerado ? "Sí (+₡1000)" : "No"}</p>
    </div>

    <hr style="opacity:.2; margin:15px 0;">

    <div style="font-size:15px; line-height:1.8;">
      <p><b>Subtotal:</b> ₡${Number(servicio.subtotal).toFixed(2)}</p>
      <p><b>IVA (13%):</b> ₡${Number(servicio.iva).toFixed(2)}</p>
      <p style="font-size:20px; color:#3b1b5a; margin:10px 0;">
        <b>TOTAL:</b> ₡${Number(servicio.total).toFixed(2)}
      </p>
    </div>

    <hr style="opacity:.2; margin:15px 0;">

    <div style="font-size:15px; line-height:1.8;">
      <p><b>Paga con:</b> ₡${Number(servicio.pagaCon).toFixed(2)}</p>
      <p style="font-size:18px; color:#1f9d61;"><b>Vuelto:</b> ₡${Number(servicio.vuelto).toFixed(2)}</p>
    </div>

    <div style="text-align:center; margin-top:20px; padding-top:15px; border-top:1px dashed rgba(59,27,90,.2);">
      <p style="font-style:italic; opacity:.9; margin:0;">¡Gracias por preferirnos! 💜</p>
      <p style="font-size:12px; opacity:.7; margin-top:6px;">AB - Su confianza, nuestro compromiso</p>
    </div>
  `;
}

// Clase para manejar IndexedDB
class BaseDatosCarWash {
  constructor() {
    this.db = null;
  }

  // Abre la conexión a IndexedDB
  abrir() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("CarWashDB", 1);

      // Este evento se dispara cuando la BD se crea o actualiza
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        
        // Crear el ObjectStore si no existe
        if (!db.objectStoreNames.contains("servicios")) {
          const store = db.createObjectStore("servicios", { keyPath: "id", autoIncrement: true });
          store.createIndex("porFecha", "fecha", { unique: false });
        }
      };

      // Se abrió correctamente
      req.onsuccess = (e) => {
        this.db = e.target.result;
        console.log("✅ IndexedDB abierta correctamente");
        resolve(this.db);
      };

      // Error al abrir
      req.onerror = (e) => {
        console.error("❌ Error abriendo IndexedDB:", e.target.error);
        reject(e.target.error);
      };
    });
  }

  // Guarda un nuevo servicio en la base de datos
  agregarServicio(servicio) {
    return new Promise((resolve, reject) => {
      // Abrir transacción de escritura
      const tx = this.db.transaction(["servicios"], "readwrite");
      const store = tx.objectStore("servicios");
      const req = store.add(servicio);

      let terminado = false;

      // Eventos de la TRANSACCIÓN
      tx.oncomplete = () => console.log("✅ Transacción readwrite completada");
      tx.onerror = (e) => {
        console.error("❌ Error en transacción:", e.target.error);
        if (!terminado) {
          terminado = true;
          reject(e.target.error);
        }
      };

      // Se guardó correctamente
      req.onsuccess = () => {
        terminado = true;
        console.log("✅ Servicio guardado con ID:", req.result);
        resolve(req.result);
      };

      // Error al guardar
      req.onerror = (e) => {
        terminado = true;
        console.error("❌ Error guardando:", e.target.error);
        reject(e.target.error);
      };
    });
  }

  // Lista todos los servicios usando un cursor
  listarTodosCursor() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(["servicios"], "readonly");
      const store = tx.objectStore("servicios");
      const req = store.openCursor();
      const lista = [];

      // Por cada registro encontrado
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        
        if (cursor) {
          lista.push(cursor.value);
          cursor.continue();
        } else {
          resolve(lista);
        }
      };

      req.onerror = (e) => {
        console.error("❌ Error leyendo:", e.target.error);
        reject(e.target.error);
      };
    });
  }
}

// Clase principal del sistema
class SistemaCarWash {
  constructor() {
    this.bd = new BaseDatosCarWash();
    this.cola = [];
  }

  async iniciar() {
    await this.bd.abrir();
  }

  encolar(servicio) {
    this.cola.push(servicio);
  }

  // DO...WHILE para lavar todos
  lavarTodos() {
    let i = 0;
    let mensaje = "";
    if (this.cola.length === 0) return "No hay vehículos en cola.";

    do {
      const s = this.cola[i];
      mensaje += `🚗 Lavado completado: ${s.placa} (${s.tipoVehiculo} - ${s.tipoLavado})\n`;
      i++;
    } while (i < this.cola.length);

    this.cola = [];
    return mensaje;
  }

  // FOR para corte de caja
  async corteCaja() {
    const servicios = await this.bd.listarTodosCursor();
    const hoy = hoyISO();
    
    let totalHoy = 0;
    let cantidadHoy = 0;
    let totalGeneral = 0;
    
    // FOR clásico (requerimiento del profe)
    for (let i = 0; i < servicios.length; i++) {
      const s = servicios[i];
      totalGeneral += Number(s.total || 0);
      
      // Solo contar los del día de hoy
      if (s.fecha === hoy) {
        totalHoy += Number(s.total || 0);
        cantidadHoy++;
      }
    }

    return {
      fecha: hoy,
      totalHoy,
      cantidadHoy,
      totalGeneral,
      cantidadGeneral: servicios.length
    };
  }
}

// Generar HTML para el reporte
function generarReporteHTML(servicios) {
  const hoy = hoyISO();
  let total = 0;
  let filas = "";

  for (let i = 0; i < servicios.length; i++) {
    const s = servicios[i];
    total += Number(s.total || 0);

    filas += `
      <tr>
        <td>${s.id ?? ""}</td>
        <td>${s.fecha}</td>
        <td>${s.placa}</td>
        <td>${s.modelo}</td>
        <td>${s.cliente}</td>
        <td>${s.tipoVehiculo}</td>
        <td>${s.tipoLavado}</td>
        <td>${s.extraEncerado ? "Sí" : "No"}</td>
        <td>₡${Number(s.subtotal).toFixed(2)}</td>
        <td>₡${Number(s.iva).toFixed(2)}</td>
        <td><b>₡${Number(s.total).toFixed(2)}</b></td>
      </tr>
    `;
  }

  return `
    <div class="rep-head">
      <div>
        <h2 class="rep-title">Reporte – AB</h2>
        <p class="rep-sub">Servicios registrados: <b>${servicios.length}</b></p>
      </div>
      <div class="rep-totalbox">
        <div class="rep-total-label">Total General</div>
        <div class="rep-total">₡${total.toFixed(2)}</div>
      </div>
    </div>

    <div class="rep-tablewrap">
      <table class="rep-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Lavado</th>
            <th>Encerado</th>
            <th>Subtotal</th>
            <th>IVA</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
      </table>
    </div>

    <div class="rep-foot">
      Reporte generado el <b>${hoy}</b> a las <b>${hora12()}</b>
    </div>
  `;
}

// Crear instancia del sistema
const sistema = new SistemaCarWash();

// Referencias DOM
const txtUsuario = document.getElementById("txtUsuario");
const txtPassword = document.getElementById("txtPassword");
const btnLogin = document.getElementById("btnLogin");
const btnVerPassword = document.getElementById("btnVerPassword");
const nombreUsuario = document.getElementById("nombreUsuario");
const contServiciosHoy = document.getElementById("contServiciosHoy");
const btnSalir = document.getElementById("btnSalir");
const btnLavarTodos = document.getElementById("btnLavarTodos");
const btnCorteCaja = document.getElementById("btnCorteCaja");
const btnAbrirReporte = document.getElementById("btnAbrirReporte");
const frmServicio = document.getElementById("frmServicio");
const txtPlaca = document.getElementById("txtPlaca");
const txtModelo = document.getElementById("txtModelo");
const txtCliente = document.getElementById("txtCliente");
const selTipoVehiculo = document.getElementById("selTipoVehiculo");
const selTipoLavado = document.getElementById("selTipoLavado");
const checkEncerado = document.getElementById("checkEncerado");
const txtPagaCon = document.getElementById("txtPagaCon");
const tbodyServicios = document.getElementById("tbodyServicios");
const tfootTotalGeneral = document.getElementById("tfootTotalGeneral");

// Eventos modales
document.getElementById("btnCerrarNoti").addEventListener("click", () => {
  document.getElementById("modalNotificacion").classList.remove("activo");
});

document.getElementById("btnCerrarTicket").addEventListener("click", cerrarTicket);
document.getElementById("btnCerrarTicket2").addEventListener("click", cerrarTicket);

document.getElementById("btnCerrarReporte").addEventListener("click", cerrarReporte);
document.getElementById("btnCerrarReporte2").addEventListener("click", cerrarReporte);

// Ver/ocultar contraseña
btnVerPassword.addEventListener("click", () => {
  const icon = document.getElementById("iconPassword");
  if (txtPassword.type === "password") {
    txtPassword.type = "text";
    icon.textContent = "🙈";
  } else {
    txtPassword.type = "password";
    icon.textContent = "👁️";
  }
});

// LOGIN con IF/ELSE
btnLogin.addEventListener("click", () => {
  const u = txtUsuario.value.trim();
  const p = txtPassword.value;

  if (u === "admin" && p === "1234") {
    nombreUsuario.textContent = "admin";
    mostrarPantalla("pantallaSistema");
    mostrarNotificacion("Bienvenido", "Sesión iniciada correctamente", "exito");
    cargarTabla();
  } else {
    mostrarNotificacion("Error", "Usuario o contraseña incorrectos", "error");
  }
});

// Salir
btnSalir.addEventListener("click", () => {
  mostrarPantalla("pantallaLogin");
  txtUsuario.value = "";
  txtPassword.value = "";
  mostrarNotificacion("Sesión cerrada", "Volviste al inicio de sesión", "info");
});

// Lavar todos (DO...WHILE)
btnLavarTodos.addEventListener("click", () => {
  const msg = sistema.lavarTodos();
  abrirTicket("Proceso de Lavado", `<pre style="white-space:pre-wrap; font-weight:800;">${msg}</pre>`);
});

// Corte de caja (FOR) - ARREGLADO
btnCorteCaja.addEventListener("click", async () => {
  try {
    const resultado = await sistema.corteCaja();

    const html = `
      <div style="text-align:center; margin-bottom:20px;">
        <div style="font-size:48px; margin-bottom:10px;">💰</div>
        <h2 style="margin:0; color:#3b1b5a;">Corte de Caja</h2>
        <p style="margin:8px 0; opacity:.85;">Fecha: <b>${resultado.fecha}</b></p>
      </div>

      <div style="background: linear-gradient(135deg, #3b1b5a 0%, #ff4da6 100%); padding:20px; border-radius:12px; color:white; margin-bottom:15px;">
        <div style="text-align:center;">
          <div style="font-size:14px; opacity:.9; margin-bottom:5px;">Total del Día (${resultado.fecha})</div>
          <div style="font-size:32px; font-weight:900;">₡${resultado.totalHoy.toFixed(2)}</div>
          <div style="font-size:13px; opacity:.8; margin-top:5px;">${resultado.cantidadHoy} servicios hoy</div>
        </div>
      </div>

      <div style="background: rgba(59,27,90,.08); padding:15px; border-radius:12px;">
        <p style="margin:0; font-weight:800; color: rgba(31,18,48,.85);">
          Total General del Sistema: <span style="color:#3b1b5a; font-size:20px;">₡${resultado.totalGeneral.toFixed(2)}</span>
        </p>
        <p style="margin:8px 0 0 0; font-size:13px; opacity:.8;">
          ${resultado.cantidadGeneral} servicios en total
        </p>
      </div>
    `;

    abrirTicket("💰 Corte de Caja", html);
  } catch (err) {
    console.error(err);
    mostrarNotificacion("Error", "No se pudo hacer el corte de caja", "error");
  }
});

// Abrir reporte
btnAbrirReporte.addEventListener("click", async () => {
  try {
    const servicios = await sistema.bd.listarTodosCursor();
    const html = generarReporteHTML(servicios);
    abrirReporte(html);
  } catch (err) {
    console.error(err);
    mostrarNotificacion("Error", "No se pudo generar el reporte", "error");
  }
});

// Guardar servicio
frmServicio.addEventListener("submit", async (e) => {
  e.preventDefault();

  const placa = txtPlaca.value.trim().toUpperCase();
  const modelo = txtModelo.value.trim();
  const cliente = txtCliente.value.trim();
  const tipoVehiculo = selTipoVehiculo.value;
  const tipoLavado = selTipoLavado.value;
  const extraEncerado = checkEncerado.checked;
  const pagaCon = Number(txtPagaCon.value);

  // Validaciones
  if (!Validador.placa(placa)) {
    mostrarNotificacion("Error", "Placa inválida (debe tener 3-10 caracteres)", "error");
    return;
  }
  
  if (!Validador.texto(modelo) || !Validador.texto(cliente)) {
    mostrarNotificacion("Error", "Modelo y Cliente son obligatorios", "error");
    return;
  }
  
  if (!tipoVehiculo || !tipoLavado) {
    mostrarNotificacion("Error", "Seleccione el tipo de vehículo y lavado", "error");
    return;
  }
  
  if (!Validador.numero(pagaCon)) {
    mostrarNotificacion("Error", "El monto 'Paga con' debe ser un número válido", "error");
    return;
  }

  // Calcular valores
  const subtotal = calcularSubtotal(tipoVehiculo, tipoLavado, extraEncerado);
  const iva = calcularIVA(subtotal);
  const total = subtotal + iva;
  const vuelto = pagaCon - total;

  if (vuelto < 0) {
    mostrarNotificacion("Error", "El monto 'Paga con' no alcanza para cubrir el total", "error");
    return;
  }

  // Crear objeto servicio
  const servicio = {
    fecha: hoyISO(),
    placa,
    modelo,
    cliente,
    tipoVehiculo,
    tipoLavado,
    extraEncerado,
    subtotal,
    iva,
    total,
    pagaCon,
    vuelto
  };

  try {
    // Guardar en BD
    const id = await sistema.bd.agregarServicio(servicio);
    servicio.id = id;

    // Encolar para lavado
    sistema.encolar(servicio);

    // Mostrar TICKET DE FACTURA
    const ticketHTML = generarTicketFactura(servicio);
    abrirTicket("🎫 Factura - Servicio Registrado", ticketHTML);
    
    mostrarNotificacion("Guardado", "Servicio registrado correctamente", "exito");
    
    // Actualizar tabla
    await cargarTabla();
    
    // Resetear formulario
    frmServicio.reset();
    txtPlaca.focus();
    
  } catch (err) {
    console.error("Error al guardar:", err);
    mostrarNotificacion("Error", "No se pudo guardar el servicio", "error");
  }
});

// Cargar tabla con WHILE
async function cargarTabla() {
  try {
    const servicios = await new Promise((resolve, reject) => {
      const lista = [];
      const tx = sistema.bd.db.transaction(["servicios"], "readonly");
      const store = tx.objectStore("servicios");
      const req = store.openCursor();

      tx.oncomplete = () => console.log("✅ Transacción readonly completada");
      tx.onerror = (e) => reject(e.target.error);

      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          lista.push(cursor.value);
          cursor.continue();
        } else {
          resolve(lista);
        }
      };

      req.onerror = (e) => reject(e.target.error);
    });

    tbodyServicios.innerHTML = "";
    let totalGeneral = 0;

    // WHILE para renderizar
    let i = 0;
    while (i < servicios.length) {
      const s = servicios[i];
      totalGeneral += Number(s.total || 0);
      const extra = s.extraEncerado ? "Sí" : "No";

      tbodyServicios.innerHTML += `
        <tr>
          <td>${s.id ?? ""}</td>
          <td>${s.fecha}</td>
          <td>${s.placa}</td>
          <td>${s.modelo}</td>
          <td>${s.cliente}</td>
          <td>${s.tipoVehiculo}</td>
          <td>${s.tipoLavado}</td>
          <td>${extra}</td>
          <td>₡${Number(s.subtotal).toFixed(2)}</td>
          <td>₡${Number(s.iva).toFixed(2)}</td>
          <td><b>₡${Number(s.total).toFixed(2)}</b></td>
          <td>₡${Number(s.pagaCon).toFixed(2)}</td>
          <td>₡${Number(s.vuelto).toFixed(2)}</td>
        </tr>
      `;
      i++;
    }

    tfootTotalGeneral.innerHTML = `<b>₡${totalGeneral.toFixed(2)}</b>`;

    const hoy = hoyISO();
    contServiciosHoy.textContent = servicios.filter(s => s.fecha === hoy).length;

  } catch (err) {
    console.error("Error cargando tabla:", err);
  }
}

// Iniciar sistema
window.addEventListener("DOMContentLoaded", async () => {
  try {
    await sistema.iniciar();
    mostrarPantalla("pantallaLogin");
    console.log("✅ Sistema AB iniciado correctamente");
  } catch (err) {
    console.error("❌ Error crítico:", err);
    alert("Error al iniciar la base de datos. Recarga la página.");
  }
});