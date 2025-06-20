// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(bodyParser.json({ limit: '10mb' }));

// mongoose.connect('mongodb+srv', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => console.log('MongoDB connected!'));

// const ImageSchema = new mongoose.Schema({
//   data: String,
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });
// const Image = mongoose.model('Image', ImageSchema);

// app.post('/api/images', async (req, res) => {
//   try {
//     const { imageData } = req.body;
//     const newImage = new Image({ data: imageData });
//     await newImage.save();
//     res.status(201).json({ message: 'Image saved successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving image', error });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

let isfaqvisible=false;

const togglefaq=()=>
{
  isfaqvisible=!isfaqvisible;

  return isfaqvisible ? "yes": "no";
}

console.log(togglefaq());
console.log(togglefaq());
