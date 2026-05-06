import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res){

    if(req.method !== "POST"){
        return res.status(405).send("Método não permitido");
    }

    const form = formidable({ multiples:false });

    form.parse(req, async (err, fields, files) => {

        try{

            if(err){
                console.log(err);
                return res.status(500).send("Erro ao processar formulário");
            }

            const cliente = fields.cliente ? fields.cliente[0] : "";
            const usuario = fields.usuario ? fields.usuario[0] : "";
            const senha = fields.senha ? fields.senha[0] : "";
            const data = fields.data ? fields.data[0] : "";
            const hora = fields.hora ? fields.hora[0] : "";
            const minuto = fields.minuto ? fields.minuto[0] : "";

            if(!files.midia){
                return res.status(500).send("Mídia não recebida");
            }

            const arquivo = files.midia[0];

            const arquivoBuffer = fs.readFileSync(arquivo.filepath);
            const arquivoBase64 = arquivoBuffer.toString("base64");
            const nomeArquivo = Date.now() + "_" + arquivo.originalFilename;

            const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
            const REPO = "SEUUSUARIO/automa";

            // ==========================
            // SALVAR MIDIA
            // ==========================
            const uploadMidia = await fetch(`https://api.github.com/repos/${REPO}/contents/data/midias/${nomeArquivo}`,{
                method:"PUT",
                headers:{
                    "Authorization":"token " + GITHUB_TOKEN,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    message:"upload midia story",
                    content:arquivoBase64
                })
            });

            const retornoMidia = await uploadMidia.json();

            if(!uploadMidia.ok){
                console.log(retornoMidia);
                return res.status(500).send("Falha upload mídia GitHub");
            }

            // ==========================
            // CRIAR JSON AGENDAMENTO
            // ==========================
            const story = {
                cliente: cliente,
                usuario: usuario,
                senha: senha,
                arquivo: nomeArquivo,
                agendar: `${data}T${hora}:${minuto}:00`,
                tipo: "story",
                status: "pendente"
            };

            const nomeJson = Date.now() + ".json";
            const jsonBase64 = Buffer.from(JSON.stringify(story,null,2)).toString("base64");

            const uploadJson = await fetch(`https://api.github.com/repos/${REPO}/contents/data/stories/${nomeJson}`,{
                method:"PUT",
                headers:{
                    "Authorization":"token " + GITHUB_TOKEN,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    message:"novo agendamento story",
                    content:jsonBase64
                })
            });

            const retornoJson = await uploadJson.json();

            if(!uploadJson.ok){
                console.log(retornoJson);
                return res.status(500).send("Falha salvar agendamento");
            }

            return res.status(200).send("Story agendado com sucesso.");

        }catch(e){
            console.log(e);
            return res.status(500).send("Erro interno no servidor");
        }

    });
}