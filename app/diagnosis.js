import Question from 'app/questions';

import _ from 'lodash';

var Diagnosis = [
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
