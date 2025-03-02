const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Generate website
router.post('/generate', auth, async (req, res) => {
  try {
    console.log('Generating website with template');
    const { business } = req.body;
    
    if (!business) {
      return res.status(400).json({ 
        success: false, 
        message: 'Business data is required' 
      });
    }
    
    console.log('Business data received:', business.name);
    
    // Generate HTML, CSS, and JS using templates
    const html = generateHTML(business);
    const css = generateCSS(business);
    const js = generateJS();
    
    // Return the generated code
    return res.json({
      success: true,
      html,
      css,
      js
    });
    
  } catch (error) {
    console.error('Error generating website:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to generate website: ' + error.message
    });
  }
});

// Generate HTML template
function generateHTML(business) {
  // Get social media links
  const socialLinks = [];
  if (business.socialMedia) {
    if (business.socialMedia.facebook) socialLinks.push(`<a href="${business.socialMedia.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>`);
    if (business.socialMedia.instagram) socialLinks.push(`<a href="${business.socialMedia.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>`);
    if (business.socialMedia.twitter) socialLinks.push(`<a href="${business.socialMedia.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>`);
    if (business.socialMedia.linkedin) socialLinks.push(`<a href="${business.socialMedia.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>`);
  }
  
  // Get strengths if available
  let strengthsHTML = '';
  if (business.enhancedProfile && business.enhancedProfile.strengths && business.enhancedProfile.strengths.length > 0) {
    strengthsHTML = `
      <div class="strengths">
        <h3>Our Strengths</h3>
        <ul>
          ${business.enhancedProfile.strengths.map(strength => `<li>${strength}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Get target segments if available
  let segmentsHTML = '';
  if (business.enhancedProfile && business.enhancedProfile.targetSegments && business.enhancedProfile.targetSegments.length > 0) {
    segmentsHTML = `
      <div class="target-segments">
        <h3>Who We Serve</h3>
        <ul>
          ${business.enhancedProfile.targetSegments.map(segment => `<li>${segment}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Get marketing suggestions if available
  let marketingHTML = '';
  if (business.enhancedProfile && business.enhancedProfile.marketingSuggestions && business.enhancedProfile.marketingSuggestions.length > 0) {
    marketingHTML = `
      <section id="marketing" class="section">
        <div class="container">
          <h2>Our Marketing Approach</h2>
          <ul class="marketing-list">
            ${business.enhancedProfile.marketingSuggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
          </ul>
        </div>
      </section>
    `;
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${business.name} - ${business.category}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Header -->
  <header>
    <div class="container">
      <div class="logo">
        <h1>${business.name}</h1>
      </div>
      <nav>
        <div class="menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          ${marketingHTML ? '<li><a href="#marketing">Marketing</a></li>' : ''}
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section id="home" class="hero">
    <div class="container">
      <h2>Welcome to ${business.name}</h2>
      <p class="tagline">${business.category} - Serving you with excellence</p>
      <p class="hero-description">${business.description.split('.')[0]}.</p>
      <a href="#contact" class="btn">Contact Us</a>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="section">
    <div class="container">
      <h2>About Us</h2>
      <div class="about-content">
        <div class="about-text">
          <p>${business.description}</p>
          ${business.yearsInBusiness ? `<p><strong>Years in Business:</strong> ${business.yearsInBusiness}</p>` : ''}
          ${business.employeeCount ? `<p><strong>Team Size:</strong> ${business.employeeCount} employees</p>` : ''}
          ${business.targetAudience ? `<p><strong>Target Audience:</strong> ${business.targetAudience}</p>` : ''}
          ${segmentsHTML}
        </div>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section id="services" class="section">
    <div class="container">
      <h2>Our Services</h2>
      <div class="services-content">
        ${strengthsHTML}
        <div class="service-description">
          <p>At ${business.name}, we are committed to providing exceptional ${business.category} services tailored to your needs.</p>
        </div>
      </div>
    </div>
  </section>

  ${marketingHTML}

  <!-- Contact Section -->
  <section id="contact" class="section">
    <div class="container">
      <h2>Contact Us</h2>
      <div class="contact-content">
        <div class="contact-info">
          <p><strong>Location:</strong> ${business.location}</p>
          <p><strong>Phone:</strong> ${business.contactNumber}</p>
          ${business.website ? `<p><strong>Website:</strong> <a href="${business.website}" target="_blank">${business.website}</a></p>` : ''}
          ${business.email ? `<p><strong>Email:</strong> ${business.email}</p>` : ''}
        </div>
        <form id="contactForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn">Send Message</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${business.name}. All Rights Reserved.</p>
      ${socialLinks.length > 0 ? 
        `<div class="social-links">
          ${socialLinks.join('')}
        </div>` : ''
      }
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;
}

// Generate CSS template
function generateCSS(business) {
  // Define color scheme based on business category
  let primaryColor, secondaryColor, accentColor;
  
  switch(business.category.toLowerCase()) {
    case 'technology':
    case 'tech':
    case 'software':
    case 'it':
      primaryColor = '#0077cc';
      secondaryColor = '#f8f9fa';
      accentColor = '#00aaff';
      break;
    case 'food':
    case 'restaurant':
    case 'cafe':
    case 'catering':
      primaryColor = '#e74c3c';
      secondaryColor = '#f9f3e9';
      accentColor = '#f39c12';
      break;
    case 'health':
    case 'healthcare':
    case 'medical':
    case 'wellness':
      primaryColor = '#2ecc71';
      secondaryColor = '#f0f8f1';
      accentColor = '#3498db';
      break;
    case 'finance':
    case 'banking':
    case 'investment':
    case 'accounting':
      primaryColor = '#2c3e50';
      secondaryColor = '#f5f5f5';
      accentColor = '#3498db';
      break;
    case 'education':
    case 'school':
    case 'training':
    case 'learning':
      primaryColor = '#9b59b6';
      secondaryColor = '#f5f0f9';
      accentColor = '#3498db';
      break;
    case 'retail':
    case 'shop':
    case 'store':
    case 'ecommerce':
      primaryColor = '#e67e22';
      secondaryColor = '#fff9f4';
      accentColor = '#d35400';
      break;
    case 'construction':
    case 'building':
    case 'architecture':
    case 'engineering':
      primaryColor = '#f1c40f';
      secondaryColor = '#fffdf0';
      accentColor = '#e67e22';
      break;
    default:
      primaryColor = '#3498db';
      secondaryColor = '#f5f9fc';
      accentColor = '#2980b9';
  }
  
  return `/* General Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

a {
  text-decoration: none;
  color: ${primaryColor};
  transition: color 0.3s;
}

a:hover {
  color: ${accentColor};
}

ul {
  list-style: none;
}

.btn {
  display: inline-block;
  background-color: ${primaryColor};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 600;
  text-align: center;
}

.btn:hover {
  background-color: ${accentColor};
  color: white;
}

.section {
  padding: 80px 0;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
  color: ${primaryColor};
}

h3 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: ${primaryColor};
}

/* Header */
header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.logo h1 {
  font-size: 1.8rem;
  color: ${primaryColor};
}

nav ul {
  display: flex;
}

nav ul li {
  margin-left: 20px;
}

nav ul li a {
  color: #333;
  font-weight: 500;
  padding: 5px 0;
  position: relative;
}

nav ul li a:hover {
  color: ${primaryColor};
}

nav ul li a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: ${primaryColor};
  transition: width 0.3s;
}

nav ul li a:hover::after {
  width: 100%;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background-color: #333;
  margin-bottom: 5px;
  border-radius: 2px;
  transition: all 0.3s;
}

/* Hero Section */
.hero {
  background-color: ${secondaryColor};
  padding: 100px 0;
  text-align: center;
}

.hero h2 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: ${primaryColor};
}

.hero .tagline {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #666;
}

.hero-description {
  max-width: 800px;
  margin: 0 auto 30px;
  font-size: 1.2rem;
}

/* About Section */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.about-text p {
  margin-bottom: 15px;
}

.target-segments ul, .strengths ul {
  margin-top: 15px;
  padding-left: 20px;
}

.target-segments li, .strengths li {
  margin-bottom: 10px;
  position: relative;
  padding-left: 25px;
}

.target-segments li:before, .strengths li:before {
  content: '✓';
  color: ${primaryColor};
  position: absolute;
  left: 0;
  font-weight: bold;
}

/* Services Section */
.services-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.service-description {
  text-align: center;
  margin-top: 20px;
}

/* Marketing Section */
.marketing-list {
  margin-top: 20px;
  padding-left: 20px;
}

.marketing-list li {
  margin-bottom: 15px;
  position: relative;
  padding-left: 25px;
}

.marketing-list li:before {
  content: '→';
  color: ${primaryColor};
  position: absolute;
  left: 0;
  font-weight: bold;
}

/* Contact Section */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
}

.contact-info {
  margin-bottom: 30px;
}

.contact-info p {
  margin-bottom: 15px;
}

form {
  max-width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: ${primaryColor};
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

/* Footer */
footer {
  background-color: #333;
  color: white;
  padding: 30px 0;
  text-align: center;
}

.social-links {
  margin-top: 20px;
}

.social-links a {
  color: white;
  margin: 0 10px;
  font-size: 1.5rem;
  transition: color 0.3s;
}

.social-links a:hover {
  color: ${accentColor};
}

/* Responsive Design */
@media (max-width: 768px) {
  header .container {
    flex-direction: column;
    text-align: center;
  }
  
  .menu-toggle {
    display: flex;
    position: absolute;
    top: 20px;
    right: 20px;
  }
  
  nav ul {
    display: none;
    flex-direction: column;
    width: 100%;
    text-align: center;
    margin-top: 20px;
  }
  
  nav ul.active {
    display: flex;
  }
  
  nav ul li {
    margin: 10px 0;
  }
  
  .hero {
    padding: 60px 0;
  }
  
  .hero h2 {
    font-size: 2.5rem;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
  }
  
  .section {
    padding: 60px 0;
  }
}`;
}

// Generate JS template
function generateJS() {
  return `// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      // Animate the hamburger icon
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('active'));
    });
  }
  
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.remove('active'));
      }
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Contact form validation
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Simple validation
      if (name === '') {
        alert('Please enter your name');
        return;
      }
      
      if (email === '') {
        alert('Please enter your email');
        return;
      }
      
      if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
      }
      
      if (message === '') {
        alert('Please enter your message');
        return;
      }
      
      // In a real website, you would send this data to a server
      // For this demo, we'll just show an alert
      alert('Thank you for your message, ' + name + '! We will get back to you soon.');
      
      // Reset the form
      contactForm.reset();
    });
  }
  
  // Helper function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Add animation to elements when they come into view
  const sections = document.querySelectorAll('section');
  
  // Create an Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // Observe each section
  sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
  });
  
  // Add visible class to make sections appear
  document.querySelector('.hero').classList.add('visible');
  
  // Add CSS for visible class
  const style = document.createElement('style');
  style.textContent = \`
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    
    .menu-toggle span.active:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .menu-toggle span.active:nth-child(2) {
      opacity: 0;
    }
    
    .menu-toggle span.active:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  \`;
  document.head.appendChild(style);
});`;
}

module.exports = router;