const express = require('express');
const fs = require('./firebase.config');
const {v4: uuidv4} = require('uuid');

const app = express();
const db = fs.firestore();

app.use(express.json());

const Users = db.collection('Usuários');
db.settings({ ignoreUndefinedProperties: true });

//Get all users
app.get('/user', async (request, response) => {
    const users = await Users.get();
    let allUser = [];

    users.forEach(doc => {
        allUser.push({id: doc.id, ...doc.data()});
    });

    return response.json(allUser);
})

//Create user
app.post('/user', async(request, response) => {
    try{
        const {name, email, password} = request.body;

        if(name && email && password){
            const user = db.collection('Usuários').doc(uuidv4());
            await user.set({
                name,
                email,
                password,
                created_at:new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
            return response.json({status:"Account Created"});
        } else {
            return response.status(400).json({status: "Send params correctly"});
        }
    } catch(e){
        return response.json({status: e.message});
    }
})

//Get one user
app.get('/user/:id', async(request, response) => {
    try{
        const {id} = request.params;

        const user = await Users.doc(id).get();

        if(user.exists){
            response.json(user.data());
        } else {
            throw new Error("Usuário não encontrado");
        }
    }catch(e){
        return response.status(400).json({status: e.message});
    }
})

//Update user
app.put('/user/:id', async(request, response) => {
    try{
        const {id} = request.params;

        const {name, email, password} = request.body;

        const user = await Users.doc(id).get();

        if(user.exists){
            await Users.doc(id).update({
                name, email, password,
                updated_at: new Date().toISOString()
            });
            return response.json({status: "Up to date"})
        } else {
            throw new Error("Usuário não encontrado");
        }
    }catch(e){
        return response.status(400).json({status: e.message});
    }
})

app.delete('/user/:id', async(request, response) => {
    try{
        const {id} = request.params;

        const user = await Users.doc(id).get()
        if(user.exists){
            await Users.doc(id).delete();
            return response.json({status: "User deleted"})
        } else{
            throw new Error("Usuário não encontrado");
        }
    }catch(e){
        return response.status(400).json({status: e.message});
    }
})

app.listen(3000, () => {
    console.log('Server up!');
});



