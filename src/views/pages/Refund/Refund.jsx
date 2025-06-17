import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import React from 'react'

export default function Refund() {
  return (
    <Grid sx={{ mt: 5, mb: 5 }} container justifyContent="center">
      <Grid size={{ xs: 12, md:10}}>
        <Typography variant="h1" align="center" gutterBottom sx={{ fontWeight: 600,mt:2 }}>
          Refund and Cancellation Policy
        </Typography>
        <Box sx={{ mt: 4, textAlign: 'left' }}>
          <Typography variant="h2" sx={{ fontWeight: 500, mt: 2 }}>
            SaaS Model - ATOM
          </Typography>
          <Typography  variant="h3" align="left" sx={{ fontWeight:400,fontStyle:'Inter', mt: 2}}>
  a. Subscription Fees: All subscription fees for the SaaS model are non-refundable once paid. 
  If you choose to cancel your subscription before the end of the billing cycle, 
  you will not receive a refund for any unused portion of the subscription.
</Typography>

            <Typography  variant="h3" align="left" sx={{ fontWeight:400,fontStyle:'Inter',mt: 1 }}>
            b . Termination of Service: You may cancel your subscription at any time, but no refunds will be provided for any remaining days or months in your billing cycle. Upon cancellation, access to the SaaS platform and its associated features will be terminated.
          </Typography>

          <Typography variant="h2" sx={{ fontWeight: 500, mt: 3 }}>
            Professional Services - PRISM
          </Typography>
          <Typography  variant="h3" align="left" sx={{ fontWeight:400,fontStyle:'Inter',mt: 2 }}>
            a.Service Fees: Any fees paid for professional services, such as consulting, implementation, or customization, are non-refundable once the services have been rendered.
          </Typography>
          <Typography  variant="h3" align="left" sx={{ fontWeight:400,fontStyle:'Inter',mt: 1 }}>
            b. Cancellation of Services: If you decide to cancel professional services before they are rendered, you may be eligible for a refund of a portion of the fees based on the stage of completion and expenses incurred up to the cancellation date. Any refunds will be determined on a case-by-case basis.
          </Typography>         
           <Typography  variant="h3" align="left" sx={{ fontWeight:400,fontStyle:'Inter',mt: 1 }}>
            c. Change or Modification of Services: If you request changes or modifications to the scope of professional services after the agreement has been signed, any additional fees incurred will be communicated to you, and you will have the option to proceed with the changes or cancel them. Fees already paid for services rendered will not be refunded.
          </Typography>

          <Typography variant="h2" sx={{ fontWeight: 500, mt: 3 }}>
            General
          </Typography>
          <Typography  variant="h3" align="left" sx={{ fontWeight:400,fontStyle:'Inter', mt: 2}}>
            a. Notice of Cancellation: To cancel your subscription or professional services, you must provide written notice to the company specifying your intent to cancel.
          </Typography>
          <Typography  variant="h3" align="left" sx={{ fontWeight:400,fontStyle:'Inter',mt: 1 }}>
            b. No Obligation for Refunds: The company reserves the right to determine eligibility for refunds or cancellations on a case-by-case basis. There is no obligation to provide refunds or cancellations unless explicitly stated in this policy or required by applicable laws or regulations.
          </Typography>
          <Typography  variant="h3" align="left" sx={{ fontWeight:400,fontStyle:'Inter',mt: 1 }}>
            c. Third-Party Fees: Any fees or charges imposed by third parties, such as payment processors or banks, for processing payments or refunds are your responsibility and will not be reimbursed by the company and if paid by the company it will not be refunded.
          </Typography>
          <Typography  variant="h3" align="left" sx={{ fontWeight:400,fontStyle:'Inter',mt: 1 }}>
            d. Changes to the Policy: The company reserves the right to modify or update this refund and cancellation policy at any time. Any changes will be effective upon posting the revised policy on the company's website.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}
