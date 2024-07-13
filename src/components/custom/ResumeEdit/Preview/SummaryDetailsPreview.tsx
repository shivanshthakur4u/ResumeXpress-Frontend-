import React from 'react'

function SummaryDetailsPreview({ resumeInfo }: { resumeInfo: any }) {
    return (
       <p className='text-xs'>
         {
            resumeInfo?.summary
         }
       </p>
    )
}

export default SummaryDetailsPreview