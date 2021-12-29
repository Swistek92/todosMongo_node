const mongo = require("mongodb");

const client = new mongo.MongoClient("mongodb://localhost:27017", {useNewUrlParser: true});



// ================= 
function doTheToDo(todosCollection){
 
  const [command, ...args] = process.argv.splice(2)
switch(command){
  case "add":
    addNewToDo(todosCollection, args[0]);
    break;
  case "list":
    showAllTodos(todosCollection);
    break;
  case "done":
   markTaskAsDone(todosCollection, args[0]);
   break;
   case "delete":
   teleteTask(todosCollection, args[0]);
   break;
   case "cleanup":
   deleteAllDone(todosCollection);
   break;
   default:
      console.log(" Dostepnego komendy w funkcji dotheToDo :)")
     client.close();
     break;
 }

}



// ================== cleanup 

function deleteAllDone(todosCollection){
  todosCollection.deleteMany({
    done:true,
  }).then(()=>{
    console.log("wyczyszczono zadania gotowe")
    client.close();
  }).catch(err=>{
    console.log(err)
  })
}





// ============== dodawanie 
function addNewToDo(todosCollection, title){
  todosCollection.insertOne({
    title,
    done: false,
  }).then(()=>{ 
      console.log("zadanie dodane");
          client.close()
  }).catch(err=>{
    console.log("błąd",err)
  })
}
// ================= pokazywanie listy 

function showAllTodos(todosCollection){
  todosCollection.find({}).toArray((err,todos)=>{
    if(err){
      console.log("error", error);
    }else{
      // console.log("zadnie to  " + task1)
      // let task1 = JSON.stringify(todos[0].title);
      // let done1 = JSON.stringify(todos[0].done)
      // if(done1){
      //   console.log("zrobione!")
      // }else {
      //   console.log("nie zrobione")
      // }
      // console.log("zrobione???? " + done1)

      const todosToDo = todos.filter(todo=>!todo.done)
      

      const todoDone = todos.filter(todo=>todo.done)


     

        if(JSON.stringify(todoDone).length < 5  ){
            console.log("nic nie zrobione")
        }else {
            for(let i=0; i<todoDone.length; i++){
        console.log("ZROBIONE" + JSON.stringify(todoDone[i].title) + "ID "+JSON.stringify(todoDone[i]._id))
      }
        }
        
    
        if(JSON.stringify(todosToDo) > 5 ){
            console.log("nic do zrobienia")
        }else {
            for(let i=0; i<todosToDo.length; i++){
        console.log("DO ZROBIENIA" + JSON.stringify(todosToDo[i].title) +"ID "+ JSON.stringify(todosToDo[i]._id))
      }
        }
     


      client.close()
    }

  })
}

// ================================================= make done

function markTaskAsDone(todosCollection, id){
  todosCollection.find({
    _id: mongo.ObjectId(id),
  }).toArray((err, todos)=>{
    if(err){
      console.log("blad podczas pobierania", err)
          client.close();

    } else if( todos.length !==1){
      console.log("niema takiego zadania ")
          client.close();

    }else if(todos[0].done){
      console.log("to zadanie było juz zakonczone")
          client.close();

    }
    
    else {
      todosCollection.updateOne({
    _id: mongo.ObjectId(id),
  },{
    $set: {
      done:true, 
    }
  }).then(()=>{
    console.log("zadanie ustawione jako zrobione")
    client.close();
  }).catch(err=>{
    console.log("blad ", err)
  })

    }

  })
};

// ================== Delete 

function teleteTask(todosCollection, id){
  todosCollection.find({
    _id: mongo.ObjectId(id),
  }).toArray((err, todos)=>{
    if(err){
      console.log("blad podczas pobierania", err)
          client.close();

    } else if( todos.length !==1){
      console.log("niema takiego zadania ")
          client.close();

    }
    
    else {
      todosCollection.deleteOne({
        _id:mongo.ObjectId(id)
      }

      ).then(()=>{
    console.log("zadanie usuniete")
    client.close();
  }).catch(err=>{
    console.log("blad podczas usuwania",err)
  })

    }

  })
};













// ===========================


// ==================Connect 

client.connect(err=>{
  if(err){
    console.log("blad",err);
  }else{
    console.log("wszystko git")
    const db = client.db("test");
    const todosCollection = db.collection("todos");


    //======================================

    doTheToDo(todosCollection);

     
  }


});