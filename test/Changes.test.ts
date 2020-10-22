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

    it('should add the same change only once consisting of only an entityName', function() {
      let changes = new Changes

      changes.add(new Change('EntityName'))
      changes.add(new Change('EntityName'))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName')
      ])
    })

    it('should add the same change only once consisting of an entityName and idProps', function() {
      let changes = new Changes

      changes.add(new Change('EntityName', { id: 1 }))
      changes.add(new Change('EntityName', { id: 1 }))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName', { id: 1 })
      ])
    })

    it('should add the same change only once consisting of an entityName and methods', function() {
      let changes = new Changes

      changes.add(new Change('EntityName', 'create'))
      changes.add(new Change('EntityName', 'create'))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName', 'create')
      ])
    })

    it('should add the same change only once consisting of an entityName, idProps and methods', function() {
      let changes = new Changes

      changes.add(new Change('EntityName', { id: 1 }, 'create'))
      changes.add(new Change('EntityName', { id: 1 }, 'create'))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName', { id: 1 }, 'create')
      ])
    })

    it('should add a different change consisting of only an entityName', function() {
      let changes = new Changes

      changes.add(new Change('EntityName1'))
      changes.add(new Change('EntityName2'))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName1'), new Change('EntityName2')
      ])
    })

    it('should add a different change consisting of an entityName and idProps', function() {
      let changes = new Changes

      changes.add(new Change('EntityName', { id: 1 }))
      changes.add(new Change('EntityName', { id: 2 }))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName', { id: 1 }), new Change('EntityName', { id: 2 })
      ])
    })

    it('should combine two changes regarding the methods', function() {
      let changes = new Changes

      changes.add(new Change('EntityName', { id: 1 }, 'create'))
      changes.add(new Change('EntityName', { id: 1 }, 'delete'))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName', { id: 1 }, [ 'create', 'delete' ])
      ])
    })

    it('should combine two changes regarding the method props', function() {
      let changes = new Changes

      changes.add(new Change('EntityName', { id: 1 }, { method: 'update', props: [ 'property1' ]}))
      changes.add(new Change('EntityName', { id: 1 }, { method: 'update', props: [ 'property2' ]}))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName', { id: 1 }, { method: 'update', props: [ 'property1', 'property2' ]})
      ])
    })

    it('should not combine two changes regarding the same method props', function() {
      let changes = new Changes

      changes.add(new Change('EntityName', { id: 1 }, { method: 'update', props: [ 'property1' ]}))
      changes.add(new Change('EntityName', { id: 1 }, { method: 'update', props: [ 'property1' ]}))

      expect(changes.changes).to.deep.equal([
        new Change('EntityName', { id: 1 }, { method: 'update', props: [ 'property1' ]})
      ])
    })
  })
})
