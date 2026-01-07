// import { Container, Typography, Box, Grid, Link as MuiLink } from "@mui/material"
// import { Link } from "react-router-dom"
// import theme from "../../css/theme"

// import InstagramIcon from '@mui/icons-material/Instagram';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import XIcon from '@mui/icons-material/X';
// import EmailIcon from '@mui/icons-material/Email';
// import PhoneIcon from '@mui/icons-material/Phone';

// import { IconButton } from '@mui/material'
// import "./FooterStyles.css"

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   const socialLinks = [
//     { icon: InstagramIcon, label: "instagram", url: "https://instagram.com" },
//     { icon: FacebookIcon, label: "facebook", url: "https://facebook.com" },
//     { icon: XIcon, label: "twitter", url: "https://x.com" },
//   ];

//   return (
//     <footer className="footer-wrapper">
//       <Container maxWidth="lg" className="footer-container">
//         <Grid container spacing={{ xs: 3, md: 4 }} className="footer-grid">
//           {/* Company Info */}
//           <Grid item xs={12} sm={6} md={3} className="footer-section">
//             <Typography variant="h6" className="footer-title" sx={{ color: theme.colors.color3, fontWeight: 'bold', marginBottom: 2 }}>
//               DSport
//             </Typography>
//             <Typography variant="body2" className="footer-text">
//               Your ultimate destination for sports coverage, predictions, and highlights.
//             </Typography>
//             <Box className="social-links" sx={{ marginTop: 2, display: 'flex', gap: 1 }}>
//               {socialLinks.map((social) => {
//                 const IconComponent = social.icon;
//                 return (
//                   <IconButton
//                     key={social.label}
//                     color="inherit"
//                     aria-label={social.label}
//                     href={social.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="social-icon"
//                     sx={{
//                       color: theme.colors.color3,
//                       transition: 'all 0.3s ease',
//                       '&:hover': {
//                         backgroundColor: theme.colors.color2,
//                         transform: 'translateY(-3px)',
//                       }
//                     }}
//                   >
//                     <IconComponent />
//                   </IconButton>
//                 );
//               })}
//             </Box>
//           </Grid>



//           {/* Contact Info */}
//           <Grid item xs={12} sm={6} md={3} className="footer-section">
//             <Typography variant="h6" className="footer-title" sx={{ color: theme.colors.color3, fontWeight: 'bold', marginBottom: 2 }}>
//               Contact Us
//             </Typography>
//             <Box className="contact-info">
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1.5 }}>
//                 <PhoneIcon sx={{ color: theme.colors.color3, fontSize: 20 }} />
//                 <Typography variant="body2" className="footer-text">
//                   767-614-0626
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <EmailIcon sx={{ color: theme.colors.color3, fontSize: 20 }} />
//                 <MuiLink 
//                   href="mailto:danieldanphil@gmail.com" 
//                   style={{ textDecoration: 'none', color: 'inherit' }}
//                   className="footer-link"
//                 >
//                   <Typography variant="body2">
//                     danieldanphil@gmail.com
//                   </Typography>
//                 </MuiLink>
//               </Box>
//             </Box>
//           </Grid>

//           {/* Developer Info */}
//           <Grid item xs={12} sm={6} md={3} className="footer-section">
//             <Typography variant="h6" className="footer-title" sx={{ color: theme.colors.color3, fontWeight: 'bold', marginBottom: 2 }}>
//               About
//             </Typography>
//             <Typography variant="body2" className="footer-text" sx={{ lineHeight: 1.8 }}>
//               Developed and maintained by{' '}
//               <Link to="/" style={{ textDecoration: 'none', color: theme.colors.color3, fontWeight: 'bold' }}>
//                 Danphil Daniel
//               </Link>
//               . Passionate about sports and technology.
//             </Typography>
//           </Grid>
//         </Grid>

//         {/* Divider */}
//         <Box className="footer-divider" sx={{ borderTop: `1px solid ${theme.colors.color4}`, margin: '2rem 0' }} />

//         {/* Bottom Footer */}
//         <Box className="footer-bottom" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
//           <Typography variant="body2" className="copyright-text">
//             © {currentYear} DSport. All rights reserved.
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-end' } }}>
//             <Typography 
//               variant="body2" 
//               component={Link} 
//               to="/" 
//               className="footer-link"
//               sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: theme.colors.color3 } }}
//             >
//               Privacy Policy
//             </Typography>
//             <Typography 
//               variant="body2" 
//               component={Link} 
//               to="/" 
//               className="footer-link"
//               sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: theme.colors.color3 } }}
//             >
//               Terms of Service
//             </Typography>
//           </Box>
//         </Box>
//       </Container>
//     </footer>
//   );
// };

// export default Footer;





import { Container, Typography, Box, Grid, Link as MuiLink, Paper } from "@mui/material"
import { Link } from "react-router-dom"
import theme from "../../css/theme"

import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

import { IconButton } from '@mui/material'
import "./FooterStyles.css"

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: InstagramIcon, label: "instagram", url: "https://instagram.com" },
    { icon: FacebookIcon, label: "facebook", url: "https://facebook.com" },
    { icon: XIcon, label: "twitter", url: "https://x.com" },
  ];

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Predictions", path: "/PredictionGame" },
    { label: "Fixtures", path: "/DFA/Fixtures" },
    { label: "Tables", path: "/DFA/Table" },
    { label: "Teams", path: "/DFA/Teams" },
  ];

  return (
    <footer className="footer-wrapper" style={{ background: `linear-gradient(180deg, ${theme.colors.color1} 0%, #000000 100%)` }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
          {/* Logo & Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{
                background: theme.colors.color2,
                borderRadius: '12px',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SportsSoccerIcon sx={{ color: theme.colors.color3, fontSize: 32 }} />
              </Box>
              <Typography variant="h4" sx={{
                color: theme.colors.color3,
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.colors.color3}, ${theme.colors.color2})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                DSport
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              lineHeight: 1.8,
              mb: 3,
              fontSize: '0.95rem'
            }}>
              Your ultimate destination for real-time sports coverage, expert predictions, and exclusive highlights from around the globe.
            </Typography>

            {/* Social Media */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <IconButton
                    key={social.label}
                    aria-label={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid rgba(${theme.colors.color3}, 0.2)`,
                      color: theme.colors.color3,
                      borderRadius: '10px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: theme.colors.color2,
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 20px rgba(${theme.colors.color3}, 0.3)`,
                      }
                    }}
                  >
                    <IconComponent fontSize="small" />
                  </IconButton>
                );
              })}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ 
              color: theme.colors.color3, 
              fontWeight: 600, 
              mb: 3,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 40,
                height: 3,
                background: theme.colors.color2,
                borderRadius: 2
              }
            }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {quickLinks.map((link) => (
                <MuiLink
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 0.5,
                    '&:hover': {
                      color: theme.colors.color3,
                      transform: 'translateX(8px)',
                      '&::before': {
                        content: '"→"',
                        opacity: 1
                      }
                    },
                    '&::before': {
                      content: '"→"',
                      opacity: 0,
                      transition: 'opacity 0.2s ease'
                    }
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={5}>
            <Typography variant="h6" sx={{ 
              color: theme.colors.color3, 
              fontWeight: 600, 
              mb: 3,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 40,
                height: 3,
                background: theme.colors.color2,
                borderRadius: 2
              }
            }}>
              Contact Us
            </Typography>
            
            <Paper elevation={0} sx={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 3,
              p: 3,
              border: `1px solid rgba(${theme.colors.color3}, 0.1)`,
              backdropFilter: 'blur(10px)'
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{
                    background: theme.colors.color2,
                    borderRadius: '8px',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PhoneIcon sx={{ color: theme.colors.color3, fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.color3, fontWeight: 500 }}>
                      767-614-0626
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{
                    background: theme.colors.color2,
                    borderRadius: '8px',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <EmailIcon sx={{ color: theme.colors.color3, fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                      Email
                    </Typography>
                    <MuiLink 
                      href="mailto:danieldanphil@gmail.com"
                      sx={{
                        color: theme.colors.color3,
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      danieldanphil@gmail.com
                    </MuiLink>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{
                    background: theme.colors.color2,
                    borderRadius: '8px',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <LocationOnIcon sx={{ color: theme.colors.color3, fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                      Developer
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Developed by{' '}
                      <MuiLink 
                        component={Link}
                        to="/"
                        sx={{
                          color: theme.colors.color3,
                          fontWeight: 600,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Danphil Daniel
                      </MuiLink>
                      {' '}— Passionate about sports and technology
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ 
          my: 4, 
          height: 1, 
          background: `linear-gradient(90deg, transparent, ${theme.colors.color4}, transparent)`,
          opacity: 0.3 
        }} />

        {/* Bottom Footer */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: 2,
          pt: 2 
        }}>
          <Typography variant="body2" sx={{ 
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.875rem'
          }}>
            © {currentYear} DSport. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MuiLink 
              component={Link}
              to="/privacy-policy"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                position: 'relative',
                '&:hover': {
                  color: theme.colors.color3,
                  '&::after': {
                    width: '100%'
                  }
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: 1,
                  background: theme.colors.color3,
                  transition: 'width 0.3s ease'
                }
              }}
            >
              Privacy Policy
            </MuiLink>
            
            <MuiLink 
              component={Link}
              to="/terms-of-service"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                position: 'relative',
                '&:hover': {
                  color: theme.colors.color3,
                  '&::after': {
                    width: '100%'
                  }
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: 1,
                  background: theme.colors.color3,
                  transition: 'width 0.3s ease'
                }
              }}
            >
              Terms of Service
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;