import { expect } from 'chai'
import 'mocha'
import { Change } from '../src/Change'
import { Changes } from '../src/Changes'

describe('Changes', function() {
  describe('add', function() {
    it('should add a change', function() {
      let changes = new Changes

      changes.add(new Change('EntityName'))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName')
      ])
    })

    it('should not add a change if it already exists', function() {
      let changes = new Changes

      changes.add(new Change('EntityName'))
      changes.add(new Change('EntityName'))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName')
      ])
    })
  })
})
