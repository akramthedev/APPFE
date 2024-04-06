const express = require('express');
const users = require('../Models/users');
const requests = require('../Modelsrequests');
const sendEmail = require('../Helpers/EmailSender');
const verifyToken = require('../Middlewares/verifyToken');


const router = express.Router();


router.post('/create' ,async(req, res)=>{
    try{
        const data = req.body;
        const isCreated = await requests.create(data);
        if(isCreated){
            res.status(200).send(isCreated);
        }
        else{
            res.status(202).send('Not Created...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});




router.get('/user/:idUser' ,async(req, res)=>{
    try{
        const {idUser} = req.params;
        const areFound = await requests.find({
            sentTo : idUser
        });
        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(202).send('Not Founds...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});



router.delete('/:idRequest' ,async(req, res)=>{
    try{
        const {idRequest} = req.params;
        const isDeleted = await requests.findByIdAndDelete(idRequest);
        if(isDeleted){
            res.status(200).send(isDeleted);
        }
        else{
            res.status(202).send('Not Founds...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});


router.delete('/user/:idUser' ,async(req, res)=>{
    try{
        const {idUser} = req.params;
        const { deletedCount } = await requests.deleteMany({ sentTo: idUser });
        if (deletedCount > 0) {
            console.log(deletedCount);
            res.status(200).send({ message: `${deletedCount} notifications deleted successfully.` });
          } else {
            console.log(deletedCount);
            res.status(404).send('No notifications found for the given user ID.');
          }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});




module.exports = router;