# Knight Change by Coderitter

A data structure to describe and listen to changes of entities. It is a great fit for updating user interfaces like in a React app. The React components can rerender if any of the entities they display change.

## Install

`npm install knight-change`

## Overview

There is a `Change` class which is used for describing a change and to describe a listener which wants to react to certain changes.

### Describe a change

A change object consists of the entity that changed, the name of that entity and one of the methods create, update or delete.

```typescript
import { Change } from 'knight-change'

/* a new task is created */
let task = new Task
task.id = 5,
task.title = 'Clean up room'

let createChange = new Change(task, 'create')

createChange.entityName == 'Task'
createChange.entity == { id: 5, title: 'Clean up room' }
createChange.method == { method: 'create' }

/* the task is updated */
task.title = 'Clean up room and do homework'

let updateChange = new Change(task, { method: 'update', props: ['title'] })

updateChange.entityName == 'Task'
updateChange.entity = { id: 5, title: 'Clean up room and do homework' }
// if we describe an update change we can add the information which properties changed
updateChange.method = { method: 'update', props: ['title'] }

/* the task is deleted */
task = undefined

let deleteChange = new Change(task, 'delete')

deleteChange.entityName == 'Task'
deleteChange.entity = { id: 5, title: 'Clean up room and do homework' }
deleteChange.method = { method: 'delete' }
```

### Describe a change listener that wants to react on certain changes

```typescript
/* listen to any change of any task */
new Change(Task)
new Change('Task')

/* listen to any change of a task with id 5 */
new Change(Task, { id: 5 })
new Change('Task', { id: 5 })
new Change(new Task(5))

/* listen to any update of a task with id 5 */
new Change(Task, { id: 5 }, 'update')
new Change('Task', { id: 5 }, 'update')
new Change(new Task(5), 'update')

/* listen to any title update of a task with id 5 */
new Change(Task, { id: 5 }, { method: 'update', props: ['title'] })
new Change('Task', { id: 5 }, { method: 'update', props: ['title'] })
new Change(new Task(5), { method: 'update', props: ['title'] })

/* listen to any title update of any task */
new Change(Task, { method: 'update', props: ['title'] })
new Change('Task', { method: 'update', props: ['title'] })

/* listen to any title update or deletion of any task */
new Change(Task, ['delete', { method: 'update', props: ['title'] }])
new Change('Task', ['delete', { method: 'update', props: ['title'] }])

/* listen to any title update or deletion of task with id 5 */
new Change(Task, { id: 5 }, ['delete', { method: 'update', props: ['title'] }])
new Change('Task', { id: 5 }, ['delete', { method: 'update', props: ['title'] }])
new Change(new Task(5), ['delete', { method: 'update', props: ['title'] }])
```

### Check if a change is relevant for a listener

```typescript
change.isRelevantFor(listener)

let listeners = [ listener1, listener2, listener3 ]
change.isRelevantFor(listeners)
```

### Combine multiple changes

To combine multiple changes you can use the class `Changes`.

```typescript
let changes = new Changes(change1, change2, change3)
changes.isRelevantFor(listener)

let listeners = [ listener1, listener2, listener3 ]
changes.isRelevantFor(listeners)
```

### Refine listener

If there are two listeners, one more specific than the other, the most specific listener is chosen.

```typescript
// listens to any change of a task with id 5
let listener1 = new Change(Task, { id: 5 })
// listens to any update of a task with id 5 for the property title
let listener2 = new Change(Task, { id: 5 }, { method: 'update' props: ['title'] })

let listeners = [ description1, description2 ]

// is relevant because the title changed
let change1 = new Change(new Task(5), { method: 'update', props: ['title'] })
change1.isRelevantFor(listeners) == true

// is not relevant because the description changed and listener2 only listens to title changes
// meanwhile listener1 is ignored because listener2 is defining the behaviour for updates
let change2 = new Change(new Task(5), { method: 'update', props: ['description'] })
change2.isRelevantFor(listeners) == false

// is relevant because of listener1
// meanwhile listener2 is ignored because it is only relevant for updates
let change3 = new Change(new Task(5), 'delete')
change3.isRelevantFor(listeners) == true
```

We have two competing rules for tasks with an `id` of 5. If the incoming change is an update change then `listener2` used. In any other case `listener1` is used. That means in the case of an update the listener is only interested if the changed property was the `title`.

### Unspecific changes

A change may also be more unspecific. That way you can activate even listeners which otherwise would require a certain change.

```typescript
// relevant to any listener which reacts to a task change in some kind of way
let change = new Change(Task)

// a listener which only listens to the deletion of a task with id 5
let listener = new Change(Task, { id: 5 }, { method: 'delete' })

// the change is nonetheless relevant for the listener because the entity name is the same
change.isRelevantFor(listener) == true
```

Here is an example where a more unspecific change is not relevant for a listener.

```typescript
// relevant to any listener which reacts to a Task with id 5 in some kind of way
let change = new Change(Task, { id: 5 })

// a listener which only listens to the deletion of a task with id 7
let listener = new Change(Task, { id: 7 }, 'delete')

// the change is not relevant for the listener because the ids differ
change.isRelevantFor(listener) == false
```