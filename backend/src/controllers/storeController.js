import storeModel from '../models/Stores.js';

const storeController = {};

storeController.insertStores = async (req, res) => {
    try {
        // req.file is provided by multer/cloudinary middleware
        if (!req.file) {
            return res.status(400).json({ message: "Logo image is required" });
        }

        const storeData = {
            ...req.body,
            logo: req.file.path, // Cloudinary URL
        };

        const newStore = new storeModel(storeData);
        await newStore.save();

        res.status(201).json({ message: "Store created successfully", data: newStore });
    } catch (error) {
        res.status(500).json({ message: "Error creating store", error: error.message });
    }
};

export default storeController;