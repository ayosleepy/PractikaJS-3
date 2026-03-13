Vue.component('add-task-form', {
    data() {
        return {
            title: '',
            description: '',
            deadline: ''
        }
    },
    template: `
        <div class="add-form">
            <h3>New Task</h3>
            <p>
                <label>Title:</label>
                <input v-model="title" placeholder="Enter title">
            </p>
            <p>
                <label>Description:</label>
                <textarea v-model="description" placeholder="Enter description"></textarea>
            </p>
            <p>
                <label>Deadline:</label>
                <input type="date" v-model="deadline">
            </p>
            <button @click="addTask">Add Task</button>
        </div>
    `,
    methods: {
        addTask() {
            if (!this.title || !this.description || !this.deadline) {
                alert('Please fill all fields')
                return
            }
            
            let newCard = {
                id: Date.now(),
                columnId: 1,
                title: this.title,
                description: this.description,
                createdAt: new Date().toLocaleDateString(),
                deadline: this.deadline,
                lastEdited: null
            }
            
            this.$emit('add-task', newCard)
            
            this.title = ''
            this.description = ''
            this.deadline = ''
        }
    }
})

Vue.component('kanban-card', {
    props: ['card'],
    data() {
        return {
            showReturnReason: false,
            returnReason: ''
        }
    },
    template: `
        <div class="card">
            <div class="card-header">
                <h3>{{ card.title }}</h3>
                <div class="card-actions">
                    <button @click="$emit('edit-card', card)">E</button>
                    <button @click="$emit('delete-card', card)">X</button>
                    <button v-if="card.columnId === 1" @click="$emit('move-card', card, 2)">R</button>
                    <button v-if="card.columnId === 2" @click="$emit('move-card', card, 3)">R</button>
                    <button v-if="card.columnId === 3" @click="$emit('move-card', card, 4)">R</button>
                    <button v-if="card.columnId === 3" @click="showReturnReason = true">L</button>
                </div>
            </div>
        
            <div v-if="showReturnReason" style="margin-top: 10px; padding: 10px; background: #f5f5f5;">
                <input v-model="returnReason" placeholder="Причина возврата" style="width: 100%; margin-bottom: 5px; padding: 5px;">
                <button @click="confirmReturn(card)">Подтвердить</button>
                <button @click="showReturnReason = false">Отмена</button>
            </div>

            <p>{{ card.description }}</p>
            <div class="date">Created: {{ card.createdAt }}</div>
            <div class="date">Deadline: {{ card.deadline }}</div>
            <div v-if="card.lastEdited" class="date">Edited: {{ card.lastEdited }}</div>
            <div v-if="card.columnId === 4" :class="['deadline', isOverdue(card) ? 'overdue' : 'ontime']">
                {{ isOverdue(card) ? 'Просрочено' : 'Выполнено в срок' }}
            </div>
            <div v-if="card.returnReason" class="date">
                Причина возврата: {{ card.returnReason }}
            </div>
        </div>
    `,
    methods: {
        isOverdue(card) {
            let today = new Date()
            let deadline = new Date(card.deadline)
            return deadline < today
        },
        confirmReturn(card) {
            if (this.returnReason) {
                this.$emit('move-card', card, 2, this.returnReason)
                this.showReturnReason = false
                this.returnReason = ''
            }
        }
    }
})

Vue.component('kanban-column', {
    props: {
        column: Object,
        cards: Array
    },
    template: `
        <div class="column">
            <h2>{{ column.title }}</h2>
            <div class="cards">
                <kanban-card
                    v-for="card in cards"
                    :key="card.id"
                    :card="card"
                    @edit-card="$emit('edit-card', card)"
                    @delete-card="$emit('delete-card', card)"
                    @move-card="(card, target) => $emit('move-card', card, target)">
                </kanban-card>
            </div>
        </div>
    `,
})

let app = new Vue({
    el: '#app',
    data: {
        columns: [
            { id: 1, title: 'Запланированные задачи' },
            { id: 2, title: 'Задачи в работе' },
            { id: 3, title: 'Тестирование' },
            { id: 4, title: 'Выполненные задачи' }
        ],
        cards: [],
    },
    methods: {
        getCardsByColumn(columnId) {
            return this.cards.filter(card => card.columnId === columnId)
        },
        editCard(card) {
            let newTitle = prompt('Изменить заголовок:', card.title)
            if (newTitle) card.title = newTitle

            let newDescription = prompt('Изменить описание:', card.description)
            if (newDescription) card.description = newDescription

            let newDeadline = prompt('Изменить дедлайн (ГГГГ-ММ-ДД):', card.deadline)
            if (newDeadline) card.deadline = newDeadline

            card.lastEdited = new Date().toLocaleString()
        },
        deleteCard(card) {
            if (confirm('Удалить задачу?')) {
                let index = this.cards.findIndex(c => c.id === card.id)
                if (index !== -1) {
                    this.cards.splice(index, 1)
                }
            }
        },
        moveCard(card, targetColumnId, reason = null) {
            card.columnId = targetColumnId
            card.lastEdited = new Date().toLocaleString()
            if (reason) {
                card.returnReason = reason
            }
        },
        addTaskFromForm(newCard) {
            this.cards.push(newCard)
        }
    },
    watch: {
        cards: {
            handler() {
                localStorage.setItem('kanban', JSON.stringify(this.cards))
            },
            deep: true
        }
    },
    mounted() {
        let saved = localStorage.getItem('kanban')
        if (saved) {
            this.cards = JSON.parse(saved)
        }
    }
})