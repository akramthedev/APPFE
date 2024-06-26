import React, {useState, useEffect} from 'react'
import Navbar from '../../Components/Navbar/Navbar';
import "./index.css";
import Moderator from '../../Assets/AdminSymbol';
import Adser from '../../Assets/AdserSymbol';
import axios from 'axios';
import {useNavigate } from "react-router-dom";
import GetTimeAndDate from '../../Helpers/GetTimeAndDate2'



const Room = ({renderX, allRooms, socket,setdataUserEntered,isFetchingUser,dataUserCurrent, ChatEntered, num, room, enterChat}) => {


    const [user, setUser] = useState(null);
    const [loading, setloading] = useState(true);
    const [unSeenMessages, setunSeenMessages] = useState(0);
    const [lasMessageSentIntoThisRoom, setlasMessageSentIntoThisRoom] = useState({
      _id : "",
      senderId : "",
      roomId : "",
      message : "",
      sentTo : "",
      isSeen : false,
      createdAt : "",
      updatedAt : "",
    });
    const token = localStorage.getItem('token')
    const idUser = localStorage.getItem('idUser')
    const nav = useNavigate();

 
    const x = async()=>{
      try{
        setloading(true);
        let idFriend = null;
        if(room.member1 === idUser){
            idFriend = room.member2;
        }
        else{
            idFriend = room.member1;
        }
        const resp = await axios.get(`http://localhost:3001/user/${idFriend}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });
        if(resp.status ===200){
                    
            const resp2 = await axios.get(`http://localhost:3001/room/getLastMessage/${room._id}`, {
              headers : {
                Authorization : `Bearer ${token}`
              }
            });  
            console.log(resp2.data.LastMessage);
            if(resp2.status ===200){
              setlasMessageSentIntoThisRoom(resp2.data.LastMessage);
              let c = 0;
              if(resp2.data.OtherMessages.length >= 1){
                
                for(let i = 0;i<resp2.data.OtherMessages.length;i++){
                  if(!resp2.data.OtherMessages[i].isSeen && resp2.data.OtherMessages[i].sentTo === idUser){
                    c++;
                  }
                }
                setunSeenMessages(c);
              }
              else{
                setunSeenMessages(0);
              }
            }
            else{
              setunSeenMessages(0);
              setlasMessageSentIntoThisRoom({
                
                  _id : "",
                  senderId : "",
                  roomId : "",
                  message : "",
                  sentTo : "",
                  isSeen : false,
                  createdAt : "",
                  updatedAt : "",
                   
                
              })
            }

            setUser(resp.data);
            setdataUserEntered(resp.data);
        }
        else{
          setUser(null)
        }

        
      }
      catch(e){
        setUser(null)
        console.log(e.message);
      } finally{
        setloading(false);
      }
    }



    useEffect(()=>{
      x();
    }, [allRooms, renderX]);

  


  return (
    <>
    {
        !user && loading ? 
        <button className={`SingleChatX SingleChatXSkelton SingleChatXSkelton${num%2 ? "2" : "1"}`}>

        </button>
        :
        <button
            className={(ChatEntered && (ChatEntered === room._id ))? "SingleChatX actiavtedSingleChatX" : "SingleChatX"}
            onClick={
              ()=>{
                enterChat(room._id);
              }
            }
        >
        
        <div className="caseImgDKDK">
          <img 
            src={
              user ? user.profilePic : "https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png"
            } 
            alt="" 
          />
          {
            <>
            {
              <>
              {
                  unSeenMessages === 0  ? null :  
                  <>
                  {
                    
                    <span className="numberUnseen">
                    {
                      unSeenMessages && unSeenMessages
                    }
                    </span>
                    
                  }
                  </>
              }
              </>
            }
            
            </>
          }
        </div>
        <div className="caseOthersjqdsc">
          <span className="fullNamjqed">
          {
            user && user.fullName
          }
          &nbsp;&nbsp;{user && <>{user.role === "admin" ? <Moderator /> : user.role === "adser" ? <Adser/> : null}</>}
          </span>
          <span className="jozdqcs">
          {
            lasMessageSentIntoThisRoom && 
            <>
            {
                lasMessageSentIntoThisRoom.message.length > 30  ? 
                
                <>
                  {
                    idUser === lasMessageSentIntoThisRoom.senderId ? <>You : {lasMessageSentIntoThisRoom.message.slice(0,31)+'...'}</>
                    :
                    lasMessageSentIntoThisRoom.message.slice(0,31)+'...'
                  }
                </>
                :
                <>
                  {
                    idUser === lasMessageSentIntoThisRoom.senderId ? <>You : {lasMessageSentIntoThisRoom.message}</>
                    :
                    lasMessageSentIntoThisRoom.message
                  }
                </>
            }
            </>
          }
          
          </span>
          
        </div>
        <span className="timytim">
          {
            lasMessageSentIntoThisRoom.createdAt !== "" &&  GetTimeAndDate(lasMessageSentIntoThisRoom.createdAt) 
          }
          </span>
        </button>
    }
    </>
  )
}

export default Room