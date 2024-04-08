import React, {useState, useEffect, useRef} from 'react'
import './index.css';
import '../Home/Home.css'
import PagePost from '../../Components/Post/PagePost.jsx';
import axios from 'axios';
import CreatePostForPages from '../../Components/CreatePost/CreatePostForPages.jsx'
import { useSocket } from '../../Helpers/SocketContext';
import SkeltonPost2 from '../../Components/Post/SkeltonPost2.jsx';
import SingleContact from '../../Components/SingleContact/SingleContact.jsx';
import Ads from '../../Components/Ads/Ads';
import BirthDays from '../../Components/BirthDays/BirthDays';
import Contacts from '../../Components/Contacts/Contacts';
import Navbar from '../../Components/Navbar/Navbar';
import {useNavigate, useParams } from 'react-router-dom'
import VerifiedPage from '../../Assets/VerifiedPage.jsx';
import useOutsideAlerter from '../../Helpers/HidePopUp.js';
import { TheOneWhoHasBirthDay } from '../Home/TheOneWhoHasBirthDay.jsx';




const Page = ({isFetchingUser, dataUserCurrent, reRenderParentCompo}) => {

  const { id } = useParams();
  const { socket } = useSocket();
  const token = localStorage.getItem('token');
  const currentId = localStorage.getItem('idUser');
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [allPostsWithImages, setallPostsWithImages] = useState([]);
  const [postLoading, setpostLoading] = useState(true);
  const [isFollowed, setisFollowed] = useState(null);
  const [isLiked, setISLiked] = useState(null);
  const [isBClicked,setisBClicked] = useState(false);
  const [TheOnesWhoHaveBirthday,setTheOnesWhoHaveBirthday] = useState(null);
  const refref = useRef(null); 
  useOutsideAlerter(refref, setisBClicked);

  const [data, setData] = useState(null);


  const fetch = async()=>{
    if(id){
      try{
        const resp = await axios.get(`http://localhost:3001/page/${id}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          if(resp.data.likes.includes(currentId)){
            setISLiked(true);
          } 
          else{
            setISLiked(false);
          } 
          if(resp.data.followers.includes(currentId)){
            setisFollowed(true);
          } 
          else{
            setisFollowed(false);
          } 
          setData(resp.data);
        }
        else{
            navigate("/");
        }
      }
      catch(e){
          console.log(e.message);
          navigate("/");
      }
    }
}

  useEffect(()=>{
      fetch();
  }, [id]);

    const renderParent = async ()=>{
      try{
        setpostLoading(true);
        const resp = await axios.get(`http://localhost:3001/post/user/${id}`);
        if(resp.status === 200){
          setAllPosts(resp.data);
          if(resp.data.length !== 0){
            setTimeout(()=>{
              setallPostsWithImages(null);
              setallPostsWithImages([]);
              resp.data.map((post, index)=>{
                if(post.image !== ''){
                  setallPostsWithImages(prevPosts=>[
                    ...prevPosts, 
                    post.image
                  ])
                }
              })
            }, 700 );
          }
        }
        else{
          setAllPosts([]);
        }
      }
      catch(e){
        console.log(e.message);
      } finally{
        setpostLoading(false);
      }
    }

    useEffect(()=>{
      renderParent();
    }, [id]);
  
  

  return (
    <>
    {
      data && 
      <div className='Home Page'>

          <div className={isBClicked ? "isBClicked showisBClicked" : "isBClicked"}>
            <div ref={refref} className={isBClicked ? "isContainerB showisContainerB" : "isContainerB"}>
            <div className="rowzodjq">
              Wish a Happy Birthday!
            </div>
            {
              TheOnesWhoHaveBirthday && 
              TheOnesWhoHaveBirthday.length !== 0 && 
              TheOnesWhoHaveBirthday.map((one, index)=>{
                return(
                  <TheOneWhoHasBirthDay  one={one} dataUserCurrent={dataUserCurrent} />
                )
              })
            }
            </div>
          </div>
      


        <Navbar  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent}  />
          <div className="home2">
            <div className="h1">
              <div className="rowImg878">
                <img src={data.profilePic} alt="" />
              </div>
              <div className="rowName878">
              {
                data.name
              }
              </div>
              {
                data.isVerified &&
               
                <div className="rowName879">
                Verified By Xplorium
                 
                  <VerifiedPage />
                 
                </div>
                
              }
              <div className="rowName8790">
                <span>Likes</span><span>2478</span>                
              </div>
              <div className="rowName8790">
                <span>Followers</span><span>4278</span>               
              </div>
              <div className="rowName8790">
                <span>Posting</span><span>Every Day</span>               
              </div>
              <div className="rowName899 rowName899activated">
                <div className="bar barActivated"  /> 
                Home
              </div>
              <div className="rowName899 ">
                <div className="bar" /> 
                About
              </div>
              <div className="rowName899 ">
                <div className="bar" /> 
                Photos
              </div>
              <div className="rowName899">
                <div className="bar" /> 
                Page Owner
              </div>
            </div>
            <div className="h2">
              <div className="coverPicture99">
                <img src={data.coverPic} alt="" />
              </div>
              <div className="btnsbts">
              {
                isLiked !== null && 
                <>
                  <button
                    onClick={()=>{
                      setISLiked(!isLiked);
                    }}
                    className={isLiked && "addColorActivatedL"}
                  >
                  {
                    isLiked ? 
                    <>Liked&nbsp;&nbsp;<i className='fa-solid fa-check'></i> </>
                    :
                    <>Like&nbsp;&nbsp;<i className='fa-solid fa-thumbs-up'></i> </>
                  }
                  </button>
                </>
              }
              {
                isFollowed !== null && 
                <button
                  className={isFollowed && "addColorActivatedF"}
                  onClick={()=>{
                    setisFollowed(!isFollowed);
                  }}
                >
                {
                  isFollowed ? 
                  <>Followed&nbsp;&nbsp;<i className='fa-solid fa-check'></i></>
                  :
                  <>Follow&nbsp;&nbsp;<i className='fa-solid fa-signal'></i></>
                } 
                </button> 
              } 
              </div>
              {
                data.creator === currentId && 
                <CreatePostForPages pageId={id} ajusting={"yes"} isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} renderParent={renderParent} />
              }
              {
                postLoading ? "Loading.."
                :
                <>
                {
                  allPosts && 
                  <>
                  {
                    allPosts.length === 0 ?
                    <div className="rowName899 rowName899rowName899rowName899">
                      No Post Yet
                    </div>
                    :
                    allPosts.map((post, index)=>{
                      return(
                        <PagePost ajusting={"yes"} post={post}  reRenderParentCompo={renderParent}  />
                      )
                    })
                  }
                  </>
                }
                </>
              }
            </div>
            <div className="h3">
              <Ads />
              <BirthDays  setisBClicked={setisBClicked} setTheOnesWhoHaveBirthday={setTheOnesWhoHaveBirthday }   isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Contacts    isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent}   />
            </div>
          </div>
      </div>
    }
    </>
  )
}

export default Page