import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import FormData from "form-data";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy for Catbox to bypass CORS
  app.post("/api/upload-catbox", upload.single('fileToUpload'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const formData = new FormData();
      formData.append('reqtype', 'fileupload');
      formData.append('fileToUpload', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData as any,
      });

      if (!response.ok) {
        throw new Error(`Catbox API responded with ${response.status}`);
      }

      const url = await response.text();
      res.send(url);
    } catch (error: any) {
      console.error("Catbox proxy error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
