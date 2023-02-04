const fs = require('fs')
const path = require('path')

var options = {
  env: '.env',
  sample: '.env.sample',
  mask: '',
  banner:`2023-Now (c) MiaJupiter. All rights reserved. https://miajupiter.com`
}

function generateEnvSample(userOptions) {
  if (userOptions) {
    Object.assign(options, userOptions)
  }
  if (!fs.existsSync(options.env))
    throw `Error: File does not exist: "${options.env}"`

  let lines = fs.readFileSync(options.env, 'utf8').split('\n')
  let s = ''

  let startedQuote = ''

  lines.forEach(e => {
    let line = e.trim()
    if (startedQuote) {
      let endQuotePosition = line.indexOf(startedQuote, 1) > -1 ? line.indexOf(startedQuote, 1) : -1
      if (endQuotePosition > -1) {
        line = line.substring(endQuotePosition + 1)
        let commentPos = line.indexOf('#')
        if (commentPos > -1) {
          s +=' ' + line.substring(commentPos) + '\n'
        }
        startedQuote = ''
      }
    } else {
      if (!line.startsWith('#') && line.indexOf('=') > -1) {

        let paramName = line.split('=')[0].trim()
        let paramValue = line.split('=')[1]
        s += `${paramName}=`

        startedQuote = paramValue.length > 0 && (paramValue[0] == `'` || paramValue[0] == `"`) ? paramValue[0] : ''
        let endQuotePosition = startedQuote && paramValue.indexOf(startedQuote, 1) > -1 ? paramValue.indexOf(startedQuote, 1) : -1

        if (!startedQuote || (startedQuote && endQuotePosition > -1)) {
          if (!(paramValue.startsWith('true') || paramValue.startsWith('false'))) {
            paramValue = paramValue.substring(endQuotePosition + 1)
            let commentPos = paramValue.indexOf('#')
            if (commentPos > -1) {
              if (options.mask.length > 0) {
                s += options.mask[0].repeat(commentPos)
              }
              s += ' ' + paramValue.substring(commentPos)
            }
          }else{
            s+=paramValue
          }
          startedQuote = ''
          s += '\n'
        }
      } else {
        s += line
        s += '\n'
      }
      
    }
  })

  if(options.banner) {
    s += `\n`
    s+=`# ${'-'.repeat(options.banner.length)}\n`
    s+=`# ${options.banner}`
  }
  fs.writeFileSync(options.sample, s, 'utf8')
}

module.exports = generateEnvSample
