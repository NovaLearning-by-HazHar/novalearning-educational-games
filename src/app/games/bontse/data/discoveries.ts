/** Bontse — Discovery data: SA animals, cultures, monuments, provinces */

export type DiscoveryCategory = 'animals' | 'cultures' | 'monuments' | 'provinces';

export interface DiscoveryItem {
  id: string;
  name: Record<string, string>;
  facts: Record<string, string[]>; // 3 facts per language
  emoji: string;
}

export interface CategoryData {
  id: DiscoveryCategory;
  label: Record<string, string>;
  emoji: string;
  items: DiscoveryItem[];
}

const LANGS = ['en', 'af', 'zu', 'xh', 'st'] as const;
export type Lang = (typeof LANGS)[number];
export { LANGS };

export const CATEGORIES: CategoryData[] = [
  {
    id: 'animals',
    label: { en: 'Animals', af: 'Diere', zu: 'Izilwane', xh: 'Izilwanyana', st: 'Diphoofolo' },
    emoji: '🦁',
    items: [
      {
        id: 'lion',
        name: { en: 'Lion', af: 'Leeu', zu: 'Ibhubesi', xh: 'Ingonyama', st: 'Tau' },
        emoji: '🦁',
        facts: {
          en: ['Lions live in groups called prides.', 'A lion\'s roar can be heard 8km away!', 'Lions sleep up to 20 hours a day.'],
          af: ['Leeus leef in groepe genoem troppe.', '\'n Leeu se gebrul kan 8km ver gehoor word!', 'Leeus slaap tot 20 uur per dag.'],
          zu: ['Amabhubesi ahlala ngamaqembu abizwa ngama-prides.', 'Ukubhonga kwebhubesi kungezwakala emakhilomitheni angu-8!', 'Amabhubesi alala amahora angu-20 ngosuku.'],
          xh: ['Iingonyama zihlala ngamaqela abizwa ngama-prides.', 'Ukugquma kwengonyama kunokuviwa kude nge-8km!', 'Iingonyama zilala iiyure ezingama-20 ngosuku.'],
          st: ['Ditau di phela ka dihlopha tse bitswang di-prides.', 'Ho bopa ha tau ho ka utlwahala ho 8km!', 'Ditau di robala dihora tse 20 ka letsatsi.'],
        },
      },
      {
        id: 'elephant',
        name: { en: 'Elephant', af: 'Olifant', zu: 'Indlovu', xh: 'Indlovu', st: 'Tlou' },
        emoji: '🐘',
        facts: {
          en: ['Elephants are the largest land animals.', 'They use their trunks to drink water.', 'Elephants never forget their friends!'],
          af: ['Olifante is die grootste landdiere.', 'Hulle gebruik hul slurpe om water te drink.', 'Olifante vergeet nooit hul vriende nie!'],
          zu: ['Izindlovu ziyizilwane ezinkulu kunazo zonke emhlabeni.', 'Zisebenzisa imilomo yazo ukuphuza amanzi.', 'Izindlovu azikhohlwa abangane bazo!'],
          xh: ['Iindlovu zizilwanyana ezinkulu kunazo zonke emhlabeni.', 'Zisebenzisa imithala yazo ukusela amanzi.', 'Iindlovu azilibali abahlobo bazo!'],
          st: ['Ditlou ke diphoofolo tse kgolo ka ho fetisisa lefatsheng.', 'Di sebedisa dinko tsa tsona ho nwa metsi.', 'Ditlou ha di lebale metswalle ya tsona!'],
        },
      },
      {
        id: 'springbok',
        name: { en: 'Springbok', af: 'Springbok', zu: 'Insephe', xh: 'Isbhokhwe', st: 'Tshephe' },
        emoji: '🦌',
        facts: {
          en: ['Springboks can jump 3 metres high!', 'They are South Africa\'s national animal.', 'Springboks run in big herds together.'],
          af: ['Springbokke kan 3 meter hoog spring!', 'Hulle is Suid-Afrika se nasionale dier.', 'Springbokke hardloop in groot troppe saam.'],
          zu: ['Izinsephe zingagxuma amamitha angu-3 phezulu!', 'Ziyisilwane sikazwelonke saseNingizimu Afrika.', 'Izinsephe zigijima ngamaqoqo amakhulu ndawonye.'],
          xh: ['Iisbhokhwe zinokutsiba iimitha ezi-3 phezulu!', 'Sisilwanyana sikazwelonke soMzantsi Afrika.', 'Iisbhokhwe zibaleka ngamaqela amakhulu kunye.'],
          st: ['Ditshephe di ka tlolela hodimo ka dimethara tse 3!', 'Ke phoofolo ya naha ya Afrika Borwa.', 'Ditshephe di matha ka mehlape e meholo mmoho.'],
        },
      },
      {
        id: 'penguin',
        name: { en: 'African Penguin', af: 'Afrika-pikkewyn', zu: 'Iphengwini lase-Afrika', xh: 'Iphengwini yaseAfrika', st: 'Pengwini ya Afrika' },
        emoji: '🐧',
        facts: {
          en: ['African penguins live in Cape Town!', 'They make a donkey-like braying sound.', 'Penguins are excellent swimmers.'],
          af: ['Afrika-pikkewyne woon in Kaapstad!', 'Hulle maak \'n balk-geluid soos \'n donkie.', 'Pikkewyne is uitstekende swemmers.'],
          zu: ['Amaphengwini ase-Afrika ahlala eKapa!', 'Enza umsindo ofana nowembongolo.', 'Amaphengwini angababhukudi abahle kakhulu.'],
          xh: ['Iiphengwini zaseAfrika zihlala eKapa!', 'Zenza isandi esifana nesedonki.', 'Iiphengwini zingabadadi abahle kakhulu.'],
          st: ['Dipengwini tsa Afrika di phela Cape Town!', 'Di etsa modumo o tshwanang le wa tonki.', 'Dipengwini ke basesi ba hlollang.'],
        },
      },
    ],
  },
  {
    id: 'cultures',
    label: { en: 'Cultures', af: 'Kulture', zu: 'Amasiko', xh: 'Iinkcubeko', st: 'Meetlo' },
    emoji: '🎭',
    items: [
      {
        id: 'zulu',
        name: { en: 'Zulu', af: 'Zoeloe', zu: 'AmaZulu', xh: 'AmaZulu', st: 'MaZulu' },
        emoji: '🛡️',
        facts: {
          en: ['The Zulu are the largest ethnic group in SA.', 'Zulu beadwork tells stories through colours.', 'The Zulu greeting is "Sawubona" — I see you.'],
          af: ['Die Zoeloes is die grootste etniese groep in SA.', 'Zoeloe-kralwerk vertel stories deur kleure.', 'Die Zoeloe-groet is "Sawubona" — Ek sien jou.'],
          zu: ['AmaZulu ayisizwe esikhulu kunazo zonke eNingizimu Afrika.', 'Ubuhlalu bamaZulu buxoxa izindaba ngombala.', 'Isibingelelo sesiZulu sithi "Sawubona" — Ngiyakubona.'],
          xh: ['AmaZulu sisizwe esikhulu kunazo zonke eMzantsi Afrika.', 'Ubuhlalu bamaZulu bubalisa amabali ngemibala.', 'Isibuliso sesiZulu sithi "Sawubona" — Ndiyakubona.'],
          st: ['MaZulu ke setjhaba se seholo ka ho fetisisa SA.', 'Boraleng ba MaZulu bo bolela dipale ka mebala.', 'Tumediso ya SeZulu ke "Sawubona" — Ke a o bona.'],
        },
      },
      {
        id: 'xhosa',
        name: { en: 'Xhosa', af: 'Xhosa', zu: 'AmaXhosa', xh: 'AmaXhosa', st: 'MaXhosa' },
        emoji: '🎨',
        facts: {
          en: ['Xhosa language has unique click sounds.', 'Nelson Mandela was Xhosa.', 'Xhosa culture values respect for elders.'],
          af: ['Xhosa-taal het unieke klik-klanke.', 'Nelson Mandela was \'n Xhosa.', 'Xhosa-kultuur waardeer respek vir ouer mense.'],
          zu: ['IsiXhosa sinezinhlamvu zokuqhweba ezihlukile.', 'UNelson Mandela wayengumXhosa.', 'Amasiko amaXhosa ahlonipha abadala.'],
          xh: ['IsiXhosa sinezandi zokucofa ezizodwa.', 'UNelson Mandela wayengumXhosa.', 'Inkcubeko yamaXhosa ixabisa intlonipho kumadala.'],
          st: ['SeXhosa se na le medumo e ikgethang ya ho tobetsa.', 'Nelson Mandela e ne e le MoXhosa.', 'Setso sa MaXhosa se hlompha batho ba baholo.'],
        },
      },
      {
        id: 'ndebele',
        name: { en: 'Ndebele', af: 'Ndebele', zu: 'AmaNdebele', xh: 'AmaNdebele', st: 'MaNdebele' },
        emoji: '🏠',
        facts: {
          en: ['Ndebele are famous for their colourful house paintings.', 'Each pattern has a special meaning.', 'Ndebele women are master artists.'],
          af: ['Ndebele is beroemd vir hul kleurvolle huisverf.', 'Elke patroon het \'n spesiale betekenis.', 'Ndebele-vroue is meester-kunstenaars.'],
          zu: ['AmaNdebele adume ngokupenda izindlu zawo ngemibala.', 'Iphethini ngayinye inencazelo ekhethekile.', 'Abesifazane bamaNdebele bangabazobi abahle.'],
          xh: ['AmaNdebele adume ngokupeyinta izindlu zawo ngemibala.', 'Iphatheni nganye inentsingiselo ekhethekileyo.', 'Abafazi bamaNdebele bangabadweli abahle.'],
          st: ['MaNdebele a tsejwa ka ho penta matlo a bona ka mebala.', 'Paterone e nngwe le e nngwe e na le moelelo o ikgethang.', 'Basadi ba MaNdebele ke bo-ramahlale ba bonono.'],
        },
      },
    ],
  },
  {
    id: 'monuments',
    label: { en: 'Landmarks', af: 'Landmerke', zu: 'Izindawo Ezibalulekile', xh: 'Iindawo Ezibalulekileyo', st: 'Dibaka tse Bohlokwa' },
    emoji: '🏛️',
    items: [
      {
        id: 'table_mountain',
        name: { en: 'Table Mountain', af: 'Tafelberg', zu: 'INtaba YeThebula', xh: 'INtaba YeTafile', st: 'Thaba ea Table' },
        emoji: '⛰️',
        facts: {
          en: ['Table Mountain is one of the oldest mountains on Earth.', 'It has a flat top like a table!', 'Many unique plants grow only here.'],
          af: ['Tafelberg is een van die oudste berge op Aarde.', 'Dit het \'n plat bokant soos \'n tafel!', 'Baie unieke plante groei net hier.'],
          zu: ['INtaba YeThebula ingenye yezintaba ezindala kunazo zonke emhlabeni.', 'Inophahla oluqondile njengetafula!', 'Izitshalo eziningi ezihlukile zikhula lapha kuphela.'],
          xh: ['INtaba YeTafile yenye yeentaba ezindala kunazo zonke emhlabeni.', 'Inophahla oluthe tyaba njengethafile!', 'Izityalo ezininzi ezizodwa zikhula apha kuphela.'],
          st: ['Thaba ea Table ke e nngwe ya lithaba tse kholo ka ho fetisisa lefatsheng.', 'E na le hlooho e bataletseng joalo ka tafole!', 'Dimela tse ngata tse ikgethang di mela mona feela.'],
        },
      },
      {
        id: 'kruger',
        name: { en: 'Kruger Park', af: 'Kruger-wildtuin', zu: 'IPaki YaseKruger', xh: 'IPaki YaseKruger', st: 'Phaka ea Kruger' },
        emoji: '🌿',
        facts: {
          en: ['Kruger Park is one of Africa\'s largest game reserves.', 'You can see the Big 5 animals here.', 'It is as big as a small country!'],
          af: ['Kruger-wildtuin is een van Afrika se grootste wildreservate.', 'Jy kan die Groot 5 diere hier sien.', 'Dit is so groot soos \'n klein land!'],
          zu: ['IPaki YaseKruger ingenye yeziqiwu zamahlathi ezinkulu kunazo e-Afrika.', 'Ungabona izilwane ezinkulu ezi-5 lapha.', 'Inkulu njengelizwe elincane!'],
          xh: ['IPaki YaseKruger yenye yeendawo zezilwanyana ezinkulu eAfrika.', 'Unokubona izilwanyana eziNkulu ezi-5 apha.', 'Inkulu njengelizwe elincinci!'],
          st: ['Phaka ea Kruger ke e nngwe ya dibaka tse kgolo tsa diphoofolo Afrika.', 'O ka bona diphoofolo tse Kgolo tse 5 mona.', 'E kgolo joalo ka naha e nyenyane!'],
        },
      },
      {
        id: 'robben_island',
        name: { en: 'Robben Island', af: 'Robbeneiland', zu: 'ISiqhingi SaseRobben', xh: 'ISiqithi saseRobben', st: 'Sehlekehleke sa Robben' },
        emoji: '🏝️',
        facts: {
          en: ['Nelson Mandela was held here for 18 years.', 'It is now a museum of freedom.', 'You can visit it by boat from Cape Town.'],
          af: ['Nelson Mandela was hier vir 18 jaar aangehou.', 'Dit is nou \'n museum van vryheid.', 'Jy kan dit per boot van Kaapstad af besoek.'],
          zu: ['UNelson Mandela wavalelwa lapha iminyaka engu-18.', 'Manje seyimyuziyamu wenkululeko.', 'Ungavakashela ngesikebhe ukusuka eKapa.'],
          xh: ['UNelson Mandela wabanjelwa apha iminyaka eli-18.', 'Ngoku yimyuziyam yenkululeko.', 'Ungayityelela ngesikhephe ukusuka eKapa.'],
          st: ['Nelson Mandela o ne a tshwerwe mona dilemo tse 18.', 'Jwale ke musiamo wa tokoloho.', 'O ka e etela ka sekepe ho tloha Cape Town.'],
        },
      },
    ],
  },
  {
    id: 'provinces',
    label: { en: 'Provinces', af: 'Provinsies', zu: 'Izifundazwe', xh: 'Iphondo', st: 'Diprovense' },
    emoji: '🗺️',
    items: [
      {
        id: 'western_cape',
        name: { en: 'Western Cape', af: 'Wes-Kaap', zu: 'IKapa Entshonalanga', xh: 'INtshona Koloni', st: 'Kapa Bophirima' },
        emoji: '🌊',
        facts: {
          en: ['Home of Cape Town and Table Mountain.', 'Famous for its beautiful beaches.', 'Many penguins live at Boulders Beach!'],
          af: ['Tuiste van Kaapstad en Tafelberg.', 'Beroemd vir sy pragtige strande.', 'Baie pikkewyne woon by Keistrand!'],
          zu: ['Ikhaya leKapa neNtaba yeThebula.', 'Idume ngamabhishi ayo amahle.', 'Amaphengwini amaningi ahlala eBoulders Beach!'],
          xh: ['Ikhaya leKapa neNtaba yeTafile.', 'Idume ngamabhishi ayo amahle.', 'Iiphengwini ezininzi zihlala eBoulders Beach!'],
          st: ['Lehae la Cape Town le Thaba ea Table.', 'E tsejwa ka dibethe tsa eona tse ntle.', 'Dipengwini tse ngata di phela Boulders Beach!'],
        },
      },
      {
        id: 'gauteng',
        name: { en: 'Gauteng', af: 'Gauteng', zu: 'IGauteng', xh: 'IGauteng', st: 'Gauteng' },
        emoji: '🏙️',
        facts: {
          en: ['Gauteng means "Place of Gold" in Sotho.', 'Johannesburg is the biggest city here.', 'It is the smallest but richest province.'],
          af: ['Gauteng beteken "Plek van Goud" in Sotho.', 'Johannesburg is die grootste stad hier.', 'Dit is die kleinste maar rykste provinsie.'],
          zu: ['IGauteng lisho "Indawo yeGolide" ngesiSotho.', 'IJohannesburg yidolobha elikhulu lapha.', 'Yisifundazwe esincane kodwa esicebe kunazo zonke.'],
          xh: ['IGauteng ithetha "Indawo yeGolide" ngesiSotho.', 'IJohannesburg sisixeko esikhulu apha.', 'Liphondo elincinane kodwa elityebileyo kunazo zonke.'],
          st: ['Gauteng e bolela "Sebaka sa Gauta" ka Sesotho.', 'Johannesburg ke motse o moholo mona.', 'Ke provense e nyenyane empa e ruileng ka ho fetisisa.'],
        },
      },
      {
        id: 'kwazulu_natal',
        name: { en: 'KwaZulu-Natal', af: 'KwaZulu-Natal', zu: 'IKwaZulu-Natali', xh: 'IKwaZulu-Natali', st: 'KwaZulu-Natal' },
        emoji: '🏖️',
        facts: {
          en: ['KZN has warm beaches and the Drakensberg mountains.', 'Durban is famous for bunny chow!', 'Many Zulu people call KZN home.'],
          af: ['KZN het warm strande en die Drakensberge.', 'Durban is beroemd vir bunny chow!', 'Baie Zoeloe-mense noem KZN hul tuiste.'],
          zu: ['IKwaZulu-Natali inamabhishi ashisayo neziNtaba zoKhahlamba.', 'ITheku lidume ngebhanichawu!', 'AmaZulu amaningi abiza iKZN ngokuthi ikhaya.'],
          xh: ['IKwaZulu-Natali inamabhishi ashushu neentaba zoKhahlamba.', 'ITheku idume ngebhani chow!', 'AmaZulu amaninzi abiza iKZN ngokuthi likhaya.'],
          st: ['KZN e na le dibethe tse futhumetseng le lithaba tsa Drakensberg.', 'Durban e tsejwa ka bunny chow!', 'Batho ba bangata ba MaZulu ba bitsa KZN lehae.'],
        },
      },
    ],
  },
];
