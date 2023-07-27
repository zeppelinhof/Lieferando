async function includeHTML() {      //Funktion fügt Header in beliebige HTML-Datei ein.
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

menus = ['Pomm Döner', 'Drehspieß Rolle', 'Pizza Hawaii', 'Cheeseburger','Antipasti Misto','Insalata Mista'];
mealWith = ['Drehspießfleisch mit Pommes frites und Sauce.', 'mit Drehspießfleisch, Salat und Sauce.', 'Gebackenes Brot belegt mit Schinken und Ananas.','','gemischte Vorspeisenplatte mit Auberginen., Zucchini, Champignons, Paprika, Salami, und Käse.','mit Eisbergsalat, Tomaten, Gurken, Paprika und Zwiebeln.'];
choiceOf = ['Wahl der Sauce: Ketchup, Mayo', 'Wahl aus: mit Sauce, hausgemachter Tzatziki, ohne Sauce, mit Ananas, mit Artischocken und mehr.', 'Wahl aus: Mit Paprika, Brotsorte (Roggen oder Weizen)','','','Wahl aus: Klein oder Groß']
prices = [6.50, 7.50, 11,5,10,5.5];
totalMealPrices = [0, 0, 0, 0, 0, 0];
amounts = [0, 0, 0, 0, 0, 0];
let wagen = true;


function show() {
    let shoppingcardNotEmpty = false;
    let showSum = false;

    let menuvar = document.getElementById('menus');

    for (let i = 0; i < menus.length; i++) {
        menuvar.innerHTML += menuTemplate(i);
    }

    load();                     // Gespeicherte amounts für Warenkorb laden
    RenderShoppingcard();
}

function emptyShoppingcardTemplate() {
    return /*html*/`
        <div id='emptyshoppingcard' class="emptyshoppingcard">
            <img src="icons/wagen.png" class="wagen">
            <h2>Fülle deinen Warenkorb</h2>
            <p>Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</p>
        </div>
    `
}

function menuTemplate(i){
    return /*html*/`
    <div class="menu">
        <div class="menuTitle_And_Plus">
            <h2>${menus[i]}</h2>
            <img onclick="add(${i})" src="icons/plus.png" class="plus">
        </div>
        <p>${mealWith[i]} <br> ${choiceOf[i]}</p>
        <div class="singleprice">${prices[i].toFixed(2)} €</div>
    </div>
`
}

function RenderShoppingcard() {
    let shoppingcard = document.getElementById('shopping-card');
    let shoppingcardForMobileDiv = document.getElementById('shoppingcardForMobileDiv');
    shoppingcardNotEmpty = false;
    showSum = false;
    shoppingcard.innerHTML = '';
    shoppingcardForMobileDiv.innerHTML = '';
    paybuttonDiv.innerHTML = '';
    miniMaxiDiv.innerHTML = '';

    shoppingcardNotEmpty = shoppingcardNotEmptyFunction();

    
    for (i = 0; i < amounts.length; i++) {
        if (amounts[i] > 0) {                                                   // Warenkörbe normal und mobil befüllen
            shoppingcard.innerHTML += shoppingcardTemplate1();                        
            shoppingcardForMobileDiv.innerHTML += shoppingcardTemplate1();  
            
            showSum = true;
        }
    }

    if (showSum === true) {                            // Summen aufführen
        let subtotal = 0;
        let deliverycosts = 2;
        for (let s = 0; s < totalMealPrices.length; s++) {
            subtotal = subtotal + totalMealPrices[s];
        }
        shoppingcard.innerHTML += shoppingcardTemplate2(subtotal, deliverycosts);      //Summen in Warenkörbe normal und mobil
        paybuttonDiv.innerHTML += /*html*/`                                             <!--Bezahlen Button bei mobil-->
            <div class="paybutton-centerd">
                <div onclick="openDialog('dialog_pay')" class="paybutton">Bezahlen (${(subtotal + deliverycosts).toFixed(2)} €)</div>   
            </div>
        `
        miniMaxiDiv.innerHTML += /*html*/`                                              <!--minimize, maximize Button bei mobil-->
            <img onclick="minimizeMaximize()" class="dialog_close" src="icons/wagen.png">                             
        `
        shoppingcardForMobileDiv.innerHTML += shoppingcardTemplate2(subtotal, deliverycosts);
    }

    if (shoppingcardNotEmpty === false) {
        shoppingcard.innerHTML += emptyShoppingcardTemplate();
    }
}

function shoppingcardTemplate1(){
    return /*html*/`
    <div class="sc" id='sc${i}'>
        <div class="sc_menuFirstLine">
            <div class="grid_amount" id='sc_amount${i}'>${amounts[i]}</div>
            <div class="grid_menu" id='sc_menu${i}'>${menus[i]}</div>
            <div class="grid_totalprice">${totalMealPrices[i].toFixed(2)} €</div>
        </div>

        <div class="sc_menuSecondLine">
            <img onclick="minus(${i})" src="icons/minus.png" class="sc_plus">
            <img onclick="add(${i})" src="icons/plus.png" class="sc_plus">
        </div> 
    </div>
`
}

function shoppingcardTemplate2(subtotal, deliverycosts){
    return /*html*/`
       
    <div class="costs">
        <div>Zwischensumme:</div> <div>${subtotal.toFixed(2)} €</div>
    </div>
    <div class="costs">
        <div>Lieferkosten:</div> <div>${deliverycosts.toFixed(2)} €</div>
    </div>
    <div class="costs">
        <div style="font-weight: 600">Gesamt:</div> <div>${(subtotal + deliverycosts).toFixed(2)} €</div>
    </div>    
`
}

function shoppingcardNotEmptyFunction(){
    for (i = 0; i < amounts.length; i++) {           // Prüfen, ob Warenkorb leer
        if (amounts[i] > 0) {
            return true;
        }
    }
    return false;
}

function add(index) {
    amounts[index] = amounts[index] + 1;
    totalMealPrices[index] = amounts[index] * prices[index];
    save(index);
    RenderShoppingcard();
}

function minus(index) {
    amounts[index] = amounts[index] - 1;
    totalMealPrices[index] = amounts[index] * prices[index];
    save(index);
    RenderShoppingcard();
}

// Hamburger-Menü Dialog

function openDialog(dialog){
    document.getElementById(dialog).classList.remove('d-none');
}

function closeDialog(dialog){
    document.getElementById(dialog).classList.add('d-none');
}

// Bezahlen Dialog

function closeDialogPay(){
    document.getElementById('dialog_pay').classList.add('d-none');
    clearAmounts_TotalMealPrices();
}

function clearAmounts_TotalMealPrices(){
    for(let i=0; i < amounts.length; i++){
        amounts[i] = 0;
        totalMealPrices[i] = 0;
        save(i);
    }
    load();
    RenderShoppingcard();
}


function minimizeMaximize(){                        // Klick auf Wagen-Symbol ein-/ausblenden des Einkaufswagens
    if(wagen===true){
        document.getElementById('shoppingcardForMobileDiv').classList.add('d-none');
        wagen = false;
    }

    else{
        document.getElementById('shoppingcardForMobileDiv').classList.remove('d-none');
        wagen = true
    }
}



// Funktionen zum Speichern 

function save(index) {
    let amountAsText = JSON.stringify(amounts[index]);
    let TotalMealPricesAsText = JSON.stringify(totalMealPrices[index]);
    localStorage.setItem(`Menge${index}`, amountAsText);
    localStorage.setItem(`GesamtpreisproMahlzeit${index}`, TotalMealPricesAsText);
}

function load() {
    for (let l = 0; l < menus.length; l++) {
        let amountAsText = localStorage.getItem(`Menge${l}`);                        // Value zum Key aus Storage auslesen

        if (amountAsText) {
            amounts[l] = JSON.parse(amountAsText);                                    // Value (noch Text) in (neues) Array umwandeln
        }
    }

    for (let l = 0; l < menus.length; l++) {
        let TotalMealPricesAsText = localStorage.getItem(`GesamtpreisproMahlzeit${l}`);                        

        if (TotalMealPricesAsText) {
            totalMealPrices[l] = JSON.parse(TotalMealPricesAsText);                                    
        }
    }
}