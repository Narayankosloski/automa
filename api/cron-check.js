export default async function handler(req, res){

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = "Narayankosloski/automa";

    const lista = await fetch(`https://api.github.com/repos/${REPO}/contents/data/stories`,{
        headers:{ Authorization:`token ${GITHUB_TOKEN}` }
    });

    const arquivos = await lista.json();

    for(const item of arquivos){

        if(!item.name.endsWith(".json")) continue;

        const conteudo = await fetch(item.download_url);
        const json = await conteudo.json();

        const agora = new Date();
        const agendar = new Date(json.agendar);

        if(json.status === "pendente" && agora >= agendar){

            await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/postar-story.yml/dispatches`,{
                method:"POST",
                headers:{
                    Authorization:`token ${GITHUB_TOKEN}`,
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({ ref:"main" })
            });

            return res.send("Disparado workflow");
        }
    }

    res.send("Nada pra postar");
}