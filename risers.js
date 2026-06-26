/*
 * Cafecito. The roster of risers.
 * Single source of truth: each riser's documented morning ritual + a 4-step schedule.
 * Portraits live at assets/risers/<key>.jpg (self-hosted, license-cleared. See CREDITS.md).
 * Routines are drawn largely from Mason Currey's "Daily Rituals" and primary interviews.
 *
 * duo:   duotone filter id (sepia | orange | teal | plum). See the <svg> filters in index.html
 * wake:  documented wake time {h, m}, 24h. The planner slides every step relative to this
 * t:     minutes after wake for each scheduled step
 */
const RISERS = [
  { key: "franklin", name: "Benjamin Franklin", role: "Statesman", est: "1706",
    wake: { h: 5, m: 0 }, time: "5:00 AM", badge: "5AM",
    ritual: "Rose at five and asked himself, “What good shall I do this day?”", price: "+13 virtues",
    duo: "sepia", tint: "#caa874", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise", detail: "Address the morning question: “What good shall I do this day?”" },
      { t: 20, label: "Wash & set the day", detail: "Wash, dress, and lay out the day’s resolutions." },
      { t: 50, label: "Study & breakfast", detail: "Reading and a light breakfast before work." },
      { t: 120, label: "Begin the work", detail: "“Powerful goodness,” into the day’s business." }
    ] },
  { key: "whitman", name: "Walt Whitman", role: "Poet", est: "1819",
    wake: { h: 5, m: 30 }, time: "5:30 AM", badge: "5AM",
    ritual: "Greeted the morning with a sun-bath and a cold sponge, then walked and wrote out of doors.", price: "sun-bath",
    duo: "sepia", tint: "#caa874", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise near first light", detail: "Awake as the day comes on." },
      { t: 15, label: "Air & sun bath", detail: "Sat bare in the morning sun, then a cold sponge-down." },
      { t: 45, label: "Walk out of doors", detail: "Down to the pond and the open road." },
      { t: 90, label: "Write in the open", detail: "Lines jotted outdoors, notebook always in the pocket." }
    ] },
  { key: "murakami", name: "Haruki Murakami", role: "Novelist", est: "1949",
    wake: { h: 4, m: 0 }, time: "4:00 AM", badge: "4AM",
    ritual: "Five hours at the desk, then a ten-kilometre run. For decades.", price: "−120 min",
    duo: "teal", tint: "#1f8a7a", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise", detail: "No alarm needed after years of the same hour." },
      { t: 10, label: "Coffee & desk", detail: "Straight to work in the dark quiet." },
      { t: 15, label: "Write", detail: "Five to six hours, every day, no exceptions." },
      { t: 360, label: "Run or swim", detail: "A 10K run. “The repetition is the thing.”" }
    ] },
  { key: "beethoven", name: "L. van Beethoven", role: "Composer", est: "1770",
    wake: { h: 6, m: 0 }, time: "6:00 AM", badge: "6AM",
    ritual: "Brewed coffee from exactly sixty beans, counted by hand, then composed.", price: "60 beans",
    duo: "plum", tint: "#5a2d5e", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Rise", detail: "Up with the day to compose." },
      { t: 5, label: "Count sixty beans", detail: "Exactly sixty coffee beans per cup. Counted by hand." },
      { t: 15, label: "Coffee & breakfast", detail: "The day cannot begin until the cup is right." },
      { t: 30, label: "Compose", detail: "Work at the desk until two, broken by walks." }
    ] },
  { key: "cook", name: "Tim Cook", role: "Chief Exec", est: "1960",
    wake: { h: 3, m: 45 }, time: "3:45 AM", badge: "3:45",
    ritual: "Reads the overnight email at quarter to four, then straight to the gym.", price: "−75 min",
    duo: "orange", tint: "#e8541e", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise", detail: "Before the rest of the world logs on." },
      { t: 5, label: "Read the overnight email", detail: "Hundreds of messages, in the quiet." },
      { t: 45, label: "The gym", detail: "A daily workout to clear the head." },
      { t: 105, label: "Coffee & the plan", detail: "Into the office ahead of everyone." }
    ] },
  { key: "okeeffe", name: "Georgia O’Keeffe", role: "Painter", est: "1887",
    wake: { h: 5, m: 0 }, time: "Dawn", badge: "DAWN",
    ritual: "Walked at first light to watch the sun arrive, then painted all morning.", price: "+1 sunrise",
    duo: "sepia", tint: "#caa874", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise before light", detail: "Awake in the dark of the desert." },
      { t: 20, label: "Walk at first light", detail: "Out to watch the sun arrive over the mesa." },
      { t: 70, label: "Breakfast", detail: "Tea and quiet before the studio." },
      { t: 100, label: "Paint", detail: "The clearest hours of the day at the easel." }
    ] },
  { key: "kobe", name: "Kobe Bryant", role: "Athlete", est: "1978",
    wake: { h: 4, m: 0 }, time: "4:00 AM", badge: "4AM",
    ritual: "The 4 a.m. club. On the court before the city woke, every day.", price: "−120 min",
    duo: "orange", tint: "#e8541e", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise. The 4 a.m. club", detail: "On the floor before the city wakes." },
      { t: 15, label: "On the court", detail: "Shooting and footwork in the empty gym." },
      { t: 135, label: "Conditioning", detail: "Track and weights. The unseen work." },
      { t: 255, label: "Film & recovery", detail: "Study tape, then rebuild for tomorrow." }
    ] },
  { key: "hemingway", name: "Ernest Hemingway", role: "Novelist", est: "1899",
    wake: { h: 6, m: 0 }, time: "First light", badge: "DAWN",
    ritual: "Wrote standing at first light and stopped only when he knew what came next.", price: "till noon",
    duo: "teal", tint: "#1f8a7a", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise with first light", detail: "Begin “as soon as there is light.”" },
      { t: 10, label: "Stand at the desk", detail: "Write standing up, in the cool of the morning." },
      { t: 15, label: "Write until noon", detail: "Stop only when you know what happens next." },
      { t: 330, label: "Let the well refill", detail: "Walk away while the next day’s words gather." }
    ] },
  { key: "kant", name: "Immanuel Kant", role: "Philosopher", est: "1724",
    wake: { h: 5, m: 0 }, time: "5:00 AM", badge: "5AM",
    ritual: "Rose at exactly five for forty years. Neighbours set their clocks by him.", price: "40 years",
    duo: "plum", tint: "#5a2d5e", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise. Exactly five", detail: "Up at five for over forty years, no exceptions." },
      { t: 5, label: "Weak tea & a pipe", detail: "One pipe, no more, while thinking." },
      { t: 30, label: "Write & prep lectures", detail: "The mind at its sharpest before dawn." },
      { t: 120, label: "Lecture", detail: "To the university, punctual to the minute." }
    ] },
  { key: "morrison", name: "Toni Morrison", role: "Writer", est: "1931",
    wake: { h: 5, m: 0 }, time: "Before dawn", badge: "DAWN",
    ritual: "Rose before dawn to watch the light come, then wrote in the quiet.", price: "pre-dawn",
    duo: "sepia", tint: "#caa874", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Rise before dawn", detail: "Awake while it is still dark." },
      { t: 10, label: "Coffee, watch the light come", detail: "“I love the part before the light arrives.”" },
      { t: 30, label: "Write", detail: "The early hours, before the day’s other selves." },
      { t: 180, label: "Into the day", detail: "Step into the world once the pages are done." }
    ] },
  { key: "aurelius", name: "Marcus Aurelius", role: "Stoic Emperor", est: "121",
    wake: { h: 5, m: 30 }, time: "First light", badge: "DAWN",
    ritual: "Met the dawn with a reminder: rise to do the work of a human being.", price: "1 reminder",
    duo: "orange", tint: "#e8541e", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise at first light", detail: "“At dawn, when you have trouble getting up…”" },
      { t: 5, label: "The morning reminder", detail: "“…tell yourself: I have work to do as a human being.”" },
      { t: 25, label: "Cold wash", detail: "Meet the day plainly, without softness." },
      { t: 45, label: "Counsel & letters", detail: "The emperor’s duties, met with reason." }
    ] },
  { key: "darwin", name: "Charles Darwin", role: "Naturalist", est: "1809",
    wake: { h: 7, m: 0 }, time: "7:00 AM", badge: "7AM",
    ritual: "A famously precise schedule. A walk, breakfast alone, then his sharpest 90 minutes.", price: "7:45 sharp",
    duo: "teal", tint: "#1f8a7a", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise & a short walk", detail: "A turn around the garden before the day." },
      { t: 45, label: "Breakfast alone", detail: "At 7:45 sharp. And quietly." },
      { t: 75, label: "The study, 8 to 9:30", detail: "His sharpest, most productive ninety minutes." },
      { t: 165, label: "Read the letters", detail: "Correspondence with the wider world." }
    ] },
  { key: "balzac", name: "Honoré de Balzac", role: "Novelist", est: "1799",
    wake: { h: 1, m: 0 }, time: "1:00 AM", badge: "1AM",
    ritual: "Woke at one in the morning and wrote for hours, fuelled by as many as fifty cups of coffee.", price: "50 cups",
    duo: "orange", tint: "#e8541e", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise at one", detail: "Up in the dead of night to write by candlelight." },
      { t: 5, label: "Black coffee", detail: "The first of many. Cup after cup to keep the mind alight." },
      { t: 15, label: "Write", detail: "Hours at the desk in a monk’s robe, by candle." },
      { t: 420, label: "Dawn coffee & a nap", detail: "A short sleep after sunrise, then back to the pages." }
    ] },
  { key: "trollope", name: "Anthony Trollope", role: "Novelist", est: "1815",
    wake: { h: 5, m: 30 }, time: "5:30 AM", badge: "5:30",
    ritual: "Wrote 3,000 words before his post-office job. 250 words every fifteen minutes by the clock.", price: "250/15min",
    duo: "sepia", tint: "#caa874", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise", detail: "Coffee brought by a servant paid to be punctual." },
      { t: 30, label: "Re-read yesterday", detail: "Half an hour with the previous day’s pages." },
      { t: 60, label: "250 words / 15 min", detail: "Watch on the desk. Three thousand words by the clock." },
      { t: 210, label: "Off to the Post Office", detail: "A full day’s writing done before the day job began." }
    ] },
  { key: "dickens", name: "Charles Dickens", role: "Novelist", est: "1812",
    wake: { h: 7, m: 0 }, time: "7:00 AM", badge: "7AM",
    ritual: "At his desk nine to two without fail, then a restless three-hour walk across London.", price: "12 mi walk",
    duo: "plum", tint: "#5a2d5e", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Rise", detail: "Seven o’clock, every single morning." },
      { t: 60, label: "Breakfast", detail: "A punctual eight-o’clock breakfast." },
      { t: 120, label: "Write 9 to 2", detail: "At the desk in a precisely arranged study." },
      { t: 420, label: "A three-hour walk", detail: "Twelve miles or more to shake the story loose." }
    ] },
  { key: "dickinson", name: "Emily Dickinson", role: "Poet", est: "1830",
    wake: { h: 5, m: 0 }, time: "First light", badge: "DAWN",
    ritual: "Baked bread and tended the garden at first light, jotting lines on scraps tucked in her apron.", price: "white dress",
    duo: "sepia", tint: "#caa874", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise at first light", detail: "Into a simple white dress with pockets for pencils." },
      { t: 20, label: "Bake bread", detail: "Her father approved no bread but hers." },
      { t: 60, label: "Tend the garden", detail: "Lines arrived between the rows. Caught on scraps." },
      { t: 120, label: "Write", detail: "Compose in the quiet of the still house." }
    ] },
  { key: "mozart", name: "W. A. Mozart", role: "Composer", est: "1756",
    wake: { h: 6, m: 0 }, time: "6:00 AM", badge: "6AM",
    ritual: "Hair dressed by six and composing by seven, before a long day of lessons and concerts.", price: "by 7am",
    duo: "plum", tint: "#5a2d5e", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise & dress", detail: "Hair done and dressed by six o’clock sharp." },
      { t: 60, label: "Compose", detail: "The morning’s clearest hours given to new work." },
      { t: 180, label: "Teach", detail: "Lessons to paying pupils through midday." },
      { t: 360, label: "Perform, then compose late", detail: "Concerts by day, new pages again past midnight." }
    ] },
  { key: "voltaire", name: "Voltaire", role: "Writer", est: "1694",
    wake: { h: 4, m: 0 }, time: "4:00 AM", badge: "4AM",
    ritual: "Worked and dictated from bed before dawn, kept alert by prodigious amounts of coffee.", price: "40 cups",
    duo: "orange", tint: "#e8541e", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Begin. In bed", detail: "The day’s work started without leaving the sheets." },
      { t: 5, label: "Coffee", detail: "Cup after cup. By some accounts forty a day." },
      { t: 15, label: "Dictate", detail: "Letters, essays and pamphlets to a waiting secretary." },
      { t: 120, label: "Read & revise", detail: "The rest of the day for study and correspondence." }
    ] },
  { key: "tolstoy", name: "Leo Tolstoy", role: "Novelist", est: "1828",
    wake: { h: 8, m: 0 }, time: "8:00 AM", badge: "8AM",
    ritual: "Demanded absolute solitude each morning. No one was to disturb the study until he emerged.", price: "do not disturb",
    duo: "teal", tint: "#1f8a7a", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise", detail: "A walk and a wash to wake the mind." },
      { t: 30, label: "Coffee, then the study", detail: "The door closed; total solitude required." },
      { t: 60, label: "Write", detail: "“I must write each day,” he insisted, “for myself.”" },
      { t: 240, label: "Lunch & letters", detail: "The world allowed back in by early afternoon." }
    ] },
  { key: "nietzsche", name: "F. Nietzsche", role: "Philosopher", est: "1844",
    wake: { h: 5, m: 0 }, time: "5:00 AM", badge: "5AM",
    ritual: "Rose at five for tea and a long walk. “All truly great thoughts are conceived by walking.”", price: "+10 mi walk",
    duo: "plum", tint: "#5a2d5e", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Rise at five", detail: "Cold water and a spare breakfast." },
      { t: 30, label: "Write", detail: "The sharpest hours given to the morning’s thoughts." },
      { t: 180, label: "A long walk", detail: "Miles through the hills, notebook in hand." },
      { t: 360, label: "Tea & reading", detail: "The afternoon for books. And more walking." }
    ] },
  { key: "stravinsky", name: "Igor Stravinsky", role: "Composer", est: "1882",
    wake: { h: 8, m: 0 }, time: "8:00 AM", badge: "8AM",
    ritual: "Composed in a soundproofed room. And, when stuck, stood on his head to clear the brain.", price: "headstand",
    duo: "teal", tint: "#1f8a7a", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise", detail: "Breakfast, then straight to the studio." },
      { t: 60, label: "Compose in silence", detail: "He could not work if anyone might overhear." },
      { t: 150, label: "Stuck? Stand on your head", detail: "A headstand to “clear the brain” and reset." },
      { t: 240, label: "Afternoon session", detail: "Back to work after a break and a walk." }
    ] },
  { key: "milton", name: "John Milton", role: "Poet", est: "1608",
    wake: { h: 4, m: 0 }, time: "4:00 AM", badge: "4AM",
    ritual: "Rose at four to have the Hebrew scriptures read aloud, then sat composing verse in his head.", price: "4am verse",
    duo: "sepia", tint: "#caa874", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise at four", detail: "Up before dawn, blind, and listening." },
      { t: 15, label: "Scripture read aloud", detail: "Half an hour of the Hebrew Bible read to him." },
      { t: 45, label: "Contemplation", detail: "Sitting still, composing verse from memory." },
      { t: 120, label: "Dictate", detail: "The night’s lines given to a waiting scribe." }
    ] },
  { key: "tharp", name: "Twyla Tharp", role: "Choreographer", est: "1941",
    wake: { h: 5, m: 30 }, time: "5:30 AM", badge: "5:30",
    ritual: "The ritual isn’t the workout. It’s hailing the 5:30 cab, the moment the day is decided.", price: "hail the cab",
    duo: "orange", tint: "#e8541e", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise at 5:30", detail: "The day begins before the mind can argue." },
      { t: 10, label: "Hail the cab", detail: "“The ritual is the cab. The rest is just exercise.”" },
      { t: 25, label: "Two hours at the gym", detail: "The workout done before the workday starts." },
      { t: 150, label: "To the studio", detail: "Into rehearsal, the body already awake." }
    ] },
  { key: "obama", name: "Barack Obama", role: "President", est: "1961",
    wake: { h: 7, m: 0 }, time: "7:00 AM", badge: "7AM",
    ritual: "A pre-dawn workout and breakfast with family. Though the real work came late at night.", price: "night owl",
    duo: "orange", tint: "#e8541e", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise & work out", detail: "Forty-five minutes of cardio and weights." },
      { t: 60, label: "Breakfast with family", detail: "A fixed, fiercely protected ritual." },
      { t: 120, label: "The morning briefing", detail: "Into the day’s first decisions." },
      { t: 840, label: "Night-owl hours", detail: "The quiet of the night for reading and writing." }
    ] },
  { key: "frida", name: "Frida Kahlo", role: "Painter", est: "1907",
    wake: { h: 7, m: 0 }, time: "7:00 AM", badge: "7AM",
    ritual: "Dressed with fierce intention each morning, then painted. From the easel, or from bed with a mirror overhead.", price: "+1 mirror",
    duo: "plum", tint: "#5a2d5e", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise in the Casa Azul", detail: "The blue house and its garden at first light." },
      { t: 30, label: "Dress with intention", detail: "Tehuana dress, braided hair, flowers. Armour for the day." },
      { t: 60, label: "Paint", detail: "At the easel, or from bed beneath a mirror." },
      { t: 240, label: "Garden & visitors", detail: "The afternoon among friends and the courtyard." }
    ] },
  { key: "hugo", name: "Victor Hugo", role: "Writer", est: "1802",
    wake: { h: 6, m: 0 }, time: "Dawn", badge: "DAWN",
    ritual: "Woke to a daily signal at dawn, wrote facing the sea, then scrubbed himself with ice water on the roof.", price: "ice rubdown",
    duo: "teal", tint: "#1f8a7a", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Wake at dawn", detail: "Roused by a signal. A gunshot from the harbour." },
      { t: 10, label: "Coffee & two raw eggs", detail: "A spare breakfast and the morning’s letters." },
      { t: 30, label: "Write standing", detail: "At a high desk before the open sea." },
      { t: 180, label: "Ice rubdown on the roof", detail: "A bracing wash in the cold morning air." }
    ] },
  { key: "austen", name: "Jane Austen", role: "Novelist", est: "1775",
    wake: { h: 6, m: 30 }, time: "6:30 AM", badge: "6:30",
    ritual: "Practised the piano before anyone woke, made the family breakfast, then wrote in the sitting room. Sliding the pages away whenever the door creaked.", price: "creaky door",
    duo: "plum", tint: "#5a2d5e", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Piano before breakfast", detail: "At the instrument while the house still slept. For no audience but herself." },
      { t: 45, label: "Make the breakfast", detail: "Her one household duty: the tea, the toast, the morning things." },
      { t: 90, label: "Write at the little desk", detail: "Twelve small sheets and a mahogany writing box, by the window." },
      { t: 210, label: "Hide the pages", detail: "A creak of the door. Slide the manuscript away before visitors see." }
    ] },
  { key: "thoreau", name: "H. D. Thoreau", role: "Essayist", est: "1817",
    wake: { h: 5, m: 0 }, time: "First light", badge: "DAWN",
    ritual: "Bathed in Walden Pond at sunrise, “a religious exercise,” then sat in the doorway and walked the woods with the day still new.", price: "pond bath",
    duo: "teal", tint: "#1f8a7a", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Wake with the dawn", detail: "“Morning is when I am awake and there is a dawn in me.”" },
      { t: 10, label: "Bathe in the pond", detail: "A sunrise swim. “One of the best things which I did.”" },
      { t: 40, label: "Sit in the doorway", detail: "Hours lost to reverie, the sun crossing the threshold." },
      { t: 120, label: "Walk the woods", detail: "Out to survey and to notice. Notebook in the pocket." }
    ] },
  { key: "goethe", name: "J. W. von Goethe", role: "Polymath", est: "1749",
    wake: { h: 7, m: 0 }, time: "7:00 AM", badge: "7AM",
    ritual: "Dictated to a waiting secretary the moment he woke, catching the morning’s clearest thoughts before the day grew loud.", price: "dictate",
    duo: "orange", tint: "#e8541e", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Wake & reflect", detail: "The freshest hours. “The morning hours have gold in their mouth.”" },
      { t: 15, label: "Dictate to the secretary", detail: "Verse and letters, caught before they slipped away." },
      { t: 120, label: "Coffee & study", detail: "Science, colour theory, the day’s reading." },
      { t: 240, label: "Receive the world", detail: "Visitors and the affairs of the court by afternoon." }
    ] },
  { key: "jefferson", name: "Thomas Jefferson", role: "President", est: "1743",
    wake: { h: 5, m: 0 }, time: "Sunrise", badge: "DAWN",
    ritual: "Soaked his feet in cold water every morning for sixty years, certain it kept him well. Then read and wrote until the household stirred.", price: "cold soak",
    duo: "teal", tint: "#1f8a7a", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise with the sun", detail: "“Whenever the sun rises I am awake.” Never found abed past dawn." },
      { t: 5, label: "Cold-water foot bath", detail: "Every morning for sixty years. His secret to good health." },
      { t: 20, label: "Read the thermometer", detail: "The dawn temperature logged, as it had been for decades." },
      { t: 40, label: "Read & write", detail: "Correspondence and books before the day’s demands." }
    ] },
  { key: "tchaikovsky", name: "P. I. Tchaikovsky", role: "Composer", est: "1840",
    wake: { h: 7, m: 30 }, time: "7:30 AM", badge: "7:30",
    ritual: "Tea and an hour with his books, a turn about the garden, then to the desk. Trusting routine, not mood, to make the music.", price: "by the clock",
    duo: "plum", tint: "#5a2d5e", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise for tea", detail: "Tea and the morning papers, read without hurry." },
      { t: 30, label: "Read", detail: "Scripture, history, philosophy. An hour before work." },
      { t: 60, label: "A short walk", detail: "A turn outdoors to settle the mind." },
      { t: 90, label: "Compose", detail: "“Inspiration is a guest that does not visit the lazy.”" }
    ] },
  { key: "gandhi", name: "Mahatma Gandhi", role: "Reformer", est: "1869",
    wake: { h: 4, m: 0 }, time: "4:00 AM", badge: "4AM",
    ritual: "Rose at four for prayer and a long walk, then sat to the spinning wheel. The same humble hour, in war or in peace.", price: "charkha",
    duo: "sepia", tint: "#caa874", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise at four", detail: "Up before dawn for ablutions in the dark." },
      { t: 15, label: "Morning prayer", detail: "Silent meditation and shared prayer at first light." },
      { t: 60, label: "A long walk", detail: "Miles on foot. His clearest thinking done in motion." },
      { t: 120, label: "Spin at the wheel", detail: "An hour at the charkha. Discipline spun into thread." }
    ] },
  { key: "angelou", name: "Maya Angelou", role: "Poet & Memoirist", est: "1928",
    wake: { h: 5, m: 30 }, time: "5:30 AM", badge: "5:30",
    ritual: "Rose at 5:30 and wrote in a bare rented hotel room. Bed, dictionary, Bible, sherry. Until two in the afternoon.", price: "till 2pm",
    duo: "sepia", tint: "#caa874", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise", detail: "Woke around 5:30 and was ready for coffee by six, usually with her husband." },
      { t: 90, label: "To the hotel room", detail: "Reached a tiny rented room by seven, stripped of pictures, flowers and fresh sheets." },
      { t: 105, label: "Write", detail: "Lay across the bed and wrote in longhand on yellow legal pads all morning." },
      { t: 510, label: "Stop at two", detail: "Left around two, read the day's pages over, then showered and made dinner." }
    ] },
  { key: "woolf", name: "Virginia Woolf", role: "Novelist", est: "1882",
    wake: { h: 9, m: 0 }, time: "9:00 AM", badge: "9AM",
    ritual: "Coffee in bed, then to the garden lodge to write each morning, ten to one. Three hours she guarded as sacred.", price: "10 to 1",
    duo: "orange", tint: "#e8541e", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Coffee in bed", detail: "Took coffee in bed and let the household wake around her." },
      { t: 60, label: "To the lodge", detail: "Walked down to the writing lodge at Monk's House by about ten." },
      { t: 70, label: "Write till one", detail: "Worked fiction or reviews in pen and purple-inked notebook until about one." },
      { t: 240, label: "Revise & walk", detail: "Afternoons were for revising, Hogarth Press printing, letters, and long walks on the Sussex downs." }
    ] },
  { key: "twain", name: "Mark Twain", role: "Novelist & Humorist", est: "1835",
    wake: { h: 7, m: 30 }, time: "7:30 AM", badge: "7:30",
    ritual: "After a hearty breakfast he wrote in his hilltop study till dinner near five, skipping lunch. The family blew a horn if truly needed.", price: "no lunch",
    duo: "teal", tint: "#1f8a7a", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Hearty breakfast", detail: "Ate a hearty breakfast before climbing the hill to work." },
      { t: 60, label: "To the study", detail: "Walked to a private octagonal study built for him at Quarry Farm." },
      { t: 90, label: "Write, no lunch", detail: "Worked uninterrupted through the day, skipping lunch; the family blew a horn if they truly needed him." },
      { t: 570, label: "Dinner & read aloud", detail: "Came down for dinner about five and read the day's pages aloud to the assembled family." }
    ] },
  { key: "beauvoir", name: "S. de Beauvoir", role: "Philosopher & Writer", est: "1908",
    wake: { h: 9, m: 0 }, time: "9:00 AM", badge: "9AM",
    ritual: "Disliked starting the day; tea, then work ten to one, friends midday, back to the desk five to nine.", price: "tea first",
    duo: "plum", tint: "#5a2d5e", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Tea", detail: "Disliked starting the day, so began slowly with tea." },
      { t: 60, label: "Morning work", detail: "Got under way at about ten o'clock and worked until one." },
      { t: 240, label: "Friends & lunch", detail: "Broke at one to see friends, often lunching with Sartre." },
      { t: 480, label: "Evening work", detail: "Returned to writing at five, frequently at Sartre's, until nine." }
    ] },
  { key: "mann", name: "Thomas Mann", role: "Novelist", est: "1875",
    wake: { h: 8, m: 0 }, time: "8:00 AM", badge: "8AM",
    ritual: "At nine he sealed the study door; no visitor, telephone, or child dared disturb the morning hours until noon.", price: "door shut",
    duo: "sepia", tint: "#caa874", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise", detail: "Awake by eight, he drank a cup of coffee with his wife, then took a bath and dressed." },
      { t: 30, label: "Breakfast", detail: "Breakfast came at half past eight before the working day began." },
      { t: 60, label: "Study door shut", detail: "At nine he closed the study to all visitors, the telephone, and his family." },
      { t: 240, label: "Until noon", detail: "He wrote until midday; whatever did not come by noon waited until the next morning." }
    ] },
  { key: "wodehouse", name: "P. G. Wodehouse", role: "Novelist", est: "1881",
    wake: { h: 7, m: 30 }, time: "7:30 AM", badge: "7:30",
    ritual: "Rose at half past seven for the \"daily dozen\" calisthenics he had done every morning since 1920.", price: "daily dozen",
    duo: "orange", tint: "#e8541e", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Rise", detail: "Got up at half past seven and did the \"daily dozen\" calisthenics he had performed since 1920." },
      { t: 30, label: "Breakfast book", detail: "Ate toast with honey or marmalade, coffee cake and a mug of tea while reading a mystery novel." },
      { t: 60, label: "First pipe", detail: "Lit the first pipe of the day, crumbling cigars into the bowl in place of pipe tobacco." },
      { t: 90, label: "To the study", detail: "At nine, after a short walk with the dogs, he retired to his pine-clad study for the morning's work." }
    ] },
  { key: "auden", name: "W. H. Auden", role: "Poet", est: "1907",
    wake: { h: 6, m: 15 }, time: "6:15 AM", badge: "6AM",
    ritual: "Lived by the watch: rose just after six and timed eating, writing, even the mailman's arrival to the minute.", price: "by the watch",
    duo: "teal", tint: "#1f8a7a", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise", detail: "Rose shortly after six, made himself coffee, and settled down to work quickly." },
      { t: 15, label: "The \"mental kitchen\"", detail: "Took a dose of Benzedrine, one of the \"labour-saving devices\" he kept in his \"mental kitchen.\"" },
      { t: 45, label: "At the desk", detail: "Worked through the morning, his mind sharpest from seven until eleven-thirty." },
      { t: 255, label: "Watch in hand", detail: "Meals, writing, shopping and chores were all timed to the minute against his ever-checked watch." }
    ] },
  { key: "butler", name: "Octavia Butler", role: "Novelist", est: "1947",
    wake: { h: 3, m: 0 }, time: "3:00 AM", badge: "3AM",
    ritual: "Rose at three to write before the day's \"horrible little jobs\" could steal her pages. Habit over inspiration, always.", price: "before dawn",
    duo: "plum", tint: "#5a2d5e", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise", detail: "Woke between two and four in the morning, often the only quiet hours she had before work." },
      { t: 20, label: "To the page", detail: "Sat down to write at once, treating the early hours as obligatory shift work." },
      { t: 40, label: "Four hours", detail: "Held herself to a minimum of four hours of writing every single morning." },
      { t: 240, label: "Habit over muse", detail: "Trusted habit, which she called more dependable than inspiration, to carry her whether inspired or not." }
    ] },
  { key: "freud", name: "S. Freud", role: "Psychoanalyst", est: "1856",
    wake: { h: 7, m: 0 }, time: "7:00 AM", badge: "7AM",
    ritual: "Rose at seven and revived with a cold shower, then saw patients in exact fifty-five-minute hours from eight until one.", price: "on the hour",
    duo: "sepia", tint: "#caa874", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise", detail: "Woke about seven and revived himself with a cold shower, though night work often left him groggy." },
      { t: 30, label: "Barber & breakfast", detail: "A barber called to trim his beard while he took a quick breakfast and read the Neue Freie Presse." },
      { t: 60, label: "Patients", detail: "From eight he saw analytic patients in exact fifty-five-minute sessions, five minutes apart, rigorously punctual." },
      { t: 360, label: "Lunch & Ringstrasse", detail: "At one the family gathered for the sacred midday meal, then he marched briskly around the Ringstrasse buying cigars." }
    ] },
  { key: "jung", name: "C. Jung", role: "Psychiatrist", est: "1875",
    wake: { h: 7, m: 0 }, time: "7:00 AM", badge: "7AM",
    ritual: "At his Bollingen tower he rose at seven, wished his pots and pans good morning, then wrote for two undistracted hours.", price: "+2 hr quiet",
    duo: "orange", tint: "#e8541e", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Rise", detail: "Woke at seven in the stone tower at Bollingen, which had no electricity." },
      { t: 10, label: "Greet the kitchen", detail: "He said good morning to his saucepans, pots and frying pans." },
      { t: 25, label: "Long breakfast", detail: "A leisurely meal of coffee, salami, fruit, bread and butter." },
      { t: 90, label: "Two hours' writing", detail: "He retired to his study for two hours of concentrated writing." }
    ] },
  { key: "kierkegaard", name: "S. Kierkegaard", role: "Philosopher", est: "1813",
    wake: { h: 7, m: 0 }, time: "7:00 AM", badge: "7AM",
    ritual: "Wrote, then a midday \"people-bath\" through Copenhagen for ideas; drank black coffee poured over a pyramid of sugar heaped above the rim.", price: "+1 long walk",
    duo: "teal", tint: "#1f8a7a", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise & write", detail: "His day was ruled by three pursuits: writing, walking, and a great deal of coffee." },
      { t: 300, label: "People-bath", detail: "He walked among the Copenhagen crowds he loved, taking what he called a \"people-bath\" to gather ideas." },
      { t: 420, label: "Write in his hat", detail: "When inspiration struck he hurried home and wrote standing at his desk, hat still on his head." },
      { t: 480, label: "The sugar pyramid", detail: "He heaped sugar above the cup's rim, poured strong black coffee over it to dissolve it, and drank it down swiftly." }
    ] },
  { key: "douglass", name: "F. Douglass", role: "Abolitionist", est: "1818",
    wake: { h: 6, m: 30 }, time: "6:30 AM", badge: "6:30",
    ritual: "At Cedar Hill he breakfasted, walked the grounds with his cane, then withdrew to the Growlery to write and read.", price: "self-made",
    duo: "plum", tint: "#5a2d5e", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise & breakfast", detail: "He started the day with breakfast at his Cedar Hill home overlooking Washington." },
      { t: 45, label: "Estate walk", detail: "Walking stick in hand, he strolled his grounds, alone or with family and guests." },
      { t: 120, label: "The Growlery", detail: "After breakfast and a walk he withdrew to his small outdoor study to write, read and contemplate." },
      { t: 300, label: "Weights on the lawn", detail: "He kept fit by lifting weights on his front lawn and tending the property." }
    ] },
  { key: "tesla", name: "Nikola Tesla", role: "Inventor", est: "1856",
    wake: { h: 9, m: 0 }, time: "9:00 AM", badge: "9AM",
    ritual: "At the lab by nine, dinner at exactly 8:10, then work past three. And eight miles walked daily to think.", price: "9 to 6",
    duo: "sepia", tint: "#caa874", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "To the lab", detail: "Reached his laboratory at nine each morning and worked through until six or later." },
      { t: 540, label: "Walk & think", detail: "Walked eight to ten miles a day, often hotel to lab, working problems in his head." },
      { t: 670, label: "Dinner at 8:10", detail: "Dined alone at precisely 8:10, demanding a fresh stack of napkins to polish his cutlery." },
      { t: 1080, label: "Night work", detail: "Returned to the lab after dinner and worked on until around three in the morning." }
    ] },
  { key: "schulz", name: "Charles Schulz", role: "Cartoonist", est: "1922",
    wake: { h: 6, m: 30 }, time: "Daybreak", badge: "DAWN",
    ritual: "Rose at daybreak, drove the children to school at 8:20, then drew, lettered and inked every Peanuts strip himself until about four.", price: "daily strip",
    duo: "orange", tint: "#e8541e", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Rise", detail: "Rose at daybreak on weekdays, showered and shaved." },
      { t: 60, label: "Family breakfast", detail: "Woke the children for breakfast, usually pancakes made by his wife." },
      { t: 110, label: "School run", detail: "At 8:20 drove the kids to school in the family station wagon, picking up the neighbours' children on the way." },
      { t: 140, label: "Drawing board", detail: "Sat down in the private studio beside his house and drew Peanuts himself, breaking only for a ham sandwich and milk, until around four." }
    ] },
  { key: "nightingale", name: "F. Nightingale", role: "Nurse & statistician", est: "1820",
    wake: { h: 6, m: 0 }, time: "Dawn", badge: "DAWN",
    ritual: "Twenty hours on her feet in the Scutari wards, then alone at night among the beds with a little lamp.", price: "the lamp",
    duo: "teal", tint: "#1f8a7a", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise at Scutari", detail: "Rose early in the barrack hospital to superintend the day's care of the wounded." },
      { t: 60, label: "Morning rounds", detail: "Nurses washed and dressed the directed wounds in readiness for the medical officers' morning visits." },
      { t: 300, label: "Superintend", detail: "She worked the wards as long as twenty hours at a stretch, giving out stores and enforcing cleanliness." },
      { t: 1080, label: "Lady with the Lamp", detail: "After the officers retired she made solitary rounds among the beds, a little lamp in her hand." }
    ] },
  { key: "corbusier", name: "Le Corbusier", role: "Architect", est: "1887",
    wake: { h: 6, m: 0 }, time: "6:00 AM", badge: "6AM",
    ritual: "Rose at six for forty-five minutes of calisthenics, painted all morning, and saved architecture for two o'clock.", price: "paint first",
    duo: "plum", tint: "#5a2d5e", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise", detail: "Woke at six o'clock sharp each morning." },
      { t: 5, label: "Calisthenics", detail: "Performed forty-five minutes of calisthenics." },
      { t: 120, label: "Breakfast", detail: "Served his wife coffee, then ate breakfast with her at eight." },
      { t: 135, label: "Paint & draw", detail: "Devoted the rest of the morning to private painting, drawing, and writing." }
    ] },
  { key: "flwright", name: "F. L. Wright", role: "Architect", est: "1867",
    wake: { h: 4, m: 0 }, time: "4:00 AM", badge: "4AM",
    ritual: "Woke near four, mind clear but unable to sleep. Worked three or four hours, then returned to bed for a nap.", price: "4am, fresh",
    duo: "sepia", tint: "#caa874", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Wake clear", detail: "Woke around four, unable to sleep again but with a clear mind." },
      { t: 5, label: "Rise at once", detail: "Got up rather than lie awake, and set to work." },
      { t: 30, label: "Design", detail: "Worked steadily for three or four hours in the predawn quiet." },
      { t: 240, label: "Back to bed", detail: "Returned to bed for another nap once the work was done." }
    ] },
  { key: "troosevelt", name: "T. Roosevelt", role: "President", est: "1858",
    wake: { h: 7, m: 0 }, time: "7:00 AM", badge: "7AM",
    ritual: "On the 1900 campaign trail his day ran seven to midnight: breakfast at seven, a speech at half past, a history book by eight.", price: "vigor",
    duo: "orange", tint: "#e8541e", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Breakfast", detail: "Began the day at seven o'clock with breakfast." },
      { t: 30, label: "Speech", detail: "Delivered a speech at half past seven." },
      { t: 60, label: "Read history", detail: "Sat down with a historical work at eight o'clock." },
      { t: 300, label: "Read ornithology", detail: "Turned to an ornithological work at noon." }
    ] },
  { key: "schultz", name: "Howard Schultz", role: "Starbucks CEO", est: "1953",
    wake: { h: 4, m: 30 }, time: "4:30 AM", badge: "4:30",
    ritual: "Up at 4:30 to walk his three dogs and work out, then coffee at 5:45 for himself and his wife from an eight-cup Bodum press.", price: "first in",
    duo: "teal", tint: "#1f8a7a", shadow: "#e9b23a",
    schedule: [
      { t: 0, label: "Rise", detail: "Woke at 4:30 a.m. to begin the day before dawn." },
      { t: 5, label: "Walk the dogs", detail: "Took his three dogs out for an early walk." },
      { t: 30, label: "Work out", detail: "Exercised before turning to coffee." },
      { t: 75, label: "Press the coffee", detail: "At 5:45 a.m. made coffee for himself and his wife in an eight-cup Bodum French press." }
    ] },
  { key: "skinner", name: "B. F. Skinner", role: "Psychologist", est: "1904",
    wake: { h: 6, m: 0 }, time: "6:00 AM", badge: "6AM",
    ritual: "Conditioned himself like a lab rat: a desk lamp wired to a clock logged his hours, plotted on a cumulative curve.", price: "on the clock",
    duo: "plum", tint: "#5a2d5e", shadow: "#20a39e",
    schedule: [
      { t: 0, label: "Rise", detail: "Woke between 6 and 6:30 a.m., often after the radio news." },
      { t: 20, label: "Cornflakes & coffee", detail: "Breakfasted alone on cornflakes and coffee timed by the stove, reading the newspaper." },
      { t: 60, label: "Down to the study", detail: "By about seven he descended to his walnut-panelled basement study." },
      { t: 65, label: "Clock the writing", detail: "Wrote by the clock, a desk lamp triggering a timer, and plotted his output on a cumulative curve." }
    ] },
  { key: "stevens", name: "Wallace Stevens", role: "Poet", est: "1879",
    wake: { h: 5, m: 30 }, time: "Daybreak", badge: "DAWN",
    ritual: "Rose at daybreak; composed verse in his head on the two-mile walk to the insurance office, then dictated it to his secretary.", price: "poems afoot",
    duo: "sepia", tint: "#caa874", shadow: "#e8541e",
    schedule: [
      { t: 0, label: "Rise at daybreak", detail: "Rose at daybreak, shaved, and dressed." },
      { t: 30, label: "Exercise", detail: "At six he began his exercises." },
      { t: 90, label: "Massage & bathe", detail: "At seven he massaged and bathed." },
      { t: 180, label: "Walk and compose", detail: "From eight-thirty he walked two-plus miles downtown to the Hartford office, composing verse along the way." }
    ] },
  { key: "bergman", name: "Ingmar Bergman", role: "Film director", est: "1918",
    wake: { h: 8, m: 0 }, time: "8:00 AM", badge: "8AM",
    ritual: "Same schedule for years on Faro: up at eight, write nine to noon, then the exact same odd lunch every single day.", price: "9 to noon",
    duo: "orange", tint: "#e8541e", shadow: "#6b3b6e",
    schedule: [
      { t: 0, label: "Rise", detail: "Woke at 8:00 a.m. at his home on the remote island of Faro." },
      { t: 60, label: "Write", detail: "Wrote scripts from nine until noon, his core creative block." },
      { t: 240, label: "Same lunch", detail: "Ate the identical lunch daily: whipped sour milk, strawberry jam and corn flakes." },
      { t: 300, label: "Second session", detail: "Worked again from one until three, then slept for an hour." }
    ] }
];

if (typeof module !== 'undefined') module.exports = RISERS;
