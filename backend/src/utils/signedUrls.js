import cloudinary from "../cloudinary.js";

const EXPIRATION_SECONDS = 24 * 60 * 60; // 24 horas

// Campos que son imagenes privadas (authenticated)
const PRIVATE_FIELDS = [
    "duiFront", "duiBack",
    "passportPhoto",
    "residenceFront", "residenceBack",
    "selfieWithDocument",
];

// Extrae el public_id desde una URL de Cloudinary
// Ejemplo: https://res.cloudinary.com/cloud/image/authenticated/v123/stores/dui/abc.jpg
// Retorna: stores/dui/abc
const extractPublicId = (url) => {
    if (!url) return null;
    try {
        // Busca el patron /upload/ o /authenticated/ y toma todo lo que sigue sin la extension
        const match = url.match(/\/(?:upload|authenticated)\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
        return match ? match[1] : null;
    } catch {
        return null;
    }
};

// Genera una URL firmada para una imagen privada
export const generateSignedUrl = (cloudinaryUrl) => {
    if (!cloudinaryUrl) return null;

    const publicId = extractPublicId(cloudinaryUrl);
    if (!publicId) return cloudinaryUrl;

    return cloudinary.utils.private_download_url(publicId, "jpg", {
        resource_type: "image",
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + EXPIRATION_SECONDS,
    });
};

// Toma un objeto store y reemplaza las URLs privadas por URLs firmadas
export const signStoreDocumentUrls = (store) => {
    const signed = { ...store };

    PRIVATE_FIELDS.forEach((field) => {
        if (signed[field]) {
            signed[field] = generateSignedUrl(signed[field]);
        }
    });

    return signed;
};