import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { title, value } = req.body;
  if (!title || !value) {
    return res.status(400).json({ error: "Título e valor são obrigatórios" });
  }

  const filePath = path.join(process.cwd(), "data", "variables.json");

  let variables = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    variables = JSON.parse(data);
  }

  const token = Math.random().toString(36).substr(2, 9);
  const secret_api = Math.random().toString(36).substr(2, 9);

  const newVar = { id: `${Date.now()}-${title}`, title, value, token, sp: secret_api };
  variables.push(newVar);

  fs.writeFileSync(filePath, JSON.stringify(variables, null, 2), "utf8");

  return res.status(201).json({ message: `Variável criada, aqui seu token secreto ${secret_api}, não compartilhe com ninguém.`, newVar });
}
