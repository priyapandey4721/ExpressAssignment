import express from 'express'
import fs from 'fs'
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('view engine', 'ejs')
// /-table /form-form

app.get('/form',(req, res)=>{
    res.render('form')

})
app.post('/form',(req, res) =>{
    console.log(req.body)
    let details = [];
    fs.readFile('data.txt','utf-8',(err,data)=>{
        if(err) throw err
        details = (JSON.parse(data))
        details.push(req.body)
        console.log(details)
        fs.writeFile('data.txt',`${JSON.stringify(details)}`,(err)=>{
            if(err)  throw err
            console.log(details)
            res.end()
        })
    })
    res.redirect('http://localhost:5000/')
    
})
app.get('/', (req, res) =>{
    let details = [];
    fs.readFile('data.txt','utf-8', (err, data) =>{
        details = JSON.parse(data);
        res.render('table',{data:details})
    })
    
})
app.get('/delete/:id',(req,res)=>{
    let details = []
    console.log(req.params.id,"id line 42")
    fs.readFile('data.txt','utf-8',(err,data)=>{
        if(err) throw err
        else{
            details = JSON.parse(data);
            details.splice(req.params.id,1)
        }
        fs.writeFile('data.txt',`${JSON.stringify(details)}`,(err)=>{
            if(err) throw err
            res.end()
        })
    })
    res.redirect('back')
})

app.get('/update/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
    let details = []
    fs.readFile('data.txt','utf-8',(err,data)=>{
        details = JSON.parse(data)
       
        if(err) throw err
        else{
            res.write(`<!DOCTYPE html>
                <html lang="en">
                <head>
                <title></title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
                </head>
                <body>
                    <form method="post" class="m-3" action='/update_data/${id}'>
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Your Name</label>
                          <input type="text" class="form-control" name="name" id="exampleInputEmail1" value=${details[id].name}>
                        </div>
                        <div class="mb-3">
                          <label for="exampleInputPassword1" class="form-label">Age</label>
                          <input type="number" class="form-control"  name="age" value=${details[id].age} >
                        </div>
                        <button type="submit" class="btn btn-primary">Update</button>
                      </form>
                </body>
                </html>`
            )
            res.end()
        }
        app.post('/update_data/:id',(req,res)=>{
            console.log(req.body,req.params.id,"req.body","id")
            const id = req.params.id
            details[id].name = req.body.name;
            details[id].age = req.body.age
           
            fs.writeFile('data.txt',`${JSON.stringify(details)}`,(err)=>{
                if (err) throw err
                
            })
            res.redirect('http://localhost:5000/')
        })
    })

})


app.listen(5000,e=>{
    if(e) throw e
    else{
        console.log('listening on port 5000')
    }
})

