import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Copy, Check, Terminal, FileCode, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client.ts";
import logo from "@/assets/logo.png";

// Sidebar navigation structure
const sidebarNav = [
  {
    title: "Get Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start" },
    ],
  },
  {
    title: "CLI",
    items: [
      { id: "cli-login", label: "Login" },
      { id: "cli-push", label: "Push Components" },
      { id: "cli-pull", label: "Pull Components" },
      { id: "cli-list", label: "List Components" },
      { id: "cli-update", label: "Update Components" },
    ],
  },
  {
    title: "Dashboard",
    items: [
      { id: "dashboard-overview", label: "Overview" },
      { id: "dashboard-upload", label: "Upload Components" },
      { id: "dashboard-manage", label: "Manage Components" },
    ],
  },
];

// Code block component with copy button
const CodeBlock = ({ code, showLineNumbers = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="relative group rounded-xl border border-border/50 bg-[#0d0d0d] overflow-hidden">
      <div className="flex items-center overflow-x-auto">
        {showLineNumbers && (
          <div className="flex-shrink-0 py-4 pl-4 pr-3 text-right select-none border-r border-border/30">
            {lines.map((_, i) => (
              <div key={i} className="text-xs text-muted-foreground/50 leading-6 font-mono">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <pre className="flex-1 py-4 px-4 overflow-x-auto">
          <code className="text-sm font-mono text-zinc-300 leading-6">
            {lines.map((line, i) => (
              <div key={i}>{line || ' '}</div>
            ))}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-800/80 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-zinc-700/80 transition-all opacity-0 group-hover:opacity-100"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};

// Method selection card
const MethodCard = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 flex flex-col items-center justify-center gap-3 p-8 rounded-xl border transition-all duration-200",
      active 
        ? "border-primary/50 bg-primary/5 text-primary" 
        : "border-border/50 bg-card/30 text-muted-foreground hover:border-border hover:text-foreground"
    )}
  >
    <Icon size={32} strokeWidth={1.5} />
    <span className="font-medium">{label}</span>
  </button>
);

const Docs = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [user, setUser] = useState(null);
  const [method, setMethod] = useState("cli"); // 'manual' or 'cli'

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authClient.getSession();
        setUser(data?.user || null);
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Handle scroll for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = sidebarNav.flatMap(group => group.items.map(item => item.id));
      const scrollPos = window.scrollY + 120;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="Composter" className="h-7 w-7 object-contain" />
              <span className="text-base font-semibold text-foreground">Composter</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-zinc-900 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Github size={16} />
                <span className="hidden sm:inline">Star on GitHub</span>
              </a>
              
              {user ? (
                <Button asChild size="sm" className="h-8">
                  <Link to="/app">Dashboard</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm" className="h-8 hidden sm:inline-flex">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm" className="h-8">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto border-r border-border/30">
          <nav className="py-8 px-4">
            {sidebarNav.map((group, groupIndex) => (
              <div key={group.title} className={cn(groupIndex > 0 && "mt-8")}>
                <h4 className="px-3 mb-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                  {group.title}
                </h4>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-150",
                        activeSection === item.id 
                          ? "text-primary bg-primary/10 border-l-2 border-primary -ml-0.5 pl-[calc(0.75rem+2px)]" 
                          : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/50"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 pt-14">
          <div className="max-w-3xl mx-auto px-6 py-12">
            
            {/* Introduction */}
            <section id="introduction" className="mb-20">
              <h1 className="text-4xl sm:text-5xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-6">
                Introduction
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Composter is your personal vault for storing and retrieving reusable React components. 
                Save components once, then pull them into any project using the CLI or web dashboard.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-border/30 bg-zinc-900/50">
                  <h3 className="font-medium text-foreground mb-2">CLI Tool</h3>
                  <p className="text-sm text-muted-foreground">
                    Push, pull, and manage components directly from your terminal with simple commands.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-border/30 bg-zinc-900/50">
                  <h3 className="font-medium text-foreground mb-2">Web Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Visual interface to browse, upload, and organize your component library.
                  </p>
                </div>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Installation
              </h2>
              <p className="text-muted-foreground mb-8">
                Using components is very straightforward, anyone can do it.
              </p>

              {/* Pick the Method */}
              <h3 className="text-xl font-medium text-foreground mb-3">Pick The Method</h3>
              <p className="text-muted-foreground mb-4">
                You can keep it simple and copy code directly from the dashboard, or you can use CLI commands to install components into your project.
              </p>
              <p className="text-sm text-muted-foreground/70 mb-6">
                Click the cards below to change your preferred method.
              </p>

              <div className="flex gap-4 mb-12">
                <MethodCard 
                  icon={FileCode} 
                  label="Manual" 
                  active={method === "manual"} 
                  onClick={() => setMethod("manual")} 
                />
                <MethodCard 
                  icon={Terminal} 
                  label="CLI" 
                  active={method === "cli"} 
                  onClick={() => setMethod("cli")} 
                />
              </div>

              {/* Steps */}
              <h3 className="text-xl font-medium text-foreground mb-3">Steps</h3>
              <p className="text-muted-foreground mb-8">
                Follow these steps to {method === "manual" ? "manually copy" : "install"} components:
              </p>

              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="text-primary">1.</span> 
                    {method === "cli" ? "Install the CLI" : "Browse components"}
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    {method === "cli" 
                      ? "Install the Composter CLI globally to get started."
                      : "Navigate to the dashboard and find a component you want to use."
                    }
                  </p>
                  {method === "cli" && (
                    <CodeBlock code="npm install -g composter-cli" />
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="text-primary">2.</span>
                    {method === "cli" ? "Login to your account" : "Copy the code"}
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    {method === "cli"
                      ? "Authenticate with your Composter account."
                      : "Click on the component to view its code, then copy it to your project."
                    }
                  </p>
                  {method === "cli" && (
                    <CodeBlock code="composter login" />
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="text-primary">3.</span>
                    {method === "cli" ? "Pull components" : "Install dependencies"}
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    {method === "cli"
                      ? "Pull any component from your vault into your current project."
                      : "Check if the component has any dependencies and install them."
                    }
                  </p>
                  {method === "cli" && (
                    <CodeBlock code="composter pull buttons PrimaryButton" />
                  )}
                </div>
              </div>
            </section>

            {/* Quick Start */}
            <section id="quick-start" className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Quick Start
              </h2>
              <p className="text-muted-foreground mb-8">
                Get up and running with Composter in under 2 minutes.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-foreground mb-3">Create a category</h4>
                  <p className="text-muted-foreground mb-4">
                    Categories help you organize related components together.
                  </p>
                  <CodeBlock code="composter mkcat buttons" />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-foreground mb-3">Push your first component</h4>
                  <p className="text-muted-foreground mb-4">
                    Upload a component file to your vault.
                  </p>
                  <CodeBlock code="composter push buttons ./src/components/Button.jsx" />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-foreground mb-3">Pull into another project</h4>
                  <p className="text-muted-foreground mb-4">
                    Download the component into your current working directory.
                  </p>
                  <CodeBlock code="composter pull buttons Button" />
                </div>
              </div>
            </section>

            {/* CLI Login */}
            <section id="cli-login" className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Login
              </h2>
              <p className="text-muted-foreground mb-6">
                Authenticate with your Composter account to access your component vault.
              </p>
              <CodeBlock code="composter login" />
              <p className="text-sm text-muted-foreground mt-4">
                You'll be prompted to enter your email and password. Your session token is stored locally for future commands.
              </p>
            </section>

            {/* CLI Push */}
            <section id="cli-push" className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Push Components
              </h2>
              <p className="text-muted-foreground mb-6">
                Upload components to your vault for later use.
              </p>
              <CodeBlock code={`composter push <category> <file-path>

# Example
composter push buttons ./src/Button.jsx
composter push cards ./src/ProfileCard.tsx`} />
              
              <div className="mt-6 p-4 rounded-xl border border-border/30 bg-zinc-900/50">
                <h4 className="font-medium text-foreground mb-2">Arguments</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-4">
                    <code className="text-primary min-w-24">category</code>
                    <span className="text-muted-foreground">The category to store the component in</span>
                  </div>
                  <div className="flex gap-4">
                    <code className="text-primary min-w-24">file-path</code>
                    <span className="text-muted-foreground">Path to your component file</span>
                  </div>
                </div>
              </div>
            </section>

            {/* CLI Pull */}
            <section id="cli-pull" className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Pull Components
              </h2>
              <p className="text-muted-foreground mb-6">
                Download components from your vault into your project.
              </p>
              <CodeBlock code={`composter pull <category> <component-name>

# Example
composter pull buttons PrimaryButton`} />
              <p className="text-sm text-muted-foreground mt-4">
                Components are downloaded to a <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-xs">composter/</code> folder in your current directory.
              </p>
            </section>

            {/* CLI List */}
            <section id="cli-list" className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                List Components
              </h2>
              <p className="text-muted-foreground mb-6">
                View all components in a category.
              </p>
              <CodeBlock code={`composter list <category>

# Example
composter list buttons`} />
            </section>

            {/* CLI Update */}
            <section id="cli-update" className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Update Components
              </h2>
              <p className="text-muted-foreground mb-6">
                Replace an existing component with a new version.
              </p>
              <CodeBlock code={`composter update <category> <file-path>

# Example
composter update buttons ./src/Button.jsx`} />
            </section>

            {/* Dashboard Overview */}
            <section id="dashboard-overview" className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Dashboard Overview
              </h2>
              <p className="text-muted-foreground mb-6">
                The web dashboard provides a visual interface to manage your component library without using the command line.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Browse Components", desc: "View all your stored components organized by category." },
                  { title: "Live Preview", desc: "See components rendered in real-time with Sandpack." },
                  { title: "Code View", desc: "Inspect and copy component source code directly." },
                  { title: "Search", desc: "Quickly find components across all categories." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border/30 bg-zinc-900/50">
                    <ChevronRight size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Dashboard Upload */}
            <section id="dashboard-upload" className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Upload Components
              </h2>
              <p className="text-muted-foreground mb-6">
                Add new components to your vault through the web interface.
              </p>

              <ol className="space-y-4">
                {[
                  "Navigate to your dashboard and select a category",
                  "Click the \"Upload Component\" button",
                  "Paste your component code or select a file",
                  "Add any npm dependencies if required",
                  "Click \"Upload\" to save to your vault",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Dashboard Manage */}
            <section id="dashboard-manage" className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Manage Components
              </h2>
              <p className="text-muted-foreground mb-6">
                Edit, update, or delete components from your vault.
              </p>

              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-border/30 bg-zinc-900/50">
                  <h4 className="font-medium text-foreground mb-2">Update a Component</h4>
                  <p className="text-sm text-muted-foreground">
                    Select a component → Click "Edit" → Upload the new version or modify the code directly.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-border/30 bg-zinc-900/50">
                  <h4 className="font-medium text-foreground mb-2">Delete a Component</h4>
                  <p className="text-sm text-muted-foreground">
                    Select a component → Click "Delete" → Confirm the action. This cannot be undone.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-border/30 bg-zinc-900/50">
                  <h4 className="font-medium text-foreground mb-2">Manage Categories</h4>
                  <p className="text-sm text-muted-foreground">
                    Create, rename, or delete categories from the sidebar. Deleting a category removes all components inside.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <h3 className="text-2xl font-medium text-foreground mb-2">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Create an account and start building your personal component library.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/signup">Create Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/app">Go to Dashboard</Link>
                </Button>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
