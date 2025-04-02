# Event-FeedBack Chatbot

A modern, interactive chatbot solution for collecting and analyzing event feedback in real-time.

## Overview

Event-FeedBack is a conversational AI system designed to transform how event organizers collect and analyze attendee feedback. Traditional feedback methods often suffer from low response rates and delayed submissions. This chatbot solution addresses these problems by creating an engaging, conversational experience that feels more like a dialogue than a survey.

## Key Features

- **Interactive Conversations**: Engage attendees with natural dialogue
- **Real-Time Feedback Collection**: Gather insights during the event
- **Adaptive Questioning**: Customize follow-up questions based on responses
- **Mixed Question Types**: Support for ratings, multiple-choice, open-ended, and binary questions
- **Input Validation**: Ensure response accuracy
- **Analytics Dashboard**: Visualize feedback with actionable insights
- **Multi-Channel Deployment**: Web, mobile, messaging platforms, and on-site kiosks

## Architecture

The system consists of five core components:
1. **User Interface**: Chat window accessible via multiple platforms
2. **Chatbot Engine**: Logic framework governing conversation flow
3. **Input Validation Module**: Ensures response accuracy
4. **Database**: Stores feedback and conversation data
5. **Analytics Interface**: Provides reporting and visualizations

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/Event-FeedBack.git

# Navigate to the project directory
cd Event-FeedBack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the development server
npm run dev
```

## Usage

1. **Configure Your Event**: Set up event details in the admin dashboard
2. **Customize Questions**: Define your feedback questions and conversation flow
3. **Deploy**: Make the chatbot available through your preferred channels
4. **Monitor**: View real-time feedback and analytics during your event
5. **Analyze**: Use the insights dashboard to review compiled feedback after the event

## Project Structure

```
Event-FeedBack/
├── app/                # Application source code
│   ├── api/            # API routes and controllers
│   ├── components/     # React components
│   ├── models/         # Data models
│   ├── pages/          # Application pages
│   ├── styles/         # CSS/SCSS files
│   └── utils/          # Utility functions
├── public/             # Static assets
├── docs/               # Documentation
├── tests/              # Test suite
└── README.md           # Project documentation
```

## Development Roadmap

- **Phase 1**: Core chatbot functionality and basic web interface
- **Phase 2**: Advanced NLP for better understanding of free-text responses
- **Phase 3**: Integration with popular event platforms
- **Phase 4**: Extended analytics and reporting features

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to all contributors
- Inspired by the need for better event feedback solutions