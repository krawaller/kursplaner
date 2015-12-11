var LSPATH = "KURSPLANER___FAVVISAR",
	DB = JSON.parse(localStorage.getItem(LSPATH)||JSON.stringify({courses:{},subjects:{}}));

module.exports = {
	hasDismissedAE: function(){
		return DB.hasdismissedAE;
	},
	dismissAE: function(){
		DB.hasdismissedAE = true;
		localStorage.setItem(LSPATH,JSON.stringify(DB));
	},
	getCourseState: function(cid){
		return DB.courses[cid];
	},
	getSubjectState: function(sid){
		return DB.subjects[sid];
	},
	getCourseFavourites: function(){
		return Object.keys(DB.courses);
	},
	getSubjectFavourites: function(){
		return Object.keys(DB.subjects);
	},
	toggleCourseState: function(cid){
		if (DB.courses[cid]){
			delete DB.courses[cid];
		} else {
			DB.courses[cid] = true;
		}
	},
	toggleSubjectState: function(sid){
		if (DB.subjects[sid]){
			delete DB.subjects[sid];
		} else {
			DB.subjects[sid] = true;
		}
		localStorage.setItem(LSPATH,JSON.stringify(DB));
	}
}