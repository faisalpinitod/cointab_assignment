// Import necessary modules
const express = require('express');
const {connection}=require("./config/db")

const axios = require('axios');
const {User} = require('./models/user.model');
const {Post} = require('./models/post.model');
const Excel = require('exceljs');
const fs = require('fs');

const app=express();
// Route for Home Page
app.get('/', async (req, res) => {
    try {
        // Fetch data from API
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        const users = response.data;
        // Render home page with user data
        res.send('home', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// Route for storing user data in the database
app.post('/addUser', async (req, res) => {
    try {
        const userData = req.body;
        // Check if user already exists in the database
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            res.redirect('/post/' + existingUser._id);
        } else {
            // Create new user entry in the database
            await User.create(userData);
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// Route for Post Page
app.get('/post/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Fetch data from API for specific user
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const posts = response.data;
        // Render post page with post data
        res.render('post', { posts, userId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// Route for storing post data in the database
app.post('/addPost/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const postData = req.body;
        // Create new post entries in the database
        await Post.insertMany(postData);
        res.redirect('/post/' + userId);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// Route for downloading posts in Excel format
app.get('/download/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Fetch posts from the database for specific user
        const posts = await Post.find({ userId });
        // Create Excel workbook and worksheet
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Posts');
        // Add headers to worksheet
        worksheet.columns = [
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Body', key: 'body', width: 50 },
        ];
        // Add post data to worksheet
        posts.forEach(post => {
            worksheet.addRow({ title: post.title, body: post.body });
        });
        // Write workbook to file
        const filePath = `downloads/posts_${userId}.xlsx`;
        await workbook.xlsx.writeFile(filePath);
        // Download file
        res.download(filePath);
        // Delete file after download
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const port=8080
app.listen(port,async()=>{
    try{
        await connection;
        console.log("The DB is connected!")
    }catch(err){
        console.log(err)
        console.log({"Err":"Something went wrong"})
    }
    console.log(`The server is connected to port ${port}`)
})

// module.exports = router; (edited) 