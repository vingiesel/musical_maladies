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
		},
		link: ''
	},

	// TMJ
	// Pain in the jaw
	// Ages 15 – 50, 90% women
	// Jaw tension instruments – strings/winds
	//
	// Instrument = String/Winds, Age=15 – 50, M14=Frequent/Always, M3=Y/Jaw
	//
	// All or if G3=F, M3 and (2)
	{
		name: 'TMJ',
		desc: 'Pain in the jaw',
		link: '',
		check: function (q){
			var reqs = 0;
			reqs += (_.includes([].concat(Question.instrument_type.Strings, Question.instrument_type.Brass, Question.instrument_type.Woodwind), q.G2));
			reqs += (q.G1 >= 15 && q.G1 <= 50);
			reqs += (_.includes(['Frequently', 'Always'], q.M14));
			reqs += _.includes(q.M3, 'jaw');

			if (reqs === 3){
				return true;
			}else if (reqs === 2 && q.M3 && q.G3 === 'Female'){
				return true;
			}
			return false;
		}
	},
	// Osteoarthritis
	// Associated with gradual wear-and-tear/age
	// Age=50+, Q1=Y, M3=Y/Joints
	{
		name: 'Osteoarthritis',
		desc: 'Associated with gradual wear-and-tear/age',
		link: '',
		check: function (q){
			if (q.G1 >= 50 && q.Q1===true && _.includes(q.M3, 'joints')){
				return true;
			}
			return false;
		}
	},
	// Rheumatoid arthritis
	// 35-50, 3X more likely in women
	// Inflammation, loss of ability
	// Age=30-55, Q1=Y, Q2=Y, Q4=Y, Q5=N, Q6=5+, Q7=N, M3=Y/Joints
	//
	// M3 and (7)
	// Or if G3=F, M3 and (6)
	{
		name: 'Rheumatoid arthritis',
		desc: 'Inflammation, loss of ability',
		link: '',
		check: function(q){
			var reqs = 0;
			reqs += (q.G1 >= 30 && q.G1 <= 55);
			reqs += (q.Q1===true) + (q.Q2===true) + (q.Q4===true) + (q.Q5===false) + (q.Q7===false);
			reqs += _.includes(q.M3, 'joints');
			reqs += _.includes(['5 min', '10 min', '15 min', '20 min', '25 min', '30 min', '35 min', '40 min', '45 min', '50 min', '55 min', '60 min'], q.Q6);

			if(q.M3===true && reqs >= 7){
				return true;
			}
			if(q.G3==='Female' && q.M3 && reqs >= 6){
				return true;
			}
			return false;
		}
	},
	// Static Loading/Poor Posture
	// Not a medical issue – phenomenon that can lead to an issue
	// Poor posture/muscle use
	//
	// G12=Y, Q1=Y, Q5=N, Q7=N, M1=Forward, M2=Backward, M3=Y, M8=Y, M15=Y, M26=Y, M27=Y, M28-M33=Y
	// Need (7)
	{
		name: 'Static Loading/Poor Posture',
		desc: 'Not a medical issue – phenomenon that can lead to an issue. Poor posture/muscle use',
		link: '',
		check: function (q){
			var reqs = 0;
			reqs += (q.G12===true) + (q.Q1===true) + (q.Q5===false) + (q.Q7===false) + (q.M1===true) + (q.M2===true) + (q.M3===true) + (q.M8===true) + (q.M15===true) + (q.M26===true) + (q.M27===false)
				+ (q.M28===true) + (q.M29===true) + (q.M30===true) + (q.M31===true) + (q.M32===true) + (q.M33===true);

			if (reqs >= 7){
				return true;
			}
			return false;
		}
	},

	// Fibromyalgia (disc. Hurt p.77-78)
	// More common in women, ages 30-55,
	// Deep muscular aching
	// Several points of pain
	// Anxiety, stress, poor sleep, cold
	// Lose control of hand while playing
	// Double-jointed – extremely flexible joints
	// History of pain/tenderness
	// Localized areas of muscular knots
	// Some weakness
	//
	// Age=25+, G8=Y, G12=Y, G13=Y, G14=Y, G15=Y, Q1=Y, Q4=Y/Slight, Q7=N, M3=Y/Tier3+, M4=Y, M5=Y/Tier3+, M6=Y, M35=5+, M36=Y, M37=Y
	//
	// M3, M5, and (8) OR, if G3=F, M3, M5 and (6)
	{
		name: 'Fibromyalgia',
		desc: 'Deep muscular aching, Several points of pain, Anxiety, stress, poor sleep, cold, Lose control of hand while playing, Double-jointed – extremely flexible joints, History of pain/tenderness, Localized areas of muscular knots, Some weakness',
		link: '',
		check: function (q){
			var reqs = 0;
			reqs += (q.G1 >= 25) + (q.G8===true) + (q.G12===true) + (q.G13===true) + (q.G14===true) + (q.G15===true) + (q.Q1===true) + (q.Q7===false) + (q.M4===true) + (q.M6===true) + (q.M36===true) + (q.M37===true);
			reqs += (q.Q4===true && q.Q4_a==='Slight');
			reqs += (q.M3===true && _.includes(['Tier 3', 'Tier 4', 'Tier 5'], q.M3_a));
			reqs += (q.M5===true && _.includes(['Tier 3', 'Tier 4', 'Tier 5'], q.M5_a));
			reqs += (_.include(['5-9', '10-15', '15+', 'I hurt all over'], q.M35_a));
			if((q.M3 && q.M5 && reqs >=8) || (q.G3===false && q.M3 && q.M5 && reqs >= 6)){
				return true;
			}
			return false;
		}
	},
	// Focal Dystonia
	// Men more common than women, age 35
	// Inability to perform – peculiar difficulties not experienced before
	// Nothing has helped
	// No pain
	// Spasms when at instrument only
	// Pain/aches in jaw area
	// When relaxed, lips are touching teeth are together/apart?
	// Lose control while playing
	// 1/500 guitar 1/200 violin/piano
	// not young – malleable sensorimotor system
	//
	// Age=30+, N1=Y, N2=Y, N3=N, N4=Y/Significantly, N5=Y/Y/N/N/N, N6=Y, N7=Y/N OR Y/Y/N
	//
	// All, or G3=F and (6)
	{
		name: 'Focal Dystonia',
		desc: 'Inability to perform – peculiar difficulties not experienced before, Nothing has helped, No pain, Spasms when at instrument only, Pain/aches in jaw area, When relaxed, lips are touching teeth are together/apart?, Lose control while playing, 1/500 guitar 1/200 violin/piano, not young – malleable sensorimotor system',
		link: '',
		check: function (q){
			var reqs = 0;
			reqs += (q.G1 >= 30) + (q.N1===true) + (q.N2===true) + (q.N3===false) + (q.N6===true);
			reqs += (q.N4===true && _.include(['a significant degree'], q.N4_a));
			reqs += (q.N5===true && q.N5_a===true && q.N5_b===false && q.N5_c===false && q.N5_d===false);
			reqs += (q.N5b===true && q.N5_f===true && q.N5_g===false && q.N5_h===false && q.N5_i===false);
			reqs += (q.N7===true && q.N7_a===false) || (q.N7===true && q.N7_a===true && q.N7_b===false);

			if(reqs===9){
				return true;
			}
			if(reqs>=6 && q.G3==='Female'){
				return true;
			}
			return false;
		}
	},
	// Nerve Compression Syndrome (Carpal/cubital tunnel)
	// Shaking hands
	// 30% of musicians with an issue
	// symptoms worse by elbow flexion
	// State NCS as diagnosis, with possibility that it could develop into Carpal/Cubital
				// Carpal Tunnel Syndrome
				// Decreasing
				// Less common than other issues in musicians
				// Wrist flexion/deviation/extension/dropped
				// Associated with pain away from instrument
	// Q1=Y, Q7=N, M3=Y/Hand/Wrist/Forearm, M5=Y/Hand/Wrist/Forearm, M30=Y
	{
		name: 'Nerve Compression Syndrome (Carpal/cubital tunnel)',
		desc: 'Shaking hands, 30% of musicians with an issue, symptoms worse by elbow flexion. possibility that it could develop into Carpal/Cubital',
		link: '',
		check: function (q){
			return ((q.Q1===true) && (q.Q7===false) && (q.M30===true)
				&& (_.includes(q.M3, 'hand') || _.includes(q.M3, 'wrist') || _.includes(q.M3, 'forearm'))
				&& (_.includes(q.M5, 'hand') || _.includes(q.M5, 'wrist') || _.includes(q.M5, 'forearm')));
		}
	},
	{
		name: 'Carpal Tunnel Syndrome',
		desc: 'Less common than other issues in musicians',
		link: '',
		check: function (q){
			return ((q.Q1===true) && (q.Q7===false) && (q.M30===true)
				&& (_.includes(q.M3, 'hand') || _.includes(q.M3, 'wrist') || _.includes(q.M3, 'forearm'))
				&& (_.includes(q.M5, 'hand') || _.includes(q.M5, 'wrist') || _.includes(q.M5, 'forearm')));
		}
	},

	// De Quervain’s Tenosynovitis
	// Thumb pain, crossing under/gripping
	// Q1=Y, Q7=N, M5=Y/Hand, M3=Y/Hand, N8=Y, N9=Y
	{
		name: 'De Quervain’s Tenosynovitis',
		desc: 'Thumb pain, crossing under/gripping',
		link: '',
		check: function(q){
			return ( (q.Q1===true) && (q.Q7===false) && (q.N8===true) && (q.N9===true) && (_.includes(q.M3, 'hand')===true) && (_.includes(q.M5, 'hand')===true) );
		}
	},
	// Thoracic Outlet Syndrome
	// Compression of nerves in arm/shoulder
	// Double bass/bagpipes
	// Long-necked women
	// Pain in whole arm, numbness, weakness in the hand, fatigue, vascular color changes
	//
	// Instrument=Bass/Bagpipes/Conductor
	// M3=Y/Hand/Arm, N12=Y, N13=Y
	// All, ori f G3=F, all and N10=Y
	{
		name: 'Thoracic Outlet Syndrome',
		desc: 'Compression of nerves in arm/shoulder',
		link: '',
		check: function (q){
			var reqs = 0;
			reqs += (_.includes(['hand', 'wrist', 'forearm', 'elbow', 'upperarm', 'shoulder'], q.M3)) + (q.N12===true) + (q.N13===true);

			if (reqs === 3 && q.G3==='Male'){
				return true;
			}
			if (q.G3==='Female' && reqs===3 && q.N10===true){
				return true;
			}
			return false;
		}
	},
	// Morton’s Neuroma
	// Percussionist/keyboard
	// Severe pain in the ball of the foot between 3rd and 4th toes
	//
	// Instrument=Keyboard/Percussion
	// Q1=Y, Q7=N, M3=Y/Feet, N11=Y
	{
		name: 'Morton’s Neuroma',
		desc: 'Severe pain in the ball of the foot between 3rd and 4th toes',
		link: '',
		check: function (q){
			return (q.Q1===true) && (q.Q7===false) && (_.includes(q.M3, 'feet')===true) && (q.N11===true);
		}
	},
	// Raynaud’s Disease
	// Vascular issue – cold, white fingers and toes accompanied with tingling and numbness/loss of control
	// Smoking
	// Warming up/exercise
	//  G8=Y; Q1=Y, Q7=N, M18=Y/Always, N13 = Y/Y, N1=Y/Constant, N2=Y, N4=Y
	// Need (6), IfG8=Y, then need (5)
	{
		name: 'Raynaud’s Disease',
		desc: 'Vascular issue – cold, white fingers and toes accompanied with tingling and numbness/loss of control',
		link: '',
		check: function (q){
			var reqs = 0;
			reqs += (q.G8===true) + (q.Q1===true) + (q.Q7===false) + (q.M18==='Always') + (q.N2===true) + (q.N4===true);
			reqs += (q.N13===true && q.N13_a===true);
			reqs += (q.N1===true && q.N1_a==='practice, constantly');

			if(reqs>=6){
				return true;
			}
			if(q.G8===true && reqs>=5){
				return true;
			}
			return false;
		}
	},

	// Ganglion Cysts
	// Lumps on wrist, fingers
	// N14 = Y
	{
		name: 'Ganglion Cysts',
		desc: 'Lumps on wrist, fingers',
		link: '',
		check: function (q){
			return q.N14===true;
		}
	}
	
]


export default Diagnosis;
