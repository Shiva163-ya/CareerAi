# CareerAi

An AI-powered career guidance and learning platform that helps students with:
- **Career Coaching**: Get personalized career advice based on your profile
- **Resume Analysis**: Upload your resume for AI-powered feedback and improvements
- **Coding Agent**: Get help with code analysis, debugging, and optimization
- **Mentor Support**: Interactive mentoring for Data Structures, Algorithms, and more
- **Course Generation**: Create personalized learning paths for any skill
- **Code Execution**: Run Python code safely in an isolated sandbox

## Features

### 🎯 Career Coach
- Profile-based career recommendations
- Suitable job roles identification
- Personalized learning roadmaps
- Interview preparation topics

### 📄 Resume Analyzer
- PDF resume analysis
- Skills identification
- ATS optimization tips
- Targeted role matching

### 💻 Coding Agent
- Code analysis and explanation
- Debugging assistance
- Performance optimization
- Language support: Python, JavaScript, TypeScript, Java, C, C++, SQL, HTML, CSS

### 👨‍🏫 AI Mentor
- Socratic tutoring approach
- Progressive hint levels
- Topic-based learning
- Skill tracking

### 🎓 Course Generator
- Personalized course creation
- Module-based learning paths
- Capstone projects
- Career path recommendations

## Tech Stack

- **Backend**: Flask
- **AI Model**: Google Gemini API
- **PDF Processing**: PyPDF
- **Deployment**: Render
- **Environment**: Python 3.11+

## Installation

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/Shiva163-ya/CareerAi.git
cd CareerAi
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r careerai/requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the `careerai/` directory:
```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

Get your free Gemini API key from: https://aistudio.google.com/app/apikey

5. Run the application:
```bash
cd careerai
python app.py
```

Visit `http://localhost:5000` in your browser.

## Deployment on Render

1. Push your code to GitHub
2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select the `CareerAi` repository
6. Configure:
   - **Name**: careerai
   - **Environment**: Python 3
   - **Build Command**: `pip install -r careerai/requirements.txt`
   - **Start Command**: `cd careerai && gunicorn app:app`
7. Add Environment Variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key
8. Click "Create Web Service"

Your app will be live at: `https://your-service-name.onrender.com`

## API Endpoints

### Career Analysis
- `POST /career` - Get personalized career guidance

### Resume Analysis
- `POST /resume` - Analyze resume PDF

### Coding Features
- `POST /code/analyze` - Analyze and review code
- `POST /code/generate` - Generate code solutions
- `POST /code/run` - Execute Python code

### Mentor Support
- `POST /mentor` - Get mentoring assistance

### Course Generation
- `POST /courses/generate` - Create personalized courses
- `GET /skills/search` - Search available skills

## Project Structure

```
CareerAi/
├── careerai/
│   ├── app.py              # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── data/               # JSON data storage
│   │   ├── users.json
│   │   ├── analysis.json
│   │   ├── mentor_events.json
│   │   ├── skills.json
│   │   ├── courses.json
│   │   └── code_events.json
│   ├── static/             # CSS, JS files
│   └── templates/          # HTML templates
├── render.yaml             # Render deployment config
└── README.md              # This file
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key (required) | `sk-...` |
| `GEMINI_MODEL` | Gemini model to use | `gemini-3.6-flash` |
| `FLASK_ENV` | Environment mode | `production` |

## Getting Your API Key

1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Add it to your environment variables

## Troubleshooting

### Website Not Loading
- Check that `index.html` exists in `templates/`
- Verify GEMINI_API_KEY is set in environment variables
- Check Render deployment logs

### AI Features Not Working
- Verify GEMINI_API_KEY is correct
- Check internet connectivity
- Review API usage limits

### Resume Upload Issues
- Ensure PDF is text-based (not scanned image)
- Keep file size under 5 MB
- Use PDF format only

## Future Enhancements

- [ ] User authentication system
- [ ] Progress tracking dashboard
- [ ] Peer collaboration features
- [ ] Video tutorials integration
- [ ] Live code collaboration
- [ ] Mobile app

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Live Demo**: (Coming soon - Deploy to Render)

**Created with ❤️ for students and career changers**
