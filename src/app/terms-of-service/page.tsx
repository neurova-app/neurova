import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function TermsOfService() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Last Updated: April 1, 2025
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            1. Introduction
          </Typography>
          <Typography paragraph>
            Welcome to Neurova. These Terms of Service (&quot;Terms&quot;) govern your use of our website, products, and services (&quot;Services&quot;). 
            By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of the Terms, 
            you may not access the Services.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            2. Use of Services
          </Typography>
          <Typography paragraph>
            Our Services are intended for healthcare professionals and patients. You may use our Services only as permitted by law and 
            according to these Terms. You agree to use the Services only for their intended purpose.
          </Typography>
          <Typography paragraph>
            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. 
            You agree to accept responsibility for all activities that occur under your account.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            3. Medical Disclaimer
          </Typography>
          <Typography paragraph>
            The information provided by our Services is not intended to replace professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </Typography>
          <Typography paragraph>
            Never disregard professional medical advice or delay in seeking it because of something you have read on our platform.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            4. User Content
          </Typography>
          <Typography paragraph>
            Our Services may allow you to post, link, store, share and otherwise make available certain information, text, graphics, 
            videos, or other material (&quot;Content&quot;). You are responsible for the Content that you post on or through the Services, 
            including its legality, reliability, and appropriateness.
          </Typography>
          <Typography paragraph>
            By posting Content on or through the Services, you represent and warrant that: (i) the Content is yours and/or you have the right to use it 
            and the right to grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through the 
            Services does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            5. Intellectual Property
          </Typography>
          <Typography paragraph>
            The Services and their original content (excluding Content provided by users), features, and functionality are and will remain the 
            exclusive property of Neurova and its licensors. The Services are protected by copyright, trademark, and other laws of both the 
            United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without 
            the prior written consent of Neurova.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            6. Termination
          </Typography>
          <Typography paragraph>
            We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, 
            under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </Typography>
          <Typography paragraph>
            If you wish to terminate your account, you may simply discontinue using the Services or contact us to request account deletion.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            7. Limitation of Liability
          </Typography>
          <Typography paragraph>
            In no event shall Neurova, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, 
            incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
            intangible losses, resulting from (i) your access to or use of or inability to access or use the Services; (ii) any conduct or content 
            of any third party on the Services; (iii) any content obtained from the Services; and (iv) unauthorized access, use or alteration of 
            your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or 
            not we have been informed of the possibility of such damage.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            8. Disclaimer
          </Typography>
          <Typography paragraph>
            Your use of the Services is at your sole risk. The Services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Services are 
            provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of 
            merchantability, fitness for a particular purpose, non-infringement or course of performance.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            9. Governing Law
          </Typography>
          <Typography paragraph>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </Typography>
          <Typography paragraph>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these 
            Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            10. Changes to Terms
          </Typography>
          <Typography paragraph>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide 
            at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </Typography>
          <Typography paragraph>
            By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised terms. 
            If you do not agree to the new terms, you are no longer authorized to use the Services.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            11. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about these Terms, please contact us at:
          </Typography>
          <Typography paragraph>
            Email: legal@neurova.com<br />
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
