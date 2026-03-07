Vue.component('kanban-card', {
    props: ['card'],
    template: `
        <div class="card">
            <div class="card-header">
                <h3>{{ card.title }}</h3>
                <div class="card-actions">
                    <button @click="$emit('edit-card', card)">E</button>
                    <button v-if="card.columnId === 1" @click="$emit('delete-card', card)">X</button>
                    <button v-if="card.columnId === 1" @click="$emit('move-card', card, 2)">R</button>
                    <button v-if="card.columnId === 2" @click="$emit('move-card', card, 3)">R</button>
                    <button v-if="card.columnId === 3">
                        <button @click="$emit('move-card', card, 4)">R</button>
                        <button @click="$emit('move-card', card, 2)">L</button>
                    </button>
                </div>
            </div>
            <p>{{ card.description }}</p>
            <div class="date">Created: {{ card.createdAt }}</div>
            <div class="date">Deadline: {{ card.deadline }}</div>
            <div v-if="card.lastEdited" class="date">Edited: {{ card.lastEdited }}</div>
        </div>
    `,
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
                    @move-card="$emit('move-card', card, $event)">
                </kanban-card>
            </div>
            <button v-if="column.id === 1" @click="$emit('add-card')">+ Add card</button>
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
        cards: [
            {
                id: 1,
                columnId: 1,
                title: 'Тестовая задача',
                description: 'Описание задачи',
                createdAt: new Date().toLocaleDateString(),
                deadline: '2026-03-15',
                lastEdited: null
            }
        ],
    },
    methods: {
        getCardsByColumn(columnId) {
            return this.cards.filter(card => card.columnId === columnId)
        },
        addCard() {
            let title = prompt('Введите заголовок задачи:')
            if (!title) return

            let description = prompt('Введите описание задачи:')
            if (!description) return

            let deadline = prompt('Введите дедлайн (ГГГГ-ММ-ДД):')
            if (!deadline) return

            let newCard = {
                id: Date.now(),
                columnId: 1,
                title: title,
                description: description,
                createdAt: new Date().toLocaleDateString(),
                deadline: deadline,
                lastEdited: null
            }
            
            this.cards.push(newCard)
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
        moveCard(card, targetColumnId) {
            card.columnId = targetColumnId
            card.lastEdited = new Date().toLocaleString()
        },
    }
})