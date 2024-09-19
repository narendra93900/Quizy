import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {languages} from "../../utils/constants";
import SideBar from '../../components/SideBar';

const AdminDashboard = () => {
    const navigate = useNavigate()
    const [quizes,setQuizes]=useState([])
  
    useEffect(() => {
        fetchQuizs()
      
    }, [])
    const fetchQuizs = async (e) => {
       try {
       const response = await axios.get(`http://localhost:5000/quiz`)
        // console.log(response)
        setQuizes(response.data)
        const userName = await localStorage.getItem('username');
        setUsername(userName)
       
       } catch (error) {
        console.error(error);
       }
    }

  return (
    <div className="flex justify-between p-6 gap-8">
     
     <SideBar/>

      {/* Right Side */}

        {/* {quizes && quizes.length? <div className="flex-col flex-1 p-10">
          <h1 className='text-4xl font-bold'>All Quizzes</h1>
            <div className="w-full h-full grid gap-8 grid-flow-col auto-cols-max mt-12">

            {quizes.map((quiz)=> (
              <div key={quiz._id} className="h-fit mb-4 min-w-80 border-2 p-8 rounded-md shadow-lg cursor-pointer hover:shadow-2xl transition-all ease-in-out delay-150" onClick={()=> navigate(`/quizdetails/${quiz?.id}`)}>
                <h2 className='text-2xl font-bold mb-4'>{quiz.title}</h2>
                <p className='text-gray-400 mb-4'>Total Questions: {quiz.questions.length}</p>
                <button onClick={()=>navigate(`/quizdetails/${quiz.id}`)} className='mt-8 flex items-center justify-center gap-4 border-2 px-4 py-2 rounded-md text-white bg-indigo-500 shadow-indigo-500/50 hover:bg-white hover:text-indigo-500 hover:border-indigo-500 transition-all ease-in-out delay-150'>
                  <p>View Quiz </p> <IoIosArrowRoundForward size={32}/></button>
              </div>
            ))}
            </div>
        </div>
        : <div className='h-screen w-screen flex items-center justify-center'>
        <p>No Quizzes yet...</p>
        </div>} */}
        <div className="w-full">
        <h1 className='text-2xl font-bold'>All Lanuages</h1>
        <div className="w-full h-full grid gap-8 grid-cols-4  mt-12">
        {languages && languages.map((language)=> (
          <div key={language} onClick={()=> navigate(`/quizzes/${language.name}`)} className='flex-col gap-4 p-8 border-2 h-fit min-w-48 flex items-center justify-center text-white bg-indigo-500 shadow-lg rounded-md cursor-pointer transition-all ease-in-out delay-100 hover:bg-white hover:text-indigo-500 hover:border-indigo-500'>
            <language.icon size={48}/>
            <p>{language.name}</p>
          </div>
        ))}
        </div>
        </div>
      </div>
    
  );
};

export default AdminDashboard;
