import _ from 'lodash';

var qtypes = {
	NUMBER : 'number',
	BOOL : 'bool',
	LIST : 'list',
	DROP : 'drop',
	MULTI : 'multiple',
};
var sections = {
	PRIMARY : 'primary',
	WEIRD : 'weird',
	QUAL : 'qual',
	HEARING : 'hear',
	NEURAL: 'neur',
	MUSCULAR: 'muscular'
};

class NumberQuestion {
	constructor(text, section, next, mandatory=false, image_url=null, condition=null){
		this.type = qtypes.NUMBER;
		this.text = text;
		this.section = section;
		this.mandatory = (section === sections.PRIMARY)?true:mandatory;
		this.image_url = image_url;
		this.condition = condition;

		//if this isn't a function (a string hopefully), simply return it instead.
		if (typeof(next) !== 'function'){
			this.next = function (){return next};
		}else{
			this.next = next;
		}
		//same thing for the initial condition
		if (typeof(condition) !== 'function'){
			this.condition = function (){return true};
		}else{
			this.condition = condition;
		}
	}
}

class ListQuestion extends NumberQuestion{
	constructor(text, section, choices, next, mandatory=false, image_url=null, condition=null){
		super(text, section, next, mandatory,image_url, condition);
		this.choices = choices;
		this.type = qtypes.LIST;
	}
}

class MultiQuestion extends ListQuestion{
	constructor(text, section, choices, next, mandatory=false, image_url=null, condition=null){
		super(text, section, choices, next, mandatory, image_url, condition);
		this.type = qtypes.MULTI;
	}
}

class DropQuestion extends ListQuestion{
	constructor(text, section, choices, next, mandatory=false, image_url=null, condition=null){
		super(text, section, choices, next, mandatory,image_url, condition);
		this.type = qtypes.DROP;
	}
}

class BoolQuestion extends NumberQuestion {
	constructor(text, section, next, mandatory=false, image_url=null, condition=null, labels=['Yes', 'No']){
		super(text, section, next, mandatory,image_url, condition);
		this.type = qtypes.BOOL;
		this.labels = labels;
	}
}

var FryScale = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'];
var Freq = ['Rarely', 'Occasionally', 'Frequently', 'Always'];

var instrument_list = ['Piano', 'Harpsichord', 'Pianoforte', 'Percussion - Mallet focus', 'Percussion - all', 'Tuba', 'Trombone', 'Euphonium/Baritone', 'Trumpet', 'French Horn', 'Bassoon', 'Oboe', 'Bass Clarinet', 'Bb Clarinet', 'Flute', 'Piccolo', 'Flute and Piccolo', 'Violin', 'Viola', 'Cello', 'Double-Bass', 'Voice', 'Organ', 'Saxophone', 'Bagpipes', 'Guitar', 'Conductor'];

var Percussion = ['Percussion - Mallet focus', 'Percussion - all'];
var Strings = ['Violin', 'Viola', 'Cello', 'Double-Bass'];
var Keyboard = ['Piano', 'Harpsichord', 'Pianoforte', 'Organ'];
var Brass= ['Tuba', 'Trombone', 'Euphonium/Baritone', 'Trumpet', 'French Horn'];
var Woodwind=['Bassoon', 'Oboe', 'Bass Clarinet', 'Bb Clarinet', 'Flute', 'Piccolo', 'Flute and Piccolo', 'Bagpipes', 'Saxophone'];

function does_play(list){
	return function (answers) {
		var all = [];
		_.forEach(list, function (item){
			if (typeof(item) === 'object'){
				all = all.concat(item);
			}
			if (typeof(item) === 'string'){
				all.push(item);
			}
		});
		// var all = [].concat.apply([], list);
		var pick = answers.G2;
		return _.includes(all, pick);
	}
}

function doesnt_play(list){
	return function (answers) {
		var all = [];
		_.forEach(list, function (item){
			if (typeof(item) === 'object'){
				all = all.concat(item);
			}
			if (typeof(item) === 'string'){
				all.push(item);
			}
		});
		var pick = answers.G2;
		return !_.includes(all, pick);
	}
}



var Questions = {
	G1 : new NumberQuestion('How old are you?', sections.PRIMARY, 'G2'),
	G2 : new DropQuestion('What is your instrument?', sections.PRIMARY, instrument_list, 'G3'),
	G3 : new MultiQuestion('What is your sex?', sections.PRIMARY, ['Male', 'Female'], 'G4'),
	G4 : new BoolQuestion('Do you primarily play under conductor?', sections.PRIMARY, function (answer){
			if (answer === true){
				return 'G4_a';
			}else{
				return 'G5';
			}
		}),
	G4_a: new DropQuestion('What is the nature of the conductor?', sections.PRIMARY, ['hostile', 'intense', 'demanding', 'understanding', 'cooperative', 'push-over'], 'G5'),
	G5 : new ListQuestion('Describe your lifestyle', sections.PRIMARY, ['Static', 'Dynamic (active)'], 'G6'),
	G6 : new DropQuestion('How often do you exercise?', sections.PRIMARY, ['daily', '5 times a week', '2-3 times a week', '4 times a month', 'once a month', 'less than once a month', 'never'], 'G7'),
	G7 : new BoolQuestion('Are you overweight?', sections.PRIMARY, 'G8'),
	G8 : new BoolQuestion('Do you smoke?', sections.PRIMARY, 'G9'),
	G9 : new BoolQuestion('Do you use controlled drugs?', sections.PRIMARY, 'G10'),
	G10 : new BoolQuestion('Do you consume more than a moderate amount of alcohol?', sections.PRIMARY, 'G11'),
	G11 : new BoolQuestion('Do you consume more than 2 cups of caffeinated beverages each day?', sections.PRIMARY, 'G12'),
	G12 : new BoolQuestion('Do you sleep poorly?', sections.PRIMARY, 'G13'),
	G13 : new BoolQuestion('Are you a stressed or tense person?', sections.PRIMARY, 'G14'), 
	G14 : new BoolQuestion('Do you struggle with depression?', sections.PRIMARY, 'G15'),
	G15 : new BoolQuestion('Would you characterize yourself as an anxious person?', sections.PRIMARY, 'Q1'),

	Q1 : new BoolQuestion('Do you have pain?', sections.QUAL, function (answer, answers, skip){
			if (answer || skip){
				return 'Q2';
			}else{
				return 'N1';
			}
		}),
	Q2 : new BoolQuestion('Do you believe your injury is due to playing-related activities?', sections.QUAL, 'Q3'),
	Q3 : new BoolQuestion('Did you experience a different level of physical activity prior to pain?', sections.QUAL, function (answer, answers, skip){
			if (answer || skip){
				return 'Q3_a';
			}else{
				return 'Q4';
			}
		}),
	Q3_a : new BoolQuestion('Was it a decrease or an increase in physical activity?', sections.QUAL, 'Q4', false, null, null, ['Decrease', 'Increase']),
	Q4 : new BoolQuestion('Have you noticed anything visibly different in the troublesome area since the pain has begun?', sections.QUAL, function (answer, answers, skip){
			if (answer || skip){
				return 'Q4_a';
			}else{
				return 'Q5';
			}
		}, false, null, null, ['Slight', 'Extreme']),
	Q4_a : new BoolQuestion('Do you notice a slight difference or an extreme difference?', sections.QUAL, 'Q5'),
	Q5 : new BoolQuestion('Is your pain related only to a specific passage?', sections.QUAL, function (answer, answers, skip){
			if (answer || skip){
				return 'N1';
			}else{
				return 'Q6';
			}
		}),
	Q6 : new DropQuestion('How soon after you begin playing do you experience pain?', sections.QUAL, [
			'Immediate', '5 min', '10 min', '15 min', '20 min', '25 min', '30 min', '35 min', '40 min', '45 min', '50 min', '55 min', '60 min',
		], 'Q7'),
	Q7 : new BoolQuestion('Does the pain go away when you cease playing?', sections.QUAL, 'H1'),

	H1: new BoolQuestion('Do normal sounds (turning on a car, shutting a door) seem unbearably loud?', sections.HEARING, 'H2'),
	H2: new BoolQuestion('Do you sense a heightened sensitivity to certain frequencies/timbres - even if they aren’t loud?', sections.HEARING, function (answer){
		if(answer === true){
			return 'H2_a';
		}
		return 'H3';
	}),	
	H2_a: new ListQuestion('How Often?', sections.HEARING, Freq, 'H3'),
	H3: new BoolQuestion('Do you find loud sounds (live concerts, vacuum cleaner, power tools, sirens) unbearably loud?', sections.HEARING, 'H4'),
	H4: new BoolQuestion('Do single tones sound as different or multiple pitches in a certain ear?', sections.HEARING, 'H5'),
	H5: new BoolQuestion('Do you experience ringing of the ears?', sections.HEARING, function (answer){
		return (answer === true)?'H5_a':'H6'}),
	H5_a: new ListQuestion('to what degree?', sections.HEARING, ['Nuisance', 'Obtrusive', 'Life-altering'], 'H6'),
	H6: new BoolQuestion('Do you experience an inability to hear words clearly?', sections.HEARING, 'H7'),	
	H7: new BoolQuestion('Have you noticed (or been told) that you have a tendency to speak loudly?', sections.HEARING, 'H8'),
	H8: new BoolQuestion('Do you have an impulse to turn up the volume on various devices?', sections.HEARING, 'H9'),
	H9: new BoolQuestion('Do you have confusion in discerning consonants during conversations?', sections.HEARING, 'H10'),
	H10: new BoolQuestion('Do you have an inability to discern subtle shadings or colors in music?', sections.HEARING, 'H11'),
	H11: new BoolQuestion('Do you experience ear, neck, or jaw pain or frequent ear popping?', sections.HEARING, 'H12'),
	H12: new BoolQuestion('Is it difficult for you to distinguish conversation or sound over ambient noise (background music, chatter)?', sections.HEARING, 'M1'),

	M1: new BoolQuestion('When standing at rest, do your arms rest at your side or forward (on your thighs)? (Pictures)', sections.MUSCULAR, 'M2', false, null, null, ['Forward', 'Side']), 
	M2: new BoolQuestion('When standing at rest, do your hands face backward or toward each other? (Pictures)', sections.MUSCULAR, 'M3', false, null, null, ['Backward', 'Toward']),	 
	M3: new DropQuestion('Do you experience pain and/or a burning sensation in your:', sections.MUSCULAR, ['hand', 'wrist', 'forearm', 'elbow', 'upperarm', 'shoulder', 'neck', 'upperback', 'midback', 'lowerback', 'thighs', 'knees', 'lower legs', 'ankles', 'feet', 'jaw', 'embouchure', 'joints', 'none of the above'], function (answer){
		return (answer !== 'none of the above')?'M3_a':'M4'}),
	M3_a: new ListQuestion('In which tier would you place your pain?', sections.MUSCULAR, FryScale, 'M4'),
	M4: new BoolQuestion('Do you experience a sense of fatigue or heaviness much more quickly than has happened in the past?', sections.MUSCULAR, 'M5'),	 
	M5: new DropQuestion('Would you describe yourself as having stiffness in your:', sections.MUSCULAR, ['hand', 'wrist', 'forearm', 'elbow', 'upperarm', 'shoulder', 'neck', 'upperback', 'midback', 'lowerback', 'thighs', 'knees', 'lower legs', 'ankles', 'feet', 'jaw', 'embouchure', 'none of the above'], function (answer){
		return (answer !== 'none of the above')?'M5_a':'M6'}),
	M5_a: new ListQuestion('In which tier would you place your pain?', sections.MUSCULAR, FryScale, 'M6'),	 
	M6: new BoolQuestion('Have you noticed a decreased ability to complete or enjoy your Activities of Daily Living (day-to-day activities and responsibilities - non-musical)?', sections.MUSCULAR, function (answer){
		return (answer === true)?'M6_a':'M7'}),
	M6_a: new ListQuestion('Would you say your decrease as been', sections.MUSCULAR, ['slight', 'moderate','severe'], 'M7'),	 
	M7: new ListQuestion('Is your playing style intense or emotional?', sections.MUSCULAR, Freq, 'M8'),	 
	M8: new ListQuestion('Is your performance position awkward or uncomfortable?', sections.MUSCULAR, Freq, 'M9'),	 
	M9: new BoolQuestion('Do you particularly enjoy difficult, technically demanding, and/or loud repertoire?', sections.MUSCULAR, 'M10'),	 
	M10: new ListQuestion('Do you slam your bow on the strings, slap your fingers on the strings, or slam/squeeze the keys of your instrument?', sections.MUSCULAR, Freq, 'M11', false, null, does_play([Strings, Keyboard])),
	M11: new ListQuestion('At what dynamic do you practice?', sections.MUSCULAR, ['Forte', 'Mezzo-Forte', 'Piano', 'Dynamics of Piece'], 'M12'),	 
	M12: new ListQuestion('To what extent do you squeeze your instrument while holding it?', sections.MUSCULAR, ['Enough to support it', 'More than is needed to support it but not enough to feel strained', 'enough to feel strained', 'enough to cause white knuckles', 'indentations on skin'], 'M13', false, null, doesnt_play([Keyboard, Percussion])),	 
	M13: new ListQuestion('Do you slam/squeeze the keys/strings even when playing softly?', sections.MUSCULAR, Freq, 'M14', false, null, does_play([Strings, Keyboard])),	 
	M14: new ListQuestion('Do you clench or grit your teeth while practicing/performing?', sections.MUSCULAR, Freq, 'M15'),	 
	M15: new ListQuestion('Do you maintain a back-to-back schedule of rehearsals, gigs, and performances?', sections.MUSCULAR, Freq, 'M16'),
	M16: new ListQuestion('Do you fling your fingers off of the strings or keys?', sections.MUSCULAR, Freq, 'M17', false, null, doesnt_play([Percussion, ])),	 
	M17: new ListQuestion('How tightly do you grip your bow or fingerboard?', sections.MUSCULAR, ['Enough to support it', 'more than is needed to support it but not enough to feel strained', 'enough to feel strained', 'enough to cause white knuckles', 'indentations on skin'], 'M18', false, null, does_play([Strings, 'Guitar'])),	 
	M18: new ListQuestion('How often do you play without warming up?', sections.MUSCULAR, Freq, 'M19'),	 
	M19: new ListQuestion('Do you play with a heavy bow?', sections.MUSCULAR, Freq, 'M20', false, null, does_play([Strings])),	 
	M20: new ListQuestion('Do you play with high strings?', sections.MUSCULAR, Freq, 'M21', false, null, does_play([Strings, 'Guitar'])),	 
	M21: new ListQuestion('Do you play with an ill-fitting or worn out chinrest?', sections.MUSCULAR, Freq, 'M22', false, null, does_play(['Violin', 'Viola'])),	 
	M22: new ListQuestion('Do you stretch to reach notes or keys?', sections.MUSCULAR, Freq, 'M23'),	 
	M23: new BoolQuestion('Do you hold fingers uplifted or curled (Picture)?', sections.MUSCULAR, function (answer){
		return (answer === true)?'M23_a':'M24'}),
	M23_a: new ListQuestion('How often?', sections.MUSCULAR, Freq, 'M24'),	 
	M24: new BoolQuestion('Do you hold stretches, double stops, or chords?', sections.MUSCULAR, 'M25'),	 
	M25: new BoolQuestion('Do you involve more than your lower arm when changing from downbow to upbow?', sections.MUSCULAR, function (answer){
		return (answer === true)?'M25_a':'M26'}, false, null, does_play([Strings,])),
	M25_a: new ListQuestion('How often?', sections.MUSCULAR, Freq, 'M26'),
	M26: new BoolQuestion('When you sit, do you feel stable?', sections.MUSCULAR, 'M27'),	 
	M27: new BoolQuestion('When sitting, do you sit on your “rockers”? (Picture)', sections.MUSCULAR, 'M28'),	 
	M28: new DropQuestion('Do you hold your neck: (Pictures)?', sections.MUSCULAR, ['tilted', 'rotated', 'cocked forward', 'cocked down', 'none of the above'], function (answer){
		return (answer !== 'none of the above')?'M28_a':'M29'}),
		M28_a: new ListQuestion('How often?', sections.MUSCULAR, Freq, 'M29'),	 
	M29: new DropQuestion('Do you hold your torso: (Pictures)?', sections.MUSCULAR, ['bent', 'twisted', 'leaning forward', 'leaning back', 'none of the above'], function (answer){
		return (answer !== 'none of the above')?'M29_a':'M30'}),
		M29_a: new ListQuestion('How often?', sections.MUSCULAR, Freq, 'M30'),
	M30: new DropQuestion('Do you hold your wrist: (Pictures)?', sections.MUSCULAR, ['deviated', 'lifted', 'dropped', 'none of the above'], function (answer){
		return (answer !== 'none of the above')?'M30_a':'M31'}),
		M30_a: new ListQuestion('How often?', sections.MUSCULAR, Freq, 'M31'),
	M31: new DropQuestion('Do you hold your shoulders: (Pictures)?', sections.MUSCULAR, ['lifted', 'twisted', 'rolled forward', 'none of the above'], function (answer){
		return (answer !== 'none of the above')?'M31_a':'M32'}),
		M31_a: new ListQuestion('How often?', sections.MUSCULAR, Freq, 'M32'),
	M32: new DropQuestion('Do you hold your thumbs such that they are constantly: (Pictures)?', sections.MUSCULAR, ['squeezing', 'gripping', 'pinching', 'angled', 'none of the above'], function (answer){
		return (answer !== 'none of the above')?'M32_a':'M33'}),
		M32_a: new ListQuestion('How often?', sections.MUSCULAR, Freq, 'M33'),
	M33: new BoolQuestion('Do you sit or stand immobile for long periods of time?', sections.MUSCULAR, function (answer){
		return (answer === true)?'M34':'M35'}),
	M34: new DropQuestion('How often?', sections.MUSCULAR, ['30 minutes', '1 hour', '1 hour 30 minutes', '2 hours', '2 hours 30 minutes', '3 hours'], 'M35'),
	M35: new BoolQuestion('Do you experience several points of pain?', sections.MUSCULAR, function (answer){
		return (answer === true)?'M35_a':'M36'}),
		M35_a: new ListQuestion('How many?', sections.MUSCULAR, ['1-5', '5-9', '10-15', '15+', 'I hurt all over'], 'M36'),
	M36: new BoolQuestion('Would you characterize your pain as a deep muscular ache, stiffness, or soreness?', sections.MUSCULAR, 'M37'),	
	M37: new BoolQuestion('Are you double jointed/have very flexible joints?', sections.MUSCULAR, 'N1'),

	
	N1: new MultiQuestion('Do you ever experience involuntary movement of your:', sections.NEURAL, ['fingers', 'hand', 'wrist', 'arm', 'mouth', 'embouchure'], function (answer){
		return (answer !== false)?'N1_a':'N2'}),
		
		N1_a: new ListQuestion('How Often?', sections.NEURAL, ['When I play', 'Practice, for up to 30 minutes after I play', 'practice, constantly'], 'N2'),
	
	N2: new BoolQuestion('Have you noticed yourself becoming clumsier?', sections.NEURAL, 'N3'),
	N3: new MultiQuestion('Do you experience tingling or numbness in your:', sections.NEURAL, ['hand', 'wrist', 'forearm', 'elbow', 'upperarm', 'shoulder', 'neck', 'upperback', 'midback', 'lowerback', 'thighs', 'knees', 'lower legs', 'ankles', 'feet', 'jaw', 'embouchure'], function (answer){
		return (answer !== false)?'N3_a':'N4'}),
		
		N3_a: new ListQuestion('How Often?', sections.NEURAL, ['When I play', 'Practice, for up to 30 minutes after I play', 'practice, constantly'], 'N4'), 
	
	N4: new BoolQuestion('Have you noticed a certain degree of impaired dexterity?', sections.NEURAL, function (answer){
		return (answer === true)?'N4_a':'N5'}),
		
		N4_a: new ListQuestion('To what degree?', sections.NEURAL, ['Little', 'Some', 'a moderate degree', 'a significant degree'], 'N5'),
	
	N5: new BoolQuestion('Have you experienced a phenomenon where passages previously non-problematic are becoming inexplicably more difficult?', sections.NEURAL, function (answer){
		return (answer === true)?'N5_a':'N5b'}, false, null, doesnt_play([Brass])),
		
		N5_a: new BoolQuestion('Has this phenomenon become more frequent as time has gone on?', sections.NEURAL, 'N5_b'),
		N5_b: new BoolQuestion('Has increasing practice time helped?', sections.NEURAL, 'N5_c'),
		N5_c: new BoolQuestion('Has taking time off helped?', sections.NEURAL, 'N5_d'),
		N5_d: new BoolQuestion('Do you experience pain during these episodes of inexplicable difficulty?', sections.NEURAL, 'N6'),
	N5b: new BoolQuestion('Have you noticed a particular register in which it is becoming inexplicably more difficult to play?', sections.NEURAL, function (answer){
			return (answer === true)?'N5_f':'N6'}, false, null, does_play([Brass])),
		N5_f: new BoolQuestion('Has this phenomenon become more frequent as time has gone on?', sections.NEURAL, 'N5_g'),
		N5_g: new BoolQuestion('Has increasing practice time helped?', sections.NEURAL, 'N5_h'),
		N5_h: new BoolQuestion('Has taking time off helped?', sections.NEURAL, 'N5_i'),

		N5_i: new BoolQuestion('Do you experience pain during these episodes of inexplicable difficulty?', sections.NEURAL, 'N6'),
	
	N6: new BoolQuestion('Do your fingers curl under when attempting to play?', sections.NEURAL, 'N7', false, null, does_play([Keyboard])),
	N7: new BoolQuestion('Do you experience muscular spasms while playing?', sections.NEURAL, function (answer){
		return (answer === true)?'N7_a':'N8'}),
		
		N7_a: new BoolQuestion('Do you ever have these spasms while at rest or not playing?', sections.NEURAL, 'N7_b'),
		N7_b: new BoolQuestion('Have you consulted massage therapy, acupuncture, or other muscle function therapies?', sections.NEURAL, function (answer){
			return (answer === true)?'N7_c':'N8'}),
		N7_c: new BoolQuestion('Did they help?', sections.NEURAL, 'N8'),
	
	N8: new BoolQuestion('Do you experience pain in your thumb but not in other fingers?', sections.NEURAL, 'N9'),
	N9: new BoolQuestion('Do you experience a type of pain in your thumb that is unique?', sections.NEURAL, 'N10'),
	N10: new BoolQuestion('Have you noticed or been told that your neck longer than average?', sections.NEURAL, 'N11', false, null, does_play(['Violin', 'Viola'])),
	N11: new BoolQuestion('Have you experienced severe pain in the ball of your foot (especially between the 3rd and 4th toes)?', sections.NEURAL, 'N12', false, null, does_play([Keyboard, Percussion])),
	N12: new BoolQuestion('Do you experience pain or numbness in large areas of your arm(s)?', sections.NEURAL, 'N13'),
	N13: new BoolQuestion('Have you noticed circulatory or color changes in your extremities?', sections.NEURAL, function (answer){
		return (answer === true)?'N13_a':'N14'}),
		
		N13_a: new BoolQuestion('Is it associated with tingling/numbness?', sections.NEURAL, 'N14'),
	
	N14: new BoolQuestion('Have you noticed lumps (not including muscular “knots”) on your wrists or fingers?', sections.NEURAL, 'N15'),
	N15: new BoolQuestion('Have you noticed that shaking your hands freely (similar to trying to fling water off of your hands) relieves pain?', sections.NEURAL, 'DONE'),
}

export default {list : Questions, first: 'G1', types: qtypes, sections: sections, instruments: instrument_list, instrument_type: 
	{
		Percussion : Percussion,
		Strings : Strings,
		Keyboard : Keyboard,
		Brass : Brass,
		Woodwind : Woodwind
	}
}