import { chromium } from 'playwright';
import fs from 'fs';
import fetch from 'node-fetch';

const REPO = "Narayankosloski/automa";
const TOKEN = process.env.GITHUB_TOKEN;

async function pegarStories(){
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/data/stories`,{
        headers:{ Authorization:`token ${TOKEN}` }
    });

    return await res.json();
}

async function baixarArquivo(path){
    const res = await fetch(`https://raw.githubusercontent.com/${REPO}/main/${path}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync("midia", Buffer.from(buffer));
}

async function postar(usuario, senha){

    const browser = await chromium.launch({ headless:true });
    const page = await browser.newPage();

    await page.goto("https://www.instagram.com/accounts/login/");

    await page.waitForTimeout(3000);

    await page.fill('input[name="username"]', usuario);
    await page.fill('input[name="password"]', senha);

    await page.click('button[type="submit"]');

    await page.waitForTimeout(8000);

    console.log("Login feito");

    // ⚠️ Aqui entraria a lógica de postar story
    // Instagram muda muito, então isso é base inicial

    await browser.close();
}

async function main(){

    const lista = await pegarStories();

    for(const item of lista){

        if(!item.name.endsWith(".json")) continue;

        const conteudo = await fetch(item.download_url);
        const json = await conteudo.json();

        if(json.status !== "pendente") continue;

        const agora = new Date();
        const agendar = new Date(json.agendar);

        if(agora >= agendar){

            console.log("Postando:", json.cliente);

            await baixarArquivo(`data/midias/${json.arquivo}`);

            await postar(json.usuario, json.senha);

            // aqui depois atualizamos status
        }
    }
}

main();