const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/' , async(requestAnimationFrame,res)=>{
    try{
        res.json('Welcome to HRAPI');
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/emp-count' ,async(req,res) =>{
    try{
        const result = await pool.query('SELECT COUNT(*) FROM employees');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});
app.get('/countries-count' ,async(req,res) =>{
    try{
        const result = await pool.query('SELECT COUNT(*) FROM ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/Departments-count' ,async(req,res) =>{
    try{
        const result = await pool.query('SELECT COUNT(*) FROM ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/JOB_HISTORY-count' ,async(req,res) =>{
    try{
        const result = await pool.query('SELECT COUNT(*) FROM ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});




const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Connect Successfully...on PORT ${PORT}`);
});