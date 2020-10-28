import { expect } from 'chai'
import 'mocha'
import { Change } from '../src/Change'

describe('Change', function() {
  describe('constructor', function() {
    it('should set with a entity name', function() {
      let change = new Change('EntityName')
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.be.undefined
      expect(change.methods).to.be.undefined
    })

    it('should set with a entity name and entity', function() {
      let change = new Change('EntityName', { id: 1 })
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.methods).to.be.undefined
    })

    it('should set with a entity name, entity and a method', function() {
      let change = new Change('EntityName', { id: 1 }, 'delete')
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.methods).to.deep.equal([{ method: 'delete' }])
    })

    it('should set with a entity name, entity and a method object', function() {
      let change = new Change('EntityName', { id: 1 }, { method: 'delete' })
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.methods).to.deep.equal([{ method: 'delete' }])
    })

    it('should set with a entity name, entity and methods string array', function() {
      let change = new Change('EntityName', { id: 1 }, [ 'delete', 'update' ])
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.methods).to.deep.equal([{ method: 'delete'}, { method: 'update' }])
    })

    it('should set with a entity name, entity and methods mixed array', function() {
      let change = new Change('EntityName', { id: 1 }, ['delete', { method: 'update', props: [ 'property' ]}])
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.methods).to.deep.equal([{ method: 'delete'}, { method: 'update', props: [ 'property' ]}])
    })

    it('should set with a entity name and a method', function() {
      let change = new Change('EntityName', 'delete')
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.be.undefined
      expect(change.methods).to.deep.equal([{ method: 'delete' }])
    })

    it('should set with a entity name and a method object', function() {
      let change = new Change('EntityName', { method: 'delete' })
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.be.undefined
      expect(change.methods).to.deep.equal([{ method: 'delete' }])
    })

    it('should set with a entity name and methods string array', function() {
      let change = new Change('EntityName', [ 'delete', 'update' ])
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.be.undefined
      expect(change.methods).to.deep.equal([{ method: 'delete'}, { method: 'update' }])
    })

    it('should set with a entity name and methods mixed array', function() {
      let change = new Change('EntityName', ['delete', { method: 'update', props: [ 'property' ]}])
      expect(change.entityName).to.equal('EntityName')
      expect(change.entity).to.be.undefined
      expect(change.methods).to.deep.equal([{ method: 'delete'}, { method: 'update', props: [ 'property' ]}])
    })

    it('should set with a constructor function', function() {
      let change = new Change(TestEntity1)
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.methods).to.be.undefined
    })

    it('should set with a constructor function and entity', function() {
      let change = new Change(TestEntity1, { id: 1 })
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.methods).to.be.undefined
    })

    it('should set with a constructor function, entity and a method', function() {
      let change = new Change(TestEntity1, { id: 1 }, 'delete')
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.methods).to.deep.equal([{ method: 'delete' }])
    })

    it('should set with a constructor function, entity and a method object', function() {
      let change = new Change(TestEntity1, { id: 1 }, { method: 'delete' })
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.methods).to.deep.equal([{ method: 'delete' }])
    })

    it('should set with a constructor function, entity and methods string array', function() {
      let change = new Change(TestEntity1, { id: 1 }, [ 'delete', 'update' ])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.methods).to.deep.equal([{ method: 'delete'}, { method: 'update' }])
    })

    it('should set with a constructor function, entity and methods mixed array', function() {
      let change = new Change(TestEntity1, { id: 1 }, ['delete', { method: 'update', props: [ 'property' ]}])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ id: 1 })
      expect(change.methods).to.deep.equal([{ method: 'delete'}, { method: 'update', props: [ 'property' ]}])
    })

    it('should set with a constructor function and a method', function() {
      let change = new Change(TestEntity1, 'delete')
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.methods).to.deep.equal([{ method: 'delete' }])
    })

    it('should set with a constructor function and a method object', function() {
      let change = new Change(TestEntity1, { method: 'delete' })
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.methods).to.deep.equal([{ method: 'delete' }])
    })

    it('should set with a constructor function and methods string array', function() {
      let change = new Change(TestEntity1, [ 'delete', 'update' ])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.methods).to.deep.equal([{ method: 'delete'}, { method: 'update' }])
    })

    it('should set with a constructor function and methods mixed array', function() {
      let change = new Change(TestEntity1, ['delete', { method: 'update', props: [ 'property' ]}])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.methods).to.deep.equal([{ method: 'delete'}, { method: 'update', props: [ 'property' ]}])
    })

    it('should set with an entity', function() {
      let entity = new TestEntity1
      let change = new Change(entity)
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.equal(entity)
      expect(change.methods).to.be.undefined
    })

    it('should set with an entity and a method', function() {
      let entity = new TestEntity1
      let change = new Change(entity, 'delete')
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.equal(entity)
      expect(change.methods).to.deep.equal([{ method: 'delete' }])
    })

    it('should set with an entity and a method object', function() {
      let entity = new TestEntity1
      let change = new Change(entity, { method: 'delete' })
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.equal(entity)
      expect(change.methods).to.deep.equal([{ method: 'delete' }])
    })

    it('should set with an entity and methods string array', function() {
      let entity = new TestEntity1
      let change = new Change(entity, [ 'delete', 'update' ])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.equal(entity)
      expect(change.methods).to.deep.equal([{ method: 'delete'}, { method: 'update' }])
    })

    it('should set with an entity and methods mixed array', function() {
      let entity = new TestEntity1
      let change = new Change(entity, ['delete', { method: 'update', props: [ 'property' ]}])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.equal(entity)
      expect(change.methods).to.deep.equal([{ method: 'delete'}, { method: 'update', props: [ 'property' ]}])
    })
  })

  describe('isRelevantFor', function() {
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
      let change = new Change('a', { id: 1 }, { method: 'update', props: ['a', 'b']})
      let challenger = new Change('a', { id: 1 }, 'update')

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return true if both define the same change method and the challenger props', function() {
      let change = new Change('a', { id: 1 }, 'update')
      let challenger = new Change('a', { id: 1 }, { method: 'update', props: ['a', 'b']})

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.true
    })

    it('should return false if both define the same change method but different props', function() {
      let change = new Change('a', { id: 1 }, { method: 'update', props: ['a']})
      let challenger = new Change('a', { id: 1 }, { method: 'update', props: ['b']})

      let result = change.isRelevantFor(challenger)

      expect(result).to.be.false
    })

    it('should return true if both define the same change method and the same props', function() {
      let change = new Change('a', { id: 1 }, { method: 'update', props: ['b', 'a']})
      let challenger = new Change('a', { id: 1 }, { method: 'update', props: ['a', 'b']})

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
        new Change('EntityName1', { id: 1 }, { method: 'delete', props: ['prop2'] }),
        new Change('EntityName2', { id: 1 }, { method: 'update', props: ['prop1'] }),
      ]

      let change1 = new Change('EntityName1', { id: 1 }, { method: 'update', props: ['prop1'] })
      let result1 = change1.isRelevantFor(challengers)
      expect(result1).to.equal(true)

      let change2 = new Change('EntityName1', { id: 1 }, { method: 'delete', props: ['prop1'] })
      let result2 = change2.isRelevantFor(challengers)
      expect(result2).to.equal(false)

      let change3 = new Change('EntityName1', { id: 1 }, { method: 'delete', props: ['prop2'] })
      let result3 = change3.isRelevantFor(challengers)
      expect(result3).to.equal(true)

      let change4 = new Change('EntityName2', { id: 1 }, { method: 'update', props: ['prop1'] })
      let result4 = change4.isRelevantFor(challengers)
      expect(result4).to.equal(true)
    })
  })

  describe('containsMethod', function() {
    it('should return true if the method is contained', function() {
      expect(new Change('A', 'delete').containsMethod('delete')).to.be.true
      expect(new Change('A', [ 'delete', 'update' ]).containsMethod('delete')).to.be.true
      expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod('delete')).to.be.true
      expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod('update')).to.be.true
    })

    it('should return false if the method is not contained', function() {
      expect(new Change('A', 'delete').containsMethod('create')).to.be.false
      expect(new Change('A', [ 'delete', 'update' ]).containsMethod('create')).to.be.false
      expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod('create')).to.be.false
      expect(new Change('A', [{ method: 'delete' }, { method: 'update', props: ['a'] }]).containsMethod('create')).to.be.false
    })
  })
})

class TestEntity1 {}