import React from 'react'
import RecruiterLayout from '../../../Layouts/RecruiterLayout'
import MultiStepForm from '../../onboarding/recruiter/about-yourself/page'
import { useNavigate } from 'react-router-dom'
const CompanyProfile:React.FC =()=>  {
  const navigate = useNavigate()
  return (
<RecruiterLayout>
    <div className="max-w-6xl mx-auto px-6">
            <MultiStepForm onSuccess={()=>{
              navigate("/dashboard/recruiter");
            }} from="updateRecruiter"/>
          </div>
   </RecruiterLayout>
  )
}

export default CompanyProfile