import { Outlet } from "react-router";
import { Sidebar } from "./components/layout/Sidebar/Sidebar";
import { Topbar } from "./components/layout/Topbar/Topbar";
import { useSidebarState } from "./hooks/useSidebarState";

const App = () => {
    const { collapsed, toggle } = useSidebarState();

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar collapsed={collapsed} onToggle={toggle} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default App;
