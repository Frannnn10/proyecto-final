import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UploadCloud, Download, X, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import "../css/style2.css";

function Personalizacion() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // CAMBIA ESTA URL POR TU DOMINIO REAL
  const API_URL = "http://localhost:3000";

  // --- Estado para el Toast ---
  const [mensajeNotificacion, setMensajeNotificacion] = useState('');

  const toast = (msg) => {
    setMensajeNotificacion(msg);
    setTimeout(() => setMensajeNotificacion(''), 2500);
  };

  // --- Protección de ruta añadida ---
  useEffect(() => {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (!usuarioLogueado) {
      toast("Debes iniciar sesión para personalizar tu prenda.");
      navigate('/login');
    }
  }, [navigate]);

  // Forzamos que el query string coincida perfectamente eliminando espacios o mayúsculas
  const tipoPrenda = (searchParams.get('tipo') || 'sudadera').toLowerCase().trim();

  // --- Estados del Personalizador ---
  const [vistaFrente, setVistaFrente] = useState(true);
  const [colorMockup, setColorMockup] = useState('white');
  const [logoSrc, setLogoSrc] = useState('');
  const [textoVisor, setTextoVisor] = useState('Escribe aquí...');
  const [colorTexto, setColorTexto] = useState('#000000');
  const [fuenteTexto, setFuenteTexto] = useState('Inter');

  // Coordenadas en porcentaje para mover el diseño y texto
  const [logoPos, setLogoPos] = useState({ top: 45, left: 50 });
  const [textoPos, setTextoPos] = useState({ top: 68, left: 50 });

  // Modales y Galería
  const [modalGaleria, setModalGaleria] = useState(false);
  const [modalCuenta, setModalCuenta] = useState(false);
  const [galeria, setGaleria] = useState([]);

  // --- Catálogo de Prendas ---
  const catalogo = {
    sudadera: { frente: "/img/frente.png", espalda: "/img/espalda.png", label: "Sudadera" },
    gorra: { frente: "/img/gorra_frente.png", espalda: "/img/gorra_espalda.png", label: "Gorra" },
    "t-shirt": { frente: "/img/t-shirt_frente.png", espalda: "/img/t-shirt_espalda.png", label: "T-Shirt" }
  };

  const prenda = catalogo[tipoPrenda] || catalogo.sudadera;

  // --- Lógica para Mover Componentes ---
  const mover = (item, dir) => {
    const step = 4;
    const setPos = item === 'logo' ? setLogoPos : setTextoPos;
    setPos(p => ({
      top: dir === 'up' ? p.top - step : dir === 'down' ? p.top + step : p.top,
      left: dir === 'left' ? p.left - step : dir === 'right' ? p.left + step : p.left
    }));
  };

  const limpiarLienzo = () => {
    setLogoSrc('');
    setTextoVisor('');
    setLogoPos({ top: 45, left: 50 });
    setTextoPos({ top: 68, left: 50 });
    toast('Diseño eliminado por completo');
  };

  // --- Lógica subida de archivos ---
  const subirLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setLogoSrc(data.url);
        toast('Imagen subida al servidor');
      } else {
        toast('Error al subir: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      toast('Error de conexión al servidor');
    }
  };

  const guardarEnGaleria = async () => {
    const token = localStorage.getItem('token');
    const fechaActual = new Date().toISOString();

    const nuevo = {
      tipo: prenda.label,
      texto: textoVisor,
      fuente: fuenteTexto,
      color: colorTexto,
      logoSrc: logoSrc,
      posiciones: JSON.stringify({ logoPos, textoPos }), 
      fecha_creacion: fechaActual 
    };

    try {
      const res = await fetch(`${API_URL}/api/proyectos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevo)
      });
      
      const data = await res.json();

      if (data.success) {
        setGaleria([...galeria, { ...nuevo, id: Date.now(), imagenMockup: vistaFrente ? prenda.frente : prenda.espalda }]);
        toast('¡Proyecto guardado exitosamente!');
      } else {
        toast('Error al guardar: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      toast('Error de conexión con el servidor');
    }
  };

  const descargarImagen = () => {
    const link = document.createElement('a');
    link.href = logoSrc || prenda.frente;
    link.download = `mi-diseno-${tipoPrenda}.png`;
    link.click();
    toast('Descargando archivos base...');
  };

  return (
    <div id="editor-page-root">
      {/* Toast Notification */}
      {mensajeNotificacion && <div className="notificacion-toast">{mensajeNotificacion}</div>}

      <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Inter:wght@400;700&family=Lobster&display=swap" rel="stylesheet" />
      
      <header className="navbar">
        <div className="logo">pacdora <span className="badge">pro</span></div>
        <nav>
          <span className="nav-link active">Editor ({prenda.label})</span>
          <span className="nav-link" onClick={() => setModalGaleria(true)} style={{cursor:'pointer'}}>Galería ({galeria.length})</span>
          <span className="nav-link" onClick={() => setModalCuenta(true)} style={{cursor:'pointer'}}>Mi Cuenta</span>
        </nav>
        <div className="nav-right">
          <button className="btn-primary" onClick={guardarEnGaleria}>Guardar Proyecto</button>
        </div>
      </header>

      <main className="editor-container">
        <section className="viewer-section">
          <div className="visor-mockup" id="visor-principal">
            <div className="mockup-layers" style={{position: 'relative', width: '100%', height: '100%'}}>
              <img
                key={vistaFrente ? "frente" : "espalda"}
                src={vistaFrente ? prenda.frente : prenda.espalda}
                id="prenda-base"
                alt="Base"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: 'transparent',
                  filter: colorMockup === 'black' ? 'brightness(0.3)' : 'none'
                }}
              />
              
              {logoSrc && (
                <div style={{ top: `${logoPos.top}%`, left: `${logoPos.left}%`, position: 'absolute', transform: 'translate(-50%, -50%)', width: '120px', zIndex: 5 }}>
                  <img src={logoSrc} alt="Logo" style={{width: '100%', mixBlendMode: 'multiply'}} />
                </div>
              )}

              {textoVisor && (
                <div style={{ top: `${textoPos.top}%`, left: `${textoPos.left}%`, position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 6 }}>
                  <p style={{ color: colorTexto, fontFamily: fuenteTexto, margin: 0, fontWeight: 'bold', fontSize: '20px' }}>{textoVisor}</p>
                </div>
              )}
            </div>
          </div>

          <div className="visor-controls">
            <button className={vistaFrente ? "active-view" : ""} onClick={() => setVistaFrente(true)}>Frente</button>
            <button className={!vistaFrente ? "active-view" : ""} onClick={() => setVistaFrente(false)}>Espalda</button>
          </div>
        </section>

        <aside className="controls-panel">
          <div className="panel-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3>Área de Diseño</h3>
            <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
              <label htmlFor="file-up" style={{cursor:'pointer'}} title="Subir Logo"><UploadCloud size={20} /></label>
              <input type="file" id="file-up" accept="image/*" style={{display:'none'}} onChange={subirLogo} />
              <Trash2 size={20} style={{cursor:'pointer', color:'#ef4444'}} onClick={limpiarLienzo} title="Eliminar Personalización" />
            </div>
          </div>

          <div className="workspace-2d" style={{padding:'15px', background:'#f8fafc', borderRadius:'12px', border:'1px dashed #cbd5e1'}}>
            <span style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'8px'}}>Posición del Diseño:</span>
            <div style={{display:'flex', gap:'8px', justifyContent:'center'}}>
              <button onClick={() => mover('logo', 'up')} style={{padding:'6px'}} title="Subir"><ArrowUp size={14} /></button>
              <button onClick={() => mover('logo', 'down')} style={{padding:'6px'}} title="Bajar"><ArrowDown size={14} /></button>
              <button onClick={() => mover('logo', 'left')} style={{padding:'6px'}} title="Izquierda"><ArrowLeft size={14} /></button>
              <button onClick={() => mover('logo', 'right')} style={{padding:'6px'}} title="Derecha"><ArrowRight size={14} /></button>
            </div>
          </div>

          <div className="seccion-herramientas" style={{marginTop:'15px'}}>
            <h4>Texto y Controles</h4>
            <input type="text" className="input-moderno" value={textoVisor} onChange={(e) => setTextoVisor(e.target.value)} />
            <div className="text-row" style={{display:'flex', gap:'10px', marginTop:'8px'}}>
              <select value={fuenteTexto} onChange={(e) => setFuenteTexto(e.target.value)} style={{flex:1}}>
                <option value="Inter">Estándar</option>
                <option value="Bangers">Bangers</option>
                <option value="Lobster">Lobster</option>
              </select>
              <input type="color" value={colorTexto} onChange={(e) => setColorTexto(e.target.value)} style={{width:'40px', padding:0}} />
            </div>
          </div>

          <div className="seccion-colores" style={{marginTop:'15px'}}>
            <h4>Color de Mockup</h4>
            <div className="circles" style={{display:'flex', gap:'10px'}}>
              <div className={`circle white ${colorMockup==='white'?'active':''}`} onClick={()=>setColorMockup('white')} style={{width:'25px', height:'25px', borderRadius:'50%', border:'2px solid #ccc', background:'#fff', cursor:'pointer'}}></div>
              <div className={`circle black ${colorMockup==='black'?'active':''}`} onClick={()=>setColorMockup('black')} style={{width:'25px', height:'25px', borderRadius:'50%', border:'2px solid #ccc', background:'#000', cursor:'pointer'}}></div>
            </div>
          </div>

          <div className="footer-buttons" style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop:'20px' }}>
            <button className="btn-download" onClick={descargarImagen} style={{ flex: 2, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              <Download size={16} /> Descarga Gratis
            </button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast('¡Enlace copiado!'); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#cbd5e1', border: 'none', borderRadius: '10px', cursor: 'pointer', gap:'4px' }}>
              <Share2 size={16} /> Compartir
            </button>
          </div>
        </aside>
      </main>

      {modalGaleria && (
        <div className="modal-overlay" style={{ display: 'flex', position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center', zIndex:100 }}>
          <div className="modal-content" style={{ background:'#fff', padding:'25px', borderRadius:'15px', maxWidth:'500px', width:'90%' }}>
            <div className="modal-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #eee', paddingBottom:'10px' }}>
              <h3>Mis Prendas Guardadas ({galeria.length})</h3>
              <X onClick={() => setModalGaleria(false)} style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginTop:'15px', maxHeight:'300px', overflowY:'auto' }}>
              {galeria.length === 0 ? (
                <p style={{ gridColumn: 'span 2', textAlign: 'center', color: '#94a3b8' }}>Aún no tienes diseños guardados en esta sesión.</p>
              ) : (
                galeria.map(item => (
                  <div key={item.id} style={{ border:'1px solid #e2e8f0', padding:'10px', borderRadius:'8px', background: item.color === 'black' ? '#f1f5f9' : '#fff' }}>
                    <div style={{ position:'relative', height:'100px', display:'flex', justifyContent:'center', background:'#e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
                      <img src={item.imagenMockup} alt="Base" style={{ height:'100%' }} />
                      {item.logo && <img src={item.logo} alt="Logo" style={{ position:'absolute', width:'30px', top:'40%', left:'50%', transform:'translate(-50%, -50%)', mixBlendMode:'multiply' }} />}
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '6px', margin: 0 }}>{item.tipo}</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Txt: {item.texto || 'Vacío'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {modalCuenta && (
        <div className="modal-overlay" style={{ display: 'flex', position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center', zIndex:100 }}>
          <div className="modal-content" style={{ background:'#fff', padding:'25px', borderRadius:'15px', width:'350px' }}>
            <div className="modal-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #eee', paddingBottom:'10px' }}>
              <h3>Mi Cuenta</h3>
              <X onClick={() => setModalCuenta(false)} style={{ cursor: 'pointer' }} />
            </div>
            <div className="user-info" style={{ display:'flex', gap:'15px', alignItems:'center', marginTop:'15px' }}>
              <div className="avatar" style={{ width:'45px', height:'45px', borderRadius:'50%', background:'#64a8f5', color:'#fff', display:'flex', justifyContent:'center', alignItems:'center', fontWeight:'bold' }}>F</div>
              <div>
                <p style={{ margin: 0 }}><strong>Fran Developer</strong></p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Technical Admin</p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('usuario');
                localStorage.removeItem('token');
                toast('Sesión cerrada. Redirigiendo...');
                setTimeout(() => navigate('/login'), 1500);
              }}
              style={{ width: '100%', marginTop: '20px', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Personalizacion;