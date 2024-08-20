# Exercise Bot

This project is a Google Apps Script-based LINE bot designed to help exercise groups record their workout check-in results. The bot logs data to a Google Sheet, automatically calculates the number of workout days and total minutes per week, and provides instant motivational messages.

## Features

- Record workout duration and activity type for group members.
- Automatically calculate weekly workout days and total minutes.
- Provide motivational messages based on performance.

## Installation and Setup

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

## Usage

- **Log Workouts**  
  Users can log their workouts by sending a message in the following format:
  ```
  +minutes
  #ActivityType
  ```
  Example:
  ```
  +30
  #MorningRun
  ```

- **View Statistics**  
  The bot will automatically calculate and send a summary of the user's weekly workout days and total minutes, along with a motivational message.

## Contribution Guidelines

We welcome contributions to this project. To contribute:

1. Fork the project.
2. Create a new branch (`git checkout -b feature-xxx`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature-xxx`).
5. Create a new Pull Request.

## License

This project is licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

## Contact

If you have any questions or suggestions, feel free to contact me:

- **Email**: yuping1624@gmail.com
- **Website**: [pingsnotes.github.io](https://pingsnotes.github.io)

## Changelog

- **2024-08-17**: Initial release
