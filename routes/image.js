const express = require("express")
const multer = require("multer")
const fs = require("fs")
const { cloudinary } = require("../utils/cloudinary")

const router = express.Router()
const upload = multer({ dest: "uploads/" })

// 🔼 POST /api/upload - Envia imagem para Cloudinary
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem foi enviada." })
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "estabelecimentos",
    })

    fs.unlinkSync(req.file.path)

    res.status(200).json({
      message: "Upload feito com sucesso!",
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (err) {
    console.error("Erro ao fazer upload:", err)
    res.status(500).json({ error: "Erro ao fazer upload", details: err.message })
  }
})

// 👀 GET /api/upload/list - Lista imagens da pasta "estabelecimentos"
router.get("/list", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:estabelecimentos")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute()

    res.status(200).json({
      message: "Imagens encontradas",
      images: result.resources.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      })),
    })
  } catch (err) {
    console.error("Erro ao listar imagens:", err)
    res.status(500).json({ error: "Erro ao buscar imagens", details: err.message })
  }
})

// ❌ DELETE /api/upload - Deleta imagem usando public_id
router.delete("/", async (req, res) => {
  try {
    const { public_id } = req.body

    if (!public_id) {
      return res.status(400).json({ error: "public_id é obrigatório para deletar imagem." })
    }

    const result = await cloudinary.uploader.destroy(public_id)

    if (result.result !== "ok") {
      return res.status(500).json({ error: "Erro ao deletar imagem", details: result })
    }

    res.status(200).json({
      message: "Imagem deletada com sucesso!",
      public_id,
    })
  } catch (err) {
    console.error("Erro ao deletar imagem:", err)
    res.status(500).json({ error: "Erro ao deletar imagem", details: err.message })
  }
})

module.exports = router
