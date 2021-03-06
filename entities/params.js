function Params (params) {
  this.params = params
}

Params.prototype.toString = function () {
  return '[' + this.params.join(', ') + ']'
}

Params.prototype.toArray = function () {
  return this.params
}

Params.prototype.analyze = function (context) {
  this.params.forEach(function (parameter) {
    context.addVariable(parameter.name, parameter)
    parameter.analyze(context)
  })
}

module.exports = Params
