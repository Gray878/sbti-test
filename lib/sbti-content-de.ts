import {
  DimensionKey,
  ScoreLevel,
  SbtiDimensionMeta,
  SbtiRegularQuestion,
  SbtiSpecialQuestion,
  SbtiTypeProfile,
  sbtiData,
} from "@/lib/sbti";

interface QuestionCopy {
  text: string;
  options: string[];
}

export interface SbtiLocalizedContent {
  questions: SbtiRegularQuestion[];
  specialQuestions: SbtiSpecialQuestion[];
  typeLibrary: Record<string, SbtiTypeProfile>;
  dimensionMeta: Record<DimensionKey, SbtiDimensionMeta>;
  dimExplanations: Record<DimensionKey, Record<ScoreLevel, string>>;
  dimensionOrder: DimensionKey[];
}

function localizeQuestions<T extends SbtiRegularQuestion | SbtiSpecialQuestion>(
  questions: T[],
  copy: Record<string, QuestionCopy>
) {
  return questions.map((question) => {
    const localized = copy[question.id];

    if (!localized) {
      throw new Error(`Missing SBTI copy for question: ${question.id}`);
    }

    if (localized.options.length !== question.options.length) {
      throw new Error(`Option count mismatch for SBTI question: ${question.id}`);
    }

    return {
      ...question,
      text: localized.text,
      options: question.options.map((option, index) => ({
        ...option,
        label: localized.options[index],
      })),
    };
  });
}

function localizeTypeLibrary(copy: Record<string, Omit<SbtiTypeProfile, "code">>) {
  return Object.fromEntries(
    Object.keys(sbtiData.typeLibrary).map((code) => {
      const localized = copy[code];

      if (!localized) {
        throw new Error(`Missing SBTI type copy for type: ${code}`);
      }

      return [
        code,
        {
          code,
          ...localized,
        },
      ];
    })
  ) as Record<string, SbtiTypeProfile>;
}

const DE_QUESTION_COPY: Record<string, QuestionCopy> = {
  q1: {
    text:
      "Vielleicht bin ich nicht nur ein Loser. Vielleicht bin ich das komplette Tragik-Starterpack: Clown, Couchkartoffel, ewig single, schuechtern, unsicher. Meine Jugend war im Grunde eine endlose Kette aus wahnwitzigen Tagtraeumen. Jeden Tag stelle ich mir vor, ich haette ein Maedchen, das mit mir spazieren geht, mit mir einkauft und mit mir abhaengt. Die Realitaet: Ich habe das Geld meiner Eltern verbraucht, eine mittelmaessige Schule besucht, bin in eine Sackgassen-Routine gerutscht und am Ende ein Triple-Null-Normalo ohne Traum, Ziel oder Faehigkeit geworden. Immer wenn ich online Witze ueber Loser sehe, koennte ich heulen. Ich bin wie eine Ratte unter der Erde, die durch einen Kanalspalt in das gute Leben anderer schaut. Jeder Blick fuehlt sich wie psychischer Schaden an. Lasst uns Clowns wenigstens ein bisschen Sauerstoff. Ich will mein Kissen wirklich nicht am helllichten Tag mit Traenen durchnaessen.",
    options: ["Das tat weh...", "Was habe ich gerade gelesen...?", "So bin ich nicht!"],
  },
  q2: {
    text: "Ich bin nicht gut genug. Die Menschen um mich herum sind besser als ich.",
    options: ["Stimmt", "Manchmal", "Nein"],
  },
  q3: {
    text: "Ich habe ein ziemlich klares Bild davon, wer ich wirklich bin.",
    options: ["Nicht einverstanden", "Neutral", "Einverstanden"],
  },
  q4: {
    text: "Es gibt etwas im Leben, das ich wirklich will.",
    options: ["Nicht einverstanden", "Neutral", "Einverstanden"],
  },
  q5: {
    text: "Ich muss weiter aufsteigen und zu einer staerkeren Person werden.",
    options: ["Nicht einverstanden", "Neutral", "Einverstanden"],
  },
  q6: {
    text: "Die Meinung anderer geht mich einen Dreck an.",
    options: ["Nicht einverstanden", "Neutral", "Einverstanden"],
  },
  q7: {
    text:
      "Dein Partner antwortet seit mehr als fuenf Stunden nicht und sagt, er habe Durchfall. Was ist dein erster Gedanke?",
    options: [
      "Unmoeglich, dass Durchfall fuenf Stunden dauert. Bestimmt wird mir etwas verheimlicht.",
      "Ich schwanke zwischen Vertrauen und Misstrauen.",
      "Vielleicht geht es der Person heute wirklich miserabel.",
    ],
  },
  q8: {
    text: "In Beziehungen habe ich oft Angst, verlassen zu werden.",
    options: ["Ja", "Manchmal", "Nein"],
  },
  q9: {
    text: "Ich schwoere beim Himmel: Jede Beziehung, die ich eingehe, nehme ich ernst.",
    options: ["Nicht wirklich", "Vielleicht?", "Ja. Mit voellig reinem Gewissen."],
  },
  q10: {
    text:
      "Dein Crush ist respektvoll, sanft, diszipliniert, aufrichtig, redegewandt, aufmerksam, weltgewandt, talentiert, gutherzig, strahlend und absurd attraktiv. Was passiert als Naechstes?",
    options: [
      "Selbst wenn die Person grossartig ist, verliebe ich mich nicht komplett.",
      "Irgendwo zwischen A und C.",
      "Ich wuerde die Person sehr schaetzen und vielleicht hoffnungslos verknallt werden.",
    ],
  },
  q11: {
    text: "Sobald ihr zusammen seid, wird dein Partner extrem anhaenglich. Wie fuehlt sich das an?",
    options: ["Ehrlich gesagt ziemlich gut.", "So oder so okay.", "Ich haette lieber etwas eigenen Raum."],
  },
  q12: {
    text: "In jeder Beziehung ist mein persoenlicher Freiraum sehr wichtig.",
    options: ["Ich mag Abhaengigkeit in beide Richtungen.", "Kommt darauf an.", "Ja. Absolut."],
  },
  q13: {
    text: "Die meisten Menschen haben ein gutes Herz.",
    options: ["Ganz ehrlich: Verrottete Leute wirken haeufiger als Heilige.", "Vielleicht.", "Ja. Ich glaube lieber, dass es mehr gute Menschen gibt."],
  },
  q14: {
    text:
      "Du gehst die Strasse entlang und ein absurd suesses kleines Maedchen huepft zu dir und bietet dir einen Lolli an. Wie reagierst du?",
    options: [
      "Ach wie suess. Sie gibt mir einen Lolli?!",
      "Totale Verwirrung. Kopfkratzmodus.",
      "Das fuehlt sich wie eine neue Art Betrug an. Lieber weg hier.",
    ],
  },
  q15: {
    text:
      "Die Pruefungen stehen vor der Tuer. Die Schule verlangt verpflichtendes Abendlernen, und Freinehmen kostet Punkte. Aber heute Abend wolltest du mit deinem Crush PUBG Mobile spielen. Was tust du?",
    options: [
      "Ich schwaenze. Ist ja nur dieses eine Mal.",
      "Okay, dann beantrage ich eben frei.",
      "Die Pruefungen sind so nah. Warum sollte ich nicht hingehen?",
    ],
  },
  q16: {
    text: "Ich breche gern Konventionen und hasse es, mich eingeschraenkt zu fuehlen.",
    options: ["Einverstanden", "Neutral", "Nicht einverstanden"],
  },
  q17: {
    text: "Ich tue Dinge normalerweise mit einem klaren Ziel vor Augen.",
    options: ["Nicht einverstanden", "Neutral", "Einverstanden"],
  },
  q18: {
    text:
      "Manchmal trifft mich ploetzlich der Gedanke, dass das Leben keinerlei Sinn hat. Menschen sind doch nur Tiere, getrieben von Verlangen und Hormonen. Hungrig essen wir, muede schlafen wir, geil wollen wir Sex. Im Grunde unterscheiden wir uns nicht so stark von Schweinen oder Hunden.",
    options: ["Klingt ziemlich wahr.", "Vielleicht ja, vielleicht nein.", "Das ist kompletter Unsinn."],
  },
  q19: {
    text: "Ich handle meist fuer Ergebnisse und Wachstum, nicht nur um Probleme und Risiken zu vermeiden.",
    options: ["Nicht einverstanden", "Neutral", "Einverstanden"],
  },
  q20: {
    text:
      "Du sitzt seit 30 Minuten verstopft auf der Toilette und es passiert immer noch nichts. Womit identifizierst du dich eher?",
    options: [
      "Noch mal dreissig Minuten sitzen. Vielleicht passiert ja noch was.",
      "Mir selbst auf den Hintern hauen und schreien: Komm schon, nutzloser Arsch, mach deinen Job!",
      "Ein Zaepfchen nehmen. Schnell loesen wir das.",
    ],
  },
  q21: {
    text: "Ich treffe Entscheidungen recht schnell und mag es nicht, sie endlos hinauszuziehen.",
    options: ["Nicht einverstanden", "Neutral", "Einverstanden"],
  },
  q22: {
    text: "Diese Frage hat keinen Text. Waehle blind.",
    options: ["Nach langem Nachdenken fuehlt A sich richtig an?", "Aeh... vielleicht B?", "Wenn ich zweifle, nehme ich C?"], 
  },
  q23: {
    text: "Wenn Leute sagen, du haettest 'starke Umsetzungsfaehigkeit', welche Zeile passt am ehesten?",
    options: [
      "Wenn die Deadline mich tritt, wird meine Umsetzung ploetzlich gottgleich...",
      "Naja, manchmal.",
      "Ja. Dinge sollen schliesslich vorankommen.",
    ],
  },
  q24: {
    text: "Ich mache oft Plaene, und...",
    options: ["Plaene verlieren oft gegen die Realitaet.", "manchmal ziehe ich sie durch, manchmal nicht.", "ich hasse es, wenn meine Plaene gestoert werden."],
  },
  q25: {
    text:
      "Du hast ueber Identity V einige Online-Freunde kennengelernt und sie wollen dich offline treffen. Was denkst du?",
    options: [
      "Online rumprahlen ist das eine. Sich real zu treffen ist trotzdem etwas nervenaufreibend.",
      "Online-Freunde treffen klingt okay. Wenn mich jemand anspricht, rede ich ein bisschen.",
      "Ich wuerde mich schick machen und offen plaudern. Man weiss ja nie. Und ich meine wirklich: nie.",
    ],
  },
  q26: {
    text: "Ein Freund bringt noch einen anderen Freund mit. In welchem Zustand bist du am ehesten?",
    options: [
      "Ich halte erstmal etwas Abstand zu einem 'Freund eines Freundes', damit ich die urspruengliche Dynamik nicht stoere.",
      "Kommt auf die Person an. Wenn es vibet, vibet es.",
      "Der Freund meines Freundes ist auch mein Freund. Also herzlich losplaudern.",
    ],
  },
  q27: {
    text: "Im Umgang mit Menschen laeuft bei mir oft ein unsichtbarer Elektrozaun. Kommt jemand zu nah, geht der Alarm los.",
    options: ["Einverstanden", "Neutral", "Nicht einverstanden"],
  },
  q28: {
    text: "Zu Menschen, denen ich vertraue, will ich sehr tiefe Naehe, fast wie wiedervereinte Familie.",
    options: ["Einverstanden", "Neutral", "Nicht einverstanden"],
  },
  q29: {
    text:
      "Manchmal hast du klar eine negative oder andere Meinung, sagst sie aber nicht. Warum ist das meist so?",
    options: [
      "Das passiert mir nicht besonders oft.",
      "Wahrscheinlich wegen Stimmung oder Beziehungskontext.",
      "Ich will nicht, dass Menschen meine dunklere Seite sehen.",
    ],
  },
  q30: {
    text: "Ich zeige verschiedenen Menschen unterschiedliche Versionen von mir.",
    options: ["Nicht einverstanden", "Neutral", "Einverstanden"],
  },
  drink_gate_q1: {
    text: "Was fuer Hobbys hast du normalerweise?",
    options: ["Essen, herumliegen, ueberleben.", "Kunst- und Kulturkram.", "Trinken.", "Sport."],
  },
  drink_gate_q2: {
    text: "Wie ist dein Verhaeltnis zu Alkohol?",
    options: [
      "Ein bisschen ist nett. So viel vertrage ich nicht.",
      "Ich fuelle Baijiu in eine Thermoskanne und trinke ihn wie heisses Wasser. Alkohol hat meinen Respekt.",
    ],
  },
};

const DE_DIMENSION_META: Record<DimensionKey, SbtiDimensionMeta> = {
  S1: { name: "S1 Selbstwert & Selbstvertrauen", model: "Selbstmodell" },
  S2: { name: "S2 Selbstklarheit", model: "Selbstmodell" },
  S3: { name: "S3 Kernwerte", model: "Selbstmodell" },
  E1: { name: "E1 Bindungssicherheit", model: "Emotionsmodell" },
  E2: { name: "E2 Emotionales Investment", model: "Emotionsmodell" },
  E3: { name: "E3 Grenzen & Abhaengigkeit", model: "Emotionsmodell" },
  A1: { name: "A1 Weltsicht", model: "Haltungsmodell" },
  A2: { name: "A2 Regeln & Flexibilitaet", model: "Haltungsmodell" },
  A3: { name: "A3 Sinnempfinden", model: "Haltungsmodell" },
  Ac1: { name: "Ac1 Motivationsrichtung", model: "Handlungsmodell" },
  Ac2: { name: "Ac2 Entscheidungsstil", model: "Handlungsmodell" },
  Ac3: { name: "Ac3 Umsetzungsmodus", model: "Handlungsmodell" },
  So1: { name: "So1 Soziale Initiative", model: "Sozialmodell" },
  So2: { name: "So2 Zwischenmenschliche Grenzen", model: "Sozialmodell" },
  So3: { name: "So3 Ausdruck & Authentizitaet", model: "Sozialmodell" },
};

const DE_DIM_EXPLANATIONS: Record<DimensionKey, Record<ScoreLevel, string>> = {
  S1: {
    L: "Du kritisierst dich haerter als andere es tun. Selbst Komplimente landen zuerst in der Verifikation.",
    M: "Dein Selbstvertrauen schwankt je nach Gegenwind oder Rueckenwind.",
    H: "Du besitzt ein recht stabiles Selbstgefuehl und gehst an einer zufaelligen Meinung nicht sofort kaputt.",
  },
  S2: {
    L: "Im Kopf rauscht es haeufig. Die Frage 'Wer bin ich?' laedt und laedt.",
    M: "An den meisten Tagen kennst du dich gut, aber starke Gefuehle koennen dein System kurz uebernehmen.",
    H: "Du kennst Temperament, Wuensche und Grenzen ziemlich gut.",
  },
  S3: {
    L: "Komfort und Sicherheit stehen hoch im Kurs. Das Leben muss kein taeglicher Sprint sein.",
    M: "Du willst wachsen, aber auch mal liegenbleiben. Deine Werte halten oft interne Meetings ab.",
    H: "Ziele, Wachstum oder starke Ueberzeugungen schieben dich leicht nach vorn.",
  },
  E1: {
    L: "Dein Beziehungsalarmsystem ist ueberempfindlich. Schon eine spaete Antwort fuehlt sich wie Weltuntergang an.",
    M: "Du kannst vertrauen, aber ein Rest Unsicherheit sitzt immer mit im Raum.",
    H: "Du faellst in Naehe nicht sofort auseinander und brauchst nicht staendig Beruhigung.",
  },
  E2: {
    L: "Dein Herz hat eine Handbremse. Zu viel Investition macht dich nervoes.",
    M: "Je nach Person und Zeitpunkt gehst du mal tiefer rein und mal auf Abstand.",
    H: "Wenn du jemanden magst, gehst du emotional wirklich mit vollem Gewicht rein.",
  },
  E3: {
    L: "Du magst Abhaengigkeit, Verbundenheit und emotionales Ineinanderfliessen eher als Distanz.",
    M: "Du willst Naehe, aber ohne komplett zu verschmelzen.",
    H: "Persoenlicher Raum ist dir heilig. Zu viel Naehe fuehlt sich schnell erdrueckend an.",
  },
  A1: {
    L: "Du erwartest von der Welt eher Chaos, Gefahr oder miese Absichten als reine Freundlichkeit.",
    M: "Du bleibst abwartend. Die Welt ist weder komplett gut noch komplett verrottet.",
    H: "Du gibst Menschen und Situationen eher einen Vertrauensvorschuss.",
  },
  A2: {
    L: "Regeln, Strukturen und Konventionen engen dich schnell ein.",
    M: "Manches willst du brechen, anderes laesst du stehen. Es kommt auf den Kontext an.",
    H: "Stabile Regeln und Ordnung geben dir eher Sicherheit als Widerstand.",
  },
  A3: {
    L: "Du denkst leicht, dass vieles sinnlos, leer oder biologisch herunterbrechbar ist.",
    M: "Du schwankst zwischen Zynismus und Hoffnung.",
    H: "Du haengst an Sinn, Richtung oder zumindest der Idee, dass das alles mehr ist als blanke Triebe.",
  },
  Ac1: {
    L: "Du handelst eher, um Risiken zu vermeiden oder den Tag zu ueberstehen, als um aktiv voranzukommen.",
    M: "Mal Sicherheitsmodus, mal Vorwaertsdrang. Beides wohnt in dir.",
    H: "Du handelst gern fuer Resultate, Wachstum und Fortschritt.",
  },
  Ac2: {
    L: "Entscheidungen ziehen sich. Du laesst Optionen lieber offen, als sie sofort festzuzurren.",
    M: "Je nach Energie und Lage kannst du sowohl zaeh als auch klar sein.",
    H: "Du entscheidest zuegig und willst nicht ewig im Schwebezustand haengen.",
  },
  Ac3: {
    L: "Deine Umsetzung wacht oft erst unter Druck oder im letzten Moment auf.",
    M: "Du kannst liefern, aber nicht immer gleichmaessig.",
    H: "Wenn etwas gemacht werden muss, bringst du es meist vorwaerts statt nur darueber zu reden.",
  },
  So1: {
    L: "Du gehst sozial selten den ersten Schritt und brauchst meist laenger zum Auftauen.",
    M: "Mit passenden Leuten bist du offen, sonst eher moderat abwartend.",
    H: "Du gehst leicht auf Menschen zu und kannst soziale Raeume aktiv beleben.",
  },
  So2: {
    L: "Du suchst eher Verschmelzung und tiefe Verbundenheit als Abstand.",
    M: "Du willst Naehe, aber auch noch ein wenig Trennung bewahren.",
    H: "Deine Grenzen sind stark. Zu viel Verflechtung fuehlt sich schnell falsch an.",
  },
  So3: {
    L: "Du wirkst relativ direkt und unverstellt. Du paketierst dich nicht staendig neu.",
    M: "Du liest die Luft und passt dich etwas an, ohne dich ganz zu verlieren.",
    H: "Du wechselst je nach Gegenueber geschickt zwischen verschiedenen Versionen von dir und zeigst dein Inneres selektiv.",
  },
};

const DE_TYPE_LIBRARY = localizeTypeLibrary({
  CTRL: {
    cn: "Controller",
    intro: "Du greifst ans Steuer, bevor jemand darum bittet.",
    desc: "CTRL-Typen uebernehmen chaotische Situationen fast natuerlich und verwandeln Unordnung in System. Sie wirken oft wie ein menschlicher Reset-Knopf fuer desorganisierte Lebenslagen.",
  },
  "ATM-er": {
    cn: "Der Geber",
    intro: "Du bezahlst dauernd mit Zeit, Energie und Geduld.",
    desc: "ATM-er bezahlt nicht nur mit Geld. Dieser Typ zahlt oft mit Zeit, Energie, Geduld und emotionaler Arbeit und ist deshalb verlaesslich, aber leicht ausnutzbar.",
  },
  "Dior-s": {
    cn: "Der Verlierer-Weise",
    intro: "Du riechst falschen Ehrgeiz auf Kilometer.",
    desc: "Dior-s lehnt leeres Ambitionstheater ab. Dieser Typ durchschaut Statusspiele frueh und bleibt lieber bequem und klar, statt falsche Selbstverbesserung aufzufuehren.",
  },
  BOSS: {
    cn: "Leader",
    intro: "Gib mir das Steuer. Ich fahre.",
    desc: "BOSS will das Lenkrad halten. Ergebnis, Tempo und Ordnung sind wichtig, und vieles im Leben fuehlt sich fuer diesen Typ wie ein Projekt an, das eine staerkere Hand braucht.",
  },
  "THAN-K": {
    cn: "Der Dankbare",
    intro: "Du findest selbst im Schlechten noch etwas, wofuer man danken kann.",
    desc: "THAN-K rettet Bedeutung aus miesen Situationen. Nicht aus Naivitaet, sondern aus einer natuerlichen Orientierung an Dankbarkeit, Sanftheit und innerer Erholung.",
  },
  "OH-NO": {
    cn: "Katastrophenvermeider",
    intro: "Dein Kopf spielt Katastrophenuebungen aus Spass durch.",
    desc: "OH-NO simuliert Scheitern oft schon, bevor andere Gefahr wahrnehmen. Das wirkt vorsichtig, verhindert aber genau deshalb Zusammenbrueche.",
  },
  GOGO: {
    cn: "Der Macher",
    intro: "Denken ist nett. Bewegen ist besser.",
    desc: "GOGO bevorzugt Momentum vor Reflexion. Dieser Typ hasst Planungs-Limbo und fuehlt sich am besten, wenn Aufgaben vorankommen, geschlossen werden und verschwinden.",
  },
  SEXY: {
    cn: "Die magnetische Person",
    intro: "Aufmerksamkeit findet dich von allein.",
    desc: "SEXY meint weniger klassische Schoenheit als unbestreitbare Praesenz. Dieser Typ zieht Fokus oft an, ohne sich sichtbar anzustrengen.",
  },
  "LOVE-R": {
    cn: "Romantischer Maximalist",
    intro: "Deine Gefuehle kommen nie in halben Groessen.",
    desc: "LOVE-R erlebt Emotionen bei voller Lautstaerke. Gewoehnliche Momente werden leicht symbolisch, und Beziehungen werden mit ungewoehnlicher Ernsthaftigkeit behandelt.",
  },
  MUM: {
    cn: "Die Mutter",
    intro: "Du kuemmerst dich fast zu gut um alle.",
    desc: "MUM merkt schnell, was andere brauchen, und greift sanft ein. Die Schwachstelle ist, dass diese Fuerseorge oft nach aussen verteilt wird, lange bevor sie das eigene Selbst erreicht.",
  },
  FAKE: {
    cn: "Maskenwechsler",
    intro: "Du wechselst Masken so weich, dass es kompliziert wird.",
    desc: "FAKE schaltet je nach Kontext schnell in andere Modi. Diese Flexibilitaet ist sozial maechtig, kann aber verwischen, wo Performance endet und das echte Selbst beginnt.",
  },
  OJBK: {
    cn: "Die Egal-Person",
    intro: "Wenn du 'egal' sagst, meinst du es meist wirklich so.",
    desc: "OJBK hat nicht keine Vorlieben. Dieser Typ weigert sich nur, fuer Entscheidungen ohne grossen Wert dramatische Energie zu verbrennen.",
  },
  MALO: {
    cn: "Trickreiches Affenhirn",
    intro: "Das Leben ist eine Sidequest, und du spielst es nicht geradeaus.",
    desc: "MALO behandelt das Leben wie eine Nebenquest voller Spruenge, Umwege und Witze. Totale Verhaltens-Domestizierung liegt diesem Typ ueberhaupt nicht.",
  },
  "JOKE-R": {
    cn: "Clown",
    intro: "Du verwandelst Schmerz in Pointen.",
    desc: "JOKE-R haelt Raeume lebendig, indem Schmerz zur Performance wird. Die Witze sind sowohl soziales Talent als auch emotionale Ruestung.",
  },
  "WOC!": {
    cn: "Die 'Whoa'-Person",
    intro: "Ein dramatisches 'whoa' sagt schon alles.",
    desc: "WOC! wirkt aussen uebertrieben, ist innen aber oft kontrollierter, als es scheint. Der dramatische Ausbruch ist meist Schlusskommentar, nicht Interventionsbeginn.",
  },
  "THIN-K": {
    cn: "Denker",
    intro: "Dein Gehirn fact-checkt den Raum bereits.",
    desc: "THIN-K prueft Behauptungen, Motive, Belege und verborgene Verzerrungen. Schweigen bedeutet hier oft innere Revision und nicht Abwesenheit.",
  },
  SHIT: {
    cn: "Bitterer Weltretter",
    intro: "Du roastest die Welt und raeumst hinterher trotzdem auf.",
    desc: "SHIT beschwert sich ueber alles und putzt den Scherbenhaufen danach dennoch weg. Genau diese Widerspruechlichkeit macht den Typ aus.",
  },
  ZZZZ: {
    cn: "Deadline-Erwacher",
    intro: "Du wachst auf, wenn die Deadline dir in den Nacken atmet.",
    desc: "ZZZZ wirkt oft abwesend, bis die Frist real wird. Sobald der Druck steigt, wacht dieser Typ ploetzlich komplett auf.",
  },
  POOR: {
    cn: "Der schmale Strahl",
    intro: "Alles andere wird abgeschnitten, nur das Wichtige bleibt.",
    desc: "POOR ist nur insofern 'arm', als Aufmerksamkeit gebuendelt statt verteilt wird. Dieser Typ kann fast alles ignorieren, ausser dem einen Ziel, das wirklich zaehlt.",
  },
  MONK: {
    cn: "Muench",
    intro: "Naehe ist okay. Deinen Raum zu verlieren nicht.",
    desc: "MONK schaetzt Trennung und Ruhe. Kuehle ist hier kein Unfall, sondern die Ueberzeugung, dass Intimitaet Unabhaengigkeit niemals ausloeschen darf.",
  },
  IMSB: {
    cn: "Der selbstsabotierende Narr",
    intro: "Dein innerer Hype-Man und dein innerer Hater liegen im Krieg.",
    desc: "IMSB schwankt oft zwischen 'geh los' und 'du wirst dich blamieren'. Was wie Zaudern aussieht, ist meist ein innerer Buergerkrieg.",
  },
  SOLO: {
    cn: "Die isolierte Person",
    intro: "Du trittst zuerst zurueck, damit dich niemand zuerst ablehnt.",
    desc: "SOLO schuetzt das Selbst, indem es sich vorher entzieht. Die harte Schale deckt oft starke Angst vor Ablehnung und Verlassenwerden ab.",
  },
  FUCK: {
    cn: "Wilde Kraft",
    intro: "Du waehlst rohes Leben statt hoeflicher Einhegung.",
    desc: "FUCK lehnt polierte Selbstkontrolle ab. Intensitaet, Freiheit und rohe Lebenskraft zaehlen hier mehr als sozial abgesegnetes Verhalten.",
  },
  DEAD: {
    cn: "Der erschoepfte Weise",
    intro: "Du schaust auf das Spiel, als haettest du es laengst beendet.",
    desc: "DEAD wirkt wie jemand, der das Spiel emotional schon durchhat. Viele normale Ziele erscheinen diesem Typ trocken, fern oder nicht mehr besonders wertvoll.",
  },
  IMFW: {
    cn: "Fragiler Glaeubiger",
    intro: "Wenn du dich sicher fuehlst, vertraust du zu tief.",
    desc: "IMFW vertraut stark, sobald Sicherheit spuerbar wird. Die Verletzlichkeit kommt hier weniger aus Unfaehigkeit als aus uebermaessiger Aufrichtigkeit und Offenheit.",
  },
  HHHH: {
    cn: "Fallback-Lacher",
    intro: "Das System hat dich angesehen und lachend aufgegeben.",
    desc: "HHHH ist weniger ein normaler Typ als ein Hinweis darauf, dass dein Antwortmuster sich nicht sauber klassifizieren liess. Es ist der Moment, in dem die Standardbibliothek kapituliert.",
  },
  DRUNK: {
    cn: "Trinker",
    intro: "Alkohol hat das Armaturenbrett uebernommen.",
    desc: "DRUNK ist das versteckte Joke-Ergebnis des Tests. Es wird ueber den speziellen Trinkpfad aktiviert und existiert eher als dramatisches Easter Egg denn als Standardprofil.",
  },
});

export const DE_CONTENT: SbtiLocalizedContent = {
  questions: localizeQuestions(sbtiData.questions, DE_QUESTION_COPY),
  specialQuestions: localizeQuestions(
    sbtiData.specialQuestions,
    DE_QUESTION_COPY
  ),
  typeLibrary: DE_TYPE_LIBRARY,
  dimensionMeta: DE_DIMENSION_META,
  dimExplanations: DE_DIM_EXPLANATIONS,
  dimensionOrder: sbtiData.dimensionOrder,
};
