const puppeteer = require('puppeteer');
 
// ID des items recherchées
items_recherchees = [
    "#",
    "#"
]
 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
 
function envoyer_sms(message) {
    const accountSid = "TON ACCOUNT SID";
    const authToken = "TON AUTH TOKEN";
    const client = require('twilio')(accountSid, authToken);
 
    client.messages
    .create({
        body: message,
        from: '+ TON TWILIO NUMBER',
        to: '+33 TON NUMBER'
    });
}
// Code à changer en fonction du parcours utilisateur
async function verifier_items() {
    // 1. Lancer le navigateur
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
 
    // 2. Aller sur la page de connexion
    await page.goto('URL DE LA PAGE DE CONNEXION');
 
    // 3. Remplir les champs et se connecter
    await page.type('#username', "TES IDENTIFIANTS");
    await page.type('#password', "TON MDP");
    await page.click("#btnSeConnecter");
    await sleep(5000);
    
    // 4. Aller sur la page de vente (goto or click )
    await page.click("#");
    await sleep(2000);
    await page.click("#");
    await sleep(5000); 
    await page.click("#");
    await sleep(5000);
 
    // 5. Vérifier si les items recherchées sont libres
    let items_libres = [];
    for (let item_recherchee of items_recherchees) {
        if (await page.$eval(item_recherchee, el => el.disabled === false)) {
            items_libres.push(item_recherchee);
        }
    }
 
    // 6. Envoyer un SMS si des items sont disponibles
    if (items_libres.length > 0) {
        await envoyer_sms("Les items sont disponibles: " + items_libres.join(", "));
    } else {
        console.log("Aucun item disponible");
    }
 
    await browser.close();
}
 
// On vérifie les items une première fois puis toutes les 10 minutes
verifier_items();
setInterval(verifier_items, 1000 * 60 * 10);