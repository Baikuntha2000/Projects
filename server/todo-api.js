var express=require("express");
// it imports express framework
var mongoClient=require("mongodb").MongoClient;
var cors=require("cors");

var app=express();
app.use(cors());

app.use(express.urlencoded({
    extended:true
}));
//  it is useful when dealing with nested objects.


app.use(express.json());
// It enables your application to automatically parse JSON data sent in the body of HTTP requests

var conStr="mongodb://127.0.0.1:27017";

app.get("/users",(request, response)=>{
    mongoClient.connect(conStr).then(clientObject=>{
     var database= clientObject.db("tododb");
     database.collection("users").find({}).toArray().then(documents=>{
        response.send(documents);
        response.end();
     });
    });
});

// In the frontend when we submited the user details on post method
// the data is submitted on form body and in server side we have to  collect the form body
// and that form body details we need to insert into the database.

app.post("/register-user",(request,response)=>{
    var user= {
        UserId :request.body.UserId,
        // the form body is expecting a field called userid
        UserName:request.body.UserName,
        Password : request.body.Password,
        Email: request.body.Email,
        Mobile: request.body.Mobile
    };

   mongoClient.connect(conStr).then(clientObject=>{
    var database=clientObject.db("tododb");
    database.collection("users").insertOne(user).then(()=>{
        console.log("New User Added");
        response.redirect("/users");
        // response.end();
        // redirect is going to navigate from one route to another.
    });
   }) ;

});

app.get("/appointments/:userid",(request,response)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("tododb");
        database.collection("appointments").find({UserId:request.params.userid}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        });
    });
});

app.get("/get-byid/:id",(request,response)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("tododb");
        database.collection("appointments").find({Id:parseInt(request.params.id)}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        })
    })
})


app.post("/add-task",(request,response)=>{
   var task=
    {
        Id: parseInt(request.body.Id),
        // id is a number type, so anything we send is a string type.
        Title: request.body.Title,
        Date:new Date(request.body.Date),
        Description: request.body.Description,
        UserId: request.body.UserId
      }
      mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("tododb");
        database.collection("appointments").insertOne(task).then(()=>{
            console.log("Task Added");
            response.end();
        });
      });

    //   Id, Title, Date, Description, and UserId are all valid identifiers, so quotes are not required.
   
});


app.put("/edit-task/:id" , (request,response)=>{
    var id=parseInt(request.params.id);
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("tododb");
        database.collection("appointments").updateOne({Id:id},{$set:{Id:parseInt(request.body.id),Title:request.body.Title,Date:new Date(request.body.Date),Description:request.body.Description,UserId:request.body.UserId}}).then(()=>{
            console.log("Task Updated");
            response.end();
        });
    });
});


app.delete("/delete-task/:id",(request,response)=>{
    var id=parseInt(request.params.id);
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("tododb");
        database.collection("appointments").deleteOne({Id:id}).then(()=>{
            console.log("Task Deleted");
            response.end();
        });
    });
});




app.listen(6060);
console.log("server started: http://127.0.0.1:6060");
// who is responsible for collecting data from client?
// request

// git status
