/** Mzansi Journey — 9 SA Provinces data with multilingual support */

export type Lang = 'en' | 'af' | 'zu' | 'xh' | 'st';
export const LANGS: Lang[] = ['en', 'af', 'zu', 'xh', 'st'];
export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  af: 'AF',
  zu: 'ZU',
  xh: 'XH',
  st: 'ST',
};

export interface ProvinceData {
  id: string;
  name: Record<Lang, string>;
  animal: {
    name: Record<Lang, string>;
    emoji: string;
    bodyColor: string;
    accentColor: string;
  };
  language: Record<Lang, string>;
  landmark: Record<Lang, string>;
  cuisine: Record<Lang, string>;
  facts: Record<Lang, [string, string, string]>;
  /** Nova palette highlight color for SVG */
  color: string;
}

export const PROVINCES: ProvinceData[] = [
  {
    id: 'western-cape',
    name: {
      en: 'Western Cape',
      af: 'Wes-Kaap',
      zu: 'IKapa Entshonalanga',
      xh: 'INtshona Koloni',
      st: 'Kapa Bophirima',
    },
    animal: {
      name: { en: 'African Penguin', af: 'Afrika-pikkewyn', zu: 'Iphengwini', xh: 'Iphengwini', st: 'Pengwini' },
      emoji: '🐧',
      bodyColor: '#1A1A2E',
      accentColor: '#FFFFFF',
    },
    language: { en: 'Afrikaans & English', af: 'Afrikaans & Engels', zu: 'IsiBhunu nesiNgisi', xh: 'IsiBhulu nesiNgesi', st: 'Seafrikanse le Senyesemane' },
    landmark: { en: 'Table Mountain', af: 'Tafelberg', zu: 'INtaba YeThebula', xh: 'INtaba YeTafile', st: 'Thaba ea Table' },
    cuisine: { en: 'Cape Malay Bobotie', af: 'Kaapse Maleier Bobotie', zu: 'IBobotie YaseKapa', xh: 'IBobotie YaseKapa', st: 'Bobotie ea Cape Malay' },
    facts: {
      en: ['Home of Table Mountain, one of the New 7 Wonders of Nature!', 'African penguins live at Boulders Beach in Simon\'s Town.', 'The Cape Floral Kingdom has more plant species than the Amazon!'],
      af: ['Tuiste van Tafelberg, een van die Nuwe 7 Wonders van die Natuur!', 'Afrika-pikkewyne woon by Keistrand in Simonstad.', 'Die Kaapse Blommeryk het meer plantspesies as die Amasone!'],
      zu: ['Ikhaya leNtaba YeThebula, enye yeziMangaliso Ezintsha Ezi-7 zeMvelo!', 'Amaphengwini ase-Afrika ahlala eBoulders Beach eSimon\'s Town.', 'UMbuso Wezimbali WaseKapa unezinhlobo zezitshalo eziningi kune-Amazon!'],
      xh: ['Ikhaya leNtaba YeTafile, enye yeziMangaliso eziNtsha ezi-7 zeNdalo!', 'Iiphengwini zaseAfrika zihlala eBoulders Beach eSimon\'s Town.', 'UBukumkani Beentyatyambo baseKapa bunezilwanyana zezityalo ezingaphezulu kweAmazon!'],
      st: ['Lehae la Thaba ea Table, e nngwe ya Mehlolo e Metjha e 7 ea Tlhaho!', 'Dipengwini tsa Afrika di phela Boulders Beach Simon\'s Town.', 'Mmuso wa Palesa wa Cape o na le mefuta e mengata ya dimela ho feta Amazon!'],
    },
    color: '#42A5F5',
  },
  {
    id: 'eastern-cape',
    name: {
      en: 'Eastern Cape',
      af: 'Oos-Kaap',
      zu: 'IKapa Empumalanga',
      xh: 'IMpuma Koloni',
      st: 'Kapa Botjhabela',
    },
    animal: {
      name: { en: 'Elephant', af: 'Olifant', zu: 'Indlovu', xh: 'Indlovu', st: 'Tlou' },
      emoji: '🐘',
      bodyColor: '#808080',
      accentColor: '#606060',
    },
    language: { en: 'isiXhosa & Afrikaans', af: 'isiXhosa & Afrikaans', zu: 'IsiXhosa nesiBhunu', xh: 'IsiXhosa nesiBhulu', st: 'SeXhosa le Seafrikanse' },
    landmark: { en: 'Addo Elephant Park', af: 'Addo Olifantpark', zu: 'IPaki YeziNdlovu yase-Addo', xh: 'IPaki Yeendlovu yaseAddo', st: 'Phaka ea Ditlou ea Addo' },
    cuisine: { en: 'Umngqusho (Samp & Beans)', af: 'Umngqusho (Stampmielies & Bone)', zu: 'Umngqusho', xh: 'Umngqusho', st: 'Umngqusho' },
    facts: {
      en: ['Home of Nelson Mandela — born in Mvezo village.', 'Addo Elephant Park has over 600 elephants!', 'The Wild Coast has some of SA\'s most beautiful beaches.'],
      af: ['Tuiste van Nelson Mandela — gebore in Mvezo-dorpie.', 'Addo Olifantpark het meer as 600 olifante!', 'Die Wildekus het van SA se mooiste strande.'],
      zu: ['Ikhaya likaNelson Mandela — wazalelwa esigodini saseMvezo.', 'IPaki yaseAddo inezindlovu ezingaphezu kuka-600!', 'IWild Coast inamabhishi amahle kakhulu aseNingizimu Afrika.'],
      xh: ['Ikhaya likaNelson Mandela — wazalelwa eMvezo.', 'IPaki yaseAddo ineendlovu ezingaphezulu kwe-600!', 'Unxweme Lwasendle lunamanye amabhishi amahle eMzantsi Afrika.'],
      st: ['Lehae la Nelson Mandela — o hlahetse motseng wa Mvezo.', 'Phaka ea Addo e na le ditlou tse fetang 600!', 'Wild Coast e na le dibethe tse ding tse ntle ka ho fetisisa SA.'],
    },
    color: '#66BB6A',
  },
  {
    id: 'northern-cape',
    name: {
      en: 'Northern Cape',
      af: 'Noord-Kaap',
      zu: 'IKapa Enyakatho',
      xh: 'IMntla Koloni',
      st: 'Kapa Leboya',
    },
    animal: {
      name: { en: 'Meerkat', af: 'Stokstert', zu: 'Imeerkat', xh: 'Imeerkat', st: 'Meerkat' },
      emoji: '🦡',
      bodyColor: '#C2B280',
      accentColor: '#8B6914',
    },
    language: { en: 'Afrikaans & Setswana', af: 'Afrikaans & Setswana', zu: 'IsiBhunu neSeTswana', xh: 'IsiBhulu neSeTswana', st: 'Seafrikanse le Setswana' },
    landmark: { en: 'Kgalagadi Park', af: 'Kgalagadi-park', zu: 'IPaki yaseKgalagadi', xh: 'IPaki yaseKgalagadi', st: 'Phaka ea Kgalagadi' },
    cuisine: { en: 'Lamb Sosaties', af: 'Lam-sosaties', zu: 'Amasosati Ewundlu', xh: 'Amasosati eMvana', st: 'Sosaties tsa Nku' },
    facts: {
      en: ['The largest province in SA but fewest people!', 'Meerkats stand guard while their family eats.', 'The Kalahari Desert has beautiful red sand dunes.'],
      af: ['Die grootste provinsie in SA maar die minste mense!', 'Stoksterte hou wag terwyl hul familie eet.', 'Die Kalahari-woestyn het pragtige rooi sandduine.'],
      zu: ['Isifundazwe esikhulu kunazo zonke eNingizimu Afrika kodwa esinabanthu abambalwa!', 'Ama-meerkat ama elindile lapho imindeni yawo idla.', 'IKalahari Desert inezinqwaba zesihlabathi esibomvu ezinhle.'],
      xh: ['Iphondo elikhulu kunazo zonke eMzantsi Afrika kodwa elinabanthu abambalwa!', 'Iimeerkati zima zilinde ngelixa iintsapho zazo zisitya.', 'Intlango yeKalahari inamaqhina esihlabathi esibomvu amahle.'],
      st: ['Provense e kgolohadi ka ho fetisisa SA empa e na le batho ba fokolang!', 'Dimeerkati di ema di lebeletse ha malapa a tsona a ja.', 'Lehwatata la Kalahari le na le dithaba tsa lehlabathe le lefubedu tse ntle.'],
    },
    color: '#FF7043',
  },
  {
    id: 'kwazulu-natal',
    name: {
      en: 'KwaZulu-Natal',
      af: 'KwaZulu-Natal',
      zu: 'IKwaZulu-Natali',
      xh: 'IKwaZulu-Natali',
      st: 'KwaZulu-Natal',
    },
    animal: {
      name: { en: 'Rhino', af: 'Renoster', zu: 'Ubhejane', xh: 'Umkhombe', st: 'Tshukudu' },
      emoji: '🦏',
      bodyColor: '#7A7A7A',
      accentColor: '#555555',
    },
    language: { en: 'isiZulu & English', af: 'isiZulu & Engels', zu: 'IsiZulu nesiNgisi', xh: 'IsiZulu nesiNgesi', st: 'SeZulu le Senyesemane' },
    landmark: { en: 'Drakensberg Mountains', af: 'Drakensberge', zu: 'UKhahlamba', xh: 'UKhahlamba', st: 'Lithaba tsa Drakensberg' },
    cuisine: { en: 'Bunny Chow', af: 'Bunny Chow', zu: 'IBhani Chow', xh: 'IBhani Chow', st: 'Bunny Chow' },
    facts: {
      en: ['The Drakensberg Mountains have ancient San rock art.', 'Durban is famous for its warm beaches and curry!', 'The name means "Place of the Zulu People".'],
      af: ['Die Drakensberge het antieke San-rotskuns.', 'Durban is beroemd vir sy warm strande en kerrie!', 'Die naam beteken "Plek van die Zoeloe Mense".'],
      zu: ['IziNtaba zoKhahlamba zinemidwebo yamadwala amaSan asendulo.', 'ITheku lidume ngamabhishi alo ashisayo nekhali!', 'Igama lisho "Indawo Yabantu BamaZulu".'],
      xh: ['Iintaba zoKhahlamba zinemifanekiso yamawa amaSan amandulo.', 'ITheku lidume ngamabhishi alo ashushu nekhali!', 'Igama lithetha "Indawo Yabantu AmaZulu".'],
      st: ['Lithaba tsa Drakensberg li na le litshwantsho tsa San tsa mehleng ea khale.', 'Durban e tsejwa ka dibethe tsa eona tse futhumetseng le kheri!', 'Lebitso le bolela "Sebaka sa Batho ba MaZulu".'],
    },
    color: '#AB47BC',
  },
  {
    id: 'free-state',
    name: {
      en: 'Free State',
      af: 'Vrystaat',
      zu: 'IFuleyistata',
      xh: 'IFuleyisteyithi',
      st: 'Foreistata',
    },
    animal: {
      name: { en: 'Springbok', af: 'Springbok', zu: 'Insephe', xh: 'Isbhokhwe', st: 'Tshephe' },
      emoji: '🦌',
      bodyColor: '#C68E17',
      accentColor: '#FFFFFF',
    },
    language: { en: 'Sesotho & Afrikaans', af: 'Sesotho & Afrikaans', zu: 'ISeSotho nesiBhunu', xh: 'ISeSotho nesiBhulu', st: 'Sesotho le Seafrikanse' },
    landmark: { en: 'Golden Gate Highlands', af: 'Goue Poort Hoogland', zu: 'IGolden Gate Highlands', xh: 'IGolden Gate Highlands', st: 'Golden Gate Highlands' },
    cuisine: { en: 'Pap & Wors', af: 'Pap & Wors', zu: 'IPhutu Newosi', xh: 'IPapa Newosi', st: 'Papa le Boroso' },
    facts: {
      en: ['Known as the "breadbasket" — lots of farmland!', 'Golden Gate has amazing sandstone cliffs.', 'Sunflower fields bloom bright yellow in summer.'],
      af: ['Bekend as die "broodmandjie" — baie plaaslande!', 'Goue Poort het wonderlike sandsteen-kranse.', 'Sonneblomvelde blom helder geel in die somer.'],
      zu: ['Yaziwa ngokuthi "ubhasikidi wesinkwa" — amasimu amaningi!', 'IGolden Gate inamawa amahle esitshitshi.', 'Amasimu ezimbali zelanga avela mhlophe ngesikhathi sehlobo.'],
      xh: ['Yaziwa ngokuba yi-"bhaskithi yesonka" — amasimi amaninzi!', 'IGolden Gate inamawa amahle etyesi.', 'Amasimi eentyatyambo zelanga adubula mhlophe ehlotyeni.'],
      st: ['E tsejwa e le "seroto sa bohobe" — masimo a mangata!', 'Golden Gate e na le matshehla a makatsang a ite.', 'Masimo a dipalesa tsa letsatsi a thunya botala bo bohehla selemo.'],
    },
    color: '#FFD54F',
  },
  {
    id: 'gauteng',
    name: {
      en: 'Gauteng',
      af: 'Gauteng',
      zu: 'IGauteng',
      xh: 'IGauteng',
      st: 'Gauteng',
    },
    animal: {
      name: { en: 'Hadeda Ibis', af: 'Hadeda', zu: 'Insingizi', xh: 'Insingizi', st: 'Insingizi' },
      emoji: '🐦',
      bodyColor: '#4A6741',
      accentColor: '#8B4513',
    },
    language: { en: 'Many languages! (11 spoken)', af: 'Baie tale! (11 gepraat)', zu: 'Izilimi eziningi! (11 ezikhulunywa)', xh: 'Iilwimi ezininzi! (11 ezithethwayo)', st: 'Dipuo tse ngata! (11 tse buuwang)' },
    landmark: { en: 'Constitution Hill', af: 'Grondwet-heuwel', zu: 'I-Constitution Hill', xh: 'I-Constitution Hill', st: 'Constitution Hill' },
    cuisine: { en: 'Kota (Township Burger)', af: 'Kota (Township Burger)', zu: 'IKota', xh: 'IKota', st: 'Kota' },
    facts: {
      en: ['"Gauteng" means "Place of Gold" in Sesotho.', 'Johannesburg is the biggest city in SA!', 'The Cradle of Humankind has the oldest human fossils.'],
      af: ['"Gauteng" beteken "Plek van Goud" in Sesotho.', 'Johannesburg is die grootste stad in SA!', 'Die Wieg van die Mensdom het die oudste mensfossiele.'],
      zu: ['"IGauteng" lisho "Indawo Yegolide" ngesiSotho.', 'IJohannesburg idolobha elikhulu kunawo wonke eNingizimu Afrika!', 'ICradle of Humankind inezinsalela zabantu ezindala kunazo zonke.'],
      xh: ['"IGauteng" ithetha "Indawo Yegolide" ngeSeSotho.', 'IJohannesburg sisixeko esikhulu kunazo zonke eMzantsi Afrika!', 'ICradle of Humankind inefosilisi zabantu ezindala kunazo zonke.'],
      st: ['"Gauteng" e bolela "Sebaka sa Gauta" ka Sesotho.', 'Johannesburg ke motse o moholo ka ho fetisisa SA!', 'Cradle of Humankind e na le difosilise tsa batho tse kholo ka ho fetisisa.'],
    },
    color: '#FF5722',
  },
  {
    id: 'mpumalanga',
    name: {
      en: 'Mpumalanga',
      af: 'Mpumalanga',
      zu: 'IMpumalanga',
      xh: 'IMpumalanga',
      st: 'Mpumalanga',
    },
    animal: {
      name: { en: 'Leopard', af: 'Luiperd', zu: 'Ingwe', xh: 'Ingwe', st: 'Nkwe' },
      emoji: '🐆',
      bodyColor: '#DAA520',
      accentColor: '#8B6914',
    },
    language: { en: 'siSwati & isiZulu', af: 'siSwati & isiZulu', zu: 'IsiSwazi nesiZulu', xh: 'IsiSwazi nesiZulu', st: 'Seswati le SeZulu' },
    landmark: { en: 'Blyde River Canyon', af: 'Blyderivierspoort', zu: 'IBlyde River Canyon', xh: 'IBlyde River Canyon', st: 'Blyde River Canyon' },
    cuisine: { en: 'Mopane Worms', af: 'Mopane-wurms', zu: 'Amasonja', xh: 'Amasonja', st: 'Mopane Worms' },
    facts: {
      en: ['"Mpumalanga" means "Place Where the Sun Rises".', 'Blyde River Canyon is the 3rd largest canyon on Earth.', 'Home to part of the famous Kruger National Park.'],
      af: ['"Mpumalanga" beteken "Plek Waar die Son Opkom".', 'Blyderivierspoort is die 3de grootste canyon op Aarde.', 'Tuiste van deel van die beroemde Kruger Nasionale Park.'],
      zu: ['"IMpumalanga" isho "Indawo Lapho Ilanga Liphuma Khona".', 'IBlyde River Canyon iyisigodi sesithathu ngobukhulu emhlabeni.', 'Ikhaya lengxenye yePaki Kazwelonke yaseKruger edumile.'],
      xh: ['"IMpumalanga" ithetha "Indawo Apho Ilanga Liphuma Khona".', 'IBlyde River Canyon yikanyon yesithathu ngobukhulu emhlabeni.', 'Ikhaya lenxalenye yePaki Kazwelonke yaseKruger edumileyo.'],
      st: ['"Mpumalanga" e bolela "Sebaka Moo Letsatsi le Hlahang Teng".', 'Blyde River Canyon ke canyon ea boraro ka boholo lefatsheng.', 'Lehae la karolo ea Phaka ea Naha ea Kruger e tummeng.'],
    },
    color: '#4CAF50',
  },
  {
    id: 'limpopo',
    name: {
      en: 'Limpopo',
      af: 'Limpopo',
      zu: 'ILimpopo',
      xh: 'ILimpopo',
      st: 'Limpopo',
    },
    animal: {
      name: { en: 'Baobab Tree Bird', af: 'Kremetart-voël', zu: 'Inyoni Yesihlahla Somkhomo', xh: 'Intaka YoMthi WeBaobab', st: 'Nonyana ea Sefate sa Baobab' },
      emoji: '🌳',
      bodyColor: '#6D4C41',
      accentColor: '#388E3C',
    },
    language: { en: 'Sepedi & Tshivenda', af: 'Sepedi & Tshivenda', zu: 'ISePedi neTshiVenda', xh: 'ISePedi neTshiVenda', st: 'Sepedi le Tshivenda' },
    landmark: { en: 'Mapungubwe', af: 'Mapungubwe', zu: 'IMapungubwe', xh: 'IMapungubwe', st: 'Mapungubwe' },
    cuisine: { en: 'Mabele Porridge', af: 'Mabele-pap', zu: 'Amabele', xh: 'Amabele', st: 'Mabele' },
    facts: {
      en: ['Named after the great Limpopo River.', 'Mapungubwe was an ancient African kingdom (900 AD!).', 'Has huge baobab trees that can live 2000 years!'],
      af: ['Vernoem na die groot Limpopo-rivier.', 'Mapungubwe was \'n antieke Afrika-koninkryk (900 n.C.!).', 'Het reuse kremetartbome wat 2000 jaar kan leef!'],
      zu: ['Yathunjwa ngomfula omkhulu iLimpopo.', 'IMapungubwe kwakuyizikhulu zasendulo zase-Afrika (900 AD!).', 'Inemithi emikhulu ye-baobab engaphila iminyaka engu-2000!'],
      xh: ['Ithiywe ngomlambo omkhulu iLimpopo.', 'IMapungubwe yayibukumkani base-Afrika bamandulo (900 AD!).', 'Inemithi emikhulu yebaobab enokuphila iminyaka engama-2000!'],
      st: ['E rehiloe ka noka e kgolo ea Limpopo.', 'Mapungubwe e ne e le mmuso oa khale oa Afrika (900 AD!).', 'E na le difate tse kgolo tsa baobab tse ka phelang dilemo tse 2000!'],
    },
    color: '#8D6E63',
  },
  {
    id: 'north-west',
    name: {
      en: 'North West',
      af: 'Noordwes',
      zu: 'INyakatho Ntshonalanga',
      xh: 'IMntla Ntshona',
      st: 'Leboya Bophirima',
    },
    animal: {
      name: { en: 'Wild Dog', af: 'Wildehond', zu: 'Inkentshane', xh: 'Inkentshane', st: 'Letsa' },
      emoji: '🐕',
      bodyColor: '#8B6914',
      accentColor: '#FFFFFF',
    },
    language: { en: 'Setswana & Afrikaans', af: 'Setswana & Afrikaans', zu: 'ISeTswana nesiBhunu', xh: 'ISeTswana nesiBhulu', st: 'Setswana le Seafrikanse' },
    landmark: { en: 'Pilanesberg Game Reserve', af: 'Pilanesbergwildreservaat', zu: 'IPilanesberg Game Reserve', xh: 'IPilanesberg Game Reserve', st: 'Pilanesberg Game Reserve' },
    cuisine: { en: 'Seswaa (Shredded Meat)', af: 'Seswaa (Geskeurde Vleis)', zu: 'ISeswaa', xh: 'ISeswaa', st: 'Seswaa' },
    facts: {
      en: ['Known as the "Platinum Province" — rich in minerals!', 'Pilanesberg sits inside an ancient volcano crater.', 'The African wild dog is one of the rarest animals.'],
      af: ['Bekend as die "Platinum Provinsie" — ryk aan minerale!', 'Pilanesberg sit binne \'n antieke vulkaankrater.', 'Die Afrika-wildehond is een van die seldsaamste diere.'],
      zu: ['Yaziwa ngokuthi "Isifundazwe SePlatinum" — sinothile ngeminerali!', 'IPilanesberg iphakathi kwesikrathela sevulkano lasendulo.', 'Inja yasendle yase-Afrika ingenye yezilwane ezingavamile kunazo zonke.'],
      xh: ['Yaziwa ngokuba yi-"Phondo lePlatinum" — ityebile ngeminerali!', 'IPilanesberg ihlala phakathi kwekratere yevulkano yamandulo.', 'Inja yasendle yaseAfrika yenye yezilwanyana ezinqabileyo.'],
      st: ['E tsejwa e le "Provense ea Platinum" — e ruileng ka diminerale!', 'Pilanesberg e ka hare ho sekrathele sa volkano ea khale.', 'Ntja ea naha ea Afrika ke e nngwe ea diphoofolo tse sa tlwaelehang.'],
    },
    color: '#FFCA28',
  },
];

/** Lookup province by id */
export function getProvince(id: string): ProvinceData | undefined {
  return PROVINCES.find((p) => p.id === id);
}
