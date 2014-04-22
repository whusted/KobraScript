var fs = require('fs')
var HashMap = require('hashmap').HashMap
var scan = require('../scanner')
var blueargparser = require('../blueargparser')

function Construction(blueID, args) {
  this.blueID = blueID
  /* These can be assignments, simplified in .analyze */
  this.args = args
  this.targetBlueprint = this.blueID + '.ksb'
}

Construction.prototype.toString = function () {
  return '(Construct ' + this.blueID.baseid.lexeme + '~(' + this.args.toString() + '))'
}

Construction.prototype.analyze = function () {
  fs.readdir('./', function (err, files) {
  	for (file in files) {
  		if (this.targetBlueprint === file) return
  	}
    error('could not find ' + this.targetBlueprint + 'in local directory')
  })

  if (this.args.length === 0) return

  /* First argument sets the precedent for what kind of construction is going on */
  var isSpecificConstruction = this.args[0].hasOwnProperty('isAssignment')
  /* Ensure the following arguments are consistent */
  if (isSpecificConstruction && this.args.length > 1) {
  	for (var i = 1; i < this.args.length; i++) {
  		if (!this.args[i].hasOwnProperty('isAssignment')) {
  			error('see arg ' + i + ', all parameters to a specific construction must be assignments')
  		}
  	}
  } else if (!isSpecificConstruction && this.args.length > 1) {
  	for (var i = 1; i < this.args.length; i++) {
  		if (this.args[i].hasOwnProperty('isAssignment')) {
  			error('see arg ' + i + ', no parameter to a dynamic construction may be an assigment')
  		}
  	}
  	var argObj = argumentify(this.targetBlueprint)
  	var i = argObj.blargs.length
  	var simpleargs = []
  	while (i--) simpleargs.push(undefined)
  	for (var i = 0; i < this.args.length; i++) {
  		simpleargs[argObj.map.get(this.args[i])] = this.args[i].source
  	}
    /* Assignment arguments now put into proper parameter slots */
    this.args = simpleargs
  }
}

function argumentify(file) {
	var blargs
	var map = new HashMap()
	scan(file, function (tokens) {
	  blargs = blueargparser(tokens)
	})
	analyzeArguments(blargs)
	for (var i = 0; i < blargs.length; i++) {
		map.set(blargs[i], i)
	}
	return {map: map, blargs: blargs}
}

function analyzeArguments(arguments) {
	for (var i = 0; i < arguments.length; i++) {
		for (var j = i + 1; j < arguments.length - 1; j++) {
			if (arguments[i] === arguments[j]) {
				error('trying to build from potentially faulty blueprint, identical parameters found at ' + i + ', ' + j)
			}
		}
	}
}

module.exports = Construction
