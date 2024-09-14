// // ���������� ��������� 'message-row'
// const MessageRow = {
//     props: ['message'],
//     template: '<div><i>{{ message.id }}</i> {{ message.text }}</div>'
// };
//
// // ���������� ��������� 'messages-list'
// const MessagesList = {
//     props: ['messages'],
//     template: `
//         <div>
//             <message-row
//                 v-for="message in messages"
//                 :key="message.id"
//                 :message="message" />
//         </div>
//     `,
//     created() {
//         // ���������� fetch ��� ��������� ������
//         fetch('/message')
//             .then(response => response.json())
//             .then(result => {
//                 // ��������� ������ ���������
//                 this.$emit('update:messages', result);
//                 console.log(result);
//             })
//             .catch(error => console.error('������ ��� �������� ���������:', error));
//     }
// };
//
// // ������ ����������
// const app = Vue.createApp({
//     data() {
//         return {
//             messages: []
//         };
//     },
//     template: '<messages-list :messages.sync="messages" />', // ���������� .sync ��� ����������
// });
//
// // ������������ ����������
// app.component('message-row', MessageRow);
// app.component('messages-list', MessagesList);
//
// // ��������� ����������
// app.mount('#app');
var messageApi = Vue.resource('/message{/id}')


Vue.component('message-row', {
    props: ['message'],

    template: '<div><i>({{ message.id }})</i> {{ message.text }}</div>'
});

Vue.component('messages-list', {
    props: ['messages'],
    template: '<div><message-row v-for="message in messages" '+ 'v-bind:key="message.id" :message="message" /> </div>',
    created: function (){
        messageApi.get().then(result=>
        result.json().then(data =>
        data.forEach(message =>  this.messages.push(message))))
    }
      });

var app = new Vue({
    el: '#app',
    template: '<messages-list :messages="messages"/>',
    data: {
        messages: [

        ]
    }
});