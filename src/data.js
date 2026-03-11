// Apple skins
export const APPLE_SKINS = [
  { id:'classic', name:'Classic', body:'#e53935', dark:'#b71c1c', shine:'#ff8a80', leaf:'#43a047', stem:'#5d4037' },
  { id:'golden',  name:'Golden',  body:'#ffd600', dark:'#f9a825', shine:'#fff9c4', leaf:'#f57f17', stem:'#6d4c41' },
  { id:'green',   name:'Granny',  body:'#66bb6a', dark:'#388e3c', shine:'#ccff90', leaf:'#1b5e20', stem:'#4e342e' },
  { id:'pink',    name:'Rosy',    body:'#f06292', dark:'#c2185b', shine:'#fce4ec', leaf:'#880e4f', stem:'#6d4c41' },
  { id:'galaxy',  name:'Galaxy',  body:'#5c35c5', dark:'#1a237e', shine:'#b39ddb', leaf:'#311b92', stem:'#212121', special:'stars' },
  { id:'rainbow', name:'Rainbow', body:null,      dark:null,      shine:'#fff',    leaf:'#00c853', stem:'#795548', special:'rainbow' },
  { id:'diamond', name:'Diamond', body:'#b2ebf2', dark:'#80deea', shine:'#ffffff', leaf:'#80deea', stem:'#90a4ae', special:'sparkle' },
  { id:'lava',    name:'Lava',    body:'#e64a19', dark:'#bf360c', shine:'#ff6d00', leaf:'#e65100', stem:'#3e2723', special:'glow' },
  { id:'comet',   name:'Comet',   body:'#311b92', dark:'#1a0050', shine:'#b388ff', leaf:'#7c4dff', stem:'#212121', special:'stars', mapId:'space' },
  { id:'solar',   name:'Solar',   body:'#ff6f00', dark:'#e65100', shine:'#fff3e0', leaf:'#ff8f00', stem:'#4e342e', special:'glow', mapId:'volcano' },
  { id:'dune',    name:'Dune',    body:'#c8922a', dark:'#8d6e00', shine:'#fff9c4', leaf:'#795548', stem:'#4e342e', mapId:'desert' },
  { id:'aurora',  name:'Aurora',  body:'#00c853', dark:'#00701a', shine:'#b9f6ca', leaf:'#1b5e20', stem:'#212121', special:'glow', mapId:'aurora' },
  { id:'sugar',   name:'Sugar',   body:'#ff80ab', dark:'#f50057', shine:'#fce4ec', leaf:'#ad1457', stem:'#880e4f', mapId:'candy' },
  { id:'smiley',  name:'Smiley',  body:'#ffd600', dark:'#f9a825', shine:'#fff9c4', leaf:'#43a047', stem:'#5d4037', special:'smiley' },
  { id:'pixel',   name:'Pixel',   body:'#e53935', dark:'#b71c1c', shine:'#ff8a80', leaf:'#43a047', stem:'#5d4037', special:'pixel' },
  { id:'dog',     name:'Dog',     body:'#8d6534', dark:'#6d4c2a', shine:'#d4a66a', leaf:'#43a047', stem:'#5d4037', special:'dog' },
  { id:'demon',   name:'Demon',   body:'#8b0000', dark:'#4a0000', shine:'#ff4444', leaf:'#2a0000', stem:'#1a0000', special:'demon' },
  { id:'angel',   name:'Angel',   body:'#f0f0ff', dark:'#c8c8e8', shine:'#ffffff', leaf:'#d4af37', stem:'#c0a030', special:'angel' },
  { id:'leprechaun', name:'Leprechaun', body:'#43a047', dark:'#2e7d32', shine:'#a5d6a7', leaf:'#1b5e20', stem:'#33691e', special:'leprechaun', event:true },
  { id:'dark',    name:'Dark',    body:'#1a1a2e', dark:'#0d0d1a', shine:'#4a0072', leaf:'#1a0033', stem:'#0d001a', special:'dark' },
];

// Bowl skins
export const BOWL_SKINS = [
  { id:'classic', name:'Classic', rim:'#8d6e63', body:'#a1887f', inside:'#d7ccc8', dark:'#6d4c41' },
  { id:'golden',  name:'Golden',  rim:'#f9a825', body:'#ffd600', inside:'#fff9c4', dark:'#ff8f00', special:'glow' },
  { id:'silver',  name:'Silver',  rim:'#9e9e9e', body:'#e0e0e0', inside:'#fafafa', dark:'#757575' },
  { id:'wood',    name:'Wooden',  rim:'#5d4037', body:'#795548', inside:'#bcaaa4', dark:'#4e342e', special:'grain' },
  { id:'crystal', name:'Crystal', rim:'#80deea', body:'#b2ebf2', inside:'#e0f7fa', dark:'#00bcd4', special:'sparkle' },
  { id:'lava',    name:'Lava',    rim:'#bf360c', body:'#e64a19', inside:'#ff8a65', dark:'#ff6d00', special:'glow' },
  { id:'galaxy',  name:'Galaxy',  rim:'#311b92', body:'#1a237e', inside:'#283593', dark:'#7c4dff', special:'stars' },
  { id:'rainbow', name:'Rainbow', rim:'#e91e63', body:null,      inside:'#fff8',   dark:'#fff' },
  { id:'smiley',  name:'Smiley',  rim:'#f9a825', body:'#ffd600', inside:'#fff9c4', dark:'#f9a825', special:'smiley' },
  { id:'pixel',   name:'Pixel',   rim:'#b71c1c', body:'#e53935', inside:'#ff8a80', dark:'#b71c1c', special:'pixel' },
  { id:'dog',     name:'Dog',     rim:'#6d4c2a', body:'#8d6534', inside:'#d4aa7a', dark:'#5a3a1a', special:'dog' },
  { id:'demon',   name:'Demon',   rim:'#4a0000', body:'#8b0000', inside:'#3a0000', dark:'#2a0000', special:'demon' },
  { id:'angel',   name:'Angel',   rim:'#d0d0e8', body:'#f0f0ff', inside:'#ffffff', dark:'#b0b0d0', special:'angel' },
  { id:'leprechaun', name:'Leprechaun', rim:'#2e7d32', body:'#43a047', inside:'#a5d6a7', dark:'#1b5e20', special:'leprechaun', event:true },
  { id:'dark',    name:'Dark',    rim:'#1a1a2e', body:'#0d0d1a', inside:'#1a0033', dark:'#0a0a15', special:'dark' },
];

// Chests — rewards are arrays of skin IDs that can drop
export const CHESTS = [
  { id:'wooden',  name:'Wooden',  cost:50,  topCol:'#5d4037', bodyCol:'#795548', lockCol:'#ffd600',
    appleRewards:['golden','green','leprechaun'], bowlRewards:['wood','silver','leprechaun'] },
  { id:'silver',  name:'Silver',  cost:150, topCol:'#9e9e9e', bodyCol:'#e0e0e0', lockCol:'#ffd600',
    appleRewards:['golden','green','pink','leprechaun'], bowlRewards:['silver','crystal','leprechaun'] },
  { id:'golden',  name:'Golden',  cost:300, topCol:'#f9a825', bodyCol:'#ffd600', lockCol:'#fff',
    appleRewards:['rainbow','diamond','galaxy'], bowlRewards:['golden','crystal','lava'] },
  { id:'mystery', name:'Mystery', cost:200, topCol:'#7c4dff', bodyCol:'#5c35c5', lockCol:'#e040fb',
    appleRewards:['pink','golden','galaxy','rainbow','diamond'], bowlRewards:['crystal','golden','galaxy','rainbow'] },
  { id:'crystal', name:'Crystal', cost:500, topCol:'#00bcd4', bodyCol:'#b2ebf2', lockCol:'#fff',
    appleRewards:['diamond','galaxy','rainbow','lava','demon','angel'], bowlRewards:['crystal','galaxy','rainbow','lava','demon','angel'] },
  { id:'mega',    name:'Mega',    cost:100, topCol:'#e65100', bodyCol:'#ff8f00', lockCol:'#ffd600',
    appleRewards:['golden','green','pink','diamond'], bowlRewards:['wood','silver','golden','crystal'] },
];

// Power-ups
export const POWERUPS = [
  { id:'slow',     name:'Slow',        emoji:'🐢', rarity:'Common',   duration:8000,  desc:'Slows all apples for 8s' },
  { id:'double',   name:'Double Coins',emoji:'💰', rarity:'Common',   duration:8000,  desc:'2x coins per catch for 8s' },
  { id:'destroy',  name:'Destruction', emoji:'💥', rarity:'Rare',     duration:0,     desc:'Destroys all apples & gives coins' },
  { id:'teleport', name:'Teleport',    emoji:'🧲', rarity:'Rare',     duration:5000,  desc:'Pulls all apples to your bowl' },
  { id:'mapskip',  name:'Map Skip',    emoji:'🗺️', rarity:'Legendary',duration:0,     desc:'Skip to the next map instantly' },
];

export const POWER_CHEST = {
  id:'power', name:'Power', cost:200,
  topCol:'#4a148c', bodyCol:'#7b1fa2', lockCol:'#e040fb',
  powerRewards:['slow','slow','double','double','destroy','teleport','mapskip'],
};

export const MAPS = [
  { id:'meadow',    name:'Meadow',     emoji:'🌿', req:0,   desc:'The classic orchard' },
  { id:'night',     name:'Night Sky',  emoji:'🌙', req:20,  desc:'Catch 20 apples total' },
  { id:'winter',    name:'Winter',     emoji:'❄️',  req:50,  desc:'Catch 50 apples total' },
  { id:'space',     name:'Space',      emoji:'🚀', req:100, desc:'Catch 100 apples total' },
  { id:'underwater',name:'Deep Sea',   emoji:'🌊', req:150, desc:'Catch 150 apples total' },
  { id:'volcano',   name:'Volcano',    emoji:'🌋', req:200, desc:'Catch 200 apples total' },
  { id:'desert',    name:'Desert',     emoji:'🏜️', req:250, desc:'Catch 250 apples total' },
  { id:'aurora',    name:'Aurora',     emoji:'🌌', req:300, desc:'Catch 300 apples total' },
  { id:'candy',     name:'Candy Land', emoji:'🍬', req:350, desc:'Catch 350 apples total' },
  { id:'golden',    name:'Golden Hour',emoji:'🌅', req:400, desc:'Catch 400 apples total' },
  { id:'mountains', name:'Mountains',  emoji:'⛰️', req:450, desc:'Catch 450 apples total' },
  { id:'castle',    name:'Castle',     emoji:'🏰', req:500, desc:'Catch 500 apples total' },
  { id:'haunted',   name:'Haunted House',emoji:'👻', req:550, desc:'Catch 550 apples total' },
  { id:'shipwreck', name:'Shipwreck',  emoji:'🚢', req:600, desc:'Catch 600 apples total' },
  { id:'graveyard', name:'Graveyard',  emoji:'⚰️', req:650, desc:'Catch 650 apples total' },
  { id:'temple',    name:'Temple',     emoji:'🛕', req:700, desc:'Catch 700 apples total' },
  { id:'futuristic',name:'Futuristic', emoji:'🤖', req:750, desc:'Catch 750 apples total' },
  { id:'underground',name:'Underground',emoji:'⛏️', req:800, desc:'Catch 800 apples total' },
  { id:'park',      name:'Park',       emoji:'🌳', req:850, desc:'Catch 850 apples total' },
  { id:'dimension', name:'Dimension',  emoji:'🌀', req:900, desc:'Catch 900 apples total' },
  { id:'hell',      name:'Hell',       emoji:'😈', req:950, desc:'Catch 950 apples total' },
  { id:'heaven',    name:'Heaven',     emoji:'😇', req:1000,desc:'Catch 1000 apples total' },
  { id:'emptiness', name:'Emptiness',  emoji:'⬜', req:1100,desc:'Catch 1100 apples total' },
  { id:'rainbow',   name:'Rainbow',    emoji:'🌈', req:1200,desc:'Catch 1200 apples total' },
];

// Rarity for every skin (apple + bowl share IDs where they overlap)
export const RARITY = {
  // Apple skins
  classic:'common', green:'common', pink:'common',
  golden:'uncommon', smiley:'uncommon', leprechaun:'uncommon',
  galaxy:'rare', lava:'rare', pixel:'rare',
  rainbow:'epic', diamond:'epic', dog:'epic',
  comet:'exotic', solar:'exotic', dune:'exotic', aurora:'exotic', sugar:'exotic',
  demon:'exotic', angel:'exotic',
  dark:'mythical',
  // Bowl-only skins
  silver:'uncommon', wood:'rare', crystal:'rare',
};

export const RARITY_COLORS = {
  common:'#aaa', uncommon:'#4caf50', rare:'#2196f3',
  epic:'#9c27b0', exotic:'#ff9800', mythical:'#f44336',
};

export const RARITY_ORDER = ['common','uncommon','rare','epic','exotic','mythical'];

// Shards — collect 10 of a type to redeem for exclusive items
export const SHARDS = [
  { id:'bronze', name:'Bronze Shard', emoji:'🟫', color:'#cd7f32', cost:10,
    rewards: ['pixel','wood'] },
  { id:'silver', name:'Silver Shard', emoji:'⬜', color:'#c0c0c0', cost:10,
    rewards: ['diamond','crystal'] },
  { id:'gold',   name:'Gold Shard',   emoji:'🟡', color:'#ffd700', cost:10,
    rewards: ['dark'] },
];

// Merchant — prices for direct-buy items
export const MERCHANT_PRICES = {
  // Skins cost based on rarity
  common:30, uncommon:80, rare:200, epic:400, exotic:600, mythical:1000,
  // Power-ups
  slow:60, double:60, destroy:150, teleport:150, mapskip:400,
};

// Map rewards (auto-claimed when unlocking map)
export var MAP_REWARDS = {
  space:  {skin:'comet',  power:'teleport'},
  volcano:{skin:'solar',  power:'destroy'},
  desert: {skin:'dune',   power:'double'},
  aurora: {skin:'aurora', power:'teleport'},
  candy:  {skin:'sugar',  power:'double'},
  golden: {power:'slow', power2:'teleport'},
};
