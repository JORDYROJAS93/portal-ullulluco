export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Falta el ID de la noticia');
  }

  try {
    // ID de tu proyecto Firebase extraído de tus dominios autorizados
    const firebaseProjectId = 'portal-ullulluco'; 
    
    // Consulta directa y ultrarrápida a la API de Firestore
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/entradas/${id}`
    );

    if (!response.ok) {
      throw new Error('No se encontró el documento');
    }

    const data = await response.json();
    
    // Extraemos los textos e imágenes reales que subiste a Firebase
    const titulo = data.fields?.titulo?.stringValue || 'Portal Ullulluco';
    const resumen = data.fields?.resumen?.stringValue || 'Entérate de más detalles en nuestro portal.';
    const imagen = data.fields?.imagen?.stringValue || 'https://i.ibb.co/hFTwQg5s/destacado2.jpg';

    // Enviamos el HTML físico al instante para ganarle al código 206 de Facebook/WhatsApp
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>${titulo}</title>
        <meta property="og:type" content="article">
        <meta property="og:title" content="${titulo}">
        <meta property="og:description" content="${resumen}">
        <meta property="og:image" content="${imagen}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:url" content="https://portal-ullulluco.vercel.app/${req.url}">
      </head>
      <body>
        <h1>${titulo}</h1>
        <p>Redireccionando al portal...</p>
        <script>window.location.href = "/detalle/noticia/${id}";</script>
      </body>
      </html>
    `);
  } catch (error) {
    // Respuesta de respaldo si falla Firebase
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="og:title" content="Portal Ullulluco">
        <meta property="og:image" content="https://i.ibb.co/hFTwQg5s/destacado2.jpg">
      </head>
      <body><script>window.location.href = "/";</script></body>
      </html>
    `);
  }
}