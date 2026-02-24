/** Thina Trivia — 210+ questions for Grade R/1 SA children */
import type { TriviaCategory } from '../lib/constants';

export interface TriviaQuestion {
  id: number;
  question: Record<string, string>;
  options: Record<string, string[]>;
  correctIndex: number;
  category: TriviaCategory;
  difficulty: 1 | 2 | 3;
}

// Compact builder: English-primary with translations for question text, shared options
function q(
  id: number, cat: TriviaCategory, diff: 1 | 2 | 3,
  qEn: string, qAf: string, qZu: string, qXh: string, qSt: string,
  opts: string[], correct: number,
): TriviaQuestion {
  return {
    id, category: cat, difficulty: diff, correctIndex: correct,
    question: { en: qEn, af: qAf, zu: qZu, xh: qXh, st: qSt },
    options: { en: opts, af: opts, zu: opts, xh: opts, st: opts },
  };
}

// ===== ANIMALS (35) =====
const ANIMALS: TriviaQuestion[] = [
  q(1,'animals',1,'How many legs does a dog have?','Hoeveel bene het \'n hond?','Inja inezinyawo ezingaki?','Inja inamilenze emingaphi?','Ntja e na le maoto a makae?',['2','4','6'],1),
  q(2,'animals',1,'How many legs does an elephant have?','Hoeveel bene het \'n olifant?','Indlovu inezinyawo ezingaki?','Indlovu inamilenze emingaphi?','Tlou e na le maoto a makae?',['2','4','8'],1),
  q(3,'animals',1,'What sound does a cat make?','Watter geluid maak \'n kat?','Ikati lenza msindo muni?','Ikati yenza siphi isandi?','Katse e etsa modumo ofe?',['Woof','Moo','Meow'],2),
  q(4,'animals',1,'What sound does a cow make?','Watter geluid maak \'n koei?','Inkomo yenza msindo muni?','Inkomo yenza siphi isandi?','Kgomo e etsa modumo ofe?',['Meow','Moo','Baa'],1),
  q(5,'animals',1,'What sound does a dog make?','Watter geluid maak \'n hond?','Inja yenza msindo muni?','Inja yenza siphi isandi?','Ntja e etsa modumo ofe?',['Moo','Meow','Woof'],2),
  q(6,'animals',1,'Which animal has a trunk?','Watter dier het \'n slurp?','Yisiphi isilwane esinomboko?','Sisiphi isilwanyana esinomthala?','Phoofolo efe e nang le nko e telele?',['Dog','Elephant','Cat'],1),
  q(7,'animals',1,'Which animal can fly?','Watter dier kan vlieg?','Yisiphi isilwane esindizayo?','Sisiphi isilwanyana esibhabha?','Phoofolo efe e foforehang?',['Fish','Bird','Snake'],1),
  q(8,'animals',1,'Which animal lives in water?','Watter dier leef in water?','Yisiphi isilwane esihlala emanzini?','Sisiphi isilwanyana esihlala emanzini?','Phoofolo efe e phelang metsing?',['Lion','Bird','Fish'],2),
  q(9,'animals',1,'What is a baby dog called?','Wat word \'n baba-hond genoem?','Inja encane ibizwa ngokuthini?','Inja encinane ibizwa ngokuthini?','Ntjanyana e bitswa eng?',['Kitten','Puppy','Calf'],1),
  q(10,'animals',1,'What is a baby cat called?','Wat word \'n baba-kat genoem?','Ikati elincane libizwa ngokuthini?','Ikati encinane ibizwa ngokuthini?','Katse e nyenyane e bitswa eng?',['Puppy','Kitten','Lamb'],1),
  q(11,'animals',2,'How many legs does a spider have?','Hoeveel bene het \'n spinnekop?','Isicabucabu sinezinyawo ezingaki?','Isigcawu sinamilenze emingaphi?','Segokgo se na le maoto a makae?',['6','8','4'],1),
  q(12,'animals',2,'Which animal is the tallest?','Watter dier is die langste?','Yisiphi isilwane eside kunazo zonke?','Sisiphi isilwanyana esinde kunazo zonke?','Phoofolo efe e telele ka ho fetisisa?',['Elephant','Giraffe','Horse'],1),
  q(13,'animals',1,'Which animal says "Baa"?','Watter dier se "Baa"?','Yisiphi isilwane esithi "Baa"?','Sisiphi isilwanyana esithi "Baa"?','Phoofolo efe e reng "Baa"?',['Cow','Dog','Sheep'],2),
  q(14,'animals',2,'Where do penguins live in SA?','Waar woon pikkewyne in SA?','Amaphengwini ahlala kuphi eNingizimu Afrika?','Iiphengwini zihlala phi eMzantsi Afrika?','Dipengwini di phela kae Afrika Borwa?',['Johannesburg','Cape Town','Durban'],1),
  q(15,'animals',1,'Which animal has stripes?','Watter dier het strepe?','Yisiphi isilwane esinemigqa?','Sisiphi isilwanyana esinemigca?','Phoofolo efe e nang le methalo?',['Elephant','Zebra','Lion'],1),
  q(16,'animals',2,'What does a frog start life as?','Waarmee begin \'n padda sy lewe?','Ixoxo liqala impilo njengani?','Isele iqala ubomi njengantoni?','Segwagwa se qala bophelo jwang?',['Puppy','Tadpole','Egg'],1),
  q(17,'animals',1,'Which animal has feathers?','Watter dier het vere?','Yisiphi isilwane esinezimpaphe?','Sisiphi isilwanyana esinentsiba?','Phoofolo efe e nang le masiba?',['Snake','Fish','Bird'],2),
  q(18,'animals',2,'What is the biggest animal in the sea?','Wat is die grootste dier in die see?','Yisiphi isilwane esikhulu olwandle?','Sisiphi isilwanyana esikhulu elwandle?','Phoofolo e kgolo lewatleng ke efe?',['Shark','Whale','Dolphin'],1),
  q(19,'animals',1,'How many wings does a bird have?','Hoeveel vlerke het \'n voel?','Inyoni inezimpiko ezingaki?','Intaka inamaphiko amangaphi?','Nonyana e na le mapheo a makae?',['1','2','4'],1),
  q(20,'animals',2,'Which animal is SA national animal?','Watter dier is SA se nasionale dier?','Yisiphi isilwane sikazwelonke saseNingizimu Afrika?','Sisiphi isilwanyana sikazwelonke soMzantsi Afrika?','Phoofolo ya naha ya Afrika Borwa ke efe?',['Lion','Springbok','Elephant'],1),
  q(21,'animals',1,'What does a hen give us?','Wat gee \'n hen vir ons?','Isikhukhukazi sisinika ini?','Isikhukhukazi sisinika ntoni?','Kgoho e re fa eng?',['Milk','Eggs','Wool'],1),
  q(22,'animals',1,'Which animal gives us milk?','Watter dier gee vir ons melk?','Yisiphi isilwane esisinika ubisi?','Sisiphi isilwanyana esisinika ubisi?','Phoofolo efe e re fang lebese?',['Chicken','Cow','Sheep'],1),
  q(23,'animals',2,'What is a group of lions called?','Wat word \'n groep leeus genoem?','Iqembu lamabhubesi libizwa ngokuthini?','Iqela leengonyama libizwa ngokuthini?','Sehlopha sa ditau se bitswa eng?',['Pack','Herd','Pride'],2),
  q(24,'animals',1,'Which animal hops?','Watter dier hop?','Yisiphi isilwane esigxumayo?','Sisiphi isilwanyana esitsibayo?','Phoofolo efe e tlolang?',['Snake','Rabbit','Fish'],1),
  q(25,'animals',2,'Which animal can change colour?','Watter dier kan van kleur verander?','Yisiphi isilwane esingashintsha umbala?','Sisiphi isilwanyana esingatshintsha umbala?','Phoofolo efe e ka fetolang mmala?',['Dog','Chameleon','Cat'],1),
  q(26,'animals',1,'How many legs does a snake have?','Hoeveel bene het \'n slang?','Inyoka inezinyawo ezingaki?','Inyoka inamilenze emingaphi?','Noha e na le maoto a makae?',['0','2','4'],0),
  q(27,'animals',2,'Which animal carries its house?','Watter dier dra sy huis?','Yisiphi isilwane esithwala indlu yaso?','Sisiphi isilwanyana esithwala indlu yaso?','Phoofolo efe e jareng ntlo ya yona?',['Dog','Snail','Bird'],1),
  q(28,'animals',1,'Which animal has a long neck?','Watter dier het \'n lang nek?','Yisiphi isilwane esinentamo ende?','Sisiphi isilwanyana esinentamo ende?','Phoofolo efe e nang le molala o motelele?',['Cat','Elephant','Giraffe'],2),
  q(29,'animals',2,'What do bees make?','Wat maak bye?','Izinyosi zenza ini?','Iinyosi zenza ntoni?','Dinotshi di etsa eng?',['Milk','Honey','Eggs'],1),
  q(30,'animals',1,'Which animal barks?','Watter dier blaf?','Yisiphi isilwane esikhonkotha?','Sisiphi isilwanyana esikhonkothayo?','Phoofolo efe e hohoetsang?',['Cat','Dog','Cow'],1),
  q(31,'animals',2,'What is the fastest land animal?','Wat is die vinnigste landdier?','Yisiphi isilwane esisheshayo emhlabeni?','Sisiphi isilwanyana esikhawulezayo?','Phoofolo e potlakang ka ho fetisisa ke efe?',['Elephant','Cheetah','Horse'],1),
  q(32,'animals',1,'Which animal lives in a nest?','Watter dier leef in \'n nes?','Yisiphi isilwane esihlala esidlekeni?','Sisiphi isilwanyana esihlala esidlekeni?','Phoofolo efe e phelang sehlaheng?',['Fish','Bird','Dog'],1),
  q(33,'animals',2,'How many legs does a butterfly have?','Hoeveel bene het \'n skoenlapper?','Uvemvane lunezinyawo ezingaki?','Ibhabhathane inamilenze emingaphi?','Serurubele se na le maoto a makae?',['4','6','8'],1),
  q(34,'animals',1,'Which animal swims in the sea?','Watter dier swem in die see?','Yisiphi isilwane esibhukuda olwandle?','Sisiphi isilwanyana esidada elwandle?','Phoofolo efe e sesesang lewatleng?',['Dog','Lion','Fish'],2),
  q(35,'animals',2,'What does a meerkat eat?','Wat eet \'n erdmannetjie?','Isuricate sidlani?','Isuricate itya ntoni?','Meerkat e ja eng?',['Grass','Insects','Fish'],1),
];

// ===== CULTURES (35) =====
const CULTURES: TriviaQuestion[] = [
  q(36,'cultures',1,'What language do we say "Sawubona" in?','In watter taal se ons "Sawubona"?','Sithi "Sawubona" ngaluphi ulimi?','Sithi "Sawubona" ngaluphi ulwimi?','Re re "Sawubona" ka puo efe?',['English','Zulu','Afrikaans'],1),
  q(37,'cultures',1,'How many official languages does SA have?','Hoeveel amptelike tale het SA?','Zingaki izilimi ezisemthethweni?','Zingaphi iilwimi ezisemthethweni?','Afrika Borwa e na le dipuo tse kae?',['5','11','7'],1),
  q(38,'cultures',1,'What is "Dankie" in English?','Wat se ons in Engels vir "Dankie"?','Sithini ngesiNgisi uma sithi "Dankie"?','Sithini ngesiNgesi xa sisithi "Dankie"?','Re reng ka Senyesemane ha re re "Dankie"?',['Hello','Thank you','Goodbye'],1),
  q(39,'cultures',2,'What is the Zulu word for "Hello"?','Wat is die Zoeloe-woord vir "Hello"?','Yini igama lesiZulu elithi "Hello"?','Yintoni igama lesiZulu elithi "Hello"?','Lentswe la SeZulu la "Hello" ke lefe?',['Sawubona','Dankie','Hamba'],0),
  q(40,'cultures',1,'What colours are on the SA flag?','Watter kleure is op die SA-vlag?','Yimiphi imibala esifulegini?','Yeyiphi imibala kwifulegi?','Mebala efe e folakeng ya Afrika Borwa?',['Red and blue','Green, black, gold, red, white, blue','Purple and pink'],1),
  q(41,'cultures',2,'Who was Nelson Mandela?','Wie was Nelson Mandela?','Wayengubani uNelson Mandela?','Wayengubani uNelson Mandela?','Nelson Mandela e ne e le mang?',['A singer','A president','A teacher'],1),
  q(42,'cultures',1,'What is "Enkosi" in English?','Wat is "Enkosi" in Engels?','Yini "Enkosi" ngesiNgisi?','Yintoni "Enkosi" ngesiNgesi?','"Enkosi" ke eng ka Senyesemane?',['Goodbye','Thank you','Please'],1),
  q(43,'cultures',2,'Which culture paints colourful houses?','Watter kultuur verf kleurvolle huise?','Yisiphi isiko esipenda izindlu ngemibala?','Sisiphi isiko esipeyinta izindlu ngemibala?','Setso sefe se pentang matlo ka mebala?',['Zulu','Ndebele','Xhosa'],1),
  q(44,'cultures',1,'What does "Ubuntu" mean?','Wat beteken "Ubuntu"?','Kusho ukuthini "Ubuntu"?','Kuthetha ukuthini "Ubuntu"?','"Ubuntu" e bolela eng?',['I am happy','I am because we are','I am alone'],1),
  q(45,'cultures',2,'What is Heritage Day about?','Waaroor gaan Erfenisdag?','Usuku Lwefa Lusho Ukuthini?','Lusuku Lwelifa Luthetha Ntoni?','Letsatsi la Bohwa le mabapi le eng?',['Sleeping','Celebrating our cultures','Swimming'],1),
  q(46,'cultures',1,'What is the Sotho greeting?','Wat is die Sotho-groet?','Yisiphi isibingelelo sesiSotho?','Sisiphi isibuliso sesiSotho?','Tumediso ya Sesotho ke efe?',['Sawubona','Dumela','Molo'],1),
  q(47,'cultures',1,'What is the Xhosa greeting?','Wat is die Xhosa-groet?','Yisiphi isibingelelo sesiXhosa?','Sisiphi isibuliso sesiXhosa?','Tumediso ya SeXhosa ke efe?',['Sawubona','Dumela','Molo'],2),
  q(48,'cultures',2,'What special sounds does Xhosa have?','Watter spesiale klanke het Xhosa?','Yimiphi imisindo ekhethekile yesiXhosa?','Zeziphi izandi ezikhethekileyo?','Medumo efe e ikgethang ya SeXhosa?',['Whistles','Click sounds','Hums'],1),
  q(49,'cultures',1,'What do we celebrate on Freedom Day?','Wat vier ons op Vryheidsdag?','Sigubha ini ngoSuku Lwenkululeko?','Sibhiyozela ntoni ngoSuku Lwenkululeko?','Re keteka eng ka Letsatsi la Tokoloho?',['Birthdays','Our freedom','Rain'],1),
  q(50,'cultures',2,'What is braai in English?','Wat is braai in Engels?','Yini ibraai ngesiNgisi?','Yintoni ibraai ngesiNgesi?','Braai ke eng ka Senyesemane?',['Cooking','Barbecue','Dancing'],1),
  q(51,'cultures',1,'What is "Hamba kahle" in English?','Wat is "Hamba kahle" in Engels?','Yini "Hamba kahle" ngesiNgisi?','Yintoni "Hamba kahle" ngesiNgesi?','"Hamba kahle" ke eng ka Senyesemane?',['Go well / Goodbye','Thank you','Hello'],0),
  q(52,'cultures',2,'What is a shweshwe dress?','Wat is \'n shweshwe-rok?','Yini ingubo ye-shweshwe?','Yintoni ilokhwe ye-shweshwe?','Roko ya shweshwe ke eng?',['A hat','A traditional dress','Shoes'],1),
  q(53,'cultures',1,'How do we show respect to elders?','Hoe wys ons respek aan ouer mense?','Sibonisa kanjani inhlonipho kwabadala?','Sibonisa njani intlonipho kumadala?','Re bontsha hlompho jwang ho batho ba baholo?',['Ignore them','Greet and listen','Run away'],1),
  q(54,'cultures',2,'What is the rainbow nation?','Wat is die reenboog-nasie?','Yini isizwe sothingo lwenkosazana?','Yintoni isizwe sothingo?','Setjhaba sa mookodi ke eng?',['A place with rain','South Africa - many cultures together','A rainbow'],1),
  q(55,'cultures',1,'What does "Sala kahle" mean?','Wat beteken "Sala kahle"?','Kusho ukuthini "Sala kahle"?','Kuthetha ukuthini "Sala kahle"?','"Sala kahle" e bolela eng?',['Stay well / Goodbye','Run fast','Good morning'],0),
  q(56,'cultures',2,'What is Zulu beadwork?','Wat is Zoeloe-kralwerk?','Yini ubuhlalu bamaZulu?','Yintoni ubuhlalu bamaZulu?','Boraleng ba MaZulu ke eng?',['Food','Jewellery that tells stories','A game'],1),
  q(57,'cultures',1,'What do we eat at a braai?','Wat eet ons by \'n braai?','Sidlani ebraai?','Sitya ntoni ebraai?','Re ja eng ha re braai?',['Ice cream','Meat','Cereal'],1),
  q(58,'cultures',2,'What is the SA anthem called?','Wat word die SA-volkslied genoem?','Libizwa ngokuthini iculo laseNingizimu Afrika?','Libizwa ngokuthini iculo loMzantsi Afrika?','Pina ya naha e bitswa eng?',['Happy Song','Nkosi Sikelel\' iAfrika','Rainbow Song'],1),
  q(59,'cultures',1,'What does "Ngiyabonga" mean?','Wat beteken "Ngiyabonga"?','Kusho ukuthini "Ngiyabonga"?','Kuthetha ukuthini "Ngiyabonga"?','"Ngiyabonga" e bolela eng?',['Hello','Thank you','Goodbye'],1),
  q(60,'cultures',2,'What is a kraal?','Wat is \'n kraal?','Yini isibaya?','Yintoni isibaya?','Lesaka ke eng?',['A school','An animal enclosure','A river'],1),
  q(61,'cultures',1,'What day is Youth Day?','Watter dag is Jeugdag?','Lusuku luni oLwentsha?','Lusuku luni loLutsha?','Letsatsi la Batjha ke lefe?',['25 December','16 June','1 January'],1),
  q(62,'cultures',2,'What are Ndebele houses known for?','Waarvoor is Ndebele-huise bekend?','Zadume ngani izindlu zamaNdebele?','Zaziwa ngantoni izindlu zamaNdebele?','Matlo a MaNdebele a tsejwa ka eng?',['Being very tall','Bright colourful patterns','Being underground'],1),
  q(63,'cultures',1,'What is "Asseblief" in English?','Wat is "Asseblief" in Engels?','Yini "Asseblief" ngesiNgisi?','Yintoni "Asseblief" ngesiNgesi?','"Asseblief" ke eng ka Senyesemane?',['Thank you','Please','Goodbye'],1),
  q(64,'cultures',2,'Which language uses click sounds?','Watter taal gebruik klik-klanke?','Yiluphi ulimi olusebenzisa izinhlamvu zokuqhweba?','Loluphi ulwimi olusebenzisa izandi zokucofa?','Puo efe e sebedisang medumo ya ho tobetsa?',['Afrikaans','English','Xhosa'],2),
  q(65,'cultures',1,'What do friends do?','Wat doen vriende?','Abangane benzani?','Abahlobo benza ntoni?','Metswalle ba etsa eng?',['Fight','Share and help','Hide'],1),
  q(66,'cultures',2,'What is a gumboot dance?','Wat is \'n gumboot-dans?','Yini umdanso we-gumboot?','Yintoni umdaniso we-gumboot?','Motjeko wa gumboot ke eng?',['A slow walk','A dance using boots','Swimming'],1),
  q(67,'cultures',1,'What colour is a protea?','Watter kleur is \'n protea?','Ngowani umbala weprotea?','Ngowuphi umbala weprotea?','Protea e na le mmala ofe?',['Blue','Pink','Green'],1),
  q(68,'cultures',2,'What is SA national flower?','Wat is SA se nasionale blom?','Yisiphi isitshalo sikazwelonke?','Yeyiphi intyatyambo yezwe?','Palesa ya naha ke efe?',['Rose','Protea','Sunflower'],1),
  q(69,'cultures',1,'When we share, we show...?','Wanneer ons deel, wys ons...?','Uma sabelana, sibonisa...?','Xa sabelana, sibonisa...?','Ha re arolelana, re bontsha...?',['Anger','Ubuntu','Sadness'],1),
  q(70,'cultures',2,'What is a sangoma?','Wat is \'n sangoma?','Yini isangoma?','Yintoni isangoma?','Ngaka ke eng?',['A teacher','A traditional healer','A chef'],1),
];

// ===== COUNTING (35) =====
const COUNTING: TriviaQuestion[] = [
  q(71,'counting',1,'What comes after 1?','Wat kom na 1?','Kuyini okuza ngemva kuka-1?','Yintoni eza emva kwe-1?','Ho tla eng ka mora 1?',['3','2','5'],1),
  q(72,'counting',1,'What comes after 2?','Wat kom na 2?','Kuyini okuza ngemva kuka-2?','Yintoni eza emva kwe-2?','Ho tla eng ka mora 2?',['1','4','3'],2),
  q(73,'counting',1,'What comes after 3?','Wat kom na 3?','Kuyini okuza ngemva kuka-3?','Yintoni eza emva kwe-3?','Ho tla eng ka mora 3?',['2','5','4'],2),
  q(74,'counting',1,'What comes after 4?','Wat kom na 4?','Kuyini okuza ngemva kuka-4?','Yintoni eza emva kwe-4?','Ho tla eng ka mora 4?',['3','5','6'],1),
  q(75,'counting',1,'What comes after 5?','Wat kom na 5?','Kuyini okuza ngemva kuka-5?','Yintoni eza emva kwe-5?','Ho tla eng ka mora 5?',['4','7','6'],2),
  q(76,'counting',1,'How many fingers on one hand?','Hoeveel vingers op een hand?','Zingaki izinzwane esandleni esisodwa?','Zingaphi iminwe kwisandla esinye?','Menwana e mekae letsohong le le leng?',['4','5','10'],1),
  q(77,'counting',1,'How many eyes do you have?','Hoeveel oe het jy?','Unamehlo amangaki?','Unamehlo amangaphi?','O na le mahlo a makae?',['1','3','2'],2),
  q(78,'counting',1,'How many ears do you have?','Hoeveel ore het jy?','Unezindlebe ezingaki?','Uneendlebe ezingaphi?','O na le ditsebe tse kae?',['1','2','3'],1),
  q(79,'counting',1,'How many noses do you have?','Hoeveel neuse het jy?','Unamakhala amangaki?','Unempumlo ezingaphi?','O na le dinko tse kae?',['1','2','3'],0),
  q(80,'counting',1,'What is 1 + 1?','Wat is 1 + 1?','Kuyini 1 + 1?','Yintoni 1 + 1?','1 + 1 ke bokae?',['1','3','2'],2),
  q(81,'counting',1,'What is 2 + 1?','Wat is 2 + 1?','Kuyini 2 + 1?','Yintoni 2 + 1?','2 + 1 ke bokae?',['2','3','4'],1),
  q(82,'counting',1,'What is 2 + 2?','Wat is 2 + 2?','Kuyini 2 + 2?','Yintoni 2 + 2?','2 + 2 ke bokae?',['3','5','4'],2),
  q(83,'counting',1,'What is 3 + 2?','Wat is 3 + 2?','Kuyini 3 + 2?','Yintoni 3 + 2?','3 + 2 ke bokae?',['4','5','6'],1),
  q(84,'counting',2,'What is 5 + 5?','Wat is 5 + 5?','Kuyini 5 + 5?','Yintoni 5 + 5?','5 + 5 ke bokae?',['8','10','11'],1),
  q(85,'counting',1,'How many fingers on both hands?','Hoeveel vingers op beide hande?','Zingaki izinzwane ezandleni zombili?','Zingaphi iminwe kwizandla zombini?','Menwana e mekae matsohong a mabedi?',['5','10','20'],1),
  q(86,'counting',1,'Which is biggest: 3, 1, 5?','Watter nommer is die grootste: 3, 1, 5?','Yiliphi inombolo enkulu: 3, 1, 5?','Yeyiphi inani elikhulu: 3, 1, 5?','Nomoro efe e kgolo: 3, 1, 5?',['3','1','5'],2),
  q(87,'counting',1,'Which is smallest: 4, 2, 7?','Watter nommer is die kleinste: 4, 2, 7?','Yiliphi inombolo encane: 4, 2, 7?','Yeyiphi inani elincinane: 4, 2, 7?','Nomoro efe e nyenyane: 4, 2, 7?',['4','2','7'],1),
  q(88,'counting',2,'What comes before 5?','Wat kom voor 5?','Kuyini okungaphambi kuka-5?','Yintoni ephambi kwe-5?','Ho tla eng pele ho 5?',['6','3','4'],2),
  q(89,'counting',2,'What comes before 3?','Wat kom voor 3?','Kuyini okungaphambi kuka-3?','Yintoni ephambi kwe-3?','Ho tla eng pele ho 3?',['4','1','2'],2),
  q(90,'counting',1,'Count the shapes: O O O','Tel die vorms: O O O','Bala izimo: O O O','Bala iimilo: O O O','Bala dimmapa: O O O',['2','3','4'],1),
  q(91,'counting',1,'What is 1 + 0?','Wat is 1 + 0?','Kuyini 1 + 0?','Yintoni 1 + 0?','1 + 0 ke bokae?',['0','1','2'],1),
  q(92,'counting',2,'What is 4 + 3?','Wat is 4 + 3?','Kuyini 4 + 3?','Yintoni 4 + 3?','4 + 3 ke bokae?',['6','7','8'],1),
  q(93,'counting',2,'What is 10 - 1?','Wat is 10 - 1?','Kuyini 10 - 1?','Yintoni 10 - 1?','10 - 1 ke bokae?',['8','9','10'],1),
  q(94,'counting',1,'How many legs does a chair have?','Hoeveel bene het \'n stoel?','Isitulo sinezinyawo ezingaki?','Isitulo sinamilenze emingaphi?','Setulo se na le maoto a makae?',['2','3','4'],2),
  q(95,'counting',2,'What is 3 + 3?','Wat is 3 + 3?','Kuyini 3 + 3?','Yintoni 3 + 3?','3 + 3 ke bokae?',['5','6','7'],1),
  q(96,'counting',1,'How many wheels does a bicycle have?','Hoeveel wiele het \'n fiets?','Ibhayisikili linamasondo amangaki?','Ibhayisekile inamasondo amangaphi?','Baesekele e na le maotwana a makae?',['1','2','4'],1),
  q(97,'counting',2,'What is 6 + 2?','Wat is 6 + 2?','Kuyini 6 + 2?','Yintoni 6 + 2?','6 + 2 ke bokae?',['7','8','9'],1),
  q(98,'counting',1,'What comes after 9?','Wat kom na 9?','Kuyini okuza ngemva kuka-9?','Yintoni eza emva kwe-9?','Ho tla eng ka mora 9?',['8','10','11'],1),
  q(99,'counting',2,'How many sides does a triangle have?','Hoeveel sye het \'n driehoek?','Unhlangothi lungaki unxantathu?','Macala mangaphi ujongilanga?','Ntlha tse kae kgutlotharo?',['2','3','4'],1),
  q(100,'counting',2,'How many sides does a square have?','Hoeveel sye het \'n vierkant?','Unhlangothi lungaki isikwele?','Macala mangaphi isikwere?','Ntlha tse kae sekwere?',['3','4','5'],1),
  q(101,'counting',1,'What is 0 + 0?','Wat is 0 + 0?','Kuyini 0 + 0?','Yintoni 0 + 0?','0 + 0 ke bokae?',['0','1','2'],0),
  q(102,'counting',2,'What is 5 - 2?','Wat is 5 - 2?','Kuyini 5 - 2?','Yintoni 5 - 2?','5 - 2 ke bokae?',['2','3','4'],1),
  q(103,'counting',2,'What is 7 + 3?','Wat is 7 + 3?','Kuyini 7 + 3?','Yintoni 7 + 3?','7 + 3 ke bokae?',['9','10','11'],1),
  q(104,'counting',1,'How many toes on one foot?','Hoeveel tone op een voet?','Zingaki izinzwane onyaweni olulodwa?','Zingaphi iinzwane kunyawo olunye?','Menwana e mekae leotong le le leng?',['4','5','10'],1),
  q(105,'counting',2,'What is 8 - 3?','Wat is 8 - 3?','Kuyini 8 - 3?','Yintoni 8 - 3?','8 - 3 ke bokae?',['4','5','6'],1),
];

// ===== COLOURS (35) =====
const COLOURS: TriviaQuestion[] = [
  q(106,'colours',1,'What colour is the sky?','Watter kleur is die lug?','Ngowani umbala wesibhakabhaka?','Ngowuphi umbala wesibhakabhaka?','Lehodimo le na le mmala ofe?',['Red','Blue','Green'],1),
  q(107,'colours',1,'What colour is grass?','Watter kleur is gras?','Ngowani umbala wotshani?','Ngowuphi umbala wengca?','Jwang bo na le mmala ofe?',['Blue','Yellow','Green'],2),
  q(108,'colours',1,'What colour is the sun?','Watter kleur is die son?','Ngowani umbala welanga?','Ngowuphi umbala welanga?','Letsatsi le na le mmala ofe?',['Yellow','Blue','Green'],0),
  q(109,'colours',1,'What colour is a tomato?','Watter kleur is \'n tamatie?','Ngowani umbala wetamatisi?','Ngowuphi umbala yetumato?','Tamati e na le mmala ofe?',['Green','Red','Blue'],1),
  q(110,'colours',1,'What colour is snow?','Watter kleur is sneeu?','Ngowani umbala weqhwa?','Ngowuphi umbala wekhephu?','Lehlwa le na le mmala ofe?',['White','Blue','Grey'],0),
  q(111,'colours',1,'What colour is a banana?','Watter kleur is \'n piesang?','Ngowani umbala webhanana?','Ngowuphi umbala webhanana?','Banana e na le mmala ofe?',['Red','Green','Yellow'],2),
  q(112,'colours',1,'What colour is an orange?','Watter kleur is \'n lemoen?','Ngowani umbala we-orenji?','Ngowuphi umbala we-orenji?','Lamunu e na le mmala ofe?',['Orange','Purple','Blue'],0),
  q(113,'colours',1,'What colour is chocolate?','Watter kleur is sjokolade?','Ngowani umbala weshokoledi?','Ngowuphi umbala wetshokolethi?','Chokoleiti e na le mmala ofe?',['White','Brown','Red'],1),
  q(114,'colours',2,'Mix red and blue to get...?','Meng rooi en blou om te kry?','Hlanganisa okubomvu nokuluhlaza uthole?','Xuba ubomvu neblowu ufumane?','Kopanya khubedu le bolou ho fumana?',['Green','Purple','Orange'],1),
  q(115,'colours',2,'Mix red and yellow to get...?','Meng rooi en geel om te kry?','Hlanganisa okubomvu nokuphezi uthole?','Xuba ubomvu nomthubi ufumane?','Kopanya khubedu le mosehla ho fumana?',['Purple','Green','Orange'],2),
  q(116,'colours',2,'Mix blue and yellow to get...?','Meng blou en geel om te kry?','Hlanganisa okuluhlaza nokuphezi uthole?','Xuba iblowu nomthubi ufumane?','Kopanya bolou le mosehla ho fumana?',['Purple','Orange','Green'],2),
  q(117,'colours',1,'What colour is a fire truck?','Watter kleur is \'n brandweerwa?','Ngowani umbala wemoto yomlilo?','Ngowuphi umbala wemoto yomlilo?','Koloi ya mollo e na le mmala ofe?',['Blue','Red','Green'],1),
  q(118,'colours',1,'What colour are leaves?','Watter kleur is blare?','Ngowani umbala wamaqabunga?','Ngowuphi umbala wamagqabi?','Mahlaku a na le mmala ofe?',['Brown','Yellow','Green'],2),
  q(119,'colours',1,'What colour is the sea?','Watter kleur is die see?','Ngowani umbala wolwandle?','Ngowuphi umbala wolwandle?','Lewatle le na le mmala ofe?',['Red','Green','Blue'],2),
  q(120,'colours',1,'What colour is a lemon?','Watter kleur is \'n suurlemoen?','Ngowani umbala welamula?','Ngowuphi umbala welamuni?','Lamunu e na le mmala ofe?',['Yellow','Green','Red'],0),
  q(121,'colours',2,'All rainbow colours make...?','Alle reenboog kleure maak...?','Yonke imibala yothingo yenza...?','Yonke imibala yomnyama yenza...?','Mebala yohle ya mookodi e etsa...?',['Black','White','Grey'],1),
  q(122,'colours',1,'What colour is a pig?','Watter kleur is \'n vark?','Ngowani umbala wengulube?','Ngowuphi umbala yehagu?','Kolobe e na le mmala ofe?',['Blue','Pink','Green'],1),
  q(123,'colours',1,'What colour is coal?','Watter kleur is steenkool?','Ngowani umbala wamalahle?','Ngowuphi umbala wamalahle?','Mashala a na le mmala ofe?',['White','Black','Brown'],1),
  q(124,'colours',2,'How many colours in a rainbow?','Hoeveel kleure in \'n reenboog?','Mingaki imibala othingweni?','Mingaphi imibala emnyameni?','Mebala e mekae ka mookodi?',['5','7','10'],1),
  q(125,'colours',1,'What colour is a cloud?','Watter kleur is \'n wolk?','Ngowani umbala wefu?','Ngowuphi umbala welifu?','Leru le na le mmala ofe?',['Blue','White','Green'],1),
  q(126,'colours',1,'What colour is milk?','Watter kleur is melk?','Ngowani umbala wobisi?','Ngowuphi umbala wobisi?','Lebese le na le mmala ofe?',['Yellow','White','Blue'],1),
  q(127,'colours',2,'What colour is a flamingo?','Watter kleur is \'n flamink?','Ngowani umbala weflamingo?','Ngowuphi umbala weflamingo?','Flamingo e na le mmala ofe?',['Blue','Green','Pink'],2),
  q(128,'colours',1,'What colour is dirt?','Watter kleur is grond?','Ngowani umbala wenhlabathi?','Ngowuphi umbala womhlaba?','Mobu o na le mmala ofe?',['Green','Brown','White'],1),
  q(129,'colours',2,'What colour is a grape?','Watter kleur is \'n druif?','Ngowani umbala wegreyiphu?','Ngowuphi umbala wediliya?','Morara o na le mmala ofe?',['Orange','Red','Purple'],2),
  q(130,'colours',1,'What colour is a carrot?','Watter kleur is \'n wortel?','Ngowani umbala wekhrothi?','Ngowuphi umbala wekhrothi?','Karote e na le mmala ofe?',['Orange','Green','Yellow'],0),
  q(131,'colours',1,'What colour is a frog?','Watter kleur is \'n padda?','Ngowani umbala wexoxo?','Ngowuphi umbala wesele?','Segwagwa se na le mmala ofe?',['Red','Blue','Green'],2),
  q(132,'colours',2,'What colour is lavender?','Watter kleur is laventel?','Ngowani umbala welavenda?','Ngowuphi umbala welavenda?','Lavenda e na le mmala ofe?',['Red','Purple','Yellow'],1),
  q(133,'colours',1,'What colour is a stop sign?','Watter kleur is \'n stopteken?','Ngowani umbala wophawu lokumisa?','Ngowuphi umbala wophawu lokumisa?','Letshwao la ho emisa le na le mmala ofe?',['Green','Red','Blue'],1),
  q(134,'colours',2,'What colour is charcoal?','Watter kleur is houtskool?','Ngowani umbala wesikhuni?','Ngowuphi umbala wamalahle omthi?','Mashala a patsi a na le mmala ofe?',['White','Grey','Black'],2),
  q(135,'colours',1,'What colour is a strawberry?','Watter kleur is \'n aarbei?','Ngowani umbala westrobheri?','Ngowuphi umbala westrobheri?','Strawberry e na le mmala ofe?',['Blue','Green','Red'],2),
  q(136,'colours',2,'What colour is gold?','Watter kleur is goud?','Ngowani umbala wegolide?','Ngowuphi umbala wegolide?','Gauta e na le mmala ofe?',['Silver','Yellow / Gold','Green'],1),
  q(137,'colours',1,'What colour is watermelon inside?','Watter kleur is \'n waatlemoen binne?','Ngowani umbala wekhabe ngaphakathi?','Ngowuphi umbala wewathameloni?','Mmala wa hara lehapi ke ofe?',['Green','Yellow','Red'],2),
  q(138,'colours',2,'What are the warm colours?','Wat is die warm kleure?','Yimiphi imibala efudumele?','Yeyiphi imibala efudumeleyo?','Mebala e futhumetseng ke efe?',['Blue, green, purple','Red, orange, yellow','Black, white, grey'],1),
  q(139,'colours',1,'What colour is an eggplant?','Watter kleur is \'n eiervrug?','Ngowani umbala we-eggplant?','Ngowuphi umbala we-eggplant?','Biringanya e na le mmala ofe?',['Green','Purple','Red'],1),
  q(140,'colours',1,'What colour is honey?','Watter kleur is heuning?','Ngowani umbala woju?','Ngowuphi umbala wobusi?','Mahe a dinotshi a na le mmala ofe?',['White','Yellow / Gold','Green'],1),
];

// ===== LETTERS (35) =====
const LETTERS: TriviaQuestion[] = [
  q(141,'letters',1,'What letter does "Apple" start with?','Met watter letter begin "Apple"?','Iqala ngayiphi inhlamvu "Apple"?','Iqala ngeyiphi ileta "Apple"?','Tlhaku efe "Apple" e qalang ka yona?',['B','C','A'],2),
  q(142,'letters',1,'What letter does "Ball" start with?','Met watter letter begin "Ball"?','Iqala ngayiphi inhlamvu "Ball"?','Iqala ngeyiphi ileta "Ball"?','Tlhaku efe "Ball" e qalang ka yona?',['A','B','C'],1),
  q(143,'letters',1,'What letter does "Cat" start with?','Met watter letter begin "Cat"?','Iqala ngayiphi inhlamvu "Cat"?','Iqala ngeyiphi ileta "Cat"?','Tlhaku efe "Cat" e qalang ka yona?',['A','B','C'],2),
  q(144,'letters',1,'What letter does "Dog" start with?','Met watter letter begin "Dog"?','Iqala ngayiphi inhlamvu "Dog"?','Iqala ngeyiphi ileta "Dog"?','Tlhaku efe "Dog" e qalang ka yona?',['B','D','F'],1),
  q(145,'letters',1,'What letter does "Elephant" start with?','Met watter letter begin "Elephant"?','Iqala ngayiphi inhlamvu "Elephant"?','Iqala ngeyiphi ileta "Elephant"?','Tlhaku efe "Elephant" e qalang ka yona?',['D','E','F'],1),
  q(146,'letters',1,'What letter does "Fish" start with?','Met watter letter begin "Fish"?','Iqala ngayiphi inhlamvu "Fish"?','Iqala ngeyiphi ileta "Fish"?','Tlhaku efe "Fish" e qalang ka yona?',['E','G','F'],2),
  q(147,'letters',1,'What letter does "Giraffe" start with?','Met watter letter begin "Giraffe"?','Iqala ngayiphi inhlamvu "Giraffe"?','Iqala ngeyiphi ileta "Giraffe"?','Tlhaku efe "Giraffe" e qalang ka yona?',['F','G','H'],1),
  q(148,'letters',1,'What letter does "House" start with?','Met watter letter begin "House"?','Iqala ngayiphi inhlamvu "House"?','Iqala ngeyiphi ileta "House"?','Tlhaku efe "House" e qalang ka yona?',['G','I','H'],2),
  q(149,'letters',1,'What letter does "Ice" start with?','Met watter letter begin "Ice"?','Iqala ngayiphi inhlamvu "Ice"?','Iqala ngeyiphi ileta "Ice"?','Tlhaku efe "Ice" e qalang ka yona?',['H','I','J'],1),
  q(150,'letters',1,'What letter does "Jump" start with?','Met watter letter begin "Jump"?','Iqala ngayiphi inhlamvu "Jump"?','Iqala ngeyiphi ileta "Jump"?','Tlhaku efe "Jump" e qalang ka yona?',['I','K','J'],2),
  q(151,'letters',1,'What letter does "King" start with?','Met watter letter begin "King"?','Iqala ngayiphi inhlamvu "King"?','Iqala ngeyiphi ileta "King"?','Tlhaku efe "King" e qalang ka yona?',['J','K','L'],1),
  q(152,'letters',1,'What letter does "Lion" start with?','Met watter letter begin "Lion"?','Iqala ngayiphi inhlamvu "Lion"?','Iqala ngeyiphi ileta "Lion"?','Tlhaku efe "Lion" e qalang ka yona?',['K','M','L'],2),
  q(153,'letters',1,'What letter does "Mango" start with?','Met watter letter begin "Mango"?','Iqala ngayiphi inhlamvu "Mango"?','Iqala ngeyiphi ileta "Mango"?','Tlhaku efe "Mango" e qalang ka yona?',['L','M','N'],1),
  q(154,'letters',1,'What letter does "Nest" start with?','Met watter letter begin "Nest"?','Iqala ngayiphi inhlamvu "Nest"?','Iqala ngeyiphi ileta "Nest"?','Tlhaku efe "Nest" e qalang ka yona?',['M','O','N'],2),
  q(155,'letters',2,'What letter comes after A?','Watter letter kom na A?','Iyiphi inhlamvu eza ngemva kuka-A?','Yeyiphi ileta eza emva kwe-A?','Tlhaku efe e tlang ka mora A?',['C','B','D'],1),
  q(156,'letters',2,'What letter comes after M?','Watter letter kom na M?','Iyiphi inhlamvu eza ngemva kuka-M?','Yeyiphi ileta eza emva kwe-M?','Tlhaku efe e tlang ka mora M?',['L','O','N'],2),
  q(157,'letters',1,'What letter does "Sun" start with?','Met watter letter begin "Sun"?','Iqala ngayiphi inhlamvu "Sun"?','Iqala ngeyiphi ileta "Sun"?','Tlhaku efe "Sun" e qalang ka yona?',['R','S','T'],1),
  q(158,'letters',1,'What letter does "Tree" start with?','Met watter letter begin "Tree"?','Iqala ngayiphi inhlamvu "Tree"?','Iqala ngeyiphi ileta "Tree"?','Tlhaku efe "Tree" e qalang ka yona?',['S','U','T'],2),
  q(159,'letters',1,'What letter does "Umbrella" start with?','Met watter letter begin "Umbrella"?','Iqala ngayiphi inhlamvu "Umbrella"?','Iqala ngeyiphi ileta "Umbrella"?','Tlhaku efe "Umbrella" e qalang ka yona?',['T','U','V'],1),
  q(160,'letters',1,'What letter does "Water" start with?','Met watter letter begin "Water"?','Iqala ngayiphi inhlamvu "Water"?','Iqala ngeyiphi ileta "Water"?','Tlhaku efe "Water" e qalang ka yona?',['V','X','W'],2),
  q(161,'letters',1,'What letter does "Zebra" start with?','Met watter letter begin "Zebra"?','Iqala ngayiphi inhlamvu "Zebra"?','Iqala ngeyiphi ileta "Zebra"?','Tlhaku efe "Zebra" e qalang ka yona?',['X','Y','Z'],2),
  q(162,'letters',2,'What is the first letter of the alphabet?','Wat is die eerste letter?','Iyiphi inhlamvu yokuqala?','Yeyiphi ileta yokuqala?','Tlhaku ya pele ke efe?',['B','A','C'],1),
  q(163,'letters',2,'What is the last letter of the alphabet?','Wat is die laaste letter?','Iyiphi inhlamvu yokugcina?','Yeyiphi ileta yokugqibela?','Tlhaku ya ho qetela ke efe?',['X','Y','Z'],2),
  q(164,'letters',1,'What letter does "Rainbow" start with?','Met watter letter begin "Rainbow"?','Iqala ngayiphi inhlamvu "Rainbow"?','Iqala ngeyiphi ileta "Rainbow"?','Tlhaku efe "Rainbow" e qalang ka yona?',['P','Q','R'],2),
  q(165,'letters',1,'What letter does "Orange" start with?','Met watter letter begin "Orange"?','Iqala ngayiphi inhlamvu "Orange"?','Iqala ngeyiphi ileta "Orange"?','Tlhaku efe "Orange" e qalang ka yona?',['N','O','P'],1),
  q(166,'letters',1,'What letter does "Pencil" start with?','Met watter letter begin "Pencil"?','Iqala ngayiphi inhlamvu "Pencil"?','Iqala ngeyiphi ileta "Pencil"?','Tlhaku efe "Pencil" e qalang ka yona?',['O','Q','P'],2),
  q(167,'letters',2,'How many letters in the alphabet?','Hoeveel letters in die alfabet?','Zingaki izinhlamvu ze-alfabhethi?','Zingaphi iileta ze-alfabhethi?','Ditlhaku tse kae ka alfebete?',['24','26','28'],1),
  q(168,'letters',1,'What letter does "Queen" start with?','Met watter letter begin "Queen"?','Iqala ngayiphi inhlamvu "Queen"?','Iqala ngeyiphi ileta "Queen"?','Tlhaku efe "Queen" e qalang ka yona?',['P','R','Q'],2),
  q(169,'letters',2,'What letter comes before C?','Watter letter kom voor C?','Iyiphi inhlamvu engaphambi kuka-C?','Yeyiphi ileta ephambi kwe-C?','Tlhaku efe e tlang pele ho C?',['A','B','D'],1),
  q(170,'letters',1,'What letter does "Violin" start with?','Met watter letter begin "Violin"?','Iqala ngayiphi inhlamvu "Violin"?','Iqala ngeyiphi ileta "Violin"?','Tlhaku efe "Violin" e qalang ka yona?',['U','V','W'],1),
  q(171,'letters',1,'What letter does "Xylophone" start with?','Met watter letter begin "Xylophone"?','Iqala ngayiphi inhlamvu "Xylophone"?','Iqala ngeyiphi ileta "Xylophone"?','Tlhaku efe "Xylophone" e qalang ka yona?',['W','Y','X'],2),
  q(172,'letters',2,'Which vowel is in "Cat"?','Watter klinker is in "Cat"?','Yikuphi ukwehluka oku ku "Cat"?','Yeyiphi ivaweli ekwi "Cat"?','Vowele efe e ka "Cat"?',['E','A','O'],1),
  q(173,'letters',1,'What letter does "Yo-yo" start with?','Met watter letter begin "Yo-yo"?','Iqala ngayiphi inhlamvu "Yo-yo"?','Iqala ngeyiphi ileta "Yo-yo"?','Tlhaku efe "Yo-yo" e qalang ka yona?',['X','Z','Y'],2),
  q(174,'letters',2,'Which are vowels?','Watter letters is klinkers?','Yiziphi izinkamisa?','Zeziphi iivaweli?','Divowele ke dife?',['B, C, D','A, E, I, O, U','F, G, H'],1),
  q(175,'letters',1,'What letter does "Kite" start with?','Met watter letter begin "Kite"?','Iqala ngayiphi inhlamvu "Kite"?','Iqala ngeyiphi ileta "Kite"?','Tlhaku efe "Kite" e qalang ka yona?',['J','L','K'],2),
];

// ===== COMMUNITY (35) =====
const COMMUNITY: TriviaQuestion[] = [
  q(176,'community',1,'What do we say when someone helps us?','Wat se ons as iemand ons help?','Sithini uma umuntu esisiza?','Sithini xa umntu esinceda?','Re reng ha motho a re thusa?',['Sorry','Thank you','Hello'],1),
  q(177,'community',1,'What do we say when we bump into someone?','Wat se ons as ons teen iemand stamp?','Sithini uma sishayisa umuntu?','Sithini xa singqubana nomntu?','Re reng ha re thulana le motho?',['Thank you','Sorry','Hello'],1),
  q(178,'community',1,'What do we say in the morning?','Wat se ons in die oggend?','Sithini ekuseni?','Sithini kusasa?','Re reng hoseng?',['Good night','Good morning','Goodbye'],1),
  q(179,'community',1,'What if a friend is sad?','Wat doen jy as \'n vriend hartseer is?','Wenzani uma umngane udangele?','Wenza ntoni xa umhlobo edangele?','O etsa eng ha motswalle a hloname?',['Laugh at them','Be kind and help','Walk away'],1),
  q(180,'community',1,'What is sharing?','Wat is deel?','Ukwabelana kuyini?','Ukwabelana kuyintoni?','Ho arolelana ke eng?',['Taking everything','Giving some to others','Hiding things'],1),
  q(181,'community',1,'Where do we learn together?','Waar leer ons saam?','Sifunda kuphi ndawonye?','Sifunda phi kunye?','Re ithuta kae mmoho?',['At the shop','At school','In the car'],1),
  q(182,'community',1,'Who helps us at school?','Wie help ons by die skool?','Ubani osisiza esikoleni?','Ngubani osincedayo esikolweni?','Mang ya re thusang sekolong?',['The chef','The teacher','The driver'],1),
  q(183,'community',1,'What do we do when someone talks?','Wat doen ons as iemand praat?','Senza ntoni uma umuntu ekhuluma?','Senza ntoni xa umntu ethetha?','Re etsa eng ha motho a bua?',['Shout','Listen','Run away'],1),
  q(184,'community',1,'How do we greet people?','Hoe groet ons mense?','Sibingelela kanjani abantu?','Sibulisa njani abantu?','Re dumedisa batho jwang?',['Ignore them','Say hello nicely','Turn away'],1),
  q(185,'community',2,'What does a community do?','Wat doen \'n gemeenskap?','Umphakathi wenzani?','Uluntu lwenza ntoni?','Setjhaba se etsa eng?',['Fight','Help each other','Hide'],1),
  q(186,'community',1,'What do we say at bedtime?','Wat se ons voor slaaptyd?','Sithini ngokulala?','Sithini ngexesha lokulala?','Re reng ha re robala?',['Good morning','Good night','Thank you'],1),
  q(187,'community',1,'What should we do with litter?','Wat moet ons met rommel doen?','Kufanele senze ntoni ngodoti?','Kufanele senze ntoni ngenkunkuma?','Re lokela ho etsa eng ka ditshila?',['Throw on the ground','Put it in the bin','Hide it'],1),
  q(188,'community',2,'Why do we take turns?','Hoekom neem ons beurte?','Kungani sishintshana?','Kutheni sitshintshana?','Ke hobaneng ha re tshintshana?',['Because we must','So everyone gets a chance','To be slow'],1),
  q(189,'community',1,'What do we say before eating?','Wat se ons voor eet?','Sithini ngaphambi kokudla?','Sithini ngaphambi kokutya?','Re reng pele re ja?',['Goodbye','Please / Thank you','Sorry'],1),
  q(190,'community',1,'Who keeps us safe at home?','Wie hou ons veilig by die huis?','Ubani osigcina siphephile ekhaya?','Ngubani osigcina sikhuselekile?','Mang ya re bolokang re le hae?',['Strangers','Our family','Nobody'],1),
  q(191,'community',2,'What is kindness?','Wat is vriendelikheid?','Umusa kuyini?','Ububele kuyintoni?','Mosa ke eng?',['Being mean','Being nice to others','Being alone'],1),
  q(192,'community',1,'How do we show we care?','Hoe wys ons ons gee om?','Sibonisa kanjani ukuthi sinendaba?','Sibonisa njani ukuba sikhathalele?','Re bontsha jwang hore re kgathalela?',['Ignore people','Help and share','Be angry'],1),
  q(193,'community',1,'What makes a good friend?','Wat maak \'n goeie vriend?','Yini eyenza umngane omuhle?','Yintoni eyenza umhlobo olungileyo?','Eng e etsang motswalle o motle?',['Someone mean','Someone who shares and cares','Someone who takes things'],1),
  q(194,'community',2,'Why is teamwork important?','Hoekom is spanwerk belangrik?','Kungani ukusebenza ndawonye kubalulekile?','Kutheni ukusebenza njengeqela kubalulekile?','Ke hobaneng ha ho sebetsa mmoho ho le bohlokwa?',['It is not','We can do more together','To be alone'],1),
  q(195,'community',1,'What do community helpers do?','Wat doen helpers in ons gemeenskap?','Abasizi emphakathini benzani?','Abancedi kuluntu benza ntoni?','Bathusi setjhabeng ba etsa eng?',['Sleep all day','Help keep everyone safe','Play games'],1),
  q(196,'community',1,'What if someone is alone?','Wat doen ons as iemand alleen is?','Senzani uma sibona umuntu eyedwa?','Senza ntoni xa sibona umntu eyedwa?','Re etsa eng ha motho a le mong?',['Ignore them','Invite them to play','Laugh'],1),
  q(197,'community',2,'What is respect?','Wat is respek?','Inhlonipho iyini?','Intlonipho yintoni?','Hlompho ke eng?',['Being loud','Treating others well','Taking things'],1),
  q(198,'community',1,'How do we keep school clean?','Hoe hou ons ons skool skoon?','Sigcina kanjani isikole sihlanzekile?','Sigcina njani isikolo sicocekile?','Re boloka sekolo se hloekile jwang?',['Throw things everywhere','Pick up litter','Break things'],1),
  q(199,'community',1,'What do we do on the playground?','Wat doen ons op die speelgrond?','Senzani esigangeni sokudlala?','Senza ntoni ebaleni lokudlala?','Re etsa eng lebaleng la ho bapala?',['Fight','Play together nicely','Sit alone'],1),
  q(200,'community',2,'What is Ubuntu?','Wat is Ubuntu?','Yini Ubuntu?','Yintoni Ubuntu?','Ubuntu ke eng?',['Being alone','I am because we are','Being rich'],1),
  q(201,'community',1,'What do we say when we want something?','Wat se ons as ons iets wil he?','Sithini uma sifuna into?','Sithini xa sifuna into?','Re reng ha re batla ntho?',['Give it now!','Please','Go away'],1),
  q(202,'community',2,'Why do we help neighbours?','Hoekom help ons ons bure?','Kungani sisiza omakhelwane?','Kutheni sinceda abamelwane?','Ke hobaneng ha re thusa baahisane?',['We must','We care about each other','For money'],1),
  q(203,'community',1,'What do firefighters do?','Wat doen brandweermanne?','Abacishi mlilo benzani?','Abacimi-mlilo benza ntoni?','Batimollodi ba etsa eng?',['Cook food','Put out fires and help','Drive fast'],1),
  q(204,'community',1,'What do nurses do?','Wat doen verpleegsters?','Abahlengikazi benzani?','Abongikazi benza ntoni?','Baoki ba etsa eng?',['Cook food','Help sick people get better','Build houses'],1),
  q(205,'community',2,'How can we help at home?','Hoe kan ons by die huis help?','Singasiza kanjani ekhaya?','Singanceda njani ekhaya?','Re ka thusa jwang hae?',['Do nothing','Tidy up and help cook','Watch TV all day'],1),
  q(206,'community',1,'What do we do for a birthday?','Wat doen ons vir \'n verjaarsdag?','Senzani uma kulilanga lokuzalwa?','Senza ntoni xa kusuku lokuzalwa?','Re etsa eng ka letsatsi la tswalo?',['Ignore them','Celebrate and say happy birthday','Be sad'],1),
  q(207,'community',2,'What is a library for?','Waarvoor is \'n biblioteek?','Ithala lezincwadi lenzelwe ntoni?','Ithala leencwadi lenzelwe ntoni?','Laeborari e entswe eng?',['Sleeping','Reading and learning','Running'],1),
  q(208,'community',1,'What do police officers do?','Wat doen polisiebeamptes?','Amaphoyisa enzani?','Amapolisa enza ntoni?','Mapolesa a etsa eng?',['Cook food','Keep people safe','Build roads'],1),
  q(209,'community',2,'Why do we celebrate together?','Hoekom vier ons saam?','Kungani sigubha ndawonye?','Kutheni sibhiyozela kunye?','Ke hobaneng ha re keteka mmoho?',['We have to','It brings us joy and closeness','To be loud'],1),
  q(210,'community',1,'What should we do every day?','Wat moet ons elke dag doen?','Kufanele senzeni nsuku zonke?','Kufanele senze ntoni yonke imihla?','Re lokela ho etsa eng letsatsi le leng?',['Sleep all day','Be kind and helpful','Be angry'],1),
];

/** All 210 questions */
export const QUESTIONS: TriviaQuestion[] = [
  ...ANIMALS, ...CULTURES, ...COUNTING, ...COLOURS, ...LETTERS, ...COMMUNITY,
];

/** Get questions filtered by category */
export function getQuestionsByCategory(cat: TriviaCategory): TriviaQuestion[] {
  return QUESTIONS.filter((q) => q.category === cat);
}

/** Get a random subset of questions */
export function getRandomQuestions(count: number, category?: TriviaCategory): TriviaQuestion[] {
  const pool = category ? getQuestionsByCategory(category) : [...QUESTIONS];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
