import express from 'express';
import { Book } from '../models/bookModel.js';
import upload from '../middleware/multer.js';

const router=express.Router();

// Define the base URL for your server
const BASE_URL = 'https://bookappserverassignment.vercel.app';

//Route for Saving a new book
router.post('/',upload.single('image'),async(request,response)=>{
  try{
    if(
        !request.body.title ||
        !request.body.author ||
        !request.body.publishYear
    )
    {
        return response.status(400).send({
          message:'Send all required fields:title,author,publisher',
        });
    }
    
    let imageUrl='';
    if(request.file){
      //imageUrl=`${request.protocol}://${request.get('host')}/uploads/${request.file.filename}`;
      imageUrl=`${BASE_URL}/uploads/${request.file.filename}`;
    }
    
    console.log("imageurl", imageUrl);
    
    const newBook={
        title:request.body.title,
        author:request.body.author,
        publishYear:request.body.publishYear,
        image:imageUrl,
    };
    const book=await Book.create(newBook);
    return response.status(201).send(book);
  }
  catch(error){
    console.log(error.message);
    response.status(500).send({message:error.message});
  }
})

//Route to get all books from the database
router.get('/',async(request,response)=>{
  try{
     const books=await Book.find({});
     return response.status(200).json({
        count:books.length,
        data:books,
     })
  }
  catch(error){
    console.log(error.message);
    response.status(500).send({message:error.message});
  }
})

//Route to get a book by id from the database
router.get('/:id',async(request,response)=>{
    try{
       const {id}=request.params;
       const book=await Book.findById(id);
       return response.status(200).json(book);
    }
    catch(error){
      console.log(error.message);
      response.status(500).send({message:error.message});
    }
  })

  //Route to update a book in the database
  router.put('/:id',async(request,response)=>{
    try{
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        )
        {
            return response.status(400).send({
              message:'Send all required fields:title,author,publisher',
            });
        }
        const { id }=request.params;
        const result=await Book.findByIdAndUpdate(id, request.body);
         if (!result){
            return response.status(404).json({message:'Book not Found'});
         }
         return response.status(200).send({message:'Book updated successfully'});
    }
    catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
  })

//Route to delete a book 
router.delete('/:id',async(request,response)=>{
    try{
        const { id }=request.params;
        const result=await Book.findByIdAndDelete(id);
         if (!result){
            return response.status(404).json({message:'Book not Found'});
         }
         return response.status(200).send({message:'Book deleted successfully'});
    }
    catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
})

export default router;