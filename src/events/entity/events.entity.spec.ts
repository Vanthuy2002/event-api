import { Events } from './events.entity'

test('Event should be init', () => {
  const testData = {
    name: 'Testing events',
    description: 'This is desc'
  }
  const event = new Events(testData)

  expect(event).toEqual(testData)
})
