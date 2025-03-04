import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { varId } = req.query;
  const { value } = req.query;

  const filePath = path.join(process.cwd(), "data", "variables.json");

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Nenhuma variável encontrada." });
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    let variables = JSON.parse(data);

    let found = false;
    variables = variables.map((v) => {
      if (v.id === varId || v.title === varId) {
        found = true;
        return { ...v, value: value };
      }
      return v;
    });

    if (!found) {
      return res.status(404).json({ error: "Variável não encontrada." });
    }

    fs.writeFileSync(filePath, JSON.stringify(variables, null, 2));

    return res.status(200).json(value);
  } catch (error) {
    console.error("Erro ao editar variável:", error);
    return res.status(500).json({ error: "Erro ao editar a variável." });
  }
}
