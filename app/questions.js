import lodash from 'lodash';

var qtypes = {
	NUMBER : 'number',
	BOOL : 'bool',
	LIST : 'list',
};
var sections = {
	PRIMARY : 'primary',
	WEIRD : 'weird'
};

class NumberQuestion {
	constructor(text, section, next, mandatory=false){
		this.type = qtypes.NUMBER;
		this.text = text;
		this.section = section;
		this.mandatory = mandatory;

		//if this isn't a function (a string hopefully), simply return it instead.
		if (typeof(next) !== 'function'){
			this.next = function (){return next};
		}else{
			this.next = next;
		}
	}
}

class ListQuestion extends NumberQuestion{
	constructor(text, section, choices, next, mandatory=false){
		super(text, section, next, mandatory);
		this.choices = choices;
		this.type = qtypes.LIST;
	}
}

class BoolQuestion extends NumberQuestion {
	constructor(text, section, next, mandatory=false){
		super(text, section, next, mandatory);
		this.type = qtypes.BOOL;
	}
}


var Questions = {
	g1 : new NumberQuestion('How old are you', sections.PRIMARY, 'g2', true),
	g2 : new ListQuestion('Male or Female', sections.PRIMARY, ['Male', 'Female'], function(answer){
			if (answer === 'Female'){
				return 'g2_a';
			}else{
				return 'g3';
			}
		}, true),
	g2_a : new BoolQuestion('Are you sure', sections.PRIMARY, 'g3', true),
	g3 : new NumberQuestion('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', sections.PRIMARY, 'g4', true),
	g4 : new BoolQuestion('Get all that?', sections.PRIMARY, 'g1', true),
}

Questions.first = 'g1';

Questions.qtypes = qtypes;

Questions.sections = sections;

export default {list : Questions, first: 'g1', types: qtypes, sections: sections}