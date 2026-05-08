/*
 * Design: Glassmorphism Moderno com Gradiente Escuro
 * Fundo animado: #0f0c29 → #302b63 → #24243e
 * Cards: vidro fosco com backdrop-blur
 * Acento: azul elétrico oklch(0.65 0.18 250)
 * Fontes: Space Grotesk (UI) + JetBrains Mono (URLs)
 */

import { useState, useCallback } from "react";
import { Copy, Check, Link2, Tv2, Radio, Zap } from "lucide-react";
import { toast } from "sonner";

interface FormState {
  dns: string;
  usuario: string;
  senha: string;
}

interface GeneratedUrls {
  hls: string;
  ts: string;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`URL ${label} copiada!`, {
        duration: 2000,
        style: {
          background: "oklch(0.18 0.04 280 / 0.95)",
          border: "1px solid oklch(1 0 0 / 0.15)",
          color: "oklch(0.95 0.01 280)",
          backdropFilter: "blur(20px)",
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Falha ao copiar. Tente manualmente.");
    }
  }, [text, label]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 shrink-0"
      style={{
        background: copied
          ? "oklch(0.55 0.18 150 / 0.25)"
          : "oklch(0.65 0.18 250 / 0.2)",
        border: copied
          ? "1px solid oklch(0.55 0.18 150 / 0.5)"
          : "1px solid oklch(0.65 0.18 250 / 0.4)",
        color: copied ? "oklch(0.75 0.18 150)" : "oklch(0.75 0.12 250)",
      }}
      title={`Copiar URL ${label}`}
    >
      {copied ? (
        <>
          <Check size={13} />
          Copiado
        </>
      ) : (
        <>
          <Copy size={13} />
          Copiar
        </>
      )}
    </button>
  );
}

function UrlResultCard({
  label,
  icon: Icon,
  url,
  color,
  delay,
}: {
  label: string;
  icon: React.ElementType;
  url: string;
  color: string;
  delay: string;
}) {
  return (
    <div
      className="slide-up glass-card rounded-xl p-5 flex flex-col gap-3"
      style={{ animationDelay: delay }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${color}22`, border: `1px solid ${color}44` }}
          >
            <Icon size={14} style={{ color }} />
          </div>
          <span
            className="tag-badge"
            style={{ color }}
          >
            {label}
          </span>
        </div>
        <CopyButton text={url} label={label} />
      </div>

      {/* URL */}
      <div className="url-output p-3 text-xs leading-relaxed" style={{ color: "oklch(0.82 0.04 280)" }}>
        {url}
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState<FormState>({ dns: "", usuario: "", senha: "" });
  const [urls, setUrls] = useState<GeneratedUrls | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = () => {
    const { dns, usuario, senha } = form;

    if (!dns.trim() || !usuario.trim() || !senha.trim()) {
      toast.error("Preencha todos os campos antes de gerar.", {
        style: {
          background: "oklch(0.18 0.04 280 / 0.95)",
          border: "1px solid oklch(0.65 0.22 25 / 0.5)",
          color: "oklch(0.95 0.01 280)",
          backdropFilter: "blur(20px)",
        },
      });
      return;
    }

    // Normalize DNS: remove trailing slash
    const cleanDns = dns.trim().replace(/\/+$/, "");
    const cleanUser = usuario.trim();
    const cleanPass = senha.trim();

    const hlsUrl = `${cleanDns}/get.php?username=${cleanUser}&password=${cleanPass}&type=m3u_plus&output=hls`;
    const tsUrl = `${cleanDns}/get.php?username=${cleanUser}&password=${cleanPass}&type=m3u_plus&output=mpegts`;

    setUrls({ hls: hlsUrl, ts: tsUrl });
    setHasGenerated(true);
  };

  const handleReset = () => {
    setForm({ dns: "", usuario: "", senha: "" });
    setUrls(null);
    setHasGenerated(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGenerate();
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 glow-focus";
  const inputStyle = {
    background: "oklch(1 0 0 / 0.06)",
    border: "1px solid oklch(1 0 0 / 0.12)",
    color: "oklch(0.95 0.01 280)",
    fontFamily: "'Space Grotesk', sans-serif",
  };

  return (
    <div
      className="animated-bg min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #4f8ef7, transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }}
      />

      <div className="w-full max-w-lg relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
            style={{
              background: "oklch(0.65 0.18 250 / 0.2)",
              border: "1px solid oklch(0.65 0.18 250 / 0.4)",
              boxShadow: "0 0 30px oklch(0.65 0.18 250 / 0.3)",
            }}
          >
            <Link2 size={26} style={{ color: "oklch(0.75 0.18 250)" }} />
          </div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "oklch(0.97 0.01 280)", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Gerador de URL
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.65 0.03 280)" }}>
            Gere seus links <span style={{ color: "oklch(0.72 0.18 250)" }}>HLS</span> e{" "}
            <span style={{ color: "oklch(0.72 0.18 150)" }}>TS</span> de forma rápida
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            {/* DNS */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "oklch(0.60 0.03 280)" }}
              >
                DNS
              </label>
              <input
                type="text"
                name="dns"
                value={form.dns}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="http://seu.servidor.com:porta"
                className={inputClass}
                style={inputStyle}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Usuário */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "oklch(0.60 0.03 280)" }}
              >
                Usuário
              </label>
              <input
                type="text"
                name="usuario"
                value={form.usuario}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="seu_usuario"
                className={inputClass}
                style={inputStyle}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "oklch(0.60 0.03 280)" }}
              >
                Senha
              </label>
              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className={inputClass}
                style={inputStyle}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleGenerate}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, oklch(0.60 0.20 250), oklch(0.50 0.22 270))",
                color: "oklch(0.98 0 0)",
                boxShadow: "0 4px 20px oklch(0.60 0.20 250 / 0.4)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Zap size={15} />
              Gerar URLs
            </button>

            {hasGenerated && (
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:opacity-80 active:scale-[0.98]"
                style={{
                  background: "oklch(1 0 0 / 0.06)",
                  border: "1px solid oklch(1 0 0 / 0.12)",
                  color: "oklch(0.65 0.03 280)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {urls && (
          <div className="flex flex-col gap-4">
            <UrlResultCard
              label="HLS"
              icon={Tv2}
              url={urls.hls}
              color="oklch(0.72 0.18 250)"
              delay="0ms"
            />
            <UrlResultCard
              label="TS"
              icon={Radio}
              url={urls.ts}
              color="oklch(0.72 0.18 150)"
              delay="80ms"
            />
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs" style={{ color: "oklch(0.40 0.02 280)" }}>
          Os dados preenchidos não são armazenados ou enviados a nenhum servidor.
        </p>
      </div>
    </div>
  );
}
