import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Last Updated: April 1, 2025
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            1. Introduction
          </Typography>
          <Typography paragraph>
            Welcome to Neurova. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            2. Data We Collect
          </Typography>
          <Typography paragraph>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Identity Data: includes first name, last name, username or similar identifier</li>
            <li>Contact Data: includes email address and telephone numbers</li>
            <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform</li>
            <li>Usage Data: includes information about how you use our website and services</li>
            <li>Health Data: includes medical records, patient information, and other health-related data you choose to share with our platform</li>
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            3. How We Use Your Data
          </Typography>
          <Typography paragraph>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            4. Data Security
          </Typography>
          <Typography paragraph>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, 
            or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those 
            employees, agents, contractors, and other third parties who have a business need to know.
          </Typography>
          <Typography paragraph>
            All health-related data is encrypted and stored in compliance with HIPAA regulations and other applicable healthcare privacy laws.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            5. Data Retention
          </Typography>
          <Typography paragraph>
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, 
            including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            6. Your Legal Rights
          </Typography>
          <Typography paragraph>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Request access to your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Request transfer of your personal data</li>
            <li>Right to withdraw consent</li>
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            7. Third-Party Links
          </Typography>
          <Typography paragraph>
            Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling 
            those connections may allow third parties to collect or share data about you. We do not control these third-party 
            websites and are not responsible for their privacy statements.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            8. Changes to This Privacy Policy
          </Typography>
          <Typography paragraph>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the &quot;Last Updated&quot; date at the top of this Privacy Policy.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3 }}>
            9. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography paragraph>
            Email: privacy@neurova.com<br />
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
