const tasks= []; //para almacenar las tareas
let time=0; //para la cuenta regresiva
let timer=null;
let  timerBreak=null; //para el tiempo de descanso
let current= null;//dice la tarea actual que se está ejecutando

const bAdd=document.querySelector("#bAdd");
const itTask=document.querySelector("#itTask");
const form=document.querySelector("#form");
const taskName = document.querySelector('#time #taskName');

renderTime();
renderTasks();
//eventos

form.addEventListener('submit', e =>{
    e.preventDefault();
    if(itTask.value !==''){//si el valor de itTask es diferente a un string vacío
       createTask(itTask.value);//creo una task
       itTask.value='';
       renderTasks();
    }
});

function createTask(value){ 

    const newTask={ //objeto que va a ser nuestra tarea
        id:(Math.random()*100).toString(36).slice(3),//genera un núm de id
        title:value,
        completed:false
    };
    tasks.unshift(newTask);
}

function renderTasks(){//transforma cada uno de los objetos de la función createTask en un elemento html
    const html= tasks.map(task => {
        return `
        <div class="task">
        <div class="completed">${task.completed ? 
            // `<span class="done">Done </span>`: 
            `<input type="checkbox" checked></input>`:
            `<button class="start-button" data-id="${task.id}">Start</button>`} </div>
        <div class="title">${task.title}</div>
        </div>
        `;
        
    });

    const taskContainer= document.querySelector('#tasks');
    taskContainer.innerHTML=html.join('');

    const startButtons= document.querySelectorAll('.task .start-button');
    startButtons.forEach(button =>{
        button.addEventListener('click', e =>{
            if(!timer){
                const id=button.getAttribute('data-id')
                startButtonsHandler(id);
                button.textContent="In progress..."
            }
        })
    })
}

function startButtonsHandler(id){ //para calcular los 25 minutos de la actividad principal
    time=25 * 60;
    // time=5;
   current= id; //el id de la actividad actual
   const taskIndex= tasks.findIndex(task => task.id===id)//cuando el el id de la task coincida con el id pasado me lo almacena acá
   
   taskName.textContent=tasks[taskIndex].title;//el nombre de la actividad
renderTime();//para que empiece a contar desde el número que le pongo
   timer=setInterval(()=>{
       timerHandler(id);
   }, 1000);

}

function timerHandler(id){ //cada vez que se ejecuta, time se decrementa en 1
time--;
renderTime();

if(time===0){
    clearInterval(timer); //con esto se detiene el setInterval
    markCompleted(id);
    timer=null;
     renderTasks();
     startBreak();
}
}
function startBreak(){
    time =5 *60;
    // time=3;
    taskName.textContent="Break" ;
    renderTime();
    timerBreak=setInterval(()=>{
        timerBreakHandler();
    },1000);
}
function timerBreakHandler(){
    time--;
    renderTime();
    if(time===0){
        clearInterval(timerBreak);
        current=null;
        timerBreak=null;
        taskName.textContent="";
        renderTasks();
        
        
    }

}

function renderTime(){ //para darle formato a un número
   const timeDiv=document.querySelector('#time #value');
   const minutes= parseInt(time / 60)
   const seconds= parseInt(time % 60);

   timeDiv.textContent=`${minutes < 10 ?"0" : ""}${minutes}:${seconds <10 ?"0" : ""}${seconds}`; //para el formato, la validación es necesaria por si es menor a 10
}

function markCompleted(id){
const taskIndex=tasks.findIndex(task=> task.id===id);
tasks[taskIndex].completed=true
}

