import { expect } from 'chai'
import 'mocha'
import ChangeDescription from '../src/ChangeDescription'

describe('EntityDescription', function() {
  describe('constructor', function() {
    it('should set a string entity name', function() {
      let d = new ChangeDescription('EntityName')
      expect(d.entity).to.equal('EntityName')
      expect(d.idProps).to.be.empty
    })

    it('should set a string entity name and generate a description from a number', function() {
      let d = new ChangeDescription('EntityName', 1)
      expect(d.entity).to.equal('EntityName')
      expect(d.idProps).to.deep.equal({ id: 1 })
    })

    it('should set an entity name from an object', function() {
      let d = new ChangeDescription(new TestEntity1)
      expect(d.entity).to.equal('TestEntity1')
      expect(d.idProps).to.be.empty
    })

    it('should set an entity name from a class', function() {
      let d = new ChangeDescription(TestEntity2)
      expect(d.entity).to.equal('TestEntity2')
      expect(d.idProps).to.be.empty
    })

    it('should set an entity name from an object and auto generate the description', function() {
      let d = new ChangeDescription(new TestEntity2)
      expect(d.entity).to.equal('TestEntity2')
      expect(d.idProps).to.deep.equal({ id: 1 })
    })

    it('should add a change method', function() {
      let d = new ChangeDescription('EntityName', 1, 'delete')
      expect(d.entity).to.equal('EntityName')
      expect(d.idProps).to.deep.equal({ id: 1 })
      expect(d.changes).to.deep.equal([{ method: 'delete' }])
    })

    it('should add multiple change methods', function() {
      let d = new ChangeDescription('EntityName', 1, ['delete', 'update'])
      expect(d.entity).to.equal('EntityName')
      expect(d.idProps).to.deep.equal({ id: 1 })
      expect(d.changes).to.deep.equal([{ method: 'delete' },{ method: 'update' }])
    })

    it('should add a change with props', function() {
      let d = new ChangeDescription('EntityName', 1, { method: 'delete', props: ['a', 'b']})
      expect(d.entity).to.equal('EntityName')
      expect(d.idProps).to.deep.equal({ id: 1 })
      expect(d.changes).to.deep.equal([{ method: 'delete', props: ['a', 'b'] }])
    })

    it('should add multiple changes with props', function() {
      let d = new ChangeDescription('EntityName', 1, [{ method: 'delete', props: ['a', 'b']}, { method: 'update', props: ['c', 'd']}])
      expect(d.entity).to.equal('EntityName')
      expect(d.idProps).to.deep.equal({ id: 1 })
      expect(d.changes).to.deep.equal([{ method: 'delete', props: ['a', 'b'] }, { method: 'update', props: ['c', 'd'] }])
    })

    it('should add a change as the second parameter if the first one is an object', function() {
      let d1 = new ChangeDescription(new TestEntity1, 'delete')
      expect(d1.entity).to.equal('TestEntity1')
      expect(d1.changes).to.deep.equal([{ method: 'delete' }])

      let d2 = new ChangeDescription(new TestEntity2, 'delete')
      expect(d2.entity).to.equal('TestEntity2')
      expect(d2.idProps).to.deep.equal({ id: 1 })
      expect(d2.changes).to.deep.equal([{ method: 'delete' }])
    })
  })

  describe('isRelevantFor', function() {
    it('should be irrelevant if the entity name is not equal', function() {
      let d1 = new ChangeDescription('a')
      let d2 = new ChangeDescription('b')

      let result = d1.isRelevantFor(d2)

      expect(result).to.equal(false)
    })

    it('should be always relevant if there is no idProps on the given description', function() {
      let d1 = new ChangeDescription('a', 1)
      let d2 = new ChangeDescription('a')

      let result = d1.isRelevantFor(d2)

      expect(result).to.equal(true)
    })

    it('should be always relevant if there is no idProps on this description', function() {
      let d1 = new ChangeDescription('a')
      let d2 = new ChangeDescription('a', 1)

      let result = d1.isRelevantFor(d2)

      expect(result).to.equal(true)
    })

    it('should return true if the idProps is the same', function() {
      let change = new ChangeDescription('a', { id: 1, parentId: 2 })
      let challenger = new ChangeDescription('a', { id: 1, parentId: 2 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(true)
    })

    it('should return false if the idProps are not the same', function() {
      let change = new ChangeDescription('a', { id: 1, parentId: 1 })
      let challenger = new ChangeDescription('a', { id: 1, parentId: 2 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(false)
    })

    it('should return true if both values are null', function() {
      let change = new ChangeDescription('a', { parentId: null })
      let challenger = new ChangeDescription('a', { parentId: null })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(true)
    })

    it('should return false if one value is null and the other 0', function() {
      let change = new ChangeDescription('a', { parentId: null })
      let challenger = new ChangeDescription('a', { parentId: 0 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(false)
    })

    it('should return false if one value is null and the other undefined', function() {
      let change = new ChangeDescription('a', { parentId: undefined })
      let challenger = new ChangeDescription('a', { parentId: null })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(false)
    })

    it('should return true if the other description partially matches', function() {
      let change = new ChangeDescription('a', { id: 1, parentId: 2 })
      let challenger = new ChangeDescription('a', { parentId: 2 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(true)
    })

    it('should return false if this description is partially the same', function() {
      let change = new ChangeDescription('a', { parentId: 2 })
      let challenger = new ChangeDescription('a', { id: 1, parentId: 2 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(false)
    })

    it('should return true even if the change defines a change method', function() {
      let change = new ChangeDescription('a', 1, 'update')
      let challenger = new ChangeDescription('a', 1)

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return true even if the change does not define a change method', function() {
      let change = new ChangeDescription('a', 1)
      let challenger = new ChangeDescription('a', 1, 'update')

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return true if both define the same change method', function() {
      let change = new ChangeDescription('a', 1, 'update')
      let challenger = new ChangeDescription('a', 1, 'update')

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return false if both define a different change method', function() {
      let change = new ChangeDescription('a', 1, 'update')
      let challenger = new ChangeDescription('a', 1, 'delete')

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.false
    })

    it('should return true if both define the same change method and the change props', function() {
      let change = new ChangeDescription('a', 1, { method: 'update', props: ['a', 'b']})
      let challenger = new ChangeDescription('a', 1, 'update')

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return true if both define the same change method and the challenger props', function() {
      let change = new ChangeDescription('a', 1, 'update')
      let challenger = new ChangeDescription('a', 1, { method: 'update', props: ['a', 'b']})

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return false if both define the same change method but different props', function() {
      let change = new ChangeDescription('a', 1, { method: 'update', props: ['a']})
      let challenger = new ChangeDescription('a', 1, { method: 'update', props: ['b']})

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.false
    })

    it('should return true if both define the same change method and the same props', function() {
      let change = new ChangeDescription('a', 1, { method: 'update', props: ['b', 'a']})
      let challenger = new ChangeDescription('a', 1, { method: 'update', props: ['a', 'b']})

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return true if there is at least one relevant description', function() {
      let change = new ChangeDescription('a', 1)
      let challengers = [
        new ChangeDescription('b'),
        new ChangeDescription('c', 2),
        new ChangeDescription('a', 1),
        new ChangeDescription('d', 4)
      ]

      let result = change.isRelevantFor(challengers)

      expect(result).to.equal(true)
    })

    it('should return false if there is no satisfying description', function() {
      let change = new ChangeDescription('a', 1)
      let challengers = [
        new ChangeDescription('b'),
        new ChangeDescription('c', 2),
        new ChangeDescription('a', 3),
        new ChangeDescription('d', 4)
      ]

      let result = change.isRelevantFor(challengers)

      expect(result).to.equal(false)
    })

    it('should use only the most specific descriptions', function() {
      let challengers = [
        new ChangeDescription('EntityName1', 1),
        new ChangeDescription('EntityName1', 1, { method: 'delete', props: ['prop2'] }),
      ]

      let change1 = new ChangeDescription('EntityName1', 1, { method: 'update', props: ['prop1'] })
      let result1 = change1.isRelevantFor(challengers)
      expect(result1).to.equal(true)

      let change2 = new ChangeDescription('EntityName1', 1, { method: 'delete', props: ['prop1'] })
      let result2 = change2.isRelevantFor(challengers)
      expect(result2).to.equal(false)
    })
  })

  describe('fullDescription', function() {
    it('should not add an empty array of props', function() {
      let desc = ChangeDescription.fullDescription({}, 'method', [])
      expect(desc?.changes.length).to.equal(1)
      expect(desc?.changes[0].props).to.be.undefined
    })
  })

  describe('describeAllIds', function() {
    it('should include the id property', function() {
      let result = ChangeDescription.describeAllIds({ id: 5, a: 'a', bbbbb: 'bbbbb' })
      expect(result).to.deep.equal({ id: 5 })
    })

    it('should include any properties ending with Id', function() {
      let result = ChangeDescription.describeAllIds({ parentId: 5, hIdden: 'a' })
      expect(result).to.deep.equal({ parentId: 5 })
    })
  })
})

class TestEntity1 {}
class TestEntity2 { id = 1 }