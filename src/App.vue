<template>
<div class="container">
  <Header @toggle-add-task="toggleButton" title="Task Tracker" :showAddTask="showAddTask"/>
    <div v-if="showAddTask">
  <AddTask @add-task="addTask" />
  </div>
  <Tasks @toggle-reminder="toggleReminder" @delete-task="deleteTask" :tasks="tasks"/>
  <router-view></router-view>
  <Footer />
</div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue';
import Tasks from './components/Tasks.vue';
import AddTask from './components/AddTask.vue';


export default {
  name: 'App',
  components: {
    Header,
    Tasks,
    AddTask,
    Footer
  },
  data(){
    return{
      tasks:[],
      showAddTask:false
    }
  },
  methods:{
    async addTask(task){
      // this.tasks.push(newTask)
      const res = await fetch('http://localhost:3000/tasks',{
        method:'POST',
        headers:{
          'Content-type':'application/json',
        },
        body:JSON.stringify(task)
      })
      const data = await res.json()

      this.tasks = [...this.tasks,data]
    },
    async deleteTask(id){
      if(confirm('Are you Sure?')){
        const res = await fetch(`http://localhost:3000/tasks/${id}`,{
          method:'DELETE'
        })
        res.status === 200 ? (this.tasks = this.tasks.filter((task) => task.id !== id)) : alert('Error Deleting task')
      }
    },
   async  toggleReminder(id){
     const taskToToggle = await this.fetchTask(id)
     const updTask = {...taskToToggle,reminder:!taskToToggle.reminder}
     const res = await fetch(`http://localhost:3000/tasks/${id}`,{
       method:'PUT',
       headers:{
         'Content-type':'application/json'
       },
       body:JSON.stringify(updTask)
     })

      const data = await res.json()

      this.tasks = this.tasks.map((task) => task.id === id ? {...task,reminder:data.reminder}:task)
    },
    toggleButton(){
      this.showAddTask = !this.showAddTask
    },
    async fetchTasks(){
      const res = await fetch('http://localhost:3000/tasks')
      const data = await res.json()

      return data
    }
    ,
    async fetchTask(id){
      const res = await fetch(`http://localhost:3000/tasks/${id}`)
      const data = await res.json()

      return data
    }

  },
  async created(){
    this.tasks = await this.fetchTasks()
  }
}
</script>

<style>
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body{
  font-family: Arial, Helvetica, sans-serif;
}

.container{
  max-width: 500px;
  margin: 30px auto;
  overflow: auto;
  min-height: 300px;
  border: 1px solid steelblue;
  padding: 30px;
  border-radius: 5px;
}

.btn{
  display: inline-block;
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.btn:focus{
  outline: none;
}

.btn:active{
  transform: scale(0.98);
}
</style>
