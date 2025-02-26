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

function getIndex(list, id) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}


var messageApi = Vue.resource('/message{/id}')

Vue.component('message-form', {
    props: ['messages','messageAttr'],
    data: function (){
    return{
        text: '',
        id: ''
    }
    },
    watch: {
        messageAttr: function (newVal,oldVal) {
            this.text =newVal.text;
            this.id =newVal.id;
        }
    },
template:
    '<div>'+
    '<input type="text" placeholder="�������� ���-������" v-model="text" />'+
    '<input type="button" value="���������" @click="save" />'+
    '</div>',
methods: {
        save: function (){
            var message = {text: this.text}

            if (this.id){
                messageApi.update({id: this.id},message).then(result=>
                result.json().then(data=>{
                    var index=getIndex(this.messages, data.id);
                    this.messages.splice(index,1,data);
                    this.text = '';
                    this.id='';
                }))
            }
            else {
            messageApi.save({}, message).then(result=>
            result.json().then(data=> {
                this.messages.push(data);
                this.text = '';
                this.id='';
            })
            )
            }
        }
}
}
);



Vue.component('message-row', {
    props: ['message', 'editMethod','messages'],

    template:
        '<div>' +
        '<i>{{ message.id }}</i> {{ message.text }}' +
        '<span style="position: absolute; right: 0">' +
        '<input type="button" value="�������������" @click="edit" />' +
        '<input type="button" value="X" @click="del" />' +
        '</span>' +
        '</div>',
    methods: {
        edit: function () {
            this.editMethod(this.message);
        },
        del: function () {
            messageApi.remove({id: this.message.id}).then(result=>{
                if(result.ok){
                    this.messages.splice(this.messages.indexOf(this.message),1)
                }
            })
        },
    }


});

Vue.component('messages-list', {
    props: ['messages'],
    data: function (){
        return{
            message: null
        }
    },

    template: '<div style="position: relative; width: 300px;">'+
        '<message-form :messages="messages" :messageAttr="message"/>' +
        '<message-row  v-for="message in messages" :key="message.id"' +
        ':editMethod="editMethod"'+
        ':message="message" :messages="messages" />' +
        '</div>',
    created: function (){
        messageApi.get().then(result=>
        result.json().then(data =>
        data.forEach(message =>  this.messages.push(message))))
    },
    methods: {
        editMethod: function (message){
            this.message=message;
        }
    }
      });

var app = new Vue({
    el: '#app',
    template: '<messages-list :messages="messages"/>',
    data: {
        messages: []
    }
});