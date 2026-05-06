async function publicarAgora(){
    document.getElementById("status").innerHTML = "Enviando dados para o GitHub...";

    const cliente = document.getElementById("cliente").value;
    const legenda = document.getElementById("legenda").value;

    const payload = {
        cliente: cliente,
        legenda: legenda,
        data: new Date().toISOString()
    };

    console.log(payload);

    document.getElementById("status").innerHTML = "Postagem preparada. Em breve conectaremos ao workflow.";
}