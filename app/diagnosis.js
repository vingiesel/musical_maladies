import Question from 'app/questions';

import _ from 'lodash';

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
		desc : 'Bacon ipsum dolor amet frankfurter prosciutto t-bone biltong spare ribs, picanha sausage tri-tip. Jowl jerky turducken bacon drumstick ham hock porchetta, tongue chuck. Sirloin pork chop ground round frankfurter, cow biltong cupim ball tip salami sausage tri-tip picanha. Picanha bresaola ham hock short ribs alcatra beef, swine porchetta ribeye pork chop tri-tip brisket pork belly. Kielbasa short ribs tail ham hock strip steak ribeye. Sirloin pancetta corned beef tongue bacon spare ribs.',
		link : '//www.google.com',
		check : function (q){
			if (typeof(q.G4) !== 'undefined'){
				return true;
			}
			return false;
		},
	},

	{
		name: 'NIHL',
		desc: 'NIHL',
		link : '//en.wikipedia.org/wiki/Noise-induced_hearing_loss',
		custom : function (q){
			var certain = 0;

			if (q.H3 && q.H4){
				certain = 2;
			}
			else if (q.H3 || q.H4) {
				certain = 1;
			}
			var h612 = 0;
			_.forEach(['H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12'], function (question){
				if (q[question] === true){
					h612 += 1;
				}
			});

			var meets_threshold = false;

			if (_.includes(Question.instrument_type.Percussion, q.G2)){
				if (h612 >= 2){
					meets_threshold = true;
				}
			} else if(_.includes(Question.instrument_type.Brass, q.G2)){
				if (h612 >= 3){
					meets_threshold = true;
				}
			} else if(_.includes(Question.instrument_type.Keyboard, q.G2)){
				if (h612 >= 4){
					meets_threshold = true;
				}
			} else if(_.includes(Question.instrument_type.Woodwind, q.G2)){
				if (h612 >= 5){
					meets_threshold = true;
				}
			} else if(_.includes(Question.instrument_type.Strings, q.G2)){
				if (h612 >= 6){
					meets_threshold = true;
				}
			}

			if (certain === 2){
				// General NIHL
				return {
					name: 'NIHL',
					desc: 'Noise-induced hearing loss (NIHL).',
					link : '//en.wikipedia.org/wiki/Noise-induced_hearing_loss',
				}
			} else if (certain == 1) {
				if (meets_threshold && q.G1 < 50){
					return {
						name: 'NIHL',
						desc: 'Noise-induced hearing loss (NIHL), possible caused by your instrument.',
						link : '//en.wikipedia.org/wiki/Noise-induced_hearing_loss',
					}
				}
				if(meets_threshold && q.G1 >= 50){
					return {
						name: 'NIHL',
						desc: 'Possibly Noise-induced hearing loss (NIHL), but also could be age.',
						link : '//en.wikipedia.org/wiki/Noise-induced_hearing_loss',
					}
				}
				return {
					name: 'NIHL',
					desc: 'Unlikely, but possibly Noise-induced hearing loss (NIHL)',
					link : '//en.wikipedia.org/wiki/Noise-induced_hearing_loss',
				}
			}

			return false;
		}
	},
	{
		name: 'Tinnitus',
		desc: 'Ringing or buzzing sound in ears.',
		link: '//en.wikipedia.org/wiki/Tinnitus',
		check: function (q){
			// If H5 = Yes and “Life-Altering”
			// If H5 = Yes and “Obtrusive” redirect to an “unlikely but possible” page
			if (q.H5 && q.H5_a === 'Life-altering'){
				return true;
			}else{
				return false;
			}
		}
	},
	{
		name: 'Tinnitus',
		desc: 'Unlikely, but possibly Tinnitus, which is characterized as ringing or buzzing sound in ears.',
		link: '//en.wikipedia.org/wiki/Tinnitus',
		check: function (q){
			// If H5 = Yes and “Life-Altering”
			// If H5 = Yes and “Obtrusive” redirect to an “unlikely but possible” page
			if (q.H5 && q.H5_a === 'Obtrusive'){
				return true;
			}else{
				return false;
			}

		}
	},
	// Hyperacusis (hurt 132)
	// If H1 = Yes
	{
		name: 'Hyperacusis',
		desc: 'Oversensitivity to certain frequencies or volumes.',
		link: '//en.wikipedia.org/wiki/Hyperacusis',
		check: function (q){
			return (q.H1 === true);
		}
	},
	// Recruitment
	// If H2 = Yes and “Always”
	// If H2 = Yes and (not “always”) = redirect to an “unlikely but possible” page
	{
		name: 'Recruitment',
		desc: 'Oversensitivity to only slight increases of sound intensity',
		link: '//www.nchearingloss.org/recruit.htm',
		check: function (q){
			return (q.H2 && q.H2_a === 'Always');
		}
	}


]


export default Diagnosis;
