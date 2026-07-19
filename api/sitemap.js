export default async function handler(req, res) {
  const firebaseProjectId = 'portal-ullulluco';
  
  // 1. URLs estáticas de tu portal
  const staticUrls = [
    '', 'autoridades', 'ubicacion', 'gastronomia', 'festividades', 
    'historia', 'agricultura', 'plantas-nativas', 'leyendas', 
    'artesania', 'turismo', 'anexos', 'noticias'
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 2. Agregar rutas estáticas
  staticUrls.forEach(path => {
    xml += `  <url>\n    <loc>https://portal-ullulluco.vercel.app/${path}</loc>\n  </url>\n`;
  });

  // 3. Consultar a Firestore para traer los IDs de tus colecciones dinámicas
  try {
    // Consulta para Entradas (Plantas, etc.)
    const responseEntradas = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/entradas?pageSize=100`
    );
    const dataEntradas = await responseEntradas.json();

    if (dataEntradas.documents) {
      dataEntradas.documents.forEach(doc => {
        const id = doc.name.split('/').pop();
        xml += `  <url>\n    <loc>https://portal-ullulluco.vercel.app/detalle/plantas-nativas/${id}</loc>\n  </url>\n`;
      });
    }

    // Consulta para Noticias (que tienen su propia estructura)
    const responseNoticias = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/noticias?pageSize=100`
    );
    const dataNoticias = await responseNoticias.json();

    if (dataNoticias.documents) {
      dataNoticias.documents.forEach(doc => {
        const id = doc.name.split('/').pop();
        xml += `  <url>\n    <loc>https://portal-ullulluco.vercel.app/noticias/${id}</loc>\n  </url>\n`;
      });
    }

  } catch (error) {
    console.error("Error al generar sitemap dinámico:", error);
  }

  xml += '</urlset>';

  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send(xml);
}