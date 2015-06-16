import lodash from 'lodash';

var qtypes = {
	NUMBER : 'number',
	BOOL : 'bool',
	LIST : 'list',
	DROP : 'drop',
};
var sections = {
	PRIMARY : 'primary',
	WEIRD : 'weird',
	QUAL : 'qual',
	HEARING : "hear",
	NEURAL: "neur",
	MUSC: "muscular"
};

class NumberQuestion {
	constructor(text, section, next, mandatory=false, image_url=null){
		this.type = qtypes.NUMBER;
		this.text = text;
		this.section = section;
		this.mandatory = (section === sections.PRIMARY)?true:mandatory;
		this.image_url = image_url;

		//if this isn't a function (a string hopefully), simply return it instead.
		if (typeof(next) !== 'function'){
			this.next = function (){return next};
		}else{
			this.next = next;
		}
	}
}

class ListQuestion extends NumberQuestion{
	constructor(text, section, choices, next, mandatory=false, image_url=null){
		super(text, section, next, mandatory,image_url);
		this.choices = choices;
		this.type = qtypes.LIST;
	}
}

class DropQuestion extends ListQuestion{
	constructor(text, section, choices, next, mandatory=false, image_url=null){
		super(text, section, choices, next, mandatory,image_url);
		this.type = qtypes.DROP;
	}
}

class BoolQuestion extends NumberQuestion {
	constructor(text, section, next, mandatory=false, image_url=null){
		super(text, section, next, mandatory,image_url);
		this.type = qtypes.BOOL;
	}
}


var Questions = {
	G1 : new NumberQuestion('How old are you?', sections.PRIMARY, 'G2'),
	G2 : new DropQuestion('What is your instrument?', sections.PRIMARY, [
			"Piano", "Harpsichord", "Pianoforte", "Percussion – Mallet focus", "Percussion – all", "Tuba", "Trombone", "Euphonium/Baritone", "Trumpet", "French Horn", "Bassoon", "Oboe", "Bass Clarinet", "Bb Clarinet", "Flute", "Piccolo", "Flute and Piccolo", "Violin", "Viola", "Cello", "Double-Bass", "Voice", "Organ", "Saxophone", "Bagpipes", "Guitar", "Conductor" 
		], 'G3'),
	G3 : new ListQuestion("What is your gender?", sections.PRIMARY, ["Male", "Female"], 'G4'),
	G4 : new BoolQuestion("Primarily play under conductor?", sections.PRIMARY, function (answer){
			if (answer === true){
				return 'G4_a';
			}else{
				return 'G5';
			}
		}),
	G4_a: new DropQuestion("What is the nature of the conductor?", sections.PRIMARY, ["hostile", "intense", "demanding", "understanding", "cooperative", "push-over"], 'G5'),
	G5 : new ListQuestion("Describe your lifestyle", sections.PRIMARY, ["Static", "Dynamic (active)"], 'G6'),
	G6 : new DropQuestion("How often do you exercise?", sections.PRIMARY, ["daily", "5 times a week", "2-3 times a week", "4 times a month", "once a month", "less than once a month", "never"], 'G7'),
	G7 : new BoolQuestion("Are you overweight?", sections.PRIMARY, "G8"),
	G8 : new BoolQuestion("Do you smoke?", sections.PRIMARY, "G9"),
	G9 : new BoolQuestion("Do you use controlled drugs?", sections.PRIMARY, "G10"),
	G10 : new BoolQuestion("Do you consume more than a moderate amount of alcohol?", sections.PRIMARY, "G11"),
	G11 : new BoolQuestion("Do you consume more than 2 cups of caffeinated beverages each day?", sections.PRIMARY, "G12"),
	G12 : new BoolQuestion("Do you sleep poorly?", sections.PRIMARY, "G13"),
	G13 : new BoolQuestion("Are you a stressed or tense person?", sections.PRIMARY, "G14"), 
	G14 : new BoolQuestion("Do you struggle with depression?", sections.PRIMARY, "G15"),
	G15 : new BoolQuestion("Would you characterize yourself as an anxious person?", sections.PRIMARY, "Q1"),

	Q1 : new BoolQuestion("Do you have pain?", sections.QUAL, function (answer, answers, skip){
			if (answer || skip){
				return 'Q2';
			}else{
				return 'N1';
			}
		}),
	Q2 : new BoolQuestion("Do you believe your injury is due to playing-related activities?", sections.QUAL, 'Q3'),
	Q3 : new BoolQuestion("Did you experience a different level of physical activity prior to pain?", sections.QUAL, function (answer, answers, skip){
			if (answer || skip){
				return 'Q3_a';
			}else{
				return 'Q4';
			}
		}),
	Q3_a : new BoolQuestion('Was it a decrease or an increase in physical activity?', sections.QUAL, 'Q4'),
	Q4 : new BoolQuestion("Have you noticed anything visibly different in the troublesome area since the pain has begun?", sections.QUAL, function (answer, answers, skip){
			if (answer || skip){
				return 'Q4_a';
			}else{
				return 'Q5';
			}
		}),
	Q4_a : new BoolQuestion('Do you notice a slight difference or an extreme difference?', sections.QUAL, 'Q5'),
	Q5 : new BoolQuestion("Is your pain related only to a specific passage?", sections.QUAL, function (answer, answers, skip){
			if (answer || skip){
				return 'N1';
			}else{
				return 'Q6';
			}
		}),
	Q6 : new DropQuestion("How soon after you begin playing do you experience pain?", sections.QUAL, [
			"Immediate", "5 min", "10 min", "15 min", "20 min", "25 min", "30 min", "35 min", "40 min", "45 min", "50 min", "55 min", "60 min",
		], 'Q7'),
	Q7 : new BoolQuestion("Does the pain go away when you cease playing?", sections.QUAL, 'H1'),

	H1: new BoolQuestion("Do normal sounds (turning on a car, shutting a door) seem unbearably loud?", sections.HEARING, "H2"),
	H2: new BoolQuestion("Do you sense a heightened sensitivity to certain frequencies/timbres – even if they aren’t loud?", sections.HEARING, function (answer){
		if(answer === true){
			return "H2_a";
		}
		return "H3";
	}),	
	H2_a: new ListQuestion("How Often?", sections.HEARING, ["Rarely", "Occasionally", "Frequently", "Always"], "H3"),
	H3: new BoolQuestion("Do you find loud sounds (live concerts, vacuum cleaner, power tools, sirens) unbearably loud?", sections.HEARING, "H4"),
	H4: new BoolQuestion("Do single tones sound as different or multiple pitches in a certain ear?", sections.HEARING, "H5"),
	H5: new BoolQuestion("Do you experience ringing of the ears?", sections.HEARING, function (answer){
		return (answer === true)?"H5_a":"H6"}),
	H5_a: new ListQuestion("to what degree?", sections.HEARING, ["Nuisance", "Obtrusive", "Life-altering"], "H6"),
	H6: new BoolQuestion("Do you experience an inability to hear words clearly?", sections.HEARING, "H7"),	
	H7: new BoolQuestion("Have you noticed (or been told) that you have a tendency to speak loudly?", sections.HEARING, "H8"),
	H8: new BoolQuestion("Do you have an impulse to turn up the volume on various devices?", sections.HEARING, "H9"),
	H9: new BoolQuestion("Do you have confusion in discerning consonants during conversations?", sections.HEARING, "H10"),
	H10: new BoolQuestion("Do you have an inability to discern subtle shadings or colors in music?", sections.HEARING, "H11"),
	H11: new BoolQuestion("Do you experience ear, neck, or jaw pain or frequent ear popping?", sections.HEARING, "H12"),
	H12: new BoolQuestion("Is it difficult for you to distinguish conversation or sound over ambient noise (background music, chatter)?", sections.HEARING, "M1"),
}

export default {list : Questions, first: 'Q7', types: qtypes, sections: sections}