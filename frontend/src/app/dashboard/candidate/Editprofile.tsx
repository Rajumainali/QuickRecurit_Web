import React from 'react'
import CandidateLayout from '../../../Layouts/CandidateLayout'
import MultiStepForm from '../../onboarding/candidate/about-yourself/page'
import { useNavigate } from 'react-router-dom'
const Editprofile:React.FC =()=>  {
  const navigate = useNavigate();
  return (
   <CandidateLayout>

    <div className="max-w-6xl mx-auto px-6">
            <MultiStepForm onSuccess={()=>{
              navigate("/dashboard/candidate");
            }} from="updateCandidate"/>
          </div>
   </CandidateLayout>
  )
}

export default Editprofile
