import React, {useState} from 'react'
import '../index.css';
import Camera from '../../Assets/v.png';
import Picture from '../../Assets/image.png';
import Feeling from '../../Assets/jack.png';

const CreatePost = ({isFetchingUser, dataUserCurrent}) => {
  
    const [isCreateClicked, setisCreateClicked] = useState(false);
  
  
  return (
    
    <div className="createPost"
        
        onClick={()=>{
          if(!isFetchingUser && dataUserCurrent){
            setisCreateClicked(true);
            }
          }}
        >
            <div className="cp1">
                <img src={dataUserCurrent && dataUserCurrent.profilePic} alt="" />
                <input type="text" placeholder={ !dataUserCurrent ? `What's on your mind...`:`What's on your mind ${dataUserCurrent.fullName} ? ...`} disabled />
            </div>
            <div className="cp2">
              <button>
                <img src={Camera} alt="" />
                Live video
              </button>
              <button>
                <img src={Picture} alt="" />
                Photo/Video
              </button>
              <button>
                <img src={Feeling} alt="" />
                 Feelings/activity
              </button>
            </div> 
    </div>
  )
}

export default CreatePost