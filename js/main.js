Vue.component('kanban-card', {
    props: ['card'],
    template: `
        <div class="card">
            <div class="card-header">
                <h3>{{ card.title }}</h3>
                <div class="card-actions">
                    <button @click="$emit('edit-card', card)">E</button>
                    <button v-if="card.columnId === 1" @click="$emit('delete-card', card)">X</button>
                </div>
            </div>
            <p>{{ card.description }}</p>
            <div class="date">Created: {{ card.createdAt }}</div>
            <div class="date">Deadline: {{ card.deadline }}</div>
            <div v-if="card.lastEdited" class="date">Edited: {{ card.lastEdited }}</div>
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
        cards: []
    }
})