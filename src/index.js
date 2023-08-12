const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

const path = require('path');
const hbs = require('hbs');

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

const port = process.env.PORT || 5000;

app.set('view engine', 'hbs');
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(express.static(static_path));

app.get("", (req, res) => {
    res.render('index');
});

app.get('/download', async (req, res) => {
    const url = req.query.url;
    try {
        // Validate the URL using ytdl-core
        await ytdl.getBasicInfo(url);
        // No error occurred, proceed with the download
        res.header("Content-Disposition", 'attachment; filename="Video.mp4');
        ytdl(url, { format: 'mp4' }).pipe(res);
    } catch (error) {
        console.log('Error occurred while processing the download:', error);
        res.redirect('/error');
    }
});

app.get("/error", (req, res) => {
    res.render('errorPage', {
        errorMsg: "Oops! An error occurred. Please enter a valid youtube link."
    });
});

app.get("*", (req, res) => {
    res.render('404page', {
        errorMsg: "Oops! Page not found. Click Here to go"
    });
});

app.listen(port, () => {
    console.log(`listening to the port no at ${port}`);
});
