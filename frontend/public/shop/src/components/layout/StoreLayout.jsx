import Sidebar from "./Sidebar";
import "../../styles/sidebar.css";

const StoreLayout = ({ children }) => {
    return (
        <div className="store-layout">
            <Sidebar />
            <main className="store-main">
                {children}
            </main>
        </div>
    );
};

export default StoreLayout;