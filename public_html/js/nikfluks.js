/*function kreirajDogadaje() {
 var formular = document.getElementById("prijava");
 var greske = document.getElementById("greske");
 var korIme = document.getElementById("korImePrijava");
 //korIme.readOnly = true;
 //korIme.disabled = true;
 formular.addEventListener("submit", function (event) {
 for (var i = 0; i < formular.length; i++) {
 console.log(formular[i].value);
 }
 if (formular[0].value.length < 5) {
 greske.innerHTML = "Korisničko ime ne sadrži 5 znakova";
 greske.className = "greska_novi_proizv";
 event.preventDefault();
 }
 
 //event.preventDefault();
 }, false);
 }*/

function provjeriProizvod() {
    var formular = document.getElementById("novi_proizvod_form");
    var greske = document.getElementById("greske_novi_proizv");
    var nazivPro = document.getElementById("nazivProizvoda");
    var datumPro = document.getElementById("datumProizvodnje");
    var opisPro = document.getElementById("opisProizvoda");
    var katPro = document.getElementsByClassName("kategorijaProizvoda");
    var labele = document.getElementsByClassName("dodavanje_proizvodaL");

    var datumDanasnji = new Date();
    var datumUneseni = new Date();

    var predlozakSpec = new RegExp(/\(|\)|\{|\}|\'|\!|\#|\"|\\|\//);
    var predlozak5Znakova = new RegExp(/^[A-Z]\w{4,}/);
    var predlozakDatum = new RegExp(/^[0-3]?\d\.[0-1]?\d\.\d{4,4}$/);
    var predlozakOpis = new RegExp(/^([A-Z][^\.]*\.)(\s?[A-Z][^\.]*\.){2,}$/);

    //odbrojavanje
    var vrijemePokretanja = new Date();
    console.log(vrijemePokretanja);
    var vrijemeZa5Min = new Date(vrijemePokretanja.setMinutes((vrijemePokretanja.getMinutes() + 5)));
    //var vrijemeZa5Min = new Date(vrijemePokretanja.setSeconds((vrijemePokretanja.getSeconds() + 120)));
    console.log(vrijemeZa5Min);

    formular.addEventListener("submit", function (event) {
        greske.innerHTML = "";
        var sada = new Date();
        var specZnak = false;
        var praznoPolje = false;
        var poljeGresaka = [];

        console.log(labele.length);
        console.log(labele[0].innerHTML);
        console.log(labele[0].innerHTML.toString().slice(0, -27));

        //sedma tocka
        for (var i = 0; i < labele.length; i++) {
            var uskl = labele[i].innerHTML.indexOf("<");
            if (uskl !== -1) {
                labele[i].innerHTML = labele[i].innerHTML.toString().slice(0, -27);
            }
        }
        //sedma tocka

        //prva tocka
        for (var i = 0; i < formular.length; i++) {
            var sadrziSpec = predlozakSpec.test(formular[i].value);
            if (sadrziSpec) {
                specZnak = true;
                poljeGresaka[i] = i;
            }
            if (formular[i].value.length === 0) {
                praznoPolje = true;
                poljeGresaka[i] = i;
            }
        }

        if (specZnak) {
            greske.innerHTML += "Imate neki nedopusteni znak: (){}'!#\\/" + "<br>";
            greske.className = "greska_novi_proizv";
            event.preventDefault();
        }
        if (praznoPolje) {
            greske.innerHTML += "Imate prazno polje!" + "<br>";
            greske.className = "greska_novi_proizv";
            event.preventDefault();
        }

        //druga tocka
        var sadrzi5Znakova = predlozak5Znakova.test(nazivPro.value);
        if (!sadrzi5Znakova) {
            greske.innerHTML += "Naziv proizvoda mora početi velikim slovom i imati najmanje 5 znakova!" + "<br>";
            greske.className = "greska_novi_proizv";
            event.preventDefault();
            poljeGresaka[0] = 0;
        }

        //treca tocka
        if (datumPro.type !== (type = "text")) {
            greske.innerHTML += "Datum nije tipa tekst!" + "<br>";
            greske.className = "greska_novi_proizv";
            event.preventDefault();
            poljeGresaka[2] = 2;

        } else if (!predlozakDatum.test(datumPro.value)) {
            greske.innerHTML += "Datum nije formata dd.mm.gggg" + "<br>";
            greske.className = "greska_novi_proizv";
            event.preventDefault();
            poljeGresaka[2] = 2;
        } else {
            var ddmmgggg = datumPro.value.split('.');
            datumUneseni.setFullYear(ddmmgggg[2]);
            datumUneseni.setMonth(ddmmgggg[1] - 1);
            datumUneseni.setDate(ddmmgggg[0]);
            if (datumUneseni > datumDanasnji) {
                greske.innerHTML += "Datum je u buducnosti!" + "<br>";
                greske.className = "greska_novi_proizv";
                event.preventDefault();
                poljeGresaka[2] = 2;
            }
        }

        //cetvrta tocka
        if (!predlozakOpis.test(opisPro.value)) {
            greske.innerHTML += "U opisu moraju biti min 3 rečenice koje počinju velikim slovom i završavaju točkom." + "<br>";
            greske.className = "greska_novi_proizv";
            event.preventDefault();
            poljeGresaka[1] = 1;
        }

        //peta tocka
        var oznaceni = false;
        for (var i = 0; i < katPro.length; i++) {
            if (katPro[i].checked) {
                oznaceni = true;
            }
        }
        if (!oznaceni) {
            greske.innerHTML += "Niste označili niti jednu kategoriju!" + "<br>";
            greske.className = "greska_novi_proizv";
            event.preventDefault();
            poljeGresaka[6] = 6;
        }

        //sesta tocka
        if (sada > vrijemeZa5Min) {
            for (var i = 0; i < formular.length; i++) {
                formular[i].disabled = true;
            }
            event.preventDefault();
            greske.innerHTML = "";
            var btn = document.createElement("BUTTON");
            btn.innerHTML = "Osvježi stranicu!";
            greske.appendChild(btn);
            btn.addEventListener("click", function () {
                location.reload(true);
            });
        }

        //sedma tocka
        for (var item in poljeGresaka) {
            var usklicnik = '<font color="' + 'red' + '">' + '!' + ' </font>';
            labele[poljeGresaka[item]].innerHTML += usklicnik;
        }
        //sedma tocka

    }, false);

    //druga tocka        
    nazivPro.addEventListener("keyup", function (event) {
        greske.innerHTML = "";
        var sadrzi5Znakova = predlozak5Znakova.test(nazivPro.value);
        if (!sadrzi5Znakova) {
            greske.innerHTML = "Naziv proizvoda mora početi velikim slovom i imati najmanje 5 znakova!";
            greske.className = "greska_novi_proizv";
        }
    }, false);
}

////alert("Početna stranica");
//console.log("Početna stranica");
/*
 document.write("<p>Početna stranica</p>");
 
 var polje = [];
 polje[0]="Ponedjeljak"; 
 polje[1]="Utorak"; 
 polje[2]="Srijeda"; 
 polje[3]="Četvrtak"; 
 polje[4]="Petak"; 
 polje[5]="Subota"; 
 polje[6]="Nedjelja"; 
 
 polje1 = {"ime":"Nikola","prezime":"Fluks"};
 
 function ispis_polja(polje){
 for(p in polje){
 console.log(polje[p]);
 }
 }
 
 ispis_polja(polje1);
 */


