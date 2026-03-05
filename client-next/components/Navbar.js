import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import NavBtn from "./NavBtn";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { session } = useAuth();
    const logout = useLogout();
    const router = useRouter();

    const userInitial = session?.user?.user_metadata?.username
        ? session.user.user_metadata.username.trim().slice(0, 1).toUpperCase()
        : "G";

    const signOut = async () => {
        await logout();
        router.push("/");
    };

    return (
        <nav
            className={`transition-all duration-300 lg:h-full lg:w-24 ${isCollapsed ? "w-28 right-5" : "w-11/12 left-1/2 -translate-x-1/2"} h-20 lg:pt-12 lg:pb-12 border-primary border-1 fixed bg-dark-black z-50 lg:top-0 lg:left-0 bottom-5 lg:translate-x-0 flex items-center justify-center overflow-hidden`}
        >
            <ul
                className={`w-full h-full flex lg:flex-col items-center justify-between lg:gap-0 px-4`}
            >
                {/* Profile Section - Always Visible */}
                <li className="flex flex-col items-center">
                    <div className="profile bg-primary md:h-14 md:w-14 w-12 h-12 flex justify-center items-center">
                        <h2 className="md:text-3xl text-2xl font-bold">{userInitial}</h2>
                    </div>
                </li>

                {/* Nav Items - Hidden on mobile when collapsed */}
                <div className={`flex lg:flex-col items-center gap-4 lg:gap-6 ${isCollapsed ? "hidden lg:flex" : "flex"}`}>
                    <NavBtn title="search" icon_name="search" link="/search" />
                    <NavBtn title="popular" icon_name="auto_awesome" link="/popular" />

                    {session ? (
                        <>
                            <NavBtn title="create" icon_name="add_circle_outline" link="/create" />
                            <li>
                                <button
                                    className="flex gap-2 lg:flex-col items-center text-white group"
                                    onClick={signOut}
                                >
                                    <i className="material-symbols-rounded lg:text-5xl text-3xl text-primary group-hover:opacity-40 group-active:opacity-40">
                                        logout
                                    </i>
                                    <span className="group-hover:text-primary group-active:text-primary md:block hidden">
                                        logout
                                    </span>
                                </button>
                            </li>
                        </>
                    ) : (
                        <NavBtn title="login" icon_name="login" link="/login" />
                    )}
                </div>

                {/* Toggle Button - Mobile Only */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <i className="material-symbols-rounded text-primary text-3xl">
                        {isCollapsed ? "menu" : "close"}
                    </i>
                </button>
            </ul>
        </nav>

    );
};

export default Navbar;
