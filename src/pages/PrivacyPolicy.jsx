import { Container, Typography, Box, Paper } from "@mui/material"
import { useEffect } from "react"
import theme from "../css/theme"
import "./PolicyPages.css"

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Box className="policy-page-wrapper">
      <Container maxWidth="md" className="policy-container">
        {/* Header */}
        <Box className="policy-header">
          <Typography variant="h3" className="policy-title">
            Privacy Policy
          </Typography>
          <Typography variant="body2" className="policy-date">
            Last Updated: January {new Date().getFullYear()}
          </Typography>
        </Box>

        {/* Introduction */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Introduction
          </Typography>
          <Typography variant="body1" className="section-content">
            DSport ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise process personal information in connection with our website, mobile application, and related services (collectively, the "Services").
          </Typography>
        </Paper>

        {/* Information We Collect */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Information We Collect
          </Typography>

          <Box className="subsection">
            <Typography variant="h6" className="subsection-title">
              Personal Information You Provide
            </Typography>
            <Typography variant="body1" className="section-content">
              We collect personal information you provide directly, including:
            </Typography>
            <Box className="bullet-list">
              <Typography variant="body2">• Name and contact information (email, phone number)</Typography>
              <Typography variant="body2">• Account credentials and profile information</Typography>
              <Typography variant="body2">• Payment information when you make purchases</Typography>
              <Typography variant="body2">• Communication preferences and feedback</Typography>
              <Typography variant="body2">• Any other information you choose to provide</Typography>
            </Box>
          </Box>

          <Box className="subsection">
            <Typography variant="h6" className="subsection-title">
              Automatically Collected Information
            </Typography>
            <Typography variant="body1" className="section-content">
              When you access our Services, we automatically collect certain information, including:
            </Typography>
            <Box className="bullet-list">
              <Typography variant="body2">• Device information (type, operating system, browser)</Typography>
              <Typography variant="body2">• Usage data and analytics</Typography>
              <Typography variant="body2">• IP address and location information</Typography>
              <Typography variant="body2">• Cookies and similar tracking technologies</Typography>
              <Typography variant="body2">• Pages visited and time spent on our Services</Typography>
            </Box>
          </Box>
        </Paper>

        {/* How We Use Your Information */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            How We Use Your Information
          </Typography>
          <Typography variant="body1" className="section-content">
            We use the information we collect to:
          </Typography>
          <Box className="bullet-list">
            <Typography variant="body2">• Provide, maintain, and improve our Services</Typography>
            <Typography variant="body2">• Process transactions and send related information</Typography>
            <Typography variant="body2">• Send promotional communications and updates</Typography>
            <Typography variant="body2">• Personalize your experience</Typography>
            <Typography variant="body2">• Monitor and prevent fraud and illegal activity</Typography>
            <Typography variant="body2">• Comply with legal obligations</Typography>
            <Typography variant="body2">• Respond to your inquiries and requests</Typography>
          </Box>
        </Paper>

        {/* Information Sharing */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Information Sharing
          </Typography>
          <Typography variant="body1" className="section-content">
            We may share your information with third parties in the following circumstances:
          </Typography>
          <Box className="bullet-list">
            <Typography variant="body2">• Service providers who assist in operating our Services</Typography>
            <Typography variant="body2">• Business partners with your consent</Typography>
            <Typography variant="body2">• Legal compliance and law enforcement requests</Typography>
            <Typography variant="body2">• Protection of our rights and safety</Typography>
            <Typography variant="body2">• In case of merger, acquisition, or sale of assets</Typography>
          </Box>
          <Typography variant="body1" className="section-content" sx={{ marginTop: 2 }}>
            We do not sell, rent, or lease your personal information to third parties without your consent.
          </Typography>
        </Paper>

        {/* Data Security */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Data Security
          </Typography>
          <Typography variant="body1" className="section-content">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
          </Typography>
        </Paper>

        {/* Your Rights and Choices */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Your Rights and Choices
          </Typography>
          <Typography variant="body1" className="section-content">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </Typography>
          <Box className="bullet-list">
            <Typography variant="body2">• Access to your personal information</Typography>
            <Typography variant="body2">• Correction of inaccurate information</Typography>
            <Typography variant="body2">• Deletion of your information</Typography>
            <Typography variant="body2">• Opt-out of marketing communications</Typography>
            <Typography variant="body2">• Data portability</Typography>
          </Box>
          <Typography variant="body1" className="section-content" sx={{ marginTop: 2 }}>
            To exercise these rights, please contact us at the contact information provided below.
          </Typography>
        </Paper>

        {/* Cookies */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Cookies and Tracking Technologies
          </Typography>
          <Typography variant="body1" className="section-content">
            We use cookies and similar tracking technologies to enhance your experience on our Services. You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our Services.
          </Typography>
        </Paper>

        {/* Children's Privacy */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Children's Privacy
          </Typography>
          <Typography variant="body1" className="section-content">
            Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
          </Typography>
        </Paper>

        {/* Contact Us */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Contact Us
          </Typography>
          <Typography variant="body1" className="section-content">
            If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
          </Typography>
          <Box sx={{ marginTop: 2, padding: 2, backgroundColor: `rgba(${parseInt(theme.colors.primary.slice(1, 3), 16)}, ${parseInt(theme.colors.primary.slice(3, 5), 16)}, ${parseInt(theme.colors.primary.slice(5, 7), 16)}, 0.05)`, borderRadius: 1 }}>
            <Typography variant="body2"><strong>Email:</strong> danieldanphil@gmail.com</Typography>
            <Typography variant="body2"><strong>Phone:</strong> 767-614-0626</Typography>
          </Box>
        </Paper>

        {/* Changes to Policy */}
        <Paper elevation={0} className="policy-section">
          <Typography variant="h5" className="section-title">
            Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" className="section-content">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by updating the "Last Updated" date at the top of this policy. Your continued use of our Services constitutes your acceptance of the updated Privacy Policy.
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default PrivacyPolicy
