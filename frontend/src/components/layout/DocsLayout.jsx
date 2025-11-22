import React ,{useEffect, useState} from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { fetchUser } from "../../lib/fetchUser.js";
import DropDown, { DropDownItem } from "../ui/DropDown.jsx";
import { authClient } from "../../lib/auth-client.ts";
import Button from "../external/Button.jsx";
import GlassSurface from "../external/GlassSurface.jsx";
import AuthModal from "../external/AuthModal.jsx";

const DocsLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("login");

  useEffect(() => {
    fetchUser().then(setUser);
  }, [])

  const openModal = (mode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleAuthSubmit = async (formData, mode) => {
    const { name, email, password } = formData;

    if (mode === "login") {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        console.log(error.message);
        return;
      }
      closeModal();
      setUser(data.user);
      return;
    }

    if (mode === "signup") {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (error) {
        console.log(error.message);
        return;
      }
      closeModal();
      setUser(data.user);
      return;
    }
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setUser(null);
          navigate('/');
        },
      },
    });
  }
  

  return (
    <div className="min-h-screen bg-[#060010] text-white font-[font]">
      <div className="fixed w-screen h-22 flex items-center justify-between px-90 z-50">
        <span className="pl-2 font-bold text-2xl cursor-pointer" onClick={() => navigate('/')}>LOGO</span>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button className="mr-6" onClick={() => navigate('/app')}>Components</Button>
              <DropDown
                trigger={
                  <div className="flex items-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span className="pl-2 text-2xl font-semibold">{user.name}</span>
                  </div>
                }
              >
                <DropDownItem>Profile</DropDownItem>
                <DropDownItem onClick={handleLogout}>Logout</DropDownItem>
              </DropDown>
            </>
          ) : (
            <>
              <GlassSurface
                width={140}
                height={44}
                borderRadius={30}
                className="cursor-pointer px-4"
                mixBlendMode="screen"
                onClick={() => openModal("signup")}
              >
                <span className="text-sm text-white font-medium">Sign up</span>
              </GlassSurface>

              <Button
                width="140px"
                height="44px"
                className="-translate-y-px"
                onClick={() => openModal("login")}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
      
      <AuthModal
        open={modalOpen}
        mode={modalMode}
        onClose={closeModal}
        onSubmit={handleAuthSubmit}
      />
      <div className="fixed w-screen h-2 top-20 pointer-events-none">
        <div
          className="absolute inset-0 bg-linear-to-b from-[#251c35] to-transparent"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 55%, black 1%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 55%, black 1%, transparent 100%)",
          }}
        ></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div
          className="grid"
          style={{ gridTemplateColumns: "16rem 1fr", gap: "2.5rem" }}
        >
          <aside>
            <div className="sticky top-35">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-4">
                Docs
              </h3>
              <nav className="flex flex-col gap-2">
                <NavLink
                  to="."
                  end
                  className={({ isActive }) =>
                    `text-sm px-2 py-1 rounded-l-md ${
                      isActive
                        ? "text-white border-l-2 border-violet-400 bg-white/2"
                        : "text-zinc-300 hover:text-white hover:border-l-2 hover:border-violet-400"
                    }`
                  }
                >
                  Introduction
                </NavLink>

                <NavLink
                  to="installation"
                  className={({ isActive }) =>
                    `text-sm px-2 py-1 rounded-l-md ${
                      isActive
                        ? "text-white border-l-2 border-violet-400 bg-white/2"
                        : "text-zinc-300 hover:text-white hover:border-l-2 hover:border-violet-400"
                    }`
                  }
                >
                  Installation
                </NavLink>

                <NavLink
                  to="cli"
                  className={({ isActive }) =>
                    `text-sm px-2 py-1 rounded-l-md ${
                      isActive
                        ? "text-white border-l-2 border-violet-400 bg-white/2"
                        : "text-zinc-300 hover:text-white hover:border-l-2 hover:border-violet-400"
                    }`
                  }
                >
                  CLI
                </NavLink>

                <NavLink
                  to="manual"
                  className={({ isActive }) =>
                    `text-sm px-2 py-1 rounded-l-md ${
                      isActive
                        ? "text-white border-l-2 border-violet-400 bg-white/2"
                        : "text-zinc-300 hover:text-white hover:border-l-2 hover:border-violet-400"
                    }`
                  }
                >
                  Manual
                </NavLink>
              </nav>
            </div>
          </aside>

          <main className="overflow-auto h-[70vh] pr-4 mt-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DocsLayout;
