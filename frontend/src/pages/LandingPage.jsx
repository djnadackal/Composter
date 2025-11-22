import React, { useState } from "react";
import DarkVeil from "../components/external/DarkVeil.jsx";
import SplitText from "../components/external/text-animation/SplitText.jsx";
import GlassSurface from "../components/external/GlassSurface.jsx";
import LoginButton from "../components/external/Button.jsx";
import AuthModal from "../components/external/AuthModal.jsx";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client.ts";

const LandingPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("login");
  const navigate = useNavigate();

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
      {
        onError: (ctx) => {
          // Handle the error
          if (ctx.error.status === 403) {
            alert("Please verify your email address");
          }
          alert(ctx.error.message);
        }
      }

      closeModal();
      navigate("/app");
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
      navigate("/app");
      return;
    }
  };

  const handleDocNavigate = () => {
    navigate("/docs");
  };

  return (
    <div className="w-screen h-screen font-[font] relative">
      <DarkVeil />
      {/* Fixed glass CTA in the navbar area (top-right) */}
      <div className="fixed top-6 right-90 z-50">
        <div className="flex items-center gap-3">
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

          <LoginButton
            width="140px"
            height="44px"
            className="-translate-y-px"
            onClick={() => openModal("login")}
          >
            Login
          </LoginButton>
        </div>
      </div>
      <AuthModal
        open={modalOpen}
        mode={modalMode}
        onClose={closeModal}
        onSubmit={handleAuthSubmit}
      />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative text-center">
          <div className="w-full">
            <div className="max-w-4xl mx-auto">
              <GlassSurface
                width={140}
                height={44}
                borderRadius={30}
                className="cursor-pointer px-4 ml-90 mb-6"
                mixBlendMode="screen"
                onClick={handleDocNavigate}
              >
                <span className="text-sm text-white font-medium">Docs</span>
              </GlassSurface>
              <SplitText
                text="Your Personal Vault"
                className="text-7xl text-white font-medium leading-tight"
                delay={50}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />

              <SplitText
                text={"For\u00A0React\u00A0Components"}
                className="text-7xl text-white font-medium -mt-2 leading-tight"
                delay={50}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
            </div>

            <div className="w-full mt-8 flex justify-center">
              <SplitText
                text={
                  "Upload, organize, and retrieve your components instantly with our CLI and dashboard"
                }
                className="text-lg text-white/90 font-light max-w-3xl leading-tight text-center"
                delay={20}
                duration={1}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
