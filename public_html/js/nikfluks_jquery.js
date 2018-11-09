$(document).ready(function () {
    //prva tocka
    $("#korIme").attr("disabled", true);
    $("#lozinka2").attr("disabled", true);
    var ime = $("#ime");
    var prezime = $("#prezime");
    var korIme = $("#korIme");
    var duljinaIme = 0;
    var duljinaPrezime = 0;
    var predlozakImePrezime = new RegExp(/^[A-Z][A-Za-z\-]*/);

    $("#ime, #prezime").blur(function () {
        duljinaIme = $.trim(ime.val()).length;
        duljinaPrezime = $.trim(prezime.val()).length;
        if ((duljinaIme === 0) || (duljinaPrezime === 0 || !predlozakImePrezime.test(ime.val()) || !predlozakImePrezime.test(prezime.val()))) {
            korIme.val("");
            korIme.attr("disabled", true);
        } else {
            korIme.removeAttr("disabled");
        }
    });

    //cetvrta tocka
    ime.blur(function () {
        duljinaIme = $.trim(ime.val()).length;
        if (!duljinaIme) {
            $("#greske_reg").addClass("greske_reg").text("Prazno polje za Ime!");
            $(ime).addClass("poljeSGreskom");
        } else {
            if (!predlozakImePrezime.test(ime.val())) {
                $("#greske_reg").addClass("greske_reg").text("Ime počinje malim slovom!");
                $(ime).addClass("poljeSGreskom");
            } else {
                $(ime).removeClass("poljeSGreskom");
                $("#greske_reg").addClass("greske_reg").text("");
                korIme.removeClass("poljeSGreskom");
            }
        }
    });

    prezime.blur(function () {
        duljinaPrezime = $.trim(prezime.val()).length;
        if (!duljinaPrezime) {
            $("#greske_reg").addClass("greske_reg").text("Prazno polje za Prezime!");
            $(prezime).addClass("poljeSGreskom");
        } else {
            if (!predlozakImePrezime.test(prezime.val())) {
                $("#greske_reg").addClass("greske_reg").text("Prezme počinje malim slovom!");
                $(prezime).addClass("poljeSGreskom");
            } else {
                $(prezime).removeClass("poljeSGreskom");
                $("#greske_reg").addClass("greske_reg").text("");
                korIme.removeClass("poljeSGreskom");
            }
        }
    });

    //sedma tocka
    $("#lozinka").keyup(function () {
        var predlozakLozinka = new RegExp(/^(?=(.*[A-Z]){2,})(?=(.*[a-z]){2,})(?=(.*[0-9]){1,})[^\s]{5,15}$/);
        var dobraLoz = predlozakLozinka.test(this.value);
        if (!dobraLoz) {
            $("#greske_reg").addClass("greske_reg").text("Lozinka barem: 2 velika, 2 mala, 1 broj, bez razmaka, duljine 5-15!");
            $(this).addClass("poljeSGreskom");
            $("#lozinka2").attr("disabled", true);
        } else {
            $(this).removeClass("poljeSGreskom");
            $("#greske_reg").addClass("greske_reg").text("");
            //peta tocka
            $("#lozinka2").removeAttr("disabled");
        }
        $("#lozinka2").removeClass("poljeSGreskom");
        $("#lozinka2").val("");
    });

    //sesta tocka
    $("#lozinka2").keyup(function () {
        if (!($(this).val() === $("#lozinka").val())) {
            $("#greske_reg").addClass("greske_reg").text("Lozinka se ne podudara!");
            $(this).addClass("poljeSGreskom");
        } else {
            $(this).removeClass("poljeSGreskom");
            $("#greske_reg").addClass("greske_reg").text("");
        }

    });


    /*var gradovi = new Array();
     $.getJSON("xml_json/gradovi.json",
     function (data) {
     $.each(data, function (key, val) {
     //console.log(val);
     gradovi.push(val);
     });
     });
     $("#grad").autocomplete({
     source: gradovi
     });*/

    //osma tocka

    var drzave = new Array();
    $.post("xml_json/drzave.json",
            function (data) {
                $.each(data, function (key, val) {
                    drzave.push(val);
                });
            });
    if ($("#drzava").length) {
        $('#drzava').autocomplete({
            source: drzave
        });
    }

    //deveta tocka
    $("#pozivniBrojB").click(function () {
        var pozivniBrojevi = new Array();
        $.post("xml_json/drzave-brojevi.json",
                function (data) {
                    $.each(data, function (key, val) {
                        pozivniBrojevi.push(val + " - " + key);
                    });
                });

        $('#pozivniBrojI').autocomplete({
            source: pozivniBrojevi,
            change: function () {
                var pozBrojVrij = $("#pozivniBrojI").val().toString();
                var minus = pozBrojVrij.indexOf("-");
                if (minus !== -1) {
                    pozBrojVrij = pozBrojVrij.slice(0, minus - 1);
                }
                $("#pozivniBrojI").val(pozBrojVrij);
            }
        });

        $("#pozivniBrojB").val("Učitano");
    });


    //druga tocka
    korIme.blur(function () {
        var korImeVrij = $("#korIme").val();
        var korIme_provjera;
        $.ajax({
            url: "http://barka.foi.hr/WebDiP/2016/materijali/zadace/dz3/korisnikImePrezime.php?ime=" + ime.val() + "&prezime=" + prezime.val(),
            //url: "http://barka.foi.hr/WebDiP/2016/materijali/zadace/dz3/korisnikImePrezime.php",
            type: "GET",
            data: {ime: ime.val(), prezime: prezime.val()},
            dataType: 'xml',
            success: function (data, textStatus, jqXHR) {
                //console.log(data);
                $(data).find('korisnicko_ime').each(function () {
                    korIme_provjera = $(this).text();
                });
                if (parseInt(korIme_provjera) !== 0) {
                    if (korImeVrij === korIme_provjera) {
                        $("#greske_reg").addClass("greske_reg").text("Korisničko ime zauzeto!");
                        korIme.addClass("poljeSGreskom");
                        console.log("Zauzeto");
                    } else if (korImeVrij.length === 0) {
                        $("#greske_reg").addClass("greske_reg").text("Korisničko ime prazno!");
                        korIme.addClass("poljeSGreskom");
                        console.log("Prazno");
                    } else {
                        korIme.removeClass("poljeSGreskom");
                        $("#greske_reg").addClass("greske_reg").text("");
                        console.log("Nije zauzeto");
                    }
                } else if (korImeVrij.length === 0) {
                    $("#greske_reg").addClass("greske_reg").text("Korisničko ime prazno!");
                    korIme.addClass("poljeSGreskom");
                    console.log("Prazno");
                } else {
                    korIme.removeClass("poljeSGreskom");
                    $("#greske_reg").addClass("greske_reg").text("");
                    console.log("Nije zauzeto");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    });

    //deseta tocka
    var sirina;
    var visina;
    var alt;

    $("#acer1").mouseover(function () {
        $(this).css("z-index", "2");
        sirina = $(this).css("width");
        visina = $(this).css("height");
        alt = $("#acer1 > img").attr("alt");
        $("#aceri").text(sirina + " " + visina + " " + alt);
    });
    $('#acer1').mouseout(function () {
        $(this).css("z-index", "0");
        $("#aceri").text("");
    });
    $('#acer2').mouseover(function () {
        $(this).css("z-index", "2");
        sirina = $(this).css("width");
        visina = $(this).css("height");
        alt = $("#acer2 > img").attr("alt");
        $("#aceri").text(sirina + " " + visina + " " + alt);
    });
    $('#acer2').mouseout(function () {
        $(this).css("z-index", "0");
        $("#aceri").text("");
    });
    $('#acer3').mouseover(function () {
        $(this).css("z-index", "2");
        sirina = $(this).css("width");
        visina = $(this).css("height");
        alt = $("#acer3 > img").attr("alt");
        $("#aceri").text(sirina + " " + visina + " " + alt);
    });
    $('#acer3').mouseout(function () {
        $(this).css("z-index", "0");
        $("#aceri").text("");
    });
    //jedanaesta tocka
    if ($("#tablica_popis_proizvoda2").length) {
        $("#tablica_popis_proizvoda2").DataTable();
    }
});
