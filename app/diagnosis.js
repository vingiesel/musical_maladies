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
	},

	// Tendinitis
	// Excess gripping, squeezing, or pressing of keys. Extension, flexion, or deviation of the wrist.
	// G13=Y, G15=Y, Q1=Y, Q2=Y, Q3=N, Q4=Y/Slight OR N, Q6=<20, Q7=N, M3=Y/Tier3+, M5=Y/Tier3+, M6=Y/Moderate/Severe,
	// M7=Frequent/Always, M9=Y, M10=Frequent/Always, M11=Forte, M35=N, M12=Strain+,
	// M13=Frequent/Always, M16=Frequent/Always, M17=Strain+, M19=Frequent/Always,
	// M20=Frequent/Always, M23=Frequent/Always, M32=Frequent/Always, M35=N
	//
	// Need (15)
	// Of the Shoulder
	// Most common shoulder pain
	// Keeping arms at shoulder level is a cause
	// Instrument=Percussion/Conductor, M31=Shoulder/Frequent/Always

	{
		name: 'Tendinitis',
		desc: 'Excess gripping, squeezing, or pressing of keys. Extension, flexion, or deviation of the wrist.',
		link: '//en.wikipedia.org/wiki/Tendinitis',
		custom: function(q){
			var reqs = 0;
			reqs += (q.G13===true) + (q.G15===true) + (q.Q1===true) + (q.Q2===true) + (q.Q3===false) + (q.Q7===false) + (q.M9===true) + (q.M35===false);
			reqs += ((q.Q4===true && q.Q4_a==='Slight') || q.Q4===false);
			reqs += (_.includes(['Immediate', '5 min', '10 min', '15 min'], q.Q6));
			reqs += (q.M3===true && _.includes(['Tier 3', 'Tier 4', 'Tier 5'], q.M3_a));
			reqs += (q.M5===true && _.includes(['Tier 3', 'Tier 4', 'Tier 5'], q.M5_a));
			reqs += (q.M6===true && _.includes(['moderate','severe'], q.M6_a));
			reqs += (_.includes(['Frequently', 'Always'], q.M7));
			reqs += (_.includes(['Frequently', 'Always'], q.M10));
			reqs += q.M11==='Forte';
			reqs += (_.includes(['enough to feel strained', 'enough to cause white knuckles', 'indentations on skin'], q.M12));
			reqs += (_.includes(['Frequently', 'Always'], q.M13));
			reqs += (_.includes(['Frequently', 'Always'], q.M16));
			reqs += (_.includes(['enough to feel strained', 'enough to cause white knuckles', 'indentations on skin'], q.M17));
			reqs += (_.includes(['Frequently', 'Always'], q.M19));
			reqs += (_.includes(['Frequently', 'Always'], q.M20));
			reqs += (_.includes(['Frequently', 'Always'], q.M23));
			reqs += (_.includes(['Frequently', 'Always'], q.M32));

			var shoulder = _.includes(['Percussion - Mallet focus', 'Percussion - all', 'Conductor'], q.G2);

			if (reqs >= 15){
				if (shoulder){
					return {
						name: 'Tendinitis of the Shoulder',
						desc: 'Most common shoulder pain.',
						link: '//en.wikipedia.org/wiki/Tendinitis'
					}
				}else{
					return {
						name: 'Tendinitis',
						desc: 'Excess gripping, squeezing, or pressing of keys. Extension, flexion, or deviation of the wrist.',
						link: '//en.wikipedia.org/wiki/Tendinitis'
					}
				}
			}
			return false;
		}
	},

	// Hyperlaxity
	// Joints – can cause loading
	// M21=Frequent/Always, M37=Y
	{
		name: 'Hyperlaxity',
		desc: 'Joints - can cause loading',
		check: function(q){
			return _.includes(['Frequently', 'Always'], q.M21) && q.M37===true;
		}
	},

// Myofascial Pain Syndrome:
// Symp. P. 171
// Longstanding pain, localized, trigger points, some weakness, loss of range of motion, some loss of circulation, lack of exercise, pain/fear/stress, anxiety/depression
// NOOS
// G4=Y/Hostile-Demanding, G5=Static, G6=<4/month, G7=Y, G8=Y, G9=Y, G10=Y, G11=Y, G12=Y, G13=Y, G14=Y, G15=Y, Q1=Y, Q4=Y/Slight OR N, Q5=N, Q6=>10, M1=Forward,
// M2=Backward, M3=Y, M4=Y, M5=Y, M6=Y, M8=Y, M9=Y, M10=Frequent/Always, M11=Forte, M12=Strain+, M13=Frequent/Always, M14=Y,
// M16=Frequent/Always, M17=Strain+, M18=Frequent/Always, M22=Y, M23=Occasionally/Frequent/Always, M24=Frequent/Always,
// M25=Frequent/Always, M28-M32=Frequent/Always, M35= >/=5, M36=Y
//
// Need (25)
	{
		name: 'Myofascial Pain Syndrome',
		desc: 'Longstanding pain, localized, trigger points, some weakness, loss of range of motion, some loss of circulation, lack of exercise, pain/fear/stress, anxiety/depression',
		check: function(q){
			var reqs = 0;
			reqs += (q.G5==='Static') + (q.G7===true) + (q.G8===true) + (q.G9===true) + (q.G10===true) + (q.G11===true) + (q.G12===true) + (q.G13===true) + (q.G14===true) + (q.G15===true)
				+ (q.Q1===true) + (q.Q5===false) + (q.M1===true) + (q.M2===true) + (q.M3===true) + (q.M4===true) + (q.M5===true) + (q.M6===true) + (q.M8===true) + (q.M9===true)
				+ (q.M11==='Forte') + (q.M14===true) + (q.M22===true) + (q.M36===true);

			reqs += q.G4===true && _.includes(['hostile', 'intense', 'demanding'], q.G4_a);
			reqs += _.includes(['daily', '5 times a week', '2-3 times a week'], q.G6);
			reqs += ((q.Q4===true && q.Q4_a==='Slight') || q.Q4===false);
			reqs += _.includes(['15 min', '20 min', '25 min', '30 min', '35 min', '40 min', '45 min', '50 min', '55 min', '60 min'], q.Q6);
			reqs += (_.includes(['Frequently', 'Always'], q.M10));
			reqs += (_.includes(['enough to feel strained', 'enough to cause white knuckles', 'indentations on skin'], q.M12));
			reqs += (_.includes(['Frequently', 'Always'], q.M13));
			reqs += (_.includes(['Frequently', 'Always'], q.M16));
			reqs += (_.includes(['enough to feel strained', 'enough to cause white knuckles', 'indentations on skin'], q.M17));
			reqs += (_.includes(['Frequently', 'Always'], q.M18));
			reqs += (_.includes(['Occasionally', 'Frequently', 'Always'], q.M23_a));
			reqs += (_.includes(['Frequently', 'Always'], q.M24_a));
			reqs += (_.includes(['Frequently', 'Always'], q.M25_a));

			reqs += (_.includes(['Frequently', 'Always'], q.M28_a));
			reqs += (_.includes(['Frequently', 'Always'], q.M29_a));
			reqs += (_.includes(['Frequently', 'Always'], q.M30_a));
			reqs += (_.includes(['Frequently', 'Always'], q.M31_a));
			reqs += (_.includes(['Frequently', 'Always'], q.M32_a));

			reqs += (_.include(['5-9', '10-15', '15+', 'I hurt all over'], q.M35_a));

			if (reqs >= 25){
				return true;
			}
			return false
		}
	},

]


export default Diagnosis;
