// src/services/storageService.js
// Abstração da camada de armazenamento de arquivos.
// HOJE: salva localmente em /uploads
// FUTURO: trocar apenas este arquivo para usar Cloudinary, Supabase, S3, etc.

const path = require('path');
const fs   = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Garante que o diretório existe ao carregar o módulo
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storageService = {
    /**
     * Retorna o path relativo público do arquivo salvo pelo Multer.
     * O Multer já gravou o arquivo em disco; este serviço apenas
     * normaliza o caminho para armazenar no banco.
     *
     * @param {Express.Multer.File} file - objeto do arquivo vindo do req.file
     * @returns {string} - path relativo para armazenar no campo `document`
     */
    getFilePath(file) {
        if (!file) throw new Error('Nenhum arquivo recebido.');
        // Retorna um caminho relativo que pode ser servido estaticamente
        return `uploads/${file.filename}`;
    },

    /**
     * Remove um arquivo do disco pelo path armazenado no banco.
     * @param {string} filePath - path relativo (ex: 'uploads/document-123.pdf')
     */
    deleteFile(filePath) {
        if (!filePath) return;
        const absolutePath = path.join(__dirname, '../../', filePath);
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }
    }

    /*
     * ─── MIGRAÇÃO FUTURA (Cloudinary) ────────────────────────────────────────
     * Para migrar para Cloudinary, substitua as funções acima por:
     *
     * const cloudinary = require('cloudinary').v2;
     *
     * async uploadFile(file) {
     *   const result = await cloudinary.uploader.upload(file.path, {
     *     folder: 'easyhealth/documents',
     *     resource_type: 'raw' // para PDF
     *   });
     *   fs.unlinkSync(file.path); // remove temp local
     *   return result.secure_url;
     * },
     *
     * async deleteFile(publicId) {
     *   await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
     * }
     * ─────────────────────────────────────────────────────────────────────────
     */
};

module.exports = storageService;
