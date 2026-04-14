import storeModel from "../models/Stores.js";

const myStoreController = {};

// GET — obtener datos de la propia tienda
myStoreController.getMyStore = async (req, res) => {
  try {
    const storeId = req.user.id;

    const store = await storeModel
      .findById(storeId)
      .select("-password -credentialsToken -credentialsTokenExpires");

    if (!store) return res.status(404).json({ message: "Store not found" });

    res.status(200).json(store);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching store", error: error.message });
  }
};

// PUT — actualizar info general (nombre, ubicacion, diseño, colores)
myStoreController.updateStoreInfo = async (req, res) => {
  try {
    const storeId = req.user.id;
    const { storeName, location, design, colors } = req.body;
    const files = req.files;

    const store = await storeModel.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    if (storeName) {
      if (storeName.trim().length < 2) {
        return res
          .status(400)
          .json({ message: "Store name must be at least 2 characters" });
      }
      store.storeName = storeName.trim();
    }

    if (location !== undefined) store.location = location.trim();
    if (design) store.design = design;
    if (colors) store.colors = JSON.parse(colors);

    // Logo nuevo
    if (files?.logo?.[0]) store.logo = files.logo[0].path;

    await store.save();
    res.status(200).json({ message: "Store updated", data: store });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating store", error: error.message });
  }
};

// PUT — actualizar about (descripcion, mision, vision e imagenes)
myStoreController.updateAbout = async (req, res) => {
  try {
    const storeId = req.user.id;
    const { description, mission, vision } = req.body;
    const files = req.files;

    const store = await storeModel.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Inicializar about si no existe
    if (!store.about) {
      store.about = {
        description: "",
        mission: "",
        vision: "",
        images: ["", "", ""],
      };
    }

    // Asegurar que images tenga 3 posiciones
    const images =
      store.about.images?.length === 3 ? [...store.about.images] : ["", "", ""];

    if (description !== undefined) store.about.description = description.trim();
    if (mission !== undefined) store.about.mission = mission.trim();
    if (vision !== undefined) store.about.vision = vision.trim();

    store.about.isActive = !!(
      store.about.description ||
      store.about.mission ||
      store.about.vision
    );

    // Imagen 0 — descripcion
    if (files?.descriptionImage?.[0])
      images[0] = files.descriptionImage[0].path;
    // Imagen 1 — mision
    if (files?.missionImage?.[0]) images[1] = files.missionImage[0].path;
    // Imagen 2 — vision
    if (files?.visionImage?.[0]) images[2] = files.visionImage[0].path;

    store.about.images = images;
    store.markModified("about");

    await store.save();
    res.status(200).json({ message: "About updated", data: store.about });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating about", error: error.message });
  }
};

export default myStoreController;
