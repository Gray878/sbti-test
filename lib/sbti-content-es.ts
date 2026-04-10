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

const ES_QUESTION_COPY: Record<string, QuestionCopy> = {
  q1: {
    text:
      "Puede que no sea solo un fracasado. Puede que sea el pack completo de la tragedia: payaso, vago, eternamente soltero, tímido, inseguro. Mi juventud ha sido una cadena larguísima de fantasías ilusas. Cada día imagino que tengo una chica que pasea conmigo, compra conmigo y sale conmigo. La realidad: me gasté el dinero de mis padres, fui a una escuela mediocre, me deslicé hacia una rutina sin salida y acabé convertido en un civil triple-cero sin sueños, sin metas y sin habilidades. Cada vez que veo bromas sobre perdedores en internet me entran ganas de llorar. Soy como una rata bajo tierra mirando la buena vida de los demás por una grieta de la alcantarilla. Cada vistazo hace daño psíquico. Dejadnos un poco de oxígeno a los payasos de este mundo. De verdad no quiero empapar la almohada de lágrimas a plena luz del día.",
    options: ["Eso dolió...", "¿Qué acabo de leer...?", "¡Ese no soy yo!"],
  },
  q2: {
    text: "No soy lo bastante bueno. La gente que me rodea es mejor que yo.",
    options: ["Verdadero", "A veces", "No"],
  },
  q3: {
    text: "Tengo bastante claro quién soy de verdad.",
    options: ["En desacuerdo", "Neutral", "De acuerdo"],
  },
  q4: {
    text: "Hay algo en la vida que realmente quiero.",
    options: ["En desacuerdo", "Neutral", "De acuerdo"],
  },
  q5: {
    text: "Tengo que seguir subiendo y convertirme en alguien más fuerte.",
    options: ["En desacuerdo", "Neutral", "De acuerdo"],
  },
  q6: {
    text: "La opinión de los demás me importa un comino.",
    options: ["En desacuerdo", "Neutral", "De acuerdo"],
  },
  q7: {
    text:
      "Tu pareja lleva más de cinco horas sin contestar y dice que tuvo diarrea. ¿Cuál es tu primer pensamiento?",
    options: [
      "Ni de broma una diarrea dura cinco horas. Seguro que me está ocultando algo.",
      "Voy oscilando entre confiar y sospechar.",
      "Igual de verdad se siente fatal hoy.",
    ],
  },
  q8: {
    text: "En las relaciones, a menudo me preocupa que me abandonen.",
    options: ["Sí", "A veces", "No"],
  },
  q9: {
    text: "Lo juro por el cielo: cada relación en la que entro me la tomo en serio.",
    options: [
      "La verdad, no mucho.",
      "¿Quizá?",
      "Sí. Con la conciencia completamente tranquila.",
    ],
  },
  q10: {
    text:
      "La persona que te gusta es respetuosa, amable, disciplinada, íntegra, elocuente, observadora, mundana, talentosa, bondadosa, radiante y absurdamente atractiva. ¿Qué pasa después?",
    options: [
      "Aunque sea increíble, no voy a caer tan hondo.",
      "En algún punto entre A y C.",
      "La valoraría muchísimo y quizá acabaría completamente enamorado.",
    ],
  },
  q11: {
    text: "Una vez empiezas a salir con alguien, tu pareja se vuelve extremadamente pegajosa. ¿Qué te parece?",
    options: [
      "Sinceramente, hasta me gusta.",
      "Me da bastante igual.",
      "Prefiero conservar un espacio propio.",
    ],
  },
  q12: {
    text: "En cualquier relación, mi espacio personal es muy importante.",
    options: [
      "Prefiero depender y que dependan de mí.",
      "Depende.",
      "Sí. Absolutamente.",
    ],
  },
  q13: {
    text: "La mayoría de la gente tiene buen corazón.",
    options: [
      "Sinceramente, siento que hay mucha más gente podrida que santos.",
      "Puede ser.",
      "Sí. Prefiero creer que hay más buena gente.",
    ],
  },
  q14: {
    text:
      "Vas caminando por la calle y una niña absurdamente adorable se te acerca dando saltitos y te ofrece una piruleta. Sale monísima desde cualquier ángulo y en cualquier cámara. ¿Cómo reaccionas?",
    options: [
      "Ay, qué dulce y adorable. ¿Encima me da una piruleta?!",
      "Confusión total. Modo rascarse la cabeza.",
      "Esto parece una estafa nueva. Mejor me largo.",
    ],
  },
  q15: {
    text:
      "Se acercan los exámenes. La escuela exige estudio nocturno obligatorio y pedir permiso te resta puntos. Pero esta noche ya habías quedado para jugar a PUBG Mobile con tu crush. ¿Qué haces?",
    options: [
      "Falto. Solo será esta vez.",
      "Vale, pediré permiso.",
      "Con los exámenes tan cerca, ¿para qué iba a ir?",
    ],
  },
  q16: {
    text: "Me gusta romper convenciones y odio sentirme restringido.",
    options: ["De acuerdo", "Neutral", "En desacuerdo"],
  },
  q17: {
    text: "Normalmente hago las cosas con un objetivo claro en mente.",
    options: ["En desacuerdo", "Neutral", "De acuerdo"],
  },
  q18: {
    text:
      "A veces me golpea de repente la idea de que la vida no tiene ningún sentido. Los humanos no dejan de ser animales impulsados por deseo y hormonas. Si tenemos hambre, comemos. Si tenemos sueño, dormimos. Si estamos calientes, queremos sexo. En el fondo no somos tan distintos de cerdos o perros.",
    options: [
      "Suena bastante cierto.",
      "Quizá sí, quizá no.",
      "Eso es una tontería total.",
    ],
  },
  q19: {
    text:
      "Suelo actuar para conseguir resultados y crecer, no solo para evitar problemas y riesgos.",
    options: ["En desacuerdo", "Neutral", "De acuerdo"],
  },
  q20: {
    text:
      "Llevas 30 minutos estreñido en el váter y no sale nada. ¿Con cuál te identificas más?",
    options: [
      "Me quedo otros treinta minutos. Igual pasa algo.",
      "Me doy palmadas en el culo y grito: '¡Vamos, culo inútil, haz tu trabajo!'",
      "Uso un supositorio. Vamos a resolver esto rápido.",
    ],
  },
  q21: {
    text: "Tomo decisiones con bastante rapidez y no me gusta alargarlas.",
    options: ["En desacuerdo", "Neutral", "De acuerdo"],
  },
  q22: {
    text: "Esta pregunta no tiene enunciado. Elige a ciegas.",
    options: [
      "Después de pensarlo demasiado, ¿A parece correcta?",
      "Eh... ¿quizá B?",
      "Cuando dudes, ¿C?",
    ],
  },
  q23: {
    text:
      "Cuando la gente dice que 'tienes mucha capacidad de ejecución', ¿qué frase se parece más a ti?",
    options: [
      "Si me empujan hasta la fecha límite, sí, de repente mi ejecución se vuelve divina...",
      "Bueno, a veces.",
      "Sí. Las cosas deberían avanzar.",
    ],
  },
  q24: {
    text: "Suelo hacer planes y...",
    options: [
      "los planes casi nunca vencen a la realidad.",
      "a veces los cumplo y a veces no.",
      "odio que me desmonten los planes.",
    ],
  },
  q25: {
    text:
      "Has hecho un montón de amigos online jugando a Identity V y te proponen quedar en persona. ¿Qué piensas?",
    options: [
      "Rajar por internet es una cosa; vernos en persona todavía me pone un poco nervioso.",
      "Quedar con amigos online me parece bien. Si me hablan, charlaré un rato.",
      "Me arreglaría bien y hablaría con entusiasmo. Nunca se sabe. Y cuando digo nunca, es nunca.",
    ],
  },
  q26: {
    text: "Un amigo trae a otro amigo suyo para salir. ¿En qué estado estás más probablemente?",
    options: [
      "Mantengo cierta distancia con el 'amigo de un amigo' para no romper la dinámica original.",
      "Depende de la persona. Si conectamos, conectamos.",
      "El amigo de mi amigo también es mi amigo. Hora de hablar con calidez.",
    ],
  },
  q27: {
    text:
      "Cuando trato con la gente, siento que llevo una valla eléctrica invisible. Si se acercan demasiado, salta la alarma.",
    options: ["De acuerdo", "Neutral", "En desacuerdo"],
  },
  q28: {
    text:
      "Quiero una cercanía muy profunda con la gente en la que confío, como una familia perdida que se reúne de nuevo.",
    options: ["De acuerdo", "Neutral", "En desacuerdo"],
  },
  q29: {
    text:
      "A veces tienes una opinión distinta o negativa sobre algo, pero te la guardas. La mayoría de las veces, ¿por qué?",
    options: [
      "Eso no me pasa a menudo.",
      "Probablemente por el ambiente o por la relación con la otra persona.",
      "No quiero que la gente descubra mi lado más oscuro.",
    ],
  },
  q30: {
    text: "Muestro versiones distintas de mí según con quién esté.",
    options: ["En desacuerdo", "Neutral", "De acuerdo"],
  },
  drink_gate_q1: {
    text: "¿Qué tipo de aficiones sueles tener?",
    options: [
      "Comer, vaguear y sobrevivir.",
      "Cosas de arte y cultura.",
      "Beber.",
      "Hacer ejercicio.",
    ],
  },
  drink_gate_q2: {
    text: "¿Cómo es tu relación con el alcohol?",
    options: [
      "Un poco está bien. No aguanto demasiado.",
      "Le echo baijiu a un termo y me lo bebo como si fuera agua caliente. El alcohol merece mi respeto.",
    ],
  },
};

const ES_DIMENSION_META: Record<DimensionKey, SbtiDimensionMeta> = {
  S1: { name: "S1 Autoestima y confianza", model: "Modelo del yo" },
  S2: { name: "S2 Claridad del yo", model: "Modelo del yo" },
  S3: { name: "S3 Valores centrales", model: "Modelo del yo" },
  E1: { name: "E1 Seguridad de apego", model: "Modelo emocional" },
  E2: { name: "E2 Inversión emocional", model: "Modelo emocional" },
  E3: { name: "E3 Límites y dependencia", model: "Modelo emocional" },
  A1: { name: "A1 Orientación ante el mundo", model: "Modelo de actitud" },
  A2: { name: "A2 Reglas y flexibilidad", model: "Modelo de actitud" },
  A3: { name: "A3 Sentido de significado", model: "Modelo de actitud" },
  Ac1: { name: "Ac1 Dirección de la motivación", model: "Modelo de impulso de acción" },
  Ac2: { name: "Ac2 Estilo de decisión", model: "Modelo de impulso de acción" },
  Ac3: { name: "Ac3 Patrón de ejecución", model: "Modelo de impulso de acción" },
  So1: { name: "So1 Iniciativa social", model: "Modelo social" },
  So2: { name: "So2 Límites interpersonales", model: "Modelo social" },
  So3: { name: "So3 Expresión y autenticidad", model: "Modelo social" },
};

const ES_DIM_EXPLANATIONS: Record<
  DimensionKey,
  Record<ScoreLevel, string>
> = {
  S1: {
    L: "Te castigas más de lo que lo hacen los demás. Hasta los cumplidos pasan primero por control de calidad.",
    M: "Tu confianza cambia con el tiempo. Con viento a favor vuelas; con viento en contra te encoges.",
    H: "Tu sensación de identidad es bastante estable y no te derrumba una opinión aleatoria.",
  },
  S2: {
    L: "Dentro de tu cabeza hay mucha interferencia. La pregunta '¿quién soy?' sigue cargando.",
    M: "La mayoría de los días te reconoces bien, pero las emociones fuertes pueden secuestrarte temporalmente.",
    H: "Conoces bastante bien tu temperamento, tus deseos y tus límites.",
  },
  S3: {
    L: "La comodidad y la seguridad pesan mucho. La vida no necesita ser un sprint diario.",
    M: "Quieres crecer, pero también tumbarte un rato. Tus valores están en reunión interna constante.",
    H: "Las metas, el crecimiento o una creencia fuerte te empujan con facilidad hacia delante.",
  },
  E1: {
    L: "Tu alarma relacional es hipersensible. Hasta una respuesta tardía puede convertirse en apocalipsis imaginario.",
    M: "Medio confías, medio examinas. Las relaciones suelen sentirse como un tira y afloja interno.",
    H: "Prefieres confiar en la relación misma y no explotas por cada pequeña señal.",
  },
  E2: {
    L: "Inviertes en el amor con cautela. El corazón no está cerrado; simplemente el control de acceso es estricto.",
    M: "Puedes dar bastante, pero aun así dejas un plan de respaldo.",
    H: "Cuando decides que alguien importa, te entregas de verdad con emoción y energía completas.",
  },
  E3: {
    L: "Puedes volverte pegajoso y atraer gente pegajosa. El calor emocional pesa mucho para ti.",
    M: "Necesitas cercanía e independencia a la vez. Tu estilo de apego se ajusta según la situación.",
    H: "El espacio importa. Por mucho que quieras a alguien, sigues necesitando un terreno propio.",
  },
  A1: {
    L: "Miras el mundo desde un filtro defensivo: primero dudas, luego te acercas.",
    M: "No eres ingenuo ni totalmente conspiranoico. Observar desde un lado es tu instinto.",
    H: "Tiendes más a creer en la decencia humana y no condenas al mundo tan deprisa.",
  },
  A2: {
    L: "Si una regla se puede doblar, la doblas. La comodidad y la libertad suelen ir primero.",
    M: "Sigues las reglas cuando tienen sentido y te adaptas cuando no.",
    H: "Te gusta el orden. Si existe un proceso, prefieres usarlo antes que improvisar un desastre.",
  },
  A3: {
    L: "Tu sentido del significado va bajo, así que muchas cosas parecen puro trámite.",
    M: "A veces tienes dirección y otras veces solo quieres pudrirte en la cama. Tu visión del mundo arranca a medias.",
    H: "Te mueves con una dirección más clara y sueles saber hacia dónde vas, aunque sea de forma aproximada.",
  },
  Ac1: {
    L: "Antes de que arranque la ambición, se enciende tu sistema antiaccidentes.",
    M: "A veces quieres ganar; otras solo quieres menos problemas. La motivación sale mezclada.",
    H: "Los resultados, el crecimiento y el avance te encienden con facilidad.",
  },
  Ac2: {
    L: "Antes de decidir, a tu cerebro le gusta dar unas cuantas vueltas extra. Las reuniones internas suelen ir a prórroga.",
    M: "Lo piensas bien, pero no hasta romper el sistema.",
    H: "Decides rápido. Una vez puesto el tablero, odias volver a marear el asunto.",
  },
  Ac3: {
    L: "Tu capacidad de ejecución tiene un vínculo emocional con las fechas límite. Cuanto más tarde, más despiertas.",
    M: "Puedes hacerlo, pero el momento importa. A veces constante, a veces completamente flojo.",
    H: "Tienes un impulso fuerte por hacer avanzar las cosas. Las tareas sin terminar se sienten como una astilla mental.",
  },
  So1: {
    L: "Te calientas lentamente para socializar. Iniciar contacto requiere una carga previa importante.",
    M: "Si alguien se acerca, respondes. Si nadie lo hace, no te fuerzas.",
    H: "Te resulta más fácil abrir tú mismo la sala y no te importa demasiado ser visible en grupo.",
  },
  So2: {
    L: "En las relaciones te inclinas hacia la cercanía y la fusión. Cuando te sientes seguro, metes a la gente al círculo interior.",
    M: "Quieres intimidad y aire a la vez. Tus límites cambian según la persona.",
    H: "Tus límites son fuertes. Si alguien se acerca demasiado, tu cuerpo da medio paso atrás por instinto.",
  },
  So3: {
    L: "Te expresas de manera más directa. Si algo te ronda la cabeza, no lo envuelves mucho.",
    M: "Lees el ambiente. La honestidad y la cortesía social reciben una parte cada una.",
    H: "Se te da bien cambiar de versión según el contexto. La autenticidad la liberas por capas.",
  },
};

const ES_TYPE_LIBRARY = localizeTypeLibrary({
  CTRL: {
    cn: "Controlador",
    intro: "Tomas el volante antes de que alguien te lo pida.",
    desc: "CTRL toma el control de los contextos caóticos y convierte el desorden en proceso. Tiene algo de botón de reinicio humano para vidas desorganizadas.",
  },
  "ATM-er": {
    cn: "El que siempre paga",
    intro: "Sigues pagando con tiempo, energía y paciencia.",
    desc: "ATM-er no paga solo con dinero. Suele pagar con tiempo, energía, paciencia y trabajo emocional, lo que lo hace fiable pero también fácil de sobreexplotar.",
  },
  "Dior-s": {
    cn: "Perdedor sabio",
    intro: "Hueles la ambición falsa a kilómetros.",
    desc: "Dior-s rechaza el teatro de la ambición vacía. Suele detectar pronto los juegos de estatus y prefiere vivir cómodo y con la mirada clara antes que fingir una superación falsa.",
  },
  BOSS: {
    cn: "Líder",
    intro: "Dame el volante. Yo conduzco.",
    desc: "BOSS disfruta llevando el timón. Le importan el resultado, el ritmo y el orden, y a menudo vive como si todo fuera un proyecto que necesita un operador más fuerte.",
  },
  "THAN-K": {
    cn: "Agradecido",
    intro: "Todavía encuentras algo por lo que dar las gracias.",
    desc: "THAN-K rescata significado incluso de los malos momentos. No es ingenuo; está orientado de forma natural hacia la gratitud, la suavidad y la recuperación emocional.",
  },
  "OH-NO": {
    cn: "Prevención de desastres",
    intro: "Tu cerebro hace simulacros de desastre por diversión.",
    desc: "OH-NO ensaya mentalmente escenarios de fallo antes incluso de que los demás perciban el peligro. Puede parecer cauteloso, pero su cautela es precisamente lo que evita el colapso.",
  },
  GOGO: {
    cn: "El que actúa",
    intro: "Pensar está bien. Moverse está mejor.",
    desc: "GOGO prefiere la inercia al análisis eterno. Odia dejar las cosas flotando en el limbo de la planificación y se siente mejor cuando las tareas avanzan, se cierran y desaparecen.",
  },
  SEXY: {
    cn: "Magnético",
    intro: "La atención te encuentra sola.",
    desc: "SEXY no va tanto de belleza literal como de presencia innegable. Tiende a atraer el foco sin esforzarse demasiado.",
  },
  "LOVE-R": {
    cn: "Romántico extremo",
    intro: "Tus sentimientos nunca vienen a media intensidad.",
    desc: "LOVE-R siente a volumen máximo. Los momentos corrientes se vuelven fácilmente simbólicos y las relaciones suelen vivirse con una seriedad poco común.",
  },
  MUM: {
    cn: "Mamá",
    intro: "Cuidas de todo el mundo quizá demasiado bien.",
    desc: "MUM detecta con facilidad lo que los demás necesitan y entra con suavidad. La debilidad es que esa ternura suele repartirse hacia fuera mucho antes de llegar a uno mismo.",
  },
  FAKE: {
    cn: "Cambia máscaras",
    intro: "Cambias de máscara con tanta suavidad que todo se complica.",
    desc: "FAKE ajusta su modo según el contexto con gran rapidez. Esa flexibilidad tiene mucho poder social, pero también puede difuminar dónde termina la actuación y empieza el yo real.",
  },
  OJBK: {
    cn: "Me da igual",
    intro: "Cuando dices 'me da igual', realmente lo dices en serio.",
    desc: "OJBK no está vacío de preferencias. Simplemente se niega a gastar energía dramática en decisiones que en realidad no importan demasiado.",
  },
  MALO: {
    cn: "Tramposo juguetón",
    intro: "La vida es una misión secundaria y te niegas a jugarla en línea recta.",
    desc: "MALO trata la vida como una side quest llena de saltos, desvíos y chistes. Le incomoda cualquier domesticación total de la conducta y suele encontrar diversión donde la estructura falla.",
  },
  "JOKE-R": {
    cn: "Bromista",
    intro: "Convierte el dolor en remates.",
    desc: "JOKE-R mantiene viva una habitación convirtiendo el dolor en espectáculo. Sus bromas pueden ser talento social, pero también armadura emocional.",
  },
  "WOC!": {
    cn: 'El del "guau"',
    intro: "Un 'guau' dramático ya lo dice todo.",
    desc: "WOC! puede parecer exagerado por fuera, pero por dentro suele estar más medido de lo que aparenta. El estallido dramático suele ser el comentario final, no el inicio de la intervención.",
  },
  "THIN-K": {
    cn: "Pensador",
    intro: "Tu cerebro ya está verificando los hechos de la sala.",
    desc: "THIN-K quiere revisar afirmaciones, motivos, pruebas y sesgos ocultos. Su silencio suele significar revisión interna, no ausencia.",
  },
  SHIT: {
    cn: "Cínico salvador",
    intro: "Criticas al mundo y aun así recoges el desastre.",
    desc: "SHIT se queja de todo y, aun así, termina limpiando el caos. La contradicción es el punto: la irritación no impide cargar con responsabilidad.",
  },
  ZZZZ: {
    cn: "Modo plazo límite",
    intro: "Despiertas cuando la fecha límite ya te respira en la nuca.",
    desc: "ZZZZ puede parecer ausente hasta que el plazo se vuelve real. En cuanto la presión sube, despierta de golpe.",
  },
  POOR: {
    cn: "Haz estrecho",
    intro: "Todo se corta salvo lo único que importa.",
    desc: "POOR solo es 'pobre' en el sentido de que la atención se concentra en lugar de repartirse. Puede ignorar casi todo excepto el objetivo que realmente le importa.",
  },
  MONK: {
    cn: "Monje",
    intro: "La cercanía está bien. Perder tu espacio, no.",
    desc: "MONK valora la separación y la calma. No es frío por accidente; simplemente cree que la intimidad nunca debería borrar la independencia.",
  },
  IMSB: {
    cn: "Tonto que se sabotea",
    intro: "Tu animador interno y tu saboteador interno están en guerra.",
    desc: "IMSB oscila entre 've a por ello' y 'vas a hacer el ridículo'. Lo que desde fuera parece duda suele ser una guerra civil interior.",
  },
  SOLO: {
    cn: "Aislado",
    intro: "Te apartas primero para que nadie te rechace antes.",
    desc: "SOLO protege el yo retirándose primero. Su carcasa áspera suele esconder un miedo fuerte al rechazo y al abandono.",
  },
  FUCK: {
    cn: "Fuerza salvaje",
    intro: "Eliges la vida cruda antes que la contención educada.",
    desc: "FUCK rechaza la contención pulida. Valora la intensidad, la libertad y la fuerza vital por encima del comportamiento socialmente aprobado.",
  },
  DEAD: {
    cn: "Sabio agotado",
    intro: "Miras el juego como si ya lo hubieras terminado.",
    desc: "DEAD se parece a alguien que ya acabó emocionalmente el juego. Suele moverse con una distancia seca, como si muchas metas corrientes ya no valieran gran cosa.",
  },
  IMFW: {
    cn: "Creyente frágil",
    intro: "Confías demasiado cuando por fin te sientes seguro.",
    desc: "IMFW tiende a confiar profundamente cuando percibe seguridad. Su vulnerabilidad no nace tanto de la incompetencia como de ser demasiado sincero y demasiado accesible.",
  },
  HHHH: {
    cn: "Risa de respaldo",
    intro: "El sistema te miró y se rindió riéndose.",
    desc: "HHHH es menos un tipo normal que una señal de que tu patrón de respuestas se resistió a una clasificación limpia. Es el test admitiendo que la biblioteca estándar se quedó sin confianza.",
  },
  DRUNK: {
    cn: "Borracho",
    intro: "El alcohol ha tomado el control del tablero.",
    desc: "DRUNK es el resultado broma oculto del test. Se activa mediante la ruta especial de la bebida y existe más como easter egg dramático que como perfil de personalidad estándar.",
  },
});

export const ES_CONTENT: SbtiLocalizedContent = {
  questions: localizeQuestions(sbtiData.questions, ES_QUESTION_COPY),
  specialQuestions: localizeQuestions(
    sbtiData.specialQuestions,
    ES_QUESTION_COPY
  ),
  typeLibrary: ES_TYPE_LIBRARY,
  dimensionMeta: ES_DIMENSION_META,
  dimExplanations: ES_DIM_EXPLANATIONS,
  dimensionOrder: sbtiData.dimensionOrder,
};
