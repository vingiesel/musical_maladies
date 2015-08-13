import Question from 'app/questions';

var Diagnosis = [
	{
		name : 'This is an Example Diagnostic',
		desc : 'Right now, it is triggered by the first answer being answered. Diagnosis are checked against all current answers and show up in this list when custom criteria are met',
		link : '//www.google.com',
		check : function (q){
			if (q.G1){
				return true;
			}
			return false;
		},
	},
	{
		custom : function (q){
			if (q.G2){
				return {
					name: q.G2 + " Player's Syndrome",
					desc: "Diagnosis can also vary depending on custom logic. This allows a diagnosis to vary depending on certain answers. Example: you are a " + q.G1 + " year old " + q.G2 + " player.",
					link : '//www.google.com'
				}
			}
			return false;
		},
	},

	{
		name : "Hah, no you're not!",
		desc : 'Nice try.',
		link : '//www.google.com',
		check : function (q){
			if (q.G3 === 'Female'){
				return true;
			}
			return false;
		},
	},

	{
		name : "See the thing up near the top?",
		desc : 'Opening the history menu and selecting a question will take you back to that question. Go ahead, change some answers around.',
		link : '//www.google.com',
		check : function (q){
			if (q.G3 === 'Male'){
				return true;
			}
			return false;
		},
	},

	{
		name : 'I Dunno',
		desc : 'Bacon ipsum dolor amet frankfurter prosciutto t&ndashbone biltong spare ribs, picanha sausage tri&ndashtip. Jowl jerky turducken bacon drumstick ham hock porchetta, tongue chuck. Sirloin pork chop ground round frankfurter, cow biltong cupim ball tip salami sausage tri&ndashtip picanha. Picanha bresaola ham hock short ribs alcatra beef, swine porchetta ribeye pork chop tri&ndashtip brisket pork belly. Kielbasa short ribs tail ham hock strip steak ribeye. Sirloin pancetta corned beef tongue bacon spare ribs.',
		link : '//www.google.com',
		check : function (q){
			if (typeof(q.G4) !== 'undefined'){
				return true;
			}
			return false;
		},
	},

	// {
	// 	// NIHL
	// 	// If H3 and H4 = Yes
	// 	// If Instrument = Percussion, age <50 and (2+) of H6-12 = Yes
	// 	// If Instrument = Brass, age <50 and (3+) of H6-12 = Yes
	// 	// If Instrument = Keyboard, age <50 and (4+) of H6-12 = Yes
	// 	// If Instrument = Woodwind, age <50 and (5+) of H6-12 = Yes
	// 	// If Instrument = String, age <50 and (6+) of H6-12 = Yes

	// 	// If only (1) of H3 and H4 = redirect to likely corresponding to instrument
	// 	// If less than the required threshold of (Yes) are met = redirect to a “unlikely but possible” page
	// 	// If thresholds are met but age >50 = redirect to a “NIHL but maybe Age” page

	// 	name: "NIHL",
	// 	desc: "Something about NIHL, or maybe age",
	// 	link : '//www.google.com',
	// 	custom : function (q){
	// 		console.log()
	// 		if (q.h3 && q.h4){
	// 			return true;
	// 		}

	// 		var h612 = 0;
	// 		for (var i=6; i <= 12;i++){
	// 			if (q["h"+i] === true){
	// 				h612 += 1;
	// 			}
	// 		}

	// 		if(Question.instrument_type.Percussion.indexOf(q.g2) !== -1 && q.g1 < 50){

	// 		}
	// 		return false;
	// 	},
	// }
]


export default Diagnosis;
