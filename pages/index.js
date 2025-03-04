import { useState, useEffect } from "react";

export default function Home() {
  const [varName, setVarName] = useState("");
  const [varValue, setVarValue] = useState("");
  const [variables, setVariables] = useState([]);
  const [userToken, setUserToken] = useState("");

  // Pega o token do usuário após o carregamento da página
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("userToken") || "";
      setUserToken(storedToken);
    }
  }, []);

  // Fetch das variáveis do backend, filtrando pelo token do usuário
  useEffect(() => {
    async function fetchVariables() {
      if (!userToken) return; // Evita requisição desnecessária

      try {
        const res = await fetch("/api/variables");
        const data = await res.json();

        if (Array.isArray(data)) {
          const userVariables = data.filter((variable) => variable.token === userToken);
          setVariables(userVariables);
        } else {
          console.error("Resposta inesperada da API:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar variáveis:", error);
      }
    }

    fetchVariables();
  }, [userToken]);

  async function addVariable() {
    if (!varName || !varValue) {
      alert("Preencha todos os campos!");
      return;
    }

    const varId = `${Date.now()}-${varName.replaceAll(" ", "-")}`;
    const data = { title: varId, value: varValue, token: userToken };

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        setVariables([...variables, { id: varId, name: varName, value: varValue, token: userToken }]);
        setVarName("");
        setVarValue("");
      }
      alert(result.message);
    } catch (error) {
      console.error("Erro ao adicionar variável:", error);
    }
  }

  return (
    <div>
      <h1>Varline API</h1>
      <input 
        placeholder="Nome da variável" 
        value={varName} 
        onChange={(e) => setVarName(e.target.value)} 
      />
      <input 
        placeholder="Valor" 
        value={varValue} 
        onChange={(e) => setVarValue(e.target.value)} 
      />
      <button onClick={addVariable}>Criar Variável</button>
      <button onClick={addVariable}>Importar Variável</button>

      <ul>
        {variables.map((v) => (
          <li key={v.id}>
            <p>Id - {v.id}</p>
            <i>{v.value}</i> 
            <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/api/${v.id}`)}>Link de GET</button>
            <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/api/post/${v.id}?value=newValue`)}>Link de POST</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
