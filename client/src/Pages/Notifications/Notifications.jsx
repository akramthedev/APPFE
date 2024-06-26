import React, {useState, useEffect, useRef} from 'react'
import './index.css';
import Navbar from '../../Components/Navbar/Navbar';
import SingleNotification from '../../Components/SingleNotification/SingleNotification'
import Ads from '../../Components/Ads/Ads';
import Contacts from '../../Components/Contacts/Contacts';
import BirthDays from '../../Components/BirthDays/BirthDays';
import UtilsAndNavigations from '../../Components/UtilsAndNavigations/UtilsAndNavigations';
import axios from "axios";
import HttpRequestStatus from '../../Components/HttpRequestStatus/HttpRequestStatus';
import { useSocket } from '../../Helpers/SocketContext';
import useOutsideAlerter from '../../Helpers/HidePopUp';
import { TheOneWhoHasBirthDay } from '../Home/TheOneWhoHasBirthDay';

const Notifications = ({dataAds,isFetchingUser, dataUserCurrent}) => {

    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    const { socket } = useSocket();

    const [AllNotifications,setAllNotifications] = useState(null);
    const [isFetchingAllNotifs,setIsFecthingAllNotif] = useState(true);
    

    const [isBClicked,setisBClicked] = useState(false);
    const [TheOnesWhoHaveBirthday,setTheOnesWhoHaveBirthday] = useState(null);
    const refref = useRef(null); 
    useOutsideAlerter(refref, setisBClicked);


    let ResponseRequest = {
      status : null,
      msg : null, 
    }
    
    const fetchUserNotifications = async ()=>{
      if(idUser && token){
        try{
          const resp = await axios.get(`http://localhost:3001/notif/user/${idUser}`);
          if(resp.status === 200){
            console.log(resp.data);
            setAllNotifications(resp.data);
          }
          else{
            ResponseRequest = {
              status :202, 
              msg : 'Oops, something went wrong!'
            }
          }
        }
        catch(e){
          ResponseRequest = {
            status :500, 
            msg : 'Oops, something went wrong!'
          }
          console.log(e.message);
        } finally{
          setIsFecthingAllNotif(false);
        }
      }
    }

    useEffect(()=>{
      fetchUserNotifications();
    }, []);
 

    const handleDeleteAllNotifs = async ()=>{
      if(AllNotifications && AllNotifications.length !== 0){
        try {
          const resp = await axios.delete(`http://localhost:3001/notif/user/${idUser}`);
          if(resp){
            ResponseRequest = {
              status : resp.status, 
              msg : resp.data
            }
          }
        }
        catch(e){
          console.log(e.message);
          ResponseRequest = {
            status : 500, 
            msg : e.message
          }
        } finally{
            fetchUserNotifications();
        }
      }
    }

    useEffect(()=>{

      const x = ()=>{
        window.scrollTo({
          top: 0,
          left: 0,
          behavior : "instant",
        });    
      }
      x();
  
  }, []);

  


  return (
    <div className='Home'>
      


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


        {
          (!isFetchingUser && dataUserCurrent && !isFetchingAllNotifs) && 
          <HttpRequestStatus responseX={ResponseRequest} />
        }


          <Navbar socket={socket} isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
          <div className="home2">
            <div className="h1">
              <UtilsAndNavigations socket={socket} isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
            </div>
            <div className="h2">
              <div className="jackiChan">
                Notifications 
                
                <button
                  onClick={handleDeleteAllNotifs}
                  className={AllNotifications ? (AllNotifications.length !== 0 ? 'deleteAllNotif' : 'deleteAllNotif notAllowed') : "deleteAllNotif notAllowed"}  
                >
                  Delete All 
                </button>
              </div>
              {
                isFetchingAllNotifs ? <span className='sdjoqc'>Loading ...</span>
                :
                <>
                {
                  AllNotifications && 
                  <>
                  {
                    AllNotifications.length === 0  ? <span className='sdjoqc'>No notification yet...</span>
                    :
                    AllNotifications.map((notif, index)=>{
                      return(
                        <SingleNotification reRenderParentComponent={fetchUserNotifications} notif={notif} index={index} />
                      )
                    })
                  }
                  </>
                }
                </>
              }
            </div>
            <div className="h3">
              <Ads dataAds={dataAds} />
              <BirthDays setisBClicked={setisBClicked} setTheOnesWhoHaveBirthday={setTheOnesWhoHaveBirthday }  isFetchingUser={isFetchingUser}  dataUserCurrent={dataUserCurrent} />
              <Contacts   isFetchingUser={isFetchingUser} dataUserCurrent={dataUserCurrent} socket={socket}  />
            </div>
          </div>
       
    </div>
  )
}

export default Notifications