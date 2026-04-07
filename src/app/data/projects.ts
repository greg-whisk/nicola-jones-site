export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: 'Murals' | 'Books' | 'Illustration' | 'Theatre & Events';
  client: string;
  year: string;
  heroImage: string;
  summary: string;
  brief: string;
  approach: string;
  outcome: string;
  gallery: ProjectImage[];
  stats: { label: string; value: string }[];
  testimonial?: { quote: string; author: string; role: string };
  nextProjectSlug?: string;
  accentColor: string;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'high-street-mural',
    title: 'High Street Mural',
    category: 'Murals',
    client: 'Hastings Borough Council',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1758426637884-8d27c12b2741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXJnZSUyMGJ1aWxkaW5nJTIwbXVyYWwlMjBzdHJlZXQlMjBwYWludGluZ3xlbnwxfHx8fDE3NzQ1MDcxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    summary: 'A 40-foot celebration of coastal life on Hastings High Street, featuring cheeky seagulls, dancing fish, and beloved local characters.',
    brief: 'Hastings Borough Council wanted a large-scale mural that would celebrate the town\'s coastal heritage and community spirit. The wall — a prominent three-storey gable end on the High Street — had been blank for years. The brief was to create something joyful, inclusive, and unmistakably Hastings.',
    approach: 'I ran a series of community workshops with local residents, schools, and businesses to gather stories, characters, and ideas. From fishermen\'s tales to the annual carnival, every corner of Hastings life found its way into the design. I created initial sketches, refined them with feedback from the community panel, then spent three weeks on scaffolding bringing it all to life with exterior-grade paint.',
    outcome: 'The mural has become a local landmark and Instagram hotspot. It\'s been featured in The Guardian\'s "Best UK Street Art" roundup and is now used as a meeting point by locals ("See you at the seagull!"). Footfall on that stretch of the High Street increased by 25% in the following quarter.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1758426637884-8d27c12b2741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXJnZSUyMGJ1aWxkaW5nJTIwbXVyYWwlMjBzdHJlZXQlMjBwYWludGluZ3xlbnwxfHx8fDE3NzQ1MDcxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Finished mural on High Street', caption: 'The completed mural in full sunshine' },
      { src: 'https://images.unsplash.com/photo-1762844877957-234161edd3f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXJhbCUyMHBhaW50aW5nJTIwcHJvY2VzcyUyMGFydGlzdCUyMHNjYWZmb2xkaW5nfGVufDF8fHx8MTc3NDYwMjcyNnww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Painting in progress on scaffolding', caption: 'Three weeks up the scaffolding — totally worth it' },
      { src: 'https://images.unsplash.com/photo-1598620617148-c9e8ddee6711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2V0Y2hib29rJTIwb3BlbiUyMHBlbmNpbCUyMGRyYXdpbmclMjByb3VnaHxlbnwxfHx8fDE3NzQ2MDI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Initial sketches in sketchbook', caption: 'Early concept sketches from the community workshops' },
      { src: 'https://images.unsplash.com/photo-1759936263498-325015569a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHdhbGwlMjBtdXJhbCUyMHVyYmFuJTIwYXJ0fGVufDF8fHx8MTc3NDUwNzExOHww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Detail of mural characters', caption: 'Close-up of the cheeky seagull gang' },
    ],
    stats: [
      { label: 'Wall size', value: '40 × 25 ft' },
      { label: 'Duration', value: '3 months' },
      { label: 'Community workshops', value: '12 sessions' },
      { label: 'Seagulls painted', value: '47' },
    ],
    testimonial: {
      quote: 'Nicola didn\'t just paint a wall — she captured the soul of Hastings. The community workshops meant everyone felt ownership of the mural. It\'s ours.',
      author: 'Cllr. Tom Davies',
      role: 'Hastings Borough Council',
    },
    nextProjectSlug: 'the-curious-cat',
    accentColor: '#5D9B9B',
  },
  {
    id: 2,
    slug: 'the-curious-cat',
    title: 'The Curious Cat',
    category: 'Books',
    client: 'Firefly Press',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1649750291589-8812197b698c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2slMjBpbGx1c3RyYXRpb24lMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzQ1MDcxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    summary: 'A 32-page children\'s picture book about a curious cat who explores her neighbourhood and discovers that adventure is everywhere.',
    brief: 'Firefly Press needed an illustrator for a charming picture book manuscript about a house cat who sneaks out one night and has a series of gentle adventures around her street. The text was warm, funny, and full of observational humour. They wanted illustrations that matched that tone — bold, colourful, and full of hidden details for kids to discover on repeat readings.',
    approach: 'I started with character development — getting the cat\'s personality right was everything. She needed to look curious but not mischievous, adventurous but still cosy. I created a limited palette of warm ochres, deep teals, and soft pinks, using bold ink outlines with watercolour washes. Each spread was designed with a mix of full-bleed scenes and smaller spot illustrations to create rhythm across the book.',
    outcome: 'The Curious Cat was published in 2024, received a starred review in Kirkus, and has been translated into 8 languages. It was shortlisted for the Waterstones Children\'s Book Prize and has sold over 15,000 copies in its first year. Most importantly, kids love spotting the hidden mice in every spread.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1649750291589-8812197b698c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2slMjBpbGx1c3RyYXRpb24lMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzQ1MDcxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Book cover illustration', caption: 'The finished book cover' },
      { src: 'https://images.unsplash.com/photo-1658047975851-e454d6c0f4f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGJvb2slMjBzcHJlYWQlMjBpbGx1c3RyYXRpb24lMjBwYWdlc3xlbnwxfHx8fDE3NzQ2MDI3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Interior spread', caption: 'One of the full-bleed adventure spreads' },
      { src: 'https://images.unsplash.com/photo-1598620617148-c9e8ddee6711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2V0Y2hib29rJTIwb3BlbiUyMHBlbmNpbCUyMGRyYXdpbmclMjByb3VnaHxlbnwxfHx8fDE3NzQ2MDI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Character development sketches', caption: 'Getting the cat\'s expression just right' },
      { src: 'https://images.unsplash.com/photo-1730206562928-0efd62560435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbGx1c3RyYXRpb24lMjBhcnQlMjBzdHVkaW8lMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc3NDYwMjcyNnww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Studio workspace', caption: 'My desk during the book illustration process' },
    ],
    stats: [
      { label: 'Pages', value: '32' },
      { label: 'Duration', value: '4 months' },
      { label: 'Illustrations', value: '42' },
      { label: 'Hidden mice', value: '16' },
    ],
    testimonial: {
      quote: 'Nicola understood the tone of the text immediately. Her illustrations didn\'t just accompany the words — they elevated the entire story. The hidden details she added give the book endless re-readability.',
      author: 'Megan Harper',
      role: 'Editor, Firefly Press',
    },
    nextProjectSlug: 'midsummer-night-set',
    accentColor: '#E8846F',
  },
  {
    id: 3,
    slug: 'midsummer-night-set',
    title: 'Midsummer Night Set',
    category: 'Theatre & Events',
    client: 'Brighton Festival',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1737617009800-5d570a8552ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdHJlJTIwc3RhZ2UlMjBzZXQlMjBjb2xvcmZ1bCUyMGRlc2lnbnxlbnwxfHx8fDE3NzQ1MDcxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    summary: 'An immersive illustrated set design for Brighton Festival\'s outdoor production of A Midsummer Night\'s Dream, transforming a park into an enchanted forest.',
    brief: 'Brighton Festival commissioned an outdoor production of A Midsummer Night\'s Dream performed in a public park. They wanted an immersive set design that would transform the space into a magical forest — something that audiences could walk through before the show, creating a sense of wonder from the moment they arrived.',
    approach: 'I designed a series of large-scale illustrated panels, banners, and sculptural elements that created an enchanted forest throughout the park. Each panel was hand-painted with bold ink outlines and a rich palette of forest greens, midnight blues, and touches of gold. I incorporated characters from the play into the illustrations, so Titania, Bottom, and Puck appeared as larger-than-life figures among the real trees.',
    outcome: 'The production sold out all 14 performances. The set design was praised by critics as "a visual feast that made Shakespeare feel alive and accessible." The illustrated panels were later exhibited at the De La Warr Pavilion and several were sold as artworks. The festival has commissioned Nicola for their 2026 season.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1737617009800-5d570a8552ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdHJlJTIwc3RhZ2UlMjBzZXQlMjBjb2xvcmZ1bCUyMGRlc2lnbnxlbnwxfHx8fDE3NzQ1MDcxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Stage design overview', caption: 'The enchanted forest takes shape' },
      { src: 'https://images.unsplash.com/photo-1598620617148-c9e8ddee6711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2V0Y2hib29rJTIwb3BlbiUyMHBlbmNpbCUyMGRyYXdpbmclMjByb3VnaHxlbnwxfHx8fDE3NzQ2MDI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Design sketches', caption: 'Initial concepts for the forest panels' },
      { src: 'https://images.unsplash.com/photo-1762844877957-234161edd3f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXJhbCUyMHBhaW50aW5nJTIwcHJvY2VzcyUyMGFydGlzdCUyMHNjYWZmb2xkaW5nfGVufDF8fHx8MTc3NDYwMjcyNnww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Painting process', caption: 'Hand-painting the large-scale panels in the studio' },
    ],
    stats: [
      { label: 'Panels created', value: '28' },
      { label: 'Duration', value: '6 weeks' },
      { label: 'Performances', value: '14 sold out' },
      { label: 'Audience', value: '4,200+' },
    ],
    testimonial: {
      quote: 'Nicola created a world that audiences didn\'t want to leave. Children were wide-eyed before the show even started. It was pure magic.',
      author: 'Jo Bannon',
      role: 'Artistic Director, Brighton Festival',
    },
    nextProjectSlug: 'brand-characters',
    accentColor: '#6B7554',
  },
  {
    id: 4,
    slug: 'brand-characters',
    title: 'Brand Characters',
    category: 'Illustration',
    client: 'Bloom Coffee Co.',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1571473569215-d86aa5a582c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2xkJTIwZ3JhcGhpYyUyMHBvc3RlciUyMGlsbHVzdHJhdGlvbiUyMHByaW50fGVufDF8fHx8MTc3NDUwNzEyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    summary: 'A complete brand illustration system for Bloom Coffee Co., featuring a cast of quirky coffee-loving characters across packaging, menus, and social media.',
    brief: 'Bloom Coffee Co., a local roaster expanding to wholesale, needed illustration that would set them apart from the minimalist-everything coffee scene. They wanted warmth, humour, and a cast of characters that customers would recognise and love — something that would make their packaging feel like a gift, not just a bag of beans.',
    approach: 'I developed a family of illustrated characters — each representing a different coffee blend — from a sleepy bear (decaf) to a hyperactive hummingbird (espresso blend). I created a visual system that could flex across packaging, menus, social media, merchandise, and their café interiors, all unified by bold ink outlines and a warm, limited palette.',
    outcome: 'The rebrand launched across 40+ wholesale stockists and Bloom\'s flagship café. Social media engagement increased 340% in the first month. The characters have become so popular that customers request specific "character" bags. Bloom has since commissioned a mural for their new café space.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1571473569215-d86aa5a582c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2xkJTIwZ3JhcGhpYyUyMHBvc3RlciUyMGlsbHVzdHJhdGlvbiUyMHByaW50fGVufDF8fHx8MTc3NDUwNzEyMXww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Brand illustrations', caption: 'The full character cast for Bloom Coffee' },
      { src: 'https://images.unsplash.com/photo-1730206562928-0efd62560435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbGx1c3RyYXRpb24lMjBhcnQlMjBzdHVkaW8lMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc3NDYwMjcyNnww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Studio process', caption: 'Developing the character lineup' },
      { src: 'https://images.unsplash.com/photo-1598620617148-c9e8ddee6711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2V0Y2hib29rJTIwb3BlbiUyMHBlbmNpbCUyMGRyYXdpbmclMjByb3VnaHxlbnwxfHx8fDE3NzQ2MDI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Sketchbook development', caption: 'Early sketches of the coffee characters' },
    ],
    stats: [
      { label: 'Characters created', value: '8' },
      { label: 'Duration', value: '6 weeks' },
      { label: 'Deliverables', value: '25+' },
      { label: 'Social engagement', value: '+340%' },
    ],
    testimonial: {
      quote: 'Nicola gave our coffee a personality. Customers fall in love with the characters before they even taste the beans. She understood our brand better than we did.',
      author: 'Yuki Tanaka',
      role: 'Founder, Bloom Coffee Co.',
    },
    nextProjectSlug: 'whimsical-series',
    accentColor: '#D8767D',
  },
  {
    id: 5,
    slug: 'whimsical-series',
    title: 'Whimsical Series',
    category: 'Illustration',
    client: 'Personal Project',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1769053012127-b05ba10350d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGltc2ljYWwlMjBjYXJ0b29uJTIwY2hhcmFjdGVyJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzc0NTA3MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    summary: 'A personal series of whimsical character illustrations exploring themes of joy, solitude, and the tiny dramas of everyday life.',
    brief: 'This was a personal project — a series I\'d been wanting to create for years. No client brief, no deadline, just me drawing the things that make me happy. I wanted to explore characters in quiet, everyday moments: reading a book in the rain, talking to a pigeon, eating toast at 3am.',
    approach: 'I gave myself permission to be messy. Looser lines than my commercial work, more spontaneous colour choices, bigger expressions. I worked on large-format paper with ink and gouache, scanning the originals and cleaning them up minimally. Each piece took between one and three days.',
    outcome: 'The series was exhibited at Jerwood Gallery in Hastings and later at a pop-up in Shoreditch. Several pieces sold as originals, and the series has been turned into a bestselling print collection in my shop. It also led to three new commissions from clients who said they connected with the personal, unguarded quality of the work.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1769053012127-b05ba10350d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGltc2ljYWwlMjBjYXJ0b29uJTIwY2hhcmFjdGVyJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzc0NTA3MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Whimsical character art', caption: 'One of the key pieces from the series' },
      { src: 'https://images.unsplash.com/photo-1717675615860-1ea09962213d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwcGFpbnRpbmclMjBjb2xvcmZ1bCUyMGFic3RyYWN0JTIwYXJ0fGVufDF8fHx8MTc3NDUwNzEyMnww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Watercolour original', caption: 'Working with gouache on large-format paper' },
      { src: 'https://images.unsplash.com/photo-1763690792486-812722ffb455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwcmludCUyMGZyYW1lZCUyMGlsbHVzdHJhdGlvbiUyMHdhbGx8ZW58MXx8fHwxNzc0NTA3MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Framed prints on wall', caption: 'The exhibition at Jerwood Gallery' },
    ],
    stats: [
      { label: 'Pieces in series', value: '12' },
      { label: 'Duration', value: '3 months' },
      { label: 'Originals sold', value: '8 of 12' },
      { label: 'Exhibitions', value: '2' },
    ],
    nextProjectSlug: 'community-center-mural',
    accentColor: '#E8846F',
  },
  {
    id: 6,
    slug: 'community-center-mural',
    title: 'Community Center Mural',
    category: 'Murals',
    client: 'St Leonards Community Trust',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1759936263498-325015569a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHdhbGwlMjBtdXJhbCUyMHVyYmFuJTIwYXJ0fGVufDF8fHx8MTc3NDUwNzExOHww&ixlib=rb-4.1.0&q=80&w=1080',
    summary: 'An interior mural transforming the entrance hall of St Leonards Community Centre into a vibrant celebration of the neighbourhood.',
    brief: 'The community centre\'s entrance was tired and uninviting. The Trust wanted a mural that would make people feel welcome the moment they walked through the door — something that celebrated the diversity and energy of the St Leonards neighbourhood.',
    approach: 'I spent time at the centre, talking to the people who use it — from toddler groups to pensioners\' clubs. The mural design weaves together scenes from the community: a yoga class, kids playing, the local cat who visits every day, the view from the seafront. I used a warm palette and kept the style bold and accessible.',
    outcome: 'The mural was unveiled at the centre\'s summer fair and was met with genuine emotion from regulars who recognised themselves (and the cat) in the illustrations. Centre bookings increased and the Trust reported that new visitors regularly comment on the mural as their first impression of the space.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1759936263498-325015569a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHdhbGwlMjBtdXJhbCUyMHVyYmFuJTIwYXJ0fGVufDF8fHx8MTc3NDUwNzExOHww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Completed mural', caption: 'The finished mural in the entrance hall' },
      { src: 'https://images.unsplash.com/photo-1762844877957-234161edd3f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXJhbCUyMHBhaW50aW5nJTIwcHJvY2VzcyUyMGFydGlzdCUyMHNjYWZmb2xkaW5nfGVufDF8fHx8MTc3NDYwMjcyNnww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Painting in progress', caption: 'Bringing the community to life on the wall' },
    ],
    stats: [
      { label: 'Wall area', value: '18 × 10 ft' },
      { label: 'Duration', value: '5 weeks' },
      { label: 'Community members featured', value: '30+' },
      { label: 'Cats painted', value: '1 (the important one)' },
    ],
    nextProjectSlug: 'adventure-book',
    accentColor: '#5D9B9B',
  },
  {
    id: 7,
    slug: 'adventure-book',
    title: 'Adventure Book',
    category: 'Books',
    client: 'Walker Books',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1770726345481-01bb16e5c76c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kJTIwZHJhd24lMjBza2V0Y2glMjBkb29kbGUlMjBhcnR8ZW58MXx8fHwxNzc0NTA3MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    summary: 'Illustrations for a middle-grade adventure novel featuring hand-drawn chapter headers, spot illustrations, and a full-colour cover.',
    brief: 'Walker Books commissioned illustrations for a new middle-grade adventure novel about a group of kids exploring a mysterious island. They wanted bold, slightly gritty illustration that would appeal to 8-12 year olds — not too cute, but full of energy and mystery.',
    approach: 'I used a more textured, slightly rougher line style than my picture book work — more crosshatching, bolder blacks, and a limited palette of just three colours plus black. Each chapter header tells a mini visual story, and the spot illustrations throughout add energy without overwhelming the text.',
    outcome: 'The book was published as a lead title and the illustrations were praised for their "confidence and atmosphere." The publisher has commissioned a sequel, and the cover illustration was longlisted for the CILIP Kate Greenaway Medal.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1770726345481-01bb16e5c76c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kJTIwZHJhd24lMjBza2V0Y2glMjBkb29kbGUlMjBhcnR8ZW58MXx8fHwxNzc0NTA3MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Chapter header illustration', caption: 'One of the hand-drawn chapter headers' },
      { src: 'https://images.unsplash.com/photo-1598620617148-c9e8ddee6711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2V0Y2hib29rJTIwb3BlbiUyMHBlbmNpbCUyMGRyYXdpbmclMjByb3VnaHxlbnwxfHx8fDE3NzQ2MDI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Rough sketches', caption: 'Early concept sketches for the island scenes' },
    ],
    stats: [
      { label: 'Illustrations', value: '35' },
      { label: 'Duration', value: '10 weeks' },
      { label: 'Chapter headers', value: '18' },
      { label: 'Colours used', value: '3 + black' },
    ],
    nextProjectSlug: 'watercolour-originals',
    accentColor: '#D8767D',
  },
  {
    id: 8,
    slug: 'watercolour-originals',
    title: 'Watercolour Originals',
    category: 'Illustration',
    client: 'Personal Collection',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1717675615860-1ea09962213d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwcGFpbnRpbmclMjBjb2xvcmZ1bCUyMGFic3RyYWN0JTIwYXJ0fGVufDF8fHx8MTc3NDUwNzEyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    summary: 'A collection of vibrant, one-of-a-kind watercolour paintings exploring colour, movement, and the joy of making marks.',
    brief: 'A self-directed series exploring the expressive potential of watercolour beyond my usual illustration style. I wanted to push my use of colour and see what happened when I let the medium lead instead of my ink outlines.',
    approach: 'Each piece started with colour first — wet-on-wet watercolour laid down spontaneously, then built up with layers and detail. I let the happy accidents of watercolour — blooms, bleeds, granulation — become features rather than problems. Bold ink details were added last to tie each piece together.',
    outcome: 'The collection of 10 originals sold out within a week of being listed in the shop. Several have been purchased as gifts and personal commissions inspired by the series have followed. The work has expanded my artistic range and attracted clients looking for a looser, more painterly style.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1717675615860-1ea09962213d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwcGFpbnRpbmclMjBjb2xvcmZ1bCUyMGFic3RyYWN0JTIwYXJ0fGVufDF8fHx8MTc3NDUwNzEyMnww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Watercolour painting', caption: 'One of the key pieces from the collection' },
      { src: 'https://images.unsplash.com/photo-1763690792486-812722ffb455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwcmludCUyMGZyYW1lZCUyMGlsbHVzdHJhdGlvbiUyMHdhbGx8ZW58MXx8fHwxNzc0NTA3MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Framed collection', caption: 'Several pieces framed and ready for exhibition' },
    ],
    stats: [
      { label: 'Pieces', value: '10' },
      { label: 'Sold', value: '10 of 10' },
      { label: 'Duration', value: '6 weeks' },
      { label: 'New commissions', value: '3' },
    ],
    nextProjectSlug: 'high-street-mural',
    accentColor: '#5D9B9B',
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getNextProject(slug: string): Project | undefined {
  const current = getProjectBySlug(slug);
  if (!current?.nextProjectSlug) return undefined;
  return getProjectBySlug(current.nextProjectSlug);
}
