import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const uploadDir = path.join(process.cwd(), "public/ayuAtama/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `${unique}${path.extname(part.originalFilename)}`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Upload failed" });
    }

    const file = files.image?.[0];
    if (!file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const publicUrl = `/ayuAtama/uploads/${path.basename(file.filepath)}`;

    return res.status(200).json({
      url: publicUrl,
    });
  });
}
