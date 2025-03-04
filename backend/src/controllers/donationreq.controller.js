import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Donationreq} from "../models/donationreq.model.js"
import {Donationdocument} from "../models/donationdocument.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const postDonation = asyncHandler(async(req,res) => {

    const {title, status, desc, quantity, category} = req.body

    if(
        [title, status, desc, quantity, category].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"all fields are requried")
    }

   

    const DonationPost = await Donationreq.create({
        createdBy:req.ngo._id,
        title,
        status,
        desc,
        quantity,
        category,
    })


    return res
    .status(200)
    .json(
        new ApiResponse(201, DonationPost, "DonationPost created successfully")
    )

})

const getDonation = asyncHandler(async (req, res) => {
    
    const { title, keyword } = req.body;

    // if(
    //     [title, location, type, keyword].some((field) => field?.trim() === "")
    // ){
    //      title, location, type, keyword  = req.body
    // }

    console.log(req.query);
    console.log(req.body);
    

   
    const query = {};

    if (title) {
        query.title = { $regex: title, $options: "i" }; 
    }

    
    if (keyword) {
        query.$or = 
        [
            { title: { $regex: keyword, $options: "i" } },
            { category: { $regex: keyword, $options: "i" } },
            { desc: { $regex: keyword, $options: "i" } },
        ];
    }

    console.log(query)
    

    
    const DonationPost = await Donationreq.find(query);

    if (!DonationPost || DonationPost.length === 0) {
        throw new ApiError(404, "No DonationPost found with the given filters");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, DonationPost, "DonationPost retrieved successfully"));
})

const updateDonationPost = asyncHandler(async (req, res) => {
    const { title, category, desc, quantity, id, status } = req.body;

    // console.log(req.body);
    // console.log(requirment);
    
    

    
    if (!id) {
        throw new ApiError(400, "DonationPost ID is required");
    }

    
   const DonationPost = await Donationreq.findById(id);

    // const updatedJob = await Jobs.findByIdAndUpdate(id,{
    //     $set: {
    //         title,
    //         location,
    //         salary,
    //         type,
    //         overview,
    //         responsibility,
    //         requirment
    //     },
       
    // }, {new: true})

    console.log(DonationPost);
    

    if (!job) {
        throw new ApiError(404, "DonationPost not found");
    }

    
    if (title) DonationPost.title = title;
    //more things to add
    if (status) DonationPost.status = status;


    console.log(DonationPost);
    

    
    const updatedDonationPost = await DonationPost.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedDonationPost, "DonationPost updated successfully"));
})

const deleteDonationPost = asyncHandler(async(req, res) => {

    const { id } = req.body

    const DonationPost = await Donationreq.findByIdAndDelete(id)

    //await Applications.deleteMany({ job: id })

    

    if(!DonationPost){
        throw new ApiError(400,"DonationPost not found")
    }


    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"DonationPost deleted succesfully")
    )
})

const getDonationPostPostedByNgo = asyncHandler(async (req, res) => {
    
   
    const {ngoid} = req.body

    console.log(req.query);
    console.log(req.body);
    

   
    const query = {};

    
        query.createdBy = ngoid
    

    

    console.log(query)
    

    
    const DonationPost = await Donationreq.find(query);

    if (!DonationPost || DonationPost.length === 0) {
        throw new ApiError(404, "No DonationPost found with the given filters");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, DonationPost, "DonationPost retrieved successfully"));
})

const updateDonationPostStatus = asyncHandler(async(req, res)=>{
    
    const { DonationPostId, status } = req.body
    
    const DonationPost = await Donationreq.findById(DonationPostId)

    if(!DonationPost){
        throw new ApiError(404,"No DonationPost Found")
    }
    console.log(DonationPost);
    
    
    DonationPost.status = status
    await DonationPost.save({validateBeforeSave:false})

    console.log(DonationPost);
    

    return res
        .status(200)
        .json(new ApiResponse(200, DonationPost, "status updated sucessfully for DonationPost"));
})

const getDonationPostPostedByNgo1 = asyncHandler(async (req, res) => {
    
   console.log(req.ngo._id);
    const id = req.ngo._id
    

    console.log(req.query);
    console.log(req.body);
    

   
    const query = {};

    
        query.createdBy = id
    

    

    console.log(query)
    

    
    const DonationPost = await Donationreq.find(query);

    if (!DonationPost || DonationPost.length === 0) {
        throw new ApiError(404, "No DonationPost found with the given filters");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, DonationPost, "DonationPost retrieved successfully"));
})


const getDonationDetails = asyncHandler(async (req, res) => {
    const { donationId } = req.body; // Receive donationId from request body

    if (!donationId) {
        throw new ApiError(400, "Donation ID is required");
    }

    // Fetch the donation request details
    const donationRequest = await Donationreq.findById(donationId)
        .populate("createdBy", "name email") // Populate NGO details
        .lean(); // Convert Mongoose document to plain JS object

    if (!donationRequest) {
        throw new ApiError(404, "Donation request not found");
    }

    // Fetch all donations made towards this request
    const donationDocuments = await Donationdocument.find({ donationreqId: donationId })
        .populate("donorId", "name email phone") // Populate donor details
        .populate("ngoId", "name email") // Populate NGO details
        .lean();

    // Combine request and donor details
    const responseData = {
        donationRequest,
        donationDocuments, // List of donations with donor details
    };

    return res.status(200).json(new ApiResponse(200, responseData, "Donation details retrieved successfully"));
});






// const getmypost = asyncHandler(async()=>{
//     const id = req.ngo._id;


// })



export {
    postDonation,
    getDonation,
    updateDonationPost,
    deleteDonationPost,
    getDonationPostPostedByNgo,
    updateDonationPostStatus,
    getDonationPostPostedByNgo1,
    getDonationDetails

}