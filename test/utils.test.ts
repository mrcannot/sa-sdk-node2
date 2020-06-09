import { pascal2Snake, translateKeys, trackEvent } from '../src/utils'

console.log(pascal2Snake('HelloWorld'))
console.log(translateKeys({ HelloWorld: 'world', AAAA: 'aaa' }))
console.log(trackEvent(false, 'track', '111', false, 'aaaBB', { HelloWorld: 'world' }))
