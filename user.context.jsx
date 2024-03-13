import { createContext,useReducer, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const PostContext=createContext({
    PostLst:[],
    fetching:false,
    AddPost:()=>{},
    DeletePost:()=>{},
    AddBulkPost:()=>{}
    
});

const DEFAULT_POST_LIST=[
    // {
    //     id:1,
    //     title:"kaisa hai chutiyaaa",
    //     body:"aur bata chutiya kaisa kya chal raha hai sab mast!!!",
    //     reactions:12,
    //     userId:"user-12",
    //     tags:["chutiya","kaisa","mast"]
    // },
    // {
    //     id:2,
    //     title:"kaisa hai bantai",
    //     body:"going to movie theater for watching the movie",
    //     reactions:53,
    //     userId:"user-07",
    //     tags:["movie","theater","watching"]
    // }
]

const ReducerPostList=(currPostList,action)=>{
  
    let newCurrPostList=[]
   if(action.type==="ADD-POST"){
        const newObj={
            id:action.payload.post.id,
            title:action.payload.post.title,
            body:action.payload.post.body,
            reactions:0,
            userId:action.payload.post.userId,
            tags:action.payload.post.tags
        }
        newCurrPostList=[newObj,...currPostList];
   }
   else if(action.type==="DELETE-POST"){
   
       for(let x of currPostList){
        if(action.payload.id===x.id && action.payload.userId===x.userId){
            continue;
        }
        else{
            newCurrPostList.push(x);
        }
       }
   }
   else if(action.type==="ADD-REACTION"){
    // console.log("reducer add call hua")
    for(let x of currPostList){
        if(action.payload.id===x.id && action.payload.userId===x.userId){
            x.reaction=action.payload.reaction+1;
            // console.log("x.reaction",x.reaction)
        }
        newCurrPostList.push(x);
    }
   }
   else if(action.type==="Add-Mass"){
        newCurrPostList=[...action.payload.posts]
   }
   return newCurrPostList;

}

function PostProvider({children}){
    

   const navigate= useNavigate()


   
    const[PostLst,DispatchPostList]=useReducer(ReducerPostList,DEFAULT_POST_LIST)
    
  
    const DeletePost=(id,userId)=>{
       const deleteEvent={
        type:"DELETE-POST",
         payload:{
            id:id,
            userId:userId,
         }
       }
  
DispatchPostList(deleteEvent)
    }
    const AddPost=(post)=>{
        // console.log(post)
        const AddReact={
            type:"ADD-POST",
            payload:{
                post:post
            }
        }
        DispatchPostList(AddReact);
        navigate("/")
    }

    const AddBulkPost=(posts)=>{
        // console.log("yaha aya hai")
         const AddMass={
            type:"Add-Mass",
            payload:{
                posts:posts
            }
         }
         DispatchPostList(AddMass)
    }
    const [fetching,setFetching]=useState(false);
    // useEffect(()=>{
         
    //     setFetching(true);
    //     const controller=new AbortController();
    //     const signal=controller.signal;
    
    //     fetch("https://dummyjson.com/posts",{signal})
    //     .then(res=>res.json())
    //     .then(obj=>AddBulkPost(obj.posts))
    //     setFetching(false);

    //     return()=>{
    //         controller.abort();
    //     }
    // },[])



    return(
        <PostContext.Provider value={{
            PostLst:PostLst,
            fetching:fetching,
            AddPost:AddPost,
            AddBulkPost:AddBulkPost,
            DeletePost:DeletePost
        }}>
           {children}
        </PostContext.Provider>
    )
}
export default PostProvider;