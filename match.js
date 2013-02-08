function parseSelector(selector) {

  selector = selector.split('.')
  //console.log(selector)
  return selector
}

var match = function (selector) {
  var master_sel = parseSelector(selector)
  return function (document) {
    var sAll = master_sel.slice()
    var matches = []
    var pathSeg;
    var seg = document;
    var stack = [{path: [], value: document, sel: sAll.slice()}]
    var p

    while(p = stack.pop()) {
      if (!p.sel.length) {
        matches.push({path: p.path, value: p.value})
        continue
      };
      if (p.sel[0] === '*') {
        var sel = p.sel.slice(1)
        for(var k in p.value) {
          var path = [].concat(p.path, k)
          var value = p.value[k]

          stack.push({path: path, value: value, sel: sel})
        }
        continue
      }
      var value = p.value[p.sel[0]]

      stack.push({path: [].concat(p.path, p.sel[0]), value: value, sel: p.sel.slice(1)})

    }
    return matches
  }
}


module.exports = match