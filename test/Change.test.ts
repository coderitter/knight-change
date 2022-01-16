import { expect } from 'chai'
import 'mocha'
import { Change } from '../src/Change'

describe('Change', function() {
  describe('constructor', function() {
    it('should accept parameter-less', function() {
      let change = new Change
      expect(change.entityName).to.be.undefined
      expect(change.entity).to.be.undefined
      expect(change.method).to.be.undefined
      expect(change.props).to.be.undefined
    })

    it('should set with a entity name', function() {
      let change = new Change('EntityName')
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.be.undefined
      expect(change.method).to.be.undefined
      expect(change.props).to.be.undefined
    })

    it('should set with a entity name and entity', function() {
      let change = new Change('EntityName', { id: 1 })
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.method).to.be.undefined
      expect(change.props).to.be.undefined
    })

    it('should set with a entity name, entity and a method', function() {
      let change = new Change('EntityName', { id: 1 }, 'delete')
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.method).to.equal('delete')
      expect(change.props).to.be.undefined
    })

    it('should set with a entity name, entity and a method', function() {
      let change = new Change('EntityName', { id: 1 }, 'delete', ['a', 'b'])
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.method).to.equal('delete')
      expect(change.props).to.deep.equal(['a', 'b'])
    })

    it('should set with a entity name and a method', function() {
      let change = new Change('EntityName', 'delete')
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.be.undefined
      expect(change.method).to.equal('delete')
      expect(change.props).to.be.undefined
    })

    it('should set with a entity name, a method and props', function() {
      let change = new Change('EntityName', 'delete', ['a', 'b'])
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.be.undefined
      expect(change.method).to.equal('delete')
      expect(change.props).to.deep.equal(['a', 'b'])
    })

    it('should set with a constructor function', function() {
      let change = new Change(TestEntity1)
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.method).to.be.undefined
      expect(change.props).to.be.undefined
    })

    it('should set with a constructor function and entity', function() {
      let change = new Change(TestEntity1, { id: 1 })
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.method).to.be.undefined
      expect(change.props).to.be.undefined
    })

    it('should set with a constructor function, entity and a method', function() {
      let change = new Change(TestEntity1, { id: 1 }, 'delete')
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.method).to.equal('delete')
      expect(change.props).to.be.undefined
    })

    it('should set with a constructor function, an entity, a method and props', function() {
      let change = new Change(TestEntity1, { id: 1 }, 'delete', ['a', 'b'])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.method).to.equal('delete')
      expect(change.props).to.deep.equal(['a', 'b'])
    })

    it('should set with a constructor function and a method', function() {
      let change = new Change(TestEntity1, 'delete')
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.method).to.equal('delete')
      expect(change.props).to.be.undefined
    })

    it('should set with a constructor function, a method and props', function() {
      let change = new Change(TestEntity1, 'delete', ['a', 'b'])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.method).to.equal('delete')
      expect(change.props).to.deep.equal(['a', 'b'])
    })

    it('should set with an entity', function() {
      let entity = new TestEntity1
      let change = new Change(entity)
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.equal(entity)
      expect(change.method).to.be.undefined
      expect(change.props).to.be.undefined
    })

    it('should set with an entity and a method', function() {
      let entity = new TestEntity1
      let change = new Change(entity, 'delete')
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.equal(entity)
      expect(change.method).to.equal('delete')
      expect(change.props).to.be.undefined
    })

    it('should set with an entity, a methods and props', function() {
      let entity = new TestEntity1
      let change = new Change(entity, 'delete', ['a', 'b'])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.method).to.equal('delete')
      expect(change.props).to.deep.equal(['a', 'b'])
    })
  })

  describe.only('isRelevantFor', function() {
    it('should be irrelevant if the entity name is not equal', function() {
      let d1 = new Change('a')
      let d2 = new Change('b')

      let result = d1.isRelevantFor(d2)

      expect(result).to.equal(false)
    })

    it('should be always relevant if there is no idProps on the given description', function() {
      let d1 = new Change('a', { id: 1 })
      let d2 = new Change('a')

      let result = d1.isRelevantFor(d2)

      expect(result).to.equal(true)
    })

    it('should be always relevant if there is no idProps on this description', function() {
      let d1 = new Change('a')
      let d2 = new Change('a', { id: 1 })

      let result = d1.isRelevantFor(d2)

      expect(result).to.equal(true)
    })

    it('should return true if the idProps is the same', function() {
      let change = new Change('a', { id: 1, parentId: 2 })
      let challenger = new Change('a', { id: 1, parentId: 2 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(true)
    })

    it('should return false if the idProps are not the same', function() {
      let change = new Change('a', { id: 1, parentId: 1 })
      let challenger = new Change('a', { id: 1, parentId: 2 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(false)
    })

    it('should return true if both values are null', function() {
      let change = new Change('a', { parentId: null })
      let challenger = new Change('a', { parentId: null })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(true)
    })

    it('should return false if one value is null and the other 0', function() {
      let change = new Change('a', { parentId: null })
      let challenger = new Change('a', { parentId: 0 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(false)
    })

    it('should return false if one value is null and the other undefined', function() {
      let change = new Change('a', { parentId: undefined })
      let challenger = new Change('a', { parentId: null })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(false)
    })

    it('should return true if the other description partially matches', function() {
      let change = new Change('a', { id: 1, parentId: 2 })
      let challenger = new Change('a', { parentId: 2 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(true)
    })

    it('should return false if this description is partially the same', function() {
      let change = new Change('a', { parentId: 2 })
      let challenger = new Change('a', { id: 1, parentId: 2 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.equal(false)
    })

    it('should return true even if the change defines a change method', function() {
      let change = new Change('a', { id: 1 }, 'update')
      let challenger = new Change('a', { id: 1 })

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return true even if the change does not define a change method', function() {
      let change = new Change('a', { id: 1 })
      let challenger = new Change('a', { id: 1 }, 'update')

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return true if both define the same change method', function() {
      let change = new Change('a', { id: 1 }, 'update')
      let challenger = new Change('a', { id: 1 }, 'update')

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return false if both define a different change method', function() {
      let change = new Change('a', { id: 1 }, 'update')
      let challenger = new Change('a', { id: 1 }, 'delete')

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.false
    })

    it('should return true if both define the same change method and the change props', function() {
      let change = new Change('a', { id: 1 }, 'update', ['a', 'b'])
      let challenger = new Change('a', { id: 1 }, 'update')

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return true if both define the same change method and the challenger props', function() {
      let change = new Change('a', { id: 1 }, 'update')
      let challenger = new Change('a', { id: 1 }, 'update', ['a', 'b'])

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return false if both define the same change method but different props', function() {
      let change = new Change('a', { id: 1 }, 'update', ['a'])
      let challenger = new Change('a', { id: 1 }, 'update', ['b'])

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.false
    })

    it('should return true if both define the same change method and the same props', function() {
      let change = new Change('a', { id: 1 }, 'update', ['b', 'a'])
      let challenger = new Change('a', { id: 1 }, 'update', ['a', 'b'])

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return true if there is at least one relevant description', function() {
      let change = new Change('a', { id: 1 })
      let challengers = [
        new Change('b'),
        new Change('c', { id: 2 }),
        new Change('a', { id: 1 }),
        new Change('d', { id: 4 })
     ]

      let result = change.isRelevantFor(challengers)

      expect(result).to.equal(true)
    })

    it('should return false if there is no satisfying description', function() {
      let change = new Change('a', { id: 1 })
      let challengers = [
        new Change('b'),
        new Change('c', { id: 2 }),
        new Change('a', { id: 3 }),
        new Change('d', { id: 4 })
     ]

      let result = change.isRelevantFor(challengers)

      expect(result).to.equal(false)
    })

    it('should use only the most specific descriptions', function() {
      let challengers = [
        new Change('EntityName1', { id: 1 }),
        new Change('EntityName1', { id: 1 }, 'delete', ['b']),
        new Change('EntityName2', { id: 1 }, 'update', ['a']),
     ]

      let change1 = new Change('EntityName1', { id: 1 }, 'update', ['a'])
      let result1 = change1.isRelevantFor(challengers)
      expect(result1).to.equal(true)

      let change2 = new Change('EntityName1', { id: 1 }, 'delete', ['a'])
      let result2 = change2.isRelevantFor(challengers)
      expect(result2).to.equal(false)

      let change3 = new Change('EntityName1', { id: 1 }, 'delete', ['b'])
      let result3 = change3.isRelevantFor(challengers)
      expect(result3).to.equal(true)

      let change4 = new Change('EntityName2', { id: 1 }, 'update', ['a'])
      let result4 = change4.isRelevantFor(challengers)
      expect(result4).to.equal(true)
    })
  })

  describe('equals', function() {
    it('should return true if everything is undefined', function() {
      let change1 = new Change
      let change2 = new Change
      expect(change1.equals(change2)).to.be.true
    })

    it('should not return true if for one everything is undefined but for the other the entity name is set', function() {
      let change1 = new Change
      let change2 = new Change('EntityName')
      expect(change1.equals(change2)).to.be.false
    })

    it('should not return true if for one everything is undefined but for the other the entity is set', function() {
      let change1 = new Change
      let change2 = new Change({ a: 'a' })
      expect(change1.equals(change2)).to.be.false
    })

    it('should not return true if for one everything is undefined but for the other the method is set', function() {
      let change1 = new Change
      let change2 = new Change
      change2.method = 'delete'
      expect(change1.equals(change2)).to.be.false
    })

    it('should not return true if for one everything is undefined but for the other props are set', function() {
      let change1 = new Change
      let change2 = new Change
      change2.props = ['a', 'b']
      expect(change1.equals(change2)).to.be.false
    })

    it('should return true if the entity name is the same', function() {
      let change1 = new Change('EntityName')
      let change2 = new Change('EntityName')
      expect(change1.equals(change2)).to.be.true
    })

    it('should not return true if the entity name is different', function() {
      let change1 = new Change('EntityName1')
      let change2 = new Change('EntityName2')
      expect(change1.equals(change2)).to.be.false
    })

    it('should return true if the entity has the same props', function() {
      let change1 = new Change({ a: 'a', b: 'b' })
      let change2 = new Change({ a: 'a', b: 'b' })
      expect(change1.equals(change2)).to.be.true
    })

    it('should not return true if the entity has different props', function() {
      let change1 = new Change({ a: 'a', b: 'b' })
      let change2 = new Change({ a: 'a' })
      expect(change1.equals(change2)).to.be.false
    })

    it('should not return true if the entity has the same props but with different values', function() {
      let change1 = new Change({ a: 'a', b: 'b' })
      let change2 = new Change({ a: 'a', b: 'c' })
      expect(change1.equals(change2)).to.be.false
    })

    it('should return true if the method is the same', function() {
      let change1 = new Change
      let change2 = new Change
      change1.method = 'delete'
      change2.method = 'delete'
      expect(change1.equals(change2)).to.be.true
    })

    it('should not return true if the methods are different', function() {
      let change1 = new Change
      let change2 = new Change
      change1.method = 'delete'
      change2.method = 'update'
      expect(change1.equals(change2)).to.be.false
    })

    it('should return true if the props are the same', function() {
      let change1 = new Change
      let change2 = new Change
      change1.props = ['a', 'b']
      change2.props = ['a', 'b']
      expect(change1.equals(change2)).to.be.true
    })

    it('should not return true if the props are different', function() {
      let change1 = new Change
      let change2 = new Change
      change1.props = ['a', 'b']
      change2.props = ['a']
      expect(change1.equals(change2)).to.be.false
    })
  })

  // describe('containsMethod', function() {
  //   it('should return true if the method is contained', function() {
  //     expect(new Change('A', 'delete').containsMethod('delete')).to.be.true
  //     expect(new Change('A', ['delete', 'update']).containsMethod('delete')).to.be.true
  //     expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod('delete')).to.be.true
  //     expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod('update')).to.be.true
  //     expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod({ method: 'update', props: ['a'] })).to.be.true
  //     expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a', 'b'] }]).containsMethod({ method: 'update', props: ['a', 'b'] })).to.be.true
  //   })

  //   it('should return false if the method is not contained', function() {
  //     expect(new Change('A', 'delete').containsMethod('create')).to.be.false
  //     expect(new Change('A', ['delete', 'update']).containsMethod('create')).to.be.false
  //     expect(new Change('A', 'update').containsMethod({ method: 'update', props: ['b'] })).to.be.false
  //     expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod('create')).to.be.false
  //     expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod('create')).to.be.false
  //     expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod({ method: 'update', props: ['b'] })).to.be.false
  //     expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod({ method: 'update', props: ['a', 'b'] })).to.be.false
  //     expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a', 'b'] }]).containsMethod({ method: 'update', props: ['a', 'b', 'c'] })).to.be.false
  //   })
  // })
})

class TestEntity1 {}