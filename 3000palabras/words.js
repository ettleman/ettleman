// Example data structure for categories and subcategories
const categories = {
    "Verbs": ["AR Verbs", "ER Verbs","IR Verbs"],
    "Nouns": ["Common Nouns 1", "Common Nouns 2"],
    "Adjectives": ["Common Nouns 1", "Common Nouns 2"],
    "Adverbs": ["Common Nouns 1", "Common Nouns 2"],
    "Prepositions and Conjunctions": ["Common Nouns 1", "Common Nouns 2"],
    "Pronouns": ["Common Nouns 1", "Common Nouns 2"],
    "Numbers and Time": ["Common Nouns 1", "Common Nouns 2"],
    "Professions": ["Common Nouns 1", "Common Nouns 2"],
    // ... other categories
};

const wordPairs = {
    "AR Verbs": [
    ["estar", "to be (temporary)"],
    ["dar", "to give"],
    ["llegar", "to arrive, come, reach"],
    ["pasar", "to pass, to spend (time), to happen"],
    ["quedar", "to stay, remain"],
    ["hablar", "to speak"],
    ["llevar", "to carry, bring"],
    ["dejar", "to leave, abandon, to let, allow"],
    ["encontrar", "to find, encounter"],
    ["llamar", "to call, to name"],
    ["pensar", "to think"],
    ["tomar", "to take, drink"],
    ["tratar", "to treat, handle"],
    ["mirar", "to watch, look at"],
    ["contar", "to count, relate, tell"],
    ["empezar", "to begin, start"],
    ["esperar", "to wait for, to hope"],
    ["buscar", "to search for, look for"],
    ["entrar", "to enter, go in, come in"],
    ["trabajar", "to work"],
    ["recordar", "to remember, remind"],
    ["terminar", "to finish, end"],
    ["comenzar", "to begin, start, commence"],
    ["sacar", "to take out, stick out"],
    ["necesitar", "to need, require"],
    ["resultar", "to turn out (to be)"],
    ["cambiar", "to change"],
    ["presentar", "to introduce"],
    ["crear", "to create, to make"],
    ["considerar", "to consider"],
    ["acabar", "to finish, end"],
    ["ganar", "to win, gain, earn, get, acquire"],
    ["formar", "to form, shape, fashion, make"],
    ["aceptar", "to accept, approve, to agree to"],
    ["realizar", "to achieve, attain, accomplish"],
    ["lograr", "to get, obtain, to achieve, attain"],
    ["explicar", "to explain"],
    ["preguntar", "to ask, inquire"],
    ["tocar", "to touch, to play (an instrument)"],
    ["estudiar", "to study"],
    ["alcanzar", "to reach, catch up"],
    ["utilizar", "to use, utilize"],
    ["pagar", "to pay, pay for"],
    ["ayudar", "to help"],
    ["gustar", "to please, be pleasing"],
    ["jugar", "to play (a game or sport)"],
    ["escuchar", "to listen, hear"],
    ["levantar", "to raise, to lift"],
    ["intentar", "to try, attempt"],
    ["usar", "to use"],
    ["olvidar", "to forget"],
    ["mostrar", "to show"],
    ["ocupar", "to occupy"],
    ["continuar", "to continue"],
    ["fijar", "to fix, fasten, secure"],
    ["acercar", "to bring near"],
    ["dedicar", "to dedicate"],
    ["comprar", "to buy, purchase"],
    ["evitar", "to avoid, to prevent"],
    ["interesar", "to interest, be of interest (to)"],
    ["cerrar", "to close, shut"],
    ["echar", "to throw, cast, fling"],
    ["importar", "to import, to be important"],
    ["observar", "to observe"],
    ["indicar", "to indicate"],
    ["imaginar", "to imagine"],
    ["desarrollar", "to develop, expand, to unroll, unwind, to unfold"],
    ["señalar", "to point out, indicate, to signal"],
    ["preparar", "to prepare, get (something) ready"],
    ["demostrar", "to demonstrate, show"],
    ["significar", "to signify, mean"],
    ["faltar", "to lack, be lacking, be missing"],
    ["acompañar", "to accompany"],
    ["desear", "to desire, want, wish"],
    ["enseñar", "to teach, instruct, train, educate"],
    ["representar", "to represent"],
    ["mandar", "to order (give an order), to send"],
    ["andar", "to walk"],
    ["asegurar", "to assure, secure, insure"],
    ["matar", "to kill, slaughter"],
    ["entregar", "to deliver, hand over"],
    ["colocar", "to locate, place"],
    ["guardar", "to guard, protect, to keep"],
    ["iniciar", "to initiate, begin, start"],
    ["bajar", "to lower, go down, descend, download"],
    ["notar", "to note, notice, observe"],
    ["actuar", "to act, perform, operate"],
    ["acordar", "to decide, resolve, agree (on)"],
    ["cortar", "to cut"],
    ["lanzar", "to throw, hurl, cast, fling"],
    ["aprovechar", "to take advantage of"],
    ["apoyar", "to support, hold up, to back"],
    ["negar", "to deny, refuse"],
    ["avanzar", "to advance, move forward"],
    ["costar", "to cost"],
    ["aumentar", "to increase, add to, rise"],
    ["abandonar", "to abandon, leave behind, desert, to quit, give up"],
    ["obligar", "to oblige"],
    ["aplicar", "to apply"],
    ["expresar", "to express, voice, state"]],
    
    "Common Nouns 1": [["perro", "dog"], ["casa", "house"]],
    
    "Common Nouns 2": [["árbol", "tree"], ["coche", "car"]],
    // ... other subcategories and word pairs
};