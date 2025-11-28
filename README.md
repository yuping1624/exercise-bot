# Exercise Bot

A Google Apps Script-based LINE bot designed to help exercise groups record their workout check-in results. The bot logs data to Google Sheets, automatically calculates weekly statistics, and provides personalized motivational messages based on performance.

## 🎯 Project Overview

This project demonstrates full-stack integration skills by combining:
- **LINE Messaging API** for real-time user interaction
- **Google Apps Script** for serverless backend processing
- **Google Sheets** as a lightweight database solution
- **Webhook architecture** for event-driven responses

The bot helps exercise groups maintain motivation through automated tracking and encouragement, making it perfect for fitness communities, running clubs, or any group activity tracking.

## ✨ Key Features

### Core Functionality
- **Workout Logging**: Users can log workouts with duration and activity type using simple text commands
- **Weekly Statistics**: Automatic calculation of weekly workout days and total minutes
- **Smart Goal Tracking**: 
  - **Basic Goal**: 3+ days and 60+ minutes per week
  - **Advanced Goal**: 6+ days and 120+ minutes per week
- **Personalized Motivation**: Dynamic reward messages based on achievement level
- **Group & Individual Support**: Works in both group chats and one-on-one conversations
- **Data Persistence**: All records stored in Google Sheets for easy analysis and visualization

### Technical Highlights
- **Event-driven Architecture**: Webhook-based design for real-time responses
- **Error Handling**: Graceful fallback for API failures (e.g., username retrieval)
- **Date Management**: Intelligent week calculation with timezone support (Asia/Taipei)
- **Data Deduplication**: Uses Set data structure to ensure accurate day counting
- **Message Parsing**: Flexible input format supporting multiple command patterns (`+minutes` or `++minutes`)

## 🛠️ Tech Stack

- **Backend**: Google Apps Script (JavaScript)
- **API Integration**: 
  - LINE Messaging API v2
  - Google Sheets API (via Apps Script)
- **Data Storage**: Google Sheets
- **Deployment**: Google Apps Script Web App
- **Architecture Pattern**: Serverless, Event-driven (Webhook)

## 📋 Project Structure

```
exercise-bot/
├── app_chinese.js      # Chinese version of the bot
├── app_eng.js          # English version of the bot
├── README.md           # Project documentation
└── LICENSE             # Apache 2.0 License
```

## 🏗️ Architecture & Workflow

### System Flow
1. **User Input**: User sends workout message in LINE chat
2. **Webhook Trigger**: LINE sends POST request to Apps Script Web App
3. **Message Parsing**: Bot extracts workout duration and activity type
4. **User Identification**: Fetches user profile from LINE API (supports both user and group contexts)
5. **Data Processing**: 
   - Calculates current week boundaries (Monday to Sunday)
   - Aggregates weekly statistics
   - Determines achievement level
6. **Data Storage**: Writes to Google Sheets (both detailed records and weekly summaries)
7. **Response**: Sends personalized motivational message back to user

### Key Technical Decisions

**Why Google Apps Script?**
- Zero infrastructure cost
- Built-in integration with Google Sheets
- Easy deployment and maintenance
- Perfect for lightweight automation tasks

**Why Google Sheets?**
- No database setup required
- Easy data visualization and analysis
- Collaborative access for group members
- Familiar interface for non-technical users

## 💡 Technical Challenges & Solutions

### Challenge 1: Accurate Weekly Calculation
**Problem**: Need to calculate week boundaries correctly regardless of current day  
**Solution**: Implemented date manipulation logic that handles edge cases (e.g., Sunday as day 0)

### Challenge 2: Duplicate Day Counting
**Problem**: Multiple workouts on the same day should count as one day  
**Solution**: Used JavaScript `Set` data structure to ensure unique date tracking

### Challenge 3: Dynamic Reward Messages
**Problem**: Provide varied, engaging messages without hardcoding  
**Solution**: Time-based randomization using modulo operation on seconds for pseudo-random selection

### Challenge 4: Group vs Individual Context
**Problem**: Different API endpoints for group and individual chats  
**Solution**: Implemented conditional logic based on `event_type` to route to correct LINE API endpoint

## 📦 Installation and Setup

1. **Create a Google Sheet**  
   - Create a new Google Sheet in your Google Drive.
   - Add two sheets within the document named `cumulation` and `record`.

2. **Configure Google Apps Script**  
   - Open the Google Sheet, then go to `Extensions` -> `Apps Script` to open the Apps Script editor.
   - Paste the provided code into the Apps Script editor.

3. **Set Up LINE Messaging API**  
   - Go to LINE Developers, create a new Channel, and obtain the Channel Access Token.
   - Replace `CHANNEL_ACCESS_TOKEN` in the script with your LINE Channel Access Token.

4. **Configure Webhook**  
   - Set the Webhook URL in the LINE Developers console to point to your Apps Script Web App URL.
   - Deploy the Apps Script as a Web App, choosing the appropriate access permissions.

## 🚀 Usage

### Logging Workouts

Users can log workouts using simple text commands:

**Basic Format:**
```
+minutes
#ActivityType
```

**Examples:**
```
+30
#MorningRun
```

```
+45
#Swimming
```

**View Weekly Statistics:**
Send `++` to get your weekly summary:
```
++
```

The bot will respond with:
- Total workout days this week
- Total minutes exercised
- Achievement status (if goals are met)
- Personalized motivational message

### Response Examples

**When Basic Goal is Met (3+ days, 60+ minutes):**
> "John this week achieved the goal, Great job!"

**When Advanced Goal is Met (6+ days, 120+ minutes):**
> "John this week exceeded the goal, Amazing! Five stars for you!"

**When Requesting Statistics:**
> "John exercised 5 days and 180 minutes this week"

## 🔧 Configuration Details

### Google Sheets Setup

The bot requires two sheets in your Google Spreadsheet:

1. **`record` sheet**: Stores individual workout records
   - Columns: Date, Member Name, Minutes, Timestamp, Activity Type

2. **`cumulation` sheet**: Stores weekly summaries
   - Columns: Week Start Date, Record Date, Member Name, Total Days, Total Minutes

### LINE Bot Configuration

1. Create a LINE Channel in [LINE Developers Console](https://developers.line.biz/)
2. Obtain your Channel Access Token
3. Set up Webhook URL pointing to your Apps Script Web App URL
4. Replace `YOUR_TOKEN` in the script with your actual token

### Apps Script Deployment

1. Deploy as Web App with:
   - Execute as: Me
   - Who has access: Anyone (for webhook to work)
2. Copy the Web App URL and configure it in LINE Developers Console

## 🎓 Learning Outcomes

This project demonstrates:
- **API Integration**: Working with REST APIs (LINE Messaging API)
- **Serverless Architecture**: Building applications without managing servers
- **Data Processing**: Date manipulation, aggregation, and calculation logic
- **Error Handling**: Graceful degradation when external APIs fail
- **User Experience Design**: Creating intuitive command interfaces
- **Code Organization**: Modular function design for maintainability

## 🔮 Future Improvements

Potential enhancements for this project:

- [ ] Add data visualization (charts/graphs) via Google Sheets
- [ ] Implement monthly/yearly statistics
- [ ] Add leaderboard functionality
- [ ] Support for multiple exercise groups
- [ ] Export data to CSV/JSON
- [ ] Add reminder notifications
- [ ] Implement streak tracking
- [ ] Add custom goal setting per user
- [ ] Migrate to Node.js backend for better scalability
- [ ] Add unit tests

## 🤝 Contribution Guidelines

We welcome contributions to this project! To contribute:

1. Fork the project
2. Create a new branch (`git checkout -b feature-xxx`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature-xxx`)
5. Create a new Pull Request

## 📝 Changelog

- **2024-08-17**: Initial release
  - Basic workout logging functionality
  - Weekly statistics calculation
  - Goal-based motivational messages
  - Support for both group and individual chats
  - Dual language support (Chinese/English)

## 📧 Contact

If you have any questions or suggestions, feel free to contact me:

- **Email**: yuping1624@gmail.com
- **Website**: [pingsnotes.github.io](https://pingsnotes.github.io)

## 📄 License

This project is licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).
