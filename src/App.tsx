import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Settings, 
  Code2, 
  Download, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Info 
} from 'lucide-react';
import { AssistantBox } from './components/AssistantBox';
import { useProactiveAssistant } from './hooks/useProactiveAssistant';

const steps = [
  { id: 'intro', title: 'Welcome', icon: Terminal },
  { id: 'metadata', title: 'Metadata', icon: Settings },
  { id: 'trigger', title: 'Hook Trigger', icon: Settings },
  { id: 'code', title: 'Logic', icon: Code2 },
  { id: 'generate', title: 'Installer', icon: Download },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState({
    name: 'gemini-awesome-hook',
    description: 'A powerful hook for the Gemini CLI',
    author: 'developer',
    trigger: 'pre-request',
    mode: 'async',
    outputFormat: 'text',
    code: 'export default async function hook(context) {\n  // Access prompt: context.prompt\n  console.log("Intercepting...");\n  return context;\n}'
  });

  const { suggestion, isThinking, clearSuggestion } = useProactiveAssistant(
    formData,
    'http://localhost:8080/v1/chat/completions', 
    30000 // Poll every 30s
  );

  const handleApplySuggestion = (patch: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...patch }));
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00FF00] selection:text-black">
      
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00FF00] rounded-sm flex items-center justify-center text-black">
            <Terminal />
          </div>
          <div>
            <h1 className="font-bold tracking-tight uppercase text-xl leading-none">Gemini CLI</h1>
            <p className="text-[#00FF00] text-[10px] font-mono uppercase tracking-widest mt-1">Hook Generator</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4 text-xs font-mono text-white/50">
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#00FF00]"/> STATUS: ONLINE</span>
          <span>V 1.0.0</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-12 grid md:grid-cols-[1fr_2fr] gap-12 items-start mt-8">
        
        {/* Left Sidebar / Progress */}
        <div className="space-y-8 sticky top-32">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              const Icon = step.icon;
              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-4 p-3 rounded-md transition-all duration-300 ${
                    isActive ? 'bg-white/10 border-l-2 border-[#00FF00] text-white' : 
                    isPast ? 'text-white/60' : 'text-white/30'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#00FF00]' : ''} />
                  <span className="font-mono text-sm tracking-wider uppercase">{step.title}</span>
                </div>
              );
            })}
          </div>
          
          <div className="p-4 bg-white/5 border border-white/10 rounded-md">
            <h3 className="text-[10px] text-[#00FF00] font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
              <Info size={12} /> Instructions
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              This tool generates a full installation script for your custom Gemini CLI extension. Ensure you read the descriptions for each parameter.
            </p>
          </div>

          <AssistantBox 
            suggestion={suggestion} 
            isThinking={isThinking} 
            onApply={handleApplySuggestion}
            onDismiss={clearSuggestion}
          />
        </div>

        {/* Right Content Area */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="bg-[#111111] border border-white/10 p-8 md:p-10 rounded-lg shadow-2xl relative overflow-hidden"
            >
              {currentStep === 0 && <IntroStep onNext={handleNext} />}
              {currentStep === 1 && <MetadataStep data={formData} setData={setFormData} onNext={handleNext} onBack={handleBack} />}
              {currentStep === 2 && <TriggerStep data={formData} setData={setFormData} onNext={handleNext} onBack={handleBack} />}
              {currentStep === 3 && <CodeStep data={formData} setData={setFormData} onNext={handleNext} onBack={handleBack} />}
              {currentStep === 4 && <GenerateStep data={formData} onBack={handleBack} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function IntroStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tighter uppercase font-mono text-[#00FF00]">Build The Hook</h2>
        <p className="text-white/70 text-lg leading-relaxed">
          Gemini CLI supports custom hooks to intercept prompts, modify responses, and automate workflows right from your terminal. 
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/50 p-4 border border-white/5 rounded-md">
          <Code2 className="text-[#00FF00] mb-3" />
          <h4 className="font-mono text-sm uppercase mb-2">Javascript Based</h4>
          <p className="text-xs text-white/50">Write standard Node.js to manipulate context before or after execution.</p>
        </div>
        <div className="bg-black/50 p-4 border border-white/5 rounded-md">
          <Settings className="text-[#00FF00] mb-3" />
          <h4 className="font-mono text-sm uppercase mb-2">Auto-Installer</h4>
          <p className="text-xs text-white/50">Generates a bash script that handles directory setup and registration safely.</p>
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={onNext}
          className="bg-[#00FF00] text-black px-6 py-3 font-mono text-sm uppercase font-bold tracking-widest hover:bg-white transition-colors flex items-center gap-2 rounded-sm"
        >
          Begin Configuration <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function MetadataStep({ data, setData, onNext, onBack }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tighter uppercase font-mono mb-2">Extension Metadata</h2>
        <p className="text-white/50 text-sm">Define how your hook will be identified in the CLI ecosystem.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] text-[#00FF00] font-mono uppercase tracking-widest">Extension Name</label>
          <input 
            type="text" 
            value={data.name}
            onChange={e => setData({...data, name: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
            className="w-full bg-[#111111] border border-white/20 p-3 rounded-sm font-mono text-sm text-white focus:border-[#00FF00] focus:outline-none transition-colors"
            placeholder="e.g. git-commit-helper"
          />
          <div className="flex justify-between items-start mt-1">
            <p className="text-[10px] text-white/40 font-mono mt-1">Lowercase, no spaces. Standard npm formatting.</p>
            <div className="flex gap-2 mt-1">
              {['git-helper', 'json-formatter', 'rag-injector'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setData({...data, name: s})}
                  className="text-[10px] font-mono bg-white/5 hover:bg-[#00FF00]/20 hover:text-[#00FF00] px-2 py-1 rounded-sm text-white/50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-[#00FF00] font-mono uppercase tracking-widest flex justify-between">
            <span>Description</span>
            <span className="text-white/40">{data.description.length}/100</span>
          </label>
          <input 
            type="text" 
            value={data.description}
            onChange={e => setData({...data, description: e.target.value})}
            className="w-full bg-[#111111] border border-white/20 p-3 rounded-sm font-mono text-sm text-white focus:border-[#00FF00] focus:outline-none transition-colors ring-0"
            placeholder="Briefly describe what this hook does..."
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {['Injects project context', 'Auto-formats code blocks', 'Validates responses', 'Taps local database'].map(s => (
              <button 
                key={s} 
                onClick={() => setData({...data, description: s})}
                className="text-[10px] font-mono bg-white/5 hover:bg-[#00FF00]/20 hover:text-[#00FF00] px-2 py-1.5 rounded-sm text-white/50 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 lg:w-1/2">
          <label className="text-[10px] text-[#00FF00] font-mono uppercase tracking-widest">Author</label>
          <input 
            type="text" 
            value={data.author}
            onChange={e => setData({...data, author: e.target.value})}
            className="w-full bg-[#111111] border border-white/20 p-3 rounded-sm font-mono text-sm text-white focus:border-[#00FF00] focus:outline-none transition-colors"
            placeholder="Your name or handle"
          />
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white font-mono text-sm uppercase transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <button 
          onClick={onNext}
          disabled={!data.name}
          className="bg-white text-black px-6 py-3 font-mono text-sm uppercase font-bold tracking-widest hover:bg-[#00FF00] transition-colors flex items-center gap-2 rounded-sm disabled:opacity-50"
        >
          Next Step <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function TriggerStep({ data, setData, onNext, onBack }: any) {
  const triggers = [
    { id: 'pre-request', title: 'Pre-Request', desc: 'Intercepts the prompt before it is sent to the Gemini API. Useful for adding system context, RAG injections, or validation.' },
    { id: 'post-response', title: 'Post-Response', desc: 'Intercepts the response from the API before it is rendered to the terminal. Great for auto-formatting, logging, or piping.' },
    { id: 'on-startup', title: 'On Startup', desc: 'Runs when the CLI boots up. Used for loading custom commands, authenticating with external sub-systems, or environment checks.' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tighter uppercase font-mono mb-2">Configuration</h2>
        <p className="text-white/50 text-sm">Select the specific parameters for how your hook operates.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] text-[#00FF00] font-mono uppercase tracking-widest">Hook Trigger</label>
          <select
            value={data.trigger}
            onChange={e => setData({...data, trigger: e.target.value})}
            className="w-full bg-black border border-white/20 p-4 rounded-sm font-mono text-sm text-white focus:border-[#00FF00] focus:outline-none transition-colors appearance-none cursor-pointer"
          >
            {triggers.map(t => (
              <option key={t.id} value={t.id}>
                {t.title} - {t.desc.substring(0, 70)}...
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] text-[#00FF00] font-mono uppercase tracking-widest">Execution Mode</label>
            <select
              value={data.mode}
              onChange={e => setData({...data, mode: e.target.value})}
              className="w-full bg-black border border-white/20 p-4 rounded-sm font-mono text-sm text-white focus:border-[#00FF00] focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="async">Async (Promise)</option>
              <option value="sync">Sync (Blocking)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] text-[#00FF00] font-mono uppercase tracking-widest">Output Format</label>
            <select
              value={data.outputFormat}
              onChange={e => setData({...data, outputFormat: e.target.value})}
              className="w-full bg-black border border-white/20 p-4 rounded-sm font-mono text-sm text-white focus:border-[#00FF00] focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="text">Plain Text</option>
              <option value="json">JSON Object</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white font-mono text-sm uppercase transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <button 
          onClick={onNext}
          className="bg-white text-black px-6 py-3 font-mono text-sm uppercase font-bold tracking-widest hover:bg-[#00FF00] transition-colors flex items-center gap-2 rounded-sm"
        >
          Next Step <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function CodeStep({ data, setData, onNext, onBack }: any) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = data.code || '';
    if (!code.trim()) {
      setError("Error: Code cannot be empty.");
      return;
    }

    if (!code.includes('export default') && !code.includes('module.exports') && !code.includes('exports.')) {
      setError("Warning: Hook should export a module (e.g. 'export default function...').");
      return;
    }

    const checkBrackets = (codeStr: string) => {
      try {
        const cleanCode = codeStr
          .replace(/\/\*[\s\S]*?\*\//g, '') 
          .replace(/\/\/.*/g, '')           
          .replace(/(['"`])(?:(?!\1)[^\\]|\\.)*\1/g, ''); 

        let stack = [];
        const pairs: any = { '}': '{', ']': '[', ')': '(' };
        
        for (let i = 0; i < cleanCode.length; i++) {
          const char = cleanCode[i];
          if (['{', '[', '('].includes(char)) {
            stack.push(char);
          } else if (['}', ']', ')'].includes(char)) {
            const expected = pairs[char];
            if (stack.length === 0 || stack[stack.length - 1] !== expected) {
              return `Syntax Error: Mismatched '${char}'`;
            }
            stack.pop();
          }
        }
        
        if (stack.length > 0) {
          return `Syntax Error: Unclosed '${stack[stack.length - 1]}'`;
        }
        return null;
      } catch (e) {
        return null;
      }
    };

    const bracketError = checkBrackets(code);
    if (bracketError) {
      setError(bracketError);
      return;
    }

    if (code.includes('await ') && !code.includes('async ')) {
      setError('Warning: Using "await" without an "async" function declaration may cause errors.');
      return;
    }

    setError(null);
  }, [data.code]);

  const templates = [
    {
      group: "Pre-Request Hooks",
      options: [
        {
          label: "Inject System Prompt - Appends instructions before user prompt",
          code: `export default async function hook(context) {\n  context.prompt = "System: Be concise.\\n\\n" + context.prompt;\n  return context;\n}`
        },
        {
          label: "Block Harmful Keywords - Prevents specific words in prompts",
          code: `export default async function hook(context) {\n  const blocked = ["hack", "exploit", "bypass"];\n  if (blocked.some(word => context.prompt.toLowerCase().includes(word))) {\n    throw new Error("Prompt contains blocked keywords.");\n  }\n  return context;\n}`
        },
        {
          label: "Fetch External Context - Appends API data to context",
          code: `export default async function hook(context) {\n  try {\n    const res = await fetch("https://api.example.com/data");\n    const remoteData = await res.json();\n    context.prompt = \`Context: \${JSON.stringify(remoteData)}\\n\\nUser:\\n\` + context.prompt;\n  } catch (e) {\n    console.error("Failed to fetch context", e);\n  }\n  return context;\n}`
        },
        {
          label: "⭐ File Path Resolver - Replaces '@file' with file contents",
          code: `import { readFileSync, existsSync } from 'fs';\n\nexport default async function hook(context) {\n  // Looks for @filename.ext and replaces it with file contents\n  context.prompt = context.prompt.replace(/@([\\w.-]+)/g, (match, fileName) => {\n    if (existsSync(fileName)) {\n      const content = readFileSync(fileName, 'utf-8');\n      return \`\\n\\n--- Contents of \${fileName} ---\\n\${content}\\n---\\n\\n\`;\n    }\n    return match;\n  });\n  return context;\n}`
        },
        {
          label: "⭐ Git Diff Injector - Injects current uncommitted git changes",
          code: `import { execSync } from 'child_process';\n\nexport default async function hook(context) {\n  try {\n    const diff = execSync('git diff HEAD', { encoding: 'utf-8' });\n    if (diff.trim()) {\n      context.prompt = \`Current git diff:\\n\\n\${diff}\\n\\nUser Prompt: \` + context.prompt;\n    }\n  } catch (e) { /* Not a git repo or no changes */ }\n  return context;\n}`
        },
        {
          label: "🔥 Project RAG (Advanced) - Embeds & searches local files via ripgrep",
          code: `import { execSync } from 'child_process';\n\nexport default async function hook(context) {\n  // Grabs the first few words to do a fast local regex search\n  const keywords = context.prompt.split(' ').slice(0, 3).join('|');\n  try {\n    const rgOut = execSync(\`rg -C 2 -e "\${keywords}" .\`, { encoding: 'utf-8' }).substring(0, 2000);\n    context.prompt = \`Relevant local codebase snippets:\\n\${rgOut}\\n\\nQuery:\\n\` + context.prompt;\n  } catch (e) { }\n  return context;\n}`
        },
        {
          label: "🚀 URL Scraper Injector - Fetch page text from urls in prompt",
          code: `export default async function hook(context) {\n  const urlRegex = /(https?:\\/\\/[^\\s]+)/g;\n  const urls = context.prompt.match(urlRegex);\n  if (urls && urls.length > 0) {\n    console.log("Fetching web context...");\n    try {\n      const fetches = urls.map(u => fetch(u).then(r => r.text()));\n      const pages = await Promise.all(fetches);\n      const webContext = pages.map((page, i) => \`\\n--- URL: \${urls[i]} ---\\n\${page.substring(0, 1500)}...\`).join('\\n');\n      context.prompt += \`\\n\\nWeb Context:\${webContext}\`;\n    } catch (e) { console.error("Failed to fetch URLs."); }\n  }\n  return context;\n}`
        },
        {
          label: "🥷 AST Extractor (Top Dev) - Parse JS file structure and append",
          code: `import { readFileSync, existsSync } from 'fs';\n// Assume acorn is installed contextually\nimport * as acorn from 'acorn';\n\nexport default async function hook(context) {\n  const match = context.prompt.match(/@ast:([\\w.-]+)/);\n  if (match) {\n    const file = match[1];\n    if (existsSync(file)) {\n      const code = readFileSync(file, 'utf-8');\n      try {\n        const ast = acorn.parse(code, { ecmaVersion: 2022, sourceType: 'module' });\n        const funcs = ast.body.filter(n => n.type === 'FunctionDeclaration').map(n => n.id.name);\n        context.prompt = context.prompt.replace(match[0], \`\\nFunctions in \${file}: \${funcs.join(', ')}\\n\`);\n      } catch (e) { }\n    }\n  }\n  return context;\n}`
        },
        {
           label: "🧠 Secret Vault (Advanced) - Dynamically load vault tokens",
           code: `import { execSync } from 'child_process';\n\nexport default async function hook(context) {\n  // If prompt asks for database query, dynamically retrieve temporary vault token and inject\n  if (context.prompt.toLowerCase().includes('sql') || context.prompt.toLowerCase().includes('database')) {\n     try {\n       console.log('Retrieving rotating Vault DB credentials...');\n       const tokenInfo = execSync('vault read -format=json database/creds/readonly', { encoding: 'utf-8' });\n       const creds = JSON.parse(tokenInfo).data;\n       context.prompt = \`Use these DB credentials for query context:\\nUser: \${creds.username}\\nPass: \${creds.password}\\n\\n\` + context.prompt;\n     } catch(e) { console.warn('Vault not authenticated.'); }\n  }\n  return context;\n}`
        },
        {
           label: "🎯 Issue Tracker Linker - Auto-fetch Jira/Linear tickets by ID",
           code: `export default async function hook(context) {\n  // Matches tickets like ENG-1234 or PROJ-56\n  const ticketRegex = /([A-Z]{2,5}-\\d{1,5})/g;\n  const matches = context.prompt.match(ticketRegex);\n  if (matches) {\n    console.log(\`Fetching details for tickets: \${matches.join(', ')}...\`);\n    // In reality, you'd fetch from your Jira/Linear API\n    context.prompt += \`\\n\\n[Hook Inject] User referenced tickets: \${matches.join(', ')}. Assume they want help resolving these.\\n\`;\n  }\n  return context;\n}`
        },
        {
           label: "📋 Clipboard Context Auto-Injector - Appends clipboard if user asks",
           code: `import { execSync } from 'child_process';\n\nexport default async function hook(context) {\n  if (context.prompt.toLowerCase().includes('@clipboard')) {\n    try {\n      // This works on macOS (pbpaste). Use xclip for Linux or clip for Windows.\n      const clipboardText = execSync('pbpaste', { encoding: 'utf-8' });\n      context.prompt = context.prompt.replace('@clipboard', \`\\n--- Clipboard Contents ---\\n\${clipboardText}\\n---\\n\`);\n    } catch (e) { console.warn('Clipboard read failed.'); }\n  }\n  return context;\n}`
        },
        {
           label: "🖥️ OS Telemetry Injector (Advanced) - Adds system stats to prompt",
           code: `import os from 'os';\n\nexport default async function hook(context) {\n  if (context.prompt.toLowerCase().includes('debug') || context.prompt.toLowerCase().includes('optimize')) {\n    const memFreed = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);\n    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);\n    const cpuCount = os.cpus().length;\n    const osType = os.type();\n    const telemetry = \`[System Telemetry: \${osType}, \${cpuCount} Cores, Memory: \${memFreed}GB / \${totalMem}GB]\`;\n    context.prompt = \`\${telemetry}\\n\\n\${context.prompt}\`;\n  }\n  return context;\n}`
        }
      ]
    },
    {
      group: "Post-Response Hooks",
      options: [
        {
          label: "Log Output Length - Prints token/character count",
          code: `export default function hook(response) {\n  console.log(\`✅ Received response of \${response.length} characters.\`);\n  return response;\n}`
        },
        {
          label: "Format as JSON - Attempts to parse response as JSON",
          code: `export default function hook(response) {\n  try {\n    const parsed = JSON.parse(response);\n    return JSON.stringify(parsed, null, 2);\n  } catch (e) {\n    console.log("Warning: Response is not valid JSON.");\n    return response;\n  }\n}`
        },
        {
          label: "Save to File - Appends the response to a local log",
          code: `import { appendFileSync } from 'fs';\n\nexport default async function hook(response) {\n  appendFileSync('gemini-logs.txt', response + '\\n---\\n');\n  return response;\n}`
        },
        {
          label: "⭐ Code Block Extractor - Grabs markdown code & saves to disk",
          code: `import { writeFileSync, existsSync, mkdirSync } from 'fs';\nimport { join } from 'path';\n\nexport default async function hook(response) {\n  const codeBlockRegex = /\\\`\\\`\\\`(\\w+)?\\n([\\s\\S]*?)\\\`\\\`\\\`/g;\n  let match;\n  let i = 1;\n  const outDir = './gemini-outputs';\n  if (!existsSync(outDir)) mkdirSync(outDir);\n  \n  while ((match = codeBlockRegex.exec(response)) !== null) {\n    const lang = match[1] || 'txt';\n    const code = match[2];\n    const file = join(outDir, \`extracted_\${i}.\${lang}\`);\n    writeFileSync(file, code);\n    console.log(\`✅ Saved \${file}\`);\n    i++;\n  }\n  return response;\n}`
        },
        {
          label: "🔥 Auto-Commit (Advanced) - Proposes git commit from API response",
          code: `import { execSync } from 'child_process';\nimport readline from 'readline';\n\nexport default async function hook(response) {\n  const parsedMsg = response.split('\\n')[0].replace(/['"]/g, '').trim();\n  \n  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n  return new Promise((resolve) => {\n    rl.question(\`AI proposed commit: "\${parsedMsg}"\\nAuto-commit? (y/n): \`, (answer) => {\n      if (answer.toLowerCase() === 'y') {\n         try {\n           execSync(\`git commit -am "\${parsedMsg}"\`, { stdio: 'inherit' });\n         } catch(e) { console.error("Commit failed."); }\n      }\n      rl.close();\n      resolve(response);\n    });\n  });\n}`
        },
        {
          label: "🚀 Bash Auto-Runner - Prompts to execute AI generated bash code blocks",
          code: `import { execSync } from 'child_process';\nimport readline from 'readline';\n\nexport default async function hook(response) {\n  const bashMatch = response.match(/\\\`\\\`\\\`(?:bash|sh|shell)\\n([\\s\\S]*?)\\\`\\\`\\\`/);\n  if (bashMatch) {\n    const cmd = bashMatch[1].trim();\n    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n    return new Promise(resolve => {\n      rl.question(\`\\n\\x1b[36mAI suggests running:\\x1b[0m\\n\${cmd}\\n\\nExecute? (y/N): \`, ans => {\n        if (ans.toLowerCase() === 'y') {\n          try { execSync(cmd, { stdio: 'inherit' }); } catch (e) { console.error('Execution Failed'); }\n        }\n        rl.close();\n        resolve(response);\n      });\n    });\n  }\n  return response;\n}`
        },
        {
          label: "🥷 Audit Webhook (Top Dev) - Broadcast AI responses to Slack/Discord",
          code: `export default async function hook(response) {\n  const webhookUrl = process.env.AUDIT_WEBHOOK_URL;\n  if (webhookUrl) {\n    try {\n      await fetch(webhookUrl, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ \n          content: "🤖 **Gemini CLI Output:**\\n\\n" + response.substring(0, 1900)\n        })\n      });\n    } catch (e) { console.warn("Failed to notify webhook"); }\n  }\n  return response;\n}`
        },
        {
          label: "🧠 MacOS TTS Integration - Read short responses out loud (macOS only)",
          code: `import { exec } from 'child_process';\n\nexport default async function hook(response) {\n  // Only read if response is relatively short\n  if (response.length < 300) {\n     // Clean up markdown for speech formatting\n     const cleanText = response.replace(/[*#\\\`]/g, '').replace(/"/g, '');\n     exec(\`say "\${cleanText}"\`);\n  }\n  return response;\n}`
        },
        {
          label: "📋 Clipboard Code Copier - Automatically copy code blocks to clipboard",
          code: `import { execSync } from 'child_process';\n\nexport default async function hook(response) {\n  const codeBlockRegex = /\\\`\\\`\\\`(\\w+)?\\n([\\s\\S]*?)\\\`\\\`\\\`/(?!.*\\\`\\\`\\\`(\\w+)?\\n([\\s\\S]*?)\\\`\\\`\\\`)/s; // matches the last code block\n  const match = response.match(codeBlockRegex);\n  if (match && match[2]) {\n    try {\n      const code = match[2].trim();\n      // Works on macOS. Use xclip on Linux or clip on Windows.\n      execSync('pbcopy', { input: code });\n      console.log('\\x1b[32m[Hook]\\x1b[0m Automatically copied code block to clipboard!', code.substring(0, 50) + '...');\n    } catch (e) { }\n  }\n  return response;\n}`
        },
        {
          label: "📡 JSON Auto-Relay - Send JSON responses to a remote webhook",
          code: `export default async function hook(response) {\n  // Try parsing to see if it's pure JSON\n  try {\n    const data = JSON.parse(response);\n    const endpoint = process.env.DATA_RELAY_ENDPOINT || 'http://localhost:8080/ingest';\n    await fetch(endpoint, {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify(data)\n    });\n    console.log(\`\\x1b[32m[Hook]\\x1b[0m Relayed JSON payload to \${endpoint}\`);\n  } catch (e) { \n    // Not valid JSON or network error, just ignore\n  }\n  return response;\n}`
        },
        {
          label: "🧪 Auto-Test Generator (Top Dev) - Spawns Jest generation prompt",
          code: `import { spawn } from 'child_process';\nimport { writeFileSync } from 'fs';\n\nexport default async function hook(response) {\n  const jsMatch = response.match(/\\\`\\\`\\\`(?:javascript|js|ts|typescript)\\n([\\s\\S]*?)\\\`\\\`\\\`/);\n  if (jsMatch) {\n     // Found some code! Let's save it temporarily and ask Gemini to write a unit test for it in the background.\n     try {\n       writeFileSync('.tmp_func.js', jsMatch[1]);\n       console.log('\\x1b[36m[Hook] Detected JS code. Spawning background test generator...\\x1b[0m');\n       // Assume gemini-cli is aliased, we call it recursively. \n       // NOTE: Careful with infinite loops! Only run tests on .tmp_func.js specifically.\n       const child = spawn('gemini', ['"Write a jest spec for .tmp_func.js"'], {\n         detached: true, stdio: 'ignore'\n       });\n       child.unref();\n     } catch(e) {}\n  }\n  return response;\n}`
        }
      ]
    },
    {
      group: "Platform Integrations (Pre-Request)",
      options: [
        {
          label: "🐍 Python Env - Inject active pip dependencies",
          code: `import { execSync } from 'child_process';\nimport { existsSync } from 'fs';\n\nexport default async function hook(context) {\n  if (existsSync('requirements.txt') || context.prompt.toLowerCase().includes('python')) {\n    try {\n      // Assumes virtualenv is active\n      const pips = execSync('pip freeze', { encoding: 'utf-8' }).substring(0, 1000);\n      context.prompt = \`Current Python Env Packages:\\n\${pips}\\n\\n\` + context.prompt;\n    } catch (e) { }\n  }\n  return context;\n}`
        },
        {
          label: "🐳 Kubernetes - Fetch recent pod crashes via kubectl",
          code: `import { execSync } from 'child_process';\n\nexport default async function hook(context) {\n  if (context.prompt.toLowerCase().includes('k8s') || context.prompt.toLowerCase().includes('pod')) {\n    try {\n      // Get pods that are not Running or Completed\n      const issues = execSync('kubectl get pods --field-selector=status.phase!=Running', { encoding: 'utf-8' });\n      if (issues.trim()) {\n         context.prompt = \`Problematic K8s Pods:\\n\${issues}\\n\\n\` + context.prompt;\n      }\n    } catch (e) { }\n  }\n  return context;\n}`
        },
        {
          label: "🦀 Rust Cargo - Run cargo check & inject compiler errors",
          code: `import { execSync } from 'child_process';\n\nexport default async function hook(context) {\n  if (context.prompt.toLowerCase().includes('rust') || context.prompt.toLowerCase().includes('fix')) {\n    try {\n      console.log('Running cargo check...');\n      execSync('cargo check', { stdio: 'pipe' });\n    } catch (e) {\n      if (e.stderr) {\n        // Limit error output to avoid blowing up context window\n        const errs = e.stderr.toString().substring(0, 2000);\n        context.prompt = \`Current Cargo Errors:\\n\${errs}\\n\\n\` + context.prompt;\n      }\n    }\n  }\n  return context;\n}`
        },
        {
          label: "☁️ AWS Infrastructure - Inject EC2 Instance States",
          code: `import { execSync } from 'child_process';\n\nexport default async function hook(context) {\n  if (context.prompt.toLowerCase().includes('aws') || context.prompt.toLowerCase().includes('ec2')) {\n    try {\n      const ec2 = execSync('aws ec2 describe-instances --query "Reservations[*].Instances[*].{ID:InstanceId,State:State.Name}" --output json', { encoding: 'utf-8' });\n      context.prompt = \`AWS EC2 Status:\\n\${ec2}\\n\\n\` + context.prompt;\n    } catch (e) { }\n  }\n  return context;\n}`
        }
      ]
    },
    {
      group: "On-Startup Hooks",
      options: [
        {
          label: "Startup Initialization - Run setup scripts",
          code: `export default async function hook() {\n  console.log("Initializing Gemini Awesome Hook...");\n}`
        },
        {
          label: "Check Env Vars - Validates required setup dependencies",
          code: `export default async function hook() {\n  if (!process.env.MY_SECRET_KEY) {\n    console.error("CRITICAL: MY_SECRET_KEY is missing!");\n    process.exit(1);\n  }\n  console.log("Environment looks good.");\n}`
        },
        {
          label: "⭐ Auto-Update Check - Compares local CLI to npm registry",
          code: `import { execSync } from 'child_process';\n\nexport default async function hook() {\n  try {\n    const current = "1.0.0"; // Replace with your CLI version extraction logic\n    const remote = execSync('npm show gemini-cli version', { encoding: 'utf-8' }).trim();\n    if (current !== remote) {\n      console.log(\`\\x1b[33mUpdate available for CLI: \${current} -> \${remote}\\x1b[0m\`);\n    }\n  } catch (e) {}\n}`
        },
        {
          label: "🔥 Background Vectorizer (Advanced) - Syncs local files silently",
          code: `import { spawn } from 'child_process';\nimport { join } from 'path';\nimport { existsSync } from 'fs';\n\nexport default async function hook() {\n  // Spawns a detached process to vectorize codebase silently on boot\n  const workerPath = join(process.cwd(), '.gemini', 'vectorize-worker.js');\n  if (existsSync(workerPath)) {\n    const child = spawn('node', [workerPath], {\n      detached: true,\n      stdio: 'ignore'\n    });\n    child.unref();\n    console.log("Launched local codebase vectorizer in background.");\n  }\n}`
        },
        {
          label: "🚀 Ngrok Auto-Tunnel - Expose local port context for AI workflows",
          code: `import { exec } from 'child_process';\n\nexport default async function hook() {\n   if (process.env.AUTO_TUNNEL_PORT) {\n      console.log(\`Starting background Ngrok tunnel for port \${process.env.AUTO_TUNNEL_PORT}...\`);\n      exec(\`ngrok http \${process.env.AUTO_TUNNEL_PORT} > /dev/null &\`);\n   }\n}`
        },
        {
          label: "🥷 Cloud Config Sync (Top Dev) - Pull remote `.geminirc` defaults",
          code: `import { writeFileSync, existsSync } from 'fs';\nimport { homedir } from 'os';\nimport { join } from 'path';\n\nexport default async function hook() {\n  const rcPath = join(homedir(), '.geminirc.json');\n  if (!existsSync(rcPath)) {\n     console.log('Downloading team config defaults...');\n     try {\n       const res = await fetch('https://api.mycompany.com/gemini-config');\n       const config = await res.text();\n       writeFileSync(rcPath, config);\n     } catch(e) { console.log('Config sync failed.'); }\n  }\n}`
        },
        {
          label: "🧠 Env Doctor - Verify running containers before allowing prompt",
          code: `import { execSync } from 'child_process';\n\nexport default async function hook() {\n  try {\n    const dockerPs = execSync('docker ps --format "{{.Names}}"', { encoding: 'utf8' });\n    if (!dockerPs.includes('redis') || !dockerPs.includes('postgres')) {\n       console.log('\\x1b[31m[Warning]\\x1b[0m Core DB containers are offline. AI prompt context might be limited.\\n');\n    }\n  } catch (e) { }\n}`
        },
        {
          label: "📦 NPM Audit Check - Warns if critical vulnerabilities exist",
          code: `import { execSync } from 'child_process';\n\nexport default async function hook() {\n  try {\n    console.log('Running quick npm audit...');\n    const auditRes = execSync('npm audit --json', { encoding: 'utf8' });\n    const audit = JSON.parse(auditRes);\n    if (audit.metadata.vulnerabilities.critical > 0) {\n        console.error(\`\\x1b[31m[Hook Warning]\\x1b[0m You have \${audit.metadata.vulnerabilities.critical} CRITICAL npm vulnerabilities. Consider asking Gemini to fix them!\`);\n    }\n  } catch (e) { \n    // npm audit returns non-zero exit code if vulnerabilities exist\n    try {\n      const audit = JSON.parse(e.stdout);\n      if (audit.metadata.vulnerabilities.critical > 0) {\n        console.error(\`\\x1b[31m[Hook Warning]\\x1b[0m \${audit.metadata.vulnerabilities.critical} CRITICAL npm vulnerabilities detected.\`);\n      }\n    } catch(err) {}\n  }\n}`
        },
        {
          label: "📖 Package.json Context Cacher - Load dependencies into global obj",
          code: `import { readFileSync, existsSync } from 'fs';\nimport { join } from 'path';\n\nexport default async function hook() {\n  // Read the project's dependencies and cache them so pre-request hooks can grab them fast.\n  const pkgPath = join(process.cwd(), 'package.json');\n  if (existsSync(pkgPath)) {\n    try {\n       const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));\n       // Store in a global variable or temporary dotfile for the pre-request hook to use.\n       process.env.__GEMINI_CACHED_DEPS = JSON.stringify(Object.keys(pkg.dependencies || {}));\n       console.log('\\x1b[35m[Hook]\\x1b[0m Cached project dependencies for AI context.');\n    } catch(e) {}\n  }\n}`
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tighter uppercase font-mono mb-2">Hook Logic</h2>
        <p className="text-white/50 text-sm">Write the Node.js payload for your {data.trigger} event.</p>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-[#00FF00] font-mono uppercase tracking-widest flex justify-between items-end">
          <span>Example Templates</span>
          <span className="text-white/40">Optional</span>
        </label>
        <select
          onChange={e => {
            if (e.target.value) setData({...data, code: e.target.value});
          }}
          className="w-full bg-[#1A1A1A] border border-[#00FF00]/30 p-3 rounded-sm font-mono text-sm text-[#00FF00] focus:border-[#00FF00] focus:outline-none transition-colors appearance-none cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>Select a template to auto-fill...</option>
          {templates.map(group => (
            <optgroup key={group.group} label={group.group} className="bg-black text-white/80 font-sans">
              {group.options.map(opt => (
                <option key={opt.label} value={opt.code} className="py-2">{opt.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <div className={`bg-[#050505] border rounded-sm overflow-hidden flex flex-col transition-colors shadow-inner ${
          error ? (error.startsWith('Error') || error.startsWith('Syntax') ? 'border-red-500/50' : 'border-yellow-500/50') : 'border-white/20'
        }`}>
          <div className="bg-[#111] border-b border-white/10 px-4 py-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#00FF00]">index.js</span>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </div>
          </div>
          <div className="flex relative">
            <div className="py-4 px-3 text-right border-r border-white/5 text-white/20 font-mono text-xs select-none sticky left-0 bg-[#0A0A0A]">
              {data.code.split('\n').map((_: any, i: number) => <div key={i} className="leading-snug">{i + 1}</div>)}
            </div>
            <textarea 
              value={data.code}
              onChange={e => setData({...data, code: e.target.value})}
              className="w-full h-[280px] bg-transparent p-4 font-mono text-xs text-[#E5E5E5] focus:outline-none resize-none leading-snug whitespace-pre overflow-x-auto"
              spellCheck="false"
            />
          </div>
        </div>
        
        {/* Validation Feedback Area */}
        <div className="min-h-[20px] px-1 pt-1">
          {error && (
             <div className={`font-mono text-[10px] flex items-center gap-1.5 ${
               error.startsWith('Error') || error.startsWith('Syntax') ? 'text-red-400' : 'text-yellow-400'
             }`}>
               <Info size={12} />
               {error}
             </div>
          )}
          {!error && (
            <div className="font-mono text-[10px] flex items-center gap-1.5 text-[#00FF00]">
               <CheckCircle2 size={12} />
               Syntax OK
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white font-mono text-sm uppercase transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <button 
          onClick={onNext}
          disabled={error !== null && (error.startsWith('Error') || error.startsWith('Syntax'))}
          className="bg-white text-black px-6 py-3 font-mono text-sm uppercase font-bold tracking-widest hover:bg-[#00FF00] transition-colors flex items-center gap-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Installer <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function GenerateStep({ data, onBack }: any) {
  const [copied, setCopied] = useState(false);

  // Generate the magical install bash script
  const scriptContent = `#!/bin/bash
# ==============================================================
# Gemini CLI Extension Installer
# Extension: ${data.name}
# Author: ${data.author}
# Trigger: ${data.trigger}
# Description: ${data.description}
# ==============================================================

set -e

echo -e "\\e[32m[+] Starting installation of ${data.name}...\\e[0m"

# 1. Define Directories
TARGET_DIR="$HOME/.gemini/extensions/${data.name}"
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

# 2. Generate package.json
cat << 'EOF' > package.json
{
  "name": "${data.name.replace(/[^a-z0-9-]/g, '')}",
  "version": "1.0.0",
  "description": "${data.description}",
  "author": "${data.author}",
  "main": "index.js",
  "gemini-hook": {
    "trigger": "${data.trigger}",
    "mode": "${data.mode}",
    "format": "${data.outputFormat}"
  }
}
EOF

# 3. Generate the Hook Logic
cat << 'EOF' > index.js
${data.code}
EOF

# 4. Optional: Install dependencies if needed (none required by default)
# npm install

# 5. Register with the CLI globally
# Note: In a real system, you might run 'gemini-cli hook add <dir>' here.
echo -e "\\e[32m[+] Successfully linked hook to $TARGET_DIR\\e[0m"
echo -e "\\e[32m[+] Your extension '${data.name}' is now active on ${data.trigger}!\\e[0m"
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = () => {
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `install-${data.name}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-center pt-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00FF00]/20 text-[#00FF00] mb-4">
        <CheckCircle2 size={32} />
      </div>
      
      <h2 className="text-3xl font-bold tracking-tighter uppercase font-mono">Installer Ready</h2>
      <p className="text-white/70 max-w-sm mx-auto">
        Your extension installer bash script has been compiled. Download it or copy to your terminal to deploy.
      </p>

      {/* Directory structure preview */}
      <div className="p-4 bg-[#0A0A0A] border border-white/10 rounded-sm text-left mt-6 shadow-inner">
        <h4 className="text-[10px] font-mono text-[#00FF00] uppercase tracking-widest mb-3">Project Sandbox Preview</h4>
        <div className="font-mono text-xs text-white/70 space-y-1">
          <div className="flex items-center gap-2"><code className="text-[#00FF00]">~/.gemini/extensions/</code></div>
          <div className="flex items-center gap-2 pl-4">└── <code className="text-white font-bold">{data.name}/</code></div>
          <div className="flex items-center gap-2 pl-12">├── <code>package.json</code> <span className="text-white/30 italic">- Configured for {data.trigger}</span></div>
          <div className="flex items-center gap-2 pl-12">└── <code>index.js</code> <span className="text-white/30 italic">- Built from CodeStep</span></div>
        </div>
      </div>

      <div className="p-4 bg-black border border-white/10 rounded-sm text-left relative group mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-mono text-[#00FF00] uppercase tracking-widest">install-{data.name}.sh</span>
        </div>
        <pre className="text-[10px] font-mono text-white/50 overflow-x-auto p-3 bg-white/5 rounded-sm h-[180px] overflow-y-auto leading-relaxed border border-white/5 shadow-inner">
          <code>{scriptContent}</code>
        </pre>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
        <button 
          onClick={downloadScript}
          className="bg-white text-black px-6 py-3 font-mono text-sm uppercase font-bold tracking-widest hover:bg-[#00FF00] transition-colors flex items-center justify-center gap-2 rounded-sm"
        >
          <Download size={16} /> Download .sh
        </button>
        <button 
          onClick={copyToClipboard}
          className="bg-transparent border border-white/20 text-white px-6 py-3 font-mono text-sm uppercase font-bold tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2 rounded-sm"
        >
          {copied ? <CheckCircle2 size={16} className="text-[#00FF00]" /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Script'}
        </button>
      </div>

      {/* Suggested Features Section */}
      <div className="mt-12 text-left pt-6 border-t border-white/10">
        <h4 className="text-sm font-mono text-white/80 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Terminal size={14} className="text-[#00FF00]"/> Suggested Upgrades
        </h4>
        <ul className="grid md:grid-cols-2 gap-3 text-xs text-white/50 font-sans">
          <li className="bg-white/5 p-3 rounded-sm border border-white/5">
            <strong className="text-white block mb-1">NPM Dependency Resolution</strong>
            Allow users to specify required packages (like 'axios', 'cheerio') in the wizard and auto-inject <code className="text-[#00FF00]">npm install</code> into the script.
          </li>
          <li className="bg-white/5 p-3 rounded-sm border border-white/5">
            <strong className="text-white block mb-1">TypeScript Support</strong>
            Draft hooks in TS and automatically configure <code className="text-[#00FF00]">esbuild</code> or <code className="text-[#00FF00]">tsc</code> in the installer bash script.
          </li>
          <li className="bg-white/5 p-3 rounded-sm border border-white/5">
            <strong className="text-white block mb-1">Live Hook Simulator</strong>
            Add a mock terminal step before generating to test prompt inputs against the generated code safely in-browser.
          </li>
          <li className="bg-white/5 p-3 rounded-sm border border-white/5">
            <strong className="text-white block mb-1">Auto Publish Actions</strong>
            Generate a GitHub Actions workflow to auto-publish the extension to npm directly.
          </li>
        </ul>
      </div>

      <div className="pt-8 mb-4">
        <button onClick={onBack} className="text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto pb-4">
          <ArrowLeft size={14} /> Back to Editor
        </button>
      </div>
    </div>
  );
}
