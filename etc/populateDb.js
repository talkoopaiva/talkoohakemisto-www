function createData() {
    var data = getData();

    var types = {"types": data.types};
    var muns = {"municipalities": data.municipalities};
    var vw = {"voluntary_works": data.voluntary_works};

    $.ajax({method: "POST", url: "http://localhost:1337/types/", data: JSON.stringify(types), contentType: "application/json"})
    $.ajax({method: "POST", url: "http://localhost:1337/municipalities/", data: JSON.stringify(muns), contentType: "application/json"})
    $.ajax({method: "POST", url: "http://localhost:1337/voluntary_works/", data: JSON.stringify(vw), contentType: "application/json"})

}


function getData() {
  return vw = {
    "types": [
      {
        "id": 1,
        "name": "Kohtaaminen"
      },
      {
        "id": 2,
        "name": "Korjaamo"
      },
      {
        "id": 3,
        "name": "Kunnostus"
      },
      {
        "id": 4,
        "name": "Siivous"
      },
      {
        "id": 5,
        "name": "Taitopaja"
      },
      {
        "id": 6,
        "name": "Treenit"
      },
      {
        "id": 7,
        "name": "Ty\u00f6paja"
      }
    ],
    "municipalities": [
      {
        "id": 20,
        "name": "Akaa"
      },
      {
        "id": 5,
        "name": "Alaj\u00e4rvi"
      },
      {
        "id": 9,
        "name": "Alavieska"
      },
      {
        "id": 10,
        "name": "Alavus"
      },
      {
        "id": 16,
        "name": "Asikkala"
      },
      {
        "id": 18,
        "name": "Askola"
      },
      {
        "id": 19,
        "name": "Aura"
      },
      {
        "id": 35,
        "name": "Br\u00e4nd\u00f6"
      },
      {
        "id": 43,
        "name": "Ecker\u00f6"
      },
      {
        "id": 46,
        "name": "Enonkoski"
      }
    ],
    "voluntary_works": [
      {
        "id": "I7BVPsnBMjmCpM2O",
        "contact_email": "johanna.fraki@gmail.com",
        "description": "- Kannetaan muutama kuutio koivuklapeja parkkipaikalta halkovajaan\n- Siivotaan takapiha rakennusjätteistä viimeistelyä varten\n- Puretaan Myrskyn alaosa\n- Puretaan vanha puucee",
        "name": "AihkiNjargan kevättalkoot",
        "organizer": "Johanna Fräki",
        "street_address": "Porkkalantie 2000",
        "links": {
          "type": "ReCdi5Hd7eOS2rG9",        "municipality": "0yBAhTHlzMwQHNMM"
        }
      },
      {
        "id": "lobhYcB6u6oYTvl7",
        "contact_email": "info@poppajoeking.com",
        "description": "Siivotaan radanvarren näkymää",
        "name": "Urjalan aseman radan varren siivoustalkoot",
        "organizer": "Jussi Westerbacka",
        "street_address": "Urjalan asema",
        "links": {
          "type": "ReCdi5Hd7eOS2rG9",        "municipality": "0yBAhTHlzMwQHNMM"
        }
      },
      {
        "id": "8dYEHZYPdmASc6N5",
        "contact_email": "pirjo.sinervo@punomo.fi",
        "description": "Käsityönopetuksen väki ja muut kiinnostuneet ympäri Suomea laativat ja julkaisevat uutta materiaalia, ohjeita ja ideoita, Teeitse käsityösivustoon http://punomo.fi/teeitse/ Talkoot ovat verkossa eli paikkakuntia on paljon! ",
        "name": "Uusia käsityöideoita Punomo TeeItse sivustoon",
        "organizer": "Pirjo Sinervo",
        "street_address": "http://punomo.fi/teeitse/ ",
        "links": {
          "type": "ReCdi5Hd7eOS2rG9",        "municipality": "0yBAhTHlzMwQHNMM"
        }
      },
      {
        "id": "VgJOufF2e1DPX8op",
        "contact_email": "wikitalkoot@gmail.com",
        "description": "Wikitalkoot on Lisa Sounio-Ahtisaaren ja Marko Ahtisaaren käynnistämä talkoo, jonka tavoitteena on 17.5. mennessä kirkastaa Suomi-kuvaa verkon ilmaisessa tietosanakirjassa wikipediassa.\n\nKutsumme mukaan talkoisiin kaikki kieli- ja kuvataitoiset suomalaiset ja Suomen ystävät. Kohennetaan yhdessä Suomea käsitteleviä tärkeimpiä wikipedian artikkeleja suurimmilla Euroopan kielillä. Tarkoitus on myös raikastaa artikkelien visuaalista ilmettä hyvillä valokuvilla.\n\nKampanjan aloittaa noin sadan artikkelin lista, johon toivotaan talkoolaisten panosta. Aloitamme englanninkielisillä artikkeleilla helmikuussa. Laajennamme maaliskuussa muihin kieliin ja lisäämme artikkeleja.\n\nOli kyseessä lumilautailijat, kapellimestarit, hevibändit, formulakuskit, kokit, kaupungit tai kivikirkot,  musiikkifestarit tai paikalliset herkut, Suomen omaperäinen kulttuuri ansaitsee tulla nähdyksi verkossa!\n\nTule mukaan http://lisasounio.com/wikitalkoot",
        "name": "Wikitalkoot - http://lisasounio.com/wikitalkoot",
        "organizer": "Marko Ahtisaari",
        "street_address": "Verkossa http://lisasounio.com/wikitalkoot ",
        "links": {
          "type": "ReCdi5Hd7eOS2rG9",        "municipality": "0yBAhTHlzMwQHNMM"
        }
      },
      {
        "id": "2JnqYC4RFeLxkZq6",
        "contact_email": "kyosti.ylikulju@ylakaupunginyo.fi",
        "description": "Asiakaspalvelua, keittiötöitä, järjestyksenvalvontaa, kuljetustehtäviä, roudausta, ääni- ja valotekniikkatöitä, valo- ja videokuvausta, liikenteenohjausta sekä siivousta.",
        "name": "Yläkaupungin Yö -festivaali",
        "organizer": "Yläkaupungin Yö -festivaali, toiminnanjohtaja Kyösti Ylikulju",
        "street_address": "Yläkaupungin alue",
        "links": {
          "type": "ReCdi5Hd7eOS2rG9",        "municipality": "0yBAhTHlzMwQHNMM"
        }
      },
      {
        "id": "a0Rum52Zopq0yeEE",
        "contact_email": "arttuvesterinen@gmail.com",
        "description": "Päivitetään nettisivut uudelle vuosituhannelle.",
        "name": "KKOY:n nettisivujen uusiminen",
        "organizer": "Arttu Vesterinen",
        "street_address": "Metsänneidonkuja 6",
        "links": {
          "type": "ReCdi5Hd7eOS2rG9",        "municipality": "0yBAhTHlzMwQHNMM"
        }
      },
      {
        "id": "9QEzViEeoZcMg0gZ",
        "contact_email": "arjas48@gmail.com",
        "description": "yhdessäoloa",
        "name": "työpaja",
        "organizer": "Arja Sipilä",
        "street_address": "Yli-haakkointie 29",
        "links": {
          "type": "ReCdi5Hd7eOS2rG9",        "municipality": "0yBAhTHlzMwQHNMM"
        }
      },
      {
        "id": "x89el5FHyWaTfjea",
        "contact_email": "eero@talkoot.fi",
        "description": "Koko perheen tanssitapahtuma, jossa tutustutaan eri tanssin lajeihin ja pidetään hauskaa tanssin parissa. Tapahtuma on suunnattu kaikenikäisille vauvasta vaariin.",
        "name": "Lohjan Tanssitalkoot",
        "organizer": "Eero Kuusi",
        "street_address": "",
        "links": {
          "type": "ReCdi5Hd7eOS2rG9",        "municipality": "0yBAhTHlzMwQHNMM"
        }
      }
    ]
  }
}
