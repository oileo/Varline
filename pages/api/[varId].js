import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { varId } = req.query;
  const filePath = path.join(process.cwd(), "data", "variables.json");

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Nenhuma variável encontrada." });
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const variables = JSON.parse(data);

    var variable = [];
    variables.forEach((v)=> {
        if(v.id == varId || v.title == varId) {
            variable = v;
        }
    });

    if (!variable) {
      return res.status(404).json({ error: "Variável não encontrada." });
    }

    return res.status(200).json(variable.value);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar a variável." });
  }
}
