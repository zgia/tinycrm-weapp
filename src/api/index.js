import Server from './server.js'

class Api {
  constructor () {
    Object.assign(this, ...Array.from(arguments))
  }
}

export default new Api(Server)
