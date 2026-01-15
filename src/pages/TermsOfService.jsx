import { Container, Typography, Box, Paper } from "@mui/material"
import { useEffect } from "react"
import theme from "../css/theme"
import "./PolicyPages.css"

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Box className="policy-page-wrapper">
      <Container maxWidth="md" className="policy-container">
        {/* Header */}
        <Box className="policy-header">
          <Typography variant="h3" className="policy-title">
            Terms of Service
          </Typography>
          <Typography variant="body2" className="policy-date">
            Last Updated: January {new Date().getFullYear()}
          </Typography>
        </Box>

        {/* Agreement */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Agreement to Terms
          </Typography>
          <Typography variant="body1" className="section-content">
            By accessing and using DSport's website, mobile application, and services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services. We reserve the right to update these Terms at any time.
          </Typography>
        </Paper>

        {/* Use License */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            License and Use Rights
          </Typography>
          <Typography variant="body1" className="section-content">
            We grant you a limited, non-exclusive, non-transferable license to access and use our Services for personal, non-commercial purposes. You may not:
          </Typography>
          <Box className="bullet-list">
            <Typography variant="body2">• Reproduce or copy any content without permission</Typography>
            <Typography variant="body2">• Reverse engineer or attempt to access source code</Typography>
            <Typography variant="body2">• Remove or alter any proprietary notices</Typography>
            <Typography variant="body2">• Use our Services for commercial purposes without authorization</Typography>
            <Typography variant="body2">• Engage in any activity that disrupts our Services</Typography>
            <Typography variant="body2">• Scrape or harvest data from our Services</Typography>
          </Box>
        </Paper>

        {/* User Accounts */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            User Accounts
          </Typography>
          <Typography variant="body1" className="section-content">
            If you create an account on our Services, you are responsible for:
          </Typography>
          <Box className="bullet-list">
            <Typography variant="body2">• Providing accurate and complete information</Typography>
            <Typography variant="body2">• Maintaining the confidentiality of your credentials</Typography>
            <Typography variant="body2">• Notifying us of unauthorized access</Typography>
            <Typography variant="body2">• All activities conducted under your account</Typography>
          </Box>
          <Typography variant="body1" className="section-content" sx={{ marginTop: 2 }}>
            We reserve the right to suspend or terminate accounts that violate these Terms.
          </Typography>
        </Paper>

        {/* Content Rights */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Intellectual Property Rights
          </Typography>
          <Typography variant="body1" className="section-content">
            All content on our Services, including text, graphics, logos, images, and software, is the property of DSport or its content providers and is protected by intellectual property laws. You may not use this content without our express written permission.
          </Typography>
          <Typography variant="body1" className="section-content" sx={{ marginTop: 2 }}>
            User-generated content remains your property, but by submitting it to our Services, you grant us a worldwide, royalty-free license to use, reproduce, and display such content.
          </Typography>
        </Paper>

        {/* User Content */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            User-Generated Content
          </Typography>
          <Typography variant="body1" className="section-content">
            You are responsible for any content you post on our Services. By posting content, you warrant that:
          </Typography>
          <Box className="bullet-list">
            <Typography variant="body2">• You own or have permission to use the content</Typography>
            <Typography variant="body2">• The content does not infringe on third-party rights</Typography>
            <Typography variant="body2">• The content is accurate and not misleading</Typography>
            <Typography variant="body2">• The content does not violate any laws or these Terms</Typography>
          </Box>
          <Typography variant="body1" className="section-content" sx={{ marginTop: 2 }}>
            We reserve the right to remove any content that violates these Terms or our policies.
          </Typography>
        </Paper>

        {/* Disclaimer of Warranties */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Disclaimer of Warranties
          </Typography>
          <Typography variant="body1" className="section-content">
            Our Services are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. We disclaim all express and implied warranties, including but not limited to:
          </Typography>
          <Box className="bullet-list">
            <Typography variant="body2">• Merchantability</Typography>
            <Typography variant="body2">• Fitness for a particular purpose</Typography>
            <Typography variant="body2">• Non-infringement</Typography>
            <Typography variant="body2">• Accuracy and reliability</Typography>
          </Box>
          <Typography variant="body1" className="section-content" sx={{ marginTop: 2 }}>
            We do not warrant that our Services will be uninterrupted or error-free.
          </Typography>
        </Paper>

        {/* Limitation of Liability */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Limitation of Liability
          </Typography>
          <Typography variant="body1" className="section-content">
            To the fullest extent permitted by law, DSport shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Services, even if we have been advised of the possibility of such damages.
          </Typography>
          <Typography variant="body1" className="section-content" sx={{ marginTop: 2 }}>
            Our total liability to you shall not exceed the amount paid by you for using our Services in the twelve months preceding the claim.
          </Typography>
        </Paper>

        {/* Indemnification */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Indemnification
          </Typography>
          <Typography variant="body1" className="section-content">
            You agree to indemnify and hold harmless DSport and its officers, directors, employees, and agents from any claims, damages, or costs arising from:
          </Typography>
          <Box className="bullet-list">
            <Typography variant="body2">• Your violation of these Terms</Typography>
            <Typography variant="body2">• Your use of our Services</Typography>
            <Typography variant="body2">• Your content or user-generated submissions</Typography>
            <Typography variant="body2">• Infringement of third-party rights</Typography>
          </Box>
        </Paper>

        {/* Prohibited Activities */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Prohibited Activities
          </Typography>
          <Typography variant="body1" className="section-content">
            You may not:
          </Typography>
          <Box className="bullet-list">
            <Typography variant="body2">• Engage in harassment, abuse, or threatening behavior</Typography>
            <Typography variant="body2">• Post illegal or defamatory content</Typography>
            <Typography variant="body2">• Attempt unauthorized access to our systems</Typography>
            <Typography variant="body2">• Interfere with others' use of our Services</Typography>
            <Typography variant="body2">• Engage in spam or unsolicited marketing</Typography>
            <Typography variant="body2">• Violate any applicable laws or regulations</Typography>
          </Box>
        </Paper>

        {/* Third-Party Links */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Third-Party Links and Content
          </Typography>
          <Typography variant="body1" className="section-content">
            Our Services may contain links to third-party websites and content. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party services is governed by their terms and policies. We recommend reviewing their policies before sharing personal information.
          </Typography>
        </Paper>

        {/* Termination */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Termination
          </Typography>
          <Typography variant="body1" className="section-content">
            We may terminate or suspend your access to our Services at any time, with or without cause, and with or without notice. Grounds for termination include, but are not limited to:
          </Typography>
          <Box className="bullet-list">
            <Typography variant="body2">• Violation of these Terms</Typography>
            <Typography variant="body2">• Illegal activity</Typography>
            <Typography variant="body2">• Fraud or misrepresentation</Typography>
            <Typography variant="body2">• Harassment of other users</Typography>
          </Box>
        </Paper>

        {/* Governing Law */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Governing Law and Dispute Resolution
          </Typography>
          <Typography variant="body1" className="section-content">
            These Terms are governed by and construed in accordance with the laws of the jurisdiction in which DSport operates, without regard to its conflict of law principles. Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with applicable laws.
          </Typography>
        </Paper>

        {/* Contact Us */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Contact Us
          </Typography>
          <Typography variant="body1" className="section-content">
            If you have questions about these Terms of Service, please contact us at:
          </Typography>
          <Box sx={{ marginTop: 2, padding: 2, backgroundColor: `rgba(${parseInt(theme.colors.primary.slice(1, 3), 16)}, ${parseInt(theme.colors.primary.slice(3, 5), 16)}, ${parseInt(theme.colors.primary.slice(5, 7), 16)}, 0.05)`, borderRadius: 1 }}>
            <Typography variant="body2"><strong>Email:</strong> danieldanphil@gmail.com</Typography>
            <Typography variant="body2"><strong>Phone:</strong> 767-614-0626</Typography>
          </Box>
        </Paper>

        {/* Entire Agreement */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Entire Agreement
          </Typography>
          <Typography variant="body1" className="section-content">
            These Terms, along with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and DSport regarding the use of our Services and supersede all prior agreements and understandings.
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default TermsOfService
