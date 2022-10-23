import {
    changeTaskEntityStatusAC, tasksReducer,
    TasksStateType
} from 'components/todolists/reducers/tasks-reducer';
import {todoListsActions} from 'components/todolists/index';
import {TaskPriorities, TaskStatuses, TaskType, TodoListType} from "api/todoListsAPI";
import {useActions} from "app/store";
import {tasksActions} from "components/todolists/index";

let startState: TasksStateType
let initialState: TasksStateType
let task: TaskType
let todoLists: Array<TodoListType>
let todolist: TodoListType
const {removeTask, updateTask, addTask, fetchTasks} = useActions(tasksActions)

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle,
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle,
                entityStatus: "idle"
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle,
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle,
                entityStatus: "idle"
            }
        ]
    };
    initialState = {
        "todolistId1": [],
        "todolistId2": []
    }
    task = {
        id: "0",
        title: "New task",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        order: 0,
        addedDate: '',
        deadline: '',
        startDate: '',
        description: '',
        priority: TaskPriorities.Middle
    }
    todoLists = [
        {id: 'todolistId1', title: 'Todo1', order: 0, addedDate: ''},
        {id: 'todolistId2', title: 'Todo2', order: 0, addedDate: ''},
        {id: 'todolistId3', title: 'Todo3', order: 0, addedDate: ''}
    ]
    todolist = {id: 'todolistId3', title: 'New todo', order: 0, addedDate: ''}
})

test('Add empty tasks to the desired todolist', () => {
    const action = todoListsActions.fetchTodoLists.fulfilled(todoLists, '')

    const endState = tasksReducer({}, action)

    expect(endState['todolistId1']).toEqual([])
    expect(endState['todolistId2']).toEqual([])
    expect(endState['todolistId3']).toEqual([])
    expect(endState['todolistId4']).toBeUndefined()
})
test('Get a list of tasks in the correct todolist', () => {
    const action = fetchTasks.fulfilled( {tasks: startState['todolistId1'], todolistId: 'todolistId1'}, '', 'todolistId1' )

    const endState = tasksReducer(initialState, action)

    expect(endState['todolistId2'].length).toBe(0)
    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId1'][0].title).toBe("CSS")
    expect(endState['todolistId1'][2].id).toBe("3")
    expect(endState['todolistId1'][4]).toBeUndefined()
});
test('Correct task should be deleted from correct array', () => {
    const action = removeTask.fulfilled({todolistId: "todolistId2", taskId: "2"}, '', {todolistId: "todolistId1", taskId: "2"} );

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'].length).toBe(2);
    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'][1].id).toBe('3');
    expect(endState['todolistId1'][1].id).toBe('2');
    expect(endState['todolistId2'][2]).toBeUndefined();

});
test('Correct task should be added to correct array', () => {
    const action = addTask.fulfilled({task}, '', {todolistId: 'todolistId1', title: 'Title'});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBe('0');
    expect(endState["todolistId2"][0].title).toBe("New task");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.Completed);
})
test('Task entity status should be changed', () => {
    const action = changeTaskEntityStatusAC( {todolistId: 'todolistId1', taskId: '1', entityStatus: 'loading'} )

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(3)
    expect(endState['todolistId1'][0].entityStatus).toBe('loading')
    expect(endState['todolistId2'][0].entityStatus).toBe('idle')
})
test('Status and title of specified task should be changed', () => {
    task.id = '1'
    const action = updateTask.fulfilled(task, '', { todolistId: 'todolistId2', taskId: 'TaskId2', domainModel: task })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(3)
    expect(endState['todolistId2'][0].id).toBe('1')
    expect(endState['todolistId2'][0].title).toBe('New task')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.Completed)
});
test('Add empty array to new todoList', () => {
    const action = todoListsActions.addTodolist.fulfilled(todolist, '', 'Title1')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId3']).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('bread')
})
test('Delete todolistId', () => {
    const action = todoListsActions.removeTodolist.fulfilled("todolistId2", '', "todolistId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
