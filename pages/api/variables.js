import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "variables.json");

  if (!fs.existsSync(filePath)) {
    return res.status(200).json([]);
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const variables = JSON.parse(data);
    return res.status(200).json(variables);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao ler as variáveis." });
  }
}
