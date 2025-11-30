import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Eye, Code2, FileText, FolderTree, PackageIcon, Check, RefreshCw, BookOpen } from "lucide-react";
import { Sandpack, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import Card from "../../components/ui/Card.jsx";
import { Button } from "@/components/ui/button";
import CodeBlock from "../../components/ui/CodeBlock.jsx";
import { cn } from "@/lib/utils";

// Copyable code block component
const CopyableCodeBlock = ({ code, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {label && <p className="text-xs text-muted-foreground mb-2">{label}</p>}
      <div className="relative group">
        <div className="flex items-center bg-[#0d0d0d] rounded-xl border border-border/30 overflow-hidden">
          <div className="flex-shrink-0 py-3 pl-4 pr-3 text-right select-none border-r border-border/20">
            <span className="text-xs text-muted-foreground/50 font-mono">1</span>
          </div>
          <pre className="flex-1 py-3 px-4 overflow-x-auto">
            <code className="text-sm font-mono text-zinc-300">{code}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-3 border-l border-border/20 text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 transition-colors"
            title="Copy"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const ComponentDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("preview");
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/components/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setComponent(data.component);
      } catch (error) {
        console.error("Error fetching component:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComponent();
  }, [id]);

  // Parse multi-file structure and dependencies
  const { sandpackFiles, mainFilename, dependencies } = useMemo(() => {
    if (!component) return { sandpackFiles: {}, mainFilename: "", dependencies: {} };

    let files = {};

    // Parse code (handle both JSON multi-file and legacy single string)
    try {
      const parsed = JSON.parse(component.code);
      if (typeof parsed === 'object' && parsed !== null) {
        files = parsed;
      } else {
        files = { "/App.js": component.code };
      }
    } catch (e) {
      files = { "/App.js": component.code };
    }

    // Normalize file paths
    const normalizedFiles = {};
    let firstFile = "";
    
    Object.keys(files).forEach((filename, index) => {
      const key = filename.startsWith("/") ? filename : `/${filename}`;
      normalizedFiles[key] = typeof files[filename] === 'string' 
        ? files[filename] 
        : files[filename].code || files[filename];
      if (index === 0) firstFile = key;
    });

    // Create entry point wrapper
    const entryImport = firstFile.replace(/\.(tsx|jsx|js)$/, "");
    
    normalizedFiles["/root.js"] = `import React from "react";
import { createRoot } from "react-dom/client";
import * as UserExports from "${entryImport}";

const UserComponent = UserExports.default || 
  Object.values(UserExports).find(exp => typeof exp === 'function') || 
  (() => <div className="text-red-500 p-4">Error: No React component exported.</div>);

const root = createRoot(document.getElementById("root"));
root.render(
  <div className="p-8 flex justify-center min-h-screen items-center bg-[#0d0d0d] text-white">
    <UserComponent />
  </div>
);`;

    normalizedFiles["/public/index.html"] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

    normalizedFiles["/tsconfig.json"] = JSON.stringify({
      compilerOptions: {
        baseUrl: ".",
        paths: { "@/*": ["./src/*"] }
      }
    }, null, 2);

    // Parse dependencies
    let deps = {};
    if (component.dependencies) {
      try {
        deps = typeof component.dependencies === 'string' 
          ? JSON.parse(component.dependencies) 
          : component.dependencies;
      } catch (e) {
        console.error("Failed to parse dependencies:", e);
      }
    }

    return {
      sandpackFiles: normalizedFiles,
      mainFilename: firstFile,
      dependencies: deps
    };
  }, [component]);

  // Generate file tree structure
  const fileTree = useMemo(() => {
    if (!sandpackFiles || Object.keys(sandpackFiles).length === 0) return [];

    const tree = {};
    const visibleFiles = Object.keys(sandpackFiles).filter(
      path => path !== '/root.js' && path !== '/public/index.html' && path !== '/tsconfig.json'
    );

    visibleFiles.forEach(filePath => {
      const parts = filePath.split('/').filter(Boolean);
      let current = tree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = { type: 'file', path: filePath };
        } else {
          if (!current[part]) {
            current[part] = { type: 'folder', children: {} };
          }
          current = current[part].children;
        }
      });
    });

    return tree;
  }, [sandpackFiles]);

  // Render file tree
  const renderFileTree = (tree, parentPath = '') => {
    return Object.entries(tree).map(([name, node]) => {
      if (node.type === 'file') {
        const isSelected = selectedFile === node.path;
        return (
          <button
            key={node.path}
            onClick={() => setSelectedFile(node.path)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors w-full text-left",
              isSelected
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/50"
            )}
          >
            <FileText size={16} />
            <span>{name}</span>
          </button>
        );
      } else {
        return (
          <div key={`${parentPath}/${name}`} className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground/70">
              <FolderTree size={16} />
              <span>{name}</span>
            </div>
            <div className="ml-4 space-y-1">
              {renderFileTree(node.children, `${parentPath}/${name}`)}
            </div>
          </div>
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading component...</p>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-medium text-foreground mb-4">Component not found</h2>
        <Button asChild>
          <Link to="/app/components">Back to Components</Link>
        </Button>
      </div>
    );
  }

  // Set initial selected file
  if (!selectedFile && mainFilename) {
    setSelectedFile(mainFilename);
  }

  const depsArray = Object.keys(dependencies);

  return (
    <div className="space-y-8">
      {/* Back Link + Documentation */}
      <div className="flex items-center justify-between">
        <Link to="/app/components" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          Back to Components
        </Link>
        <Button variant="outline" size="sm" asChild>
          <Link to="/docs">
            <BookOpen size={16} className="mr-2" />
            Documentation
          </Link>
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-semibold text-foreground">{component.title}</h1>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/50 border border-border/30">
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "preview"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "code"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 size={16} />
            Code
          </button>
        </div>

        {activeTab === "preview" && (
          <button
            onClick={() => setPreviewKey(k => k + 1)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 transition-colors"
            title="Refresh preview"
          >
            <RefreshCw size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      {activeTab === "preview" && (
        <div className="space-y-8">
          {/* Preview Area */}
          <div className="rounded-2xl border border-border/30 bg-[#0d0d0d] overflow-hidden">
            <SandpackProvider
              key={previewKey}
              template="react"
              theme={dracula}
              files={sandpackFiles}
              customSetup={{
                entry: "/root.js",
                dependencies: {
                  ...dependencies,
                  "react": "^18.2.0",
                  "react-dom": "^18.2.0",
                  "lucide-react": "latest",
                  "clsx": "latest",
                  "tailwind-merge": "latest"
                }
              }}
              options={{
                externalResources: ["https://cdn.tailwindcss.com"],
              }}
            >
              <SandpackPreview 
                showNavigator={false}
                showRefreshButton={false}
                style={{ height: "400px" }}
              />
            </SandpackProvider>
          </div>

          {/* Dependencies */}
          {depsArray.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Dependencies</h3>
              <div className="flex flex-wrap gap-2">
                {depsArray.map((dep) => (
                  <span
                    key={dep}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Installation Commands */}
          <div className="space-y-4">
            {depsArray.length > 0 && (
              <CopyableCodeBlock 
                code={`npm install ${depsArray.join(' ')}`}
                label="Install dependencies"
              />
            )}
            
            <CopyableCodeBlock 
              code={`composter pull ${component.category?.name || 'category'} ${component.title}`}
              label="Pull component via CLI"
            />
          </div>

          {/* Code Sandbox */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Interactive Sandbox</h3>
            <div className="rounded-2xl border-2 border-border/40 overflow-hidden">
              <Sandpack
                template="react"
                theme={dracula}
                files={sandpackFiles}
                options={{
                  showNavigator: false,
                  showTabs: true,
                  editorHeight: 500,
                  activeFile: mainFilename,
                  externalResources: ["https://cdn.tailwindcss.com"],
                }}
                customSetup={{
                  entry: "/root.js",
                  dependencies: {
                    ...dependencies,
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0",
                    "lucide-react": "latest",
                    "clsx": "latest",
                    "tailwind-merge": "latest"
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "code" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: File Tree */}
          <div className="lg:col-span-1 space-y-4">
            <Card noPadding className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <FolderTree size={16} className="text-primary" />
                Files
              </h3>
              <div className="space-y-1">
                {renderFileTree(fileTree)}
              </div>
            </Card>

            {/* Dependencies in code view */}
            {depsArray.length > 0 && (
              <Card noPadding className="p-4">
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <PackageIcon size={16} className="text-primary" />
                  Dependencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {depsArray.map((dep) => (
                    <span
                      key={dep}
                      className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Code Viewer */}
          <div className="lg:col-span-3">
            <Card noPadding className="overflow-hidden">
              <div className="bg-zinc-900 px-4 py-3 border-b border-border/30 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">{selectedFile || mainFilename}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const code = sandpackFiles[selectedFile || mainFilename];
                    if (code) navigator.clipboard.writeText(code);
                  }}
                >
                  <Copy size={14} className="mr-2" />
                  Copy
                </Button>
              </div>
              <div className="max-h-[700px] overflow-auto">
                <CodeBlock 
                  code={sandpackFiles[selectedFile || mainFilename] || "// No code available"} 
                  language="jsx" 
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentDetail;
