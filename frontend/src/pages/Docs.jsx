import React from "react";
import { ArrowLeft, Book, Code, Terminal, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Docs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#060010] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/app")}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Book className="text-violet-400" size={24} />
              <h1 className="text-xl font-bold">Composter Documentation</h1>
            </div>
          </div>
          <div className="text-sm text-white/50">v1.0.0</div>
        </div>
      </header>

      <div className="pt-20 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white/50 uppercase mb-3">Getting Started</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#introduction" className="text-white/70 hover:text-violet-400 transition-colors text-sm">
                      Introduction
                    </a>
                  </li>
                  <li>
                    <a href="#installation" className="text-white/70 hover:text-violet-400 transition-colors text-sm">
                      Installation
                    </a>
                  </li>
                  <li>
                    <a href="#quick-start" className="text-white/70 hover:text-violet-400 transition-colors text-sm">
                      Quick Start
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/50 uppercase mb-3">CLI</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#cli-login" className="text-white/70 hover:text-violet-400 transition-colors text-sm">
                      Login
                    </a>
                  </li>
                  <li>
                    <a href="#cli-push" className="text-white/70 hover:text-violet-400 transition-colors text-sm">
                      Push Components
                    </a>
                  </li>
                  <li>
                    <a href="#cli-pull" className="text-white/70 hover:text-violet-400 transition-colors text-sm">
                      Pull Components
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/50 uppercase mb-3">Web Dashboard</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#dashboard-overview" className="text-white/70 hover:text-violet-400 transition-colors text-sm">
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="#upload-component" className="text-white/70 hover:text-violet-400 transition-colors text-sm">
                      Upload Components
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-12">
            {/* Introduction */}
            <section id="introduction">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Zap className="text-violet-400" />
                Introduction
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Composter is a powerful component management system that helps developers store, organize, and share
                React components across projects. Built with modern tools and best practices, it provides both a CLI
                and web interface for seamless component management.
              </p>
              <div className="bg-[#060010] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-violet-400">Key Features</h3>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400 mt-1">•</span>
                    <span>Store and organize React components with categories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400 mt-1">•</span>
                    <span>CLI tool for quick push/pull operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400 mt-1">•</span>
                    <span>Live component preview with Sandpack</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400 mt-1">•</span>
                    <span>MCP integration for VS Code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-400 mt-1">•</span>
                    <span>Multi-file component support with dependencies</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Installation */}
            <section id="installation">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Terminal className="text-violet-400" />
                Installation
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Install the Composter CLI globally to start managing your components from the command line.
              </p>
              <div className="bg-[#060010] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/50">Terminal</span>
                  <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                    Copy
                  </button>
                </div>
                <code className="text-violet-300 font-mono text-sm">npm install -g composter-cli</code>
              </div>
            </section>

            {/* Quick Start */}
            <section id="quick-start">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Code className="text-violet-400" />
                Quick Start
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Login to Composter</h3>
                  <div className="bg-[#060010] border border-white/10 rounded-2xl p-6">
                    <code className="text-violet-300 font-mono text-sm">composter login</code>
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    Enter your email and password when prompted to authenticate.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. Push Your First Component</h3>
                  <div className="bg-[#060010] border border-white/10 rounded-2xl p-6">
                    <code className="text-violet-300 font-mono text-sm">
                      composter push --title "Button" --category "UI" --file ./Button.jsx
                    </code>
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    This uploads your component to the Composter vault under the "UI" category.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Pull a Component</h3>
                  <div className="bg-[#060010] border border-white/10 rounded-2xl p-6">
                    <code className="text-violet-300 font-mono text-sm">
                      composter pull --title "Button" --category "UI"
                    </code>
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    Downloads the component code to your current directory.
                  </p>
                </div>
              </div>
            </section>

            {/* CLI Commands */}
            <section id="cli-login">
              <h2 className="text-2xl font-bold mb-4">CLI Commands</h2>
              
              <div className="space-y-6">
                <div className="bg-[#060010] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-2 text-violet-400">composter login</h3>
                  <p className="text-white/70 mb-4">Authenticate with your Composter account.</p>
                  <div className="bg-black/30 rounded-xl p-4">
                    <code className="text-violet-300 font-mono text-sm">composter login</code>
                  </div>
                </div>

                <div id="cli-push" className="bg-[#060010] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-2 text-violet-400">composter push</h3>
                  <p className="text-white/70 mb-4">Upload a component to your vault.</p>
                  <div className="bg-black/30 rounded-xl p-4 mb-4">
                    <code className="text-violet-300 font-mono text-sm">
                      composter push --title "ComponentName" --category "Category" --file ./path/to/file.jsx
                    </code>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-3">
                      <span className="text-white/50 min-w-24">--title</span>
                      <span className="text-white/70">The name of your component</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-white/50 min-w-24">--category</span>
                      <span className="text-white/70">Category to organize the component</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-white/50 min-w-24">--file</span>
                      <span className="text-white/70">Path to the component file</span>
                    </div>
                  </div>
                </div>

                <div id="cli-pull" className="bg-[#060010] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-2 text-violet-400">composter pull</h3>
                  <p className="text-white/70 mb-4">Download a component from your vault.</p>
                  <div className="bg-black/30 rounded-xl p-4 mb-4">
                    <code className="text-violet-300 font-mono text-sm">
                      composter pull --title "ComponentName" --category "Category"
                    </code>
                  </div>
                </div>
              </div>
            </section>

            {/* Dashboard */}
            <section id="dashboard-overview">
              <h2 className="text-2xl font-bold mb-4">Web Dashboard</h2>
              
              <div className="space-y-6">
                <div className="bg-[#060010] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-2 text-violet-400">Overview</h3>
                  <p className="text-white/70">
                    The web dashboard provides a visual interface to manage your components. You can browse, search,
                    preview, and upload components directly from your browser.
                  </p>
                </div>

                <div id="upload-component" className="bg-[#060010] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-2 text-violet-400">Uploading Components</h3>
                  <p className="text-white/70 mb-4">
                    Navigate to the "My Components" section and click the "Upload Component" button. You can paste
                    your component code directly or upload multi-file components with dependencies.
                  </p>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400 mt-1">1.</span>
                      <span>Enter a title and select a category</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400 mt-1">2.</span>
                      <span>Paste your component code or upload multiple files</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400 mt-1">3.</span>
                      <span>Add any npm dependencies if needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400 mt-1">4.</span>
                      <span>Click "Upload" to save to your vault</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Docs;
