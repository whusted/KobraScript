function OnlyIfStatement(conditional, defaultAct) {
  this.conditional = conditional
  this.defaultAct = defaultAct
}

OnlyIfStatement.prototype.toString = function () {
  var string = '(Only ' + this.conditional.onlyString()
  if (defaultAct) {
    string = string.concat('else ' + this.defaultAct.toString())
  }
  return string + ')'
}

OnlyIfStatement.prototype.analyze = function (context) {
  this.conditional.analyze(context)
  if (this.defaultAct) {
    this.defaultAct.analyze(context)
  }
}

module.exports = OnlyIfStatement
