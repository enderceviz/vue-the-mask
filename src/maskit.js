export default function maskit (value, mask, masked = true, tokens) {
  value = value || ''
  mask = mask || ''
  var iMask = 0
  var iValue = 0
  var output = ''
  if(tokens.replace && tokens.replace.delete.length) {
    tokens.replace.delete.map(item => value = value.replace(/\s+/g, '').replace(item, ''))
  }
  while (iMask < mask.length && iValue < value.length) {
    var cMask = mask[iMask]
    var masker = tokens[cMask]
    var cValue = value[iValue]
    if (masker && !masker.escape) {
      if (masker.pattern.test(cValue)) {
      	output += masker.transform ? masker.transform(cValue) : cValue
        iMask++
      }
      iValue++
    } else {
      if (masker && masker.escape) {
        iMask++ // take the next mask char and treat it as char
        cMask = mask[iMask]
      }
      if (masked) output += cMask
      if (cValue === cMask) iValue++ // user typed the same char
      iMask++
    }
  }

  // fix mask that ends with a char: (#)
  var restOutput = ''
  while (iMask < mask.length && masked) {
    var cMask = mask[iMask]
    if (tokens[cMask]) {
      restOutput = ''
      break
    }
    restOutput += cMask
    iMask++
  }

  if(tokens.keyCode46 && tokens.keyCode46.find(item => item === output[output.length - 1])) {
    output = output.slice(0, -1)
  }

  return output + restOutput
}
