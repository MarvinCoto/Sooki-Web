const logoutController = {};

logoutController.logout = async (req, res) => {
    try {
        // Limpiar la cookie
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });
        
        res.json({ 
            success: true, 
            message: "Logout successful" 
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error during logout" 
        });
    }
};

export default logoutController;