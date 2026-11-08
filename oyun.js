(function(){
const R=Math.random, rnd=(a,b)=>a+R()*(b-a), ri=(a,b)=>Math.floor(rnd(a,b+1)), pick=a=>a[Math.floor(R()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function gauss(m,s){let u=0,v=0;while(!u)u=R();while(!v)v=R();return m+s*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// code, ad, ağırlık, lig gücü (1-10), gözlemci erişimi (0-1), refah (0-1), şehirler (büyükten küçüğe), erkek adları, kadın adları, kulüp ekleri
const C=[
 ["TR","Türkiye",6,7.2,.6,.5,[],["Emir","Yusuf","Kerem","Arda","Mert","Burak","Efe","Ömer","Eren","Baran","Kaan","Semih"],["Zeynep","Elif","Ecem","Defne","Ayşe","Melis","Ceren","Selin","Esra"],["spor","FK"]],
 // Avrupa
 ["DE","Almanya",5,9,.92,.9,["Berlin","Hamburg","Münih","Köln","Frankfurt","Stuttgart","Dortmund","Düsseldorf","Leipzig","Bremen","Hannover","Nürnberg","Freiburg","Mainz","Bochum"],["Leon","Jonas","Paul","Finn","Luca","Jamal","Florian","Kai"],["Lena","Mia","Hanna","Lea","Klara"],["SV","FC","VfB","VfL"]],
 ["EN","İngiltere",5,9.8,.92,.9,["Londra","Birmingham","Manchester","Liverpool","Leeds","Newcastle","Sheffield","Bristol","Nottingham","Leicester","Brighton","Southampton","Norwich","Hull","Stoke"],["Oliver","Harry","Jack","George","Alfie","Bukayo","Declan","Phil"],["Amelia","Olivia","Ella","Grace","Chloe"],["City","United","Town","Rovers"]],
 ["ES","İspanya",5,9.4,.92,.85,["Madrid","Barselona","Valencia","Sevilla","Zaragoza","Málaga","Bilbao","Palma","Las Palmas","Valladolid","Vigo","Gijón","San Sebastián","Pamplona","Cádiz"],["Pablo","Hugo","Álvaro","Daniel","Marc","Pedri","Lamine","Rodrigo"],["Lucía","Paula","Alba","Aitana","Laia"],["CF","CD","Real","UD"]],
 ["FR","Fransa",5,9,.9,.85,["Paris","Marsilya","Lyon","Toulouse","Nice","Nantes","Strazburg","Montpellier","Bordeaux","Lille","Rennes","Reims","Saint-Étienne","Lens","Le Havre"],["Hugo","Nathan","Moussa","Enzo","Kylian","Ousmane","Théo","Rayan"],["Léa","Manon","Inès","Chloé","Wendie"],["FC","AS","Olympique","Stade"]],
 ["IT","İtalya",4,9,.88,.8,["Roma","Milano","Napoli","Torino","Palermo","Cenova","Bologna","Floransa","Bari","Verona","Bergamo","Udine","Cagliari","Lecce","Parma"],["Lorenzo","Matteo","Alessandro","Federico","Gianluigi","Nicolò","Sandro"],["Giulia","Sofia","Martina","Chiara","Cristiana"],["Calcio","AC","US","SS"]],
 ["NL","Hollanda",2,8,.92,.9,["Amsterdam","Rotterdam","Lahey","Utrecht","Eindhoven","Groningen","Tilburg","Almere","Breda","Nijmegen","Zwolle","Arnhem"],["Daan","Sem","Milan","Bram","Virgil","Frenkie","Xavi"],["Emma","Fenna","Sanne","Lieke","Vivianne"],["FC","SC","VV","PEC"]],
 ["PT","Portekiz",2,8,.88,.75,["Lizbon","Porto","Braga","Coimbra","Funchal","Setúbal","Guimarães","Faro","Aveiro","Vizela"],["Rodrigo","Tiago","Diogo","Gonçalo","Rafael","João","Bernardo"],["Inês","Mariana","Beatriz","Kika"],["SC","FC","CD","GD"]],
 ["BE","Belçika",1.5,7.4,.88,.9,["Brüksel","Anvers","Gent","Charleroi","Liège","Brugge","Leuven","Mechelen","Genk","Mons"],["Romelu","Kevin","Youri","Jérémy","Lucas","Amadou","Arthur"],["Tessa","Janice","Justine","Elena"],["KV","RSC","Club","KAA"]],
 ["SC","İskoçya",1,6.4,.85,.85,["Glasgow","Edinburgh","Aberdeen","Dundee","Inverness","Kilmarnock","Motherwell","Perth"],["Andrew","Scott","John","Callum","Kieran","Billy"],["Erin","Caroline","Kim","Rachel"],["FC","Athletic","Rovers","Thistle"]],
 ["IE","İrlanda",1,4.5,.85,.95,["Dublin","Cork","Limerick","Galway","Waterford","Drogheda","Sligo"],["Seamus","Conor","Evan","Shane","Robbie","Caoimhín"],["Katie","Denise","Megan","Aoife"],["Rovers","FC","United","City"]],
 ["CH","İsviçre",1,6.8,.85,.98,["Zürih","Cenevre","Basel","Lozan","Bern","Winterthur","Lucerne","St. Gallen","Lugano","Sion"],["Granit","Xherdan","Nico","Noah","Fabian","Manuel"],["Lia","Alisha","Ramona","Ana-Maria"],["FC","BSC","Grasshopper","Servette"]],
 ["AT","Avusturya",1,6.8,.85,.9,["Viyana","Graz","Linz","Salzburg","Innsbruck","Klagenfurt","Altach","Ried"],["David","Marcel","Konrad","Florian","Lukas","Christoph"],["Laura","Sarah","Nina","Viktoria"],["SK","SV","FC","LASK"]],
 ["DK","Danimarka",1,6.6,.9,.95,["Kopenhag","Aarhus","Odense","Aalborg","Esbjerg","Randers","Vejle","Silkeborg","Herning"],["Christian","Rasmus","Mikkel","Kasper","Jonas","Pierre-Emile"],["Pernille","Sofie","Nadia","Signe"],["FC","BK","AGF","IF"]],
 ["SE","İsveç",1.5,6,.9,.95,["Stockholm","Göteborg","Malmö","Uppsala","Västerås","Örebro","Linköping","Helsingborg","Norrköping","Jönköping"],["Alexander","Dejan","Viktor","Emil","Isak","Lucas"],["Fridolina","Stina","Hanna","Kosovare"],["IF","FF","AIK","IFK"]],
 ["NO","Norveç",1,5.8,.9,.98,["Oslo","Bergen","Trondheim","Stavanger","Drammen","Kristiansand","Tromsø","Bodø","Molde","Fredrikstad"],["Erling","Martin","Alexander","Sander","Kristian","Ola"],["Ada","Ingrid","Caroline","Guro"],["IL","FK","BK","SK"]],
 ["PL","Polonya",3,6.2,.75,.65,["Varşova","Krakov","Łódź","Wrocław","Poznań","Gdańsk","Szczecin","Bydgoszcz","Lublin","Białystok","Katowice"],["Robert","Piotr","Kuba","Mateusz","Wojciech","Kamil"],["Ewa","Natalia","Zofia","Agnieszka"],["Legia","Lech","KS","Wisła"]],
 ["CZ","Çekya",1.5,6.2,.8,.8,["Prag","Brno","Ostrava","Plzeň","Liberec","Olomouc","Teplice","Jablonec"],["Patrik","Tomáš","Jan","Adam","Ondřej","Vladimír"],["Tereza","Eliška","Karolína","Lucie"],["FK","SK","FC","Bohemians"]],
 ["HU","Macaristan",1,5.4,.7,.7,["Budapeşte","Debrecen","Szeged","Miskolc","Pécs","Győr","Nyíregyháza","Kecskemét","Székesfehérvár"],["Dominik","Roland","Péter","Bálint","Ádám","Milán"],["Anna","Zsófia","Réka","Fanny"],["FC","Honvéd","Vasas","ETO"]],
 ["RO","Romanya",2,5.4,.65,.6,["Bükreş","Cluj","Timişoara","Iaşi","Constanţa","Craiova","Braşov","Galaţi","Ploieşti","Arad"],["Gheorghe","Ianis","Răzvan","Andrei","Nicolae","Dennis"],["Ioana","Andreea","Maria","Raluca"],["FC","CS","Universitatea","Rapid"]],
 ["GR","Yunanistan",1.5,6.3,.7,.65,["Atina","Selanik","Pire","Patras","Heraklion","Larisa","Volos","Yanya","Kavala","Xanthi"],["Giorgos","Kostas","Dimitris","Nikos","Vangelis","Anastasios"],["Maria","Eleni","Sofia","Katerina"],["FC","AE","PAS","Aris"]],
 ["HR","Hırvatistan",1,6,.8,.6,["Zagreb","Split","Rijeka","Osijek","Zadar","Pula","Slaven","Varaždin"],["Luka","Ivan","Josip","Mateo","Marko","Andrej"],["Ana","Lucija","Petra","Iva"],["NK","HNK","GNK","Dinamo"]],
 ["RS","Sırbistan",1.5,5.6,.75,.5,["Belgrad","Novi Sad","Niş","Kragujevac","Subotica","Čačak","Novi Pazar"],["Dušan","Aleksandar","Nemanja","Luka","Sergej","Strahinja"],["Milica","Jelena","Ana","Tijana"],["FK","OFK","Radnički","Vojvodina"]],
 ["BA","Bosna-Hersek",1,4.4,.55,.45,["Saraybosna","Banja Luka","Tuzla","Zenica","Mostar","Bihac"],["Edin","Miralem","Ermedin","Amar","Haris","Sead"],["Amra","Lejla","Emina","Selma"],["FK","NK","Željezničar","Sloboda"]],
 ["AL","Arnavutluk",.6,4,.5,.45,["Tiran","Draç","Vlora","Şkodra","Elbasan","Korce","Fier"],["Armando","Elseid","Kristjan","Ermir","Arlind","Nedim"],["Ardita","Elira","Megi","Arta"],["KF","FK","Vllaznia","Partizani"]],
 ["UA","Ukrayna",3,5.6,.6,.35,["Kiev","Harkiv","Odessa","Dnipro","Lviv","Zaporijya","Kryvyi Rih","Poltava","Vinnytsia"],["Andriy","Oleksandr","Mykhailo","Ruslan","Artem","Illia"],["Daryna","Olha","Iryna","Tetiana"],["FC","SC","Sport","Metalurh"]],
 ["RU","Rusya",6,6.8,.6,.55,["Moskova","St. Petersburg","Novosibirsk","Yekaterinburg","Kazan","Samara","Rostov","Krasnodar","Soçi","Voronej","Nijni Novgorod"],["Aleksandr","Artem","Dmitri","Igor","Maksim","Aleksei"],["Anna","Elena","Daria","Nadejda"],["FK","SKA","Dinamo","Krylia"]],
 ["AZ","Azerbaycan",.8,4.8,.5,.45,["Bakü","Gence","Sumgayıt","Lenkeran","Şeki","Mingeçevir"],["Emin","Ramil","Mahir","Tural","Rüstem","Elvin"],["Leyla","Aysel","Nigar","Günay"],["FK","Nefçi","Sabah","Zire"]],
 ["GE","Gürcistan",.6,4.2,.5,.4,["Tiflis","Kutaisi","Batum","Rustavi","Zugdidi","Gori"],["Khvicha","Giorgi","Otar","Levan","Saba","Zuriko"],["Nino","Mariam","Ana","Tamar"],["FC","Dinamo","Torpedo","Lokomotivi"]],
 // Amerika
 ["BR","Brezilya",10,7.3,.7,.4,["São Paulo","Rio de Janeiro","Brasília","Salvador","Fortaleza","Belo Horizonte","Manaus","Curitiba","Recife","Goiânia","Porto Alegre","Belém","Santos","Campinas","Florianópolis","Natal"],["Gabriel","Lucas","Rafael","Thiago","João","Vinícius","Endrick","Matheus","Bruno"],["Ana","Beatriz","Larissa","Júlia","Marta","Debinha"],["EC","FC","Atlético","Sport"]],
 ["AR","Arjantin",5,7.2,.7,.4,["Buenos Aires","Córdoba","Rosario","Mendoza","La Plata","Tucumán","Mar del Plata","Salta","Santa Fe","San Juan","Bahía Blanca","Avellaneda"],["Santiago","Mateo","Thiago","Facundo","Lautaro","Julián","Enzo","Alexis"],["Sofía","Valentina","Camila","Florencia","Yamila"],["Club","Atlético","Sportivo","Deportivo"]],
 ["UY","Uruguay",1,6,.7,.55,["Montevideo","Salto","Paysandú","Las Piedras","Rivera","Maldonado","Tacuarembó"],["Federico","Darwin","Rodrigo","Agustín","Facundo","Ronald"],["Lucía","Valentina","Florencia","Esperanza"],["CA","Club","Atlético","Defensor"]],
 ["CO","Kolombiya",3,6.1,.55,.4,["Bogotá","Medellín","Cali","Barranquilla","Cartagena","Cúcuta","Bucaramanga","Ibagué","Pereira","Santa Marta","Manizales"],["Juan","Luis","James","Andrés","Jhon","Daniel"],["Linda","Mayra","Catalina","Leicy"],["Atlético","Deportivo","Independiente","América"]],
 ["CL","Şili",2,5.6,.6,.55,["Santiago","Valparaíso","Concepción","La Serena","Antofagasta","Temuco","Rancagua","Talca","Iquique"],["Alexis","Arturo","Benjamín","Matías","Vicente","Darío"],["Catalina","Javiera","Antonia","Christiane"],["CD","Club","Deportes","Unión"]],
 ["PE","Peru",3,4.8,.45,.4,["Lima","Arequipa","Trujillo","Chiclayo","Piura","Cusco","Iquitos","Huancayo"],["Paolo","Renato","Christian","Diego","André","Gianluca"],["Camila","Valeria","Lucía","Pierina"],["Club","Sport","Deportivo","Universitario"]],
 ["EC","Ekvador",2,5.2,.5,.35,["Guayaquil","Quito","Cuenca","Santo Domingo","Machala","Manta","Portoviejo","Ambato"],["Moisés","Piero","Enner","Jordy","Kendry","Pervis"],["Daniela","Paula","María","Ligia"],["SC","Club","Deportivo","Liga"]],
 ["PY","Paraguay",1,5,.5,.35,["Asunción","Ciudad del Este","San Lorenzo","Luque","Encarnación","Capiatá"],["Miguel","Julio","Gustavo","Ramón","Antonio","Junior"],["Jessica","Lice","Fany","Dulce"],["Club","Sportivo","Cerro","Deportivo"]],
 ["VE","Venezuela",2,4,.4,.25,["Caracas","Maracaibo","Valencia","Barquisimeto","Maracay","Ciudad Guayana","Mérida"],["Salomón","Yangel","Jefferson","Luis","Eduard","Yeferson"],["Deyna","Daniuska","Andrea","Oriana"],["FC","Deportivo","Atlético","Caracas"]],
 ["MX","Meksika",5,6.7,.6,.5,["México","Guadalajara","Monterrey","Puebla","Tijuana","León","Juárez","Zapopan","Querétaro","Toluca","Torreón","Pachuca"],["Diego","Santiago","Emiliano","Hirving","Edson","Raúl","Santi"],["Ximena","Renata","Valeria","Charlyn"],["Club","Deportivo","FC","Atlético"]],
 ["US","ABD",5,6.6,.7,.95,["New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia","San Antonio","San Diego","Dallas","Austin","Seattle","Atlanta","Miami","Denver","Columbus","Portland"],["Ethan","Tyler","Christian","Noah","Weston","Gio","Folarin"],["Emma","Ava","Sophia","Mallory","Trinity"],["SC","FC","United","City"]],
 ["CA","Kanada",2,5.8,.7,.95,["Toronto","Montreal","Calgary","Ottawa","Edmonton","Vancouver","Winnipeg","Hamilton","Halifax"],["Alphonso","Jonathan","Liam","Tajon","Cyle","Ismael"],["Christine","Jessie","Ashley","Kadeisha"],["FC","SC","United","Forge"]],
 // Afrika
 ["NG","Nijerya",8,4,.32,.2,["Lagos","Kano","Ibadan","Abuja","Port Harcourt","Benin City","Kaduna","Enugu","Jos","Aba"],["Chinedu","Emeka","Tunde","Victor","Samuel","Ademola","Wilfred"],["Asisat","Ngozi","Blessing","Rasheedat"],["FC","United","Stars","Rangers"]],
 ["GH","Gana",4,4,.35,.25,["Akra","Kumasi","Tamale","Takoradi","Cape Coast","Obuasi"],["Kwame","Kofi","Yaw","Abdul","Mohammed","Thomas"],["Ama","Akosua","Abena","Evelyn"],["SC","Stars","FC","Hearts"]],
 ["SN","Senegal",3,3.6,.38,.25,["Dakar","Touba","Thiès","Rufisque","Kaolack","Ziguinchor","Saint-Louis"],["Ismaïla","Pape","Cheikh","Moussa","Sadio","Nicolas"],["Aïssatou","Fatou","Awa","Ndeye"],["AS","US","Jaraaf","Casa"]],
 ["CI","Fildişi Sahili",3,3.8,.4,.3,["Abidjan","Bouaké","Daloa","Yamoussoukro","San-Pédro","Korhogo"],["Didier","Yaya","Franck","Wilfried","Sébastien","Simon"],["Rita","Josée","Nadège","Ines"],["ASEC","Africa","Stella","SC"]],
 ["CM","Kamerun",3,3.8,.35,.25,["Douala","Yaoundé","Garoua","Bamenda","Bafoussam","Maroua"],["Samuel","André","Vincent","Bryan","Karl","Eric"],["Ajara","Gabrielle","Raissa","Michaela"],["Canon","FC","Coton","Union"]],
 ["ML","Mali",2.5,3.2,.3,.2,["Bamako","Sikasso","Mopti","Koutiala","Kayes","Ségou"],["Seydou","Yves","Amadou","Moussa","Hamari","Kamory"],["Aminata","Fatoumata","Kadidia","Agueissa"],["Djoliba","Stade","Real","AS"]],
 ["CD","Kongo DC",4,3.4,.25,.15,["Kinşasa","Lubumbaşi","Mbuji-Mayi","Kisangani","Kananga","Goma","Bukavu"],["Cédric","Chancel","Yoane","Arthur","Gaël","Théo"],["Grâce","Esther","Merveille","Divine"],["TP","AS","DCMP","Daring"]],
 ["MA","Fas",3,5.6,.5,.4,["Kazablanka","Fes","Tanca","Marakeş","Sale","Meknes","Rabat","Ucde","Agadir","Tetuan"],["Youssef","Achraf","Hakim","Amine","Sofyan","Brahim"],["Salma","Ghizlane","Fatima","Nouhaila"],["Raja","FUS","Wydad","Ittihad"]],
 ["DZ","Cezayir",3,4.8,.45,.4,["Cezayir","Oran","Konstantin","Annaba","Blida","Batna","Setif","Tlemcen"],["Riyad","Ismaël","Islam","Saïd","Amine","Houssem"],["Lina","Yasmine","Amel","Naima"],["MC","CR","USM","JS"]],
 ["TN","Tunus",1.5,4.8,.5,.4,["Tunus","Sfaks","Sus","Kayravan","Bizerte","Gabes","Monastir"],["Wahbi","Ellyes","Hannibal","Aïssa","Youssef","Montassar"],["Ons","Mariem","Rania","Leila"],["Espérance","CS","Étoile","Club"]],
 ["EG","Mısır",5,5.2,.45,.35,["Kahire","İskenderiye","Giza","Şubra el-Hayme","Port Said","Süveyş","Mansura","Tanta","Asyut"],["Mohamed","Omar","Ahmed","Karim","Mostafa","Trezeguet"],["Nour","Salma","Mariam","Sara"],["SC","FC","Club","Al"]],
 ["ZA","Güney Afrika",3,4.6,.45,.45,["Johannesburg","Cape Town","Durban","Pretoria","Soweto","Port Elizabeth","Bloemfontein","Polokwane"],["Thabo","Percy","Themba","Lyle","Teboho","Siyabonga"],["Thembi","Refiloe","Linda","Hildah"],["FC","Chiefs","Pirates","City"]],
 ["ET","Etiyopya",4,2.5,.2,.15,["Addis Ababa","Dire Dawa","Mekele","Gondar","Adama","Hawassa","Bahir Dar"],["Getaneh","Abubeker","Shimelis","Saladin","Dawit","Amanuel"],["Loza","Meskerem","Tigist","Senaf"],["Kenema","FC","Bunna","Ketema"]],
 ["KE","Kenya",2.5,3,.3,.2,["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Machakos"],["Victor","Michael","Dennis","Eric","Ayub","Joseph"],["Mercy","Esse","Wanjiru","Corazone"],["FC","Gor","Leopards","Sharks"]],
 // Asya ve Okyanusya
 ["SA","Suudi Arabistan",2,6.6,.5,.85,["Riyad","Cidde","Mekke","Medine","Dammam","Taif","Tebuk","Ebha"],["Salem","Saud","Firas","Mohammed","Abdullah","Musab"],["Nora","Sara","Reem","Lama"],["Al","Ittihad","Club","Ahli"]],
 ["QA","Katar",.4,5.5,.6,.95,["Doha","Er-Reyyan","El-Vekre","El-Hor","Ümm Salal"],["Akram","Almoez","Hassan","Abdulaziz","Tarek"],["Mariam","Hind","Aisha","Noor"],["Al","SC","Club","Qatar"]],
 ["AE","BAE",.6,5.5,.6,.95,["Dubai","Abu Dabi","Şarja","El-Ayn","Acman","Ras El-Hayme"],["Ali","Omar","Khalfan","Yahia","Harib"],["Hessa","Shaikha","Mozah","Houriya"],["Al","Club","FC","Shabab"]],
 ["IR","İran",4,5.2,.45,.4,["Tahran","Meşhed","İsfahan","Kerec","Şiraz","Tebriz","Kum","Ahvaz","Kirman"],["Mehdi","Sardar","Alireza","Ali","Saman","Ramin"],["Zahra","Maryam","Fatemeh","Niloufar"],["FC","Esteghlal","Sepahan","Pars"]],
 ["IQ","Irak",3,4,.35,.3,["Bağdat","Basra","Musul","Erbil","Necef","Kerbela","Süleymaniye","Kerkük"],["Aymen","Mohanad","Ali","Ibrahim","Amjad","Zidane"],["Noor","Zainab","Hawra","Rusul"],["Al","FC","Club","Zawraa"]],
 ["UZ","Özbekistan",3,4.3,.4,.3,["Taşkent","Namangan","Semerkant","Andican","Fergana","Buhara","Karsi","Nukus"],["Eldor","Abbosbek","Jaloliddin","Otabek","Husniddin","Abdukodir"],["Madina","Dilnoza","Nilufar","Sevara"],["Pakhtakor","FK","Nasaf","Navbahor"]],
 ["IN","Hindistan",8,3,.2,.25,["Mumbai","Delhi","Bengaluru","Haydarabad","Ahmedabad","Çennai","Kalküta","Pune","Goa","Kochi","Shillong","Imphal"],["Aarav","Rohan","Sunil","Arjun","Sahal","Lallianzuala"],["Priya","Ananya","Bala","Manisha"],["FC","United","Blasters","City"]],
 ["PK","Pakistan",6,1.8,.15,.2,["Karaçi","Lahor","Faysalabad","Ravalpindi","Gujranwala","Pişaver","Multan","İslamabad","Ketta"],["Hamza","Ali","Hassan","Bilal","Usman","Otis"],["Ayesha","Fatima","Hira","Maria"],["FC","Club","United","WAPDA"]],
 ["BD","Bangladeş",4,2,.15,.2,["Dakka","Çitagong","Khulna","Rajshahi","Sylhet","Rangpur"],["Jamal","Rahim","Sohel","Tariq","Arif","Rakib"],["Sabina","Krishna","Maria","Sanjida"],["Kings","Abahani","Club","Mohammedan"]],
 ["CN","Çin",6,4.6,.35,.6,["Şanghay","Pekin","Çongqing","Guangzhou","Shenzhen","Çengdu","Tianjin","Wuhan","Xi'an","Hangzhou","Dalian","Jinan"],["Hao","Lei","Wei","Jun","Wu","Zhang"],["Mei","Ling","Xue","Shanshan"],["FC","Taishan","Port","Shenhua"]],
 ["JP","Japonya",4,6.6,.75,.85,["Tokyo","Yokohama","Osaka","Nagoya","Sapporo","Fukuoka","Kobe","Kawasaki","Kyoto","Saitama","Hiroşima","Kashima"],["Haruto","Kaoru","Takumi","Ritsu","Wataru","Takefusa","Daichi"],["Yui","Hina","Mana","Saki"],["FC","Frontale","Reds","Marinos"]],
 ["KR","Güney Kore",3,6.1,.7,.85,["Seul","Busan","Incheon","Daegu","Daejeon","Gwangju","Ulsan","Suwon","Pohang","Jeonju"],["Min-jun","Seo-jun","Heung-min","Ji-ho","Kang-in","Min-jae"],["Seo-yeon","Ji-woo","Ha-eun","So-yun"],["FC","Hyundai","Steelers","United"]],
 ["VN","Vietnam",4,4.2,.45,.4,["Ho Chi Minh","Hanoi","Hai Phong","Da Nang","Can Tho","Bien Hoa","Nam Dinh"],["Quang Hai","Cong Phuong","Van Hau","Tien Linh","Duc Chinh","Hoang Duc"],["Huynh Nhu","Thu Thao","Bich Thuy","Thanh Nha"],["FC","CLB","Club","The Cong"]],
 ["TH","Tayland",3,4.4,.45,.5,["Bangkok","Nonthaburi","Nakhon Ratchasima","Chiang Mai","Hat Yai","Buriram","Chonburi","Udon Thani"],["Chanathip","Teerasil","Supachok","Theerathon","Suphanat","Ekanit"],["Kanyanat","Pikul","Orathai","Taneekarn"],["FC","United","City","Port"]],
 ["ID","Endonezya",6,4,.3,.3,["Cakarta","Surabaya","Bandung","Medan","Semarang","Makassar","Palembang","Bali","Malang","Yogyakarta"],["Rizky","Bagus","Asnawi","Dimas","Pratama","Marselino"],["Siti","Putri","Ayu","Zahra"],["FC","Persatuan","United","Arema"]],
 ["PH","Filipinler",4,2.4,.2,.3,["Manila","Quezon City","Davao","Cebu","Zamboanga","Iloilo","Bacolod"],["Neil","Stephan","Patrick","Javier","Mark","Sandro"],["Sarina","Hali","Quinley","Jessika"],["FC","United","Stallions","Kaya"]],
 ["AU","Avustralya",2,5.8,.75,.95,["Sidney","Melbourne","Brisbane","Perth","Adelaide","Gold Coast","Newcastle","Canberra","Wollongong"],["Mathew","Jackson","Harry","Riley","Mitchell","Nestory"],["Sam","Ellie","Caitlin","Mary"],["FC","City","Victory","United"]],
];
// üst lig, ikinci lig, amatör lig
const LG={TR:["Süper Lig","TFF 1. Lig","Bölgesel Amatör Lig"],DE:["Bundesliga","2. Bundesliga","Oberliga"],EN:["Premier League","Championship","Non-League"],ES:["LaLiga","LaLiga 2","Tercera Federación"],
 FR:["Ligue 1","Ligue 2","National 3"],IT:["Serie A","Serie B","Serie D"],NL:["Eredivisie","Eerste Divisie","Derde Divisie"],PT:["Liga Portugal","Liga Portugal 2","Campeonato de Portugal"],
 BE:["Pro League","Challenger Pro League","Nationale 1"],SC:["Premiership","Championship","Lowland League"],CH:["Super League","Challenge League","Promotion League"],AT:["Bundesliga","2. Liga","Regionalliga"],
 DK:["Superliga","1. Division","Danmarksserien"],SE:["Allsvenskan","Superettan","Division 2"],NO:["Eliteserien","OBOS-ligaen","Norsk Tipping-ligaen"],PL:["Ekstraklasa","I liga","III liga"],
 GR:["Super League","Super League 2","Gamma Ethniki"],RU:["Premier Liga","FNL","Amatör Lig"],BR:["Brasileirão Série A","Série B","Estadual"],AR:["Liga Profesional","Primera Nacional","Torneo Federal"],
 US:["MLS","USL Championship","USL League Two"],MX:["Liga MX","Liga de Expansión","Liga TDP"],JP:["J1 League","J2 League","JFL"],KR:["K League 1","K League 2","K3 League"],
 SA:["Saudi Pro League","First Division","Amatör Lig"],CN:["Super League","League One","Amatör Lig"],AU:["A-League","NPL","State League"],CA:["Canadian Premier League","League1","Amatör Lig"]};

// Türkiye: 81 il ve yaklaşık nüfusları (bin kişi). Doğum yeri nüfusa göre seçilir.
const TRC=[["İstanbul",15655],["Ankara",5803],["İzmir",4479],["Bursa",3214],["Antalya",2696],["Konya",2320],["Adana",2270],["Şanlıurfa",2213],["Gaziantep",2164],["Kocaeli",2102],
 ["Mersin",1916],["Diyarbakır",1818],["Hatay",1544],["Manisa",1475],["Kayseri",1445],["Samsun",1377],["Balıkesir",1273],["Tekirdağ",1167],["Aydın",1161],["Van",1128],
 ["Kahramanmaraş",1116],["Sakarya",1100],["Muğla",1066],["Denizli",1059],["Eskişehir",915],["Mardin",888],["Trabzon",818],["Ordu",763],["Erzurum",749],["Afyonkarahisar",747],
 ["Malatya",742],["Sivas",634],["Batman",634],["Adanaı",0],["Adıyaman",610],["Tokat",597],["Elazığ",591],["Zonguldak",588],["Kütahya",580],["Çanakkale",559],["Şırnak",557],
 ["Osmaniye",557],["Çorum",524],["Ağrı",510],["Giresun",450],["Isparta",449],["Aksaray",433],["Yozgat",418],["Edirne",413],["Düzce",409],["Muş",399],
 ["Kastamonu",388],["Uşak",375],["Kırklareli",369],["Niğde",365],["Bitlis",353],["Rize",345],["Amasya",337],["Siirt",331],["Bolu",320],["Nevşehir",310],
 ["Yalova",296],["Bingöl",282],["Kırıkkale",278],["Hakkari",275],["Kars",274],["Burdur",273],["Karaman",260],["Karabük",252],["Kırşehir",244],["Erzincan",239],
 ["Bilecik",228],["Sinop",220],["Bartın",207],["Iğdır",204],["Çankırı",197],["Artvin",169],["Kilis",146],["Gümüşhane",145],["Ardahan",92],["Tunceli",89],["Bayburt",85]].filter(x=>x[1]>0);
// büyük şehirlerde gerçek ilçe/semtler: [geçim sıkıntısı, orta halli, varlıklı]
const TR_SEMT={
 "İstanbul":[["Bağcılar","Esenyurt","Sultangazi","Gaziosmanpaşa","Sultanbeyli","Zeytinburnu","Esenler","Arnavutköy"],["Bakırköy","Üsküdar","Bahçelievler","Maltepe","Kartal","Fatih","Kadıköy Fikirtepe","Pendik","Beylikdüzü"],["Beşiktaş","Sarıyer","Ataşehir","Kadıköy Moda","Beykoz","Etiler"]],
 "Ankara":[["Altındağ","Mamak","Sincan"],["Keçiören","Yenimahalle","Etimesgut","Pursaklar","Polatlı"],["Çankaya","Gölbaşı","Ümitköy"]],
 "İzmir":[["Kadifekale","Buca","Bayraklı","Karabağlar"],["Karşıyaka","Bornova","Çiğli","Konak","Torbalı"],["Bostanlı","Urla","Çeşme","Narlıdere"]],
 "Bursa":[["Yıldırım","Gürsu"],["Osmangazi","İnegöl","Mudanya","Gemlik"],["Nilüfer"]],
 "Antalya":[["Kepez","Döşemealtı"],["Muratpaşa","Manavgat","Alanya","Serik"],["Konyaaltı","Lara"]],
 "Adana":[["Yüreğir","Seyhan Şakirpaşa"],["Seyhan","Ceyhan","Kozan"],["Çukurova"]],
 "Konya":[["Karatay"],["Meram","Ereğli","Akşehir"],["Selçuklu"]],
 "Gaziantep":[["Şahinbey"],["Şehitkamil","Nizip"],["İbrahimli"]],
 "Kocaeli":[["Dilovası","Körfez"],["İzmit","Gebze","Gölcük","Derince"],["Başiskele"]],
 "Trabzon":[["Çömlekçi","Sürmene"],["Ortahisar","Akçaabat","Of","Arsin"],["Yomra"]],
 "Diyarbakır":[["Bağlar","Sur"],["Yenişehir","Ergani"],["Kayapınar"]],
 "Samsun":[["Canik","Tekkeköy"],["İlkadım","Bafra","Çarşamba"],["Atakum"]],
 "Mersin":[["Akdeniz","Tarsus"],["Toroslar","Erdemli","Silifke"],["Yenişehir","Mezitli"]],
 "Kayseri":[["Kocasinan Ziyagökalp"],["Kocasinan","Talas"],["Melikgazi"]],
 "Eskişehir":[["Odunpazarı kenar"],["Odunpazarı","Tepebaşı"],["Bağlarbaşı"]],
 "Şanlıurfa":[["Eyyübiye","Siverek"],["Haliliye","Viranşehir"],["Karaköprü"]],
};
const GEN=[["işçi mahallesi","kenar mahalle","bir köy"],["merkeze yakın bir mahalle","yeni yerleşim bölgesi","çarşı civarı"],["yeni sitelerden biri","villa bölgesi"]];

// Ek adlar (m) ve soyadlar (s). Oyuncu adı = ad + soyad.
const NAMES={
 TR:{m:["Ahmet","Mehmet","Mustafa","Ali","Hüseyin","Hasan","İbrahim","İsmail","Osman","Murat","Emre","Oğuz","Cenk","Tolga","Barış","Onur","Serkan","Hakan","Volkan","Umut","Can","Deniz","Furkan","Yiğit","Doruk","Alp","Batuhan","Enes","Taha","Berat","Ozan","Cem","Kenan","Orkun","Ferdi","Arda","Salih","Abdülkadir","Halil","Recep","Ramazan","Musa","Yunus","Mirza","Rojhat","Serhat","Sinan","Gökhan","Erkan","Selçuk"],
     f:["Fatma","Hatice","Emine","Merve","Büşra","Gizem","Kübra","İrem","Naz","Ebru","Sibel","Derya","Seda","Pınar","Aslı","Tuğba","Dilan","Rojda","Beren","Ela","Asya","Duru","Nehir","Yağmur","Buse"],
     s:["Yılmaz","Kaya","Demir","Şahin","Çelik","Yıldız","Yıldırım","Öztürk","Aydın","Özdemir","Arslan","Doğan","Kılıç","Aslan","Çetin","Kara","Koç","Kurt","Özkan","Şimşek","Polat","Korkmaz","Erdoğan","Güneş","Aksoy","Uçar","Tekin","Bulut","Akın","Turan","Kahraman","Avcı","Sarı","Bozkurt","Tunç","Ateş","Altun","Ekinci","Kaplan","Bayram","Güler","Coşkun","Karakaya","Acar","Yavuz","Toprak","Sevim","Akbulut","Uysal","Taş"]},
 DE:{m:["Maximilian","Felix","Elias","Noah","Ben","Moritz","Tim","Niklas","Julian","Jannik","Malik","Thomas","Mats","Toni","Marco","İlkay","Serge","Leroy","Antonio","Karim"],s:["Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Schulz","Hoffmann","Koch","Richter","Klein","Wolf","Yıldırım","Kowalski","Nowak"]},
 EN:{m:["Charlie","Thomas","Oscar","William","James","Henry","Leo","Archie","Joshua","Freddie","Marcus","Raheem","Kieran","Jadon","Mason","Trent","Jude","Cole","Ollie","Callum","Kobbie","Reece","Tyrone","Ashley"],s:["Smith","Jones","Taylor","Brown","Williams","Wilson","Johnson","Davies","Robinson","Wright","Thompson","Evans","Walker","White","Roberts","Green","Hall","Wood","Jackson","Clarke","Okafor","Mensah","Patel"]},
 ES:{m:["Sergio","Carlos","Javier","Adrián","Iker","Mario","Diego","Martín","Raúl","Andrés","Xavi","Gavi","Fermín","Nico","Unai","Mikel","Ansu","Dani","Fernando","Jordi"],s:["García","Fernández","González","Rodríguez","López","Martínez","Sánchez","Pérez","Gómez","Martín","Jiménez","Ruiz","Hernández","Díaz","Moreno","Muñoz","Álvarez","Romero","Torres","Navarro","Williams"]},
 FR:{m:["Louis","Gabriel","Arthur","Jules","Adam","Mohamed","Antoine","Paul","Olivier","Eduardo","Aurélien","Randal","Ibrahima","Dayot","William","Mattéo","Warren","Bradley","Youssouf","Mamadou"],s:["Martin","Bernard","Dubois","Thomas","Robert","Richard","Petit","Durand","Leroy","Moreau","Simon","Laurent","Lefebvre","Michel","Garcia","Diallo","Traoré","Camara","Koné"]},
 IT:{m:["Leonardo","Francesco","Andrea","Gabriele","Riccardo","Tommaso","Edoardo","Giacomo","Davide","Ciro","Gianluca","Marco","Federico","Giorgio","Alessio","Simone","Fabio","Stefano","Daniele","Paolo"],s:["Rossi","Russo","Ferrari","Esposito","Bianchi","Romano","Colombo","Ricci","Marino","Greco","Bruno","Gallo","Conti","De Luca","Mancini","Costa"]},
 NL:{m:["Lucas","Levi","Thijs","Luuk","Jesse","Ruben","Daley","Matthijs","Memphis","Cody","Denzel","Jurriën","Joshua","Teun","Stefan","Wout"],s:["de Jong","Jansen","de Vries","van den Berg","van Dijk","Bakker","Visser","Smit","Meijer","Mulder","de Boer","Bos","Vos","Peters","Hendriks","Dekker"]},
 PT:{m:["Cristiano","Bruno","Rúben","Nuno","Pedro","André","Francisco","Duarte","Martim","Afonso","Vitinha","Nélson","Ricardo","Luís","Pepe","Renato"],s:["Silva","Santos","Ferreira","Pereira","Oliveira","Costa","Rodrigues","Martins","Jesus","Sousa","Fernandes","Gonçalves","Gomes","Lopes","Marques","Neves","Dias"]},
 BE:{m:["Eden","Thibaut","Axel","Dries","Leandro","Charles","Toby","Jan","Yannick","Michy","Thomas","Simon","Maxime","Wout","Noah","Jules"],s:["Peeters","Janssens","Maes","Jacobs","Mertens","Willems","Claes","Goossens","Wouters","De Smet","Dubois","Lambert","Dupont"]},
 BR:{m:["Pedro","Gustavo","Felipe","Guilherme","Leonardo","Caio","Diego","Neymar","Raphinha","Rodrygo","Richarlison","Casemiro","Marquinhos","Éder","Danilo","Alisson","Ederson","Wesley","Douglas","Ronaldo","Romário","Kaká","Adriano","Hulk","Luan","Estêvão","Savinho","Igor","Murilo","Cauã"],
     s:["Silva","Santos","Oliveira","Souza","Rodrigues","Ferreira","Alves","Pereira","Lima","Gomes","Costa","Ribeiro","Martins","Carvalho","Almeida","Lopes","Soares","Fernandes","Vieira","Barbosa","Rocha","Dias","Nascimento","Moreira","Cardoso","Teixeira","Nunes","Mendes","Freitas","Batista"]},
 AR:{m:["Lionel","Ángel","Rodrigo","Nicolás","Emiliano","Gonzalo","Paulo","Sergio","Cristian","Leandro","Alejandro","Valentín","Franco","Gabriel","Marcos","Exequiel","Nahuel","Lisandro","Giovani","Germán"],s:["González","Rodríguez","Gómez","Fernández","López","Díaz","Martínez","Pérez","Romero","Sosa","Álvarez","Torres","Ruiz","Ramírez","Flores","Acosta","Benítez","Medina","Herrera","Suárez","Aguirre"]},
 US:{m:["Jordan","Brandon","Jacob","Mason","Logan","Caleb","Michael","Matthew","Landon","Clint","Tim","DeAndre","Brenden","Ricardo","Malik","Josh","Sergiño","Yunus","Antonee","Haji"],s:["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Wilson","Anderson","Thomas","Moore","Jackson","Adams","Robinson","Wright"]},
 MX:{m:["José","Luis","Carlos","Jesús","Miguel","Javier","Alejandro","Rodolfo","Hirving","César","Andrés","Jorge","Guillermo","Héctor","Orbelín","Uriel","Alexis","Érick","Julián","Gilberto"],s:["Hernández","García","Martínez","López","González","Pérez","Rodríguez","Sánchez","Ramírez","Cruz","Flores","Gómez","Morales","Vázquez","Reyes","Jiménez","Torres","Díaz","Gutiérrez","Álvarez","Chávez","Vega"]},
 NG:{m:["Ahmed","Kelechi","Alex","Wilfred","Joe","Ola","Taiwo","Kenneth","Moses","Calvin","Bright","Frank","Ademola","Ademide","Uche","Ikenna","Obinna","Tochukwu","Babatunde","Femi","Nnamdi","Musa","Abdullahi","Ibrahim"],s:["Okafor","Adeyemi","Okonkwo","Eze","Nwosu","Ogunleye","Bello","Ibrahim","Abubakar","Musa","Okoro","Adebayo","Olawale","Chukwu","Simon"]},
 JP:{m:["Sota","Yuto","Riku","Hayato","Shoma","Ritsu","Kaoru","Takumi","Wataru","Daichi","Junya","Ayase","Hidemasa","Ko","Yuki","Kyogo","Daizen","Shuto","Hiroki","Keito"],s:["Sato","Suzuki","Takahashi","Tanaka","Watanabe","Ito","Yamamoto","Nakamura","Kobayashi","Kato","Yoshida","Yamada","Sasaki","Yamaguchi","Matsumoto","Inoue","Kimura","Hayashi"]},
 KR:{m:["Do-yun","Ye-jun","Si-woo","Ju-won","Ha-jun","Jun-woo","Hyun-woo","Ji-hoon","Woo-young","Gue-sung","Hee-chan","In-beom","Seung-ho","Tae-hwan","Young-gwon","Jae-sung"],s:["Kim","Lee","Park","Choi","Jung","Kang","Cho","Yoon","Jang","Lim","Han","Oh","Seo","Shin","Kwon","Hwang","Ahn","Song","Hong"]},
 CN:{m:["Yang","Hao","Chen","Liang","Bin","Tao","Peng","Xin","Lin","Kai","Yu","Bo","Jian","Ming","Jie","Long","Ning","Ye"],s:["Wang","Li","Zhang","Liu","Chen","Yang","Huang","Zhao","Wu","Zhou","Xu","Sun","Ma","Zhu","Hu","Guo","He","Gao","Lin","Luo","Zheng"]},
 IN:{m:["Vihaan","Aditya","Krishna","Ishaan","Sahil","Anirudh","Lalengmawia","Sandesh","Gurpreet","Brandon","Udanta","Ashique","Manvir","Liston","Chhangte","Akash","Nikhil","Rahul","Jeakson","Thapa"],s:["Singh","Kumar","Sharma","Patel","Thapa","Das","Reddy","Nair","Fernandes","D'Souza","Bose","Iyer","Gogoi"]},
 EG:{m:["Mahmoud","Hossam","Mostafa","Amr","Tarek","Khaled","Youssef","Ahmed","Abdallah","Hamdi","Emam","Zizo","Ibrahim","Marwan","Hazem","Ziad"],s:["Fathi","Hamed","Mohsen","Said","Hassan","Ali","Mahmoud","Ibrahim","Mostafa","Kamal","Fawzi"]},
 MA:{m:["Hakim","Noussair","Sofiane","Azzedine","Romain","Bilal","Zakaria","Ayoub","Ilias","Abde","Ismael","Selim","Yassine","Nayef","Anass","Hamza"],s:["Diaz","Bennani","El Idrissi","Alaoui","Benjelloun","Tazi","Chraibi"]},
 SN:{m:["Idrissa","Kalidou","Édouard","Boulaye","Iliman","Krépin","Pathé","Habib","Abdou","Mame","Lamine","Ousmane","Alioune","Babacar","Ibrahima","Mamadou"],s:["Mendy","Sarr","Diallo","Ndiaye","Gueye","Diop","Fall","Sow","Ba","Cissé","Niang","Faye","Dieng","Seck"]},
 GH:{m:["Kwabena","Kwaku","Kojo","Kwesi","Inaki","Jordan","André","Mohammed","Thomas","Daniel","Antoine","Joseph","Emmanuel","Ernest","Asamoah","Michael"],s:["Mensah","Owusu","Boateng","Asante","Appiah","Osei","Agyeman","Ofori","Williams"]},
 RU:{m:["Sergei","Andrei","Pavel","Nikolai","Ivan","Mikhail","Kirill","Yuri","Anton","Fyodor","Aleksandr","Vladislav","Daniil","Ilya","Matvei","Roman"],s:["Ivanov","Smirnov","Kuznetsov","Popov","Vasiliev","Petrov","Sokolov","Mikhailov","Novikov","Fedorov","Morozov","Volkov"]},
 PL:{m:["Jakub","Jan","Szymon","Filip","Kacper","Wojciech","Łukasz","Grzegorz","Krzysztof","Arkadiusz","Przemysław","Sebastian","Nicola","Jakub","Bartosz","Adam"],s:["Nowak","Kowalski","Wiśniewski","Wójcik","Kowalczyk","Kamiński","Zieliński","Szymański","Woźniak","Dąbrowski","Kozłowski","Jankowski"]},
 IR:{m:["Mohammad","Hossein","Reza","Amir","Mehdi","Ehsan","Saeid","Milad","Karim","Alireza","Majid","Vahid","Morteza","Omid"],s:["Hosseini","Rezaei","Ahmadi","Mohammadi","Karimi","Moradi","Hashemi"]},
 ID:{m:["Egy","Witan","Ricky","Pratama","Jordi","Elkan","Sandy","Rafael","Ivar","Thom","Justin","Ragnar","Hokky","Ernando","Yakob"],s:["Saputra","Pratama","Wijaya","Hidayat","Santoso","Kurniawan","Setiawan","Nugroho","Maulana","Arhan"]},
};

const LV=["Mahalle maçları","Okul takımı","Altyapı akademisi","Amatör lig","Profesyonel alt lig","Üst lig","Avrupa'nın büyük ligleri","Dünya devi"];
const T={4:55,5:65,6:76,7:86};
const POS=["Kaleci","Defans","Orta saha","Forvet"];
const POSW=[1,4,4,3];
const homeMax=c=>c[3]>=8.8?7:c[3]>=7.8?6:5;

function pickCountry(mode){
  if(mode==="TR") return C[0];
  const tot=C.reduce((s,c)=>s+c[2],0);let r=R()*tot;
  for(const c of C){r-=c[2];if(r<=0)return c;}return C[0];
}
function salary(p){
  const l=p.level; if(l<3)return 0;
  const cs=(p.club&&p.club.country&&p.club.country[3])||p.c[3];
  const base={3:2500,4:28000,5:Math.round(40000*Math.pow(1.45,cs-4)),6:1600000,7:11000000}[l];
  const s=base*(0.6+(eff(p)-T[Math.max(4,l)]||0)/40+0.4)*(p.agent?1.1:1);
  return Math.max(1500,Math.round((p.female?s/(l>=6?14:6):s)/500)*500);
}
const fmtE=n=>n>=1e6?"€"+(n/1e6).toFixed(n>=1e7?0:1).replace(".",",")+" mn":n>=1000?"€"+Math.round(n/1000)+" bin":"€"+n;

function wpick(arr){let t=0;for(const x of arr)t+=x[1];let r=R()*t;for(const x of arr){r-=x[1];if(r<=0)return x[0];}return arr[0][0];}
function cityOf(c){if(c[0]==="TR")return wpick(TRC);return wpick(c[6].map((x,i)=>[x,1/Math.pow(i+1,.6)]));}
function clubName(c,city,big){
  if(big){const B={ES:["Real","Atlético"],FR:["Olympique","Stade","Paris"],IT:["Inter","AC","Juventus"],EN:["United","City"],DE:["Borussia","Bayern","FC"],PT:["Sporting","SL"],NL:["PSV","AFC"],BR:["Flamengo","Corinthians"],AR:["River","Racing"]}[c[0]];if(B){const b=pick(B);return ["United","City"].includes(b)?city+" "+b:b+" "+city;}}
  if(c[0]==="TR")return pick([city+"spor",city+" FK",city+" Gençlikspor",city+" Belediyespor",city+" İdmanyurdu"]);
  return R()<.5?city+" "+pick(c[9]):pick(c[9])+" "+city;
}
function leagueName(c,lvl){const L=LG[c[0]]||[c[1]+" 1. Ligi",c[1]+" 2. Ligi",c[1]+" amatör ligi"];return lvl>=5?L[0]:lvl===4?L[1]:L[2];}
function club(p,lvl,abroad,home,stay){
  let c=p.c;
  const curC=p.club&&p.club.country&&C.find(x=>x[0]===p.club.country[0]);
  if(abroad){const strong=C.filter(x=>x[3]>=(lvl>=6?8.8:7.8)&&x!==p.c);c=pick(strong);}
  else if(curC&&homeMax(curC)>=lvl&&(stay||lvl>homeMax(p.c)))c=curC; // aynı seviyede transfer: oynadığın ülkede kal
  else if(lvl>homeMax(c))c=pick(C.filter(x=>homeMax(x)>=lvl&&x!==p.c)); // ülkende o seviye yoksa güçlü bir ülkeye
  if(home&&c!==p.c)home=false;
  const city=home?p.fam.city:cityOf(c);
  return {name:clubName(c,city,lvl===7&&c[0]!=="TR"),country:c,league:lvl>=3?leagueName(c,lvl):""};
}
function leagueOf(p){const L=p.level;if(L===0)return "Mahalle maçları";if(L===1)return "Okullar arası lig";if(L===2)return "U"+(p.age<=14?"15":p.age<=16?"17":"19")+" Gelişim Ligi";return p.club&&p.club.league?p.club.league:"—";}
const SURN_ALIAS={CO:"AR",CL:"AR",PE:"AR",EC:"AR",PY:"AR",VE:"AR",UY:"AR",SC:"EN",IE:"EN",AU:"EN",CA:"EN",AT:"DE",CH:"DE",DZ:"MA",TN:"MA",SA:"EG",QA:"EG",AE:"EG",IQ:"EG",CI:"SN",CM:"SN",ML:"SN",CD:"SN"};

Object.assign(NAMES,{
 DK:{s:["Jensen","Nielsen","Hansen","Pedersen","Andersen","Christensen","Larsen","Sørensen","Rasmussen","Jørgensen","Madsen","Kristensen","Olsen","Thomsen","Poulsen","Møller"]},
 SE:{s:["Andersson","Johansson","Karlsson","Nilsson","Eriksson","Larsson","Olsson","Persson","Svensson","Gustafsson","Pettersson","Jonsson","Lindberg","Lindström","Berg","Holm"]},
 NO:{s:["Hansen","Johansen","Olsen","Larsen","Andersen","Pedersen","Nilsen","Kristiansen","Jensen","Karlsen","Berg","Haugen","Hagen","Bakke","Solberg","Lie"]},
 CZ:{s:["Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec","Marek","Pokorný","Král","Růžička"]},
 HU:{s:["Nagy","Kovács","Tóth","Szabó","Horváth","Varga","Kiss","Molnár","Németh","Farkas","Balogh","Papp","Takács","Juhász"]},
 RO:{s:["Popescu","Ionescu","Popa","Dumitru","Stan","Stoica","Gheorghe","Matei","Ciobanu","Rusu","Munteanu","Constantin","Mihai","Lazăr"]},
 GR:{s:["Papadopoulos","Papadakis","Georgiou","Nikolaidis","Dimitriou","Pappas","Oikonomou","Vasileiou","Christodoulou","Karagiannis","Antoniou","Makris","Ioannou","Alexiou"]},
 HR:{s:["Horvat","Kovačević","Babić","Marić","Jurić","Novak","Knežević","Vuković","Marković","Petrović","Matić","Tomić","Pavlović","Božić"]},
 RS:{s:["Jovanović","Petrović","Nikolić","Marković","Đorđević","Stojanović","Ilić","Stanković","Pavlović","Milošević","Popović","Kostić","Lazić","Živković"]},
 BA:{s:["Hodžić","Hadžić","Begić","Delić","Kovačević","Mehmedović","Hasanović","Salihović","Omerović","Imamović","Ibrahimović","Mujić"]},
 AL:{s:["Hoxha","Shehu","Krasniqi","Gashi","Berisha","Morina","Leka","Basha","Çela","Dervishi","Kola","Meta"]},
 UA:{s:["Melnyk","Shevchenko","Kovalenko","Bondarenko","Tkachenko","Kravchenko","Oliinyk","Shevchuk","Polishchuk","Lysenko","Rudenko","Savchenko","Marchenko","Moroz"]},
 AZ:{s:["Məmmədov","Əliyev","Həsənov","Hüseynov","Quliyev","İsmayılov","Abdullayev","Rəhimov","Kərimov","Nəsirov"]},
 GE:{s:["Beridze","Kapanadze","Gelashvili","Maisuradze","Giorgadze","Lomidze","Tsiklauri","Bolkvadze","Kvaratskhelia","Mamardashvili","Chakvetadze","Kiteishvili"].filter(x=>!["Kvaratskhelia","Mamardashvili"].includes(x))},
 ZA:{s:["Dlamini","Nkosi","Ndlovu","Khumalo","Mokoena","Mahlangu","Mthembu","Zulu","Sithole","Botha","Van der Merwe","Mokwena","Tau","Mabaso"]},
 ET:{s:["Tesfaye","Bekele","Girma","Haile","Alemu","Tadesse","Kebede","Mengistu","Abebe","Wolde","Desta","Gebre"]},
 KE:{s:["Otieno","Odhiambo","Wanjala","Mwangi","Kamau","Kiprop","Ochieng","Njoroge","Omondi","Wekesa","Mutua","Kariuki"]},
 UZ:{s:["Karimov","Rakhimov","Yusupov","Tursunov","Abdullaev","Nazarov","Sultonov","Ergashev","Saidov","Mirzaev","Khamraev","Usmonov"]},
 PK:{s:["Khan","Ahmed","Ali","Hussain","Malik","Iqbal","Butt","Qureshi","Shah","Raza","Chaudhry","Sheikh"]},
 BD:{s:["Rahman","Hossain","Islam","Ahmed","Uddin","Chowdhury","Khan","Akter","Sarkar","Mia","Haque","Kabir"]},
 VN:{s:["Nguyễn","Trần","Lê","Phạm","Hoàng","Huỳnh","Phan","Vũ","Võ","Đặng","Bùi","Đỗ"]},
 TH:{s:["Saelim","Srisuk","Wongsa","Chaiyaporn","Boonmee","Kaewkla","Rattanakorn","Sukjai","Thongdee","Pholsri","Inthasorn","Jaidee"]},
 PH:{s:["Santos","Reyes","Cruz","Bautista","Garcia","Mendoza","Villanueva","Ramos","Aquino","Castillo","Dela Cruz","Navarro"]},
});
function nameSet(c){const own=NAMES[c[0]]||{},al=NAMES[SURN_ALIAS[c[0]]]||{};return {m:c[7].concat(own.m||[]),f:c[8].concat(own.f||[]),s:own.s||al.s||null};}
function fullName(c,fem){const S=nameSet(c);const first=pick(fem?S.f:S.m);const last=S.s?pick(S.s):pick(c[7].filter(x=>x!==first));return first+" "+last;}
const firstName=n=>n.split(" ")[0];
const lastName=n=>n.split(" ").slice(1).join(" ");

const JOBS={
 dad:[["inşaat işçisi","seyyar satıcı","taksici","fabrika işçisi","mevsimlik tarım işçisi","kapıcı","balıkçı","şu an işsiz"],
      ["öğretmen","bakkal işletiyor","polis memuru","otobüs şoförü","elektrikçi","berber","kamu memuru","oto tamircisi"],
      ["doktor","iş insanı","mühendis","avukat","müteahhit","fabrika sahibi"]],
 mom:[["ev hanımı","temizlik işçisi","terzi","fabrika işçisi","pazarda satıcı"],
      ["ev hanımı","hemşire","öğretmen","kuaför","memur","muhasebeci"],
      ["doktor","mimar","bankacı","avukat","akademisyen","ev hanımı"]]};
const CLS=["Geçim sıkıntısı","Orta halli","Varlıklı"];
const cap=s=>s.charAt(0).toLocaleUpperCase("tr")+s.slice(1);
const place=p=>p.c[0]==="TR"?p.fam.semt:p.fam.semt+" · "+p.c[1];
function makeFamily(c){
  const r=R(),pr=(1-c[5])*.6,rr=c[5]*.3;
  const cls=r<pr?0:r>1-rr?2:1;
  const city=cityOf(c);let semt;
  if(c[0]==="TR"&&TR_SEMT[city])semt=city+", "+pick(TR_SEMT[city][cls]);
  else if(c[0]==="BR"&&cls===0)semt=city+", bir favela";
  else semt=city+", "+pick(GEN[cls]);
  return {cls,city,semt,dad:pick(JOBS.dad[cls]),mom:pick(JOBS.mom[cls]),sib:ri(0,cls===0?4:2),dadfoot:R()<.12};
}
function makePlayer(mode,isYou){
  const c=pickCountry(mode),female=false;
  const name=fullName(c,female);
  const pos=(()=>{let r=R()*12;for(let i=0;i<4;i++){r-=POSW[i];if(r<=0)return POS[i];}return POS[3];})();
  const fam=makeFamily(c),w=clamp(c[5]*.6+fam.cls*.2,0,1);
  return {form:[],injM:0,injName:"",injOut:0,relapse:null,cups:[],awards:[],cApps:0,cGoals:0,cAs:0,natNow:false,bond:50,lang:0,assists:0,yApps:0,yGoals:0,hist:[],cur:null,homes:[],kids:[],babyDue:false,metAt:-1,rentY:0,inv:{dep:0,stock:0,crypto:0,re:0},ret:{},owned:{},biz:[],spent:0,mag:[],partner:null,married:false,
    fam,w,you:isYou,c,female,name,pos,age:7,pot:clamp(gauss(58,12),25,97),skill:clamp(rnd(14,26)+w*4+(fam.dadfoot?3:0),10,34),
    fit:rnd(55,80),moral:rnd(60,85),fame:0,edu:10,money:0,earn:0,level:0,club:null,abroad:false,agent:false,
    apps:0,goals:0,caps:0,trophies:0,peakLevel:0,peakSal:0,clubs:[],focus:["train"],inj:0,ended:false,endText:"",endKind:"",log:[],notes:[],pending:null,stay:0};
}

const TRK=p=>p.c[0]==="TR";
const FOOD={TR:"döner",ID:"nasi goreng",BR:"pastel",MX:"taco",AR:"choripán",JP:"ramen",KR:"tteokbokki",IT:"pizza",ES:"bocadillo",FR:"krep",DE:"currywurst",EN:"fish and chips",NG:"suya",IN:"samosa",EG:"koşari",MA:"msemen",US:"hamburger",CN:"baozi",VN:"bánh mì",TH:"pad thai",PH:"balut"};
const FOC={
 train:{t:"Antrenman",kid:1,pro:1,g:.45,fit:-2,moral:-2,inj:.05,bond:4},
 extra:{t:"Hocayla ekstra mesai",kid:1,pro:1,g:.25,bond:10,moral:-1,inj:.02},
 street:{t:"Sokakta top",kid:1,pro:0,g:.3,moral:4},
 gym:{t:"Kuvvet salonu",kid:0,pro:1,g:.1,fit:6,inj:.02},
 video:{t:"Video analiz",kid:0,pro:1,g:.2,bond:3},
 school:{t:"Okul ve ders",kid:1,pro:0,g:-.25,edu:8},
 rest:{t:"Dinlen",kid:1,pro:1,g:-.2,fit:6,moral:3,inj:-.05},
 diet:{t:"Beslenme ve uyku",kid:0,pro:1,fit:7,inj:-.05},
 show:{t:"Görünürlük",kid:1,pro:1,fame:4,bond:-2},
 family:{t:"Aile",kid:1,pro:1,moral:7},
 friends:{t:"Arkadaşlarla takıl",kid:1,pro:1,moral:5,g:-.1,bond:-1},
 mental:{t:"Spor psikoloğu",kid:0,pro:1,moral:6,g:.05},
 lang:{t:"Dil kursu",kid:1,pro:1,edu:3,lang:1},
 charity:{t:"Sosyal sorumluluk",kid:0,pro:1,fame:3,moral:3},
 invest:{t:"Para biriktir",kid:0,pro:1,save:.3}
};
const slots=p=>p.age<12?2:p.age<16?2:3;
function focusFx(p){const n=p.focus.length||1,w=n===1?1:n===2?.7:.55;const o={g:0,fit:0,moral:0,inj:0,bond:0,edu:0,fame:0,save:0,lang:0};
  for(const k of p.focus){const f=FOC[k];if(!f)continue;for(const x in o)o[x]+=(f[x]||0)*w;}return o;}
const fdesc=v=>{const a=[];if(v.g)a.push("Gelişim "+(v.g>0?(v.g>=.3?"↑↑":"↑"):"↓"));if(v.fit)a.push("Fizik "+(v.fit>0?"↑":"↓"));if(v.moral)a.push("Moral "+(v.moral>0?"↑":"↓"));
  if(v.bond)a.push("Hoca "+(v.bond>0?(v.bond>=8?"↑↑":"↑"):"↓"));if(v.inj)a.push("Sakatlık "+(v.inj>0?"↑":"↓"));if(v.edu)a.push("Eğitim ↑");if(v.fame)a.push("Ün ↑");if(v.lang)a.push("Yurt dışı uyumu ↑");if(v.save)a.push("Birikim ↑");return a.join(" · ");};
const mMod=p=>p.moral>=70?5:p.moral<=35?-5:0;
const bMod=p=>p.bond>=70?5:p.bond<=35?-5:0;
const eff=p=>clamp(p.skill+mMod(p)+bMod(p),5,99);
const effFit=p=>clamp(p.fit+mMod(p)+bMod(p),0,100);
function potRange(p){const v=p.pot;return v>=90?[90,99]:v>=75?[70,90]:v>=60?[60,80]:v>=40?[40,60]:[20,40];}
function familyLife(p){
  if(R()>.32)return;
  const F=p.fam,L=[[6,"Ailen tribünde seni izlemeye geldi. Annen en öndeydi."],[5,"Kardeşin okulda ödül aldı, telefonda sevinçten ağladınız."],
    [4,"Baban maçlarını mahalledeki kahvede izliyor, herkese seni anlatıyor."],[-6,"Annen hastalandı, hastanede birkaç gece kaldı."],
    [-5,"Evde para yüzünden büyük bir tartışma çıktı."],[-8,"Deden hayatını kaybetti."],[-4,"Baban maçtan sonra seni herkesin önünde eleştirdi."],
    [6,"Kuzeninin düğününde sabaha kadar eğlendin."],[-3,TRK(p)?"Ailenle bayramı geçiremedin, kamptaydın.":"Ailenle bayram tatilini geçiremedin, kamptaydın."]];
  if(F.cls===0)L.push([-6,"Ev sahibi kirayı artırdı, ailen zor durumda."],[-5,"Babanın iş yerinde kaza oldu, bir süre çalışamayacak."]);
  if(F.cls===2)L.push([4,"Ailen sana sürpriz bir tatil hediye etti."]);
  if(F.sib)L.push([5,"Küçük kardeşin seni örnek alıp futbola başladı."]);
  if(p.kids&&p.kids.length)L.push([6,firstName(p.kids[0].n)+" ilk adımlarını attı."],[-4,"Çocuğun hastalandı, gece boyunca uyumadın."]);
  const [d,t]=pick(L);p.moral=clamp(p.moral+d,5,100);if(p.you)log(p,"Aile: "+t+" (moral "+(d>0?"+":"")+d+")",d>0?"good":"bad");
}

function log(p,text,kind){p.log.push({age:p.age,text,kind:kind||""});}

function transferOffers(p,why){
  const L=p.level,home=p.c,cur=(p.club&&C.find(x=>x[0]===p.club.country[0]))||home,E=eff(p);
  const roleOf=l=>l<=3?"İlk 11":E>=T[l]+3?"İlk 11":E>=T[l]-2?"Rotasyon":"Yedek";
  const used=new Set([p.club&&p.club.name]);
  const mk=(cc,lvl,tag)=>{let cl,t=0;do{cl={name:clubName(cc,cityOf(cc),lvl===7&&cc[0]!=="TR"),country:cc,league:leagueName(cc,lvl)};}while(used.has(cl.name)&&t++<12);used.add(cl.name);
    const role=roleOf(lvl),sal=Math.round(salary(Object.assign({},p,{level:lvl,club:cl}))*(role==="Yedek"?.75:role==="Rotasyon"?.9:1)*rnd(.8,1.25)/500)*500;return {cl,lvl,role,sal,tag};};
  const O=[];
  if(homeMax(cur)>=L){O.push(mk(cur,L,"Aynı lig"));O.push(mk(cur,L,"Aynı lig"));}
  const same=C.filter(x=>x!==cur&&homeMax(x)>=L&&x[3]>=(L>=6?8.5:6));
  const picks=same.sort(()=>R()-.5).slice(0,3);
  for(const c of picks)O.push(mk(c,L,c===home?"Memlekete dönüş":"Yurt dışı · aynı seviye"));
  if(L>=5)O.push(mk(cur,Math.min(L-1,homeMax(cur))>=4?Math.min(L-1,homeMax(cur)):4,"Bir alt seviye · forma garantisi"));
  const choices=O.map(o=>({t:o.cl.name+" · "+o.cl.league,s:o.tag+" · "+o.cl.country[1]+" · "+o.role+" · ~"+fmtE(o.sal)+"/yıl",
    fx:q=>{setLevel(q,o.lvl,o.cl);q.moral+=q.abroad&&o.cl.country!==cur?(q.lang>=2?-1:-5):2;q.fame+=o.lvl>=6?3:0;
      log(q,o.cl.name+" ("+o.cl.league+", "+o.cl.country[1]+") ile anlaştın. Rolün: "+o.role.toLowerCase()+", yıllık ~"+fmtE(o.sal)+".",o.lvl>=6?"big":"good");}}));
  choices.push({t:"Vazgeç, kulübünde kal",s:"Hocayla arandaki sorun sürer",fx:q=>{q.moral-=3;log(q,"Transferden vazgeçtin, kulübünde kaldın.","");}});
  return {kind:"xfer",title:"Transfer teklifleri",text:(why||"Menajerin kulüplerle görüştü.")+" "+O.length+" teklif var:",choices,auto:0};
}
function renewOffers(p){
  const L=p.level,home=p.c,cur=(p.club&&C.find(x=>x[0]===p.club.country[0]))||home,E=eff(p);
  const roleOf=l=>l<=3?"İlk 11":E>=T[l]+3?"İlk 11":E>=T[l]-2?"Rotasyon":"Yedek";
  const used=new Set([p.club&&p.club.name]);
  const mk=(cc,lvl,tag)=>{let cl,t=0;do{cl={name:clubName(cc,cityOf(cc),false),country:cc,league:lvl>=3?leagueName(cc,lvl):""};}while(used.has(cl.name)&&t++<10);used.add(cl.name);
    const role=roleOf(lvl),sal=Math.round(salary(Object.assign({},p,{level:lvl,club:cl}))*(role==="Yedek"?.75:role==="Rotasyon"?.9:1)*rnd(.8,1.25)/500)*500;
    return {cl,lvl,role,sal,abroad:cc[0]!==home[0],tag};};
  const O=[mk(cur,L,"Aynı lig"),mk(cur,Math.max(3,L-1),L-1<=3?"Amatör lig":"Bir alt lig"),mk(cur,Math.max(3,L-2),L-2<=3?"Amatör lig":"İki alt lig")];
  const ex=x=>x[0]!==home[0]&&x[0]!==cur[0];
  const weak=C.filter(x=>ex(x)&&x[3]<6.5),mid=C.filter(x=>ex(x)&&x[3]>=6.5&&x[3]<8.5),strong=C.filter(x=>ex(x)&&x[3]>=8.8);
  if(weak.length)O.push(mk(pick(weak),5,"Yurt dışı · egzotik lig"));
  if(mid.length){const c=pick(mid);O.push(mk(c,clamp(L-1,4,homeMax(c)),"Yurt dışı"));}
  if(strong.length)O.push(mk(pick(strong),4,"Yurt dışı · büyük ülkenin 2. ligi"));
  const choices=O.map(o=>({t:o.cl.name+" · "+o.cl.league,s:o.tag+" · "+o.cl.country[1]+" · "+o.role+" · ~"+fmtE(o.sal)+"/yıl",
    fx:q=>{setLevel(q,o.lvl,o.cl,o.abroad);q.moral+=o.abroad?(q.lang>=2?-1:-6):o.lvl<L?-3:0;
      log(q,"Yeni sözleşme: "+o.cl.name+" ("+o.cl.league+", "+o.cl.country[1]+"). Rolün: "+o.role.toLowerCase()+", yıllık ~"+fmtE(o.sal)+".",o.abroad?"big":"");}}));
  if(p.age>=29)choices.push({t:"Kramponları as",s:"Teklifleri reddet, kariyerini bitir",fx:q=>endCareer(q,"Jübile","Sözleşmen uzatılmadı. Gelen teklifleri geri çevirip kramponları astın.","pro")});
  log(p,"Sözleşmen yenilenmedi. "+(p.agent?"Menajerin ":"Önüne ")+O.length+" teklif "+(p.agent?"getirdi.":"geldi."),"bad");
  return {kind:"renew",title:"Sözleşmen yenilenmedi",text:(p.club?p.club.name:"Kulübün")+" yeni sözleşme önermedi. "+(p.agent?"Menajerin ":"")+O.length+" kulüpten teklif var. Hangisini seçiyorsun?",choices,auto:1};
}
function setLevel(p,l,cl,abroad){
  p.level=l;p.peakLevel=Math.max(p.peakLevel,l);
  if(cl){p.club=cl;p.abroad=!!(cl.country&&cl.country[0]!==p.c[0]);p.clubs.push(cl.name);p.bond=clamp(48+ri(-8,10),0,100);}
}

// One season. Returns nothing; may set p.pending (decision)
function season(p){
  p.age++;const a=p.age,F=focusFx(p);p.ls=null;p.injS=false;
  // growth
  let g=0.09*(1+F.g)*(p.level>=2?1.35:0.7+0.5*p.w);
  if(p.inj>0){g*=0.3;p.inj--;}
  if(p.you){g*=1-.6*Math.min(1,(p.injOut||0)/10);p.injOut=0;
    if(p.fixRisk&&p.injKind!=="ban"){p.fixRisk.n--;if(R()<.12)ban(p,p.fixRisk.amt);else if(p.fixRisk.n<=0){p.fixRisk=null;log(p,"Şike dosyası kapandı. Kimse öğrenmedi, ama sen biliyorsun.","");}}}
  // gençlikte herkes parlıyor: 18'e kadar hedef en az 72, gelişim daha hızlı. 18'den sonra gerçek potansiyele geri çekilir.
  p.work=(p.work??.6)*.7+clamp(.5+F.g*1.2,0,1)*.3;
  const ceil=p.pot*(.7+.3*p.work);
  const tgt=a<16?Math.max(ceil,72):ceil;
  if(a<16) g*=1.7;
  if(a===16&&p.you) log(p,"16 yaşındasın. Artık kimse sana çocuk gibi davranmayacak, burada herkes yetenekli.","big");
  if(a<=27) p.skill+= (tgt-p.skill)*g + rnd(-1.6,1.8);
  else if(a>=30) p.skill-= (a-29)*rnd(.5,1.3)*(p.fit<45?1.4:1);
  else p.skill+=rnd(-1,1);
  if(a>=16&&p.skill>ceil) p.skill-=(p.skill-ceil)*0.3; // 16 sonrası gerçek potansiyele hızlı dönüş
  p.skill=clamp(p.skill,5,99);if(p.pot0===undefined)p.pot0=p.pot;if(a>=20)p.peakSkill=Math.max(p.peakSkill||0,p.skill);
  p.fit=clamp(p.fit+F.fit+1+comfort(p)+rnd(-4,4)-(a>30?2:0),15,100);
  p.moral=clamp(p.moral+F.moral+rnd(-5,5),5,100);
  p.bond=clamp(p.bond+F.bond+(50-p.bond)*.2+rnd(-6,4),0,100);
  p.moral+=(52-p.moral)*.22;
  p.lang+=F.lang;
  familyLife(p);
  if(a<23)p.edu=clamp(p.edu+F.edu+(a<18?rnd(1,4):0),0,100);
  if(F.fame)p.fame+=F.fame*rnd(.5,1.2)*(p.level>=4?2:1);

  // injuries (from age 13)
  if(!p.you&&a>=16&&!p.pending){
    let pi=0.06+F.inj+(a>30?.05:0)+(effFit(p)<40?.05:0)+(p.level>=4?.03:0);
    if(R()<pi){p.injS=true;
      if(R()<.28){
        p.pending={kind:"inj",title:"Ağır sakatlık",text:pick(["Ön çapraz bağın koptu.","Aşil tendonunda yırtık var.","Kaval kemiğin kırıldı."])+" Doktor iki yol öneriyor.",
          choices:[{t:"Ameliyat ol, bir yıl tam dinlen",s:"Uzun ama güvenli. Bu sezonu kaçırırsın.",fx:q=>{q.inj=1;q.pot-=rnd(1,3);q.moral-=8;log(q,"Ameliyat oldun. Uzun bir yaz, uzun bir kış.","bad");}},
                   {t:"Erken dön, sezonu kurtar",s:"Riskli. Sakatlık kalıcı iz bırakabilir.",fx:q=>{if(R()<.45){q.pot-=rnd(6,12);q.fit-=15;log(q,"Erken döndün ve sakatlık nüksetti. Eskisi gibi olmayacak.","bad");}else{log(q,"Erken döndün, şansın yaver gitti.","good");}}}],
          auto:0};
      }else{p.inj=1;log(p,pick(["Hamstring sakatlığı, birkaç ay yok.","Ayak bileğin burkuldu.","Kas yırtığı yüzünden sezonun yarısı gitti."]),"bad");}
    }
  }

  const L=p.level,E=eff(p);
  // KID STAGE
  if(L<2){
    if(L===0&&a>=8&&E>22&&R()<.6){setLevel(p,1);log(p,"Okul takımına seçildin. İlk forman "+ri(2,23)+" numara.","good");}
    if(a>=9&&a<=15&&!p.pending){
      const ps=a>=12?1:0.3+(p.focus.includes("show")?.2:0);
      if(R()<ps){
        const far=R()<[.55,.3,.15][p.fam.cls]*(p.c[5]<.5?1.3:1);
        p.pending={kind:"academy",title:"Bir gözlemci seni izledi",text:far?"Ülkenin en iyi akademilerinden biri seni yatılı programa çağırıyor. Ailen şehirde kalacak, sen yüzlerce kilometre uzakta olacaksın.":"Yakındaki profesyonel kulübün altyapısı seni deneme antrenmanına çağırdı.",
          choices:[{t:"Git",s:far?"Daha iyi antrenman, ama evden uzak.":"Haftada dört antrenman.",fx:q=>{setLevel(q,2,club(q,2,false,!far||R()<.3));q.moral-=far?12:0;log(q,q.club.name+" altyapısına kabul edildin.","big");}},
                   {t:"Gitme, burada kal",s:"Arkadaşların ve ailenle.",fx:q=>{q.moral+=6;log(q,"Daveti geri çevirdin. Belki başka bir gün.","");}}],auto:0};
      }
    }
    if(a>=17&&!p.pending){
      if(E>=56&&R()<.18){setLevel(p,4,club(p,4));log(p,"Altyapıdan geçmeden, amatörden keşfedildin! "+p.club.name+" ile ilk profesyonel sözleşmen.","big");}
      else if(E>=40&&R()<.5){setLevel(p,3,club(p,3,false,R()<.7));log(p,"Bölge amatör liginde "+p.club.name+" forması giydin.","");}
      else if(a>=19){endCareer(p,"Hayat başka yöne aktı","Hiçbir kulüp seni görmedi. Halı sahada hâlâ en iyi sensin.","quit");return;}
    }
  }
  // ACADEMY
  else if(L===2){
    if(a>=13&&a<=15&&E>=56&&R()<.55){p.fame+=6;log(p,"U"+(a+2)+" milli takımına çağrıldın! Herkes senden bahsediyor.","big");p.yCall=true;}
    if(a===16&&!p.pending){
      p.pending={kind:"school",title:"Okul mu, futbol mu?",text:"Antrenmanlar artık sabahları da var. Okul notların düşüyor. Akademi tam zamanlı programa geçmeni istiyor.",
        choices:[{t:"Okulu bırak, her şey futbol",s:"Daha hızlı gelişirsin. Yedek planın kalmaz.",fx:q=>{q.pot+=1.5;q.edu=Math.min(q.edu,40);q.dropped=true;log(q,"Okulu bıraktın. Artık tek bir yol var.","");}},
                 {t:"İkisini birlikte götür",s:"Biraz daha yavaş, ama kapı açık kalır.",fx:q=>{q.edu+=12;log(q,"Hem okul hem futbol. Yorucu bir yıl.","");}}],auto:E>60?0:1};
    }
    if(a>=17&&a<=19&&!p.pending){
      const pc=clamp((E-53)/14,0,1)*(a===19?1.3:1);
      if(R()<pc){
        const lvl=E>=T[5]+2&&homeMax(p.c)>=5?5:4;
        setLevel(p,lvl,club(p,lvl));log(p,"İlk profesyonel sözleşmeni imzaladın: "+p.club.name+". Yıllık "+fmtE(salary(p))+".","big");
      }else if(a===19){
        p.pending={kind:"release",title:"Akademi seni bıraktı",text:"Teknik direktör seni odasına çağırdı. Profesyonel sözleşme yok. Amatör bir kulüp seni istiyor.",
          choices:[{t:"Amatörde devam et",s:"Hafta içi iş, hafta sonu maç. Hayal sürsün.",fx:q=>{setLevel(q,3,club(q,3,false,R()<.6));log(q,q.club.name+" ile amatör ligde devam.","");}},
                   {t:"Futbolu bırak",s:"Başka bir hayata başla.",fx:q=>endCareer(q,"Akademiden sonra bıraktın",q.dropped?"Okulu da bırakmıştın. Yeniden başlamak kolay olmadı.":"Okulu bitirdin ve başka bir hayata geçtin.","quit")}],auto:0};
      }
    }
  }
  // AMATEUR
  else if(L===3){
    {const ap=ri(12,26),gg=p.pos==="Forvet"?ri(3,14):p.pos!=="Kaleci"?ri(0,4):0;p.apps+=ap;p.goals+=gg;const aa=ri(0,p.pos==="Kaleci"?0:6);p.assists+=aa;p.ls={apps:ap,gl:gg,as:aa,start:true,club:p.club?p.club.name:"",lg:leagueOf(p)};}
    if(a<=25&&E>=T[4]+1&&R()<.3){setLevel(p,4,club(p,4));log(p,"Amatörden profesyonelliğe! "+p.club.name+" seni transfer etti.","big");}
    else if(a>=25&&!p.pending){endCareer(p,"Amatör futbolcu","Hiç profesyonel olamadın ama yıllarca hafta sonları sahaya çıktın.","amat");return;}
  }
  // PRO
  else{
    const start=E>=T[L]+3, apps=start?ri(24,38):ri(4,18);
    p.apps+=apps;
    const gm={Kaleci:0,Defans:.05,"Orta saha":.15,Forvet:.42}[p.pos]*(0.6+(E-T[L])/25);
    const gl=Math.max(0,Math.round(apps*gm*rnd(.6,1.3)));p.goals+=gl;
    const am={Kaleci:.01,Defans:.06,"Orta saha":.2,Forvet:.14}[p.pos]*(0.6+(E-T[L])/25);
    const as=Math.max(0,Math.round(apps*am*rnd(.6,1.3)));p.assists+=as;
    p.ls={apps,gl,as,start,club:p.club?p.club.name:"",lg:leagueOf(p)};
    if(!p.you&&L>=5&&R()<.1*(L-4)){p.trophies++;log(p,pick(["Şampiyonluk!","Kupayı kaldırdınız!","Sezonu kupayla bitirdiniz."]),"big");p.fame+=10;}
    const NC=p.natC||p.c,nat=NC[3]>=8.5?79:NC[3]>=7?72:(NST[NC[0]]||0)>=7?70:64;
    p.natNow=false;
    if(L>=5&&E>=nat&&a>=19&&a<=34){p.natNow=true;const cp=ri(2,9);if(!p.caps)log(p,"Milli takıma çağrıldın! İlk maçında marş çalarken gözlerin doldu.","big");p.caps+=cp;}
    // offers
    if(L<7&&E>=T[L+1]-1+rnd(-2,3)&&a<=31&&!p.pending&&!(p.injM>=6)){
      const need=L+1>homeMax(p.c), cl=club(p,L+1,need||(p.abroad&&R()<.5));
      const abroad=cl.country!==p.c;
      p.pending={kind:"offer",title:"Transfer teklifi",text:cl.name+" ("+cl.country[1]+", "+LV[L+1]+") seni istiyor."+(abroad?" Yeni bir ülke, yeni bir dil.":""),
        choices:[{t:"Kabul et",s:"Bir basamak yukarı. Forma garantisi yok.",fx:q=>{setLevel(q,L+1,cl,abroad);q.moral+=abroad?(q.lang>=2?0:-6):4;q.fame+=8;log(q,cl.name+" ile sözleşme imzaladın. Yıllık "+fmtE(salary(q))+".","big");}},
                 {t:"Kal",s:"Burada ilk 11'sin ve mutlusun.",fx:q=>{q.moral+=5;q.stay++;log(q,"Teklifi reddettin, kulübünde kaldın.","");}}],auto:0};
    }else if(E<T[L]-5&&!p.pending){
      p.pending=renewOffers(p);
    }
    if(a===21&&!p.agent&&!p.pending&&L>=4){
      p.pending={kind:"agent",title:"Menajer teklifi",text:"Tanınmış bir menajer seni temsil etmek istiyor. Maaşının %10'unu alacak.",
        choices:[{t:"Anlaş",s:"Daha çok teklif, biraz daha yüksek maaş.",fx:q=>{q.agent=true;q.fame+=5;log(q,"Bir menajerle anlaştın.","");}},
                 {t:"Kendin yönet",s:"Paranın hepsi senin.",fx:q=>log(q,"Menajersiz devam etmeye karar verdin.","")}],auto:0};
    }
    if(a>=32&&!p.pending){
      const pr=0.12+(a-32)*.14+(p.fit<40?.2:0);
      if(a>=40||R()<pr){
        p.pending={kind:"retire",title:a+" yaşındasın",text:"Bacakların eskisi gibi değil. Kulüp bir yıl daha istiyor ama kenarda oturacağın belli.",
          choices:[{t:"Kramponları as",s:"Zirvedeyken bırak.",fx:q=>endCareer(q,"Jübile",q.caps?"Milli forma, "+q.caps+" maç. Bir ülkenin hatırladığı biri oldun.":"Profesyonel futbolcu olarak emekli oldun.","pro")},
                   {t:"Bir sezon daha",s:"Sahadan uzak duramıyorsun.",fx:q=>log(q,"Bir sezon daha oynamaya karar verdin.","")}],auto:0};
      }
    }
  }
  if(!p.ended&&!p.ls&&p.level>=1&&p.level<=2){
    const ap=p.level===1?ri(6,14):ri(14,26);
    const gg=Math.round(ap*{Kaleci:0,Defans:.08,"Orta saha":.25,Forvet:.6}[p.pos]*(0.5+E/80)*rnd(.6,1.3));
    const aa=Math.round(ap*{Kaleci:.02,Defans:.08,"Orta saha":.25,Forvet:.18}[p.pos]*rnd(.5,1.3));
    p.ls={apps:ap,gl:gg,as:aa,start:true,club:p.club?p.club.name:"Okul takımı",lg:leagueOf(p),youth:true};p.yApps+=ap;p.yGoals+=gg;
  }
  if(!p.pending&&!p.ended)randomEvent(p);
  const sal=salary(p);if(sal){const net=p.agent?sal*.9:sal;p.earn+=net;p.money+=net*(.25+F.save);p.peakSal=Math.max(p.peakSal,sal);}
  econ(p);
  if(p.you&&!p.ended)tabloid(p);
  p.fame=clamp(p.fame,0,100);p.pot=clamp(p.pot,10,99);
}
function endCareer(p,title,text,kind){p.ended=true;p.endTitle=title;p.endText=text;p.endKind=kind;p.pending=null;log(p,title+". "+text,"big");}
function resolve(p,i){const d=p.pending;p.pending=null;d.choices[i].fx(p);}

// Rastgele karar anları: her biri kariyer boyunca en fazla bir kez
// ===== PARA, YATIRIM, HARCAMA, MAGAZİN =====
const INV=[["dep","Mevduat","Düşük risk, yılda %3–6"],["stock","Borsa fonu","Orta risk, iniş çıkışlı"],["crypto","Kripto","Çok yüksek risk"],["re","Gayrimenkul fonu","Yavaş değerlenir, kâr payı verir"]];
const homeV=p=>p.homes.reduce((s,h)=>s+h.val,0);
const wealth=p=>p.money+p.inv.dep+p.inv.stock+p.inv.crypto+p.inv.re+homeV(p);

// ===== EMLÂK =====
const HOMES=[
 {id:"h1",t:"1+1 daire",semt:1,p:40000,y:.055},
 {id:"h2",t:"3+1 daire",p:120000,y:.048},
 {id:"h3",t:"Dükkân",p:200000,y:.065},
 {id:"h4",t:"Müstakil bahçeli ev",p:300000,y:.04},
 {id:"h5",t:"Rezidans dairesi",p:650000,y:.042},
 {id:"h6",t:"Plaza katı",p:1500000,y:.05},
];
const homeWhere=(p,h)=>h.semt?p.fam.semt.split(", ").pop():p.fam.semt.split(", ")[0];
const COMF={"1+1 daire":1,"3+1 daire":2,"Dükkân":0,"Müstakil bahçeli ev":3,"Rezidans dairesi":3,"Plaza katı":0};
function comfort(p){if(!p.homes)return 0;let c=0,extra=0;
  for(const h of p.homes){const v=COMF[h.t]||0;if(h.state==="live")c=Math.max(c,v);else if(h.state==="empty")extra+=v*.5;}
  if(p.owned&&p.owned.villa)extra+=2;return Math.min(6,Math.round((c+Math.min(extra,3))*2)/2);}
const comfFx=c=>({fit:c,inj:Math.round(c*5),rec:Math.round(c*5)});
const ST={empty:"Boş",rent:"Kirada",live:"Oturuyorsun"};
function buyHome(id){const h=HOMES.find(x=>x.id===id);if(!h||P.money<h.p)return;P.money-=h.p;
  P.homes.push({t:h.t,w:homeWhere(P,h),val:h.p,y:h.y,state:"empty"});
  log(P,homeWhere(P,h)+" bölgesinde "+h.t.toLowerCase()+" aldın ("+fmtE(h.p)+").","good");
  if(P.homes.length===1&&P.fame>=15)addMag(P,"{n} ilk evini aldı!");render();}
function homeAct(i,a){const h=P.homes[i];if(!h)return;
  if(a==="rent"){h.state="rent";log(P,h.t+" kiraya verildi.","");}
  else if(a==="stop"){h.state="empty";log(P,h.t+" için kira sözleşmesini bitirdin.","");}
  else if(a==="live"){P.homes.forEach(x=>{if(x.state==="live")x.state="empty";});h.state="live";log(P,h.w+" bölgesindeki "+h.t.toLowerCase()+" yeni evin oldu.","good");P.moral=clamp(P.moral+4,0,100);}
  else if(a==="sell"){P.money+=h.val;P.homes.splice(i,1);log(P,h.t+" satıldı: "+fmtE(Math.round(h.val))+".","");}
  render();}
function econHome(p){
  p.rentY=0;
  for(const h of p.homes){
    h.val*=1+rnd(.01,.07);
    if(h.state==="rent"){
      if(R()<.08){if(p.you)log(p,h.t+" kiracısı bu yıl kirayı ödemedi.","bad");}
      else{const v=h.val*h.y;p.money+=v;p.earn+=v;p.rentY+=v;}
    }else if(h.state==="live"){p.moral=clamp(p.moral+3,0,100);}
    else{p.money-=h.val*.005;}
  }
  // çocuk masrafı ve yeni bebek
  if(p.kids.length){p.money-=p.kids.length*(1500+salary(p)*.03);p.moral=clamp(p.moral+2,0,100);}
  if(p.babyDue){p.babyDue=false;let nm;const NS=nameSet(p.c);do{nm=pick(R()<.5?NS.m:NS.f);}while((nm===firstName(p.name)||p.kids.some(k=>k.n===nm))&&R()<.95);
    p.kids.push({n:nm,b:p.age});p.moral=clamp(p.moral+12,0,100);
    log(p,nm+" dünyaya geldi! Artık babasın.","big");if(p.fame>=20)addMag(p,"{n} baba oldu! Bebeğin adı: "+nm+".");}
  if(p.money<0)p.money=0;
}

// ===== ÖZEL HAYAT =====
const SURN=["Yılmaz","Kaya","Demir","Çelik","Aksoy","Arslan","Erdem","Koç"];
function meet(){
  if(P.partner||P.age<18||P.metAt===P.age)return;P.metAt=P.age;
  if(R()<.55+P.fame/200){
    const celeb=P.fame>=40&&R()<.35;
    const pt={name:fullName(P.c,true),job:celeb?pick(["dizi oyuncusu","şarkıcı","model"]):pick(["öğretmen","hemşire","mimar","avukat","grafik tasarımcı","fizyoterapist","üniversite öğrencisi","doktor"])};
    P.partner=pt;P.moral=clamp(P.moral+8,0,100);
    log(P,pick(["Bir arkadaşının doğum gününde","Kamp otelinin lobisinde","Kahve sırasında","Bir hayır yemeğinde"])+" "+pt.job+" "+pt.name+" ile tanıştın. İkiniz de gülümsediniz.","good");
    if(celeb||P.fame>=30)addMag(P,"{n}'in kalbini çalan isim belli oldu: "+pt.job+" {partner}!");
  }else log(P,"Bir randevuya çıktın ama olmadı. Belki seneye.","");
  render();
}
function propose(){
  if(!P.partner||P.married||P.age<20)return;
  if(R()<.15){log(P,P.partner.name+" teklifini geri çevirdi. Yollarınız ayrıldı.","bad");if(P.fame>=20)addMag(P,"{n} ile {partner} ayrıldı!");P.partner=null;P.moral=clamp(P.moral-12,0,100);render();return;}
  P.seen=P.seen||{};P.seen.wedding=1;
  const d=EV.find(e=>e.id==="wedding").m(P);d.kind="ev";d.auto=1;P.pending=d;showDecision();
}
function breakup(){if(!P.partner||P.married)return;log(P,P.partner.name+" ile ayrıldın.","bad");if(P.fame>=20)addMag(P,"{n} ile {partner} ayrıldı!");P.partner=null;P.moral=clamp(P.moral-8,0,100);render();}
function baby(){if(!P.married||P.babyDue||P.kids.length>=4)return;P.babyDue=true;log(P,"Bebek bekliyorsunuz! Gelecek sezon dünyaya gelecek.","good");render();}

function econ(p){
  econHome(p);
  const I=p.inv,r=p.ret;
  r.dep=rnd(.03,.06);
  r.stock=clamp(gauss(.07,.17),-.45,.6);
  const c=R();r.crypto=c<.35?rnd(-.7,-.2):c<.7?rnd(-.1,.3):rnd(.6,2.5);
  r.re=rnd(.01,.06);
  for(const k in I){I[k]*=1+r[k];}
  if(I.re>0){const rent=I.re*.04;p.money+=rent;p.earn+=rent;}
  if(p.you&&I.crypto>2000){if(r.crypto>.6)log(p,"Kripto portföyün bu yıl %"+Math.round(r.crypto*100)+" uçtu!","good");else if(r.crypto<-.4)log(p,"Kripto çöktü. Portföyünün %"+Math.round(-r.crypto*100)+"'i eridi.","bad");}
  if(p.you&&I.stock>5000&&r.stock<-.25)log(p,"Borsada sert düşüş: fonun %"+Math.round(-r.stock*100)+" değer kaybetti.","bad");
  for(const b of p.biz){
    if(b.dead)continue;
    if(b.risk&&R()<b.risk*.15){b.dead=true;if(p.you){log(p,b.t+" battı. Yatırdığın para gitti.","bad");addMag(p,pick(["{n}'in işletmesi kapandı! Borç iddiası.","{n} iş hayatında çuvalladı."]));}}
    else{const v=b.p*b.inc*rnd(.5,1.5);p.money+=v;p.earn+=v;}
  }
}
function moveIn(k){const v=Math.max(Math.min(P.money,500),P.money*.25);if(P.money<100)return;P.money-=v;P.inv[k]+=v;render();}
function moveOut(k){P.money+=P.inv[k];P.inv[k]=0;render();}

const SHOP=[
 {id:"hair",t:"Yeni saç modeli ve dövme",p:1500,fame:2,moral:3,mag:"{n}'in yeni saç modeli sosyal medyayı ikiye böldü."},
 {id:"car1",t:"İkinci el araba",p:9000,moral:4,note:"Artık antrenmana otobüsle gitmiyorsun."},
 {id:"allow",t:"Ailene her ay harçlık",p:20000,moral:8,note:"Annen artık daha rahat."},
 {id:"watch",t:"Lüks saat",p:45000,fame:3,moral:2,mag:"{n}'in bileğindeki saat bir ev fiyatında!"},
 {id:"pitch",t:"Semtine halı saha yaptır",p:60000,fame:8,moral:8,mag:"{n}, büyüdüğü {semt} semtine halı saha yaptırdı. Mahalle bayram etti."},
 {id:"cafe",t:"Memlekette kafe aç",p:150000,inc:.07,risk:.25,moral:3,note:"Kafe her sezon gelir getirecek. Batabilir de."},
 {id:"sport",t:"Spor araba",p:180000,fame:6,moral:6,mag:"{n} yeni spor arabasıyla antrenmana geldi."},
 {id:"fund",t:"Çocuklar için burs fonu",p:250000,fame:10,moral:10,mag:"{n}'den anlamlı hareket: {semt} semtindeki çocuklara burs."},
 {id:"brand",t:"Kendi giyim markan",p:350000,inc:.14,risk:.45,fame:5,mag:"{n} kendi giyim markasını kurdu. Lansman olay oldu."},
 {id:"club",t:"Gece kulübüne ortak ol",p:600000,inc:.12,risk:.5,fame:4,mag:"{n} gece hayatına adım attı: Bir kulübe ortak oldu."},
 {id:"villa",t:"Deniz kenarında villa",p:1200000,moral:10,fame:5,mag:"{n}'in yeni villası görenleri büyüledi."},
 {id:"yacht",t:"Yat",p:3000000,fame:10,moral:8,mag:"{n} yazı yatında geçiriyor. Yanındaki ünlüler kim?"},
 {id:"jet",t:"Özel jet",p:12000000,fame:12,moral:5,mag:"{n} özel jetiyle tatile uçtu."},
];
const VOW={"a":"a","ı":"ı","o":"o","u":"u","e":"e","i":"i","ö":"ö","ü":"ü","á":"a","à":"a","â":"a","ã":"a","é":"e","è":"e","ê":"e","ë":"e","í":"i","î":"i","ó":"o","ô":"o","õ":"o","ú":"u","û":"u","y":""};
function suf(name,type){const w=name.split(" ").pop().toLocaleLowerCase("tr");let v="e";for(let k=w.length-1;k>=0;k--){if(VOW[w[k]]){v=VOW[w[k]];break;}}
  const endV=!!VOW[w[w.length-1]],hard=/[çfhkpsşt]$/.test(w);
  if(type==="in"){const x={a:"ın",ı:"ın",o:"un",u:"un",e:"in",i:"in",ö:"ün",ü:"ün"}[v];return name+"'"+(endV?"n":"")+x;}
  const back="aıou".includes(v);return name+"'"+(hard?"t":"d")+(back?"an":"en");}
const fillMag=(p,s)=>s.replace(/\{n\}'in/g,suf(p.name,"in")).replace(/\{n\}'den/g,suf(p.name,"den")).replace(/\{partner\}'den/g,p.partner?suf(p.partner.name,"den"):"sevgilisinden").replace(/\{n\}/g,p.name).replace(/\{semt\}/g,p.fam.semt.split(", ").pop()).replace(/\{partner\}/g,p.partner?p.partner.name:"sevgilisi");
function addMag(p,s){const h=fillMag(p,s);p.mag.push({age:p.age,h});log(p,"Manşet: "+h,"mag");}
const CATS=[["Kişisel",["hair","car1","watch","sport"]],["Aile ve semt",["allow","pitch","fund"]],["İş yatırımı",["cafe","brand","club"]],["Lüks",["villa","yacht","jet"]]];
const openSet=new Set(["inv"]);
const op=k=>openSet.has(k)?" open":"";
document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.tagName==="DETAILS"&&d.dataset&&d.dataset.k){d.open?openSet.add(d.dataset.k):openSet.delete(d.dataset.k);}},true);
function buy(id){
  const it=SHOP.find(x=>x.id===id);if(!it||P.owned[id]||P.money<it.p)return;
  P.money-=it.p;P.spent+=it.p;P.owned[id]=1;
  P.fame=clamp(P.fame+(it.fame||0),0,100);P.moral=clamp(P.moral+(it.moral||0),0,100);
  if(it.inc)P.biz.push({t:it.t,p:it.p,inc:it.inc,risk:it.risk||0});
  log(P,it.t+" aldın ("+fmtE(it.p)+")."+(it.note?" "+it.note:""),"good");
  if(it.mag&&(P.fame>=10||P.level>=4))addMag(P,it.mag);
  render();
}
function tabloid(p){
  if(p.level<3||p.fame<15)return;
  if(R()>.2+p.fame/250)return;
  const pool=["{n} lüks bir restoranda görüntülendi.","{n}'in sosyal medya paylaşımı rekor beğeni aldı.","{n} hayranlarıyla tek tek fotoğraf çektirdi.",
    "{n} gece 3'te bir kulüpten çıkarken görüntülendi.","{n} ile takım arkadaşı arasında soğuk rüzgârlar mı esiyor?","{n}'in yeni imajı olay oldu.",
    "{n} annesinin doğum gününü sürprizle kutladı.","{n} {semt} semtindeki eski okuluna gitti, çocuklar sevinçten çıldırdı."];
  if(p.owned.sport)pool.push("{n} trafikte hız sınırını aştı mı? Görüntüler gündemde.");
  if(p.owned.yacht)pool.push("{n}'in yatında ünlüler geçidi.");
  if(p.owned.villa)pool.push("{n}'in villasında sabaha kadar havuz partisi.");
  if(p.owned.club)pool.push("{n}'in ortak olduğu kulüpte kavga çıktı!");
  if(p.partner&&!p.married)pool.push("{n} ve {partner} romantik tatilde.","{n} ile {partner} ayrıldı mı? Sosyal medyada takibi bıraktılar.");
  if(p.married)pool.push("{n} ile {partner}'den mutlu haber mi geliyor?","{n} eşi {partner} ile tribünde el ele.");
  addMag(p,pick(pool));p.fame=clamp(p.fame+ri(1,3),0,100);
}

const EV=[
 // ===== ÇOCUKLUK (8-15) =====
 {id:"window",w:p=>p.age>=8&&p.age<=13,auto:0,m:p=>{const nb=pick(nameSet(p.c).f);return {title:"Cam kırıldı!",text:"Mahallede attığın şut komşun "+nb+" teyzenin camını tuzla buz etti. Herkes kaçıyor.",choices:[
   {t:"Kapıyı çal, itiraf et",s:"Moral ↓ · Dürüstlük",fx:q=>{q.moral-=2;q.edu+=2;log(q,"İtiraf ettin. "+nb+" teyze kızdı ama sonra sana kurabiye verdi. Babana camı ödettin.","");}},
   {t:"Sen de kaç",s:"Moral ↑ · Yakalanabilirsin",fx:q=>{if(R()<.45){q.moral-=7;log(q,"Kaçtın ama biri seni görmüş. Bir ay top yasağı, harçlık kesildi. (moral −7)","bad");}else{q.moral+=3;log(q,"Kaçtın, kimse görmedi. Kalbin bir hafta küt küt attı.","");}}}]};}},
 {id:"star",w:p=>p.age>=8&&p.age<=14,auto:0,m:p=>({title:"Ünlü bir futbolcu okulunda",text:"Milli takımın yıldızlarından biri okulunuza söyleşiye geldi. Soru sırası sende.",choices:[
   {t:"Formasını imzalat",s:"Moral ↑",fx:q=>{q.moral+=6;log(q,"Formanı imzaladı ve 'büyüyünce seni sahada görürüm' dedi. O formayı yıllarca yıkamadın.","good");}},
   {t:"Nasıl bu kadar iyi olduğunu sor",s:"Gelişim ↑",fx:q=>{q.skill+=1;q.moral+=2;log(q,"'Herkes gittikten sonra 100 şut daha' dedi. O gün duvara karşı 100 şut çektin.","good");}}]})},
 {id:"camp",w:p=>p.age>=9&&p.age<=14,auto:0,m:p=>{const c=[400,1500,5000][p.fam.cls];return {title:"Yaz futbol kampı",text:"Şehirde iki haftalık bir futbol kampı var. Ücreti "+fmtE(c)+". "+(p.fam.cls===0?"Ailen için bu çok para.":"Ailen ödeyebilir."),choices:[
   {t:"Kampa git",s:"Gelişim ↑↑ · "+(p.fam.cls===0?"Aile bütçesi zorlanır":"Ev özlemi"),fx:q=>{q.skill+=2;q.moral-=(q.fam.cls===0?5:2);log(q,"Yaz kampına gittin. "+(q.fam.cls===0?"Baban fazla mesai yaptı ki gidebilesin.":"Profesyonel hocalarla çalıştın."),"good");}},
   {t:"Yazı ailenle geçir",s:"Moral ↑",fx:q=>{q.moral+=6;log(q,"Yaz tatilini ailenle geçirdin, deniz kenarında top oynadın.","good");}}]};}},
 {id:"exam",w:p=>p.age>=11&&p.age<=17&&p.level>=1&&p.level<=2,auto:1,m:p=>({title:"Sınav ile maç aynı gün",text:"Dönem sonu sınavın ile önemli bir maç aynı sabaha denk geldi.",choices:[
   {t:"Sınava gir",s:"Eğitim ↑ · Hoca bağı ↓",fx:q=>{q.edu+=8;q.bond-=4;log(q,"Sınavdan iyi not aldın, maçı kaçırdın. (eğitim +8, hoca bağı −4)","");}},
   {t:"Maça çık",s:"Gelişim ↑ · Eğitim ↓ · Ailen kızar",fx:q=>{q.skill+=1;q.edu-=6;q.moral-=3;q.bond+=4;log(q,"Maça çıktın, sınavı bütünlemeye bıraktın. Annen bir hafta konuşmadı.","");}}]})},
 {id:"games",w:p=>p.age>=10&&p.age<=18,auto:1,m:p=>({title:"Futbol oyunu bağımlılığı",text:"Gece 3'e kadar konsolda futbol oyunu oynuyorsun. Antrenmanlarda esniyorsun.",choices:[
   {t:"Gece 11'den sonra yasak koy",s:"Moral ↓ · Fizik ↑",fx:q=>{q.moral-=3;q.fit+=4;log(q,"Konsolu salona taşıdın. İlk hafta zor geçti.","");}},
   {t:"Oynamaya devam",s:"Moral ↑ · Fizik ↓ · Hoca bağı ↓",fx:q=>{q.moral+=5;q.fit-=5;q.bond-=4;log(q,"Online ligde bölge birincisi oldun. Sahada ise yorgundun.","");}}]})},
 {id:"bully",w:p=>p.age>=9&&p.age<=13,auto:1,m:p=>({title:"Büyük çocuklar topunu aldı",text:"Parkta lisedeki çocuklar topunu aldı ve vermiyorlar.",choices:[
   {t:"Karşılarına dik",s:"Ya saygı ya bir göz morluğu",fx:q=>{if(R()<.5){q.moral+=6;log(q,"Karşılarına dikildin, topu geri verdiler. O günden sonra seni de maça aldılar.","good");}else{q.moral-=5;log(q,"Gözün morardı, top da gitti.","bad");}}},
   {t:"Gidip abini/babanı çağır",s:"Güvenli",fx:q=>{q.moral+=1;log(q,"Baban gelince top hemen geri geldi.","");}}]})},
 {id:"growth",w:p=>p.age>=12&&p.age<=15,auto:0,m:p=>({title:"Hızlı boy uzaması",text:"Bir yazda 9 santim uzadın. Koordinasyonun bozuldu, top ayağından kaçıyor.",choices:[
   {t:"Sabret, vücudun alışsın",s:"Bu yıl gelişim ↓ · Uzun vadede ↑",fx:q=>{q.skill-=1.5;q.pot+=1;log(q,"Bir yıl beceriksiz hissettin ama yeni boyunla hava toplarında rakipsizsin.","");}},
   {t:"Ekstra koordinasyon çalışması",s:"Gelişim ↑ · Sakatlık riski",fx:q=>{q.skill+=.5;q.fit-=4;log(q,"Merdiven ve ip çalışmaları yaptın. Dizlerin biraz ağrıdı.","");}}]})},
 {id:"sneak",w:p=>p.level===2&&p.age>=13&&p.age<=17,auto:1,m:p=>({title:"Yurttan gece kaçmak",text:"Akademi yurdundaki arkadaşların gece gizlice şehre inmeyi planlıyor.",choices:[
   {t:"Onlarla git",s:"Moral ↑ · Yakalanırsan hoca bağı ↓↓",fx:q=>{q.moral+=6;if(R()<.35){q.bond-=15;log(q,"Gece 2'de yurda dönerken hocaya yakalandınız. Bir ay idari ceza. (hoca bağı −15)","bad");}else log(q,"Şehirde gece yarısı "+(FOOD[q.c[0]]||"sokak yemeği")+" yediniz, kimse fark etmedi. Hayatının en güzel gecelerinden biri.","good");}},
   {t:"Yurtta kal",s:"Moral ↓ · Hoca bağı ↑",fx:q=>{q.moral-=3;q.bond+=3;log(q,"Yurtta kaldın. Ertesi gün arkadaşların sabah antrenmanında uyukluyordu.","");}}]})},
 {id:"rivalpos",w:p=>p.level===2&&p.age>=13,auto:0,m:p=>({title:"Mevkine yeni bir yetenek geldi",text:"Akademiye senin mevkinde oynayan, herkesin konuştuğu bir çocuk transfer edildi.",choices:[
   {t:"Rekabete gir",s:"Gelişim ↑ · Moral ↓",fx:q=>{q.skill+=1.5;q.moral-=3;log(q,"Her antrenmanda onunla yarıştın. İkiniz de daha iyi oldunuz.","good");}},
   {t:"Onunla arkadaş ol",s:"Moral ↑ · Hoca bağı ↑",fx:q=>{q.moral+=4;q.bond+=3;log(q,"Rakibin en yakın arkadaşın oldu. Hoca ikinizi birlikte oynatmaya başladı.","good");}}]})},
 {id:"kidagent",w:p=>p.level===2&&p.age>=14&&p.age<=16&&!p.agent,auto:1,m:p=>{const v=[3000,8000,20000][p.fam.cls];return {title:"Çocuk yaşta menajer",text:"Bir menajer ailenle görüştü. Şimdi imza atarsan ailene "+fmtE(v)+" peşin verecek, ileride maaşından pay alacak.",choices:[
   {t:"İmzala",s:"Aileye para · Menajer bağlantıları",fx:q=>{q.agent=true;q.moral+=4;log(q,"Menajerle erken imzaladın. Ailen "+fmtE(v)+" aldı.","good");}},
   {t:"Reddet, zamanı gelince",s:"Bağımsız kal",fx:q=>{log(q,"Menajer teklifini reddettin. Baban 'acele etmeyelim' dedi.","");}}]};}},
 {id:"trial",w:p=>p.level===2&&p.age>=14&&p.age<=16&&p.c[3]<8.5,auto:0,m:p=>{const cl=club(p,2,true);return {title:"Yurt dışından deneme daveti",text:cl.name+" ("+cl.country[1]+") altyapısı seni bir haftalık denemeye çağırdı.",choices:[
   {t:"Git, şansını dene",s:"Kabul edilirsen yurt dışına taşınırsın",fx:q=>{if(R()<.35+eff(q)/300){q.club=cl;q.abroad=true;q.clubs.push(cl.name);q.bond=50;q.lang+=1;q.moral-=6;q.pot+=1;log(q,cl.name+" seni kabul etti! "+cl.country[1]+"'ya taşındın. Yeni dil, yeni hayat.","big");}else{q.moral-=3;log(q,"Denemeye gittin ama kabul edilmedin. Yine de çok şey öğrendin.","");q.skill+=.5;}}},
   {t:"Gitme, burada büyü",s:"Ailenin yanında kal",fx:q=>{q.moral+=3;log(q,"Daveti geri çevirdin.","");}}]};}},
 {id:"dadteam",w:p=>p.age>=9&&p.age<=14,auto:0,m:p=>({title:"Babanın takımı",text:"Baban koyu bir taraftar. Sen ise ezeli rakibini tutmaya başladın.",choices:[
   {t:"Kendi takımını tut",s:"Moral ↑ · Evde gerginlik",fx:q=>{q.moral+=2;log(q,"Derbi günleri evde soğuk savaş başladı. Ama şarkıları hep sen söylüyorsun.","");}},
   {t:"Babanın takımına dön",s:"Aile huzuru",fx:q=>{q.moral+=3;log(q,"Babanla aynı formayı giydiniz. Derbiyi birlikte izlediniz.","good");}}]})},
 // ===== TEKRARLANABİLİR GÜNLÜK OLAYLAR =====
 {id:"rain",rep:3,w:p=>p.level>=1&&p.level<=3,auto:0,m:p=>({title:"Sağanak altında antrenman",text:"Antrenman bitti, herkes soyunma odasına koştu. Yağmur bardaktan boşanıyor.",choices:[
   {t:"Kal, 30 dakika daha çalış",s:"Gelişim ↑ · Hoca bağı ↑ · Fizik ↓",fx:q=>{q.skill+=1;q.bond+=4;q.fit-=3;log(q,"Yağmurda tek başına şut çalıştın. Hoca pencereden izliyordu.","good");}},
   {t:"Sıcak duşa koş",s:"Moral ↑",fx:q=>{q.moral+=2;log(q,"Herkesle birlikte içeri girdin.","");}}]})},
 {id:"troll",rep:3,w:p=>p.fame>=15&&p.level>=3,auto:1,m:p=>({title:"Sosyal medyada linç",text:"Kötü geçen bir maçın ardından binlerce kişi hesabına hakaret yağdırıyor.",choices:[
   {t:"Sert bir cevap yaz",s:"Ün ↑ · Moral ↓ · Hoca bağı ↓",fx:q=>{q.fame+=4;q.moral-=4;q.bond-=4;addMag(q,"{n} trollerine ateş püskürdü!");}},
   {t:"Hesabı bir süre kapat",s:"Moral ↑",fx:q=>{q.moral+=4;log(q,"Telefonu kapattın, bir ay sosyal medyaya girmedin. Kafan rahatladı.","good");}},
   {t:"Espriyle karşılık ver",s:"Ün ↑ · Moral ↑ · Ters tepebilir",fx:q=>{if(R()<.6){q.fame+=6;q.moral+=3;addMag(q,"{n}'in esprili cevabı sosyal medyayı salladı!");}else{q.fame-=3;q.moral-=4;log(q,"Esprin yanlış anlaşıldı, linç büyüdü.","bad");}}}]})},
 {id:"red",rep:3,w:p=>p.level>=3&&!(p.injM>0),auto:1,m:p=>({title:"Haksız kırmızı kart",text:"Hakem seni 70. dakikada haksız yere oyundan attı. Hâlâ sahadasın, kan beynine sıçradı.",choices:[
   {t:"Hakemin üstüne yürü",s:"Moral ↑ · 3–6 maç ceza · Hoca bağı ↓",fx:q=>{const m=rnd(.75,1.5);q.injM=Math.max(q.injM||0,m);q.injName="Kırmızı kart cezası";q.injKind="ban";q.bond-=6;q.fame+=2;q.moral+=2;log(q,"Hakeme yürüdün. Disiplin kurulu "+Math.round(m*4)+" maç ceza verdi.","bad");if(q.fame>=20)addMag(q,"{n} hakemin üstüne yürüdü!");}},
   {t:"Sessizce çık",s:"Moral ↓ · Hoca bağı ↑",fx:q=>{q.moral-=4;q.bond+=4;const m=.25;q.injM=Math.max(q.injM||0,m);q.injName="Kırmızı kart cezası";q.injKind="ban";log(q,"Sessizce sahayı terk ettin. Tek maç ceza aldın, hoca soğukkanlılığını övdü.","");}}]})},
 {id:"teambday",rep:4,w:p=>p.level>=2,auto:0,m:p=>({title:"Doğum günün",text:"Takım arkadaşların soyunma odasında sana sürpriz hazırlamış. Akşam da yemek planlıyorlar ama yarın antrenman var.",choices:[
   {t:"Yemeğe git, kutla",s:"Moral ↑↑ · Fizik ↓",fx:q=>{q.moral+=8;q.fit-=2;log(q,"Doğum gününü takımla kutladın. Pastayı yüzüne yedin. (moral +8)","good");}},
   {t:"Kısa tut, erken yat",s:"Moral ↑ · Hoca bağı ↑",fx:q=>{q.moral+=3;q.bond+=2;log(q,"Pastayı kestin, erkenden eve döndün.","");}}]})},
 {id:"press",rep:3,w:p=>p.level>=4&&p.fame>=20,auto:1,m:p=>({title:"Basın toplantısında kriz",text:"Bir gazeteci 'Bu formayı hak ediyor musun?' diye sordu. Bütün kameralar sende.",choices:[
   {t:"Sert cevap ver",s:"Ün ↑ · Hoca bağı ↓",fx:q=>{q.fame+=5;q.bond-=5;addMag(q,"{n} basın toplantısında gazeteciyi susturdu!");}},
   {t:"Diplomatik ol",s:"Hoca bağı ↑",fx:q=>{q.bond+=3;log(q,"'Sahada cevap vereceğim' dedin. Kulüp memnun.","");}}]})},
 {id:"fans",rep:4,w:p=>p.level>=4,auto:1,m:p=>({title:"Taraftar grubu idmanı bastı",text:"Kötü sonuçların ardından tribün lideri antrenmanda seninle yüz yüze konuşmak istiyor.",choices:[
   {t:"Özür dile, söz ver",s:"Moral ↓ · Taraftar sevgisi ↑",fx:q=>{q.moral-=2;q.fame+=3;log(q,"Taraftara söz verdin. Sonraki maçta adını bağırdılar.","good");}},
   {t:"Meydan oku",s:"Moral ↑ · Ün ↓ · Risk",fx:q=>{q.moral+=2;q.fame-=6;q.bond-=3;log(q,"'Biz de insanız' dedin. Tribünler seni ıslıklamaya başladı.","bad");}}]})},
 {id:"teammate",rep:4,w:p=>p.level>=3,auto:0,m:p=>({title:"Takım arkadaşın sakatlandı",text:"Soyunma odasındaki en yakın arkadaşın çapraz bağını kopardı. Hastanede tek başına.",choices:[
   {t:"Her hafta ziyaret et",s:"Moral ↑ · Hoca bağı ↑",fx:q=>{q.moral+=4;q.bond+=2;log(q,"Arkadaşını her hafta ziyaret ettin. Döndüğünde ilk golünü sana adadı.","good");}},
   {t:"Mesaj at, kendine odaklan",s:"Gelişim ↑",fx:q=>{q.skill+=.4;log(q,"Arada mesaj attın.","");}}]})},
 // ===== PROFESYONEL HAYAT =====
 {id:"salary",w:p=>p.level>=3&&p.level<=5,auto:1,m:p=>({title:"Maaşlar ödenmiyor",text:(p.club?p.club.name:"Kulübün")+" üç aydır maaş ödemiyor. Kulüp başkanı 'sabredin' diyor.",choices:[
   {t:"Sabret",s:"Moral ↓",fx:q=>{q.moral-=7;if(R()<.5){log(q,"Sezon sonunda maaşlarını aldın. Sabrın karşılık buldu.","good");}else{const l=salary(q)*.25;q.money=Math.max(0,q.money-l);log(q,"Maaşlarının bir kısmı hiç ödenmedi ("+fmtE(Math.round(l))+" kayıp).","bad");}}},
   {t:"FIFA'ya şikâyet et",s:"Paran garantide · Hoca bağı ↓",fx:q=>{q.bond-=8;log(q,"FIFA'ya başvurdun. Paranı aldın ama kulüpte yalnız kaldın.","");}},
   {t:"Sözleşmeyi feshet",s:"Teklifleri gör, kulübünü seç",fx:q=>{log(q,"Maaşların ödenmediği için sözleşmeni feshettin.","");q.pending=transferOffers(q,"Artık serbest oyuncusun.");}}]})},
 {id:"doping",w:p=>p.level>=3&&p.age>=20&&!(p.injM>0),auto:0,m:p=>({title:"Takım doktorunun 'vitaminleri'",text:"Takım doktoru performansını artıracak 'özel vitamin' iğneleri öneriyor. İçeriğini söylemiyor.",choices:[
   {t:"Reddet",s:"Hoca bağı ↓",fx:q=>{q.bond-=3;log(q,"İğneyi reddettin. Doktor omuz silkti.","");}},
   {t:"Kabul et",s:"Fizik ↑ · Doping testinde yakalanabilirsin",fx:q=>{q.fit+=8;if(R()<.3){const m=Math.round(rnd(6,12));q.injM=m;q.injName="Doping cezası";q.injKind="ban";q.fame=clamp(q.fame-20,0,100);q.moral-=15;log(q,"Doping testi pozitif çıktı! "+m+" ay men cezası.","bad");addMag(q,"Doping skandalı! {n} "+m+" ay men cezası aldı.");}else log(q,"İğneleri oldun, kendini çok enerjik hissettin. Test hiç gelmedi.","");}}]})},
 {id:"betad",w:p=>p.level>=4&&p.fame>=20&&!(p.injM>0),auto:0,m:p=>{const v=Math.round(Math.max(5000,salary(p)*.4)/1000)*1000;return {title:"Yasa dışı bahis reklamı",text:"Yasa dışı bir bahis sitesi reklam yüzü olman için "+fmtE(v)+" teklif ediyor.",choices:[
   {t:"Reddet",s:"Doğrusu bu",fx:q=>{q.moral+=2;log(q,"Bahis reklamını reddettin.","");}},
   {t:"Kabul et",s:"+"+fmtE(v)+" · Ün ↓ · Federasyon cezası riski",fx:q=>{q.money+=v;q.earn+=v;q.fame-=8;if(R()<.35){const m=1.5;q.injM=Math.max(q.injM||0,m);q.injName="Bahis reklamı cezası";q.injKind="ban";log(q,"Federasyon soruşturma açtı, 6 maç ceza aldın.","bad");}addMag(q,"{n} yasa dışı bahis reklamında! Tepki büyük.");}}]};}},
 {id:"robbery",w:p=>p.fame>=30&&p.money>20000,auto:0,m:p=>({title:"Evin soyuldu",text:"Deplasmandayken evine hırsız girdi. Saatler, takılar, nakit gitti.",choices:[
   {t:"Özel güvenlik tut",s:"Para ↓ · Moral ↑",fx:q=>{const c=Math.round(q.money*.08);q.money-=c;q.spent+=c;q.moral+=2;log(q,"Hırsızlıkta "+fmtE(c)+" kaybettin, özel güvenlik tuttun.","bad");}},
   {t:"Sitede bir eve taşın",s:"Moral ↓",fx:q=>{const c=Math.round(q.money*.05);q.money-=c;q.moral-=5;log(q,"Hırsızlıkta "+fmtE(c)+" kaybettin. Bir süre gece uyuyamadın.","bad");}}]})},
 {id:"crash",w:p=>p.owned&&(p.owned.sport||p.owned.car1)&&p.age>=18&&!(p.injM>0),auto:0,m:p=>({title:"Trafik kazası",text:"Antrenman dönüşü arabanla hafif bir kaza yaptın. Boynun ağrıyor.",choices:[
   {t:"Şoför tut",s:"Para ↓ · Güvenli",fx:q=>{setOut(q,.5,"Boyun incinmesi");q.money=Math.max(0,q.money-Math.round(salary(q)*.05+1000));log(q,"İki hafta boyun korsesiyle dolaştın. Artık şoförün var.","");}},
   {t:"Kendin kullanmaya devam",s:"Risk",fx:q=>{setOut(q,.5,"Boyun incinmesi");log(q,"İki hafta boyun korsesiyle dolaştın.","");if(q.fame>=25)addMag(q,"{n} kaza yaptı! Neyse ki ciddi değil.");}}]})},
 {id:"president",w:p=>p.level>=3,auto:1,m:p=>({title:"Kulüp başkanlık seçimi",text:"Kulüpte seçim var. Adaylardan biri senden destek istiyor, kazanırsa maaşını artıracağını söylüyor.",choices:[
   {t:"Açıkça destek ver",s:"Kazanırsa maaş ↑ · Kaybederse hoca bağı ↓",fx:q=>{if(R()<.5){const v=Math.round(salary(q)*.2);q.money+=v;q.earn+=v;log(q,"Desteklediğin aday kazandı. Prim aldın ("+fmtE(v)+").","good");}else{q.bond-=10;log(q,"Desteklediğin aday kaybetti. Yeni yönetim seni sevmiyor.","bad");}}},
   {t:"Tarafsız kal",s:"Güvenli",fx:q=>log(q,"Seçimde tarafsız kaldın.","")}]})},
 {id:"tactic",w:p=>p.level>=3,auto:1,m:p=>({title:"Yeni sistem, yeni rol",text:"Hoca yeni taktiğinde seni alışık olmadığın bir rolde oynatıyor.",choices:[
   {t:"Uyum sağla",s:"Hoca bağı ↑ · Kısa vadede form ↓",fx:q=>{q.bond+=7;q.skill-=.8;log(q,"Yeni role alıştın. Hoca 'takım oyuncusu' dedi.","");}},
   {t:"Eski yerini iste",s:"Hoca bağı ↓",fx:q=>{if(R()<.5){q.moral+=3;log(q,"Hoca ikna oldu, eski yerine döndün.","good");}else{q.bond-=8;log(q,"Hoca 'kararları ben veririm' dedi. Kulübeye çekildin.","bad");}}}]})},
 {id:"rumor",w:p=>p.level>=4&&p.level<=6&&p.fame>=20&&p.age<=29,auto:1,m:p=>({title:"Transfer dedikodusu",text:"Gazeteler bir üst lig kulübünün seninle ilgilendiğini yazıyor. Kulübün kapıyı kapatıyor.",choices:[
   {t:"Kulübü zorla, antrenmana çıkma",s:"Transfer olabilirsin · Hoca bağı ↓↓",fx:q=>{if(eff(q)>=T[q.level+1]-6&&R()<.55){const nl=q.level+1;setLevel(q,nl,club(q,nl,nl>homeMax(q.c)));q.fame+=6;log(q,"Zorla gittin! "+q.club.name+" ile anlaştın.","big");}else{q.bond-=18;q.fame-=4;log(q,"Transfer gerçekleşmedi. Kulübünde dışlandın.","bad");}}},
   {t:"Dedikoduları sustur",s:"Hoca bağı ↑ · Taraftar ↑",fx:q=>{q.bond+=5;q.fame+=2;log(q,"'Burada mutluyum' dedin. Taraftar formanı öptü.","good");}}]})},
 {id:"nepo",w:p=>p.level>=2&&p.level<=5,auto:0,m:p=>({title:"Hocanın yeğeni",text:"Takıma hocanın yeğeni geldi ve hak etmediği halde senin yerine oynuyor.",choices:[
   {t:"Yönetime şikâyet et",s:"Hoca bağı ↓↓",fx:q=>{q.bond-=12;if(R()<.4){log(q,"Yönetim hocayı uyardı, ilk 11'e döndün.","good");}else log(q,"Şikâyetin hocaya ulaştı. Durum daha da kötü.","bad");}},
   {t:"Sahada daha çok çalış",s:"Gelişim ↑ · Moral ↓",fx:q=>{q.skill+=1;q.moral-=4;log(q,"Dişini sıktın, antrenmanlarda fark attın.","");}}]})},
 {id:"relegation",w:p=>p.level>=3,auto:1,m:p=>({title:"Küme düşme hattı",text:"Takımın ligin son sıralarında. Soyunma odasında moral sıfır.",choices:[
   {t:"Liderliği üstlen",s:"Hoca bağı ↑ · Ün ↑ · Moral ↓",fx:q=>{q.bond+=8;q.fame+=3;q.moral-=4;log(q,"Soyunma odasında konuşma yaptın. Takım son haftalarda kenetlendi.","good");}},
   {t:"Kendi oyununa bak",s:"Etkisi yok",fx:q=>log(q,"Kendi işine odaklandın.","")}]})},
 {id:"dual",w:p=>p.level>=4&&p.age>=19&&p.age<=26&&!p.caps&&!p.natC,auto:0,m:p=>{const opts=C.filter(x=>x!==p.c&&(NST[x[0]]||0)>=6.6);const nc=pick(opts);return {title:"Çifte vatandaşlık",text:"Anneannen "+nc[1]+" kökenli. "+nc[1]+" federasyonu seni milli takımlarına davet ediyor. Kabul edersen "+p.c[1]+" için bir daha oynayamazsın.",choices:[
   {t:nc[1]+" için oyna",s:"Yeni milli takım · Memlekette tepki",fx:q=>{q.natC=nc;q.fame+=4;q.moral-=3;log(q,"Artık "+nc[1]+" milli takımının oyuncususun.","big");addMag(q,"{n} "+nc[1]+" milli takımını seçti!");}},
   {t:p.c[1]+" formasını bekle",s:"Moral ↑",fx:q=>{q.moral+=4;log(q,"'Benim ülkem "+q.c[1]+"' dedin. Memlekette kahraman oldun.","good");}}]};}},
 {id:"shoes",w:p=>p.level>=4&&p.fame>=15,auto:0,m:p=>{const v=Math.round(Math.max(3000,salary(p)*.15)/1000)*1000;return {title:"Krampon sponsorluğu",text:"İki marka seninle anlaşmak istiyor.",choices:[
   {t:"Büyük marka",s:"+"+fmtE(v)+" · Ün ↑",fx:q=>{q.money+=v;q.earn+=v;q.fame+=4;log(q,"Dev bir markayla krampon anlaşması imzaladın ("+fmtE(v)+").","good");}},
   {t:"Rahat ettiğin küçük marka",s:"+"+fmtE(Math.round(v/3))+" · Sakatlık riski ↓",fx:q=>{const w=Math.round(v/3);q.money+=w;q.earn+=w;q.fit+=4;log(q,"Ayağına tam oturan kramponla devam ettin.","");}}]};}},
 {id:"doc",w:p=>p.fame>=45&&p.level>=5,auto:1,m:p=>{const v=Math.round(Math.max(20000,salary(p)*.25)/1000)*1000;return {title:"Belgesel teklifi",text:"Bir dijital platform hayatını anlatan belgesel çekmek istiyor. "+fmtE(v)+" teklif ediyorlar.",choices:[
   {t:"Kabul et",s:"Para ↑ · Ün ↑ · Hoca bağı ↓",fx:q=>{q.money+=v;q.earn+=v;q.fame+=8;q.bond-=5;addMag(q,"{n}'in belgeseli yayında! İzlenme rekoru.");}},
   {t:"Reddet",s:"Odak sahada",fx:q=>log(q,"Belgesel teklifini reddettin.","")}]};}},
 {id:"dog",w:p=>p.age>=20&&p.level>=3,auto:0,m:p=>({title:"Barınaktan köpek",text:"Hayvan barınağına ziyarette bir köpek peşini bırakmadı.",choices:[
   {t:"Sahiplen",s:"Moral ↑ (kalıcı)",fx:q=>{q.dog=pick(["Paşa","Karabaş","Zeytin","Duman","Maya","Fıstık"]);q.moral+=8;log(q,q.dog+" artık senin. Her sabah koşuya birlikte çıkıyorsunuz.","good");}},
   {t:"Barınağa bağış yap",s:"Ün ↑",fx:q=>{q.fame+=2;q.money=Math.max(0,q.money-500);log(q,"Barınağa bağış yaptın.","");}}]})},
 {id:"sugar",w:p=>p.level>=3,auto:1,m:p=>({title:"Diyetisyenin listesi",text:"Kulübün diyetisyeni şekeri, gece yemeklerini ve gazlı içecekleri tamamen bırakmanı istiyor.",choices:[
   {t:"Harfiyen uy",s:"Fizik ↑↑ · Moral ↓",fx:q=>{q.fit+=6;q.moral-=4;log(q,"Altı ay şeker yemedin. Vücut yağ oranın %8'e indi.","good");}},
   {t:"Hafta sonları kaçamak",s:"Moral ↑ · Fizik ↓",fx:q=>{q.moral+=3;q.fit-=2;log(q,TRK(q)?"Pazar günleri annenin baklavasından vazgeçmedin.":"Pazar günleri annenin yaptığı tatlılardan vazgeçmedin.","");}}]})},
 {id:"anxiety",w:p=>p.age>=18&&p.level>=3,auto:0,m:p=>({title:"Maç öncesi kaygı",text:"Son haftalarda maç öncesi geceler uyuyamıyorsun, midene kramplar giriyor.",choices:[
   {t:"Spor psikoloğuna git",s:"Moral ↑↑ · Para ↓",fx:q=>{q.money=Math.max(0,q.money-Math.round(500+salary(q)*.01));q.moral+=9;log(q,"Spor psikoloğuyla çalışmaya başladın. Nefes egzersizleri işe yaradı.","good");}},
   {t:"Kendin hallet",s:"Moral ↓",fx:q=>{q.moral-=5;log(q,"Kimseye söylemedin. Zor haftalar geçirdin.","bad");}}]})},
 {id:"sibuni",w:p=>p.fam.sib>=1&&p.level>=3&&p.age>=20,auto:0,m:p=>{const v=Math.round(Math.max(1500,salary(p)*.06)/100)*100;return {title:"Kardeşinin okul masrafı",text:"Kardeşin üniversiteyi kazandı ama ailenin yurt ve okul masraflarına gücü yetmiyor. Yıllık "+fmtE(v)+".",choices:[
   {t:"Masrafları sen karşıla",s:"Para ↓ · Moral ↑",fx:q=>{q.money=Math.max(0,q.money-v);q.spent+=v;q.moral+=6;log(q,"Kardeşinin okul masraflarını üstlendin. Mezuniyetinde ilk sırada sen oturacaksın.","good");}},
   {t:"Burs bulmasına yardım et",s:"Moral ↓",fx:q=>{q.moral-=2;log(q,"Kardeşin burs buldu ama yarı zamanlı çalışmak zorunda kaldı.","");}}]};}},
 {id:"dadshop",w:p=>p.level>=4&&p.fam.cls<=1&&p.money>=15000,auto:0,m:p=>{const v=Math.round(Math.min(p.money*.3,60000)/1000)*1000;return {title:"Babanın emekliliği",text:"Baban ("+p.fam.dad+") yıllardır yorgun. Ona küçük bir dükkân açıp emekli etmek istiyorsun. Yaklaşık "+fmtE(v)+".",choices:[
   {t:"Dükkânı aç",s:"Para ↓ · Moral ↑↑",fx:q=>{q.money-=v;q.spent+=v;q.moral+=10;log(q,"Babana dükkân açtın. Tabelada senin forma numaran var.","big");}},
   {t:"Şimdilik değil",s:"",fx:q=>log(q,"Babanın emekliliğini erteledin.","")}]};}},
 {id:"oldcoach",w:p=>p.level>=4,auto:0,m:p=>({title:"Çocukluk hocan aradı",text:"Seni ilk keşfeden hocan aradı. Mahalle kulübünün topları, formaları eskimiş.",choices:[
   {t:"Malzemeleri sen al",s:"Para ↓ · Moral ↑ · Ün ↑",fx:q=>{const v=Math.round(500+salary(q)*.02);q.money=Math.max(0,q.money-v);q.spent+=v;q.moral+=5;q.fame+=3;log(q,"Mahalle kulübüne yeni forma ve top aldın. Çocuklar formalarının arkasına senin adını yazdırmış.","good");}},
   {t:"Kulübe imzalı forma gönder",s:"Moral ↑",fx:q=>{q.moral+=2;log(q,"İmzalı formanı gönderdin, kulüp lokaline astılar.","");}}]})},
 {id:"mentor",w:p=>p.age>=28&&p.level>=3,auto:1,m:p=>({title:"Genç bir yetenek",text:"Takıma A takıma yeni çıkan 18 yaşında bir çocuk geldi. Senin gençliğine benziyor.",choices:[
   {t:"Abisi ol",s:"Moral ↑ · Hoca bağı ↑",fx:q=>{q.moral+=5;q.bond+=6;log(q,"Gence abilik yaptın. Hoca seni 'sahadaki antrenör' diye anıyor.","good");}},
   {t:"Kendi formana odaklan",s:"Gelişim ↑",fx:q=>{q.skill+=.4;log(q,"Kendi işine odaklandın.","");}}]})},
 {id:"academy",w:p=>p.age>=29&&p.level>=4&&p.money>=40000,auto:0,m:p=>({title:"Futbol okulu",text:"Büyüdüğün "+p.fam.semt.split(", ").pop()+" semtinde kendi adını taşıyan bir futbol okulu açabilirsin.",choices:[
   {t:"Okulu aç",s:"Para ↓ · Ün ↑ · Futbol sonrası iş",fx:q=>{const v=Math.round(Math.min(q.money*.25,120000));q.money-=v;q.spent+=v;q.fame+=5;q.moral+=5;q.school=true;q.biz.push({t:"Futbol okulu",p:v,inc:.05,risk:.05});log(q,"Kendi futbol okulunu açtın. İlk gün 80 çocuk kayıt oldu.","big");}},
   {t:"Şimdilik değil",s:"",fx:q=>log(q,"Futbol okulu fikrini rafa kaldırdın.","")}]})},
 {id:"pundit",w:p=>p.age>=32&&p.fame>=30,auto:1,m:p=>({title:"Yorumculuk teklifi",text:"Bir spor kanalı, emekli olunca seni yorumcu olarak istiyor. Şimdiden sözleşme önerdiler.",choices:[
   {t:"Ön sözleşme imzala",s:"Futbol sonrası güvence",fx:q=>{q.pundit=true;q.moral+=4;log(q,"Spor kanalıyla ön anlaşma yaptın. Emeklilikte ekrandasın.","good");}},
   {t:"Teknik direktörlüğü düşünüyorum",s:"",fx:q=>{q.coach=q.coach||R()<.3;log(q,"Teklifi geri çevirdin. Gözün kulübede.","");}}]})},
 {id:"momtrip",w:p=>p.level>=4&&p.money>=10000,auto:0,m:p=>({title:"Annenin hayali",text:"Annen hayatı boyunca hiç yurt dışına çıkmadı. Gezmek en büyük hayali.",choices:[
   {t:"Annene dünya turu hediye et",s:"Para ↓ · Moral ↑↑",fx:q=>{const v=Math.round(Math.min(q.money*.1,30000));q.money-=v;q.spent+=v;q.moral+=9;log(q,"Annene dünya turu hediye ettin. Her şehirden sana kartpostal gönderdi.","good");}},
   {t:"Sezon bitince birlikte gidin",s:"Moral ↑",fx:q=>{q.moral+=4;log(q,"Yaz tatilinde annenle birlikte tatile çıktınız.","good");}}]})},
 {id:"charitymatch",w:p=>p.level>=4&&p.fame>=20,auto:1,m:p=>({title:"Deprem bölgesi için yardım maçı",text:"Ülkende büyük bir afet oldu. Futbolcular yardım maçı ve bağış kampanyası düzenliyor.",choices:[
   {t:"Organize et, büyük bağış yap",s:"Para ↓ · Ün ↑↑ · Moral ↑",fx:q=>{const v=Math.round(Math.max(1000,q.money*.1));q.money-=v;q.spent+=v;q.fame+=8;q.moral+=6;log(q,"Yardım kampanyasına "+fmtE(v)+" bağışladın, maçı sen organize ettin.","big");addMag(q,"{n}'den büyük yardım: "+fmtE(v)+" bağış!");}},
   {t:"Maçta oyna",s:"Moral ↑",fx:q=>{q.moral+=3;q.fame+=2;log(q,"Yardım maçında forma giydin.","good");}}]})},
 {id:"momsick",w:p=>p.age>=14,auto:0,m:p=>({title:"Annen ağır hastalandı",text:"Annen ("+p.fam.mom+") hastaneye kaldırıldı. Doktorlar birkaç ay sürecek bir tedavi diyor.",choices:[
   {t:"Yanına git, birkaç maç kaçır",s:"Aile her şeyden önce gelir. Hoca memnun olmayabilir.",fx:q=>{q.moral+=6;q.bond-=10;log(q,"Annenin yanında kaldın. İyileşirken elini hiç bırakmadın.","good");}},
   {t:"Takımda kal, tedaviyi sen öde",s:"Uzaktan destek. İçin rahat etmeyecek.",fx:q=>{const c=Math.min(q.money*.25,8000+salary(q)*.1);q.money-=c;q.moral-=6;log(q,"Tedavi masraflarını sen ödedin ("+fmtE(Math.round(c))+"). Her gece telefonla aradın.","");}}]})},
 {id:"debt",w:p=>p.level>=4&&p.fam.cls<=1&&p.money>=5000,auto:0,m:p=>({title:"Babanın borcu",text:"Baban yıllardır kimseye söylemediği bir borç yüzünden zor durumda. Senden yardım istemeye utanıyor.",choices:[
   {t:"Borcu kapat",s:"Birikiminin bir kısmı gider.",fx:q=>{const c=Math.min(q.money*.4,30000);q.money-=c;q.moral+=10;log(q,"Babanın borcunu kapattın ("+fmtE(Math.round(c))+"). Sana sarılıp ağladı.","good");}},
   {t:"Bu sefer yardım edemem",s:"Kendi geleceğin de önemli.",fx:q=>{q.moral-=10;log(q,"Yardım etmedin. Babanla aranıza soğukluk girdi.","bad");}}]})},
 {id:"homesick",w:p=>p.level===2&&p.age>=12&&p.age<=16,auto:1,m:p=>({title:"Eve dönmek istiyorsun",text:"Akademi yurdunda geceler uzun. "+p.fam.semt.split(", ").pop()+" ve ailen burnunda tütüyor.",choices:[
   {t:"Ailenle her gün görüntülü konuş",s:"Moral, ama antrenmana daha az odak.",fx:q=>{q.moral+=8;q.skill-=1;log(q,"Her akşam ailenle konuştun. Annenin sesi iyi geldi.","good");}},
   {t:"Kendini antrenmana ver",s:"Hoca bunu fark eder.",fx:q=>{q.moral-=6;q.bond+=10;q.skill+=1;log(q,"Özlemi antrenmanla bastırdın. Hoca bunu fark etti.","");}}]})},
 {id:"love",w:p=>p.fame>=18&&p.level>=4&&p.age>=20&&p.age<=32&&!p.partner,auto:0,m:p=>{const pt={name:fullName(p.c,true),job:pick(["dizi oyuncusu","şarkıcı","model","sunucu","fenomen"])};return {title:"Aşk iddiası",text:"Ünlü "+pt.job+" "+pt.name+" ile aynı restoranda görüntülendiniz. Muhabirler kapıda bekliyor.",choices:[
   {t:"El ele çık, ilişkini açıkla",s:"Manşetlere hazır ol.",fx:q=>{q.partner=pt;q.fame+=12;q.moral+=8;addMag(q,"{n} ile "+pt.job+" {partner} aşkı belgelendi!");}},
   {t:"Sadece arkadaşız de",s:"Özel hayatın özel kalsın.",fx:q=>{q.fame+=3;log(q,"\"Sadece arkadaşız\" dedin. Kimse inanmadı.","");}}]}}},
 {id:"wedding",w:p=>p.partner&&!p.married&&p.age>=24,auto:1,m:p=>({title:"Evlilik",text:p.partner.name+" evlenme teklifini kabul etti! Düğün nasıl olsun?",choices:[
   {t:TRK(p)?"Boğaz'da şatafatlı düğün":"Lüks bir otelde şatafatlı düğün",s:"Birikiminin bir kısmı gider, ama yılın düğünü olur.",fx:q=>{const c=Math.min(q.money*.3,400000);q.money-=c;q.spent+=c;q.married=true;q.fame+=10;q.moral+=10;addMag(q,"Yılın düğünü: {n} ve {partner} dünyaevine girdi!");}},
   {t:"Sade bir nikah",s:"Sadece aile ve yakın dostlar.",fx:q=>{q.married=true;q.moral+=12;log(q,p.partner.name+" ile sade bir törenle evlendin.","good");}}]})},
 {id:"paparazzi",w:p=>p.fame>=30&&p.level>=4,auto:0,m:p=>({title:"Paparazzi kapında",text:"Gece 2'de evinin önündeler. Kamerayı yüzüne tuttular.",choices:[
   {t:"Kameraya el salla",s:"Sakin ol.",fx:q=>{q.fame+=3;addMag(q,"{n} gece yarısı bile güler yüzlü.");}},
   {t:"Kamerayı it",s:"Yeter artık!",fx:q=>{if(R()<.45){q.fame-=10;q.moral-=8;addMag(q,"Skandal! {n} muhabire saldırdı iddiası.");}else{q.fame+=2;log(q,"Kamerayı ittin, görüntüler yayınlanmadı.","");}}}]})},
 {id:"tv",w:p=>p.fame>=25&&p.level>=4,auto:1,m:p=>({title:"TV programı daveti",text:"Hafta sonu yayınlanan ünlüler yarışmasına davet edildin. İyi para veriyorlar.",choices:[
   {t:"Katıl",s:"Para ve ün, biraz da yorgunluk.",fx:q=>{const v=Math.round(salary(q)*.15+3000);q.money+=v;q.earn+=v;q.fame+=6;q.fit-=3;addMag(q,"{n} TV'de dans etti, sosyal medya yıkıldı.");}},
   {t:"Reddet",s:"Futbolcu sahada konuşur.",fx:q=>log(q,"TV teklifini reddettin.","")}]})},
 {id:"feud",w:p=>p.fame>=20&&p.level>=4,auto:1,m:p=>({title:"Sosyal medya kavgası",text:"Eski takım arkadaşın bir paylaşımda seni nankörlükle suçladı.",choices:[
   {t:"Sert cevap ver",s:"Kimse senden bunu esirgeyemez.",fx:q=>{q.fame+=5;q.moral-=4;addMag(q,"{n} eski takım arkadaşına ateş püskürdü!");}},
   {t:"Sessiz kal",s:"Cevap vermek onu büyütür.",fx:q=>{q.moral+=2;log(q,"Cevap vermedin. Bir hafta sonra konu unutuldu.","");}}]})},
 {id:"jobloss",w:p=>p.age>=10&&p.age<=15&&p.fam.cls<=1&&p.fam.dad!=="şu an işsiz",auto:1,m:p=>({title:"Baban işini kaybetti",text:"Baban ("+p.fam.dad+") bir akşam eve erken geldi ve kimseyle konuşmadı. Evde para sıkıntısı başladı.",choices:[
   {t:"Okuldan sonra çalış",s:"Eve para getir. Antrenmanlar aksar.",fx:q=>{q.skill-=2;q.edu-=3;q.moral-=3;q.money+=300;log(q,"Okuldan sonra çalışmaya başladın. Babanın gözlerindeki gururu gördün.","");}},
   {t:"Futbola devam et",s:"Bu senin çıkış yolun.",fx:q=>{q.moral-=6;q.skill+=1;log(q,"Futbola devam ettin. Evde sessiz akşam yemekleri oldu.","bad");}}]})},
 {id:"dadwish",w:p=>p.age>=13&&p.age<=15&&p.fam.cls===2,auto:1,m:p=>({title:"Baban üniversite istiyor",text:"Baban ("+p.fam.dad+") futbolun geçici bir heves olduğunu düşünüyor. İyi bir kolejin sınavına girmeni istiyor.",choices:[
   {t:"Futbolda ısrar et",s:"Kendi yolun.",fx:q=>{q.moral-=5;q.skill+=1;log(q,"Babana karşı çıktın. Bir yıl boyunca maçlarına gelmedi.","");}},
   {t:"İkisini de yapacağına söz ver",s:"Ders ve antrenman birlikte.",fx:q=>{q.edu+=15;q.skill-=1.5;log(q,"Hem sınava hazırlandın hem antrenmana gittin. Baban ilk kez tribündeydi.","good");}}]})},
 {id:"dadfoot",w:p=>p.fam.dadfoot&&p.age>=8&&p.age<=12,auto:0,m:p=>({title:"Babanın eski kramponları",text:"Baban gençken amatör ligde oynamış. Dolaptan eski kramponlarını çıkardı.",choices:[
   {t:"Onunla her akşam çalış",s:"Babandan ders.",fx:q=>{q.skill+=2.5;q.moral+=5;log(q,"Her akşam babanla parkta şut çalıştın.","good");}},
   {t:"Kendi yolunu bul",s:"Onun hikâyesi başka.",fx:q=>{q.moral+=2;log(q,"Babanın kramponlarını raftaki yerine koydun.","");}}]})},
 {id:"sibling",w:p=>p.fam.sib>=2&&p.age>=11&&p.age<=15,auto:0,m:p=>({title:"Kardeşlerine bakman gerekiyor",text:"Annen yeni bir işe başladı. Akşamları "+p.fam.sib+" kardeşine birinin bakması lazım.",choices:[
   {t:"Kardeşlerine bak",s:"Moral ↑ · Hoca bağı ↓ · Gelişim ↓",fx:q=>{q.moral+=4;q.skill-=1.5;q.bond-=4;log(q,"Akşamları kardeşlerine baktın, antrenmanları kaçırdın.","");}},
   {t:"Komşudan yardım iste",s:"Moral ↓ · Hoca bağı ↑",fx:q=>{q.skill+=.5;q.moral-=3;q.bond+=3;log(q,"Komşu teyze kardeşlerine baktı. Ona ilk golünü adadın.","good");}}]})},
 {id:"house",w:p=>p.level>=4&&p.fam.cls<=1&&p.money>=20000,auto:0,m:p=>({title:"Ailene ev",text:"Ailen hâlâ "+p.fam.semt+" semtindeki kira evinde oturuyor. Birikiminle onlara ev alabilirsin.",choices:[
   {t:"Ev al",s:"Birikiminin büyük kısmı gider.",fx:q=>{q.money*=.35;q.moral+=15;log(q,"Ailene ev aldın. Annen anahtarı alınca ağladı.","big");}},
   {t:"Biraz daha biriktir",s:"Önce kendi geleceğin.",fx:q=>log(q,"Ev almayı erteledin.","")}]})},
 {id:"pen1",w:p=>p.age>=9&&p.age<=15,auto:0,m:p=>({title:"Turnuva finali, penaltılar",text:"Skor eşit, son penaltı kaldı. Antrenör sana bakıyor ama kaptan da topu istiyor.",choices:[
   {t:"Topu al, sen at",s:"Ya kahraman ya...",fx:q=>{if(R()<.6+q.skill/400){q.fame+=6;q.moral+=8;log(q,"Penaltıyı attın, kupa sizin! Omuzlarda taşındın.","big");}else{q.moral-=10;log(q,"Penaltıyı kaçırdın. O gece uyuyamadın.","bad");}}},
   {t:"Kaptana bırak",s:"Yük onda olsun.",fx:q=>{q.moral+=2;log(q,"Kaptan attı, takım kazandı.","");}}]})},
 {id:"trip",w:p=>p.age>=10&&p.age<=15,auto:0,m:p=>({title:"Okul gezisi mi, turnuva mı?",text:"Sınıfın üç günlük geziye gidiyor. Aynı hafta sonu bölge turnuvası var.",choices:[
   {t:"Turnuvaya git",s:"Gelişim ↑ · Ün ↑ · Moral ↓",fx:q=>{q.skill+=1.5;q.fame+=3;q.moral-=4;q.bond+=3;log(q,"Turnuvada oynadın, iki gol attın. Gezi fotoğraflarına bakınca içinde bir burukluk kaldı. (moral −4)","good");}},
   {t:"Geziye git",s:"Moral ↑↑ · Hoca bağı ↓",fx:q=>{q.moral+=10;q.bond-=4;log(q,"Gezide hayatının en çok güldüğü üç gününü geçirdin.","good");}}]})},
 {id:"boots",w:p=>p.age>=9&&p.age<=15&&p.fam.cls===0,auto:0,m:p=>({title:"Kramponların delindi",text:"Ailen bu ay yeni krampon alacak durumda değil.",choices:[
   {t:"Delik kramponla devam",s:"Ayakların acıyacak.",fx:q=>{q.moral-=5;q.fit-=3;log(q,"Bütün sezon delik kramponla oynadın. Kimse fark etmedi bile.","");}},
   {t:"Yaz tatilinde çalış",s:"Pazarda, dükkanda.",fx:q=>{q.moral+=4;q.edu-=2;log(q,"Yazın çıraklık yapıp kendi kramponunu aldın.","good");}}]})},
 {id:"coachfight",w:p=>p.level===2&&p.age>=13,auto:0,m:p=>({title:"Antrenörle tartıştın",text:"Maçta seni oyundan aldı, sen de herkesin önünde söylendin.",choices:[
   {t:"Özür dile",s:"Gururunu yut.",fx:q=>{q.moral-=3;q.bond+=12;q.skill+=1;log(q,"Özür diledin. Ertesi hafta yine ilk 11'deydin.","");}},
   {t:"Hakkını savun",s:"Haklıydın.",fx:q=>{if(R()<.5){q.fame+=4;q.bond+=8;log(q,"Hocan sana hak verdi, kaptanlık pazubendini sana verdi.","good");}else{q.skill-=3;q.moral-=8;q.bond-=25;log(q,"Üç ay yedek kulübesinde oturdun.","bad");}}}]})},
 {id:"rival",w:p=>p.level===2&&p.age>=13&&p.age<=15,auto:1,m:p=>{const cl=club(p,2);return {title:"Rakip altyapıdan teklif",text:cl.name+" altyapısı seni istiyor. Daha iyi tesisler ama yeni bir şehir.",choices:[
   {t:"Geç",s:"Yeni hocalar, yeni arkadaşlar.",fx:q=>{q.club=cl;q.clubs.push(cl.name);q.bond=50;q.pot+=1;q.moral-=6;log(q,cl.name+" altyapısına geçtin.","good");}},
   {t:"Kal",s:"Sadakat.",fx:q=>{q.moral+=4;log(q,"Kulübünde kaldın, takım arkadaşların sevindi.","");}}]}}},
 {id:"pos",w:p=>p.age>=11&&p.age<=17&&p.level>=1,auto:1,m:p=>{const np=pick(POS.filter(x=>x!==p.pos&&x!=="Kaleci"));return {title:"Mevki değişikliği",text:"Antrenör seni "+np.toLowerCase()+" olarak denemek istiyor. Orada daha iyi olabileceğini düşünüyor.",choices:[
   {t:np+" ol",s:"Yeni bir başlangıç. Risk de var, fırsat da.",fx:q=>{q.pos=np;q.pot+=rnd(-2,4);q.skill-=2;log(q,"Artık "+np.toLowerCase()+" oynuyorsun.","");}},
   {t:p.pos+" kal",s:"Sevdiğin yerde.",fx:q=>log(q,"Mevkinde ısrar ettin.","")}]}}},
 {id:"viral",w:p=>p.age>=12&&p.age<=22,auto:1,m:p=>({title:"Videon viral oldu",text:"Antrenmanda attığın röveşata milyonlarca kez izlendi. Telefonun susmuyor.",choices:[
   {t:"Hesabını büyüt",s:"Ün gelir, odak gider.",fx:q=>{q.fame+=15;q.skill-=1.5;q.moral+=5;log(q,"Takipçin bir gecede 200 bine çıktı.","big");}},
   {t:"Telefonu kapat, çalış",s:"Sahada konuş.",fx:q=>{q.skill+=1.5;log(q,"Ünü bir kenara koyup çalışmaya devam ettin.","");}}]})},
 {id:"party",w:p=>p.age>=17&&p.level>=3,auto:1,m:p=>({title:"Derbi öncesi gece",text:"En yakın arkadaşının doğum günü partisi derbiden bir gece önce.",choices:[
   {t:"Git, erken dönersin",s:"Moral ↑ · Hoca bağı ↓ · Fotoğrafın çekilebilir.",fx:q=>{q.moral+=8;q.bond-=8;q.fit-=3;if(R()<.3){q.fame-=8;q.bond-=12;log(q,"Partiye gittin, gece 3'te çekilen fotoğrafın sosyal medyaya düştü. Kulüp ceza kesti. (moral +8, hoca bağı −20)","bad");}else log(q,"Partiye gittin, arkadaşın çok mutlu oldu. Hoca yorgun olduğunu fark etti. (moral +8, hoca bağı −8)","");}},
   {t:"Evde kal",s:"Moral ↓ · Hoca bağı ↑",fx:q=>{q.moral-=6;q.bond+=4;q.skill+=.3;log(q,"Partiye gitmedin, arkadaşın kırıldı. Hoca derbiye hazırlığını övdü. (moral −6, hoca bağı +4)","");}}]})},
 {id:"bday",w:p=>p.age>=12&&p.age<=17&&p.level>=1,auto:1,m:p=>{const fr=firstName(fullName(p.c,false));return {title:"Arkadaşının doğum günü",text:"Çocukluk arkadaşın "+fr+" doğum günü yapıyor. Aynı akşam antrenman var.",choices:[
   {t:"Doğum gününe git",s:"Moral ↑ · Hoca bağı ↓",fx:q=>{q.moral+=7;q.bond-=6;log(q,suf(fr,"in")+" doğum gününe gittin, gece boyunca güldünüz. Hoca antrenmanı kaçırdığını not etti. (moral +7, hoca bağı −6)","good");}},
   {t:"Antrenmana git",s:"Moral ↓ · Hoca bağı ↑",fx:q=>{q.moral-=5;q.bond+=4;q.skill+=.3;log(q,"Antrenmana gittin. "+fr+" biraz küstü. (moral −5, hoca bağı +4)","");}}]};}},
 {id:"fwed",w:p=>p.age>=22&&p.level>=3,auto:1,m:p=>{const fr=firstName(fullName(p.c,false));return {title:"Arkadaşının düğünü",text:"Mahalleden kankan "+fr+" evleniyor, seni sağdıç istiyor. Düğün kamp gününe denk geliyor.",choices:[
   {t:"Kamptan izin iste, düğüne git",s:"Moral ↑ · Hoca bağı ↓",fx:q=>{q.moral+=9;q.bond-=7;log(q,suf(fr,"in")+" düğününde sağdıç oldun, "+(TRK(q)?"halay başı çektin.":"sabaha kadar dans ettin.")+" Hoca izni zor verdi. (moral +9, hoca bağı −7)","good");}},
   {t:"Kampta kal, görüntülü ara",s:"Moral ↓ · Hoca bağı ↑",fx:q=>{q.moral-=7;q.bond+=4;log(q,"Düğüne gidemedin. Videoda herkes seni sordu. (moral −7, hoca bağı +4)","");}}]};}},
 {id:"derby",w:p=>p.level>=4,auto:0,m:p=>({title:"Derbide son dakika penaltısı",text:"Stat ayakta. Topu alıp noktaya koyabilir ya da penaltıcıya bırakabilirsin.",choices:[
   {t:"Topu al",s:"Ya efsane ya hedef.",fx:q=>{if(R()<.55+q.skill/500){q.fame+=12;q.moral+=8;log(q,"Penaltıyı attın, derbi sizin! Taraftar adını bağırdı.","big");}else{q.fame-=6;q.moral-=12;log(q,"Kaleci uzandı. Haftalarca sosyal medyada hedef oldun.","bad");}}},
   {t:"Penaltıcıya bırak",s:"Akıllıca.",fx:q=>log(q,"Penaltıcı attı. Ona ilk sarılan sen oldun.","")}]})},
 {id:"loan",w:p=>p.level>=4&&p.age<=24&&p.skill<T[p.level]+3,auto:0,m:p=>{const cl=club(p,Math.max(4,p.level-1));return {title:"Kiralık teklifi",text:"Kulübün seni bir sezonluk "+cl.name+" takımına kiralık göndermek istiyor. Orada her hafta oynarsın.",choices:[
   {t:"Kiralık git",s:"Forma ve tecrübe.",fx:q=>{q.skill+=3;const ap=ri(22,32),gl=Math.round(ap*{Kaleci:0,Defans:.05,"Orta saha":.15,Forvet:.4}[q.pos]*rnd(.6,1.2)),as=Math.round(ap*.1*rnd(.5,1.3));q.apps+=ap;q.goals+=gl;q.assists+=as;q.hist.push({y:seasonLbl(q)+"*",team:cl.name+" (kiralık)",lg:cl.league||leagueOf(q),apps:ap,gl,as});q.clubs.push(cl.name+" (kiralık)");log(q,cl.name+" formasıyla kiralık oynadın, sezonun en iyilerindendin.","good");}},
   {t:"Kal, forma için savaş",s:"Kapıyı zorlayacaksın.",fx:q=>{if(R()<.4){q.skill+=2;q.bond+=15;log(q,"Hocayı ikna ettin, sezon ortasında ilk 11'e girdin.","good");}else{q.moral-=7;log(q,"Bütün sezon kenarda kaldın.","bad");}}}]}}},
 {id:"ad",w:p=>p.level>=4&&p.fame>=25,auto:0,m:p=>({title:"Reklam teklifi",text:"Bir spor markası seninle reklam çekmek istiyor.",choices:[
   {t:"Kabul et",s:"Para ve ün.",fx:q=>{const v=Math.round(salary(q)*rnd(.2,.6));q.money+=v;q.earn+=v;q.fame+=8;log(q,"Reklam yüzü oldun, "+fmtE(v)+" kazandın.","good");}},
   {t:"Reddet",s:"Sadece futbol.",fx:q=>log(q,"Reklam teklifini geri çevirdin.","")}]})},
 {id:"captain",w:p=>p.level>=3&&p.age>=25,auto:0,m:p=>({title:"Kaptanlık",text:"Takım arkadaşların seni kaptan seçti.",choices:[
   {t:"Pazubendi tak",s:"Sorumluluk seninle.",fx:q=>{q.moral+=8;q.bond+=10;q.fame+=6;log(q,"Artık kaptansın.","big");}},
   {t:"Teşekkür et, reddet",s:"Kendi oyununa odaklan.",fx:q=>log(q,"Kaptanlığı tecrübeli bir arkadaşına bıraktın.","")}]})},
 {id:"newcoach",w:p=>p.level>=4&&p.age>=19,auto:1,m:p=>({title:"Yeni hoca seni sevmiyor",text:"Takıma gelen yeni teknik direktör seni planlarında görmüyor.",choices:[
   {t:"Transfer iste",s:"Teklifleri gör, kulübünü seç",fx:q=>{log(q,"Kulübünden transfer istedin.","");q.pending=transferOffers(q,"Yönetim seni bırakmayı kabul etti.");}},
   {t:"Antrenmanda kendini göster",s:"Sabır.",fx:q=>{if(R()<.5){q.skill+=2;q.bond=70;log(q,"Hocanın fikrini değiştirdin. Artık vazgeçilmezsin.","good");}else{q.moral-=10;q.bond=20;log(q,"Ne yaptıysan olmadı. Kayıp bir sezon.","bad");}}}]})},
 {id:"home",w:p=>p.age>=17&&p.abroad&&p.lang<3,auto:1,m:p=>({title:"Memleket özlemi",text:"Yurt dışında yalnızsın. Annen telefonda her seferinde ağlıyor.",choices:[
   {t:"Aileni yanına getir",s:"Masraflı ama huzurlu.",fx:q=>{q.moral+=12;q.money*=.8;log(q,"Ailen yanına taşındı. Ev artık ev gibi.","good");}},
   {t:"Dişini sık",s:"Buraya kolay gelmedin.",fx:q=>{q.moral-=8;q.skill+=1;log(q,"Yalnızlığı antrenmanla bastırdın.","");}}]})},
 {id:"fix",w:p=>p.level>=3&&p.level<=6&&p.age>=19,auto:0,m:p=>{const amt=bribe(p);return {title:"Şüpheli bir teklif",text:"Bir tanıdık, "+(p.club?p.club.name:"takımın")+" maçında 'biraz yavaş oynaman' karşılığında "+fmtE(amt)+" teklif etti. Bu, "+leagueOf(p)+" için büyük bir para.",choices:[
   {t:"Reddet ve kulübe bildir",s:"Moral ↑ · Ün ↑ · Doğrusu bu.",fx:q=>{q.fame+=8;q.moral+=5;q.bond+=5;log(q,fmtE(amt)+"'luk teklifi bildirdin. Federasyon soruşturma açtı, adın dürüstlükle anıldı.","good");}},
   {t:"Reddet, kimseye söyleme",s:"Moral ↓ · Başını belaya sokma.",fx:q=>{q.moral-=4;log(q,"Reddettin ama aylarca içini kemirdi.","");}},
   {t:"Kabul et",s:"+"+fmtE(amt)+" · Yakalanırsan 1–2 yıl men, ün ve kariyer çöker.",fx:q=>{q.money+=amt;q.moral-=8;log(q,fmtE(amt)+" aldın ve o maçta bilerek kötü oynadın. Vicdanın rahat değil.","bad");if(R()<.25)ban(q,amt);else q.fixRisk={n:4,amt};}}]};}},
 {id:"pt",w:p=>p.money>=15000,auto:0,m:p=>({title:"Kişisel antrenör",text:"Ünlü bir fizik antrenörü seninle özel çalışmak istiyor. Ucuz değil.",choices:[
   {t:"Tut",s:"Vücuduna yatırım.",fx:q=>{q.money*=.75;q.fit+=12;q.pot+=1;log(q,"Özel antrenörle çalışmaya başladın. Hiç bu kadar fit olmamıştın.","good");}},
   {t:"Gerek yok",s:"Kulübün antrenörleri yeter.",fx:q=>log(q,"Özel antrenör tutmadın.","")}]})},
 {id:"uni",w:p=>p.age>=18&&p.age<=26&&p.edu>=35,auto:1,m:p=>({title:"Açıktan üniversite",text:"Takım arkadaşın açıktan üniversite okuyor. Sen de kaydolabilirsin.",choices:[
   {t:"Kaydol",s:"Futboldan sonrası için.",fx:q=>{q.edu+=20;q.moral+=3;log(q,"Üniversiteye kaydoldun. Kamp otellerinde ders çalışıyorsun.","good");}},
   {t:"Şimdi değil",s:"Kafan sahada.",fx:q=>log(q,"Okulu sonraya bıraktın.","")}]})},
 {id:"gulf",w:p=>p.level>=5&&p.age>=29&&p.age<=34,auto:0,m:p=>({title:"Körfez'den dev teklif",text:"Bir Körfez kulübü maaşının üç katını teklif ediyor. Lig zayıf, para çok.",choices:[
   {t:"Git",s:"Ailenin geleceği.",fx:q=>{const v=salary(q)*2;q.money+=v*.5;q.earn+=v;q.club={name:pick(["Riyad","Cidde","Doha","Dubai","Dammam"])+" FC",country:["QA","Körfez"],league:"Körfez Pro Ligi"};q.clubs.push(q.club.name);q.abroad=true;q.fame-=5;log(q,q.club.name+" ile anlaştın. Bir sezonda "+fmtE(v)+" ek kazandın.","big");}},
   {t:"Kal",s:"Futbol paradan önce gelir.",fx:q=>{q.moral+=5;log(q,"Körfez teklifini reddettin. Taraftar seni bağrına bastı.","good");}}]})},
 {id:"coach",w:p=>p.age>=30&&p.level>=3,auto:0,m:p=>({title:"Antrenörlük kursu",text:"Federasyon oyunculara antrenörlük lisansı kursu açtı. Yaz tatilin gider.",choices:[
   {t:"Kursa katıl",s:"Futbol bitince ne olacak?",fx:q=>{q.coach=true;q.moral-=2;log(q,"Antrenörlük lisansını aldın.","good");}},
   {t:"Tatile çık",s:"Dinlenmeyi hak ettin.",fx:q=>{q.moral+=8;q.fit+=4;log(q,"Yazı ailenle sahilde geçirdin.","good");}}]})},
];
function randomEvent(p,force){
  if(!force&&R()>(p.you?.6:.35))return;
  p.seen=p.seen||{};
  const ok=EV.filter(e=>(!p.seen[e.id]||e.rep&&p.age-p.seen[e.id]>=e.rep)&&e.w(p));
  if(!ok.length)return;
  const e=pick(ok);p.seen[e.id]=p.age;
  const d=e.m(p);d.kind="ev";d.auto=e.auto;p.pending=d;
}

// auto-play a peer one season
function peerSeason(q){
  if(q.ended)return;
  q.focus=q.age<16?[pick(["train","train","school","show","family"]),pick(["street","friends","family","school","extra"])]:[pick(["train","train","rest","show"]),pick(["extra","diet","video","family","gym"]),pick(["train","rest","mental","charity","lang"])];
  season(q);
  if(q.pending){const d=q.pending;let i=d.auto;if(d.kind==="academy"||d.kind==="offer"||d.kind==="release")i=R()<.82?0:1;if(d.kind==="retire")i=R()<.7?0:1;if(d.kind==="agent")i=0;resolve(q,i);if(q.pending&&q.pending.kind==="xfer")resolve(q,0);}
  if(q.age>=42&&!q.ended)endCareer(q,"Jübile","Uzun bir kariyer.","pro");
}
function statusOf(q){
  if(q.ended)return q.endTitle;
  return LV[q.level]+(q.club&&q.level>=2?" · "+q.club.name:"");
}

// ===== STATE / UI =====
const opts={world:"world",len:"30",auto:"0"};
document.querySelectorAll(".seg").forEach(seg=>{
  seg.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
    seg.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));
    opts[seg.dataset.opt]=b.dataset.v;});
});
let P=null,peers=[],timer=null,paused=false,yearMs=60000,startLen="30",auto=false,reflected={},waiting=false;
let month=0,mlog=[],mapps=[],mgoals=[],mast=[];
const MONTHS=["Ağu","Eyl","Eki","Kas","Ara","Oca","Şub","Mar","Nis","May"];
const MONTHF=["Ağustos","Eylül","Ekim","Kasım","Aralık","Ocak","Şubat","Mart","Nisan","Mayıs"];
// kariyer uzunluğu: ortalama ~26 sezon. Sabit hız: bir yılın saniyesi. Yıl = 10 ay + yaz arası = 11 adım.
const yearFor=v=>v[0]==="y"?(+v.slice(1))*1000:(+v)*60000/26;
const monthMs=()=>yearMs/11;
const LENLBL={"5":"~5 dk","10":"~10 dk","30":"~30 dk","60":"~1 saat","90":"~1,5 saat"};
function renderSpeed(){
  const o=(startLen[0]==="y"?[]:[[startLen,"Kariyer "+LENLBL[startLen]]]).concat([["y60","1× · 1 dk"],["y30","2× · 30 sn"],["y15","4× · 15 sn"],["y8","8× · 8 sn"]]);
  $("speed").innerHTML=o.map(([v,t])=>'<button type="button" data-v="'+v+'" aria-pressed="'+(yearFor(v)===yearMs)+'">'+t+'</button>').join("");
  $("speed").querySelectorAll("button").forEach(b=>b.onclick=()=>{yearMs=yearFor(b.dataset.v);renderSpeed();schedule();});
}
const REFLECT={};

$("btnStart").onclick=()=>{
  P=makePlayer(opts.world,true);
  peers=[0,1,2,3].map(()=>makePlayer("world",false));
  auto=opts.auto==="1";paused=false;startLen=opts.len;yearMs=yearFor(opts.len);renderSpeed();reflected={};waiting=false;month=0;mlog=[];
  $("btnAuto").setAttribute("aria-pressed",auto);$("btnPause").setAttribute("aria-pressed","false");$("btnPause").textContent="Duraklat";
  const F=P.fam;
  log(P,"Doğduğun yer: "+place(P)+". Baban "+F.dad+", annen "+F.mom+". "+(F.sib?F.sib+" kardeşin var.":"Tek çocuksun.")+(F.dadfoot?" Baban gençken amatör ligde oynamış.":""),"big");
  log(P,"Yedi yaşındasın. İlk topun "+(F.cls===0?"plastik, biraz da patlak.":F.cls===2?"pahalı, maç topu.":"yeni, deri kokuyor.")+" Hep "+{Kaleci:"kaleci olmak",Defans:"defansta oynamak","Orta saha":"orta sahada oynamak",Forvet:"forvette oynamak"}[P.pos]+" istiyorsun.","");
  $("start").hidden=true;$("end").hidden=true;$("game").hidden=false;window.scrollTo(0,0);
  render();schedule();
};
$("btnPause").onclick=()=>{paused=!paused;$("btnPause").setAttribute("aria-pressed",paused);$("btnPause").textContent=paused?"Devam et":"Duraklat";if(!paused)schedule();};
$("btnAuto").onclick=()=>{auto=!auto;$("btnAuto").setAttribute("aria-pressed",auto);if(auto&&P.pending){autoResolve();}};

function schedule(){
  clearTimeout(timer);if(!P)return;
  $("game").classList.toggle("is-paused",paused||waiting);
  if(paused||waiting||P.ended)return;
  const d=monthMs();renderTicker(d);
  timer=setTimeout(step,d);
}
function autoResolve(){const d=P.pending;let i=d.auto;if(d.kind==="academy"||d.kind==="offer"||d.kind==="release")i=0;if(d.kind==="retire")i=P.age>=35?0:1;if(d.kind==="agent")i=0;resolve(P,i);waiting=false;$("decision").innerHTML="";render();if(P.ended)return finish();if(P.pending)return autoResolve();schedule();}
function step(){
  if(!P||P.ended)return;
  if(month===0){
    season(P);peers.forEach(peerSeason);
    if(P.age>=42&&!P.ended)endCareer(P,"Jübile","Kırk iki yaşında hâlâ oynuyordun. Efsane.","pro");
    planSeason();render();
    if(P.ended)return finish();
    month=1;
    if(P.pending){if(auto)return autoResolve();showDecision();return;}
    if(REFLECT[P.age]&&!reflected[P.age]&&!auto){reflected[P.age]=1;showReflect(P.age);return;}
    return schedule();
  }
  monthTick(month-1);
  if(P.pending&&!P.ended){month=month>=10?0:month+1;render();if(auto)return autoResolve();showDecision();return;}
  month=month>=10?0:month+1;
  schedule();
}
// Aylık fikstür: Ağu Eyl Eki Kas Ara Oca Şub Mar Nis May
const FIX={1:[0,1,2,2,1,0,2,2,2,2],2:[1,3,3,3,2,1,3,3,4,3],3:[1,3,3,3,2,1,3,3,4,3],pro:[2,4,4,4,4,2,4,5,5,4]};
const LSIZE={1:8,2:14,3:16,4:18,5:18,6:20,7:20};
const SCHOOL=["Cumhuriyet","Gazi","Atatürk","Fatih","Mimar Sinan","Yunus Emre","Mehmet Akif","İnönü","Namık Kemal","Hürriyet","Barbaros","Kanuni","Piri Reis","Ziya Gökalp"];
let mfix=[],minj=new Set();
function wspread(n,w){const out=w.map(()=>0);const tot=w.reduce((a,b)=>a+b,0);if(!tot)return out;for(let k=0;k<n;k++){let r=R()*tot;for(let i=0;i<w.length;i++){r-=w[i];if(r<=0){out[i]++;break;}}}return out;}

// ===== TURNUVALAR VE ÖDÜLLER =====
const CONF={UEFA:"TR DE EN ES FR IT NL PT BE SC IE CH AT DK SE NO PL CZ HU RO GR HR RS BA AL UA RU AZ GE".split(" "),
 CONMEBOL:"BR AR UY CO CL PE EC PY VE".split(" "),CONCACAF:"MX US CA".split(" "),
 CAF:"NG GH SN CI CM ML CD MA DZ TN EG ZA ET KE".split(" ")};
const confOf=code=>{for(const k in CONF)if(CONF[k].includes(code))return k;return "AFC";};
const CONT={UEFA:["UEFA Şampiyonlar Ligi","UEFA Avrupa Ligi","UEFA Konferans Ligi"],CONMEBOL:["Copa Libertadores","Copa Sudamericana","Copa Sudamericana"],
 CONCACAF:["CONCACAF Şampiyonlar Kupası","CONCACAF Şampiyonlar Kupası","CONCACAF Şampiyonlar Kupası"],CAF:["CAF Şampiyonlar Ligi","CAF Konfederasyon Kupası","CAF Konfederasyon Kupası"],
 AFC:["AFC Şampiyonlar Ligi Elite","AFC Şampiyonlar Ligi Two","AFC Şampiyonlar Ligi Two"]};
const SHORT={"UEFA Şampiyonlar Ligi":"ŞL","UEFA Avrupa Ligi":"AL","UEFA Konferans Ligi":"KL","Copa Libertadores":"LIB","Copa Sudamericana":"SUD","CONCACAF Şampiyonlar Kupası":"CCC","CAF Şampiyonlar Ligi":"CAF","CAF Konfederasyon Kupası":"CAF2","AFC Şampiyonlar Ligi Elite":"ACL","AFC Şampiyonlar Ligi Two":"ACL2"};
const DCUP={TR:"Ziraat Türkiye Kupası",EN:"FA Cup",ES:"Copa del Rey",DE:"DFB-Pokal",IT:"Coppa Italia",FR:"Coupe de France",NL:"KNVB Beker",PT:"Taça de Portugal",BR:"Copa do Brasil",AR:"Copa Argentina",US:"U.S. Open Cup",JP:"İmparator Kupası",SA:"Kral Kupası"};
const cupName=c=>DCUP[c[0]]||(c[1]+" Kupası");
const yrOf=p=>2027+Math.max(0,p.age-8); // sezon sonundaki yaz
function koSim(adv,stages){let i=0;while(i<stages.length-1&&R()<adv)i++;const won=i===stages.length-1&&R()<adv;return {i,won};}
const ELIM={"Grup aşaması":"grup aşamasında","Lig aşaması":"lig aşamasında","Play-off":"play-off turunda","Son 32":"son 32'de","Son 16":"son 16'da","Çeyrek final":"çeyrek finalde","Yarı final":"yarı finalde","Final":"finalde"};
const outTxt=(st,r)=>r.won?"şampiyon oldu!":r.i===st.length-1?"finalde kaybetti.":ELIM[st[r.i]]+" elendi.";
function stageTxt(st,r){return r.won?"Şampiyon":st[r.i]+(r.i===st.length-1?" (finalde kaybetti)":"");}
function addCup(p,n,big){p.cups.push({n,y:seasonLbl(p)});p.trophies++;p.fame=clamp(p.fame+(big?10:4),0,100);}
function addAward(p,n,note){p.awards.push({n,y:seasonLbl(p),note:note||""});}

function contOpp(p,tier){
  const conf=confOf(p.club.country[0]),own=p.club.country[0];
  let pool=C.filter(x=>confOf(x[0])===conf&&x[0]!==own&&x[3]>=(tier===0&&p.level>=6?8:5.5));
  if(!pool.length)pool=C.filter(x=>confOf(x[0])===conf&&x[0]!==own);if(!pool.length)pool=C;
  const cc=pick(pool);return clubName(cc,cityOf(cc),tier===0&&cc[3]>=8.8&&R()<.5)+" ("+cc[0]+")";
}
function planCont(p){
  p.cont=null;if(p.level<5||!p.club||!p.club.country)return;
  const conf=confOf(p.club.country[0]),L=p.level,r=R();
  let tier=L===7?(r<.95?0:-1):L===6?(r<.45?0:r<.8?1:-1):(r<.12?0:r<.3?1:r<.5?2:-1);
  if(tier<0)return;
  if(conf!=="UEFA"&&tier===2)tier=1;
  const comp=CONT[conf][tier],uefa=conf==="UEFA";
  const adv=clamp(.38+(L-5)*.07+p.tbl.str*.25+tier*.06,.2,.75);
  const sched=Array.from({length:10},()=>[]);
  const lpN=uefa&&tier<2?8:6,lpM=lpN===8?{1:2,2:2,3:1,4:1,5:2}:{1:1,2:2,3:2,4:1};
  for(const k in lpM)sched[k].push({st:uefa?"Lig aşaması":"Grup aşaması",n:lpM[k],kind:"lp"});
  let reached="Lig aşaması",won=false,alive=R()<adv+.12;
  if(!alive){sched[5].length?sched[5][sched[5].length-1].out="elim":sched[4][sched[4].length-1].out="elim";reached=uefa?"Lig aşaması":"Grup aşaması";}
  else{
    if(uefa&&R()>.5){const ok=R()<adv+.05;sched[6].push({st:"Play-off",n:2,kind:"ko",out:ok?"adv":"elim"});reached="Play-off";if(!ok)alive=false;}
    else{const last=sched[5].length?sched[5]:sched[4];last[last.length-1].out="direct";}
    const KO=[["Son 16",7],["Çeyrek final",8],["Yarı final",9]];
    for(const [st,m] of KO){if(!alive)break;const ok=R()<adv;sched[m].push({st,n:2,kind:"ko",out:ok?"adv":"elim"});reached=st;if(!ok)alive=false;}
    if(alive){won=R()<adv;sched[9].push({st:"Final",n:1,kind:"final",out:won?"win":"lose"});reached="Final";}
  }
  p.cont={comp,tier,sched,reached,won,apps:0,gl:0,as:0};
}
const r0=(us,them,note)=>us>them||note.includes("kazandınız")?"G":us===them?"B":"M";
function contMatches(p,i,on0){
  const out=[];if(!p.cont)return out;const ct=p.cont,ls=p.ls;
  const rate=ls&&ls.apps?ls.gl/ls.apps*.85:.1,arate=ls&&ls.apps?(ls.as||0)/ls.apps*.85:.08;
  for(const it of ct.sched[i]){
    for(let k=0;k<it.n;k++){
      const lastLeg=k===it.n-1,home=it.kind==="final"?null:(k===0?R()<.5:null);
      const on=on0&&R()<(ls&&ls.start?.88:.35);let g=0,a=0;
      if(on){g=(R()<rate?1:0)+(R()<rate*rate*.6?1:0);a=R()<arate?1:0;}
      let us=Math.max(g+a,Math.round(Math.max(0,gauss(1.3+p.tbl.str*.6,1.1)))),them=Math.round(Math.max(0,gauss(1.3,1.05)));
      let note="";
      if(lastLeg&&it.out){
        if(it.out==="adv"||it.out==="win"){if(us<them)us=them+(R()<.6?1:0);if(us===them)note=" (pen. kazandınız)";}
        else if(it.kind!=="lp"){if(them<us)them=us+(R()<.6?1:0);if(us===them)note=" (pen. kaybettiniz)";}
      }
      if(on){ct.apps++;ct.gl+=g;ct.as+=a;}
      const r=us>them||note.includes("kazandınız")?"G":us===them?"B":"M";
      const rt=on?rating(p,g,a,r0(us,them,note),!(ls&&ls.start)):0;
      const who=on?(ls&&ls.start?"90 dk":ri(55,80)+". dk oyuna girdin")+(g?" · "+g+" gol":"")+(a?" · "+a+" asist":"")+" · puan "+f1(rt):(on0?"oynamadın":"sakatsın, oynamadın");
      out.push({r,sc:us+"-"+them,o:(SHORT[ct.comp]||"Kupa")+" · "+it.st+" · "+contOpp(p,ct.tier)+(it.kind==="final"?"":home===false?" (dep.)":""),rt,who:(note?note.trim().replace(/[()]/g,"")+" · ":"")+who,on,cup:1});
    }
    const msg={adv:it.st+" turunu geçtiniz!",elim:ct.comp+" macerası "+ELIM[it.st]+" bitti.",direct:"Lig aşamasını ilk 8'de bitirip doğrudan son 16'ya kaldınız!",win:ct.comp+" ŞAMPİYONU OLDUNUZ!",lose:"Finalde kaybettiniz. Kupa bir adım ötedeydi."}[it.out];
    if(msg)out.msg=(out.msg?out.msg+" ":"")+msg;
  }
  return out;
}
const NST={BR:9.5,AR:9.5,FR:9.5,ES:9.3,EN:9.2,DE:9,PT:9,NL:8.8,IT:8.7,BE:8.5,HR:8.3,UY:8.2,CO:8,MA:8,JP:7.8,SN:7.8,CH:7.6,DK:7.6,US:7.5,MX:7.5,TR:7.5,EC:7.4,AT:7.4,KR:7.3,NG:7.3,CI:7.2,RS:7.2,NO:7.2,PL:7,UA:7,SE:7,IR:7,AU:7,CM:7,EG:7,DZ:7,GH:6.8,TN:6.8,CZ:6.8,SC:6.6,SA:6.5,QA:6.3,ML:6.6,PY:6.8,CL:6.8,PE:6.5,CA:7,GR:6.6,HU:6.6,RO:6.4,GE:6.5,UZ:6.5,IQ:6.2,AE:6};
const natS=c=>NST[c[0]]||Math.min(c[3],6.5);
function natTour(p){
  const res=[];if(!p.natNow)return res;
  const NC=p.natC||p.c,yr=yrOf(p),cf=confOf(NC[0]),s=natS(NC);
  const T=[];
  if(yr%4===2)T.push(["FIFA Dünya Kupası",s>=8.5?.97:s>=7?.8:s>=6?.6:s>=5?.45:.3,["Grup aşaması","Son 32","Son 16","Çeyrek final","Yarı final","Final"]]);
  if(cf==="UEFA"&&yr%4===0)T.push(["UEFA Avrupa Şampiyonası",s>=8?.97:s>=6?.75:.45,["Grup aşaması","Son 16","Çeyrek final","Yarı final","Final"]]);
  if(cf==="UEFA"&&yr%2===1&&s>=7.5&&R()<.3)T.push(["UEFA Uluslar Ligi Finalleri",1,["Yarı final","Final"]]);
  if(cf==="CONMEBOL"&&yr%4===0)T.push(["Copa América",1,["Grup aşaması","Çeyrek final","Yarı final","Final"]]);
  if(cf==="CONCACAF"&&yr%2===1)T.push(["CONCACAF Altın Kupa",.95,["Grup aşaması","Çeyrek final","Yarı final","Final"]]);
  if(cf==="CAF"&&yr%2===1)T.push(["Afrika Uluslar Kupası",s>=4?.8:.55,["Grup aşaması","Son 16","Çeyrek final","Yarı final","Final"]]);
  if(cf==="AFC"&&yr%4===3)T.push(["AFC Asya Kupası",.85,["Grup aşaması","Son 16","Çeyrek final","Yarı final","Final"]]);
  for(const [n,q,st] of T){
    if(R()>q){res.push({n,q:false});log(p,yr+" "+n+": "+NC[1]+" turnuvaya katılamadı.","bad");continue;}
    const adv=clamp(.3+(s-5)*.1,.22,.78),r=koSim(adv,st);if(st[0]==="Grup aşaması"&&r.i===0&&R()<.3){r.i=1;}
    const apps=Math.min((st[0]==="Grup aşaması"?3:1)+r.i+(r.won?1:0)-(st[0]==="Grup aşaması"?0:0),7);
    const pl=Math.max(0,apps-(R()<.2?1:0)),rate=p.ls&&p.ls.apps?p.ls.gl/p.ls.apps*.7:.1;
    let g=0,a=0;for(let k=0;k<pl;k++){g+=R()<rate?1:0;a+=R()<rate*.6?1:0;}
    p.caps+=pl;const txt=stageTxt(st,r);
    p.hist.push({y:seasonLbl(p),team:"↳ "+NC[1]+" Milli Takımı",lg:n+" · "+txt,apps:pl,gl:g,as:a,cup:1});
    p.cApps+=pl;p.cGoals+=g;p.cAs+=a;
    log(p,yr+" "+n+": "+NC[1]+" "+(r.won?"ŞAMPİYON OLDU!":outTxt(st,r))+" Sen "+pl+" maç"+(g?", "+g+" gol":"")+(a?", "+a+" asist":"")+".",r.won?"big":"");
    if(r.won){addCup(p,n,true);addMag(p,"{n} ve "+NC[1]+" "+n+"'nı kazandı! Ülke sokaklara döküldü.");}
    const big=n==="FIFA Dünya Kupası";
    if(g>=(big?6:5)||g>=4&&R()<.5){addAward(p,n+" Gol Kralı",g+" gol");log(p,n+" gol kralı oldun! ("+g+" gol)","big");}
    if(r.i>=st.length-2&&g+a>=3&&R()<.35+(r.won?.25:0)){addAward(p,n+" Turnuvanın Oyuncusu");log(p,n+" turnuvanın en iyi oyuncusu seçildin!","big");}
    if(p.age<=21&&pl>=4&&g+a>=2&&R()<.25){addAward(p,n+" En İyi Genç Oyuncu");log(p,n+" en iyi genç oyuncu ödülü senin!","big");}
    res.push({n,q:true,r,st,g,a,big});
  }
  return res;
}
function youthTour(p){
  const yr=yrOf(p),s=natS(p.c),E=eff(p);
  let n=null,st=["Grup aşaması","Son 16","Çeyrek final","Yarı final","Final"];
  if(p.age>=15&&p.age<=16&&p.yCall&&p.level>=2&&R()<.45)n="FIFA U-17 Dünya Kupası";
  else if(yr%2===1&&p.age>=17&&p.age<=19&&p.level>=2&&p.level<=6&&E>=58+(s>=8?8:s>=7?4:0)&&R()<.5)n="FIFA U-20 Dünya Kupası";
  if(!n)return;
  const r=koSim(clamp(.32+(s-5)*.08,.25,.7),st),pl=3+r.i+(r.won?1:0);let g=0;for(let k=0;k<pl;k++)g+=R()<({Forvet:.4,"Orta saha":.2,Defans:.06,Kaleci:0}[p.pos])?1:0;
  p.hist.push({y:seasonLbl(p),team:"↳ "+p.c[1]+" "+(n.includes("17")?"U17":"U20"),lg:n+" · "+stageTxt(st,r),apps:pl,gl:g,as:0,cup:1,youth:true});
  log(p,yr+" "+n+": "+p.c[1]+" "+(r.won?"ŞAMPİYON!":outTxt(st,r))+" Sen "+pl+" maç, "+g+" gol.",r.won?"big":"good");
  p.fame=clamp(p.fame+(r.won?12:4),0,100);if(r.won)addCup(p,n,true);
  if(g>=5){addAward(p,n+" Gol Kralı",g+" gol");}
}
function clubExtra(p){
  const yr=yrOf(p);if(p.level<5||!p.club)return;
  // Kulüpler Dünya Kupası: son 4 yılda kıta şampiyonu olan kulüpteysen
  if(yr%4===1&&p.contWin&&p.contWin.club===p.club.name&&p.contWin.yr>=yr-4){
    const st=["Grup aşaması","Son 16","Çeyrek final","Yarı final","Final"],r=koSim(clamp(.45+(p.level-5)*.12,.3,.8),st);
    const pl=3+r.i+(r.won?1:0);let g=0;for(let k=0;k<pl;k++)g+=R()<(p.ls.gl/Math.max(1,p.ls.apps))*.7?1:0;
    p.hist.push({y:seasonLbl(p),team:"↳ "+p.club.name,lg:"FIFA Kulüpler Dünya Kupası · "+stageTxt(st,r),apps:pl,gl:g,as:0,cup:1});p.cApps+=pl;p.cGoals+=g;
    log(p,yr+" FIFA Kulüpler Dünya Kupası: "+(r.won?"DÜNYA ŞAMPİYONU OLDUNUZ!":outTxt(st,r).replace("elendi","elendiniz").replace("kaybetti","kaybettiniz")),r.won?"big":"");
    if(r.won){addCup(p,"FIFA Kulüpler Dünya Kupası",true);addMag(p,"{n} kulübüyle dünyanın zirvesinde!");}
  }
  // Kıtalararası Kupa: geçen sezon kıta şampiyonuysan
  if(p.contWin&&p.contWin.club===p.club.name&&p.contWin.yr===yr-1&&p.contWin.top){
    const ok=R()<clamp(.35+(p.level-5)*.08,.3,.6);
    log(p,"FIFA Kıtalararası Kupası: "+(ok?"kupayı kazandınız!":"finalde kaybettiniz."),ok?"big":"");if(ok)addCup(p,"FIFA Kıtalararası Kupası",true);
  }
}
const TOP5=["EN","ES","DE","IT","FR"];
function seasonScore(p,x){
  const ls=p.ls,E=eff(p),g=ls.gl+x.cg,a=(ls.as||0)+x.ca;
  let S=(E-60)*1.3+g*1.0+a*.6+{Kaleci:20,Defans:13,"Orta saha":6,Forvet:0}[p.pos];
  if(!ls.start)S-=25;
  S+=x.rk===1?8:x.rk&&x.rk<=3?3:0;
  if(x.cont&&x.cont.tier===0)S+=x.cont.won?16:{"Final":10,"Yarı final":6,"Çeyrek final":3,"Son 16":1}[x.cont.reached]||0;
  for(const t of x.nat)if(t.q)S+=t.r.won?(t.big?22:12):t.r.i>=t.st.length-2?5:0;
  S+={7:14,6:4,5:-6,4:-16}[p.level]||-30;
  return S+gauss(0,4);
}
function seasonAwards(p,x){
  if(p.level<4||!p.ls||!p.ls.apps)return;
  const S=seasonScore(p,x),ls=p.ls,uefa=confOf(p.club.country[0])==="UEFA",lg=leagueOf(p);
  p.lastS=S;
  if(p.level>=6){
    if(S>=AW.bdo1){addAward(p,"Ballon d'Or");log(p,"BALLON D'OR SENİN! Dünyanın en iyi futbolcusu seçildin.","big");addMag(p,"Tarihi gece: {n} Ballon d'Or'u kaldırdı!");p.fame=100;}
    else if(S>=AW.bdo3){const pl=S>=AW.bdo2?2:3;addAward(p,"Ballon d'Or "+pl+".'si");log(p,"Ballon d'Or oylamasında "+pl+". oldun.","big");}
    else if(S>=AW.bdo10){const pl=ri(4,10);p.awards.push({n:"Ballon d'Or "+pl+".'si",y:seasonLbl(p),minor:1});log(p,"Ballon d'Or oylamasında "+pl+". sıradasın.","good");}
    else if(S>=AW.bdo30){log(p,"Ballon d'Or 30 kişilik aday listesine girdin.","good");p.fame=clamp(p.fame+3,0,100);}
    if(S>=AW.bdo1-2&&R()<.75||S>=AW.bdo3&&R()<.15){addAward(p,"FIFA The Best");log(p,"FIFA The Best ödülünü kazandın!","big");}
    if(S>=AW.f11){addAward(p,"FIFPRO Dünya 11'i");log(p,"FIFPRO Dünya 11'ine seçildin.","good");}
    if(p.pos==="Kaleci"&&S>=AW.yashin){addAward(p,"Yashin Kupası");log(p,"Yashin Kupası: dünyanın en iyi kalecisi sensin!","big");}
  }
  if(uefa&&p.level>=5){const coef=TOP5.includes(p.club.country[0])?2:p.club.country[3]>=7?1.5:1;if(ls.gl*coef>=AW.shoe){addAward(p,"Avrupa Altın Ayakkabı",ls.gl+" gol");log(p,"Avrupa Altın Ayakkabı senin! ("+ls.gl+" lig golü)","big");addMag(p,"{n} Avrupa'nın gol kralı!");}}
  if(uefa&&p.level>=5&&p.age<=20&&S>=AW.gboy){addAward(p,"Golden Boy");log(p,"Golden Boy: Avrupa'nın en iyi genç oyuncusu seçildin!","big");}
  if(p.pos!=="Kaleci"&&ls.gl>=AW.gk[p.level]){addAward(p,lg+" Gol Kralı",ls.gl+" gol");log(p,lg+" gol kralı oldun! ("+ls.gl+" gol)","big");}
  if(S>=AW.mvp[p.level]){addAward(p,lg+" Sezonun Oyuncusu");log(p,lg+" sezonun oyuncusu seçildin!","big");}
  if(x.cont&&x.cont.gl>=AW.cgk&&x.cont.tier===0){addAward(p,x.cont.comp+" Gol Kralı",x.cont.gl+" gol");log(p,x.cont.comp+" gol kralı oldun!","big");}
  if(ls.gl>0&&p.level>=5&&R()<.0015){addAward(p,"FIFA Puskás Ödülü");log(p,"Attığın röveşata golü FIFA Puskás Ödülü'nü kazandı!","big");addMag(p,"{n}'in golü yılın golü seçildi!");}
}
function seasonEnd(p){
  if(p.level>=3&&p.club&&!p.ls.youth){p.ls.club=p.club.name;p.ls.lg=leagueOf(p);}
  const ls=p.ls,x={rk:rank(p),cont:p.cont,cg:0,ca:0,nat:[]};
  p.hist.push({y:seasonLbl(p),team:ls.club,lg:ls.lg,apps:ls.apps,gl:ls.gl,as:ls.as||0,youth:!!ls.youth});
  log(p,(ls.club?ls.club+" ("+ls.lg+"): ":"")+ls.apps+" maç"+(ls.gl?", "+ls.gl+" gol":"")+(ls.as?", "+ls.as+" asist":"")+(minj.size>=2?" ("+minj.size+" ay sakatlık"+(ls.apps?"":", hiç oynayamadın")+")":ls.start?"":" (çoğunlukla yedek)")+"."+(x.rk?" Takım sezonu "+x.rk+". bitirdi.":""),x.rk===1?"big":"");
  if(x.rk===1&&p.level>=3){addCup(p,lg2(p)+" şampiyonluğu",p.level>=5);log(p,lg2(p)+" ŞAMPİYONU OLDUNUZ!","big");if(p.level>=5)addMag(p,"{n} ve takımı şampiyon! Kutlamalar sabaha kadar sürdü.");}
  if(p.level>=3&&R()<({3:.02,4:.04,5:.06,6:.08,7:.16}[p.level])*(1+p.tbl.str*.5)){const cn=cupName(p.club.country[0]&&C.find(c=>c[0]===p.club.country[0])||p.c);addCup(p,cn);log(p,cn+"'nı kazandınız!","big");}
  if(p.cont){const ct=p.cont;x.cg=ct.gl;x.ca=ct.as;
    p.hist.push({y:seasonLbl(p),team:"↳ "+ls.club,lg:ct.comp+" · "+(ct.won?"Şampiyon":ct.reached),apps:ct.apps,gl:ct.gl,as:ct.as,cup:1});
    p.cApps+=ct.apps;p.cGoals+=ct.gl;p.cAs+=ct.as;
    if(ct.won){addCup(p,ct.comp,true);p.contWin={club:p.club.name,yr:yrOf(p),top:ct.tier===0};if(ct.tier===0)addMag(p,"{n} "+ct.comp+"'ni kazandı! Kıtanın zirvesinde.");}
  }
  clubExtra(p);
  if(p.level>=2&&p.level<=6)youthTour(p);
  x.nat=natTour(p);
  seasonAwards(p,x);
}
const lg2=p=>leagueOf(p);
const AW={bdo1:103,bdo2:99,bdo3:96,bdo10:88,bdo30:80,f11:95,yashin:87,shoe:38,gboy:78,cgk:7,gk:{4:15,5:17,6:17,7:17},mvp:{4:-6,5:37,6:66,7:97}};

function planSeason(){
  mlog=[];mapps=Array(10).fill(0);mgoals=Array(10).fill(0);mast=Array(10).fill(0);mfix=Array(10).fill(0);minj=new Set();
  const ls=P.ls;P.cur=ls?{apps:0,gl:0,as:0}:null;
  P.tbl={w:0,d:0,l:0,str:rnd(-.25,.25)+({7:.5,6:.2}[P.level]||0)+(ls&&ls.start===false?-.05:0)};
  if(!ls){P.cont=null;return;}
  planCont(P);
  mfix=(FIX[P.level]||FIX.pro).slice();
  const avail=mfix.map((f,i)=>minj.has(i)?0:f),cap=avail.reduce((a,b)=>a+b,0);
  const apps=Math.min(ls.apps,cap);
  if(apps<ls.apps){P.apps-=ls.apps-apps;ls.apps=apps;}
  // maçları fikstüre orantılı dağıt (en büyük kalan yöntemi)
  const raw=avail.map(f=>cap?apps*f/cap:0),fl=raw.map(Math.floor);let rem=apps-fl.reduce((a,b)=>a+b,0);
  raw.map((r,i)=>[r-fl[i]+R()*.01,i]).sort((x,y)=>y[0]-x[0]).slice(0,rem).forEach(([,i])=>fl[i]++);
  mapps=fl.map((v,i)=>Math.min(v,avail[i]));
  const maxG=apps*3;if(ls.gl>maxG){P.goals-=ls.gl-maxG;ls.gl=maxG;}
  mgoals=wspread(ls.gl,mapps);mast=wspread(ls.as||0,mapps);
}
const seasonLbl=p=>{const y=2026+Math.max(0,p.age-8);return String(y%100).padStart(2,"0")+"/"+String((y+1)%100).padStart(2,"0");};
function oppName(p){
  if(p.level===1){const sch=pick(SCHOOL)+(p.age<=13?" Ortaokulu":" Lisesi");return p.c[0]==="TR"?sch:pick(p.c[6])+" okul takımı";}
  const cc=(p.club&&C.find(x=>x[0]===p.club.country[0]))||p.c;
  let city=cityOf(cc),t=0;while(p.club&&p.club.name.indexOf(city)===0&&t++<8)city=cityOf(cc);
  const nm=clubName(cc,city,p.level===7&&cc[0]!=="TR"&&R()<.4);
  return p.level===2?nm+" U"+(p.age<=14?"15":p.age<=16?"17":"19"):nm;
}
function rank(p){const T=p.tbl,n=T.w+T.d+T.l,N=LSIZE[p.level]||18;if(!n)return 0;const ppg=(3*T.w+T.d)/n;return clamp(Math.round(N-(ppg-.6)/1.8*(N-1)),1,N);}

// ===== SAKATLIK =====
const fmtM=m=>m<1?Math.max(1,Math.round(m*4))+" hafta":Math.round(m)+" ay";
function setOut(q,m,name){q.injM=m;q.injName=name;q.injKind="";}
function bribe(p){const c=(p.club&&C.find(x=>x[0]===p.club.country[0]))||p.c;const b={3:3000,4:25000,5:120000,6:600000,7:2500000}[p.level]||3000;
  const v=b*(.5+(c[3]||5)/10)*rnd(.8,1.3),r=v>=1e6?1e5:v>=1e5?1e4:v>=1e4?1000:500;return Math.round(v/r)*r;}
function ban(q,amt){const m=Math.round(rnd(12,24));q.injM=m;q.injName="Şike cezası";q.injKind="ban";q.relapse=null;q.fixRisk=null;
  q.fame=clamp(q.fame-30,0,100);q.moral=clamp(q.moral-20,5,100);q.bond=10;const fine=Math.min(q.money,Math.round(amt*1.5));q.money-=fine;
  log(q,"ŞİKE SKANDALI ortaya çıktı! Federasyon sana "+m+" ay men cezası verdi, "+fmtE(fine)+" para cezası ödedin."+(q.level>=4?" Kulübün sözleşmeni feshetti.":""),"bad");
  addMag(q,"Şike skandalı! {n}'e "+m+" ay men cezası.");
  if(q.level>=4){const nl=Math.max(3,q.level-1);setLevel(q,nl,club(q,nl));}}
function medCost(q,base){return Math.round(Math.max(base,q.money*.04+salary(q)*.02));}
function mkRelapse(q,name,prob,after,mon,pot){q.relapse={name,prob:prob+(effFit(q)<50?.1:0),inM:after,mon,pot};}
const INJ=[
 {n:"Hamstring gerilmesi",w:14,m:[.25,.75]},{n:"Ayak bileği burkulması",w:12,m:[.25,1]},{n:"Kas zorlanması",w:10,m:[.25,.6]},
 {n:"Diz darbesi",w:7,m:[.25,.5]},{n:"Kaburga çatlağı",w:4,m:[1,1.5]},{n:"Burun kırığı",w:2,m:[.25,.5],note:"Maskeyle oynayacaksın."},
 {n:"Hamstring yırtığı",w:8,k:"hams"},{n:"Kasık ağrısı (pubalji)",w:6,k:"pub"},{n:"Menisküs yırtığı",w:5,k:"men"},
 {n:"Ayak bileği bağ yırtığı",w:5,k:"ank"},{n:"Omuz çıkığı",w:3,k:"sho",gk:4},{n:"Metatars kırığı",w:3,k:"meta"},
 {n:"Ön çapraz bağ kopması",w:4,k:"acl"},{n:"Aşil tendonu yırtığı",w:2,k:"ach"},{n:"Kaval kemiği kırığı",w:2,k:"leg"}];
function injOpts(q,j){
  const N=j.n,c1=medCost(q,2500),c2=medCost(q,15000);
  const O=(t,s,m,extra)=>({t,s,fx:x=>{setOut(x,m,N);if(extra)extra(x);log(x,N+": "+t.toLowerCase()+". "+(m>=1?"Dönüş "+fmtM(m)+" sonra.":m>0?fmtM(m)+" içinde sahadasın.":"Hemen sahaya döndün."),m>=6?"bad":"");}});
  const pay=c=>x=>{const v=Math.min(x.money,c);x.money-=v;x.spent+=v;};
  switch(j.k){
   case "hams":return {auto:1,o:[O("PRP iğne tedavisi","Yaklaşık 5 hafta. "+fmtE(c1)+" tutar, nüks riski düşük.",1.2,x=>{pay(c1)(x);mkRelapse(x,N,.15,ri(1,2),[2,3],[0,0]);}),
     O("Dinlenme ve fizik tedavi","Yaklaşık 10 hafta. En güvenli yol.",2.5),
     O("Ağrı kesici iğneyle oyna","Bu hafta sahadasın. Yırtık büyüyebilir.",.25,x=>mkRelapse(x,N,.5,ri(1,2),[4,5],[1,3]))]};
   case "pub":return {auto:1,o:[O("İğne tedavisi","Yaklaşık 1 ay. Ağrı geri gelebilir.",1,x=>{pay(c1)(x);mkRelapse(x,N,.35,ri(2,3),[3,4],[0,1]);}),
     O("Ameliyat","3 ay. Kalıcı çözüm.",3),
     O("Ağrıyla oynamaya devam et","Sahada kalırsın ama vücudun bedel ödeyebilir.",0,x=>{x.fit-=10;mkRelapse(x,N,.55,ri(1,3),[5,6],[1,3]);})]};
   case "men":return {auto:0,o:[O("Artroskopik ameliyat","2 ay. Güvenli.",2),
     O("Konservatif tedavi ve iğne","1 ay. Yırtık tekrar açılabilir.",1,x=>{pay(c1)(x);mkRelapse(x,N,.4,ri(2,4),[4,5],[1,2]);})]};
   case "ank":return {auto:0,o:[O("Atel ve rehabilitasyon","2 ay.",2,x=>mkRelapse(x,N,.2,ri(2,3),[2,3],[0,0])),
     O("Ameliyat","3,5 ay. Bağ tamamen onarılır.",3.5),
     O("Bantla oyna","Hemen dönersin. Bağ tamamen kopabilir.",.3,x=>mkRelapse(x,N,.5,ri(1,2),[4,5],[1,3]))]};
   case "sho":return {auto:1,o:[O("Yerine oturt, korumayla oyna","2 hafta. Omuz tekrar çıkabilir.",.5,x=>mkRelapse(x,N,.4,ri(1,3),[4,4],[0,1])),
     O("Ameliyat","4 ay. Omuz bir daha çıkmaz.",4)]};
   case "meta":return {auto:0,o:[O("Vida ile ameliyat","2,5 ay.",2.5),O("Alçıda bekle","2 ay. Kemik iyi kaynamayabilir.",2,x=>mkRelapse(x,N,.4,ri(1,2),[4,4],[0,1]))]};
   case "acl":{const o=[O("Ameliyat ve uzun rehabilitasyon","Yaklaşık 10 ay. Bu sezon bitti.",10,x=>{x.pot-=rnd(1,3);x.moral-=8;}),
     O("Ameliyatsız erken dön","3 ay sonra sahadasın. Diz dayanmazsa 1 yıldan uzun kalırsın.",3,x=>mkRelapse(x,N,.7,ri(1,3),[14,18],[6,12]))];
     if(q.money>=c2)o.splice(1,0,O("Yurt dışında ünlü bir cerrah","Yaklaşık 8 ay. "+fmtE(c2)+" tutar, dize en az zarar.",8,x=>{pay(c2)(x);x.pot-=rnd(.5,1.5);x.moral-=4;}));
     return {auto:0,o};}
   case "ach":return {auto:0,o:[O("Ameliyat","Yaklaşık 11 ay. Uzun ve zor bir yol.",11,x=>{x.pot-=rnd(2,4);x.fit-=8;x.moral-=10;}),
     O("Erken dön","4 ay. Tendon yeniden koparsa 1,5 yıl yoksun.",4,x=>mkRelapse(x,N,.7,ri(1,3),[15,18],[8,14]))]};
   case "leg":return {auto:0,o:[O("Ameliyat, platin takılır","6 ay.",6,x=>{x.pot-=rnd(0,1.5);}),
     O("Alçı ve dinlenme","7 ay. Kemik yanlış kaynayabilir.",7,x=>mkRelapse(x,N,.25,ri(1,3),[4,5],[1,2])),
     O("Erken dön","3 ay. Kemik tekrar kırılırsa 1 yıldan uzun kalırsın.",3,x=>mkRelapse(x,N,.6,ri(1,3),[13,15],[5,9]))]};
  }
}
function injuryRoll(p,i){
  // nüks kontrolü
  if(p.relapse&&p.injM<=0){p.relapse.inM--;if(p.relapse.inM<=0){const r=p.relapse;p.relapse=null;
    if(R()<r.prob){const m=rnd(r.mon[0],r.mon[1]);setOut(p,m,r.name+" (nüks)");p.pot-=rnd(r.pot[0],r.pot[1]);p.fit=clamp(p.fit-(m>=12?15:5),15,100);p.moral=clamp(p.moral-(m>=12?20:8),5,100);
      log(p,r.name+" NÜKSETTİ. Doktorlar "+fmtM(m)+" sahalardan uzak kalacağını söylüyor."+(m>=12?" Kariyerinin en zor dönemi başlıyor.":""),"bad");
      if(p.fame>=20)addMag(p,"Kötü haber: {n}'in sakatlığı nüksetti!");return true;}
    else log(p,r.name+" tamamen iyileşti. Riskli karar bu sefer tuttu.","good");}}
  if(p.injM>0||p.injKind==="ban"||p.age<16||p.level<2||!p.ls||p.pending)return false;
  const F=focusFx(p),pi=(.08+F.inj+(p.age>30?.05:0)+(effFit(p)<40?.05:0)+(p.level>=4?.03:0))/10*(1-comfort(p)*.05);
  if(R()>pi)return false;
  const pool=INJ.map(j=>[j,j.w*(p.pos==="Kaleci"&&j.gk?j.gk:1)*(j.k&&["acl","ach","leg"].includes(j.k)?(p.age>30?1.4:1):1)]);
  let t=pool.reduce((a,b)=>a+b[1],0),r=R()*t,j=pool[0][0];for(const [x,w] of pool){r-=w;if(r<=0){j=x;break;}}
  if(!j.k){const m=rnd(j.m[0],j.m[1]);setOut(p,m,j.n);log(p,"Sakatlık: "+j.n+". "+fmtM(m)+" yoksun."+(j.note?" "+j.note:""),"bad");return true;}
  setOut(p,1,j.n);
  const d=injOpts(p,j);
  p.pending={kind:"inj",title:"Sakatlık: "+j.n,text:"Maçta sakatlandın, ilk muayene bu ayın tamamını kaçıracağını gösteriyor. Doktorlar tedavi seçeneklerini anlattı. Hangisini seçiyorsun?",choices:d.o,auto:d.auto};
  log(p,"Sakatlık: "+j.n+".","bad");
  if(p.fame>=25&&["acl","ach","leg"].includes(j.k))addMag(p,"{n} sedyeyle sahadan çıktı! İlk teşhis: "+j.n.toLowerCase()+".");
  return true;
}
const RREF={1:35,2:50,3:45,4:55,5:65,6:76,7:86};
function rating(p,g,a,r,sub){const ref=p.level===1?30+p.age*2.5:p.level===2?40+p.age*2:(RREF[p.level]||60);return clamp(6.4+clamp((eff(p)-ref)/12,-1.5,1.5)+g*.9+a*.5+(r==="G"?.3:r==="M"?-.3:0)+(sub?-.3:0)+gauss(0,.45),4,10);}
const f1=v=>v.toFixed(1).replace(".",",");
function formSvg(p){
  const F=(p.form||[]).slice(-18);
  if(!F.some(x=>x.v))return '<p class="fempty">İlk resmî maçından sonra aylık maç puanların burada çizgi grafik olarak görünecek.</p>';
  const W=300,H=118,L=24,Rr=6,Tp=8,B=20,y=v=>Tp+(10-v)/(10-4)*(H-Tp-B),n=F.length,xs=k=>L+(n<=1?0:k*(W-L-Rr)/(n-1));
  let g='';for(const v of [5,6,7,8,9])g+='<line x1="'+L+'" x2="'+(W-Rr)+'" y1="'+y(v)+'" y2="'+y(v)+'" class="fg"/><text x="'+(L-5)+'" y="'+(y(v)+3)+'" class="ft" text-anchor="end">'+v+'</text>';
  let path='',segs=[],cur=[];F.forEach((x,k)=>{if(x.v){cur.push([xs(k),y(x.v)]);}else if(cur.length){segs.push(cur);cur=[];}});if(cur.length)segs.push(cur);
  for(const sg of segs){path+='<polyline class="fl" points="'+sg.map(q=>q.join(",")).join(" ")+'"/>';if(sg.length>1)path+='<polygon class="fa" points="'+sg[0][0]+','+(H-B)+' '+sg.map(q=>q.join(",")).join(" ")+' '+sg[sg.length-1][0]+','+(H-B)+'"/>';}
  let dots='',labs='';F.forEach((x,k)=>{const X=xs(k);
    if(x.v)dots+='<circle cx="'+X+'" cy="'+y(x.v)+'" r="'+(k===n-1?4:2.6)+'" class="'+(x.v>=7.5?'fd hi':x.v<6?'fd lo':'fd')+'"><title>'+x.m+' '+x.y+': '+f1(x.v)+' ('+x.n+' maç)</title></circle>';
    else if(x.inj)dots+='<text x="'+X+'" y="'+(H-B-3)+'" class="fx" text-anchor="middle">✚<title>'+x.m+' '+x.y+': sakat</title></text>';
    else dots+='<circle cx="'+X+'" cy="'+(H-B-4)+'" r="1.6" class="fb"><title>'+x.m+' '+x.y+': oynamadı</title></circle>';
    if(k%3===0||k===n-1)labs+='<text x="'+X+'" y="'+(H-5)+'" class="ft" text-anchor="middle">'+x.m+'</text>';});
  const pl=F.filter(x=>x.v),last=pl[pl.length-1],prev=pl.slice(-6,-3),rec=pl.slice(-3);
  const avg=a=>a.reduce((s,x)=>s+x.v,0)/a.length,tr=prev.length&&rec.length?avg(rec)-avg(prev):0;
  const lab=last.v>=8?"Harika":last.v>=7.2?"İyi":last.v>=6.4?"Orta":"Kötü";
  return '<div class="fhead"><b class="'+(last.v>=7.5?'hi':last.v<6?'lo':'')+'">'+f1(last.v)+'</b><span>'+lab+' · '+last.m+' '+last.y+'</span><span class="tr '+(tr>.15?'up':tr<-.15?'down':'')+'">'+(tr>.15?'▲ yükselişte':tr<-.15?'▼ düşüşte':'■ dengeli')+'</span></div>'+
    '<svg viewBox="0 0 '+W+' '+H+'" class="fsvg" role="img" aria-label="Son '+n+' ayın maç puanı ortalaması">'+g+path+dots+labs+'</svg>'+
    '<div class="fleg"><span><i class="hi"></i>7,5+</span><span><i class="lo"></i>6 altı</span><span>✚ sakat</span><span><i class="fbk"></i>oynamadı</span></div>';
}
function monthTick(i){
  const p=P;const semt=p.fam.semt.split(", ").pop();
  injuryRoll(p,i);
  if(!p.pending&&!p.ended&&p.age>=8&&p.injKind!=="ban"&&R()<.08)randomEvent(p,true);
  const nf=mfix[i]||0,a0=mapps[i]||0;let g=mgoals[i]||0,as=mast[i]||0;
  const missF=p.injM>0?Math.min(1,p.injM):0,miss=Math.min(nf,Math.ceil(nf*missF-.01));
  const a=Math.min(a0,nf-miss);
  if(missF>0){minj.add(i);p.injOut=(p.injOut||0)+missF;}
  if(a<a0&&p.ls){const g2=a0?Math.round(g*a/a0):0,as2=a0?Math.round(as*a/a0):0,ls=p.ls;
    ls.apps-=a0-a;ls.gl-=g-g2;ls.as=(ls.as||0)-(as-as2);
    if(ls.youth){p.yApps-=a0-a;p.yGoals-=g-g2;}else{p.apps-=a0-a;p.goals-=g-g2;p.assists-=as-as2;}
    g=g2;as=as2;mapps[i]=a;mgoals[i]=g;mast[i]=as;}
  if(p.cur){p.cur.apps+=a;p.cur.gl+=g;p.cur.as+=as;}
  let t="",list=[];
  if(p.level===0||!p.ls){
    t=pick(["Okul bahçesinde maç: "+ri(4,9)+"-"+ri(1,6)+". "+(ri(0,3)?ri(1,3)+" gol attın.":"Gol yok ama çok koştun."),
      cap(semt)+" sokaklarında hava kararana kadar top oynadın.","Yağmur yağdı, yine de sahadaydın.",
      "Mahalle turnuvası: "+pick(["finalde kaybettiniz.","şampiyon oldunuz!","yarı finalde elendiniz."]),
      p.fam.dadfoot?"Babanla parkta şut çalıştın.":"Televizyonda derbi izledin, hayallere daldın.","Duvara karşı sol ayak çalıştın.",
      p.fam.cls===0?"Babana işte yardım ettin, akşam top oynamaya yetiştin.":"Annen seni parktaki maça götürdü."]);
  }else if(!nf){
    t=p.level===1?(i===0?"Okullar henüz açılmadı, yaz tatili.":"Sömestr tatili, okul takımının maçı yok."):"Maç yok.";
  }else{
    // oynanan maçları fikstürün içine yerleştir
    const idx=[...Array(nf).keys()].slice(miss).sort(()=>R()-.5).slice(0,a);const played=new Set(idx);
    const gIn=Array(nf).fill(0),aIn=Array(nf).fill(0);
    const pl=[...played];for(let k=0;k<g;k++)gIn[pick(pl)]++;for(let k=0;k<as;k++)aIn[pick(pl)]++;
    const T=p.tbl;let W=0,D=0,L=0;
    for(let m=0;m<nf;m++){
      const home=R()<.5,on=played.has(m),inj=m<miss;
      const mine=gIn[m]+aIn[m];
      let us=Math.max(mine,Math.round(Math.max(0,gauss(1.35+T.str,1.1)))),them=Math.round(Math.max(0,gauss(1.25-T.str,1)));
      if(us>6)us=6;if(them>5)them=5;
      const r=us>them?"G":us===them?"B":"M";r==="G"?(T.w++,W++):r==="B"?(T.d++,D++):(T.l++,L++);
      let who;
      if(on){
        const st=p.ls.start||p.level<=2&&R()<.7;
        const min=st?(R()<.75?90:ri(60,85)):ri(55,85);
        var rt=rating(p,gIn[m],aIn[m],r,!st);
        who=(st?(min===90?"90 dk":"ilk 11, "+min+". dk çıktın"):min+". dk oyuna girdin")+(gIn[m]?" · "+gIn[m]+" gol":"")+(aIn[m]?" · "+aIn[m]+" asist":"")+" · puan "+f1(rt);
      }else who=inj?(p.injKind==="ban"?"cezalısın, oynamadın":"sakatsın ("+p.injName.toLowerCase()+"), oynamadın"):p.level<=2?"bu maçta oynamadın":pick(["yedek kulübesinde kaldın","kadroya alınmadın","kulübede bekledin, süre almadın"]);
      let on2=oppName(p),tt=0;while(list.some(x=>x.o.replace(" (dep.)","")===on2)&&tt++<10)on2=oppName(p);
      list.push({r,sc:us+"-"+them,o:on2+(home?"":" (dep.)"),who,on,rt:on?rt:0});
    }
    const cm=contMatches(p,i,missF<.5);list=list.concat(cm);
    const rk=rank(p);
    t=(a?a+" maç oynadın":"Hiç oynamadın")+(g?", "+g+" gol":"")+(as?", "+as+" asist":"")+". Takım "+nf+" maçta "+W+"G "+D+"B "+L+"M"+(rk?", ligde "+rk+". sırada":"")+".";
    if(cm.length)t+=" "+p.cont.comp+": "+cm.length+" maç."+(cm.msg?" "+cm.msg:"");
    if(missF>0)t+=" "+(p.injKind==="ban"?(miss>=nf?"Bütün ay cezalısın":"Ayın bir kısmında cezalısın"):(miss>=nf?"Bütün ay sakatsın":"Ayın bir kısmında sakatsın"))+" ("+p.injName.toLowerCase()+")"+(p.injM>1?", dönüşe "+fmtM(p.injM-1)+".":".");
    const fl=p.level===1?["Beden öğretmeni seni kaptan yaptı.","Ailen maçı izlemeye geldi.","Okulda herkes golünü konuşuyor.",""]:
      p.level===2?["Altyapı hocası seni kenara çağırıp tebrik etti.","Kulübün gözlemcileri tribündeydi.","Hafta sonu eve, "+semt+" semtine gittin.","",(p.age>=16&&eff(p)>=T[4]-2&&R()<.35)?"A takım hocası bir antrenmana seni de çağırdı.":""]:
      p.level===3?["Hafta içi işten sonra antrenmana yetiştin.","Tribünde 200 kişi vardı.",(TRK(p)?"Maç sonrası takımla çay ocağında oturdunuz.":"Maç sonrası takımla kulüp lokalinde oturdunuz."),""]:
      ["Taraftar adını bağırdı.","Hoca basın toplantısında seni övdü.","Bir maçta sarı kart gördün.","",""];
    const f=a>0||p.level<=2&&!missF?pick(fl):"";if(f)t+=" "+f;
  }
  if(missF>0&&!/sakatsın|cezalısın/.test(t))t+=" "+(p.injKind==="ban"?"Cezan sürüyor":"Sakatlığın sürüyor")+" ("+p.injName.toLowerCase()+").";
  if(p.injM>0){p.injM=Math.max(0,p.injM-1-comfort(p)*.05);if(p.injM<=0&&!p.pending){log(p,p.injName+" geride kaldı. Sahalara döndün!","good");p.injName="";p.injKind="";}}
  if(p.ls&&p.level>=1){const rts=list.filter(x=>x.rt).map(x=>x.rt);
    if(rts.length)p.form.push({m:MONTHS[i],y:seasonLbl(p),v:rts.reduce((a,b)=>a+b,0)/rts.length,n:rts.length});
    else if(missF>0)p.form.push({m:MONTHS[i],y:seasonLbl(p),inj:1});
    else if(nf)p.form.push({m:MONTHS[i],y:seasonLbl(p)});
    if(p.form.length>40)p.form.shift();}
  mlog.unshift({m:MONTHS[i],t,list});
  if(i===9&&p.ls){seasonEnd(p);
    render();}
}
function careerTable(p,live){
  const rows=[];
  if(live&&p.ls&&p.cur)rows.push('<tr class="now"><td>'+seasonLbl(p)+'</td><td>'+esc(p.club&&p.level>=2?p.club.name:p.ls.club)+'</td><td>'+esc(leagueOf(p))+'</td><td>'+p.cur.apps+'</td><td>'+p.cur.gl+'</td><td>'+p.cur.as+'</td></tr>');
  p.hist.slice().reverse().filter(h=>live||h.lg!=="Okullar arası lig").forEach(h=>rows.push('<tr class="'+(h.cup?'cup ':'')+(h.youth?'y':'')+'"><td>'+h.y+'</td><td>'+esc(h.team)+'</td><td>'+esc(h.lg)+'</td><td>'+h.apps+'</td><td>'+h.gl+'</td><td>'+h.as+'</td></tr>'));
  if(!rows.length)return '<p class="tblempty">Bir takıma girdiğinde maç, gol ve asist sayıların burada sezon sezon birikecek.</p>';
  const sen=p.hist.filter(h=>!h.youth&&!h.cup);
  const tot=sen.length?'<tr class="tot"><td colspan="3">Lig toplamı</td><td>'+p.apps+'</td><td>'+p.goals+'</td><td>'+p.assists+'</td></tr>'+(p.cApps?'<tr class="tot"><td colspan="3">Kupalar ve milli takım</td><td>'+p.cApps+'</td><td>'+p.cGoals+'</td><td>'+p.cAs+'</td></tr>':''):'';
  return '<div class="tbl"><table><thead><tr><th>Sezon</th><th>Takım</th><th>Lig</th><th>M</th><th>G</th><th>A</th></tr></thead><tbody>'+rows.join("")+tot+'</tbody></table></div>';
}
function renderTicker(d){
  const y=2026+Math.max(0,P.age-8);
  $("sTitle").textContent=y+"/"+String((y+1)%100).padStart(2,"0")+" sezonu";
  const cur=month-1;
  $("sMonth").textContent=month===0?(mlog.length?"Yaz arası":"Sezon başlıyor"):MONTHF[cur];
  $("sBar").innerHTML=MONTHS.map((m,i)=>(month===0&&mlog.length)||i<cur?'<i class="done"></i>':i===cur?'<i><b style="--d:'+Math.round(d)+'ms"></b></i>':'<i></i>').join("");
  $("sTable").innerHTML=careerTable(P,true);
  $("sTicks").innerHTML=mlog.length?mlog.map(x=>'<li><span>'+x.m+'</span><div><span>'+esc(x.t)+'</span>'+(x.list&&x.list.length?'<ul class="mx">'+x.list.map(m=>'<li class="'+(m.on?'':'off ')+(m.cup?'cupm':'')+'"><b class="r '+m.r+'">'+m.r+'</b><span class="sc">'+m.sc+'</span><span class="op">'+esc(m.o)+'</span><span class="wh">'+esc(m.who)+'</span></li>').join("")+'</ul>':'')+'</div></li>').join(""):'<li class="empty">Sezon başladığında maçlar ay ay burada görünecek.</li>';
}
function showDecision(){
  clearTimeout(timer);waiting=true;$("game").classList.add("is-paused");
  const d=P.pending;
  $("decision").innerHTML='<div class="decide"><div class="eyebrow">Karar anı · '+P.age+' yaş</div><h3>'+esc(d.title)+'</h3><p>'+esc(d.text)+'</p><div class="choices">'+
    d.choices.map((c,i)=>'<button type="button" data-i="'+i+'">'+esc(c.t)+'<small>'+esc(c.s)+'</small></button>').join("")+'</div></div>';
  $("decision").querySelectorAll("button").forEach(b=>b.onclick=()=>{resolve(P,+b.dataset.i);waiting=false;$("decision").innerHTML="";render();if(P.ended)return finish();if(P.pending){if(auto)return autoResolve();return showDecision();}schedule();});
  $("decision").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function showReflect(age){
  waiting=true;$("game").classList.add("is-paused");
  $("decision").innerHTML='<div class="decide"><div class="eyebrow">Düdük · zaman durdu</div><h3>'+esc(REFLECT[age])+'</h3><textarea id="refl" placeholder="İstersen bir satır yaz. Sonda karşına çıkacak."></textarea><div class="choices"><button type="button" id="reflGo">Devam et</button></div></div>';
  $("reflGo").onclick=()=>{const v=$("refl").value.trim();if(v)P.notes.push({age,q:REFLECT[age],a:v});waiting=false;$("decision").innerHTML="";schedule();};
}


function cabinet(p){
  const grp=(arr)=>{const m=new Map();arr.forEach(x=>{const k=x.n;if(!m.has(k))m.set(k,[]);m.get(k).push(x.y);});return [...m.entries()];};
  const cups=grp(p.cups),aw=grp(p.awards.filter(a=>!a.minor));
  const GOLD=/Ballon d'Or$|FIFA The Best|Dünya Kupası$|Şampiyonlar Ligi$|Altın Ayakkabı|Avrupa Şampiyonası$/;
  const li=(n,ys,cls)=>'<li class="'+cls+(GOLD.test(n)?' gold':'')+'"><i>'+ys.length+'</i><span>'+esc(n)+'</span><span>'+ys.slice(-3).join(", ")+(ys.length>3?"…":"")+'</span></li>';
  return '<div><div class="ct">Takım kupaları · '+p.cups.length+'</div>'+(cups.length?'<ul>'+cups.map(([n,ys])=>li(n,ys,"")).join("")+'</ul>':'<p>Henüz kupa yok. Lig şampiyonlukları, kupalar, kıta turnuvaları ve milli takım zaferleri burada birikir.</p>')+'</div>'+
    '<div><div class="ct">Bireysel ödüller · '+aw.reduce((s,x)=>s+x[1].length,0)+'</div>'+(aw.length?'<ul>'+aw.map(([n,ys])=>li(n,ys,"aw")).join("")+'</ul>':'<p>Gol krallığı, sezonun oyuncusu, Golden Boy, Altın Ayakkabı, Ballon d\'Or…</p>')+'</div>';
}
function render(){
  $("pName").textContent=P.name;
  $("pMeta").textContent=place(P)+" · "+P.pos+(P.club&&P.level>=2?" · "+P.club.name:"");
  const F=P.fam;
  $("fam").innerHTML=[["Semt",F.semt],["Durum",CLS[F.cls]],["Baba",cap(F.dad)+(F.dadfoot?", eski amatör futbolcu":"")],["Anne",cap(F.mom)],["Kardeş",F.sib?F.sib+" kardeş":"Tek çocuk"]]
    .map(r=>'<div><span>'+r[0]+'</span><span>'+esc(r[1])+'</span></div>').join("")+
    '<div class="ownfam"><div class="t">Kendi ailen</div>'+
    '<div><span>'+(P.married?"Eşin":"Partner")+'</span><span>'+(P.partner?esc(P.partner.name)+", "+esc(P.partner.job):"Yok")+'</span></div>'+
    '<div><span>Çocuklar</span><span>'+(P.kids.length?esc(P.kids.map(k=>k.n+" ("+(P.age-k.b)+")").join(", ")):"Yok")+(P.babyDue?" · bebek yolda":"")+'</span></div>'+
    '<div class="btns" style="justify-content:flex-start">'+
      (!P.partner?'<button type="button" class="mini" id="fMeet"'+(P.age<18||P.metAt===P.age?" disabled":"")+'>'+(P.age<18?"18 yaşında açılır":P.metAt===P.age?"Bu yıl denedin":"Biriyle tanış")+'</button>':'')+
      (P.partner&&!P.married?'<button type="button" class="mini" id="fProp"'+(P.age<20?" disabled":"")+'>Evlenme teklif et</button><button type="button" class="mini" id="fBreak">Ayrıl</button>':'')+
      (P.married?'<button type="button" class="mini" id="fBaby"'+(P.babyDue||P.kids.length>=4?" disabled":"")+'>Çocuk sahibi ol</button>':'')+
    '</div></div>';
  [["fMeet",meet],["fProp",propose],["fBreak",breakup],["fBaby",baby]].forEach(([id,fn])=>{const b=document.getElementById(id);if(b)b.onclick=fn;});
  const invT=P.inv.dep+P.inv.stock+P.inv.crypto+P.inv.re;
  $("wallet").innerHTML='<div><b>'+fmtE(Math.round(P.money))+'</b><span>Birikim</span></div><div><b>'+fmtE(Math.round(invT+homeV(P)))+'</b><span>Yatırım ve emlak</span></div><div><b>'+fmtE(Math.round(P.spent))+'</b><span>Harcanan</span></div>';
  $("inv").innerHTML='<details class="grp" data-k="inv"'+op("inv")+'><summary>Yatırım araçları<small>'+fmtE(Math.round(invT))+'</small></summary>'+INV.map(([k,t,d])=>{const r=P.ret[k],v=P.inv[k];
    return '<div class="r"><div>'+t+'<small>'+d+'</small></div><div class="v">'+fmtE(Math.round(v))+(v>0&&r!==undefined?'<span class="ret '+(r>=0?"up":"down")+'">'+(r>=0?"+":"")+Math.round(r*100)+'% geçen yıl</span>':'')+'</div>'+
      '<button type="button" class="mini" data-in="'+k+'"'+(P.money<100?" disabled":"")+'>Yatır</button><button type="button" class="mini" data-out="'+k+'"'+(v<1?" disabled":"")+'>Sat</button></div>';}).join("")+
    '<p style="margin:8px 0 0;font-size:12px;color:var(--muted)">Yatır, birikiminin dörtte birini aktarır. Getiriler her sezon sonunda hesaplanır.</p></details>';
  $("inv").querySelectorAll("[data-in]").forEach(b=>b.onclick=()=>moveIn(b.dataset.in));
  $("inv").querySelectorAll("[data-out]").forEach(b=>b.onclick=()=>moveOut(b.dataset.out));
  $("shop").innerHTML=(P.level<3&&P.money<1000?'<p>İlk maaşını aldığında burası açılacak. Şimdilik harçlığın sadece '+(P.c[0]==="TR"?"simit parası":"cep harçlığı")+'.</p>':'')+
    CATS.map(([cat,ids])=>{const items=ids.map(id=>SHOP.find(x=>x.id===id));const own=items.filter(it=>P.owned[it.id]).length;
      return '<details class="grp" data-k="c-'+cat+'"'+op("c-"+cat)+'><summary>'+cat+'<small>'+own+'/'+items.length+' alındı</small></summary><div class="shop">'+
      items.map(it=>{const o=P.owned[it.id];return '<button type="button" class="item'+(o?" own":"")+'" data-buy="'+it.id+'"'+(o||P.money<it.p?" disabled":"")+'><b>'+esc(it.t)+'</b><span>'+(o?"Senin":fmtE(it.p))+'</span>'+(it.inc?'<small>Gelir getirir'+(it.risk?", riskli":"")+'</small>':'')+'</button>';}).join("")+'</div></details>';}).join("");
  const hv=homeV(P);
  const cf=comfort(P),cx=comfFx(cf);
  $("homes").innerHTML='<div class="rest'+(cf?' on':'')+'"><b>Dinlenme +'+String(cf).replace(".",",")+'</b><span>'+(cf?'Fizik +'+String(cx.fit).replace(".",",")+'/sezon · sakatlık riski −%'+cx.inj+' · iyileşme %'+cx.rec+' daha hızlı':'Kendi evinde oturmak dinlenmeyi artırır: fizik yükselir, sakatlık riski düşer, sakatlıktan daha hızlı dönersin.')+'</span></div>'+
    '<div class="hsum">'+(P.homes.length?P.homes.length+" mülk · değeri "+fmtE(Math.round(hv))+" · geçen yıl kira "+fmtE(Math.round(P.rentY)):"Henüz mülkün yok. Aldığın evi kiraya verebilir, içinde oturabilir ya da satabilirsin.")+'</div>'+
    P.homes.map((h,i)=>'<div class="hr"><div>'+esc(h.t)+' · '+esc(h.w)+'<small>'+fmtE(Math.round(h.val))+' · kira getirisi yılda ~%'+(h.y*100).toFixed(1).replace(".",",")+(COMF[h.t]?' · dinlenme +'+(h.state==="live"?COMF[h.t]:h.state==="empty"?String(COMF[h.t]/2).replace(".",",")+' (yazlık)':'0 (kirada)'):'')+'</small><span class="st '+h.state+'">'+ST[h.state]+'</span></div><div class="btns">'+
      (h.state==="rent"?'<button type="button" class="mini" data-h="'+i+'" data-a="stop">Kiradan çek</button>':'<button type="button" class="mini" data-h="'+i+'" data-a="rent">Kiraya ver</button>')+
      (h.state!=="live"?'<button type="button" class="mini" data-h="'+i+'" data-a="live">Taşın</button>':'')+
      '<button type="button" class="mini" data-h="'+i+'" data-a="sell">Sat</button></div></div>').join("")+
    '<details class="grp" data-k="buyhome"'+op("buyhome")+' style="border-top:1px solid var(--rule)"><summary>Satılık mülkler<small>'+HOMES.length+' ilan</small></summary><div class="shop">'+
    HOMES.map(h=>'<button type="button" class="item" data-home="'+h.id+'"'+(P.money<h.p?" disabled":"")+'><b>'+esc(h.t)+' · '+esc(homeWhere(P,h))+'</b><span>'+fmtE(h.p)+'</span><small>Kira ~%'+(h.y*100).toFixed(1).replace(".",",")+'/yıl'+(COMF[h.t]?' · oturursan dinlenme +'+COMF[h.t]:'')+'</small></button>').join("")+'</div></details>';
  $("homes").querySelectorAll("[data-home]").forEach(b=>b.onclick=()=>buyHome(b.dataset.home));
  $("homes").querySelectorAll("[data-h]").forEach(b=>b.onclick=()=>homeAct(+b.dataset.h,b.dataset.a));
  $("shop").querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>buy(b.dataset.buy));
  $("mag").innerHTML=P.mag.length?P.mag.slice().reverse().map(m=>'<li>'+esc(m.h)+'<small>'+m.age+' yaşında</small></li>').join(""):'<li class="empty">Henüz kimse seni tanımıyor. Ünün arttıkça manşetler burada.</li>';
  $("pAge").textContent=P.age;
  $("cab").innerHTML=cabinet(P);
  $("formBox").innerHTML=formSvg(P);
  const kid=P.age<18&&P.level<4,nS=slots(P);
  P.focus=P.focus.filter(k=>FOC[k]&&(kid?FOC[k].kid:FOC[k].pro)).slice(0,nS);if(!P.focus.length)P.focus=["train"];
  $("focusN").textContent=P.focus.length+" / "+nS+" seçili";
  $("focus").innerHTML=Object.entries(FOC).filter(([k,v])=>kid?v.kid:v.pro).map(([k,v])=>'<button type="button" data-k="'+k+'" aria-pressed="'+P.focus.includes(k)+'">'+v.t+'<small>'+fdesc(v)+'</small></button>').join("");
  $("focus").querySelectorAll("button").forEach(b=>b.onclick=()=>{const k=b.dataset.k,i=P.focus.indexOf(k);if(i>=0){if(P.focus.length>1)P.focus.splice(i,1);}else{P.focus.push(k);if(P.focus.length>nS)P.focus.shift();}render();});
  const mM=mMod(P),mB=bMod(P),m=mM+mB,pr=potRange(P);
  const tag=v=>v?'<em class="mod '+(v>0?"up":"down")+'">'+(v>0?"+":"−")+Math.abs(v)+'</em>':'';
  const st=[["Beceri",eff(P),"skill",m],["Fizik",effFit(P),"",m],["Moral",P.moral,"",0],["Hoca bağı",P.bond,"bond",0],["Ün",P.fame,"",0],["Eğitim",P.edu,"",0]];
  $("stats").innerHTML=st.map(s=>'<div class="stat '+s[2]+'"><span>'+s[0]+tag(s[3])+'</span><span class="num">'+Math.round(s[1])+'</span><div class="bar"><i style="width:'+clamp(s[1],0,100)+'%"></i></div></div>').join("")+
    (P.injM>0?'<div class="injline">'+(P.injKind==="ban"?"Cezalı: ":"Sakat: ")+esc(P.injName)+' · dönüşe '+fmtM(P.injM)+'</div>':P.relapse?'<div class="injline warn">Riskli dönüş: '+esc(P.relapse.name)+' nüksedebilir</div>':'')+
    '<div class="modline"><span class="'+(mM>0?"up":mM<0?"down":"")+'">'+(mM>0?"Moral yüksek: beceri ve fizik +5":mM<0?"Moral düşük: beceri ve fizik −5":"Moral normal: etkisi yok")+'</span><span class="'+(mB>0?"up":mB<0?"down":"")+'">'+(mB>0?"Hocayla aran iyi: +5":mB<0?"Hocayla aran kötü: −5":"Hoca bağı normal: etkisi yok")+'</span></div>'+
    '<div class="money"><span>Maaş <b class="num">'+(salary(P)?fmtE(salary(P))+"/yıl":"—")+'</b></span><span>Birikim <b class="num">'+fmtE(Math.round(P.money))+'</b></span></div>';
  $("ladder").innerHTML=LV.map((l,i)=>i).reverse().map(i=>{
    const here=peers.filter(q=>!q.ended&&q.level===i).length;
    return '<div class="rung'+(P.level===i&&!P.ended?" on":"")+'"><span class="n">'+(i+1)+'</span><span>'+LV[i]+(P.level===i?" · sen":"")+'</span><span class="dots">'+"<i></i>".repeat(here)+'</span></div>';}).join("");
  $("peers").innerHTML=peers.map(q=>'<div class="peer'+(q.ended?" done":"")+'"><span class="tag">'+q.c[0]+'</span><b>'+esc(q.name)+' · '+q.pos+'</b><span>'+esc(statusOf(q))+'</span></div>').join("");
  $("feed").innerHTML=P.log.slice().reverse().map(e=>'<li class="'+e.kind+'"><span class="a">'+e.age+'</span><span>'+esc(e.text)+'</span></li>').join("");
}

function verdict(p){
  if(p.endKind==="quit")return ["Milyonlarcası gibi","<em>sahadan</em> ayrıldın"];
  if(p.endKind==="amat")return ["Hiç para kazanmadan","<em>sevdiğin</em> için oynadın"];
  if(p.awards.some(a=>a.n==="Ballon d'Or"))return ["Dünyanın","<em>en iyisi</em> oldun"];
  if(p.peakLevel>=7)return ["Milyonda","<em>bir</em> oldun"];
  if(p.peakLevel>=6)return ["Büyük sahnede","<em>oynadın</em>"];
  if(p.peakLevel>=5)return ["Üst ligde","<em>forma</em> giydin"];
  return ["Profesyonel","<em>futbolcu</em> oldun"];
}
function finish(){
  clearTimeout(timer);
  if(P.ls&&!P.ls.youth&&!P.hist.some(h=>h.y===seasonLbl(P)&&!h.cup&&h.team===P.ls.club)){P.apps-=P.ls.apps;P.goals-=P.ls.gl;P.assists-=P.ls.as||0;P.ls=null;}
  while(peers.some(q=>!q.ended))peers.forEach(peerSeason);
  const v=verdict(P);
  $("end").innerHTML='<div class="endcard"><div class="eyebrow">'+esc(P.name)+' · '+P.c[1]+' · '+P.pos+' · '+P.age+' yaşında bitti</div>'+
   '<div class="verdict">'+v[0]+'<br>'+v[1]+'</div><p>'+esc(P.endTitle+". "+P.endText+(P.coach?" Antrenörlük lisansın var, futbola kenardan devam edeceksin.":"")+(P.pundit?" Artık televizyonda maç yorumluyorsun.":"")+(P.school?" Kendi futbol okulunda çocuk yetiştiriyorsun.":"")+(P.natC?" Milli kariyerini "+P.natC[1]+" formasıyla yaptın.":""))+' Ulaştığın en yüksek basamak: <b>'+LV[P.peakLevel]+'</b>. Doğuştan gizli potansiyelin <b class="num">'+potRange({pot:P.pot0??P.pot}).join('–')+'</b> aralığındaydı (tam olarak <b class="num">'+Math.round(P.pot0??P.pot)+'</b>)'+(Math.round(P.pot)<Math.round(P.pot0??P.pot)?'; sakatlıklar ve kararlar onu <b class="num">'+Math.round(P.pot)+'</b>\'e düşürdü':'')+'.</p>'+
   (()=>{const pk=Math.round(P.peakSkill||Math.min(P.skill,P.pot)),pt=Math.round(P.pot0??P.pot),pc=Math.min(100,Math.round(pk/pt*100));
     const msg=pc>=97?"Tavanına dokundun. Yeteneğinin hepsini sahaya koydun.":pc>=90?"Tavanına çok yaklaştın.":pc>=80?"Yeteneğinin büyük kısmını kullandın ama biraz daha vardı.":pc>=65?"Potansiyelinin epey altında kaldın.":"Yeteneğinin çoğu hiç ortaya çıkmadı.";
     return '<div class="potbox"><div class="potrow"><span>Ulaştığın en yüksek beceri</span><b class="num">'+pk+' / '+pt+'</b></div>'+
       '<div class="potbar"><i style="width:'+pk+'%"></i><s style="left:'+pt+'%"></s></div>'+
       '<p><b>Potansiyelinin %'+pc+'\'ine ulaştın.</b> '+msg+(P.peakSkill?'':' Kariyerin 20 yaşından önce bittiği için tavanını hiç göremedin.')+'</p></div>';})()+
   '<div class="totals"><div><b>'+P.apps+'</b><span>Maç</span></div><div><b>'+P.goals+'</b><span>Gol</span></div><div><b>'+P.assists+'</b><span>Asist</span></div><div><b>'+P.caps+'</b><span>Milli maç</span></div><div><b>'+P.awards.filter(a=>!a.minor).length+'</b><span>Bireysel ödül</span></div><div><b>'+P.trophies+'</b><span>Kupa</span></div><div><b>'+(P.peakSal?fmtE(P.peakSal):"—")+'</b><span>En yüksek maaş</span></div><div><b>'+fmtE(Math.round(P.earn))+'</b><span>Toplam kazanç</span></div><div><b>'+fmtE(Math.round(wealth(P)))+'</b><span>Son servet</span></div><div><b>'+fmtE(Math.round(P.spent))+'</b><span>Harcanan</span></div><div><b>'+P.mag.length+'</b><span>Manşet</span></div></div>'+
   (P.mag.length?'<p style="margin-top:14px;font-size:14px">En akılda kalan manşet: <em style="color:var(--mag)">'+esc(pick(P.mag).h)+'</em></p>':'')+
   '<p style="margin-top:6px;font-size:14px">'+(P.married?esc(P.partner.name)+' ile evlendin. ':P.partner?esc(P.partner.name)+' ile birliktesin. ':'Evlenmedin. ')+(P.kids.length?P.kids.length+' çocuğun var: '+esc(P.kids.map(k=>k.n).join(", "))+'. ':'')+(P.homes.length?P.homes.length+' mülkün var, toplam değeri '+fmtE(Math.round(homeV(P)))+'.':'')+'</p>'+
   '<p style="margin-top:14px;font-size:14px">Nereden geldin: '+esc(place(P))+'. Baban '+esc(P.fam.dad)+', annen '+esc(P.fam.mom)+'. '+esc(CLS[P.fam.cls])+' bir ev.</p>'+
   '<div class="cab" style="margin-top:16px">'+cabinet(P)+'</div>'+
   '<div style="margin-top:14px">'+careerTable(P,false)+'</div>'+(P.clubs.length?'<p style="margin-top:6px;font-size:14px">Kulüpler: '+esc([...new Set(P.clubs)].join(" → "))+'</p>':'')+
   (P.notes.length?'<div class="notes">'+P.notes.map(n=>'<blockquote>'+esc(n.a)+'<small>'+n.age+' yaşında yazdın</small></blockquote>').join("")+'</div>':'')+
   '</div>'+
   '<div class="panel" style="margin-top:16px"><h3>Aynı gün başlayanlar</h3>'+peers.map(q=>'<div class="peer done"><span class="tag">'+q.c[0]+'</span><b>'+esc(q.name)+' · '+esc(place(q))+'</b><span>Babası '+esc(q.fam.dad)+' · '+esc(q.endTitle)+' · zirve: '+LV[q.peakLevel]+(q.caps?' · '+q.caps+' milli maç':'')+'</span></div>').join("")+'</div>'+
   '<div class="row"><button class="go" type="button" id="again">Yeniden doğ</button><button class="ghost" type="button" id="home">Ana sayfa</button></div>'+
   '<p class="fine">Bu bir simülasyon. Olasılıklar kabaca tahmin edilmiştir; gerçek bir kişinin kariyerini anlatmaz.</p>';
  $("game").hidden=true;$("end").hidden=false;window.scrollTo(0,0);
  save();
  $("again").onclick=()=>$("btnStart").click();
  $("home").onclick=()=>{$("end").hidden=true;$("start").hidden=false;loadPast();window.scrollTo(0,0);};
}
function save(){try{const k="mb-careers";const a=JSON.parse(localStorage.getItem(k)||"[]");a.unshift({n:P.name,c:P.c[1],l:LV[P.peakLevel],g:P.goals,a:P.age,t:P.endTitle});localStorage.setItem(k,JSON.stringify(a.slice(0,12)));}catch(e){}}
function loadPast(){try{const a=JSON.parse(localStorage.getItem("mb-careers")||"[]");if(!a.length)return;$("past").hidden=false;
  $("pastList").innerHTML=a.map(x=>'<li><span>'+esc(x.n)+' · '+esc(x.c)+' · '+esc(x.t)+'</span><span class="num">'+esc(x.l)+'</span></li>').join("");}catch(e){}}
loadPast();
})();
