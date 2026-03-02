// IMPORTACIONES DE MONGOOSE PARA DEFINIR ESQUEMAS Y MODELOS
import { Schema, model} from "mongoose";

const clientsSchema = new Schema({
    // INFORMACIÓN BÁSICA DEL CLIENTE
    name: {
        type: String,       // Tipo de dato: texto
        required: true,     // Campo obligatorio
        minLength: 2,       // Mínimo 2 caracteres
        maxLength: 50,      // Máximo 50 caracteres
        trim: true          // Eliminar espacios al inicio y final
    },
    lastname: {
        type: String,       // Apellido del cliente
        required: true,     // Campo obligatorio
        minLength: 2,       // Mínimo 2 caracteres
        maxLength: 50,      // Máximo 50 caracteres
        trim: true          // Eliminar espacios al inicio y final
    },
    birthdate: {
        type: Date,         // Fecha de nacimiento
        required: true,     // Campo obligatorio
    },
    
    // INFORMACIÓN DE CONTACTO
    email: {
        type: String,       // Email del cliente
        required: true,     // Campo obligatorio
        minLength: 4,       // Mínimo 4 caracteres
        maxLength: 50,      // Máximo 50 caracteres
        trim: true,         // Eliminar espacios
        // VALIDACIÓN CON REGEX PARA FORMATO DE EMAIL
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    // INFORMACIÓN DE AUTENTICACIÓN
    password: {
        type: String,       // Contraseña encriptada
        required: true,     // Campo obligatorio
        min: 8,             // Mínimo 8 caracteres
        trim: true          // Eliminar espacios
    },
    isVerified: {
        type: Boolean,      // Estado de verificación del email
        default: false      // Por defecto no verificado
    },

    /* Campos para después
    // INFORMACIÓN DE FIREBASE (PARA LOGIN CON GOOGLE/FACEBOOK)
    firebaseUid: {
        type: String,       // ID único de Firebase
        required: false,    
        sparse: true,       // Permite que sea unique pero null/undefined
        unique: true        // Debe ser único cuando existe
    },
    provider: {
        type: String,       // Proveedor de autenticación
        required: false,    
        enum: ['email', 'google'], 
        default: 'email'    // Por defecto autenticación por email
    },

    //CAMPOS PARA NOTIFICACIONES PUSH
    pushToken: {
        type: String,
        required: false,
        default: null,
        sparse: true  // Permite múltiples documentos con null
    },
    platform: {
        type: String,
        enum: ['ios', 'android', null],
        default: null
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    deviceInfo: {
        brand: String,
        modelName: String,
        osVersion: String
    },
    lastTokenUpdate: {
        type: Date,
        default: null
    },*/

    // INFORMACIÓN ADICIONAL
    photo: {
        type: String,       // URL de la foto de perfil
        required: false     // Campo opcional
    },

    /* ARRAYS DE REFERENCIA A OTROS DOCUMENTOS favoritos queda pendiente ya que el modelo de productos aún no se ha definidos
    favorites: [
        {
            idProduct: {
                type: Schema.Types.ObjectId,  // Referencia a ObjectId de otra colección
                ref: "Products",                  // Referencia a la colección "Products"
                required: false,              // Campo opcional
            },
        },
    ],*/

}, {
    // OPCIONES DEL ESQUEMA
    timestamps: true,       // Agregar automáticamente createdAt y updatedAt
    strict: false          // Permitir campos adicionales no definidos en el esquema
})

// EXPORTAR EL MODELO PARA USO EN CONTROLADORES
// El nombre "Clients" será el nombre de la colección en MongoDB (se pluraliza automáticamente)
export default model("Clients", clientsSchema)