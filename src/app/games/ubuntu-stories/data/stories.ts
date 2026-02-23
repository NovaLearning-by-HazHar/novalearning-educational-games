/**
 * Ubuntu Stories — Story data for 2 narrative chapters.
 * Each story has chapters with clues (literacy, numeracy, life skills),
 * dialogue in 5 languages, and a community solution.
 */

export type LangCode = 'en' | 'af' | 'zu' | 'xh' | 'st';
export type ClueType = 'literacy' | 'numeracy' | 'life-skills';
export type StepType = 'intro' | 'clue' | 'solution' | 'celebration';

export interface TranslatedText {
  en: string;
  af: string;
  zu: string;
  xh: string;
  st: string;
}

export interface MiniTaskOption {
  label: string;
  correct: boolean;
}

export interface MiniTask {
  prompt: TranslatedText;
  options: MiniTaskOption[];
}

export interface StoryClue {
  id: string;
  type: ClueType;
  emoji: string;
  title: TranslatedText;
  narrative: TranslatedText;
  task: MiniTask;
}

export interface StoryStep {
  id: string;
  type: StepType;
  speaker: string;
  speakerEmoji: string;
  dialogue: TranslatedText;
  clue?: StoryClue;
}

export interface StoryChapter {
  id: string;
  title: TranslatedText;
  steps: StoryStep[];
}

export interface Story {
  id: string;
  title: TranslatedText;
  theme: string;
  emoji: string;
  description: TranslatedText;
  characters: string[];
  chapters: StoryChapter[];
}

export const STORIES: Story[] = [
  {
    id: 'missing-rain',
    title: {
      en: 'The Missing Rain',
      af: 'Die Vermiste Reen',
      zu: 'Imvula Elahlekile',
      xh: 'Imvula Elahlekileyo',
      st: 'Pula e Timetseng',
    },
    theme: 'water-environment',
    emoji: '\uD83C\uDF27\uFE0F',
    description: {
      en: 'The village garden is dry! Help the community find clues to bring the rain back.',
      af: 'Die dorpstuin is droog! Help die gemeenskap om leidrade te vind om die reen terug te bring.',
      zu: 'Isivande somuzi somile! Siza umphakathi uthole izimpawu zokubuyisa imvula.',
      xh: 'Igadi yedolophana yomile! Nceda uluntu ufumane iimpawu zokubuyisa imvula.',
      st: 'Jarete ea motse e omile! Thusa setjhaba ho fumana lipontso tsa ho kgutlisa pula.',
    },
    characters: ['gogo_thandi', 'sipho', 'amahle'],
    chapters: [
      {
        id: 'mr-ch1',
        title: {
          en: 'A Dry Morning',
          af: '\'n Droe Oggend',
          zu: 'Ukusa Okomile',
          xh: 'Ukusa Okomileyo',
          st: 'Hoseng e Omileng',
        },
        steps: [
          {
            id: 'mr-ch1-intro',
            type: 'intro',
            speaker: 'Gogo Thandi',
            speakerEmoji: '\uD83D\uDC75',
            dialogue: {
              en: 'Good morning, children! Look at our garden. The plants are thirsty. We need to find out why the rain has not come.',
              af: 'Goeie more, kinders! Kyk na ons tuin. Die plante is dors. Ons moet uitvind waarom die reen nie gekom het nie.',
              zu: 'Sawubona, bantwana! Bhekani isivande sethu. Izitshalo zomile. Kufanele sithole ukuthi imvula ihambele phi.',
              xh: 'Molo, bantwana! Jongani igadi yethu. Izityalo zinxaniwe. Kufuneka sifumanise ukuba imvula iye phi.',
              st: 'Dumela, bana! Shebang jarete ea rona. Limela li nyoriloe. Re tlameha ho fumana hore na pula e ile kae.',
            },
          },
          {
            id: 'mr-ch1-clue1',
            type: 'clue',
            speaker: 'Sipho',
            speakerEmoji: '\uD83D\uDC66',
            dialogue: {
              en: 'Gogo, I found a clue! There is a word on this stone. Can you help me read it?',
              af: 'Gogo, ek het \'n leidraad gevind! Daar is \'n woord op hierdie klip. Kan jy my help om dit te lees?',
              zu: 'Gogo, ngithole umkhondo! Kukhona igama kuleli tshe. Ungangisiza ukulifunda?',
              xh: 'Gogo, ndifumene umkhondo! Kukho igama kweli litye. Ungandinceda ukulifunda?',
              st: 'Gogo, ke fumane pontso! Ho na le lentsoe letlapeng lena. U ka nthusa ho le bala?',
            },
            clue: {
              id: 'mr-clue-literacy',
              type: 'literacy',
              emoji: '\uD83D\uDCDA',
              title: {
                en: 'Find the Letter',
                af: 'Vind die Letter',
                zu: 'Thola Uhlamvu',
                xh: 'Fumana Unobumba',
                st: 'Fumana Tlhaku',
              },
              narrative: {
                en: 'The stone says: "Water starts with..." Find the letter W!',
                af: 'Die klip se: "Water begin met..." Vind die letter W!',
                zu: 'Itshe lithi: "Amanzi aqala ngo..." Thola uhlamvu A!',
                xh: 'Ilitye lithi: "Amanzi aqala ngo..." Fumana unobumba A!',
                st: 'Lejoe le re: "Metsi a qala ka..." Fumana tlhaku M!',
              },
              task: {
                prompt: {
                  en: 'Which letter does "Water" start with?',
                  af: 'Met watter letter begin "Water"?',
                  zu: 'Aqala ngaluphi uhlamvu "Amanzi"?',
                  xh: 'Aqala ngoluphi unobumba "Amanzi"?',
                  st: 'A qala ka tlhaku efe "Metsi"?',
                },
                options: [
                  { label: 'B', correct: false },
                  { label: 'W', correct: true },
                  { label: 'R', correct: false },
                  { label: 'S', correct: false },
                ],
              },
            },
          },
          {
            id: 'mr-ch1-clue2',
            type: 'clue',
            speaker: 'Amahle',
            speakerEmoji: '\uD83D\uDC67',
            dialogue: {
              en: 'Look! I can see drops on the leaves. Let me count them!',
              af: 'Kyk! Ek kan druppels op die blare sien. Laat ek hulle tel!',
              zu: 'Bhekani! Ngibona amathonsi emaqabungeni. Ake ngiwabale!',
              xh: 'Jongani! Ndibona amathontsi kumagqabi. Mandiwabale!',
              st: 'Shebang! Ke bona marotholi mahlakung. Ke tla a bala!',
            },
            clue: {
              id: 'mr-clue-numeracy',
              type: 'numeracy',
              emoji: '\uD83D\uDCA7',
              title: {
                en: 'Count the Drops',
                af: 'Tel die Druppels',
                zu: 'Bala Amathonsi',
                xh: 'Bala Amathontsi',
                st: 'Bala Marotholi',
              },
              narrative: {
                en: 'There are some water drops on the leaf. Count them carefully!',
                af: 'Daar is \'n paar waterdruppels op die blaar. Tel hulle versigtig!',
                zu: 'Kukhona amathonsi amanzi eqabungeni. Wabale ngokucophelela!',
                xh: 'Kukho amathontsi amanzi egqabini. Wabale ngononophelo!',
                st: 'Ho na le marotholi a metsi lehlakung. A bale ka hloko!',
              },
              task: {
                prompt: {
                  en: 'How many drops? \uD83D\uDCA7\uD83D\uDCA7\uD83D\uDCA7',
                  af: 'Hoeveel druppels? \uD83D\uDCA7\uD83D\uDCA7\uD83D\uDCA7',
                  zu: 'Mangaki amathonsi? \uD83D\uDCA7\uD83D\uDCA7\uD83D\uDCA7',
                  xh: 'Mangaphi amathontsi? \uD83D\uDCA7\uD83D\uDCA7\uD83D\uDCA7',
                  st: 'Marotholi a makae? \uD83D\uDCA7\uD83D\uDCA7\uD83D\uDCA7',
                },
                options: [
                  { label: '2', correct: false },
                  { label: '3', correct: true },
                  { label: '5', correct: false },
                ],
              },
            },
          },
          {
            id: 'mr-ch1-clue3',
            type: 'clue',
            speaker: 'Gogo Thandi',
            speakerEmoji: '\uD83D\uDC75',
            dialogue: {
              en: 'Now we know about water. But what should our community do to help the garden?',
              af: 'Nou weet ons van water. Maar wat moet ons gemeenskap doen om die tuin te help?',
              zu: 'Manje sesiyazi ngamanzi. Kodwa umphakathi wethu kufanele wenzeni ukusiza isivande?',
              xh: 'Ngoku siyazi ngamanzi. Kodwa uluntu lwethu lufanele lwenze ntoni ukunceda igadi?',
              st: 'Joale re tseba ka metsi. Empa setjhaba sa rona se lokela ho etsa eng ho thusa jarete?',
            },
            clue: {
              id: 'mr-clue-lifeskills',
              type: 'life-skills',
              emoji: '\uD83C\uDF31',
              title: {
                en: 'What Should We Do?',
                af: 'Wat Moet Ons Doen?',
                zu: 'Kufanele Senzeni?',
                xh: 'Sifanele Senze Ntoni?',
                st: 'Re Lokela Ho Etsa Eng?',
              },
              narrative: {
                en: 'The garden needs help! What is the best thing for our community to do?',
                af: 'Die tuin het hulp nodig! Wat is die beste ding vir ons gemeenskap om te doen?',
                zu: 'Isivande sidinga usizo! Yini into engcono umphakathi wethu ongayenza?',
                xh: 'Igadi ifuna uncedo! Yintoni into engcono uluntu lwethu olunokuyenza?',
                st: 'Jarete e hloka thuso! Ke eng ntho e ntle setjhaba sa rona se ka e etsang?',
              },
              task: {
                prompt: {
                  en: 'What should the community do?',
                  af: 'Wat moet die gemeenskap doen?',
                  zu: 'Umphakathi kufanele wenzeni?',
                  xh: 'Uluntu lufanele lwenze ntoni?',
                  st: 'Setjhaba se lokela ho etsa eng?',
                },
                options: [
                  { label: '\uD83D\uDCA7 Save water together', correct: true },
                  { label: '\uD83D\uDE34 Wait and sleep', correct: false },
                  { label: '\uD83C\uDFC3 Run away', correct: false },
                ],
              },
            },
          },
          {
            id: 'mr-ch1-solution',
            type: 'solution',
            speaker: 'Gogo Thandi',
            speakerEmoji: '\uD83D\uDC75',
            dialogue: {
              en: 'Wonderful! Together we found all the clues! When we work together and save water, our garden will grow again. Ubuntu means we care for each other!',
              af: 'Wonderlik! Saam het ons al die leidrade gevind! Wanneer ons saamwerk en water spaar, sal ons tuin weer groei. Ubuntu beteken ons gee om vir mekaar!',
              zu: 'Kuhle kakhulu! Ndawonye sithole zonke izimpawu! Uma sisebenza ndawonye futhi sigcina amanzi, isivande sethu sizokhula futhi. Ubuntu kusho sinakekelana!',
              xh: 'Kuhle kakhulu! Kunye sifumene zonke iimpawu! Xa sisebenza kunye kwaye sigcina amanzi, igadi yethu iya kukhula kwakhona. Ubuntu kuthetha sikhathalela!',
              st: 'Ho molemo haholo! Mmoho re fumane lipontso tsohle! Ha re sebetsa mmoho re boloka metsi, jarete ea rona e tla hola hape. Ubuntu e bolela re hlokomelana!',
            },
          },
          {
            id: 'mr-ch1-celebrate',
            type: 'celebration',
            speaker: 'Everyone',
            speakerEmoji: '\uD83C\uDF89',
            dialogue: {
              en: 'Together we solved the mystery! The rain will come back because we learned to care for water!',
              af: 'Saam het ons die raaisel opgelos! Die reen sal terugkom want ons het geleer om vir water te sorg!',
              zu: 'Ndawonye sixazulule imfihlo! Imvula izobuya ngoba sifundile ukunakekela amanzi!',
              xh: 'Kunye sisombulule imfihlelo! Imvula iza kubuya kuba sifundile ukukhathalela amanzi!',
              st: 'Mmoho re rarollotse sephiri! Pula e tla kgutla hobane re ithutile ho hlokomela metsi!',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'market-day',
    title: {
      en: 'Market Day',
      af: 'Markdag',
      zu: 'Usuku Lwemakethe',
      xh: 'Usuku Lwemarike',
      st: 'Letsatsi la Makete',
    },
    theme: 'money-community',
    emoji: '\uD83C\uDFEA',
    description: {
      en: 'It is Market Day! Help the community set up the Rainbow Market and solve clues along the way.',
      af: 'Dit is Markdag! Help die gemeenskap om die Reenboogmark op te stel en los leidrade onderweg op.',
      zu: 'Usuku Lwemakethe! Siza umphakathi ulungise iMakethe Yothingo futhi uxazulule izimpawu endleleni.',
      xh: 'Usuku Lwemarike! Nceda uluntu ulungise iMarike yeRainbow kwaye usombulule iimpawu endleleni.',
      st: 'Letsatsi la Makete! Thusa setjhaba ho lokisa Makete ea Rainbow le ho rarolla lipontso tseleng.',
    },
    characters: ['gogo_thandi', 'jabu', 'liya'],
    chapters: [
      {
        id: 'md-ch1',
        title: {
          en: 'Setting Up the Stall',
          af: 'Die Stalletjie Opstel',
          zu: 'Ukumisa Isitolo',
          xh: 'Ukumisa Isitolo',
          st: 'Ho Hloma Lebenkele',
        },
        steps: [
          {
            id: 'md-ch1-intro',
            type: 'intro',
            speaker: 'Gogo Thandi',
            speakerEmoji: '\uD83D\uDC75',
            dialogue: {
              en: 'Today is Market Day! Jabu and Liya are going to help me set up our fruit stall. But first, we need to solve some clues!',
              af: 'Vandag is Markdag! Jabu en Liya gaan my help om ons vrugtestalletjie op te stel. Maar eers moet ons \'n paar leidrade oplos!',
              zu: 'Namuhla usuku lwemakethe! UJabu noLiya bazongisiza ukumisa isitolo sethu sezithelo. Kodwa kuqala, sidinga ukuxazulula izimpawu!',
              xh: 'Namhlanje lusuku lwemarike! UJabu noLiya baza kundinceda ukumisa isitolo sethu seziqhamo. Kodwa kuqala, sifuna ukusombulula iimpawu!',
              st: 'Kajeno ke letsatsi la makete! Jabu le Liya ba tla nthusa ho hloma lebenkele la rona la litholoana. Empa pele, re hloka ho rarolla lipontso!',
            },
          },
          {
            id: 'md-ch1-clue1',
            type: 'clue',
            speaker: 'Jabu',
            speakerEmoji: '\uD83D\uDC66',
            dialogue: {
              en: 'Gogo, the sign for our stall has a word on it! Can you help me read the first letter?',
              af: 'Gogo, die bord vir ons stalletjie het \'n woord op! Kan jy my help om die eerste letter te lees?',
              zu: 'Gogo, isibhalo sesitolo sethu sinegama! Ungangisiza ukufunda uhlamvu lokuqala?',
              xh: 'Gogo, ibhodi yesitolo sethu inegama! Ungandinceda ukufunda unobumba wokuqala?',
              st: 'Gogo, letshwao la lebenkele la rona le na le lentsoe! U ka nthusa ho bala tlhaku ea pele?',
            },
            clue: {
              id: 'md-clue-literacy',
              type: 'literacy',
              emoji: '\uD83D\uDCDA',
              title: {
                en: 'Read the Sign',
                af: 'Lees die Bord',
                zu: 'Funda Isibhalo',
                xh: 'Funda Ibhodi',
                st: 'Bala Letshwao',
              },
              narrative: {
                en: 'The sign says "Fruit". What letter does "Fruit" start with?',
                af: 'Die bord se "Vrugte". Met watter letter begin "Vrugte"?',
                zu: 'Isibhalo sithi "Izithelo". Iqala ngaluphi uhlamvu "Izithelo"?',
                xh: 'Ibhodi ithi "Iziqhamo". Iqala ngoluphi unobumba "Iziqhamo"?',
                st: 'Letshwao le re "Litholoana". E qala ka tlhaku efe "Litholoana"?',
              },
              task: {
                prompt: {
                  en: 'Which letter does "Fruit" start with?',
                  af: 'Met watter letter begin "Vrugte"?',
                  zu: 'Iqala ngaluphi uhlamvu "Izithelo"?',
                  xh: 'Iqala ngoluphi unobumba "Iziqhamo"?',
                  st: 'E qala ka tlhaku efe "Litholoana"?',
                },
                options: [
                  { label: 'F', correct: true },
                  { label: 'G', correct: false },
                  { label: 'P', correct: false },
                  { label: 'D', correct: false },
                ],
              },
            },
          },
          {
            id: 'md-ch1-clue2',
            type: 'clue',
            speaker: 'Liya',
            speakerEmoji: '\uD83D\uDC67',
            dialogue: {
              en: 'I brought apples for the stall! Let me count how many we have.',
              af: 'Ek het appels vir die stalletjie gebring! Laat ek tel hoeveel ons het.',
              zu: 'Ngilethe ama-apula esitolo! Ake ngibale ukuthi singaki.',
              xh: 'Ndizise ii-apile zesitolo! Mandibale ukuba zingaphi.',
              st: 'Ke tlisitse li-apole bakeng sa lebenkele! Ke tla bala hore na re na le tse kae.',
            },
            clue: {
              id: 'md-clue-numeracy',
              type: 'numeracy',
              emoji: '\uD83C\uDF4E',
              title: {
                en: 'Count the Apples',
                af: 'Tel die Appels',
                zu: 'Bala Ama-apula',
                xh: 'Bala Ii-apile',
                st: 'Bala Li-apole',
              },
              narrative: {
                en: 'Liya brought apples for the market. Count them!',
                af: 'Liya het appels vir die mark gebring. Tel hulle!',
                zu: 'ULiya ulethe ama-apula emakethe. Wabale!',
                xh: 'ULiya uzise ii-apile emarikeni. Zibale!',
                st: 'Liya o tlisitse li-apole maketeng. Li bale!',
              },
              task: {
                prompt: {
                  en: 'How many apples? \uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E',
                  af: 'Hoeveel appels? \uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E',
                  zu: 'Mangaki ama-apula? \uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E',
                  xh: 'Zingaphi ii-apile? \uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E',
                  st: 'Li-apole li kae? \uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E',
                },
                options: [
                  { label: '3', correct: false },
                  { label: '4', correct: true },
                  { label: '6', correct: false },
                ],
              },
            },
          },
          {
            id: 'md-ch1-clue3',
            type: 'clue',
            speaker: 'Gogo Thandi',
            speakerEmoji: '\uD83D\uDC75',
            dialogue: {
              en: 'Someone dropped their coins! What is the kind thing to do?',
              af: 'Iemand het hul munte laat val! Wat is die vriendelike ding om te doen?',
              zu: 'Umuntu uwisile izinhlamvu zemali! Yini into enhle yokwenza?',
              xh: 'Umntu uwisile iinkozo zemali! Yintoni into entle yokwenza?',
              st: 'Motho o lahletse lichelete! Ke eng ntho e ntle eo re ka e etsang?',
            },
            clue: {
              id: 'md-clue-lifeskills',
              type: 'life-skills',
              emoji: '\uD83E\uDD1D',
              title: {
                en: 'The Kind Choice',
                af: 'Die Vriendelike Keuse',
                zu: 'Ukukhetha Okuhle',
                xh: 'Ukukhetha Okuhle',
                st: 'Khetho e Ntle',
              },
              narrative: {
                en: 'Someone dropped their money at the market. What should you do?',
                af: 'Iemand het hul geld by die mark laat val. Wat moet jy doen?',
                zu: 'Umuntu uwisile imali yakhe emakethe. Kufanele wenzeni?',
                xh: 'Umntu uwisile imali yakhe emarikeni. Ufanele wenze ntoni?',
                st: 'Motho o lahletse chelete ea hae maketeng. U lokela ho etsa eng?',
              },
              task: {
                prompt: {
                  en: 'What should you do?',
                  af: 'Wat moet jy doen?',
                  zu: 'Kufanele wenzeni?',
                  xh: 'Ufanele wenze ntoni?',
                  st: 'U lokela ho etsa eng?',
                },
                options: [
                  { label: '\uD83E\uDD1D Help pick it up', correct: true },
                  { label: '\uD83D\uDE36 Walk away', correct: false },
                ],
              },
            },
          },
          {
            id: 'md-ch1-solution',
            type: 'solution',
            speaker: 'Gogo Thandi',
            speakerEmoji: '\uD83D\uDC75',
            dialogue: {
              en: 'You did it! Our market stall is ready. You read the sign, counted the fruit, and showed kindness. That is Ubuntu!',
              af: 'Julle het dit gedoen! Ons stalletjie is gereed. Julle het die bord gelees, die vrugte getel, en vriendelikheid gewys. Dit is Ubuntu!',
              zu: 'Nikwenzile! Isitolo sethu silungile. Nifundile isibhalo, nibale izithelo, futhi nibonise umusa. Lokhu yi-Ubuntu!',
              xh: 'Nikwenzile! Isitolo sethu silungile. Nifunde ibhodi, nibale iziqhamo, kwaye nibonise ububele. Oku yi-Ubuntu!',
              st: 'Le entsoe! Lebenkele la rona le lokile. Le balile letshwao, le balile litholoana, le bontshitse mosa. Sena ke Ubuntu!',
            },
          },
          {
            id: 'md-ch1-celebrate',
            type: 'celebration',
            speaker: 'Everyone',
            speakerEmoji: '\uD83C\uDF89',
            dialogue: {
              en: 'Together we made Market Day a success! Our Rainbow Market brings everyone together!',
              af: 'Saam het ons Markdag \'n sukses gemaak! Ons Reenboogmark bring almal bymekaar!',
              zu: 'Ndawonye senze usuku lwemakethe lwaphumelela! IMakethe Yothingo ihlanganisa wonke umuntu!',
              xh: 'Kunye senze usuku lwemarike lwaphumelela! IMarike yeRainbow idibanisa wonke umntu!',
              st: 'Mmoho re entse letsatsi la makete la atlega! Makete ea Rainbow e kopanya batho bohle!',
            },
          },
        ],
      },
    ],
  },
];
