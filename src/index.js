import Alexa from 'alexa-sdk'
import Yelp from 'yelp'
import config from './config'

const yelp = new Yelp(config.yelp)

const handlers = {
  'LaunchRequest': function () {
    this.emit('Noms')
  },
  'GetNewFactIntent': function () {
    this.emit('Noms')
  },
  'Noms': function () {
    const location = '75035'
    noms(location, this)
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = 'You can say tell me a fact, or, you can say exit... What can I help you with?'
    const reprompt = 'What can I help you with?'
    this.emit(':ask', speechOutput, reprompt)
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', 'Goodbye!')
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', 'Goodbye!')
  }
}

function noms(location, self) {
  yelp.search({
    location,
    category_filter: 'desserts',
    radius_filter: 10000,
    limit: 10,
    sort: 2
  })
  .then((data) => {
    const results = data.businesses.map(b => b.name)
    console.log('results', results)
    const chosen = results[Math.floor(Math.random() * results.length)]
    const speechOutput = `Satisfy your sweet tooth at ${chosen}`
    self.emit(':tellWithCard', speechOutput, config.alexa.skill_name, chosen)
  })
  .catch((err) => {
    console.error(err)
  })
}

function handler(event, context, callback) {
  const alexa = Alexa.handler(event, context)
  alexa.APP_ID = config.alexa.app_id
  alexa.registerHandlers(handlers)
  alexa.execute()
}

export {
  handler
}

