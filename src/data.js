/* Stable content IDs are the migration boundary for a later C# simulation. */
const DATA = {
  npcs: [
    {id:'cedric',name:'Cedric',role:'Aspiring swordsman',color:'#be764b',hair:'#d7b76c',favorite:'ale',x:380,y:350,arrival:8,depart:155,ambition:'My sister is apprenticing to a glassmaker. Someone has to pay the fee.',intro:'I have a sword. Bram says that is different from being a swordsman.',faction:'Road company'},
    {id:'mira',name:'Mira',role:'Scout • claims to know every road',color:'#7a8c79',hair:'#27262b',favorite:'wine',x:775,y:240,arrival:18,depart:162,ambition:'One day I will owe nobody anything. Not even a favor.',intro:'A secret is like a spare key. You should know who has a copy.',faction:'Reed Knives'},
    {id:'nell',name:'Nell',role:'Server looking for a steady wage',color:'#759fa6',hair:'#b96543',favorite:'tea',x:265,y:265,arrival:0,depart:172,ambition:'A boat. Nothing grand. Just something that belongs to me.',intro:'Your aunt used to say: watch the hands, not the smile. Mine mostly carry plates.',faction:'Rookcross locals'},
    {id:'oren',name:'Oren',role:'Merchant • wagon owner',color:'#ad8b4e',hair:'#e2d1b1',favorite:'wine',x:680,y:455,arrival:28,depart:145,ambition:'The road must turn a profit. Good intentions do not shoe horses.',intro:'Three missing wagons. Bandits, obviously. Best let the merchants handle it.',faction:'Merchant compact'},
    {id:'tomas',name:'Tomas',role:'Watch constable',color:'#658aa7',hair:'#635443',favorite:'stew',x:590,y:350,arrival:34,depart:168,ambition:'A wage on time. And one report that does not say probably.',intro:'If somebody says obviously, ask them how they know.',faction:'Crown watch'},
    {id:'aldous',name:'Aldous',role:'Hearth cleric',color:'#aa9e79',hair:'#aaa795',favorite:'tea',x:430,y:510,arrival:45,depart:159,ambition:'The chapel is full of people the road has forgotten.',intro:'A hot meal is a perfectly respectable prayer.',faction:'Hearth church'},
    {id:'bram',name:'Bram',role:'Veteran dwarf • reluctant mentor',color:'#8b6e64',hair:'#b8b1a1',favorite:'ale',x:350,y:510,arrival:12,depart:160,ambition:'Teach the boy to come home. Glory can look after itself.',intro:'Rope, food, a second pair of eyes. The heroic essentials.',faction:'Road company'},
    {id:'ivo',name:'Ivo',role:'Wizard • room two',color:'#8d7ea7',hair:'#ddd4bd',favorite:'stew',x:890,y:110,arrival:55,depart:174,ambition:'This inn appears in three treaties. None mention why.',intro:'My familiar is not a second guest. It is a professional expense.',faction:'Mages register'}
  ],
  rumors:{
    wagons:{title:'The missing Westbridge wagons',text:'Three wagons are missing on the Blackwood road. Their fate is uncertain.',kind:'Unverified claim'},
    diversion:{title:'A voluntary detour?',text:'The wagons may have turned toward the old tollhouse willingly.',kind:'Lead'},
    ledger:{title:'Payments at the tollhouse',text:'A stamped ledger records Oren paying to divert trade past Rookcross.',kind:'Confirmed evidence'},
    warning:{title:'The broken north bridge',text:'The north bridge is rotten. A survey should take the ridge with rope.',kind:'Practical warning'},
    carving:{title:'Names beneath the hearth',text:'The inn carving matches a treaty seal. Old keepers recorded meetings here.',kind:'Unresolved connection'},
    knives:{title:'Mira and the Reed Knives',text:'Mira passes useful road news to the Reed Knives. Her independence is a claim.',kind:'Sensitive testimony'}
  },
  // Overlapping windows are deliberate. Ordinary lines are allowed to disappear.
  talks:[
    {id:'wagons',days:[1,2],start:42,end:92,a:'oren',b:'tomas',fragment:'…three wagons…',line:'Oren: Three Westbridge wagons. Gone. Bandits, obviously. Tomas: Funny. No broken wheels, no bodies.',rumor:'wagons'},
    {id:'mentor',days:[1,2,3],start:22,end:65,a:'bram',b:'cedric',fragment:'…not the north bridge…',line:'Bram: The north bridge is rotten. Take rope and use the ridge. Cedric: I thought you would say bring a bigger sword.',rumor:'warning'},
    {id:'booth',days:[1,2,3],start:99,end:137,a:'mira',b:'oren',whisper:true,fragment:'…paid to turn…',line:'Mira: They were paid to turn at the tollhouse. Oren: Lower your voice. You were paid to forget.',rumor:'diversion'},
    {id:'confidence',days:[2,3,5],start:66,end:96,a:'mira',b:'nell',whisper:true,fragment:'…the Knives expect…',line:'Mira: The Reed Knives expect road news. Nell: And Cedric thinks you only scout for him.',rumor:'knives'},
    {id:'quiet',days:[4],start:36,end:98,a:'cedric',b:'nell',fragment:'…blue glass…',line:'Cedric: My sister made you a bead. It is not quite round. Nell: Neither is the moon, up close. Tell her I love it.'},
    {id:'soup',days:[1,3,4,6],start:111,end:152,a:'aldous',b:'bram',fragment:'…a respectable prayer…',line:'Aldous: I prayed for dinner. Bram: I ordered soup. Aldous: Different traditions. Same excellent result.'},
    {id:'seal',days:[3,5,6],start:64,end:115,a:'ivo',b:'aldous',fragment:'…same carved mark…',line:'Ivo: That hearth mark is on the Treaty of Ash. Aldous: Your aunt kept names, not recipes, in that ledger.',rumor:'carving'},
    {id:'beard',days:[4,7],start:110,end:152,a:'bram',b:'tomas',fragment:'…under the beard…',line:'Tomas: Regulations say no concealed weapons. Bram: If I remove everything under my beard, we will be here until spring.'}
  ],
  walls:[{x:710,y:35,w:18,h:155},{x:710,y:300,w:18,h:38},{x:710,y:338,w:235,h:18},{x:710,y:35,w:235,h:14},{x:728,y:179,w:65,h:12},{x:870,y:179,w:75,h:12},
    {x:35,y:185,w:175,h:18},{x:295,y:185,w:100,h:18}],
  furniture:[{x:95,y:230,w:75,h:160,type:'bar'},{x:330,y:375,w:100,h:50,type:'table'}, {x:530,y:375,w:100,h:50,type:'table'}, {x:335,y:540,w:125,h:40,type:'table'}, {x:640,y:490,w:105,h:45,type:'table'}, {x:790,y:260,w:95,h:40,type:'table'}, {x:805,y:65,w:115,h:55,type:'bed'}, {x:240,y:65,w:120,h:65,type:'desk'}],
  stations:[{id:'ale',name:'Ale cask',x:77,y:255},{id:'wine',name:'Wine cask',x:77,y:305},{id:'tea',name:'Tea kettle',x:77,y:355},{id:'stew',name:'Stew pot',x:120,y:440},{id:'board',name:'Letters & expedition board',x:280,y:153},{id:'hearth',name:'Carved hearth',x:510,y:82},{id:'room',name:'Guest room',x:875,y:160},{id:'bed',name:'Close the inn',x:105,y:110}],
  dayNames:['First light','Familiar faces','A letter in the rain','Nothing much, thankfully','The empty chair','What comes home','The keeper of things']
};
if(typeof module!=='undefined') module.exports=DATA;
