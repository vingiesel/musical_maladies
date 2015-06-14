

var Diagnosis = [
	{
		name : 'Your are actually dead',
		desc : 'trust me, I can see dead people',
		link : 'www.google.com',
		check : function (q){
			console.log()
			if (q.g1 > 10){
				return true;
			}
			return false;
		},
	},

	{
		name : 'I Dunno',
		desc : 'Bacon ipsum dolor amet frankfurter prosciutto t-bone biltong spare ribs, picanha sausage tri-tip. Jowl jerky turducken bacon drumstick ham hock porchetta, tongue chuck. Sirloin pork chop ground round frankfurter, cow biltong cupim ball tip salami sausage tri-tip picanha. Picanha bresaola ham hock short ribs alcatra beef, swine porchetta ribeye pork chop tri-tip brisket pork belly. Kielbasa short ribs tail ham hock strip steak ribeye. Sirloin pancetta corned beef tongue bacon spare ribs.',
		link : 'www.google.com',
		check : function (q){
			if (q.g3){
				return true;
			}
			return false;
		},
	}
]


export default Diagnosis;
