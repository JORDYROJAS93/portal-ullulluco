export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  
  // Lista de robots que necesitan el HTML pre-renderizado (incluyendo Googlebot)
  const isBot = /facebookexternalhit|WhatsApp|twitterbot|pinterest|Googlebot|Bingbot/i.test(userAgent);
  
  const isAutoridades = req.url.includes('/autoridades');
  const { id } = req.query;

  // 1. SI ES UN USUARIO REAL (No es un bot), lo dejamos pasar exactamente a la URL que pidió
  if (!isBot) {
    // req.url contiene la ruta limpia que escribió el usuario (ej: /detalle/gastronomia/ID)
    return res.redirect(req.url);
  }

  // 2. --- LÓGICA EXCLUSIVA PARA ROBOTS (Google, WhatsApp, Facebook) ---
  try {
    const firebaseProjectId = 'portal-ullulluco'; 
    let titulo = 'Portal Ullulluco';
    let resumen = 'Entérate de más detalles en nuestro portal.';
    let imagen = 'https://i.ibb.co/hFTwQg5s/destacado2.jpg';

    if (isAutoridades) {
      // Si Googlebot pide las autoridades, jalamos la información base
      try {
        const authResponse = await fetch(
          `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/autoridades/general`
        );
        if (authResponse.ok) {
          const authData = await authResponse.json();
          titulo = authData.fields?.titulo?.stringValue || 'Autoridades - Portal Ullulluco';
          resumen = authData.fields?.resumen?.stringValue || 'Conoce a las autoridades y representantes de nuestra tierra.';
          imagen = authData.fields?.imagen?.stringValue || imagen;
        } else {
          titulo = 'Autoridades Actuales - Portal Ullulluco';
          resumen = 'Conoce el cuerpo de autoridades de nuestro pueblo.';
        }
      } catch (e) {
        titulo = 'Autoridades - Portal Ullulluco';
      }
    } else if (id) {
      // Si es una noticia normal, buscamos en la colección entradas con su ID
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/entradas/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        titulo = data.fields?.titulo?.stringValue || titulo;
        resumen = data.fields?.resumen?.stringValue || resumen;
        imagen = data.fields?.imagen?.stringValue || imagen;
      }
    }

    // Le devolvemos el HTML estático nativo al robot
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>${titulo}</title>
        <meta name="description" content="${resumen}">
        <meta property="og:type" content="article">
        <meta property="og:title" content="${titulo}">
        <meta property="og:description" content="${resumen}">
        <meta property="og:image" content="${imagen}">
        <meta property="og:url" content="https://portal-ullulluco.vercel.app/${req.url}">
      </head>
      <body>
        <h1>${titulo}</h1>
        <p>${resumen}</p>
      </body>
      </html>
    `);

  } catch (error) {
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Portal Ullulluco</title></head>
      <body></body>
      </html>
    `);
  }
}