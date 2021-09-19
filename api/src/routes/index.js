const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');

const CryptoJS = require('crypto-js');

const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./storage');
localStorage.setItem('credenciales','[]');

router.get('/messages', authorization, (req, res) => {
    res.json(JSON.parse(localStorage.getItem('messages')));
});

//Set credentials
router.put('/credential', (req, res) => {
    const {key, shared_secret} = req.body; 
    if(key && shared_secret){        
        let credenciales = JSON.parse(localStorage.getItem('credenciales')); 
        if(credenciales.find(x => x.key == key)){ //If the token is already in the local storage            
            res.status(403).json({'success': false, 'msg': 'Key already in the server'});  
        } 
        else {  // If the token is not in the local storage    
            let temp = {"key":key, "shared_secret":shared_secret};
            credenciales.push(temp);            
            localStorage.setItem('credenciales',JSON.stringify(credenciales));        
            res.status(204).json({});
        }
        
    } else {
        res.status(500).send({'msg': 'Wrong request'});
    }    
});

//Add a ney message
router.post('/messaqe', authorization, (req, res) => {    
    const {msg, tags} =  req.body;
    if(msg && tags && isNaN(tags)){
        let id = uniqueId();
        let low_tags = tags.toLowerCase();
        let new_message = {id, msg, "tags":low_tags};
        let messages = JSON.parse(localStorage.getItem('messages'));
        messages.push(new_message);
        localStorage.setItem('messages',JSON.stringify(messages));
        res.status(200).json({"id": id});
    } else {
        res.status(400).send('Bad Request');
    }
});

//Search by Id
router.get('/message/:id', authorization, (req, res) => {
    let {id} = req.params;
    let messages = JSON.parse(localStorage.getItem('messages'));
    let msg = messages.find(x => x.id == id);
    console.log(msg);
    if(msg){
        res.status(200).json(msg);
    } else {
        res.status(400).send('Wrong ID');
    }
});

//Search by Tags
router.get('/messages/:tag', authorization, (req, res) => {
    let {tag} = req.params;    
    let messages = JSON.parse(localStorage.getItem('messages'));
    let low_tag = tag.toLowerCase();
    if(tag && isNaN(tag)){
        res.status(200).json(messages.filter(x => x.tags.includes(low_tag)));
    } else {
        res.status(500).send('Wrong Request');
    }
});

function uniqueId(){
    let min = 1, max = 100;
    let random = Math.floor(Math.random()*(max-min+1) + min);
    let messages = JSON.parse(localStorage.getItem('messages'));
    let msg = messages.find(x => x.id == random);
    if(msg){
        uniqueId()
    } else {
        return random;
    }
}

function authorization(req, res, next){

    //Get the values in the headers
    let x_signature = req.headers['x-signature'];
    let x_key = req.headers['x-key'];
    let x_route = req.headers['x-route'];

    let cadena = "[{key:"+x_key+",X-Route:"+x_route+"}]";

    //Get shared_secret from local storage
    let credenciales = JSON.parse(localStorage.getItem('credenciales')); 
    let cred = credenciales.find(x => x.key == x_key);

    if(cred){
        let shared_secret =  cred.shared_secret;
         //Compare if the signature is the same
        let hash = CryptoJS.HmacSHA256(cadena, shared_secret).toString(CryptoJS.enc.Hex); 
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = router;