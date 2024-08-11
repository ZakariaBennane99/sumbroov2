export default async (req, res) => {
    try {
      const assetUrl = `https:${req.query.path}`; // Just prepend "https:" to the path
  
      const response = await fetch(assetUrl);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch asset from Contentful. Status: ${response.status}`);
      }
  
      const data = await response.arrayBuffer();
      const bufferData = Buffer.from(data);
  
      res.setHeader('Content-Type', response.headers.get('Content-Type'));
      res.setHeader('Content-Length', response.headers.get('Content-Length'));
      res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none'); // Disable COEP for this asset
  
      res.status(200).send(bufferData);
    } catch (error) {
      console.error("Error in /api/contentfulAsset:", error.message);
      res.status(500).json({ error: error.message });
    }
};
  