import { chromium } from "playwright";
import fetch from "node-fetch";
import fs from "fs";

const REPO = "Narayankosloski/automa";
const TOKEN = process.env.GITHUB_TOKEN;

async function pegarFila(){

    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/data/stories`,{
        headers:{
            Authorization:`token ${TOKEN}`
        }
    });

    return await res.json();
}

async function baixarImagem(url){

    const res = await fetch(url);
    const buffer = await res.arrayBuffer();

    fs.writeFileSync("story.jpg", Buffer.from(buffer));
}

async function postarInstagram(usuario, senha){

    const browser = await chromium.launch({ headless:true });
    const page = await browser.newPage();

    await page.goto("https://www.instagram.com/accounts/login/");

    await page.waitForTimeout(5000);

    await page.fill('input[name="username"]', usuario);
    await page.fill('input[name="password"]', senha);

    await page.click('button[type="submit"]');

    await page.waitForTimeout(8000);

    console.log("Login feito");

    // abrir upload story (interface muda com frequência)
    await page.goto("https://www.instagram.com/");

    await page.waitForTimeout(5000);

    // aqui é onde o Instagram pode variar UI
    // por isso deixamos base funcional

    console.log("Pronto para upload (etapa final depende da UI)");

    await browser.close();
}

async function main(){

    const arquivos = await pegarFila();

    for(const file of arquivos){

        if(!file.name.endsWith(".json")) continue;

        const data = await fetch(file.download_url);
        const json = await data.json();

        const agora = new Date();
        const agendar = new Date(json.agendar);

        if(json.status === "pendente" && agora >= agendar){

            console.log("🚀 Postando story:", json.cliente);

            await baixarImagem(`https://raw.githubusercontent.com/${REPO}/main/data/midias/${json.arquivo}`);

            await postarInstagram(json.usuario, json.senha);

            console.log("✔ Executado (precisa finalizar UI do story)");

        }
    }
}

main();