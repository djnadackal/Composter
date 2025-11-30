import React from "react";
import { Menu, Github } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../../lib/auth-client.ts";
import logo from "@/assets/logo.png";

export default function Topbar() {
    const navigate = useNavigate();
    const { data: session } = useSession();

    return (
        <header className="h-16 fixed top-0 right-0 left-0 lg:left-64 z-30 bg-[#09090b]/80 backdrop-blur-xl border-b border-border/30">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Mobile Logo */}
                <Link to="/" className="flex lg:hidden items-center gap-2">
                    <img src={logo} alt="Composter" className="h-7 w-7 object-contain" />
                    <span className="text-base font-semibold text-foreground">Composter</span>
                </Link>

                {/* Mobile Menu Button */}
                <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground">
                    <Menu size={20} />
                </button>

                {/* Desktop - Right Actions */}
                <div className="hidden lg:flex items-center gap-4 ml-auto">
                    <a 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 transition-colors"
                        title="GitHub"
                    >
                        <Github size={18} />
                    </a>

                    <div className="h-6 w-px bg-border/50" />

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-foreground">{session?.user?.name || "User"}</p>
                            <p className="text-xs text-muted-foreground">{session?.user?.email || ""}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
