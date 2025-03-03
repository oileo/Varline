const express = require("express");
const path = require("node:path");
const fs = require("node:fs").promises;

const app = express();
app.use(express.json());

const writeFile = async (project, title, content) => {
    try {
        // Valida se o conteúdo não é vazio ou undefined
        if (!content) {
            throw new Error(`Content for ${title} is undefined or empty.`);
        }
        await fs.writeFile(path.join(__dirname, "v", project, title), content);
    } catch (err) {
        console.error("Erro ao escrever arquivo:", err);
    }
};

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/main", (req, res) => {
    res.sendFile(path.join(__dirname, "main.js"));
});

app.get("/css", (req, res) => {
    res.sendFile(path.join(__dirname, "style.css"));
});

app.post("/post", async (req, res) => {
    let { title, value, token } = req.body;
    console.log(req.body)

    // Verificar se todos os campos necessários foram enviados
    if (!title || !value || !token) {
        return res.status(400).json({ message: "Title, value, and token are required." });
    }

    const dirPath = path.join(__dirname, "v", title);
    const tokenPath = path.join(dirPath, "token");

    try {
        // Verifica se o arquivo "token" já existe
        await fs.access(tokenPath, fs.constants.F_OK);
        return res.status(300).json({ message: "This variable already exists!!!" });
    } catch (err) {
        // Se o arquivo não existe, cria o diretório e os arquivos
        await fs.mkdir(dirPath, { recursive: true });

        // Escrever os arquivos
        await writeFile(title, "index", value);
        await writeFile(title, "token", token);

        return res.status(200).json({ message: "New variable created" });
    }
});

app.get("/api/:varId", async (req, res) => {
    let api = req.params.varId;
    const dirPath = path.join(__dirname, "v", api);
    const indexPath = path.join(dirPath, "index");

    try {
        const data = await fs.readFile(indexPath, "utf8");
        return res.status(200).json({ message: data });
    } catch (err) {
        return res.status(300).json({ message: "Unknown variable" });
    }
});

app.listen(3000, () => {
    console.log("Running on http://localhost:3000");
});
