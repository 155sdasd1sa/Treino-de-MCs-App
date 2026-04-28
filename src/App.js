import { useState } from "react";

// --- BANCO DE DADOS DE RIMAS ---
// Para adicionar palavras, basta seguir o padrão: "SUFIXO": ["Palavra1", "Palavra2"]
const DICIONARIO = {
  AO: [
    "VISÃO",
    "AÇÃO",
    "CORAÇÃO",
    "CHÃO",
    "PÉ DE CÃO",
    "SOLUÇÃO",
    "QUESTÃO",
    "MÃO",
    "DIFERENSÃO",
    "DRAGÃO",
  ],
  AR: [
    "LUGAR",
    "CANTAR",
    "PENSAR",
    "OLHAR",
    "CHEGAR",
    "FALAR",
    "MANDIGUEIRAR",
    "VOAR",
    "ACREDITAR",
  ],
  OR: [
    "AMOR",
    "VALOR",
    "TERROR",
    "VAPOR",
    "VENCEDOR",
    "FLUXO",
    "RESPLENDOR",
    "DOR",
    "MOTOR",
  ],
  ENTE: [
    "MENTE",
    "FRENTE",
    "QUENTE",
    "SEMENTE",
    "PRESENTE",
    "DIFERENTE",
    "INCONSCIENTE",
    "TRANSCENDENTE",
  ],
  ISTA: [
    "PISTA",
    "CONQUISTA",
    "ARTISTA",
    "LISTA",
    "VISTA",
    "ATIVISTA",
    "REALISTA",
    "OTIMISTA",
  ],
  IL: ["BRASIL", "FUZIL", "VIU", "ABRIL", "ANIL", "SUTIL", "PERFIL", "QUIL"],
};

const CATEGORIAS = ["Batalha", "Rua", "Tesouraria", "Anime", "Cotidiano"];

export default function App() {
  const [mode, setMode] = useState("rimas");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [categoria, setCategoria] = useState("Batalha");
  const [fluxoWords, setFluxoWords] = useState([]);
  const [score, setScore] = useState(0);

  // Lógica para detectar o sufixo (as últimas letras)
  const extrairSufixo = (palavra) => {
    const p = palavra.toUpperCase().trim();
    if (p.endsWith("ÃO")) return "AO";
    if (p.endsWith("AR")) return "AR";
    if (p.endsWith("OR")) return "OR";
    if (p.endsWith("ENTE")) return "ENTE";
    if (p.endsWith("ISTA")) return "ISTA";
    return p.slice(-2);
  };

  const handleRimar = () => {
    if (!input) return;
    const sufixo = extrairSufixo(input);
    const rimas = DICIONARIO[sufixo] || [];

    setResult({
      perfeitas: rimas.filter((r) => r !== input.toUpperCase()),
      verso: `Na base do treino, eu foco na ${input.toUpperCase()},\nNo estilo ${categoria}, minha mente nunca para!`,
    });
  };

  const handleFluxo = () => {
    if (!input) return;
    const nova = input.toUpperCase();
    const ultima = fluxoWords[0]; // Pega a mais recente
    let pts = 1;
    let msg = "✓ BOA!";

    if (ultima) {
      if (extrairSufixo(ultima.palavra) === extrairSufixo(nova)) {
        pts = 2;
        msg = "🔥 RIMA PESADA!";
      } else {
        pts = 0;
        msg = "🧊 QUEBROU O FLOW...";
      }
    }

    setFluxoWords([{ palavra: nova, feedback: msg }, ...fluxoWords]);
    setScore((prev) => prev + pts);
    setInput("");
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          MC TRAINER{" "}
          <span style={{ fontSize: "12px", color: "#666" }}>V1.0</span>
        </h1>
        <div style={styles.nav}>
          <button
            style={styles.btn(mode === "rimas")}
            onClick={() => setMode("rimas")}
          >
            DICIONÁRIO
          </button>
          <button
            style={styles.btn(mode === "fluxo")}
            onClick={() => setMode("fluxo")}
          >
            MODO FLUXO
          </button>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.catRow}>
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              style={styles.catBtn(categoria === c)}
              onClick={() => setCategoria(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <input
          style={styles.input}
          placeholder={
            mode === "rimas" ? "Digite para rimar..." : "Mande a próxima rima!"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            (mode === "rimas" ? handleRimar() : handleFluxo())
          }
        />

        {mode === "rimas" && result && (
          <div style={styles.resultArea}>
            <p style={styles.label}>RIMAS ENCONTRADAS:</p>
            <div style={styles.tags}>
              {result.perfeitas.length > 0
                ? result.perfeitas.map((r) => (
                    <span key={r} style={styles.tag}>
                      {r}
                    </span>
                  ))
                : "Nenhuma rima no banco..."}
            </div>
            <p style={styles.label}>SUGESTÃO DE VERSO:</p>
            <p style={styles.verso}>{result.verso}</p>
          </div>
        )}

        {mode === "fluxo" && (
          <div>
            <div style={styles.score}>PONTOS: {score}</div>
            {fluxoWords.map((w, i) => (
              <div key={i} style={styles.fluxoItem}>
                <span style={{ color: "#ff3c00" }}>» {w.palavra}</span>
                <span
                  style={{
                    fontSize: "10px",
                    marginLeft: "10px",
                    color: "#555",
                  }}
                >
                  {w.feedback}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    fontFamily: "monospace",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    borderBottom: "1px solid #222",
    marginBottom: "20px",
    paddingBottom: "10px",
  },
  title: { color: "#ff3c00", letterSpacing: "4px" },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  },
  container: { maxWidth: "500px", margin: "0 auto" },
  input: {
    width: "100%",
    padding: "15px",
    background: "#111",
    border: "1px solid #ff3c00",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  btn: (active) => ({
    background: active ? "#ff3c00" : "transparent",
    color: active ? "#000" : "#ff3c00",
    border: "1px solid #ff3c00",
    padding: "8px 15px",
    cursor: "pointer",
    fontWeight: "bold",
  }),
  catRow: {
    display: "flex",
    gap: "5px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  catBtn: (active) => ({
    background: active ? "#222" : "transparent",
    border: `1px solid ${active ? "#ff3c00" : "#333"}`,
    color: active ? "#ff3c00" : "#555",
    fontSize: "10px",
    cursor: "pointer",
  }),
  resultArea: {
    marginTop: "20px",
    background: "#111",
    padding: "15px",
    borderLeft: "4px solid #ff3c00",
  },
  label: { fontSize: "10px", color: "#ff3c00", marginBottom: "5px" },
  tags: { display: "flex", flexWrap: "wrap", gap: "5px" },
  tag: {
    background: "#222",
    padding: "5px 10px",
    fontSize: "14px",
    border: "1px solid #333",
  },
  verso: { fontStyle: "italic", color: "#aaa", lineHeight: "1.5" },
  score: {
    fontSize: "24px",
    textAlign: "center",
    margin: "20px 0",
    color: "#ff3c00",
  },
  fluxoItem: {
    padding: "10px",
    borderBottom: "1px solid #222",
    animation: "wordIn 0.3s ease",
  },
};
