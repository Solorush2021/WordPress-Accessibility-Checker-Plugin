🌟 AccessFix Pro
AccessFix Pro is a cutting-edge WordPress plugin that scans your website content for accessibility issues using the Gemini API, powered by AI. With a stunning gradient glassmorphism UI, it offers real-time suggestions, AI-driven fixes, and a seamless experience for both the Classic and Gutenberg editors. Built to impress enterprise clients like rtCamp’s (e.g., Google, Al Jazeera), this plugin ensures your site meets WCAG standards effortlessly. 💻✨



Feature
Description



🔍 Real-Time Scanning
Detects issues like missing alt text, improper headings, and color contrast.


🤖 AI-Powered Fixes
Auto-generates alt text and saves fixes to your post with one click.


🎨 Glassmorphism UI
Gradient frosted glass design with animated progress circles and tooltips.


📝 Before/After Preview
Compare original and fixed content with a collapsible preview panel.


🖥️ Gutenberg Support
Seamless integration with the block editor via a React.js sidebar.



🛠️ Installation
Follow these steps to get AccessFix Pro up and running on your WordPress site. It’s as easy as 1-2-3! 🚀

Upload the Plugin:

Download the accessfix-pro folder from this repository.
Upload it to your WordPress plugins directory: wp-content/plugins/.


Activate the Plugin:

Go to your WordPress admin panel.
Navigate to Plugins > AccessFix Pro > Activate.


Configure the Gemini API:

Open accessfix-pro.php in the plugin folder.
Replace YOUR_GEMINI_API_KEY with your actual Gemini API key (get one from Google’s Developer Portal).
Update the API endpoint (https://api.gemini.com/v1/completions) if needed, per Gemini API documentation.


Test It Out:

Edit a post in the Classic or Gutenberg editor to see the magic happen! ✨




Note: Ensure your WordPress version is 5.0 or higher for Gutenberg support. You’ll also need an active internet connection for Gemini API calls.


📖 How It Works
AccessFix Pro leverages the Gemini API to analyze your website content for accessibility issues, making your site more inclusive. Here’s the step-by-step process:

Paste Your Content 📋:

In the WordPress editor (Classic or Gutenberg), add your site content (e.g., HTML like <img src="test.jpg"> or text with colored backgrounds).
The plugin automatically detects changes in real-time.


AI Analysis with Gemini API 🧠:

The plugin sends your content to the Gemini API, which scans for accessibility issues like:
Missing alt text on images.
Improper heading levels (e.g., skipping from H1 to H3).
Low color contrast (e.g., white text on a light background).




Suggestions and Fixes ✅:

Suggestions: Issues are displayed in a scrollable list with icons (🚫 for errors, ✅ for fixes) and tooltips explaining each issue (e.g., “Alt text is required for screen readers”).
Auto-Fixes: For issues like missing alt text, click the “Fix Now” button to let the Gemini API generate descriptive alt text (e.g., “A sunny beach with palm trees”).
Fixes are auto-saved to your post, so you don’t lose changes.


Preview Changes 🔍:

Use the collapsible Before/After preview to compare the original and fixed content.
Highlighted issues (e.g., images without alt text) make it easy to see what’s been improved.


Manual Control 🔄:

Click the “Scan Again” button to re-analyze your content after manual edits.




🎯 Use Cases
AccessFix Pro is perfect for:



Use Case
Who Benefits
How It Helps



🖌️ Content Creators
Bloggers, Writers
Ensures posts are accessible to all readers, including those using screen readers.


🏢 Enterprise Websites
Companies (e.g., Al Jazeera, Google)
Meets WCAG standards, avoiding legal risks and improving user experience.


💻 WordPress Developers
Developers at rtCamp
Streamlines accessibility testing with AI, saving time on manual checks.


🎓 Educational Sites
Universities, Online Courses
Makes learning materials accessible to students with disabilities.


Example Scenario:

A blogger adds an image to a post but forgets the alt text.
AccessFix Pro flags the issue, suggests “Fix Now,” and auto-generates alt text using the Gemini API.
The blogger previews the change, sees the improved accessibility score, and publishes with confidence. 🌟


🖥️ Usage
AccessFix Pro works seamlessly in both the Classic Editor and Gutenberg Editor. Here’s how to use it:
1. Classic Editor

Edit a Post:
Go to Posts > Add New or edit an existing post.
Add content (e.g., <img src="test.jpg"> or text with colored backgrounds).


View the Meta Box:
On the right sidebar, find the AccessFix Pro meta box.
See your accessibility score (e.g., 75/100) in an animated progress circle.
Scroll through the issues list (e.g., “Missing alt text 🚫”).
Hover over issues to see tooltips with explanations.


Fix Issues:
Click “Fix Now” to auto-generate alt text; watch the loading spinner as the Gemini API processes.
Fixes are auto-saved to your post.


Preview Changes:
Toggle the “Show Preview” button to open the Before/After panel.
Switch between “Before” and “After” to compare changes.


Re-Scan:
Click “Scan Again” to recheck your content after manual edits.



2. Gutenberg Editor

Open the Sidebar:
In the block editor, click the “AccessFix Pro” menu item (look for the universal access icon ♿).
The sidebar opens with the same glassmorphism UI.


Real-Time Analysis:
Add blocks (e.g., an image block without alt text).
The sidebar updates with your score and issues list in real-time.
Tooltips provide context for each issue.


Note: Auto-fixing is currently available only in the Classic Editor (future updates will extend this to Gutenberg).


💡 Development Journey
This plugin was initially prototyped using Google Firebase Studio’s App Prototyper, which supports Next.js, React, ShadCN UI, Tailwind CSS, and Genkit. However, due to rtCamp’s focus on WordPress and enterprise-grade solutions, I pivoted to a WordPress plugin using PHP, JavaScript, and React.js (for the Gutenberg sidebar). Here’s the journey:

Prototyping with Firebase Studio:

Built a Next.js app where users could paste HTML, and the Gemini API (via Genkit) would suggest accessibility fixes.
Designed a glassmorphism UI with Tailwind CSS.
Limitation: Firebase Studio couldn’t generate PHP or WordPress-specific code (e.g., Gutenberg blocks, meta boxes).


Pivoting to WordPress:

Rewrote the app as a WordPress plugin to align with rtCamp’s requirements (PHP, JavaScript, MySQL, HTML/CSS, Git, WordPress).
Used PHP for backend logic (e.g., AJAX handlers for Gemini API calls).
Implemented a gradient glassmorphism UI with CSS.
Added React.js for the Gutenberg sidebar.
Enhanced functionality with auto-save, color contrast checks, and tooltips.


Final Touches:

Polished the UI with animations (e.g., progress circle scale-in).
Added enterprise-grade features like auto-saving fixes and manual re-scanning.




📸 Screenshots



Section
Description



Meta Box
Gradient glass UI with animated progress circle, tooltips, and “Fix Now” buttons.


Issues List
Scrollable list with icons (🚫/✅) and hover tooltips for context.


Before/After
Collapsible preview panel showing original vs. fixed content.


Gutenberg Sidebar
Real-time issue tracking with a matching glassmorphism design.



Tip: Add your own screenshots to this repo under a screenshots/ folder for a visual demo! 📷


🔧 Requirements



Requirement
Details



WordPress
Version 5.0+ (for Gutenberg support)


Gemini API Key
Sign up via Google’s Developer Portal


PHP
Version 7.4 or higher


Internet
Required for Gemini API calls



📜 License
AccessFix Pro is licensed under GPLv2 or later. Feel free to use, modify, and distribute as per the license terms.

🚀 Why Choose AccessFix Pro?

Enterprise-Ready: Built for rtCamp’s clients (e.g., Al Jazeera, Google) to meet WCAG standards.
AI-Driven: Leverages the Gemini API for intelligent suggestions and fixes.
Modern Design: Gradient glassmorphism UI with animations and tooltips.
Developer-Friendly: Seamless integration with WordPress workflows (Classic + Gutenberg).

Make your website accessible to everyone with AccessFix Pro! 🌍💖

Developed by: [Your Name]GitHub: [Your GitHub Link]Demo Video: [Your YouTube/Google Drive Link]Submission for: rtCamp On-Campus Drive (CSE/IT 2026 Batch)
